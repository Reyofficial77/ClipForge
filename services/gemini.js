// services/gemini.js
//
// Semua pemanggilan Gemini API dipusatkan di sini. Menggunakan Files API untuk
// upload video (Gemini bisa langsung "nonton" video, jadi tidak perlu extract
// audio / transcription terpisah), lalu generateContent dengan responseSchema
// supaya outputnya selalu JSON terstruktur — bentuknya sengaja dibuat identik
// dengan AI Output Schema di PRD (bagian 36).

const { GoogleGenAI, createUserContent, createPartFromUri } = require("@google/genai");

const MODEL = process.env.GEMINI_MODEL || "gemini-3.7-flash";

function getClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY belum di-set. Isi dulu di file .env (lihat .env.example).");
  }
  return new GoogleGenAI({ apiKey });
}

const PERSONA = `
Kamu adalah AI Creative Director di aplikasi ClipForge — sobat editor content creator yang paham banget algoritma short-form video (TikTok/Reels/Shorts).
Gaya bahasa: santai, gaul, campuran Indonesia-Inggris, boleh pakai emoji (😂💀🔥🚨👀).
TAPI instruksi editing tetap harus konkret dan actionable: selalu pakai timestamp, sebutkan angka pasti (misal "speed up ke 1.2x", "zoom 110%"), dan hindari istilah teknis tanpa penjelasan.
Contoh gaya kalimat: "😂 BRO WE FOUND IT. 00:42:13 punya meme potential yang gila." atau "🚨 HOOK ALERT. Pakai ini sebagai opening."
Jangan pernah keluar dari format JSON yang diminta — jangan tambahkan teks lain di luar JSON.
`.trim();

// ---------- Error handling ----------
//
// SDK Gemini biasanya nge-throw error yang isinya JSON mentah dari Google
// (misal 403 PERMISSION_DENIED, 429 RESOURCE_EXHAUSTED, dll). Kita terjemahin
// ke pesan yang lebih jelas buat ditampilkan di UI, tapi pesan asli tetap
// di-log ke console server biar gampang di-debug.
function friendlyGeminiError(err) {
  const raw = err?.message || String(err);

  if (raw.includes("PERMISSION_DENIED") || raw.includes('"code":403')) {
    return new Error(
      "Google nolak akses API key ini (403 PERMISSION_DENIED). Ini BUKAN error dari kode ClipForge — " +
        "biasanya karena project Google Cloud/AI Studio kamu lagi di-restrict Google, API-nya belum di-enable, " +
        "atau billing belum di-set. Cek project-nya di aistudio.google.com/apikey, atau coba bikin API key baru dari project yang fresh. " +
        "Kalau masih gagal, ini masalah dari sisi Google — banyak orang lain juga lagi ngalamin ini, coba lapor ke discuss.ai.google.dev."
    );
  }
  if (raw.includes("RESOURCE_EXHAUSTED") || raw.includes('"code":429')) {
    return new Error("Kena rate limit / quota Gemini API abis (429). Tunggu sebentar terus coba lagi, atau cek quota di Google Cloud Console.");
  }
  if (raw.includes("API_KEY_INVALID") || raw.includes('"code":400')) {
    return new Error("API key kelihatannya nggak valid. Cek lagi GEMINI_API_KEY di file .env, jangan sampai ada spasi/karakter nyasar.");
  }
  if (raw.includes("NOT_FOUND") && raw.includes("model")) {
    return new Error(`Model "${MODEL}" nggak ditemukan/nggak bisa diakses API key ini. Coba ganti GEMINI_MODEL di .env ke model lain, misal gemini-2.5-flash.`);
  }

  return err instanceof Error ? err : new Error(raw);
}

async function callGemini(fn) {
  try {
    return await fn();
  } catch (err) {
    console.error("[Gemini API error]", err?.message || err);
    throw friendlyGeminiError(err);
  }
}

// ---------- Upload ----------

async function uploadVideoToGemini(filePath, mimeType) {
  return callGemini(async () => {
    const ai = getClient();
    const uploaded = await ai.files.upload({ file: filePath, config: { mimeType } });

    let file = await ai.files.get({ name: uploaded.name });
    while (file.state === "PROCESSING") {
      await new Promise((resolve) => setTimeout(resolve, 4000));
      file = await ai.files.get({ name: uploaded.name });
    }
    if (file.state === "FAILED") {
      throw new Error("Gemini gagal memproses video ini. Coba video lain, atau pastikan formatnya MP4/MOV/WebM.");
    }

    return { uri: file.uri, mimeType: file.mimeType, name: file.name };
  });
}

// ---------- Schemas (dipakai berulang di beberapa call) ----------

const candidateItemSchema = {
  type: "OBJECT",
  properties: {
    title: { type: "STRING", description: "Judul catchy buat clip ini" },
    start_time: { type: "STRING", description: "Format HH:MM:SS, relatif ke video asli" },
    end_time: { type: "STRING", description: "Format HH:MM:SS, relatif ke video asli" },
    duration: { type: "INTEGER", description: "Estimasi durasi clip dalam detik" },
    viral_score: { type: "INTEGER", description: "Skor 0-100" },
    reasons: { type: "ARRAY", items: { type: "STRING" }, description: "3-4 alasan singkat kenapa momen ini bagus" },
    persona_line: { type: "STRING", description: "Satu kalimat gaya persona AI editor gaul buat momen ini" },
  },
  required: ["title", "start_time", "end_time", "duration", "viral_score", "reasons", "persona_line"],
};

const blueprintSchema = {
  type: "OBJECT",
  properties: {
    title: { type: "STRING" },
    start_time: { type: "STRING" },
    end_time: { type: "STRING" },
    duration: { type: "INTEGER" },
    viral_score: { type: "INTEGER" },
    hook: {
      type: "OBJECT",
      properties: {
        text: { type: "STRING", description: "Kalimat pembuka yang direkomendasikan" },
        start: { type: "STRING", description: "MM:SS relatif ke clip" },
        end: { type: "STRING", description: "MM:SS relatif ke clip" },
        instruction: { type: "STRING", description: "Instruksi editing konkret buat 2 detik pembuka" },
      },
      required: ["text", "start", "end", "instruction"],
    },
    script: {
      type: "OBJECT",
      properties: {
        hook: { type: "STRING" },
        caption: { type: "STRING" },
        cta: { type: "STRING" },
      },
      required: ["hook", "caption", "cta"],
    },
    timeline: {
      type: "ARRAY",
      description: "Breakdown per segmen waktu, MULAI dari 00:00 relatif ke clip (bukan video asli) sampai akhir durasi clip, cover seluruh durasi",
      items: {
        type: "OBJECT",
        properties: {
          start: { type: "STRING", description: "MM:SS relatif ke clip" },
          end: { type: "STRING", description: "MM:SS relatif ke clip" },
          video: { type: "STRING", description: "Apa yang tampil: Speaker / Reaction / dsb" },
          subtitle: { type: "STRING" },
          effect: { type: "STRING", description: "Zoom/shake/freeze frame/normal/dsb" },
          audio: { type: "STRING", description: "SFX/musik/impact/vine boom/dsb, atau '—'" },
          asset: { type: "STRING", description: "Meme/reaction/dsb yang dibutuhkan, atau '—'" },
        },
        required: ["start", "end", "video", "subtitle", "effect", "audio", "asset"],
      },
    },
    memes: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          timestamp: { type: "STRING", description: "MM:SS–MM:SS relatif ke clip" },
          recommendation: { type: "STRING" },
          purpose: { type: "STRING" },
          suggested_visual: { type: "STRING" },
          animation: { type: "STRING" },
          alternatives: { type: "ARRAY", items: { type: "STRING" }, description: "2-3 alternatif meme lain" },
        },
        required: ["timestamp", "recommendation", "purpose", "suggested_visual", "animation", "alternatives"],
      },
    },
    music: { type: "STRING", description: "Deskripsi singkat background music yang cocok" },
    sound_effects: { type: "ARRAY", items: { type: "STRING" } },
    assets_required: {
      type: "OBJECT",
      properties: {
        images: { type: "ARRAY", items: { type: "STRING" } },
        videos: { type: "ARRAY", items: { type: "STRING" } },
        audio: { type: "ARRAY", items: { type: "STRING" } },
        fonts: { type: "ARRAY", items: { type: "STRING" } },
      },
      required: ["images", "videos", "audio", "fonts"],
    },
  },
  required: [
    "title", "start_time", "end_time", "duration", "viral_score",
    "hook", "script", "timeline", "memes", "music", "sound_effects", "assets_required",
  ],
};

// ---------- Calls ----------

async function generateCandidates({ fileUri, mimeType, platform, duration, contentRules, creativeDirection }) {
  return callGemini(async () => {
    const ai = getClient();
    const prompt = `
${PERSONA}

Tonton video ini dan cari 3-5 momen TERBAIK untuk dijadikan clip short-form.

Target platform: ${platform || "tidak ditentukan"}
Target durasi per clip: ${duration || "tidak ditentukan"}
Content rules dari user: ${contentRules || "(tidak ada)"}
Creative direction dari user: ${creativeDirection || "(tidak ada)"}

Untuk tiap momen: title catchy, timestamp mulai & selesai (HH:MM:SS sesuai video asli, HARUS akurat berdasarkan isi video), estimasi durasi dalam detik (usahakan sesuai target durasi), viral score 0-100, beberapa alasan kenapa momen ini bagus, dan satu kalimat persona buat momen ini.
Balas HANYA dalam format JSON sesuai schema.
`.trim();

    const response = await ai.models.generateContent({
      model: MODEL,
      contents: createUserContent([createPartFromUri(fileUri, mimeType), prompt]),
      config: {
        responseMimeType: "application/json",
        responseSchema: { type: "ARRAY", items: candidateItemSchema },
      },
    });

    return JSON.parse(response.text);
  });
}

async function generateBlueprint({ fileUri, mimeType, candidate, platform, duration, contentRules, creativeDirection }) {
  return callGemini(async () => {
    const ai = getClient();
    const prompt = `
${PERSONA}

Fokus HANYA ke bagian video dari ${candidate.start_time} sampai ${candidate.end_time} (judul: "${candidate.title}").
Buatkan Clip Blueprint LENGKAP buat momen ini:
- hook: kalimat pembuka + instruksi editing 2 detik pertama
- script: hook line, caption, CTA
- timeline: breakdown per segmen (video/subtitle/effect/audio/asset), MULAI dari 00:00 relatif ke clip sampai akhir durasi clip, harus cover seluruh durasi tanpa bolong
- memes: rekomendasi meme dengan 2-3 alternatif tiap satu
- music & sound_effects
- assets_required: images/videos/audio/fonts yang perlu disiapkan user

Target platform: ${platform || "tidak ditentukan"}
Target durasi: ${duration || "tidak ditentukan"}
Content rules: ${contentRules || "(tidak ada)"}
Creative direction: ${creativeDirection || "(tidak ada)"}

Instruksi editing harus konkret (pakai timestamp, angka speed/zoom yang jelas). Bahasa santai di bagian kreatif, tetap jelas di bagian teknis.
Balas HANYA dalam format JSON sesuai schema.
`.trim();

    const response = await ai.models.generateContent({
      model: MODEL,
      contents: createUserContent([createPartFromUri(fileUri, mimeType), prompt]),
      config: {
        responseMimeType: "application/json",
        responseSchema: blueprintSchema,
      },
    });

    return JSON.parse(response.text);
  });
}

async function reviseBlueprint({ fileUri, mimeType, currentBlueprint, message }) {
  return callGemini(async () => {
    const ai = getClient();
    const prompt = `
${PERSONA}

Ini blueprint yang lagi aktif sekarang (JSON):
${JSON.stringify(currentBlueprint)}

User kasih feedback: "${message}"

Update blueprint di atas sesuai feedback itu (boleh ubah timeline, meme, script, hook, dst — sesuaikan sama permintaan user). Balas dengan:
- "reply": balasan singkat 1-2 kalimat ke user, gaya persona, boleh emoji
- "blueprint": versi revisi LENGKAP, format sama persis seperti sebelumnya

Balas HANYA dalam format JSON sesuai schema.
`.trim();

    const response = await ai.models.generateContent({
      model: MODEL,
      contents: createUserContent([createPartFromUri(fileUri, mimeType), prompt]),
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            reply: { type: "STRING" },
            blueprint: blueprintSchema,
          },
          required: ["reply", "blueprint"],
        },
      },
    });

    return JSON.parse(response.text);
  });
}

module.exports = { uploadVideoToGemini, generateCandidates, generateBlueprint, reviseBlueprint };
