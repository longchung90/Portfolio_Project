// ===============================
// 🌐 Core Imports & Setup
// ===============================
import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { Resend } from "resend";

dotenv.config();

// ✅ Handle __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===============================
// 🚀 Initialize App
// ===============================
const app = express();
app.use(express.json());

// ===============================
// 🔒 CORS Configuration
// ===============================
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS: " + origin));
        }
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
}));

// Explicitly handle preflight requests
app.options("*", cors());


app.use(cors({
    origin: allowedOrigins,
    methods: ["GET", "POST"],
}));


// ===============================
// ✉️ Resend Email Setup
// ===============================
const resend = new Resend(process.env.RESEND_API_KEY);

// ===============================
// 📬 Contact Form Endpoint
// ===============================
app.post("/api/contact", async (req, res) => {
    const { name, email, message } = req.body;

    try {
        await resend.emails.send({
            from: "Portfolio <onboarding@resend.dev>", // Replace with your verified sender domain
            to: ["chunglonghoa@gmail.com"],             // <-- your actual inbox
            subject: `📩 New message from ${name}`,
            html: `
        <h2>Contact Form Submission</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b><br>${message}</p>
      `,
        });

        console.log("✅ Email sent successfully");
        res.status(200).json({ success: true });
    } catch (error) {
        console.error("❌ Error sending email:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ===============================
// 🧪 Test Endpoint (optional)
// ===============================
app.post("/api/send-test", async (req, res) => {
    try {
        const data = await resend.emails.send({
            from: "Portfolio <onboarding@resend.dev>",
            to: ["chunglonghoa@gmail.com"],
            subject: "Test Email from Portfolio",
            html: "<strong>Hello from your Render deployment 🎉</strong>",
        });
        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// ===============================
// 🗂 Serve Static Frontend
// ===============================
app.use(express.static(path.join(__dirname, "public")));

// ===============================
// ⚡ Start Server
// ===============================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
    console.log(`🚀 Server running on port ${PORT}`)
);
