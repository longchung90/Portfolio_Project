// =======================
// Contact Form Handler
// =======================
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("contactForm");
    const statusDiv = document.getElementById("form-status");

    if (!form) {
        console.warn("⚠️ contactForm not found in DOM");
        return;
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = e.target.name.value.trim();
        const email = e.target.email.value.trim();
        const message = e.target.message.value.trim();
        const button = e.target.querySelector("button");

        if (!name || !email || !message) {
            statusDiv.innerText = "⚠️ Please fill out all fields.";
            statusDiv.style.color = "red";
            return;
        }

        button.disabled = true;
        button.innerText = "Sending...";

        const API_BASE = window.location.hostname.includes("lcportfolio.org")
            ? "https://api.lcportfolio.org"
            : "http://localhost:4000";

        try {
            const response = await fetch(`${API_BASE}/api/contact`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, message }),
            });

            const data = await response.json();

            if (data.success) {
                statusDiv.innerText = "✅ Message sent successfully!";
                statusDiv.style.color = "lightgreen";
                form.reset();
            } else {
                statusDiv.innerText = "❌ Failed to send message.";
                statusDiv.style.color = "red";
            }
        } catch (err) {
            console.error("❌ Contact form error:", err);
            statusDiv.innerText = "⚠️ Network error. Please try again.";
            statusDiv.style.color = "red";
        } finally {
            button.disabled = false;
            button.innerText = "Send";
        }
    });
});
