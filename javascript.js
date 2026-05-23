/* ============================================================
   PORTFOLIO — javascript.js
   Features:
   - Custom cursor
   - Particle canvas background
   - Theme toggle (dark/light)
   - Scroll animations (IntersectionObserver)
   - Navbar scroll effect
   - Discord webhook visitor logging
   - Smooth form & toast handling
   ============================================================ */

/* ─────────────────────────────────────────
   CONFIGURATION — Edit these values
───────────────────────────────────────── */
const CONFIG = {
  // ⚠️ Replace with your Discord webhook URL
  DISCORD_WEBHOOK: "https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN",

  // Replace with your real social usernames
  SOCIAL: {
    instagram: "yourusername",
    tiktok:    "yourusername",
    discord:   "yourinvite",
    github:    "yourusername",
  },

  // Site name shown in logs
  SITE_NAME: "Portfolio",
};

/* ─────────────────────────────────────────
   VISITOR LOGGING → Discord Webhook
───────────────────────────────────────── */
async function logVisitor() {
  try {
    // Gather visitor info
    const now     = new Date();
    const tzOff   = now.getTimezoneOffset();
    const tz      = Intl.DateTimeFormat().resolvedOptions().timeZone || "Unknown";
    const lang    = navigator.language || "Unknown";
    const ua      = navigator.userAgent;
    const ref     = document.referrer || "Direct";
    const screen  = `${window.screen.width}×${window.screen.height}`;
    const vp      = `${window.innerWidth}×${window.innerHeight}`;
    const page    = window.location.href;
    const ts      = now.toISOString().replace("T", " ").slice(0, 19) + " UTC";

    // Detect device
    const isMobile = /Mobi|Android|iPhone|iPad/i.test(ua);
    const device   = isMobile ? "📱 Mobile" : "💻 Desktop";

    // Try to get approximate location via public IP API
    let geo = { ip: "Unknown", city: "Unknown", country: "Unknown", isp: "Unknown" };
    try {
      const r = await fetch("https://ip-api.com/json/?fields=status,country,city,isp,query", { signal: AbortSignal.timeout(4000) });
      if (r.ok) {
        const d = await r.json();
        if (d.status === "success") {
          geo.ip      = d.query;
          geo.city    = d.city;
          geo.country = d.country;
          geo.isp     = d.isp;
        }
      }
    } catch (_) {}

    // Build Discord embed
    const payload = {
      username: "Portfolio Logs",
      avatar_url: "https://cdn.discordapp.com/embed/avatars/0.png",
      embeds: [{
        title: `🔔 New Visitor — ${CONFIG.SITE_NAME}`,
        color: 0x00f5a0,
        fields: [
          { name: "🌐 IP Address",      value: `\`${geo.ip}\``,      inline: true  },
          { name: "🏙️ City",            value: geo.city,             inline: true  },
          { name: "🌍 Country",          value: geo.country,          inline: true  },
          { name: "📡 ISP",              value: geo.isp,              inline: true  },
          { name: "🕐 Timestamp",        value: `\`${ts}\``,          inline: true  },
          { name: "🖥️ Device",           value: device,               inline: true  },
          { name: "📏 Screen",           value: `\`${screen}\``,      inline: true  },
          { name: "🪟 Viewport",         value: `\`${vp}\``,          inline: true  },
          { name: "🌐 Language",         value: lang,                  inline: true  },
          { name: "🔗 Referrer",         value: ref.slice(0, 100),    inline: false },
          { name: "📄 Page",             value: page.slice(0, 100),   inline: false },
          { name: "🕵️ User Agent",       value: `\`${ua.slice(0, 200)}\``, inline: false },
        ],
        footer: { text: `${CONFIG.SITE_NAME} • Visitor Logger` },
        timestamp: now.toISOString(),
      }],
    };

    await fetch(CONFIG.DISCORD_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

  } catch (err) {
    // Silently fail — never break UX
    console.warn("[Logger] Could not send log:", err.message);
  }
}

/* ─────────────────────────────────────────
   CURSOR
───────────────────────────────────────── */
(function initCursor() {
  const cursor   = document.getElementById("cursor");
  const follower = document.getElementById("cursorFollower");
  if (!cursor || !follower) return;

  let mx = -100, my = -100;
  let fx = -100, fy = -100;
  let raf;

  document.addEventListener("mousemove", (e) => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx + "px";
    cursor.style.top  = my + "px";
  });

  function animateFollower() {
    fx += (mx - fx) * 0.12;
    fy += (my - fy) * 0.12;
    follower.style.left = fx + "px";
    follower.style.top  = fy + "px";
    raf = requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Expand on interactive elements
  document.querySelectorAll("a, button, .social-btn, .work-card, .skill-card").forEach(el => {
    el.addEventListener("mouseenter", () => {
      cursor.style.width    = "20px";
      cursor.style.height   = "20px";
      follower.style.width  = "60px";
      follower.style.height = "60px";
      follower.style.opacity = "0.3";
    });
    el.addEventListener("mouseleave", () => {
      cursor.style.width    = "12px";
      cursor.style.height   = "12px";
      follower.style.width  = "36px";
      follower.style.height = "36px";
      follower.style.opacity = "0.5";
    });
  });
})();

/* ─────────────────────────────────────────
   PARTICLE CANVAS BACKGROUND
───────────────────────────────────────── */
(function initCanvas() {
  const canvas = document.getElementById("bgCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let W, H, particles = [], lines = [];
  const PARTICLE_COUNT = 60;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  function getAccent() {
    return getComputedStyle(document.documentElement)
      .getPropertyValue("--accent").trim() || "#00f5a0";
  }

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.r  = Math.random() * 1.5 + 0.5;
      this.a  = Math.random() * 0.5 + 0.1;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W) this.vx *= -1;
      if (this.y < 0 || this.y > H) this.vy *= -1;
    }
    draw(accent) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = accent + Math.floor(this.a * 255).toString(16).padStart(2, "0");
      ctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

  let mouse = { x: W / 2, y: H / 2 };
  document.addEventListener("mousemove", e => { mouse.x = e.clientX; mouse.y = e.clientY; });

  function drawLines(accent) {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const alpha = (1 - dist / 120) * 0.12;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = accent + Math.floor(alpha * 255).toString(16).padStart(2, "0");
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
      // connect to mouse
      const mx  = particles[i].x - mouse.x;
      const my  = particles[i].y - mouse.y;
      const md  = Math.sqrt(mx * mx + my * my);
      if (md < 150) {
        const a = (1 - md / 150) * 0.25;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = accent + Math.floor(a * 255).toString(16).padStart(2, "0");
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    }
  }

  // Floating geometric shapes
  const shapes = Array.from({ length: 5 }, (_, i) => ({
    x: Math.random() * W, y: Math.random() * H,
    size: Math.random() * 60 + 30,
    rot: Math.random() * Math.PI * 2,
    rotV: (Math.random() - 0.5) * 0.003,
    vx: (Math.random() - 0.5) * 0.15,
    vy: (Math.random() - 0.5) * 0.15,
    type: i % 3, // 0=square, 1=triangle, 2=hexagon
  }));

  function drawShape(s, accent) {
    ctx.save();
    ctx.translate(s.x, s.y);
    ctx.rotate(s.rot);
    ctx.strokeStyle = accent + "18";
    ctx.lineWidth = 1;
    ctx.beginPath();

    if (s.type === 0) {
      ctx.rect(-s.size / 2, -s.size / 2, s.size, s.size);
    } else if (s.type === 1) {
      for (let i = 0; i < 3; i++) {
        const a = (i / 3) * Math.PI * 2 - Math.PI / 2;
        i === 0 ? ctx.moveTo(Math.cos(a) * s.size, Math.sin(a) * s.size)
                : ctx.lineTo(Math.cos(a) * s.size, Math.sin(a) * s.size);
      }
      ctx.closePath();
    } else {
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        i === 0 ? ctx.moveTo(Math.cos(a) * s.size, Math.sin(a) * s.size)
                : ctx.lineTo(Math.cos(a) * s.size, Math.sin(a) * s.size);
      }
      ctx.closePath();
    }
    ctx.stroke();
    ctx.restore();

    s.rot += s.rotV;
    s.x += s.vx;
    s.y += s.vy;
    if (s.x < -100 || s.x > W + 100) s.vx *= -1;
    if (s.y < -100 || s.y > H + 100) s.vy *= -1;
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    const accent = getAccent();
    particles.forEach(p => { p.update(); p.draw(accent); });
    drawLines(accent);
    shapes.forEach(s => drawShape(s, accent));
    requestAnimationFrame(loop);
  }
  loop();
})();

/* ─────────────────────────────────────────
   THEME TOGGLE
───────────────────────────────────────── */
(function initTheme() {
  const btn  = document.getElementById("themeToggle");
  const icon = document.getElementById("toggleIcon");
  const html = document.documentElement;

  const saved = localStorage.getItem("theme") || "dark";
  html.setAttribute("data-theme", saved);
  icon.textContent = saved === "dark" ? "☀" : "🌙";

  btn?.addEventListener("click", () => {
    const current = html.getAttribute("data-theme");
    const next    = current === "dark" ? "light" : "dark";
    html.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    icon.textContent = next === "dark" ? "☀" : "🌙";
    // Animate icon
    icon.style.transform = "rotate(360deg)";
    setTimeout(() => { icon.style.transform = ""; }, 400);
  });
})();

/* ─────────────────────────────────────────
   NAVBAR SCROLL EFFECT
───────────────────────────────────────── */
(function initNavbar() {
  const nav = document.getElementById("navbar");
  window.addEventListener("scroll", () => {
    nav?.classList.toggle("scrolled", window.scrollY > 60);
  }, { passive: true });
})();

/* ─────────────────────────────────────────
   SCROLL REVEAL — IntersectionObserver
───────────────────────────────────────── */
(function initReveal() {
  // Skill cards
  const skillCards = document.querySelectorAll(".skill-card");
  skillCards.forEach((el, i) => { el.style.setProperty("--d", i); });

  // Work cards
  const workCards = document.querySelectorAll(".work-card");

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });

  [...skillCards, ...workCards].forEach(el => obs.observe(el));

  // Generic reveal
  const reveals = document.querySelectorAll(".reveal");
  const revObs  = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  reveals.forEach(el => revObs.observe(el));

  // Section titles animate
  const titles = document.querySelectorAll(".section-title, .about-text, .about-stats, .about-tags");
  const titleObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity   = "1";
        entry.target.style.transform = "translateY(0)";
        titleObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  titles.forEach((el, i) => {
    el.style.opacity   = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = `opacity 0.7s ${i * 0.1}s ease, transform 0.7s ${i * 0.1}s ease`;
    titleObs.observe(el);
  });
})();

/* ─────────────────────────────────────────
   TOAST NOTIFICATION
───────────────────────────────────────── */
function showToast(msg, duration = 3500) {
  const toast  = document.getElementById("toast");
  const toastMsg = document.getElementById("toastMsg");
  if (!toast || !toastMsg) return;
  toastMsg.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), duration);
}

/* ─────────────────────────────────────────
   CONTACT FORM
───────────────────────────────────────── */
(function initForm() {
  const btn = document.getElementById("sendBtn");
  if (!btn) return;

  btn.addEventListener("click", async () => {
    const name  = document.getElementById("nameInput")?.value.trim();
    const email = document.getElementById("emailInput")?.value.trim();
    const msg   = document.getElementById("msgInput")?.value.trim();

    if (!name || !email || !msg) {
      showToast("⚠️ Please fill in all fields.");
      return;
    }

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(email)) {
      showToast("⚠️ Invalid email address.");
      return;
    }

    // Visual feedback
    btn.disabled = true;
    btn.querySelector("span").textContent = "Sending...";

    // Send contact via webhook too
    try {
      const payload = {
        username: "Portfolio — Contact Form",
        embeds: [{
          title: "📬 New Contact Message",
          color: 0x00d9f5,
          fields: [
            { name: "👤 Name",    value: name,  inline: true },
            { name: "📧 Email",   value: email, inline: true },
            { name: "💬 Message", value: msg,   inline: false },
          ],
          timestamp: new Date().toISOString(),
          footer: { text: CONFIG.SITE_NAME + " • Contact Form" },
        }],
      };
      await fetch(CONFIG.DISCORD_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (_) {}

    // Clear form
    ["nameInput", "emailInput", "msgInput"].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = "";
    });

    btn.disabled = false;
    btn.querySelector("span").textContent = "Send Message";
    showToast("✅ Message sent! I'll get back to you soon.");
  });
})();

/* ─────────────────────────────────────────
   TYPING EFFECT — hero subtitle
───────────────────────────────────────── */
(function initTyping() {
  const el = document.querySelector(".hero-sub");
  if (!el) return;

  const lines = [
    "I build immersive digital experiences that live at the\nintersection of design & technology.",
    "Crafting seamless interfaces that users\nactually love to interact with.",
    "Turning complex problems into\nbeautiful, simple solutions.",
  ];

  let lineIdx = 0;
  let charIdx = 0;
  let deleting = false;
  let paused   = false;

  function type() {
    if (paused) return;
    const current = lines[lineIdx];

    if (!deleting) {
      charIdx++;
      el.innerHTML = current.slice(0, charIdx).replace("\n", "<br/>");
      if (charIdx === current.length) {
        paused = true;
        setTimeout(() => { deleting = true; paused = false; }, 2800);
      } else {
        setTimeout(type, 38);
      }
    } else {
      charIdx--;
      el.innerHTML = current.slice(0, charIdx).replace("\n", "<br/>");
      if (charIdx === 0) {
        deleting  = false;
        lineIdx   = (lineIdx + 1) % lines.length;
        setTimeout(type, 400);
      } else {
        setTimeout(type, 18);
      }
    }
  }

  // Start after initial animation delay
  setTimeout(type, 1200);
})();

/* ─────────────────────────────────────────
   SMOOTH ACTIVE NAV LINKS
───────────────────────────────────────── */
(function initActiveNav() {
  const links    = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("section[id]");

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.remove("active"));
        const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        active?.classList.add("active");
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => obs.observe(s));

  // Add active style
  const style = document.createElement("style");
  style.textContent = `.nav-link.active { color: var(--accent); }
  .nav-link.active::after { width: 100%; }`;
  document.head.appendChild(style);
})();

/* ─────────────────────────────────────────
   PARALLAX — hero title on scroll
───────────────────────────────────────── */
(function initParallax() {
  const hero = document.querySelector(".hero-title");
  if (!hero) return;
  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    hero.style.transform = `translateY(${y * 0.18}px)`;
    hero.style.opacity   = Math.max(0, 1 - y / 500);
  }, { passive: true });
})();

/* ─────────────────────────────────────────
   GLITCH EFFECT — hover on logo
───────────────────────────────────────── */
(function initGlitch() {
  const logo = document.querySelector(".nav-logo");
  if (!logo) return;

  const style = document.createElement("style");
  style.textContent = `
    .nav-logo { position: relative; cursor: default; user-select: none; }
    .nav-logo.glitch::before,
    .nav-logo.glitch::after {
      content: attr(data-text);
      position: absolute; inset: 0;
      font-family: 'Space Mono', monospace;
      font-size: inherit; font-weight: inherit;
    }
    .nav-logo.glitch::before {
      color: #00f5a0; clip-path: polygon(0 30%, 100% 30%, 100% 60%, 0 60%);
      transform: translateX(-2px); animation: glitchA 0.2s infinite;
    }
    .nav-logo.glitch::after {
      color: #00d9f5; clip-path: polygon(0 60%, 100% 60%, 100% 80%, 0 80%);
      transform: translateX(2px); animation: glitchB 0.3s infinite;
    }
    @keyframes glitchA {
      0%, 100% { transform: translateX(-2px) skewX(0); }
      50% { transform: translateX(2px) skewX(-2deg); }
    }
    @keyframes glitchB {
      0%, 100% { transform: translateX(2px) skewX(0); }
      50% { transform: translateX(-2px) skewX(2deg); }
    }
  `;
  document.head.appendChild(style);

  logo.setAttribute("data-text", logo.textContent);
  logo.addEventListener("mouseenter", () => logo.classList.add("glitch"));
  logo.addEventListener("mouseleave", () => logo.classList.remove("glitch"));
})();

/* ─────────────────────────────────────────
   INIT — Fire everything on load
───────────────────────────────────────── */
window.addEventListener("DOMContentLoaded", () => {
  // Log visitor after a tiny delay (non-blocking)
  setTimeout(logVisitor, 800);

  // Animate hero elements
  document.querySelectorAll(".animate-in").forEach(el => {
    el.style.animationPlayState = "running";
  });
});
