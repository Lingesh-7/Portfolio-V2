/* ============================================================
   LINGESH R — script.js | Portfolio v3.1
   ============================================================ */

// ── Smooth scroll for nav links when already on homepage ─────
// On other pages (e.g. /contact), href="/#skills" does a full
// page load to / and the browser handles the hash scroll itself.
document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname !== '/') return;
  document.querySelectorAll('.nav-links a[href^="/#"]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const id = link.getAttribute('href').replace('/#', '');
      const target = document.getElementById(id);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });
});


// ── Navbar active link highlight ─────────────────────────────
window.addEventListener('scroll', () => {
  const sections = ['updates', 'skills', 'projects', 'achievements'];
  const navLinks = document.querySelectorAll('.nav-links a');
  let current = '';
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el && window.scrollY >= el.offsetTop - 130) current = id;
  });
  navLinks.forEach(a => {
    a.classList.toggle('nav-active', a.getAttribute('href') === '/#' + current);
  });
}, { passive: true });

// ── Custom Cursor ────────────────────────────────────────────
const cursorDot  = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');

if (cursorDot && cursorRing) {
  let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top  = mouseY + 'px';
  });

  (function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  })();

  document.querySelectorAll('a, button, .project-card, .impact-card, .skill-box').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorRing.style.width = '52px';
      cursorRing.style.height = '52px';
      cursorRing.style.borderColor = 'rgba(255,107,53,0.7)';
    });
    el.addEventListener('mouseleave', () => {
      cursorRing.style.width = '36px';
      cursorRing.style.height = '36px';
      cursorRing.style.borderColor = 'rgba(255,107,53,0.5)';
    });
  });
}

// ── Scroll Progress Bar ──────────────────────────────────────
const progressBar = document.querySelector('.scroll-progress');
if (progressBar) {
  window.addEventListener('scroll', () => {
    const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    progressBar.style.width = pct + '%';
  }, { passive: true });
}

// ── Reveal on Scroll ─────────────────────────────────────────
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── Typed.js ─────────────────────────────────────────────────
if (typeof Typed !== 'undefined' && document.querySelector('#typed-role')) {
  new Typed('#typed-role', {
    strings: ['AI Engineer', 'ML Engineer', 'Data Scientist', 'Problem Solver'],
    typeSpeed: 55, backSpeed: 30, backDelay: 1600, loop: true
  });
}

// ── Counter Animation ────────────────────────────────────────
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const target = +el.getAttribute('data-target');
    const start  = performance.now();
    const dur    = 1600;
    function step(now) {
      const t = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.floor(ease * target);
      if (t < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });
document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));

// ── Particles.js (lightweight) ───────────────────────────────
if (typeof particlesJS !== 'undefined' && document.querySelector('#particles-js')) {
  particlesJS('particles-js', {
    particles: {
      number: { value: 40 },
      color:  { value: '#ff6b35' },
      shape:  { type: 'circle' },
      opacity:{ value: 0.12, random: true },
      size:   { value: 2, random: true },
      line_linked: { enable: true, distance: 150, color: '#ff6b35', opacity: 0.07, width: 1 },
      move:   { enable: true, speed: 0.7, random: true }
    },
    interactivity: {
      events: { onhover: { enable: true, mode: 'grab' } },
      modes:  { grab: { distance: 140, line_linked: { opacity: 0.2 } } }
    },
    retina_detect: false
  });
}

// ── Carousel ─────────────────────────────────────────────────
(function initCarousel() {
  const track = document.querySelector('.updates-track');
  const dots  = document.querySelectorAll('.carousel-dot');
  const prev  = document.querySelector('.carousel-prev');
  const next  = document.querySelector('.carousel-next');
  if (!track) return;

  const slides = track.querySelectorAll('.update-card-wrap');
  let current = 0;

  function goTo(i) {
    current = (i + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, j) => d.classList.toggle('active', j === current));
  }

  dots.forEach((d, i) => d.addEventListener('click', () => goTo(i)));
  if (prev) prev.addEventListener('click', () => goTo(current - 1));
  if (next) next.addEventListener('click', () => goTo(current + 1));

  const carouselWrap = track.closest('.updates-carousel');
  let timer = setInterval(() => goTo(current + 1), 4000);
  if (carouselWrap) {
    carouselWrap.addEventListener('mouseenter', () => clearInterval(timer));
    carouselWrap.addEventListener('mouseleave', () => {
      timer = setInterval(() => goTo(current + 1), 4000);
    });
  }
  goTo(0);
})();

// ── 3D Card Tilt ─────────────────────────────────────────────
document.querySelectorAll('.project-card, .impact-card, .skill-box').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    card.style.transform = `perspective(700px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg) translateY(-5px)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

// ── Contact sent banner ───────────────────────────────────────
const params = new URLSearchParams(window.location.search);
if (params.get('sent') === 'true') {
  const banner = document.createElement('div');
  banner.style.cssText = `
    position:fixed; top:88px; left:50%; transform:translateX(-50%);
    background:#16161f; border:1px solid rgba(255,107,53,0.4);
    color:#e8e8f0; padding:13px 28px; border-radius:12px;
    font-family:'Space Mono',monospace; font-size:13px;
    box-shadow:0 10px 30px rgba(0,0,0,0.5); z-index:9999;
  `;
  banner.textContent = '✓ Message sent — I\'ll get back to you soon!';
  document.body.appendChild(banner);
  setTimeout(() => banner.remove(), 4000);
  history.replaceState({}, '', window.location.pathname);
}

// ── Skill Tabs ────────────────────────────────────────────────
(function initSkillTabs() {
  const tabs   = document.querySelectorAll('.skill-tab');
  const panels = document.querySelectorAll('.skill-panel');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-target');
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const panel = document.getElementById(target);
      if (panel) panel.classList.add('active');
    });
  });
})();