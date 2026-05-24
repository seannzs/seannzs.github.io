/* ═══════════════════════════════════════════
   DISCORD LANDING PAGE — javascript.js
   All logic: config, animations, particles,
   cursor, scroll, intersection observer
═══════════════════════════════════════════ */

'use strict';

// ── CONFIG LOADER ─────────────────────────────
async function loadConfig() {
  try {
    const res = await fetch('./config.json');
    if (!res.ok) throw new Error('Failed to load config.json');
    return await res.json();
  } catch (err) {
    console.warn('Config load failed, using defaults:', err);
    return null;
  }
}

// ── APPLY CONFIG TO DOM ────────────────────────
function applyConfig(cfg) {
  const p = cfg.profile;
  const l = cfg.links;
  const s = cfg.seo;

  // SEO
  document.getElementById('page-title').textContent        = s.title;
  document.getElementById('page-description').content     = s.description;
  document.documentElement.style.setProperty('--accent',   p.accentColor || '#8b5cf6');
  document.documentElement.style.setProperty('--neon',     p.bannerColor || '#7c3aed');

  // Navbar
  setText('nav-server-name', p.serverName);

  // Hero
  setText('hero-category',    p.category);
  setText('hero-server-name', p.serverName);
  setText('hero-tagline',     p.tagline);
  setText('hero-desc',        p.description);

  // Avatar (hero + about card)
  ['hero-avatar', 'about-avatar'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.src = p.avatarUrl;
  });

  // About card
  setText('acard-server-name', p.serverName);
  setText('acard-category',    p.category);
  setText('about-desc',        p.description);

  // Stats grid
  buildStats(cfg.stats);

  // Features grid
  buildFeatures(cfg.features);

  // About tags (built from features)
  buildAboutTags(cfg.features);

  // Join section
  setText('join-sub', p.description);
  setText('join-member-count', p.memberCount + ' members have joined');

  // Footer
  setText('footer-server-name', p.serverName);
  setText('footer-copy', `© ${new Date().getFullYear()} ${p.serverName} — All rights reserved.`);

  // All Discord links
  setLinks('discord', l.discord, [
    'nav-discord-link', 'hero-discord-btn', 'about-discord-btn',
    'join-discord-btn', 'footer-discord', 'mob-discord-link'
  ]);

  // All TikTok links
  setLinks('tiktok', l.tiktok, [
    'hero-tiktok-btn', 'join-tiktok-btn', 'footer-tiktok'
  ]);
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el && text) el.textContent = text;
}

function setLinks(type, url, ids) {
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el && url) {
      el.href = url;
      el.target = '_blank';
      el.rel = 'noopener noreferrer';
    }
  });
}

function buildStats(stats) {
  const grid = document.getElementById('statsGrid');
  if (!grid || !stats) return;
  grid.innerHTML = '';
  stats.forEach((stat, i) => {
    const delay = i * 0.12;
    const card = document.createElement('div');
    card.className = 'stat-card reveal-up';
    card.style.transitionDelay = `${delay}s`;
    card.innerHTML = `
      <div class="stat-icon">${stat.icon}</div>
      <span class="stat-value" data-target="${stat.value}">${stat.value}</span>
      <span class="stat-label">${stat.label}</span>
    `;
    grid.appendChild(card);
  });
}

function buildFeatures(features) {
  const grid = document.getElementById('featuresGrid');
  if (!grid || !features) return;
  grid.innerHTML = '';
  features.forEach((feat, i) => {
    const delay = (i % 3) * 0.12;
    const card = document.createElement('div');
    card.className = 'feature-card reveal-up';
    card.style.transitionDelay = `${delay}s`;
    card.innerHTML = `
      <div class="feature-icon-wrap">${feat.icon}</div>
      <h3 class="feature-title">${feat.title}</h3>
      <p class="feature-desc">${feat.description}</p>
    `;
    grid.appendChild(card);
  });
}

function buildAboutTags(features) {
  const container = document.getElementById('aboutTags');
  if (!container || !features) return;
  container.innerHTML = '';
  features.forEach(feat => {
    const tag = document.createElement('span');
    tag.className = 'about-tag';
    tag.textContent = `${feat.icon} ${feat.title}`;
    container.appendChild(tag);
  });
}

// ── CUSTOM CURSOR ──────────────────────────────
function initCursor() {
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  let mx = 0, my = 0;
  let rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
  });

  function animateCursor() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  const hoverEls = document.querySelectorAll('a, button, .stat-card, .feature-card, .acard-front');
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovering'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovering'));
  });
}

// ── PARTICLE CANVAS ────────────────────────────
function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const COLORS = ['#8b5cf6', '#a78bfa', '#ec4899', '#06b6d4', '#c4b5fd'];

  function rand(a, b) { return Math.random() * (b - a) + a; }

  function createParticle() {
    return {
      x: rand(0, W),
      y: rand(0, H),
      r: rand(0.5, 2),
      vx: rand(-0.3, 0.3),
      vy: rand(-0.4, -0.1),
      alpha: rand(0.1, 0.6),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      life: rand(80, 200),
      age: 0
    };
  }

  for (let i = 0; i < 80; i++) particles.push(createParticle());

  let scrollY = 0;
  window.addEventListener('scroll', () => { scrollY = window.scrollY; });

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach((p, idx) => {
      p.age++;
      p.x += p.vx;
      p.y += p.vy - scrollY * 0.0005;

      const fade = Math.min(p.age / 30, 1) * Math.min((p.life - p.age) / 30, 1);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha * fade;
      ctx.fill();
      ctx.globalAlpha = 1;

      if (p.age >= p.life || p.y < -10 || p.x < -10 || p.x > W + 10) {
        particles[idx] = createParticle();
        particles[idx].y = H + 5;
      }
    });

    // Subtle connection lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = '#8b5cf6';
          ctx.globalAlpha = (1 - dist / 100) * 0.08;
          ctx.lineWidth = 0.5;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
}

// ── NAVBAR SCROLL ──────────────────────────────
function initNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  // Burger
  const burger = document.getElementById('navBurger');
  const menu   = document.getElementById('mobileMenu');
  if (burger && menu) {
    burger.addEventListener('click', () => {
      menu.classList.toggle('open');
    });
    // Close on link click
    menu.querySelectorAll('.mob-link').forEach(link => {
      link.addEventListener('click', () => menu.classList.remove('open'));
    });
  }
}

// ── INTERSECTION OBSERVER (SCROLL REVEALS) ─────
function initScrollReveal() {
  const els = document.querySelectorAll(
    '.reveal-up, .reveal-left, .reveal-right, .reveal-scale'
  );

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => obs.observe(el));
}

// ── HERO PARALLAX ──────────────────────────────
function initParallax() {
  const glows = [
    document.querySelector('.hero-glow-1'),
    document.querySelector('.hero-glow-2'),
    document.querySelector('.hero-glow-3'),
  ];
  window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    if (glows[0]) glows[0].style.transform = `translate(${sy * 0.04}px, ${sy * 0.08}px)`;
    if (glows[1]) glows[1].style.transform = `translate(${-sy * 0.03}px, ${-sy * 0.06}px)`;
    if (glows[2]) glows[2].style.transform = `translate(-50%, calc(-50% + ${sy * 0.05}px))`;
  }, { passive: true });

  // Floating cards parallax on mouse move
  const cards = document.querySelectorAll('.float-card');
  document.addEventListener('mousemove', e => {
    const cx = (e.clientX / window.innerWidth  - 0.5) * 20;
    const cy = (e.clientY / window.innerHeight - 0.5) * 20;
    cards.forEach((card, i) => {
      const depth = (i + 1) * 0.4;
      card.style.transform = `translate(${cx * depth}px, ${cy * depth}px)`;
    });
  });
}

// ── STAT COUNTER ANIMATION ─────────────────────
function initCounters() {
  const statEls = document.querySelectorAll('.stat-value');

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const raw = el.dataset.target || el.textContent;
      const suffix = raw.replace(/[\d,.]/g, '');
      const num = parseFloat(raw.replace(/[^\d.]/g, ''));
      if (isNaN(num)) return;

      const duration = 1800;
      const start = performance.now();

      function step(now) {
        const p = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        const current = num * ease;
        el.textContent = (current >= 1000
          ? (current / 1000).toFixed(1) + 'K'
          : Math.floor(current).toString()
        ) + suffix;
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = raw;
      }
      requestAnimationFrame(step);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });

  statEls.forEach(el => obs.observe(el));
}

// ── FEATURE CARD TILT ──────────────────────────
function initCardTilt() {
  const cards = document.querySelectorAll('.feature-card, .stat-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `
        translateY(-8px)
        rotateX(${-y * 8}deg)
        rotateY(${x * 8}deg)
      `;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// ── ABOUT CARD 3D ──────────────────────────────
function initAboutCard() {
  const card = document.querySelector('.acard-front');
  if (!card) return;
  const parent = card.closest('.about-visual');
  if (!parent) return;

  parent.addEventListener('mousemove', e => {
    const rect = parent.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `
      translateY(-6px)
      rotateY(${x * 12}deg)
      rotateX(${-y * 8}deg)
    `;
  });
  parent.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
}

// ── SMOOTH ANCHOR SCROLL ───────────────────────
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

// ── HERO TITLE GLITCH HOVER ────────────────────
function initGlitch() {
  const title = document.querySelector('.hero-title');
  if (!title) return;

  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&';
  const original = title.textContent;
  let interval = null;

  title.addEventListener('mouseenter', () => {
    let iter = 0;
    clearInterval(interval);
    interval = setInterval(() => {
      title.textContent = original.split('').map((c, i) => {
        if (i < iter) return original[i];
        if (c === ' ') return ' ';
        return chars[Math.floor(Math.random() * chars.length)];
      }).join('');
      if (iter >= original.length) clearInterval(interval);
      iter += 1.5;
    }, 30);
  });

  title.addEventListener('mouseleave', () => {
    clearInterval(interval);
    title.textContent = original;
  });
}

// ── STAGGERED SECTION ENTRANCE ─────────────────
function initSectionStagger() {
  // Re-observe after DOM is fully built (for dynamically added cards)
  setTimeout(() => {
    const els = document.querySelectorAll(
      '.stat-card, .feature-card, .about-tag'
    );
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
    els.forEach(el => {
      if (!el.classList.contains('visible')) obs.observe(el);
    });
  }, 300);
}

// ── JOIN SECTION RING MOUSE FOLLOW ─────────────
function initJoinRings() {
  const section = document.querySelector('.join-section');
  const glow    = document.querySelector('.join-glow');
  if (!section || !glow) return;

  section.addEventListener('mousemove', e => {
    const rect = section.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    glow.style.transform = `translate(calc(${x}px - 50%), calc(${y}px - 50%))`;
  });
  section.addEventListener('mouseleave', () => {
    glow.style.transform = 'translate(-50%, -50%)';
  });
}

// ── MARQUEE SPEED ON SCROLL ────────────────────
function initMarquee() {
  const marquee = document.querySelector('.marquee-inner');
  if (!marquee) return;
  let speed = 25;

  window.addEventListener('scroll', () => {
    const velocity = Math.abs(window.scrollY - (window._lastScrollY || 0));
    window._lastScrollY = window.scrollY;
    speed = Math.max(8, 25 - velocity * 0.5);
    marquee.style.animationDuration = speed + 's';
  }, { passive: true });
}

// ── INIT ───────────────────────────────────────
async function init() {
  const cfg = await loadConfig();
  if (cfg) applyConfig(cfg);

  // Small delay to ensure DOM is updated before animations
  await new Promise(r => setTimeout(r, 50));

  initCursor();
  initParticles();
  initNavbar();
  initScrollReveal();
  initParallax();
  initCounters();
  initCardTilt();
  initAboutCard();
  initSmoothScroll();
  initGlitch();
  initSectionStagger();
  initJoinRings();
  initMarquee();

  // Hero entrance: trigger visible on load
  document.querySelectorAll('.hero .reveal-up').forEach(el => {
    setTimeout(() => el.classList.add('visible'),
      100 + parseInt(el.style.transitionDelay || '0') * 1000);
  });
}

document.addEventListener('DOMContentLoaded', init);
