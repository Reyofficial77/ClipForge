// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const apiRoutes = require("./routes/api");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api", apiRoutes);

// Fallback sederhana untuk 404 di /api
app.use("/api", (req, res) => res.status(404).json({ error: "Endpoint tidak ditemukan." }));

app.listen(PORT, () => {
  console.log(`🚀 ClipForge server jalan di http://localhost:${PORT}`);
});
