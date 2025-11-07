document.addEventListener("DOMContentLoaded", () => {
    const fadeEls = document.querySelectorAll(".fade-in");

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    console.log("🎬 Fading in:", entry.target.id); // debug
                    entry.target.classList.add("visible");
                    obs.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.05,
            rootMargin: "0px 0px -20% 0px" // 👈 wait until bottom 20% enters viewport
        });

        // small delay to avoid instant triggering at load
        setTimeout(() => {
            fadeEls.forEach(el => observer.observe(el));
        }, 300);

        console.log(`✨ Fade-in elements detected: ${fadeEls.length}`);
    } else {
        fadeEls.forEach(el => el.classList.add("visible"));
    }
});
