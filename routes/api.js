// routes/api.js
//
// Session disimpan in-memory (single object, bukan per-user) — cukup buat
// dev/local karena ClipForge saat ini masih single-user tool. Kalau nanti
// mau multi-user beneran, ini yang pertama perlu diganti jadi per-session-id
// (misal pakai cookie/JWT) + storage yang persist (DB/Redis).

const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { Readable, Transform } = require("stream");
const { pipeline } = require("stream/promises");
const gemini = require("../services/gemini");
const mock = require("../data/mockData");

const router = express.Router();

const USE_MOCK = !process.env.GEMINI_API_KEY;
const MAX_BYTES = 500 * 1024 * 1024; // 500MB, sama seperti limit upload file
const ALLOWED_EXT = [".mp4", ".mov", ".webm"];
const MIME_BY_EXT = { ".mp4": "video/mp4", ".mov": "video/quicktime", ".webm": "video/webm" };
const YOUTUBE_RE = /^https?:\/\/(www\.)?(youtube\.com\/(watch\?v=|shorts\/)|youtu\.be\/)/i;

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "..", "uploads")),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_BYTES },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ALLOWED_EXT.includes(ext)) cb(null, true);
    else cb(new Error("Format tidak didukung. Gunakan MP4, MOV, atau WebM."));
  },
});

// Session tunggal, di-reset tiap kali ada video baru (upload file / link).
let session = null;

function freshSession(partial) {
  session = {
    sourceType: "file", // "file" | "url" | "youtube"
    videoPath: null,
    mimeType: null,
    youtubeUrl: null,
    geminiFile: null, // cache {uri, mimeType} setelah di-upload ke Gemini Files API
    rules: null,
    notes: null,
    candidates: [],
    blueprints: {},
    ...partial,
  };
  return session;
}

// Menyatukan 3 kemungkinan sumber video (file lokal / hasil download dari
// link / link YouTube) jadi satu bentuk {uri, mimeType} yang dipahami Gemini.
// YouTube nggak perlu di-upload sama sekali — Gemini bisa baca link-nya langsung.
async function ensureGeminiFile() {
  if (session.sourceType === "youtube") {
    return { uri: session.youtubeUrl, mimeType: "video/*" };
  }
  if (!session.geminiFile) {
    session.geminiFile = await gemini.uploadVideoToGemini(session.videoPath, session.mimeType);
  }
  return session.geminiFile;
}

function extFromUrl(urlStr) {
  try {
    const ext = path.extname(new URL(urlStr).pathname).toLowerCase();
    return ALLOWED_EXT.includes(ext) ? ext : null;
  } catch {
    return null;
  }
}

// Download video dari link langsung (bukan YouTube) ke folder uploads/,
// dengan batas ukuran yang sama seperti upload file biasa.
async function downloadVideoFromUrl(urlStr) {
  let response;
  try {
    response = await fetch(urlStr);
  } catch {
    throw new Error("Nggak bisa akses link itu. Cek lagi link-nya, atau coba upload file langsung.");
  }
  if (!response.ok) {
    throw new Error(`Link itu balikin error (HTTP ${response.status}).`);
  }

  const contentType = (response.headers.get("content-type") || "").split(";")[0].trim().toLowerCase();
  const contentLength = Number(response.headers.get("content-length") || 0);
  if (contentLength && contentLength > MAX_BYTES) {
    throw new Error("Video di link itu kegedean (maks 500MB).");
  }

  const extFromUrlPath = extFromUrl(urlStr);
  const knownMime = Object.values(MIME_BY_EXT).includes(contentType);
  if (!contentType.startsWith("video/") && !knownMime && !extFromUrlPath) {
    throw new Error("Link itu kelihatannya bukan file video langsung (.mp4/.mov/.webm). Pastikan link mengarah langsung ke file videonya.");
  }

  const ext = extFromUrlPath || (contentType === "video/quicktime" ? ".mov" : contentType === "video/webm" ? ".webm" : ".mp4");
  const mimeType = MIME_BY_EXT[ext];
  const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
  const destPath = path.join(__dirname, "..", "uploads", filename);

  let bytesWritten = 0;
  const sizeGuard = new Transform({
    transform(chunk, enc, cb) {
      bytesWritten += chunk.length;
      if (bytesWritten > MAX_BYTES) {
        cb(new Error("Video di link itu kegedean (maks 500MB)."));
        return;
      }
      cb(null, chunk);
    },
  });

  try {
    await pipeline(Readable.fromWeb(response.body), sizeGuard, fs.createWriteStream(destPath));
  } catch (err) {
    fs.promises.unlink(destPath).catch(() => {});
    throw err;
  }

  return { filePath: destPath, filename, mimeType, size_bytes: bytesWritten };
}

// GET /api/status — dipakai frontend buat nampilin banner "mode demo" kalau
// GEMINI_API_KEY belum di-set.
router.get("/status", (req, res) => {
  res.json({ mock: USE_MOCK, model: process.env.GEMINI_MODEL || "gemini-3.7-flash" });
});

// POST /api/upload — terima file video (drag & drop / file picker), mulai sesi baru.
router.post("/upload", upload.single("video"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Tidak ada file video yang diterima." });
  }

  freshSession({
    sourceType: "file",
    videoPath: req.file.path,
    mimeType: req.file.mimetype,
  });

  res.json({
    sourceType: "file",
    filename: req.file.filename,
    original_name: req.file.originalname,
    size_bytes: req.file.size,
    // Durasi asli butuh ffprobe/media metadata lib — sengaja di-mock dulu.
    duration_seconds: 5072, // ~01:24:32, contoh dari PRD
  });
});

// POST /api/upload-url — terima link video (YouTube atau link file langsung),
// mulai sesi baru. YouTube: langsung dipakai link-nya, nggak perlu didownload.
// Link file langsung: didownload dulu ke uploads/, lalu diperlakukan sama
// seperti video yang di-upload manual.
router.post("/upload-url", async (req, res) => {
  const { url } = req.body || {};
  if (!url || typeof url !== "string" || !/^https?:\/\//i.test(url.trim())) {
    return res.status(400).json({ error: "Link video nggak valid. Harus diawali http:// atau https://." });
  }
  const trimmed = url.trim();

  if (YOUTUBE_RE.test(trimmed)) {
    freshSession({ sourceType: "youtube", youtubeUrl: trimmed, mimeType: "video/*" });
    return res.json({ sourceType: "youtube", original_name: trimmed, duration_seconds: null });
  }

  try {
    const downloaded = await downloadVideoFromUrl(trimmed);
    freshSession({
      sourceType: "url",
      videoPath: downloaded.filePath,
      mimeType: downloaded.mimeType,
    });

    let niceName = downloaded.filename;
    try {
      niceName = path.basename(new URL(trimmed).pathname) || downloaded.filename;
    } catch {
      // pakai fallback di atas
    }

    res.json({
      sourceType: "url",
      filename: downloaded.filename,
      original_name: niceName,
      size_bytes: downloaded.size_bytes,
      duration_seconds: 5072, // sama seperti upload file, masih mock
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message || "Gagal ambil video dari link itu." });
  }
});

// POST /api/generate — terima Clip Rules + Video Notes, balikin kandidat klip
// hasil AI beneran (atau mock kalau GEMINI_API_KEY belum di-set).
router.post("/generate", async (req, res) => {
  if (!session) {
    return res.status(400).json({ error: "Belum ada video. Upload file atau kasih link dulu ya." });
  }

  const { platform, duration, contentRules, creativeDirection } = req.body || {};
  session.rules = { platform, duration, contentRules };
  session.notes = { creativeDirection };

  try {
    let candidatesRaw;

    if (USE_MOCK) {
      candidatesRaw = await mock.generateCandidatesMock();
      // Data mock sudah punya id sendiri ("clip-1" dst) — pakai apa adanya.
      session.candidates = candidatesRaw;
    } else {
      const file = await ensureGeminiFile();
      candidatesRaw = await gemini.generateCandidates({
        fileUri: file.uri,
        mimeType: file.mimeType,
        platform,
        duration,
        contentRules,
        creativeDirection,
      });
      // Gemini nggak ngasih id — kita yang assign biar konsisten dipakai di URL/state.
      session.candidates = candidatesRaw.map((c, i) => ({ id: `clip-${i + 1}`, ...c }));
    }

    session.blueprints = {}; // reset, karena rules/notes baru bisa ubah hasil

    res.json({ candidates: session.candidates, mock: USE_MOCK });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "AI gagal menganalisis video. Coba lagi." });
  }
});

// GET /api/blueprint/:id — ambil blueprint detail untuk satu clip (di-cache di session).
router.get("/blueprint/:id", async (req, res) => {
  if (!session) {
    return res.status(400).json({ error: "Belum ada video yang aktif." });
  }

  const { id } = req.params;
  const candidate = session.candidates.find((c) => c.id === id);
  if (!candidate) {
    return res.status(404).json({ error: "Candidate clip tidak ditemukan. Coba generate ulang." });
  }

  if (session.blueprints[id]) {
    return res.json(session.blueprints[id]);
  }

  try {
    let blueprint;
    if (USE_MOCK) {
      blueprint = await mock.generateBlueprintMock(candidate);
    } else {
      const file = await ensureGeminiFile();
      blueprint = await gemini.generateBlueprint({
        fileUri: file.uri,
        mimeType: file.mimeType,
        candidate,
        platform: session.rules?.platform,
        duration: session.rules?.duration,
        contentRules: session.rules?.contentRules,
        creativeDirection: session.notes?.creativeDirection,
      });
    }
    blueprint.id = id; // pastikan id selalu konsisten, terlepas dari sumbernya
    session.blueprints[id] = blueprint;
    res.json(blueprint);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "AI gagal bikin blueprint. Coba lagi." });
  }
});

// POST /api/chat — AI Interaction (PRD bagian 28): user kasih feedback singkat
// terhadap satu blueprint, AI membalas dan (kalau bukan mock) beneran
// meng-update blueprint-nya.
router.post("/chat", async (req, res) => {
  if (!session) {
    return res.status(400).json({ error: "Belum ada video yang aktif." });
  }

  const { message, clipId } = req.body || {};
  if (!message) return res.status(400).json({ error: "Pesan kosong." });
  if (!clipId || !session.blueprints[clipId]) {
    return res.status(400).json({ error: "Buka blueprint-nya dulu sebelum ngobrol sama AI." });
  }

  try {
    let result;
    if (USE_MOCK) {
      result = await mock.reviseBlueprintMock(session.blueprints[clipId], message);
    } else {
      const file = await ensureGeminiFile();
      result = await gemini.reviseBlueprint({
        fileUri: file.uri,
        mimeType: file.mimeType,
        currentBlueprint: session.blueprints[clipId],
        message,
      });
    }
    result.blueprint.id = clipId;
    session.blueprints[clipId] = result.blueprint;
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "AI gagal merespons. Coba lagi." });
  }
});

module.exports = router;
