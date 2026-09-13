// api.js — wrapper tipis di atas fetch buat manggil backend ClipForge.

const CFApi = {
  async uploadVideo(file) {
    const form = new FormData();
    form.append("video", file);
    const res = await fetch("/api/upload", { method: "POST", body: form });
    if (!res.ok) throw new Error((await res.json()).error || "Upload gagal.");
    return res.json();
  },

  async uploadVideoUrl(url) {
    const res = await fetch("/api/upload-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
    if (!res.ok) throw new Error((await res.json()).error || "Gagal ambil video dari link itu.");
    return res.json();
  },

  async generate(payload) {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error((await res.json()).error || "Generate gagal.");
    return res.json();
  },

  async getBlueprint(id) {
    const res = await fetch(`/api/blueprint/${id}`);
    if (!res.ok) throw new Error((await res.json()).error || "Blueprint tidak ditemukan.");
    return res.json();
  },

  async chat(message, clipId) {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, clipId }),
    });
    if (!res.ok) throw new Error((await res.json()).error || "Chat gagal.");
    return res.json();
  },

  async getStatus() {
    const res = await fetch("/api/status");
    if (!res.ok) return { mock: false };
    return res.json();
  },
};
