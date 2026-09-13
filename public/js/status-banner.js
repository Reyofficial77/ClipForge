// status-banner.js — nampilin banner "mode demo" kalau GEMINI_API_KEY belum
// di-set di server, biar jelas kenapa hasil AI-nya masih data contoh.
(async function () {
  try {
    const res = await fetch("/api/status");
    if (!res.ok) return;
    const data = await res.json();
    if (!data.mock) return;

    const bar = document.createElement("div");
    bar.textContent =
      "🧪 Mode demo — GEMINI_API_KEY belum di-set di .env, jadi hasil AI masih data contoh. Lihat README buat cara pasang key-nya.";
    bar.style.cssText = [
      "background:#3d2b52",
      "color:#f5f3ff",
      "font-family:'JetBrains Mono',monospace",
      "font-size:12px",
      "text-align:center",
      "padding:8px 14px",
      "border-bottom:1px solid rgba(245,243,255,0.12)",
    ].join(";");
    document.body.prepend(bar);
  } catch (e) {
    // Non-critical, diamkan aja kalau gagal fetch.
  }
})();
