// ===============================
// 📦 Imports & Config
// ===============================
import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===============================
// 🌍 Middleware
// ===============================
app.use(cors());
app.use(express.json());

// ✅ Serve static frontend files
app.use(express.static(path.join(__dirname, "public")));

// ✅ Fallback for SPA routes
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ===============================
// 🚀 Start Server
// ===============================
const PORT = process.env.PORT || 10000; // Render uses 10000 automatically
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
