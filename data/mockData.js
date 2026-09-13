// data/mockData.js
//
// Data dummy yang bentuknya SUDAH mengikuti AI Output Schema di PRD (bagian 36).
// Tujuannya: begitu fase integrasi Gemini dimulai, cukup ganti fungsi generator
// di routes/api.js dengan pemanggilan Gemini — bentuk response ke frontend tidak
// perlu berubah sama sekali.

const COOKING_STEPS = [
  "Video loaded",
  "Transcribing audio",
  "Detecting speakers",
  "Finding funny moments",
  "Finding potential hooks",
  "Analyzing context",
  "Detecting punchlines",
  "Ranking viral potential",
  "Planning edits",
  "Finding meme opportunities",
  "Building clip blueprint",
];

const CANDIDATES = [
  {
    id: "clip-1",
    title: "Bro Accidentally Exposes Himself",
    start_time: "00:42:13",
    end_time: "00:42:58",
    duration: 45,
    viral_score: 92,
    reasons: [
      "Strong hook",
      "Funny payoff",
      "Unexpected reaction",
      "Easy to understand without context",
    ],
    persona_line: "😂 BRO WE FOUND IT. 00:42:13 has serious meme potential.",
  },
  {
    id: "clip-2",
    title: "The Wildest Take",
    start_time: "01:03:21",
    end_time: "01:04:05",
    duration: 44,
    viral_score: 87,
    reasons: [
      "Controversial statement",
      "Strong reaction from co-host",
      "Quotable line",
    ],
    persona_line: "🚨 HOOK ALERT. This take is unhinged in the best way.",
  },
  {
    id: "clip-3",
    title: "He REALLY Said That 💀",
    start_time: "00:17:02",
    end_time: "00:17:39",
    duration: 37,
    viral_score: 81,
    reasons: [
      "Clean punchline",
      "Short and snappy",
      "Great for a meme overlay",
    ],
    persona_line: "💀 Nah, this reaction needs a meme. Trust the process.",
  },
];

// Blueprint lengkap per clip id — mengikuti struktur schema di PRD bagian 36.
const BLUEPRINTS = {
  "clip-1": {
    id: "clip-1",
    title: "He REALLY Said That 💀",
    start_time: "00:42:13",
    end_time: "00:42:58",
    duration: 45,
    viral_score: 92,
    hook: {
      text: "So you're telling me...",
      start: "00:00",
      end: "00:02",
      instruction:
        "Speed up bagian ini ke 1.2x. Buang jeda sekitar 0.4 detik sebelum kalimat dimulai.",
    },
    script: {
      hook: "Bro was NOT supposed to say this 💀",
      caption: "The moment he realized he messed up...",
      cta: "Follow buat part 2, dia belum sadar ini bakal viral 🔥",
    },
    timeline: [
      { start: "00:00", end: "00:02", video: "Speaker", subtitle: "So you're telling me...", effect: "Zoom 110%", audio: "Impact", asset: "—" },
      { start: "00:02", end: "00:05", video: "Speaker", subtitle: "You actually did THAT?", effect: "Punch zoom", audio: "—", asset: "—" },
      { start: "00:05", end: "00:07", video: "Reaction", subtitle: "💀", effect: "Freeze frame", audio: "Vine boom", asset: "Meme" },
      { start: "00:07", end: "00:12", video: "Speaker", subtitle: "Main statement", effect: "Normal", audio: "Music", asset: "—" },
      { start: "00:12", end: "00:15", video: "Speaker", subtitle: "Punchline", effect: "Shake", audio: "SFX", asset: "Meme" },
      { start: "00:15", end: "00:20", video: "Reaction", subtitle: "BRO...", effect: "Zoom", audio: "Record scratch", asset: "Reaction" },
      { start: "00:20", end: "00:30", video: "Speaker", subtitle: "Explanation", effect: "Captions", audio: "Music", asset: "—" },
    ],
    memes: [
      {
        timestamp: "00:05–00:07",
        recommendation: "Use a confused reaction meme.",
        purpose: "Emphasize how ridiculous the statement sounds.",
        suggested_visual: "Confused Monkey / \"What?\" reaction",
        animation: "Quick pop-in → 0.5 sec → disappear",
        alternatives: ["Confused meme", "Shocked reaction", "Skull reaction"],
      },
    ],
    music: "Upbeat trap loop, low in the mix under dialogue",
    sound_effects: ["Impact hit", "Vine boom", "Record scratch"],
    assets_required: {
      images: ["2× reaction memes", "1× screenshot", "1× emphasis image"],
      videos: ["1× reaction GIF", "1× meme video"],
      audio: ["1× background music", "3× SFX"],
      fonts: ["Bold subtitle font", "Impact text font"],
    },
  },
};

// Fallback generator kalau id blueprint belum di-define manual di atas —
// supaya candidate #2 dan #3 tetap bisa dibuka walau datanya lebih ringkas.
function getBlueprint(id) {
  if (BLUEPRINTS[id]) return BLUEPRINTS[id];
  const candidate = CANDIDATES.find((c) => c.id === id);
  if (!candidate) return null;
  return {
    id: candidate.id,
    title: candidate.title,
    start_time: candidate.start_time,
    end_time: candidate.end_time,
    duration: candidate.duration,
    viral_score: candidate.viral_score,
    hook: {
      text: "Wait for it...",
      start: "00:00",
      end: "00:02",
      instruction: "Speed up bagian ini ke 1.15x, buang jeda di awal.",
    },
    script: {
      hook: "You need to see this 👀",
      caption: candidate.title,
      cta: "Follow buat clip selanjutnya",
    },
    timeline: [
      { start: "00:00", end: "00:03", video: "Speaker", subtitle: "Opening line", effect: "Zoom 105%", audio: "Impact", asset: "—" },
      { start: "00:03", end: "00:10", video: "Speaker", subtitle: "Build up", effect: "Normal", audio: "Music", asset: "—" },
      { start: "00:10", end: "00:14", video: "Reaction", subtitle: "😳", effect: "Freeze frame", audio: "Vine boom", asset: "Meme" },
    ],
    memes: [
      {
        timestamp: "00:10–00:14",
        recommendation: "Use a shocked reaction meme.",
        purpose: "Punch up the reaction beat.",
        suggested_visual: "Shocked Pikachu style reaction",
        animation: "Pop-in → hold 0.6s → out",
        alternatives: ["Shocked reaction", "Skull reaction", "Confused meme"],
      },
    ],
    music: "Tension-building loop, drops out on the punchline",
    sound_effects: ["Impact hit", "Vine boom"],
    assets_required: {
      images: ["1× reaction meme", "1× emphasis image"],
      videos: ["1× reaction GIF"],
      audio: ["1× background music", "2× SFX"],
      fonts: ["Bold subtitle font"],
    },
  };
}

// Respon canned untuk AI Interaction (PRD bagian 28) — dipilih berdasarkan
// kata kunci sederhana. Nanti tinggal diganti prompt ke Gemini.
function chatReply(message) {
  const m = message.toLowerCase();
  if (m.includes("lucu")) {
    return "Say less 💀. Gue bakal bikin pacing lebih cepat, tambah 2 meme reaction, dan kasih punchline yang lebih keras.";
  }
  if (m.includes("cepat")) {
    return "Gas. Gue potong jeda-jeda kosongnya dan naikin speed di bagian build-up jadi 1.3x.";
  }
  if (m.includes("serius")) {
    return "Oke, gue kurangin meme-nya dan bikin subtitle lebih clean, minim efek zoom yang lebay.";
  }
  if (m.includes("hook")) {
    return "Noted 👀. Gue cariin kalimat pembuka yang lebih nampol dalam 2 detik pertama.";
  }
  if (m.includes("durasi") || m.includes("30 detik") || m.includes("detik")) {
    return "Bisa. Gue rapetin timeline-nya biar pas di durasi yang kamu mau tanpa motong punchline.";
  }
  return "Gas gue proses ⚡ — blueprint bakal ke-update sebentar lagi.";
}

// ---------- Wrapper fallback ----------
// Bentuk return-nya sengaja dibuat sama persis dengan services/gemini.js,
// supaya routes/api.js bisa switch antara mock <-> Gemini tanpa cabang logic
// yang beda-beda.

async function generateCandidatesMock() {
  return CANDIDATES;
}

async function generateBlueprintMock(candidate) {
  const bp = getBlueprint(candidate.id);
  return bp;
}

async function reviseBlueprintMock(currentBlueprint, message) {
  // Mock mode nggak benar-benar ngerti feedback-nya — cuma balas persona,
  // blueprint dibalikin apa adanya (nggak direvisi).
  return { reply: chatReply(message), blueprint: currentBlueprint };
}

module.exports = {
  COOKING_STEPS,
  CANDIDATES,
  getBlueprint,
  chatReply,
  generateCandidatesMock,
  generateBlueprintMock,
  reviseBlueprintMock,
};
