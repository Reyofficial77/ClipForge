// blueprint.js
//
// Chat box (log + input) sengaja dipisah dari #blueprintContent supaya nggak
// ke-reset tiap kali blueprint di-update lewat AI Interaction — cuma bagian
// blueprint-nya aja yang di-render ulang, riwayat chat tetap ada.

const selectedId = CF.requireOrRedirect(CF.KEYS.SELECTED, "/candidates.html");
const contentEl = document.getElementById("blueprintContent");
const chatLog = document.getElementById("chatLog");
const chatInput = document.getElementById("chatInput");
const chatSend = document.getElementById("chatSend");

let currentBlueprint = null;
const chatMessages = [];

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str == null ? "" : String(str);
  return div.innerHTML;
}

function renderChatLog() {
  chatLog.innerHTML = chatMessages
    .map((m) => `<div class="chat-msg ${m.who}">${escapeHtml(m.text)}</div>`)
    .join("");
  chatLog.scrollTop = chatLog.scrollHeight;
}

function addMessage(text, who) {
  chatMessages.push({ text, who });
  renderChatLog();
}

function renderBlueprintBody(bp) {
  contentEl.innerHTML = `
    <div class="blueprint-header">
      <div>
        <span class="eyebrow">🎬 CLIP BLUEPRINT</span>
        <h1 style="font-size: 28px;">${escapeHtml(bp.title)}</h1>
        <div class="candidate-meta mono">${escapeHtml(bp.start_time)} → ${escapeHtml(bp.end_time)} · ${bp.duration}s</div>
      </div>
      <div class="score-badge">
        <strong>${bp.viral_score}</strong>
        <span>Score</span>
      </div>
    </div>

    <div class="btn-row" style="margin-top:0; margin-bottom: 8px;">
      <button class="btn btn-primary" id="exportBtn">⬇ Export Blueprint</button>
      <button class="btn btn-ghost" id="editBtn">✏️ Edit Blueprint (chat di bawah)</button>
    </div>

    <p class="section-title">🚨 Hook</p>
    <div class="card">
      <div class="persona-bubble">🚨 <strong>HOOK ALERT.</strong> Buka dengan ini: "${escapeHtml(bp.hook.text)}" (${escapeHtml(bp.hook.start)}–${escapeHtml(bp.hook.end)})</div>
      <p style="margin: 12px 0 0; font-size: 14px;">${escapeHtml(bp.hook.instruction)}</p>
    </div>

    <p class="section-title">✍️ Script</p>
    <div class="card">
      <div class="field"><label>Hook line</label><p style="color: var(--text);">"${escapeHtml(bp.script.hook)}"</p></div>
      <div class="field"><label>Caption</label><p style="color: var(--text);">"${escapeHtml(bp.script.caption)}"</p></div>
      <div class="field mt-0"><label>CTA</label><p style="color: var(--text); margin: 0;">"${escapeHtml(bp.script.cta)}"</p></div>
    </div>

    <p class="section-title">⏱ Per-Second Editing Timeline</p>
    <div class="card" style="overflow-x: auto;">
      <table class="timeline-table">
        <thead>
          <tr><th>Time</th><th>Video</th><th>Subtitle</th><th>Effect</th><th>Audio</th><th>Asset</th></tr>
        </thead>
        <tbody>
          ${bp.timeline
            .map(
              (row) => `
            <tr>
              <td>${escapeHtml(row.start)}–${escapeHtml(row.end)}</td>
              <td>${escapeHtml(row.video)}</td>
              <td>${escapeHtml(row.subtitle)}</td>
              <td>${escapeHtml(row.effect)}</td>
              <td>${escapeHtml(row.audio)}</td>
              <td>${escapeHtml(row.asset)}</td>
            </tr>`
            )
            .join("")}
        </tbody>
      </table>
    </div>

    <p class="section-title">😂 Meme Recommendation</p>
    ${bp.memes
      .map(
        (meme) => `
      <div class="card" style="margin-bottom: 12px;">
        <div class="candidate-meta mono">${escapeHtml(meme.timestamp)}</div>
        <p style="color: var(--text); margin-bottom: 4px;"><strong>${escapeHtml(meme.recommendation)}</strong></p>
        <p style="font-size: 13px; margin-bottom: 10px;">${escapeHtml(meme.purpose)} — visual: ${escapeHtml(meme.suggested_visual)}. Animasi: ${escapeHtml(meme.animation)}.</p>
        <div class="tag-row">
          ${meme.alternatives.map((a, i) => `<span class="tag">Option ${String.fromCharCode(65 + i)} — ${escapeHtml(a)}</span>`).join("")}
        </div>
      </div>`
      )
      .join("")}

    <p class="section-title">📦 Assets You Need</p>
    <div class="checklist-grid">
      <div class="card">
        <h4 style="font-size: 14px;">Images</h4>
        <ul>${bp.assets_required.images.map((i) => `<li>${escapeHtml(i)}</li>`).join("")}</ul>
      </div>
      <div class="card">
        <h4 style="font-size: 14px;">Videos</h4>
        <ul>${bp.assets_required.videos.map((i) => `<li>${escapeHtml(i)}</li>`).join("")}</ul>
      </div>
      <div class="card">
        <h4 style="font-size: 14px;">Audio</h4>
        <ul>${bp.assets_required.audio.map((i) => `<li>${escapeHtml(i)}</li>`).join("")}</ul>
      </div>
      <div class="card">
        <h4 style="font-size: 14px;">Fonts</h4>
        <ul>${bp.assets_required.fonts.map((i) => `<li>${escapeHtml(i)}</li>`).join("")}</ul>
      </div>
    </div>

    <p class="section-title">🎵 Music &amp; SFX</p>
    <div class="card">
      <p style="margin-bottom: 8px;"><strong style="color: var(--text);">Background music:</strong> ${escapeHtml(bp.music)}</p>
      <div class="tag-row">${bp.sound_effects.map((s) => `<span class="tag">${escapeHtml(s)}</span>`).join("")}</div>
    </div>
  `;

  document.getElementById("exportBtn").addEventListener("click", () => exportBlueprint(bp));
  document.getElementById("editBtn").addEventListener("click", () => chatInput.focus());
}

function exportBlueprint(bp) {
  const blob = new Blob([JSON.stringify(bp, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `clipforge-blueprint-${bp.id}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

async function sendChat() {
  const text = chatInput.value.trim();
  if (!text) return;
  addMessage(text, "user");
  chatInput.value = "";
  chatSend.disabled = true;
  chatInput.disabled = true;

  try {
    const result = await CFApi.chat(text, selectedId);
    addMessage(result.reply, "ai");
    if (result.blueprint) {
      currentBlueprint = result.blueprint;
      renderBlueprintBody(currentBlueprint);
    }
  } catch (err) {
    addMessage(err.message || "Waduh, gagal connect ke AI. Coba lagi ya.", "ai");
  } finally {
    chatSend.disabled = false;
    chatInput.disabled = false;
    chatInput.focus();
  }
}

chatSend.addEventListener("click", sendChat);
chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendChat();
});

CFApi.getBlueprint(selectedId)
  .then((bp) => {
    currentBlueprint = bp;
    renderBlueprintBody(bp);
    chatInput.disabled = false;
    chatSend.disabled = false;
  })
  .catch((err) => {
    contentEl.innerHTML = `<p class="center" style="color: var(--pink);">${escapeHtml(err.message)}</p>`;
  });
