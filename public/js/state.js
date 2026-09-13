// state.js — helper kecil buat nyimpen data alur user antar halaman.
// Pakai sessionStorage: cukup untuk satu sesi "Upload -> ... -> Blueprint",
// dan otomatis bersih kalau tab ditutup.

const CF = {
  KEYS: {
    VIDEO: "cf_video",
    RULES: "cf_rules",
    NOTES: "cf_notes",
    CANDIDATES: "cf_candidates",
    SELECTED: "cf_selected_clip",
    BLUEPRINT_PREFIX: "cf_blueprint_",
  },

  set(key, value) {
    sessionStorage.setItem(key, JSON.stringify(value));
  },

  get(key, fallback = null) {
    const raw = sessionStorage.getItem(key);
    if (!raw) return fallback;
    try {
      return JSON.parse(raw);
    } catch {
      return fallback;
    }
  },

  clearFlow() {
    Object.values(this.KEYS).forEach((k) => {
      if (typeof k === "string") sessionStorage.removeItem(k);
    });
  },

  // Guard halaman: kalau step sebelumnya belum ada datanya, tendang balik.
  requireOrRedirect(key, redirectTo) {
    const value = this.get(key);
    if (!value) {
      window.location.href = redirectTo;
      return null;
    }
    return value;
  },
};
