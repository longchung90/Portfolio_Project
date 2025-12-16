// ===============================
// 📦 Imports & Config
// ===============================
import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { Resend } from "resend";

dotenv.config();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===============================
// 🌍 Middleware
// ===============================
app.use(cors({
    origin: [
        'https://lcportfolio.org',
        'https://www.lcportfolio.org',
        'http://localhost:10000',
        'http://localhost:3000'
    ],
    methods: ['GET', 'POST'],
    credentials: true
}));
app.use(express.json());

// ✅ Serve static frontend files
app.use(express.static(path.join(__dirname, "public")));

// ===============================
// 📬 Contact API - MUST BE BEFORE WILDCARD!
// ===============================
const resend = new Resend(process.env.RESEND_API_KEY);

app.post("/api/contact", async (req, res) => {
    console.log("📬 Contact form received:", req.body);

    const { name, email, message } = req.body;

    // Validate input
    if (!name || !email || !message) {
        return res.status(400).json({
            success: false,
            error: "All fields are required"
        });
    }

    try {
        const data = await resend.emails.send({
            from: "Portfolio Contact <onboarding@resend.dev>",
            to: "chunglonghoa@gmail.com",
            subject: `New message from ${name}`,
            html: `
                <h2>New Message from Portfolio</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
            `,
        });

        console.log("✅ Email sent successfully:", data);
        res.json({ success: true, data });
    } catch (error) {
        console.error("❌ Email send failed:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ===============================
// 🏠 SPA Fallback - MUST BE LAST!
// ===============================
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ===============================
// 🚀 Start Server
// ===============================
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});