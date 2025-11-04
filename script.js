// BlueWaveWeb — interactive behaviors

// Footer year
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('year').textContent = new Date().getFullYear();
});

// Simple toast helper
window.toast = function (message, ms = 3200) {
    const container = document.getElementById('toast-container');
    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = message;
    container.appendChild(el);
    setTimeout(() => {
        el.style.opacity = '0';
        setTimeout(() => el.remove(), 300);
    }, ms);
};

// Contact form handler (demo)
function handleContact(e) {
    e.preventDefault();
    const fm = e.target;
    const name = (fm.name && fm.name.value.trim()) || 'Friend';
    toast(`Thanks ${name}! We'll get back to you shortly.`);
    fm.reset();
}

// Save draft demo
function saveDraft() {
    toast('Draft saved locally!');
}

// CTA action
document.getElementById('cta-btn').addEventListener('click', () => {
    toast('Thanks — we will email your proposal shortly.');
});

// Demo button
const demoBtn = document.getElementById('demo-btn');
demoBtn && demoBtn.addEventListener('click', () => toast('Opening demo preview...'));

/* Reveal on scroll using IntersectionObserver */
const revealTargets = document.querySelectorAll('.reveal, .reveal-delay, .reveal-delay-2, .reveal-delay-3, .fade-up, .reveal-right');
const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.classList.add('visible');
        // add slight stagger for delay classes
        if (el.classList.contains('reveal-delay')) el.style.transitionDelay = '0.18s';
        if (el.classList.contains('reveal-delay-2')) el.style.transitionDelay = '0.32s';
        if (el.classList.contains('reveal-delay-3')) el.style.transitionDelay = '0.48s';
        obs.unobserve(el);
    });
}, { threshold: 0.2 });
revealTargets.forEach(t => io.observe(t));

/* Background particle field (canvas) */
(function () {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w = canvas.width = innerWidth;
    let h = canvas.height = innerHeight;
    const particles = [];
    const count = Math.round(Math.max(24, Math.min(90, (w * h) / 90000)));

    function rand(min, max) { return Math.random() * (max - min) + min; }

    function initParticles() {
        particles.length = 0;
        for (let i = 0; i < count; i++) {
            particles.push({
                x: rand(0, w),
                y: rand(0, h),
                r: rand(0.8, 3.6),
                vx: rand(-0.2, 0.6),
                vy: rand(-0.1, 0.2),
                hue: rand(180, 230),
                life: rand(400, 1200)
            });
        }
    }

    function resize() { w = canvas.width = innerWidth; h = canvas.height = innerHeight; initParticles(); }
    addEventListener('resize', resize);

    function draw() {
        ctx.clearRect(0, 0, w, h);
        // soft vignette
        const g = ctx.createLinearGradient(0, 0, w, h);
        g.addColorStop(0, 'rgba(0,12,28,0.18)');
        g.addColorStop(1, 'rgba(0,6,12,0.28)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);

        // draw particles
        particles.forEach(p => {
            p.x += p.vx; p.y += p.vy;
            p.life--;
            if (p.x > w + 10) p.x = -10;
            if (p.x < -10) p.x = w + 10;
            if (p.y > h + 10) p.y = -10;
            if (p.y < -10) p.y = h + 10;
            ctx.beginPath();
            const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 12);
            gradient.addColorStop(0, `hsla(${p.hue}, 95%, 60%, 0.025)`);
            gradient.addColorStop(0.5, `hsla(${p.hue}, 95%, 60%, 0.012)`);
            gradient.addColorStop(1, 'rgba(255,255,255,0)');
            ctx.fillStyle = gradient;
            ctx.arc(p.x, p.y, p.r * 6, 0, Math.PI * 2);
            ctx.fill();

            // occasional small bright spark
            if (Math.random() > 0.996) {
                ctx.beginPath();
                ctx.fillStyle = `hsla(${p.hue},95%,60%,0.14)`;
                ctx.arc(p.x + rand(-6, 6), p.y + rand(-6, 6), rand(0.6, 1.6), 0, Math.PI * 2);
                ctx.fill();
            }
        });

        requestAnimationFrame(draw);
    }

    initParticles();
    draw();
})();

