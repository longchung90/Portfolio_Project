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
// 📬 Contact API
// ===============================
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

app.post("/api/contact", async (req, res) => {
    const { name, email, message } = req.body;

    try {
        const data = await resend.emails.send({
            from: "Portfolio Contact <onboarding@resend.dev>",
            to: "get.damian@gmail.com", // your receiving email
            subject: `New message from ${name}`,
            html: `
        <h2>New Message from Portfolio</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
        });

        res.json({ success: true, data });
    } catch (error) {
        console.error("❌ Email send failed:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ===============================
// 🚀 Start Server
// ===============================
const PORT = process.env.PORT || 10000; // Render uses 10000 automatically
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
