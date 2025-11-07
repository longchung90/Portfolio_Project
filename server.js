// ===============================
// 📦 Imports & Config
// ===============================
import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

dotenv.config();

// ===============================
// 🧭 Setup
// ===============================
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===============================
// 🌍 Allowed Origins (CORS)
// ===============================
const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",")
    : [
        "https://www.lcportfolio.org",
        "https://api.lcportfolio.org",
        ",
    ];

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.warn(`❌ Blocked by CORS: ${origin}`);
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// ===============================
// 🗂 Static Frontend
// ===============================
app.use(express.static(path.join(__dirname, "public")));

// ===============================
// ✉️ Example API Route
// ===============================
app.post("/api/contact", async (req, res) => {
    try {
        const { name, email, message } = req.body;
        console.log("📩 Contact form received:", { name, email, message });
        res.status(200).json({ success: true, message: "Message received!" });
    } catch (error) {
        console.error("❌ Error in contact route:", error);
        res.status(500).json({ success: false, error: "Server error" });
    }
});

// ===============================
// ⚡ Start Server
// ===============================
const PORT = process.env.PORT || 1000;
app.listen(PORT, () =>
    console.log(`🚀 Server running on port ${PORT}`)
);
