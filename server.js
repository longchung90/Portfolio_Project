import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { Resend } from "resend";

// ES module dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Init app
const app = express();
app.use(express.json());

// ✅ Allow CORS for both domain variants
app.use(cors({
    origin: ["https://lcportfolio.org", "https://www.lcportfolio.org"],
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
}));

// ✅ Handle preflight OPTIONS requests
app.options("*", cors({
    origin: ["https://lcportfolio.org", "https://www.lcportfolio.org"],
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
}));

// ✅ Serve static frontend
app.use(express.static(path.join(__dirname, "public")));


// ✅ Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

// Health check
app.get("/ping", (req, res) => {
    res.json({ msg: "Server is alive!" });
});
// ✅ Contact form endpoint
app.post("/api/contact", async (req, res) => {
    const { name, email, message } = req.body;
    console.log("📥 Incoming form submission:", req.body);


    if (!name || !email || !message) {
        return res
            .status(400)
            .json({ success: false, error: "All fields are required." });
    }

    try {
        const result = await resend.emails.send({
            from: "Portfolio <info@lcportfolio.org>", // must match verified sender
            to: process.env.EMAIL_USER,                // your receiving email
            reply_to: email,                           // reply directly to sender
            subject: `📬 Portfolio Contact: ${name}`,
            html: `
        <p><b>From:</b> ${name} (${email})</p>
        <p><b>Message:</b></p>
        <p>${message}</p>
      `
        });

        // 👇 Diagnostic logging
        console.log("Resend API result:", result);

        if (result.error) {
            console.error("Resend send error:", result.error);
            return res
                .status(500)
                .json({ success: false, error: result.error.message });
        }

        res.json({ success: true, msg: "✅ Message sent successfully!" });
    } catch (error) {
        console.error("Unexpected send error:", error);
        res
            .status(500)
            .json({ success: false, error: error.message });
    }
});


// ✅ Root route — serve index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ✅ Dynamic Render port
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

