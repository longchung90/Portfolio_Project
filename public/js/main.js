import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Resend } from "resend";

dotenv.config();

const app = express();
app.use(express.json());

// ===== CORS =====
const API_BASE = "https://api.lcportfolio.org";


const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) callback(null, true);
        else callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
};

app.use(cors(corsOptions));

// ===== Resend setup =====
const resend = new Resend(process.env.RESEND_API_KEY);

// ===== Contact route =====
app.post("/api/contact", async (req, res) => {
    try {
        const { name, email, message } = req.body;
        if (!name || !email || !message)
            return res.status(400).json({ success: false, error: "Missing fields" });

        await fetch(`${API_BASE}/api/contact`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, message }),
        });
    });

res.json({ success: true });
    } catch (error) {
    console.error("❌ Email send error:", error);
    res.status(500).json({ success: false, error: error.message });
}
});

// ===== Start server =====
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
