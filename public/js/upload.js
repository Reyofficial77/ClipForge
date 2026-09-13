// upload.js
const dropzone = document.getElementById("dropzone");
const fileInput = document.getElementById("fileInput");
const fileChip = document.getElementById("fileChip");
const nextBtn = document.getElementById("nextBtn");
const errorMsg = document.getElementById("errorMsg");

const tabFile = document.getElementById("tabFile");
const tabUrl = document.getElementById("tabUrl");
const panelFile = document.getElementById("panelFile");
const panelUrl = document.getElementById("panelUrl");
const urlInput = document.getElementById("urlInput");
const useUrlBtn = document.getElementById("useUrlBtn");

function formatBytes(bytes) {
  if (!bytes) return null;
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

function formatDuration(seconds) {
  if (!seconds) return null;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
}

function showError(message) {
  errorMsg.textContent = message;
  errorMsg.style.display = "block";
}

function clearError() {
  errorMsg.style.display = "none";
}

function showFileChip(meta) {
  const metaLine = [formatBytes(meta.size_bytes), formatDuration(meta.duration_seconds)]
    .filter(Boolean)
    .join(" • ") || (meta.sourceType === "youtube" ? "Video YouTube" : "Video dari link");

  fileChip.style.display = "flex";
  fileChip.className = "file-chip";
  fileChip.innerHTML = `
    <div class="dot"></div>
    <div class="meta">
      <strong>${meta.original_name}</strong>
      <span>${metaLine}</span>
    </div>
  `;
  nextBtn.disabled = false;
}

// ---------- Tab switching ----------

function setTab(active) {
  const isFile = active === "file";
  tabFile.classList.toggle("active", isFile);
  tabUrl.classList.toggle("active", !isFile);
  tabFile.setAttribute("aria-selected", String(isFile));
  tabUrl.setAttribute("aria-selected", String(!isFile));
  panelFile.style.display = isFile ? "block" : "none";
  panelUrl.style.display = isFile ? "none" : "block";
  clearError();
}

tabFile.addEventListener("click", () => setTab("file"));
tabUrl.addEventListener("click", () => setTab("url"));

// ---------- Upload file (drag & drop / file picker) ----------

async function handleFile(file) {
  clearError();
  const allowed = ["video/mp4", "video/quicktime", "video/webm"];
  const ext = file.name.split(".").pop().toLowerCase();
  if (!allowed.includes(file.type) && !["mp4", "mov", "webm"].includes(ext)) {
    showError("Format tidak didukung. Gunakan MP4, MOV, atau WebM.");
    return;
  }

  dropzone.style.opacity = "0.5";
  dropzone.style.pointerEvents = "none";
  nextBtn.disabled = true;

  try {
    const meta = await CFApi.uploadVideo(file);
    CF.set(CF.KEYS.VIDEO, meta);
    showFileChip(meta);
  } catch (err) {
    showError(err.message || "Upload gagal, coba lagi.");
  } finally {
    dropzone.style.opacity = "1";
    dropzone.style.pointerEvents = "auto";
  }
}

dropzone.addEventListener("click", () => fileInput.click());
fileInput.addEventListener("change", (e) => {
  if (e.target.files[0]) handleFile(e.target.files[0]);
});

["dragover", "dragenter"].forEach((evt) =>
  dropzone.addEventListener(evt, (e) => {
    e.preventDefault();
    dropzone.classList.add("drag");
  })
);
["dragleave", "drop"].forEach((evt) =>
  dropzone.addEventListener(evt, (e) => {
    e.preventDefault();
    dropzone.classList.remove("drag");
  })
);
dropzone.addEventListener("drop", (e) => {
  const file = e.dataTransfer.files[0];
  if (file) handleFile(file);
});

// ---------- Upload lewat link ----------

async function handleUrl() {
  clearError();
  const url = urlInput.value.trim();
  if (!url) {
    showError("Isi link video-nya dulu ya.");
    return;
  }

  useUrlBtn.disabled = true;
  useUrlBtn.textContent = "Memproses link...";
  nextBtn.disabled = true;

  try {
    const meta = await CFApi.uploadVideoUrl(url);
    CF.set(CF.KEYS.VIDEO, meta);
    showFileChip(meta);
  } catch (err) {
    showError(err.message || "Gagal ambil video dari link itu.");
  } finally {
    useUrlBtn.disabled = false;
    useUrlBtn.textContent = "Gunakan Link Ini";
  }
}

useUrlBtn.addEventListener("click", handleUrl);
urlInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleUrl();
});

nextBtn.addEventListener("click", () => {
  window.location.href = "/rules.html";
});
