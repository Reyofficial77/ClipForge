// rules.js
CF.requireOrRedirect(CF.KEYS.VIDEO, "/upload.html");

const state = { platform: null, duration: null };
const nextBtn = document.getElementById("nextBtn");

function setupChoiceGrid(gridId, stateKey) {
  const grid = document.getElementById(gridId);
  grid.querySelectorAll(".choice-card").forEach((card) => {
    card.addEventListener("click", () => {
      grid.querySelectorAll(".choice-card").forEach((c) => c.classList.remove("selected"));
      card.classList.add("selected");
      state[stateKey] = card.dataset.value;
      updateNextBtn();
    });
  });
}

function updateNextBtn() {
  nextBtn.disabled = !(state.platform && state.duration);
}

setupChoiceGrid("platformGrid", "platform");
setupChoiceGrid("durationGrid", "duration");

nextBtn.addEventListener("click", () => {
  const contentRules = document.getElementById("contentRules").value.trim();
  CF.set(CF.KEYS.RULES, { platform: state.platform, duration: state.duration, contentRules });
  window.location.href = "/notes.html";
});
