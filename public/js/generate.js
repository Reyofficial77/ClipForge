// generate.js
//
// Catatan penting: request /api/generate yang beneran (bukan mock) bisa makan
// waktu jauh lebih lama dari animasi checklist ini (Gemini butuh waktu proses
// video, apalagi kalau videonya panjang). Makanya animasi & fetch dijalankan
// PARALEL — animasi checklist jalan sendiri buat kasih feedback visual, terus
// kalau fetch belum selesai pas checklist udah habis, kita nunjukin status
// "masih diproses" sampai hasilnya beneran datang.

const video = CF.requireOrRedirect(CF.KEYS.VIDEO, "/upload.html");
const rules = CF.requireOrRedirect(CF.KEYS.RULES, "/rules.html");
const notes = CF.requireOrRedirect(CF.KEYS.NOTES, "/notes.html");

const STEPS = [
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

const listEl = document.getElementById("cookingList");
const statusText = document.getElementById("statusText");
const errorMsg = document.getElementById("errorMsg");
const cookingTitle = document.getElementById("cookingTitle");
const fillEl = document.getElementById("cookingFill");

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

STEPS.forEach((label) => {
  const li = document.createElement("li");
  li.innerHTML = `<span class="check"></span><span class="label">${label}</span>`;
  listEl.appendChild(li);
});
const items = Array.from(listEl.querySelectorAll("li"));

async function playChecklistAnimation() {
  for (let i = 0; i < items.length; i++) {
    await wait(320);
    items[i].classList.add("show");
    await wait(280);
    items[i].classList.add("done");
    items[i].querySelector(".check").textContent = "✓";
    fillEl.style.width = `${Math.round(((i + 1) / items.length) * 100)}%`;
  }
}

async function run() {
  const fetchPromise = CFApi.generate({
    platform: rules.platform,
    duration: rules.duration,
    contentRules: rules.contentRules,
    creativeDirection: notes.creativeDirection,
  });

  // Jalanin animasi & tunggu request selesai secara paralel.
  const animationDone = playChecklistAnimation();
  let stillWaitingShown = false;

  const timeoutId = setTimeout(() => {
    stillWaitingShown = true;
    statusText.textContent = "Masih diproses — video panjang butuh waktu lebih lama. Tunggu bentar ya...";
  }, 4200);

  let result;
  try {
    [result] = await Promise.all([fetchPromise, animationDone]);
  } catch (err) {
    clearTimeout(timeoutId);
    cookingTitle.textContent = "Yah, gagal nih 😭";
    statusText.textContent = "";
    errorMsg.textContent = err.message || "Ada yang salah saat generate. Coba lagi.";
    errorMsg.style.display = "block";

    const retryBtn = document.createElement("button");
    retryBtn.className = "btn btn-primary";
    retryBtn.style.marginTop = "16px";
    retryBtn.textContent = "🔁 Coba Lagi";
    retryBtn.addEventListener("click", () => window.location.reload());
    errorMsg.after(retryBtn);
    return;
  }

  clearTimeout(timeoutId);
  statusText.textContent = "Done! Ngarahin kamu ke hasilnya...";
  CF.set(CF.KEYS.CANDIDATES, result.candidates);

  await wait(500);
  window.location.href = "/candidates.html";
}

run();
