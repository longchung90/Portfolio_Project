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
        "http://localhost:3000",
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
// ✉️ Contact Route (with Resend)
// ===============================
const resend = new Resend(process.env.RESEND_API_KEY);

app.post("/api/contact", async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                error: "Please fill in all required fields.",
            });
        }

        // Send email via Resend
        await resend.emails.send({
            from: "Portfolio Contact <no-reply@lcportfolio.org>",
            to: "chunglonghoa@gmail.com",
            subject: `📬 Message from ${name}`,
            html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong><br>${message}</p>
      `,
        });

        console.log("✅ Email sent successfully from contact form.");
        res.status(200).json({ success: true, message: "Message sent successfully!" });
    } catch (error) {
        console.error("❌ Error sending email:", error);
        res.status(500).json({ success: false, error: "Failed to send message." });
    }
});

// ===============================
// ⚡ Start Server
// ===============================
const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
        console.log(`⚠️ Port ${PORT} busy, trying another...`);
        const tempServer = app.listen(0, () => {
            const newPort = tempServer.address().port;
            console.log(`✅ Running on random port ${newPort}`);
        });
    }
});
