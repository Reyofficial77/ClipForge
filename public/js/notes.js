// notes.js
CF.requireOrRedirect(CF.KEYS.RULES, "/rules.html");

const notesField = document.getElementById("notes");

document.getElementById("presetRow").querySelectorAll(".tag").forEach((btn) => {
  btn.addEventListener("click", () => {
    notesField.value = btn.dataset.preset;
  });
});

document.getElementById("nextBtn").addEventListener("click", () => {
  CF.set(CF.KEYS.NOTES, { creativeDirection: notesField.value.trim() });
  window.location.href = "/generate.html";
});
