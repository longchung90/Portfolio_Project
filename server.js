// ✅ Load environment variables first
import dotenv from "dotenv";
dotenv.config();

// ✅ Core imports
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { Resend } from "resend";

// ✅ ES module dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Init app
const app = express();
app.use(express.json());
app.use(cors());

// ✅ Serve static frontend
app.use(express.static(path.join(__dirname, "public")));

// ✅ Initialize Resend *after* dotenv has loaded
const resend = new Resend(process.env.RESEND_API_KEY);

// ✅ Example route to test email
app.post("/api/send", async (req, res) => {
    try {
        const data = await resend.emails.send({
            from: "onboarding@resend.dev",
            to: "your@email.com",
            subject: "Test Email",
            html: "<strong>Hello from Resend!</strong>",
        });
        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// ✅ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
