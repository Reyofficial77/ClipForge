// candidates.js
const candidates = CF.requireOrRedirect(CF.KEYS.CANDIDATES, "/upload.html");

const list = document.getElementById("candidateList");

candidates.forEach((c) => {
  const card = document.createElement("div");
  card.className = "candidate-card";
  card.innerHTML = `
    <div>
      <h3>${c.title}</h3>
      <div class="candidate-meta mono">${c.start_time} → ${c.end_time} · ${c.duration}s</div>
      <p style="margin-bottom: 10px; font-size: 13.5px;">${c.persona_line}</p>
      <div class="tag-row">
        ${c.reasons.map((r) => `<span class="tag">${r}</span>`).join("")}
      </div>
    </div>
    <div class="score-badge">
      <strong>${c.viral_score}</strong>
      <span>Score</span>
    </div>
  `;
  card.addEventListener("click", () => {
    CF.set(CF.KEYS.SELECTED, c.id);
    window.location.href = "/blueprint.html";
  });
  list.appendChild(card);
});
