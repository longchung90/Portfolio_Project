// =======================
// Contact Form Handler
// =======================
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("contactForm");
    const statusDiv = document.getElementById("form-status");


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

            try {
                button.disabled = true;
                button.innerText = "Sending...";

                const API_BASE = window.location.hostname.includes("lcportfolio.org")
                    ? "https://api.lcportfolio.org"
                    : "http://localhost:3000";

                const response = await fetch(`${API_BASE}/api/contact`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, email, message }),
                });

                const result = await response.json();

                if (result.success) {
                    statusDiv.innerText = "✅ Message sent successfully!";
                    statusDiv.style.color = "limegreen";
                    form.reset();
                } else {
                    statusDiv.innerText = "❌ " + (result.error || "Failed to send");
                    statusDiv.style.color = "red";
                }
            } catch (err) {
                console.error("Contact form error:", err);
                statusDiv.innerText = "⚠️ Error sending message.";
                statusDiv.style.color = "red";
            } finally {
                button.disabled = false;
                button.innerText = "Send";
                setTimeout(() => {
                    statusDiv.style.transition = "opacity 1s ease";
                    statusDiv.style.opacity = "0";
                    setTimeout(() => {
                        statusDiv.innerText = "";
                        statusDiv.style.opacity = "1";
                    }, 1000);
                }, 5000);
            }
        });
    });


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

        // ✅ read JSON body first
        const data = await response.json();

        // ✅ check both network + backend success
        if (response.ok && data.success) {
            statusDiv.innerText = "✅ Message sent successfully!";
            statusDiv.style.color = "lightgreen";
            form.reset();
        } else {
            console.error("Backend error:", data);
            statusDiv.innerText = "❌ Failed to send message.";
            statusDiv.style.color = "red";
        }
    } catch (err) {
        console.error("Network error:", err);
        statusDiv.innerText = "⚠️ Network error. Please try again.";
        statusDiv.style.color = "red";
    }


