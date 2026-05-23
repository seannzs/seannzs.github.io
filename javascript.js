/* ===========================
   JAVASCRIPT - LINK HUB
=========================== */

// ── Loader ──────────────────────────────────────────────
const loader      = document.getElementById('loader');
const mainContent = document.getElementById('mainContent');

window.addEventListener('load', () => {
  setTimeout(() => {
    loader.classList.add('hidden');
    mainContent.classList.add('visible');
    startEntranceAnimations();
  }, 1400);
});

// ── Entrance Animations for Cards ───────────────────────
function startEntranceAnimations() {
  const cards = document.querySelectorAll('.link-card');
  cards.forEach((card, i) => {
    card.style.animationDelay = `${1.0 + i * 0.1}s`;
  });
}

// ── Custom Cursor ────────────────────────────────────────
const cursor         = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursorFollower');
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});

// Smooth follower
function animateFollower() {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;
  cursorFollower.style.left = followerX + 'px';
  cursorFollower.style.top  = followerY + 'px';
  requestAnimationFrame(animateFollower);
}
animateFollower();

// Hover effect on interactive elements
const hoverEls = document.querySelectorAll('a, .stat-pill, .avatar');
hoverEls.forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.background = 'var(--cyan)';
    cursorFollower.classList.add('hovered');
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.background = 'var(--pink)';
    cursorFollower.classList.remove('hovered');
  });
});

// ── Particles Canvas ─────────────────────────────────────
const canvas  = document.getElementById('particles');
const ctx     = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const COLORS = ['#ff6eb4', '#b06ef3', '#5ee7ff', '#5ef0a6', '#ffe66d', '#ff9f5a'];

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x     = Math.random() * canvas.width;
    this.y     = Math.random() * canvas.height;
    this.size  = Math.random() * 2.5 + 0.5;
    this.speedX= (Math.random() - 0.5) * 0.4;
    this.speedY= (Math.random() - 0.5) * 0.4;
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    this.alpha = Math.random() * 0.5 + 0.1;
    this.life  = 0;
    this.maxLife = Math.random() * 300 + 200;
  }
  update() {
    this.x    += this.speedX;
    this.y    += this.speedY;
    this.life++;
    if (this.life > this.maxLife) this.reset();
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha * (1 - this.life / this.maxLife);
    ctx.fillStyle   = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur  = 8;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

for (let i = 0; i < 70; i++) particles.push(new Particle());

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ── Stars ─────────────────────────────────────────────────
const starsContainer = document.getElementById('stars');
const STAR_COUNT = 60;

for (let i = 0; i < STAR_COUNT; i++) {
  const star = document.createElement('div');
  star.classList.add('star');
  star.style.left   = Math.random() * 100 + 'vw';
  star.style.top    = Math.random() * 100 + 'vh';
  star.style.setProperty('--dur',     (Math.random() * 3 + 2) + 's');
  star.style.setProperty('--delay',   (Math.random() * 4) + 's');
  star.style.setProperty('--opacity', (Math.random() * 0.5 + 0.3).toString());
  starsContainer.appendChild(star);
}

// ── Click Ripple ──────────────────────────────────────────
const rippleContainer = document.getElementById('rippleContainer');

document.addEventListener('click', (e) => {
  createRipple(e.clientX, e.clientY);
});

function createRipple(x, y) {
  const ripple   = document.createElement('div');
  const color    = COLORS[Math.floor(Math.random() * COLORS.length)];
  ripple.classList.add('ripple');
  ripple.style.left             = x + 'px';
  ripple.style.top              = y + 'px';
  ripple.style.border           = `2px solid ${color}`;
  ripple.style.boxShadow        = `0 0 10px ${color}`;
  rippleContainer.appendChild(ripple);
  ripple.addEventListener('animationend', () => ripple.remove());
}

// ── Link Card Click Effect ────────────────────────────────
document.querySelectorAll('.link-card').forEach(card => {
  card.addEventListener('click', function (e) {
    // Burst effect from center of card
    const rect = this.getBoundingClientRect();
    const cx   = rect.left + rect.width  / 2;
    const cy   = rect.top  + rect.height / 2;

    for (let i = 0; i < 5; i++) {
      setTimeout(() => createRipple(
        cx + (Math.random() - 0.5) * 40,
        cy + (Math.random() - 0.5) * 20
      ), i * 60);
    }

    // Wobble animation
    this.style.animation = 'none';
    this.style.transition = 'transform 0.1s ease';
    this.style.transform  = 'scale(0.94)';
    setTimeout(() => {
      this.style.transform = '';
      this.style.transition = '';
    }, 150);
  });
});

// ── Scroll Reveal ─────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Add reveal to key elements after DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll(
    '.profile-section, .section-divider, .links-section, .footer'
  );
  sections.forEach(s => {
    s.classList.add('reveal');
    revealObserver.observe(s);
  });
});

// ── Avatar Easter Egg ─────────────────────────────────────
const avatar = document.getElementById('avatar');
const emojis = ['🐱','🦊','🐸','🐼','🦄','🐧','🦋','🐙','🌟','🎭'];
let emojiIdx = 0;

avatar.addEventListener('click', () => {
  emojiIdx = (emojiIdx + 1) % emojis.length;
  const el = avatar.querySelector('.avatar-emoji');

  el.style.transform  = 'scale(0) rotate(-30deg)';
  el.style.transition = 'transform 0.2s ease';

  setTimeout(() => {
    el.textContent = emojis[emojiIdx];
    el.style.transform = 'scale(1.3) rotate(10deg)';
    setTimeout(() => {
      el.style.transform = 'scale(1) rotate(0deg)';
    }, 150);
  }, 150);

  // Burst particles
  const rect = avatar.getBoundingClientRect();
  for (let i = 0; i < 8; i++) {
    setTimeout(() => createRipple(
      rect.left + rect.width  / 2 + (Math.random() - 0.5) * 60,
      rect.top  + rect.height / 2 + (Math.random() - 0.5) * 60
    ), i * 50);
  }
});

// ── Parallax Blobs on Mouse ───────────────────────────────
let blobRafId;
const blobs = document.querySelectorAll('.blob');

document.addEventListener('mousemove', (e) => {
  cancelAnimationFrame(blobRafId);
  blobRafId = requestAnimationFrame(() => {
    const cx = e.clientX / window.innerWidth  - 0.5;
    const cy = e.clientY / window.innerHeight - 0.5;
    blobs.forEach((blob, i) => {
      const factor = (i + 1) * 12;
      blob.style.transform = `translate(${cx * factor}px, ${cy * factor}px)`;
    });
  });
});

// ── Stat Pill Hover Sound (visual feedback) ───────────────
document.querySelectorAll('.stat-pill').forEach(pill => {
  pill.addEventListener('mouseenter', () => {
    pill.style.transform = 'translateY(-3px) scale(1.06)';
  });
  pill.addEventListener('mouseleave', () => {
    pill.style.transform = '';
  });
});

// ── Floating Particles on Link Card Hover ─────────────────
document.querySelectorAll('.link-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    spawnCardParticles(card);
  });
});

function spawnCardParticles(card) {
  const rect  = card.getBoundingClientRect();
  const count = 4;
  for (let i = 0; i < count; i++) {
    const dot = document.createElement('div');
    dot.style.cssText = `
      position: fixed;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      pointer-events: none;
      z-index: 9005;
      background: ${COLORS[Math.floor(Math.random() * COLORS.length)]};
      left: ${rect.left + Math.random() * rect.width}px;
      top: ${rect.top + rect.height / 2}px;
      transition: transform 0.6s ease, opacity 0.6s ease;
      opacity: 1;
    `;
    document.body.appendChild(dot);
    requestAnimationFrame(() => {
      const angle = (Math.random() - 0.5) * Math.PI;
      const dist  = 30 + Math.random() * 40;
      dot.style.transform = `translate(${Math.cos(angle)*dist}px, ${-dist}px) scale(0)`;
      dot.style.opacity   = '0';
    });
    setTimeout(() => dot.remove(), 650);
  }
}

// ── Page visibility – pause/resume animations ─────────────
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    canvas.style.animationPlayState = 'paused';
  } else {
    canvas.style.animationPlayState = 'running';
  }
});

// ── Tilt Effect on Cards ──────────────────────────────────
document.querySelectorAll('.link-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect   = card.getBoundingClientRect();
    const x      = (e.clientX - rect.left) / rect.width  - 0.5;
    const y      = (e.clientY - rect.top)  / rect.height - 0.5;
    const tiltX  = y * 8;
    const tiltY  = -x * 8;
    card.style.transform = `translateY(-6px) scale(1.02) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    card.style.perspective = '600px';
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.perspective = '';
  });
});

console.log('%c 🌸 KumiChan Link Hub', 'font-size:18px; color:#ff6eb4; font-weight:bold;');
console.log('%c Made with love & code ✨', 'font-size:13px; color:#b06ef3;');
