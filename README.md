# ClipForge — AI Clipper Assistant

Upload video mentah → kasih Clip Rules & Creative Direction → Generate →
dapat **Clip Blueprint** yang siap diedit.

Sekarang sudah masuk **iterasi 2**: AI-nya sudah beneran nyala pakai
**Google Gemini** (Gemini bisa langsung "nonton" video, jadi nggak perlu
pipeline transcription/scene-detection terpisah). Kalau `GEMINI_API_KEY`
belum di-set, aplikasi otomatis jalan di **mode demo** pakai data mock, jadi
kamu tetap bisa coba semua alurnya tanpa API key.

## Stack

- **Backend:** Node.js + Express (vanilla, tanpa framework tambahan)
- **Frontend:** HTML/CSS/JS biasa (no build step, no framework)
- **Upload:** drag & drop / file picker (Multer, simpan ke folder `uploads/`), **atau** link video (YouTube langsung, atau link file .mp4/.mov/.webm yang di-download server dulu)
- **AI:** Google Gemini API (`@google/genai`), model default `gemini-3.7-flash`

## Cara menjalankan

```bash
npm install
cp .env.example .env
npm start
```

Buka **http://localhost:3000**.

### Pasang Gemini API key (biar AI-nya beneran nyala)

1. Buat API key di [Google AI Studio](https://aistudio.google.com/apikey).
2. Isi ke file `.env`:

   ```
   GEMINI_API_KEY=your_key_here
   ```
3. Restart server (`npm start`).

Kalau `GEMINI_API_KEY` kosong, kamu bakal lihat banner "🧪 Mode demo" di
atas tiap halaman, dan semua hasil AI (kandidat clip, blueprint, balasan
chat) datang dari `data/mockData.js`, bukan dari Gemini beneran.

Untuk auto-restart saat development:

```bash
npm run dev
```

## Struktur folder

```
clipforge/
├── server.js               # entry point Express
├── routes/api.js           # semua endpoint /api/* (switch Gemini <-> mock)
├── services/gemini.js       # semua pemanggilan Gemini API (upload video, generate, revise)
├── data/mockData.js         # data dummy (fallback mode demo)
├── uploads/                 # file video yang di-upload user (di-gitignore)
└── public/                  # semua frontend (vanilla HTML/CSS/JS)
    ├── index.html            # Landing
    ├── upload.html           # Step 1 — Upload video
    ├── rules.html            # Step 2 — Clip Rules
    ├── notes.html            # Step 3 — Creative Direction
    ├── generate.html         # Step 4 — "AI is cooking" animation
    ├── candidates.html       # Step 5 — Pilih candidate clip
    ├── blueprint.html        # Step 6 — Clip Blueprint lengkap + chat AI
    ├── css/style.css
    └── js/                   # satu file JS per halaman + helper (state.js, api.js, status-banner.js)
```

Alur data antar halaman (video meta, rules, notes, kandidat clip, clip
terpilih) disimpan sementara di `sessionStorage` lewat `public/js/state.js`
(`CF.set` / `CF.get`) — jadi kalau user refresh atau balik ke step
sebelumnya, datanya nggak hilang selama tab masih terbuka.

Sesi video/analisis di sisi **server** disimpan in-memory (satu object
`session` di `routes/api.js`, di-reset tiap ada upload video baru). Ini
cukup buat dev/local karena ClipForge saat ini masih single-user tool —
kalau nanti mau multi-user beneran, ini bagian pertama yang perlu diganti
jadi per-session-id + storage yang persist (DB/Redis).

## Endpoint API

| Endpoint | Fungsi |
|---|---|
| `GET /api/status` | Kasih tahu frontend lagi mode demo atau Gemini beneran |
| `POST /api/upload` | Terima file video (drag & drop / file picker), simpan ke `uploads/`, mulai sesi baru |
| `POST /api/upload-url` | Terima link video — YouTube dipakai langsung, link file lain di-download dulu — mulai sesi baru |
| `POST /api/generate` | Kirim video ke Gemini + Clip Rules & Creative Direction → balikin 3-5 kandidat clip |
| `GET /api/blueprint/:id` | Generate (atau ambil dari cache sesi) Clip Blueprint lengkap untuk satu clip |
| `POST /api/chat` | AI Interaction — kirim feedback singkat, Gemini balas & (kalau bukan mock) beneran merevisi blueprint |

## Cara kerja integrasi Gemini (`services/gemini.js`)

1. **Sumber video** — ada 3 jalur, disatukan lewat `ensureGeminiFile()` di
   `routes/api.js` jadi satu bentuk `{uri, mimeType}` yang dipahami Gemini:
   - **File upload** (drag & drop / file picker) — di-upload ke Gemini Files
     API (`ai.files.upload`), lalu di-poll sampai statusnya `ACTIVE`.
   - **Link YouTube** — dipakai LANGSUNG sebagai URL ke Gemini (`fileData.fileUri`),
     tanpa download sama sekali.
   - **Link file video langsung** (.mp4/.mov/.webm) — di-download dulu ke
     `uploads/` di server, abis itu diperlakukan sama seperti file upload.

   File Gemini di-cache di sesi server, jadi cuma di-upload sekali per video
   meskipun dipakai berkali-kali (generate candidates, generate blueprint,
   revisi chat).
2. **Generate candidates** — satu `generateContent` call dengan video +
   Clip Rules + Creative Direction, dipaksa balas JSON pakai
   `responseSchema` supaya bentuknya selalu konsisten.
3. **Generate blueprint** — call terpisah per clip yang dipilih, fokus AI
   diarahkan cuma ke rentang waktu clip itu, output-nya lengkap sesuai
   struktur di PRD (hook, script, timeline per detik, meme, asset checklist,
   music/SFX).
4. **Chat revision** — kirim blueprint yang lagi aktif + feedback user,
   minta Gemini balikin `reply` (balasan persona) dan `blueprint` (versi
   revisi). Frontend langsung re-render blueprint begitu responsnya datang.

Semua prompt pakai persona yang sama (didefinisikan sekali di
`PERSONA` constant): editor gaul, bahasa santai + emoji, tapi instruksi
editing tetap harus konkret dan pakai timestamp — sesuai PRD bagian 11 & 29.

## Yang masih next steps

- **Durasi video** di `/api/upload` masih di-mock (butuh `ffprobe` atau lib
  media metadata buat baca durasi asli).
- **Multi-user / persistent session** — saat ini single in-memory session.
- **Save/Export ke server** — export blueprint saat ini cuma download JSON
  langsung dari browser (client-side), belum disimpan ke storage.
- **Auto-post / video editing otomatis** — memang sengaja di luar scope MVP
  (lihat PRD bagian 33, Non-Goals).
