# PRD — AI Clipper Assistant

**Nama Produk:** ClipForge  
**Platform:** Web App  
**Target User:** Pemula yang ingin mendapatkan cuan dari menjadi clipper  
**Core Value:** Upload video → kasih aturan & gaya → Generate → dapat blueprint clip yang siap diedit.

---

## 1. Product Overview

### Masalah

Menjadi clipper terlihat mudah, tetapi pemula biasanya kesulitan menentukan:

- Bagian video mana yang menarik untuk dipotong.
- Bagian mana yang berpotensi viral.
- Apa yang harus ditambahkan pada setiap detik.
- Meme apa yang cocok.
- Backsound apa yang digunakan.
- Kapan harus melakukan zoom, cut, atau transition.
- Bagaimana membuat subtitle yang menarik.
- Bagaimana membuat hook agar penonton tidak langsung scroll.
- Bagaimana mengubah video mentah menjadi short-form content yang engaging.

Saat ini pemula harus menonton video berjam-jam, mencatat timestamp, mencari meme/asset sendiri, kemudian melakukan editing secara manual.

### Solusi

ClipForge menggunakan AI untuk menganalisis video mentah dan menghasilkan **Clip Blueprint**.

User cukup:

1. Upload source video.
2. Masukkan Clip Rules.
3. Masukkan catatan/gaya video.
4. Klik **Generate**.
5. AI menganalisis video.
6. AI menghasilkan blueprint editing secara detail.

Output bukan hanya timestamp clip, tetapi instruksi editing yang actionable untuk setiap bagian video.

---

# 2. Target User

## Primary Persona — Aspiring Clipper

Orang yang ingin mendapatkan cuan dari menjadi clipper.

**Karakteristik:**

- Skill editing pemula–menengah.
- Ingin menghasilkan uang dari short-form content.
- Menggunakan TikTok, YouTube Shorts, atau Instagram Reels.
- Tidak ingin menghabiskan waktu berjam-jam mencari momen terbaik.

### Problem

User sering berpikir:

> "Bagian mana yang harus dipotong?"

> "Meme apa yang cocok?"

> "Kapan harus zoom?"

> "Musiknya apa?"

> "Subtitle-nya gimana?"

### Desired Outcome

> Upload video → AI kasih tahu apa yang harus dilakukan → tinggal edit → upload.

---

# 3. Product Goal

### Primary Goal

Membantu pemula menghasilkan **blueprint clip yang jelas dan actionable** dari video mentah dalam waktu beberapa menit.

### Success Definition

User berhasil mendapatkan:

- Clip yang harus dipotong.
- Timestamp.
- Alasan memilih momen tersebut.
- Script/caption.
- Instruksi editing per detik.
- Meme/asset yang diperlukan.
- Subtitle.
- Backsound.
- SFX.
- Hook.
- CTA.

---

# 4. Core User Journey

```text
Landing Page
     ↓
Upload Source Video
     ↓
Clip Rules
     ↓
Video Style / Notes
     ↓
Generate
     ↓
AI Analysis
     ↓
Candidate Moments
     ↓
Viral Score
     ↓
Selected Clip
     ↓
Clip Blueprint
     ↓
Per-Second Editing Timeline
     ↓
Asset Checklist
     ↓
Export / Save
```

---

# 5. MVP Scope

MVP harus fokus pada satu hal:

> **Mengubah video mentah menjadi blueprint clip yang bisa langsung diedit.**

| Feature | Priority |
|---|---|
| Upload Video | P0 |
| Clip Rules | P0 |
| Video Notes / Style | P0 |
| AI Video Analysis | P0 |
| Detect Interesting Moments | P0 |
| Clip Recommendation | P0 |
| Timestamp | P0 |
| Per-second Editing Blueprint | P0 |
| Meme Recommendation | P0 |
| Script | P0 |
| Auto Subtitle | P0 |
| Backsound Recommendation | P1 |
| SFX Recommendation | P1 |
| Viral Score | P1 |
| Save Blueprint | P1 |
| Export Blueprint | P1 |
| Automatic Video Editing | P2 |

---

# 6. Input

## 6.1 Source Video

User dapat meng-upload video seperti:

- MP4
- MOV
- WebM

Contoh:

```text
Source Video
Podcast_Episode_42.mp4

Duration:
01:24:32
```

---

# 7. Clip Rules

User dapat menentukan aturan clipping.

## Basic

### Target Platform

- TikTok
- YouTube Shorts
- Instagram Reels

### Target Duration

- 15–30 sec
- 30–60 sec
- 60–90 sec

## Content Rules

User dapat menulis aturan seperti:

> Jangan gunakan bagian yang membahas politik.

> Cari momen lucu.

> Prioritaskan argumentasi yang kontroversial.

> Buat videonya cepat dan attention-grabbing.

> Gunakan meme ketika memang diperlukan.

---

# 8. Video Notes / Creative Direction

User memberikan arahan tambahan.

Contoh:

> "Buat seperti clip TikTok yang sangat cepat. Saya ingin videonya lucu dan tidak terlalu serius. Gunakan meme ketika ada punchline. Jangan terlalu banyak transition."

AI menggunakan input ini sebagai **Creative Direction**.

---

# 9. Generate

Tombol utama:

## `GENERATE CLIPS`

Ketika ditekan, AI memulai proses analisis video.

---

# 10. AI Analysis Experience

Salah satu fitur pembeda utama adalah memperlihatkan **progress proses kerja AI**.

Catatan: aplikasi tidak menampilkan chain-of-thought internal AI secara mentah. Yang ditampilkan adalah status pekerjaan dan ringkasan aktivitas AI.

Contoh UI:

```text
🤖 AI IS COOKING...

✓ Video loaded
✓ Transcribing audio
✓ Detecting speakers
✓ Finding funny moments
✓ Finding potential hooks
✓ Analyzing context
✓ Detecting punchlines
✓ Ranking viral potential
✓ Planning edits
✓ Finding meme opportunities
✓ Building clip blueprint

Almost done...
```

Tujuan:

- Memberikan feedback selama proses.
- Membuat pengalaman terasa hidup.
- Mengurangi persepsi bahwa aplikasi macet.
- Memperkuat persona AI sebagai editor kreatif.

---

# 11. AI Persona

AI tidak boleh terasa seperti tool editing yang kaku.

AI harus terasa seperti **editor/content creator yang gaul**, tetapi tetap memberikan instruksi yang jelas.

### Contoh

Normal:

> "A humorous moment was detected at 00:42:31."

AI Persona:

> 😂 **BRO WE FOUND IT.**  
> 00:42:31 has serious meme potential.

Contoh lain:

> 🔥 **This part is actually fire.**

> 💀 **Nah, this reaction needs a meme.**

> 👀 **Don't cut this sentence. The payoff comes 3 seconds later.**

> 🚨 **HOOK ALERT. Use this as the opening.**

> 😂 **Drop a reaction meme right here. Trust me.**

---

# 12. Clip Discovery

Setelah analisis selesai, AI memberikan beberapa kandidat clip.

## Example

### #1 — "Bro Accidentally Exposes Himself"

```text
00:42:13 → 00:42:58

Duration: 45s

🔥 Viral Potential: 92/100

Why:
Strong hook
Funny payoff
Unexpected reaction
Easy to understand without context
```

### #2 — "The Wildest Take"

```text
01:03:21 → 01:04:05

Duration: 44s

🔥 Viral Potential: 87/100
```

---

# 13. Clip Blueprint

Ini adalah **core feature** aplikasi.

Setiap clip memiliki blueprint lengkap.

## Example

### 🎬 Clip #1

**Title:**

> He REALLY Said That 💀

**Timestamp:**

```text
00:42:13 → 00:42:58
```

**Duration:** 45 seconds

**Viral Score:** 92/100

---

# 14. Hook

AI memberikan rekomendasi opening.

```text
00:00–00:02

HOOK

Start directly with:

"So you're telling me..."

Editing:
• Remove silence
• Zoom 110%
• Large subtitle
• Add subtle impact SFX
```

---

# 15. Per-Second Blueprint

Timeline dibuat sangat detail agar mudah diikuti pemula.

| Time | Video | Subtitle | Effect | Audio | Asset |
|---|---|---|---|---|---|
| 00:00–00:02 | Speaker | "So you're telling me..." | Zoom 110% | Impact | — |
| 00:02–00:05 | Speaker | "You actually did THAT?" | Punch zoom | — | — |
| 00:05–00:07 | Reaction | "💀" | Freeze frame | Vine boom | Meme |
| 00:07–00:12 | Speaker | Main statement | Normal | Music | — |
| 00:12–00:15 | Speaker | Punchline | Shake | SFX | Meme |
| 00:15–00:20 | Reaction | "BRO..." | Zoom | Record scratch | Reaction |
| 00:20–00:30 | Speaker | Explanation | Captions | Music | — |

---

# 16. Meme Recommendation

AI mendeteksi bagian yang cocok untuk meme.

```text
😂 MEME OPPORTUNITY

Timestamp:
00:05–00:07

Recommendation:
Use a confused reaction meme.

Purpose:
Emphasize how ridiculous the statement sounds.

Suggested visual:
Confused Monkey / "What?" reaction

Animation:
Quick pop-in → 0.5 sec → disappear
```

AI dapat memberikan beberapa alternatif:

```text
Option A — Confused meme
Option B — Shocked reaction
Option C — Skull reaction
```

---

# 17. Asset Checklist

Setelah blueprint dibuat, AI memberikan daftar asset yang perlu disediakan.

## 📦 Assets You Need

### Images

- 2× reaction memes
- 1× screenshot
- 1× emphasis image

### Videos

- 1× reaction GIF
- 1× meme video

### Audio

- 1× background music
- 3× SFX

### Fonts

- Bold subtitle font
- Impact text font

---

# 18. Script

AI menghasilkan script/caption untuk membantu packaging content.

### Hook

> "Bro was NOT supposed to say this 💀"

### Caption

> "The moment he realized he messed up..."

### CTA

> "Would you have done the same?"

AI dapat memberikan beberapa pilihan:

```text
🔥 Aggressive
😂 Funny
👀 Curiosity
💀 Meme
```

---

# 19. Auto Subtitle

AI membuat subtitle berdasarkan transcript.

Fitur:

- Word-by-word highlighting.
- Emphasis words.
- Emoji.
- Capitalization.
- Subtitle timing.
- Penekanan kata penting.

Contoh:

> **BRO**  
> you actually **DID THAT?!**

AI dapat menandai kata tertentu sebagai **emphasis words**.

---

# 20. Backsound Recommendation

AI memberikan rekomendasi berdasarkan mood clip.

```text
🎵 Recommended Music

Mood:
Funny + chaotic

Music:
Upbeat meme-style background

Volume:
8–12%

Fade:
0.3s

Duck during speech:
Yes
```

Untuk MVP, sistem dapat memberikan **kategori/mood dan karakteristik musik** terlebih dahulu. Integrasi library musik dapat ditambahkan kemudian.

---

# 21. SFX Recommendation

AI menentukan kapan SFX digunakan.

Contoh:

```text
00:05 — Vine Boom
00:12 — Pop
00:15 — Record Scratch
00:24 — Whoosh
```

---

# 22. Viral Score

Setiap clip memiliki score untuk membantu user melakukan prioritas.

### 🔥 Viral Potential

**92/100**

Breakdown:

```text
Hook             95
Entertainment    93
Retention        90
Context          88
Shareability     94
```

Catatan:

> Viral Score adalah estimasi untuk membantu memilih clip, bukan jaminan bahwa video akan viral.

---

# 23. Clip Ranking

AI menghasilkan ranking clip.

```text
🔥 BEST CLIPS

#1  92/100
#2  89/100
#3  86/100
#4  81/100
#5  76/100
```

User dapat langsung memprioritaskan clip dengan score tertinggi.

---

# 24. UX / UI

## Dashboard

```text
┌──────────────────────────────────────────────┐
│ ClipForge                         + New Clip │
├──────────────────────────────────────────────┤
│                                              │
│         🎬 CREATE A NEW CLIP                 │
│                                              │
│       Drop your video here                   │
│                                              │
│              [ Upload Video ]                │
│                                              │
├──────────────────────────────────────────────┤
│ Recent Projects                              │
│                                              │
│ Podcast #12       5 Clips       92 Score     │
│ Stream #24        8 Clips       89 Score     │
└──────────────────────────────────────────────┘
```

---

# 25. Generate Page

```text
SOURCE VIDEO

[ Podcast_Episode.mp4 ]

Duration: 01:24:32

────────────────────────────

CLIP RULES

Platform:
[ TikTok ▼ ]

Duration:
[ 30–60 sec ▼ ]

────────────────────────────

CREATIVE DIRECTION

"Make it funny, fast paced and meme heavy."

────────────────────────────

             [ GENERATE ]
```

---

# 26. AI Processing Screen

```text
🤖 AI IS COOKING...

✓ Video loaded
✓ Transcript generated
✓ Funny moments detected
✓ Hooks detected
✓ Context analyzed
✓ Punchlines detected
✓ Meme opportunities found
✓ Viral potential calculated

🔥 17 potential clips found

Building your blueprint...

██████████████████░░ 87%
```

---

# 27. Blueprint Page

```text
← Back

🔥 CLIP #1

"He REALLY Said That 💀"

00:42:13 ━━━━━━━━━ 00:42:58

Viral Score
██████████████████░ 92

────────────────────────

🎯 HOOK

00:00–00:02

"So you're telling me..."

• Zoom 110%
• Bold subtitle
• Impact SFX

────────────────────────

😂 MEME

00:05–00:07

Use confused reaction meme

────────────────────────

🎵 AUDIO

Upbeat meme background

────────────────────────

📦 ASSETS

✓ 2 Reaction Memes
✓ 3 SFX
✓ 1 Background Music

────────────────────────

[ Export Blueprint ]
[ Edit Blueprint ]
```

---

# 28. AI Interaction

User dapat memberikan feedback kepada AI setelah blueprint dibuat.

### User

> "Bikin lebih lucu."

### AI

> "Say less 💀. Gue bakal bikin pacing lebih cepat, tambah 2 meme reaction, dan kasih punchline yang lebih keras."

AI kemudian memperbarui blueprint.

Contoh command lain:

- "Bikin lebih cepat."
- "Kurangi meme."
- "Bikin lebih serius."
- "Cari hook yang lebih kuat."
- "Bikin durasinya 30 detik."
- "Jangan gunakan bagian ini."
- "Kasih 3 alternatif."

---

# 29. Editing Instructions

AI harus menggunakan bahasa yang mudah dipahami pemula.

### Hindari

> "Apply dynamic temporal scaling to optimize retention."

### Gunakan

> **Speed up bagian ini ke 1.2x.**  
> Buang jeda sekitar 0.4 detik.

Prinsip:

- Instruksi konkret.
- Hindari istilah teknis tanpa penjelasan.
- Gunakan timestamp.
- Jelaskan alasan ketika diperlukan.
- Gunakan bahasa casual pada bagian kreatif.
- Tetap jelas pada instruksi teknis.

---

# 30. Differentiator

Produk ini tidak berusaha menjadi **CapCut versi AI**.

### Positioning

> **"AI yang menjadi otak di belakang clipper."**

### Manual Editing

> Kamu yang menentukan edit.

### ClipForge

> **AI memberi tahu kamu harus melakukan apa.**

## Workflow

### Manual

```text
Cari video
↓
Tonton 1 jam
↓
Cari moment
↓
Cari meme
↓
Cari music
↓
Edit
↓
Coba-coba
↓
Upload
```

### ClipForge

```text
Upload
↓
AI Analysis
↓
Best Moment
↓
Blueprint
↓
Edit
↓
Upload
```

---

# 31. Retention Loop

Alasan utama user kembali menggunakan aplikasi:

> **Mendapatkan clip yang semakin bagus dan berpotensi semakin viral.**

## Loop

```text
Upload Video
      ↓
Generate Clips
      ↓
Upload
      ↓
Performance
      ↓
AI learns what works
      ↓
Better recommendations
      ↓
More clips
      ↓
More potential income
```

## Future Feature: Performance Learning

User dapat memasukkan atau menghubungkan performa video:

```text
Views: 1.2M
Likes: 82K
Shares: 31K
```

AI kemudian menganalisis pola:

> "Clip dengan hook langsung + reaction meme mendapatkan retention lebih tinggi dibanding format sebelumnya."

Hal ini menjadi dasar **personalized clipping recommendations**.

---

# 32. Monetization

## Free

- 3 video analysis / bulan.
- Basic blueprint.
- Limited AI recommendations.

## Pro

**$9–15/month**

- More analyses.
- Full blueprint.
- Meme recommendations.
- Advanced AI.
- Viral Score.
- Multiple clip generation.

## Clipper Pro

**$29–49/month**

- Large video processing.
- Batch clipping.
- Multiple source videos.
- Advanced analytics.
- AI learning from performance.
- Team/workspace.

Harga adalah hipotesis awal dan harus divalidasi melalui testing.

---

# 33. Non-Goals MVP

Agar development tidak terlalu besar, MVP **tidak perlu langsung**:

- ❌ Auto-post ke TikTok.
- ❌ Full automatic video editor.
- ❌ AI-generated memes.
- ❌ AI avatar.
- ❌ Voice cloning.
- ❌ Social network.
- ❌ Marketplace clipper.
- ❌ Automatic monetization.

Fokus utama:

> **SOURCE VIDEO → AI → CLIP BLUEPRINT**

---

# 34. Technical Architecture — High Level

```text
                    USER
                     │
                     ▼
              ┌─────────────┐
              │  Web App    │
              └──────┬──────┘
                     │
                     ▼
              ┌─────────────┐
              │ Video Upload│
              └──────┬──────┘
                     │
                     ▼
             ┌──────────────┐
             │ Video Storage│
             └──────┬───────┘
                    │
                    ▼
          ┌────────────────────┐
          │ AI Processing      │
          │                    │
          │ Transcription      │
          │ Scene Detection    │
          │ Moment Detection   │
          │ Context Analysis   │
          │ Humor Detection    │
          │ Hook Detection     │
          └─────────┬──────────┘
                    │
                    ▼
          ┌────────────────────┐
          │ Blueprint Generator│
          └─────────┬──────────┘
                    │
                    ▼
              ┌─────────────┐
              │ Web Dashboard│
              └─────────────┘
```

---

# 35. AI Pipeline

AI tidak cukup hanya melakukan transcription.

```text
Video
 ↓
Audio Extraction
 ↓
Speech-to-Text
 ↓
Speaker Detection
 ↓
Timestamp Alignment
 ↓
Scene Detection
 ↓
Emotion Detection
 ↓
Humor Detection
 ↓
Hook Detection
 ↓
Context Analysis
 ↓
Potential Clip Generation
 ↓
Clip Ranking
 ↓
Editing Blueprint
 ↓
Asset Recommendation
```

---

# 36. AI Output Schema

Setiap blueprint sebaiknya memiliki struktur data seperti:

```text
Clip
├── title
├── start_time
├── end_time
├── duration
├── viral_score
├── hook
├── context
├── script
├── subtitles
├── timeline
│   ├── timestamp
│   ├── action
│   ├── subtitle
│   ├── effect
│   ├── sfx
│   └── asset
├── memes
├── music
├── sound_effects
└── assets_required
```

Contoh JSON konseptual:

```json
{
  "title": "He REALLY Said That 💀",
  "start_time": "00:42:13",
  "end_time": "00:42:58",
  "duration": 45,
  "viral_score": 92,
  "hook": {
    "text": "So you're telling me...",
    "start": "00:42:13",
    "end": "00:42:15"
  },
  "timeline": [
    {
      "start": "00:00",
      "end": "00:02",
      "action": "Zoom 110%",
      "subtitle": "So you're telling me...",
      "sfx": "impact"
    }
  ],
  "assets_required": [
    "confused_reaction_meme",
    "impact_sfx",
    "background_music"
  ]
}
```

---

# 37. Key Metrics

## North Star Metric

**Successful Clip Blueprints Generated**

Bukan sekadar jumlah user karena tujuan utama produk adalah membantu user menghasilkan clip.

## Activation

- % user yang berhasil upload video.
- % user yang melakukan Generate.
- % user yang membuka blueprint.

## Engagement

- Blueprint per user.
- Video processed per user.
- Clips generated per user.
- Blueprint revision rate.

## Retention

- D1 retention.
- D7 retention.
- D30 retention.

## Outcome

- Clip yang berhasil diedit.
- Clip yang berhasil di-upload.
- Views.
- Engagement.
- User-reported viral clips.

---

# 38. MVP Success Criteria

MVP dianggap berhasil jika user dapat:

```text
Upload video
      ↓
Masukkan rules
      ↓
Generate
      ↓
Mendapatkan minimal 3 rekomendasi clip
      ↓
Memilih clip
      ↓
Mendapatkan blueprint
      ↓
Mengikuti blueprint untuk editing
```

### UX Success Criteria

Pemula harus dapat memahami blueprint tanpa perlu mengerti teknik editing profesional.

---

# 39. Product Vision

Visi jangka panjangnya bukan hanya:

> **"AI untuk mencari clip."**

Tetapi:

> **"AI Creative Director untuk para clipper."**

AI nantinya dapat mengetahui:

- Video apa yang bagus untuk dipotong.
- Hook apa yang cocok.
- Editing style apa yang cocok.
- Meme apa yang cocok.
- Music apa yang cocok.
- Bagaimana meningkatkan retention.
- Format apa yang sedang bekerja.
- Apa yang membuat video sebelumnya viral.

## Long-Term Workflow

```text
        SOURCE VIDEO
             ↓
       ┌─────────────┐
       │ AI CLIPPER  │
       │  DIRECTOR   │
       └──────┬──────┘
              ↓
       Best Moments
              ↓
        Creative Plan
              ↓
        Edit Blueprint
              ↓
          Finished
             CLIP
              ↓
          UPLOAD
              ↓
        PERFORMANCE
              ↓
        AI LEARNS
              ↓
       BETTER CLIPS 🔥
```

---

# 40. Product One-Liner

### English

> **"Upload the video. Let AI tell you exactly how to make it go viral."**

### Indonesian

> **"Upload video mentah. AI kasih tahu bagian mana yang harus dipotong, kapan harus meme, kapan harus zoom, dan apa yang harus ditambahkan."**
