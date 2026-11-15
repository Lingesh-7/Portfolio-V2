/* ============================================================
   LINGESH R | script.js | Portfolio v6 (no external libraries)
   ============================================================ */

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

// ── Navbar: scrolled state + progress bar ─────────────────────
(function initNavAndProgress() {
  const nav = $('.navbar-custom');
  const bar = $('.scroll-progress');
  let ticking = false;
  function update() {
    const y = window.scrollY;
    if (nav) nav.classList.toggle('scrolled', y > 24);
    if (bar) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
    }
    ticking = false;
  }
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  update();
})();

// ── Mobile menu ───────────────────────────────────────────────
(function initMobileMenu() {
  const btn = $('#navHamburger');
  const menu = $('#mobileMenu');
  if (!btn || !menu) return;
  const set = open => {
    btn.classList.toggle('open', open);
    menu.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
  };
  btn.addEventListener('click', () => set(!menu.classList.contains('open')));
  $$('.mobile-link', menu).forEach(a => a.addEventListener('click', () => set(false)));
  document.addEventListener('click', e => { if (!menu.contains(e.target) && !btn.contains(e.target)) set(false); });
  window.addEventListener('resize', () => { if (window.innerWidth > 960) set(false); });
})();

// ── Scroll reveal ─────────────────────────────────────────────
(function initReveal() {
  const items = $$('.reveal');
  if (!('IntersectionObserver' in window) || prefersReducedMotion) {
    items.forEach(el => el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  items.forEach(el => io.observe(el));
})();

// ── Active section highlight in the nav ───────────────────────
(function initActiveSection() {
  const links = $$('.nav-links a[data-section]');
  if (!links.length || !('IntersectionObserver' in window)) return;
  const map = new Map();
  links.forEach(a => { const s = document.getElementById(a.dataset.section); if (s) map.set(s, a); });
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      links.forEach(l => l.classList.remove('active'));
      const link = map.get(e.target);
      if (link) link.classList.add('active');
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  map.forEach((_, section) => io.observe(section));
})();

// ── Typed role line ───────────────────────────────────────────
(function initTyped() {
  const el = $('#typed-role');
  if (!el || prefersReducedMotion) return;
  const roles = ['Agentic AI Engineer', 'LLM Application Developer', 'RAG Systems Builder', 'AI Automation Engineer', 'Generative AI Developer'];
  let r = 0, i = roles[0].length, deleting = true;
  function tick() {
    const word = roles[r];
    el.textContent = word.slice(0, i);
    let delay = deleting ? 28 : 62;
    if (!deleting && i === word.length) { deleting = true; delay = 1700; }
    else if (deleting && i === 0) { deleting = false; r = (r + 1) % roles.length; delay = 280; }
    else i += deleting ? -1 : 1;
    setTimeout(tick, delay);
  }
  setTimeout(tick, 1800);
})();

// ── Hero neural-network backdrop ──────────────────────────────
(function initNetwork() {
  const cv = $('#netCanvas');
  if (!cv || !cv.getContext) return;
  const ctx = cv.getContext('2d');
  const LINK = 135;
  let c1 = '255,122,89', c2 = '167,139,250';
  const readColors = () => { const cs = getComputedStyle(document.documentElement); c1 = cs.getPropertyValue('--a1').trim() || c1; c2 = cs.getPropertyValue('--a2').trim() || c2; };
  readColors(); window.addEventListener('themechange', readColors);
  let w = 0, h = 0, nodes = [], visible = true, raf = 0;
  const mouse = { x: -9999, y: -9999 };

  function resize() {
    const r = cv.parentElement.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = r.width; h = r.height;
    cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.max(26, Math.min(90, Math.round(w * h / 15000)));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.32, vy: (Math.random() - 0.5) * 0.32,
      r: Math.random() * 1.6 + 0.9, k: Math.random() < 0.5 ? 0 : 1
    }));
    draw();
  }

  function step() {
    for (const n of nodes) {
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > w) n.vx *= -1;
      if (n.y < 0 || n.y > h) n.vy *= -1;
    }
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    for (let a = 0; a < nodes.length; a++) {
      const A = nodes[a];
      for (let b = a + 1; b < nodes.length; b++) {
        const B = nodes[b];
        const d = Math.hypot(A.x - B.x, A.y - B.y);
        if (d < LINK) {
          ctx.strokeStyle = `rgba(${A.k ? c2 : c1},${(1 - d / LINK) * 0.35})`;
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(B.x, B.y); ctx.stroke();
        }
      }
      const dm = Math.hypot(A.x - mouse.x, A.y - mouse.y);
      if (dm < 170) {
        ctx.strokeStyle = `rgba(${c2},${(1 - dm / 170) * 0.6})`;
        ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
      }
      ctx.fillStyle = `rgba(${A.k ? c2 : c1},0.9)`;
      ctx.beginPath(); ctx.arc(A.x, A.y, A.r, 0, Math.PI * 2); ctx.fill();
    }
  }

  function loop() {
    if (visible && !document.hidden) { step(); draw(); }
    raf = requestAnimationFrame(loop);
  }

  window.addEventListener('resize', resize);
  const hero = cv.closest('.hero');
  if (hero) {
    hero.addEventListener('mousemove', e => {
      const r = cv.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    });
    hero.addEventListener('mouseleave', () => { mouse.x = mouse.y = -9999; });
  }
  if ('IntersectionObserver' in window && hero) {
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(hero);
  }
  resize();
  if (!prefersReducedMotion) loop();
})();

// ── Spotlight glow that follows the cursor on cards ───────────
if (window.matchMedia('(hover: hover)').matches) {
  document.addEventListener('mousemove', e => {
    const card = e.target.closest && e.target.closest('.spot');
    if (!card) return;
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - r.left}px`);
    card.style.setProperty('--my', `${e.clientY - r.top}px`);
  }, { passive: true });
}

// ── Project filters ───────────────────────────────────────────
(function initProjectFilters() {
  const buttons = $$('.filter-btn');
  const cards = $$('.proj');
  if (!buttons.length) return;
  const none = $('#noResults');
  buttons.forEach(btn => btn.addEventListener('click', () => {
    const f = btn.dataset.filter;
    buttons.forEach(b => b.classList.toggle('active', b === btn));
    let shown = 0;
    cards.forEach(c => {
      const show = f === 'all' || (c.dataset.tags || '').split(' ').includes(f);
      c.classList.toggle('is-hidden', !show);
      if (show) { c.classList.add('in'); shown++; }
    });
    if (none) none.style.display = shown ? 'none' : 'block';
  }));
})();

// ── Toast helper ──────────────────────────────────────────────
function showToast(message, isError = false) {
  const banner = document.createElement('div');
  banner.className = 'toast-banner' + (isError ? ' error' : '');
  banner.setAttribute('role', 'status');
  const icon = document.createElement('span');
  icon.style.cssText = `color:${isError ? '#f87171' : '#34d399'};font-size:16px;`;
  icon.textContent = isError ? '✕' : '✓';
  banner.append(icon, document.createTextNode(' ' + message));
  document.body.appendChild(banner);
  setTimeout(() => { banner.style.transition = 'opacity 0.5s'; banner.style.opacity = '0'; }, 3500);
  setTimeout(() => banner.remove(), 4000);
}

// ── Colour themes ─────────────────────────────────────────────
(function initTheme() {
  const THEMES = [
    { id: 'ember', name: 'Ember (original)' },
    { id: 'slate', name: 'Slate & Gold' },
    { id: 'dusk',  name: 'Dusk' },
    { id: 'sage',  name: 'Sage' },
    { id: 'paper', name: 'Paper (light)' },
    { id: 'mono',  name: 'Mono Lime' }
  ];
  const root = document.documentElement;
  const btn = $('#themeBtn'), menu = $('#themeMenu');

  function apply(id, save) {
    if (!THEMES.some(t => t.id === id)) id = 'ember';
    root.setAttribute('data-theme', id);
    if (save) { try { localStorage.setItem('theme', id); } catch (e) { /* storage unavailable */ } }
    $$('.theme-opt').forEach(o => {
      const on = o.dataset.theme === id;
      o.classList.toggle('on', on);
      o.setAttribute('aria-checked', String(on));
    });
    const meta = $('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', getComputedStyle(root).getPropertyValue('--bg').trim());
    window.dispatchEvent(new Event('themechange'));
  }
  window.PORTFOLIO_THEMES = THEMES;
  window.setTheme = apply;
  apply(root.getAttribute('data-theme') || 'ember', false);

  if (!btn || !menu) return;
  const setOpen = open => { menu.hidden = !open; btn.setAttribute('aria-expanded', String(open)); };
  btn.addEventListener('click', e => { e.stopPropagation(); setOpen(menu.hidden); });
  $$('.theme-opt').forEach(o => o.addEventListener('click', () => { apply(o.dataset.theme, true); setOpen(false); }));
  document.addEventListener('click', e => { if (!menu.hidden && !menu.contains(e.target) && e.target !== btn) setOpen(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !menu.hidden) { setOpen(false); btn.focus(); } });
})();

// ── Quick-jump command palette (Ctrl/Cmd+K) ───────────────────
(function initPalette() {
  const root = $('#palette');
  const input = $('#paletteInput');
  const list = $('#paletteList');
  const openBtn = $('#paletteBtn');
  if (!root || !input || !list) return;

  const EMAIL = 'lingesh.r.official@gmail.com';
  const themeItems = (window.PORTFOLIO_THEMES || []).map(t => ({ label: 'Theme: ' + t.name, hint: 'theme', action: () => window.setTheme(t.id, true) }));
  const items = [
    { label: 'Experience',      hint: 'section',  href: '/#experience' },
    { label: 'Projects',        hint: 'section',  href: '/#projects' },
    { label: 'AI Stack',        hint: 'section',  href: '/#skills' },
    { label: 'Awards',          hint: 'section',  href: '/#achievements' },
    { label: 'Certifications',  hint: 'section',  href: '/#certifications' },
    { label: 'Contact me',      hint: 'page',     href: '/contact' },
    { label: 'Open resume',     hint: 'pdf',      href: '/resume', external: true },
    { label: 'GitHub',          hint: 'link',     href: 'https://github.com/Lingesh-7', external: true },
    { label: 'LinkedIn',        hint: 'link',     href: 'https://www.linkedin.com/in/rajalingesh', external: true },
    { label: 'Send an email',   hint: 'mailto',   href: 'mailto:' + EMAIL },
    { label: 'Copy email address', hint: 'copy',  action: () => {
        if (navigator.clipboard) navigator.clipboard.writeText(EMAIL).then(() => showToast('Email copied to clipboard'));
      } },
    ...themeItems
  ];
  let shown = items, sel = 0;

  function render() {
    list.innerHTML = '';
    if (!shown.length) { list.innerHTML = '<div class="palette-empty">No matches</div>'; return; }
    shown.forEach((it, i) => {
      const row = document.createElement('div');
      row.className = 'palette-item' + (i === sel ? ' sel' : '');
      row.setAttribute('role', 'option');
      const label = document.createElement('span'); label.textContent = it.label;
      const hint = document.createElement('small'); hint.textContent = it.hint;
      row.append(label, hint);
      row.addEventListener('mousemove', () => { if (sel !== i) { sel = i; render(); } });
      row.addEventListener('click', () => run(it));
      list.appendChild(row);
    });
    const active = $('.sel', list); if (active) active.scrollIntoView({ block: 'nearest' });
  }
  function open() { root.classList.add('open'); input.value = ''; shown = items; sel = 0; render(); setTimeout(() => input.focus(), 10); }
  function close() { root.classList.remove('open'); }
  function run(it) {
    close();
    if (it.action) return it.action();
    if (it.external) return window.open(it.href, '_blank', 'noopener');
    window.location.href = it.href;
  }

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    shown = items.filter(it => it.label.toLowerCase().includes(q));
    sel = 0; render();
  });
  input.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') { e.preventDefault(); sel = Math.min(sel + 1, shown.length - 1); render(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); sel = Math.max(sel - 1, 0); render(); }
    else if (e.key === 'Enter' && shown[sel]) { e.preventDefault(); run(shown[sel]); }
  });
  root.addEventListener('click', e => { if (e.target === root) close(); });
  if (openBtn) openBtn.addEventListener('click', open);
  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); root.classList.contains('open') ? close() : open(); }
    else if (e.key === 'Escape' && root.classList.contains('open')) close();
  });
})();

// ── Contact sent/error banner from query params ───────────────
(function handleContactParams() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('sent') === 'true') {
    showToast("Message sent. I'll get back to you soon!");
    history.replaceState({}, '', window.location.pathname);
  } else if (params.get('error') === 'true') {
    showToast('Something went wrong sending your message. Please try again or email me directly.', true);
    history.replaceState({}, '', window.location.pathname);
  }
})();

// ── Contact form client-side validation ────────────────────────
(function initContactFormValidation() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setError(input, message) {
    input.classList.add('input-error');
    let msg = input.parentElement.querySelector('.form-error-msg');
    if (!msg) {
      msg = document.createElement('span');
      msg.className = 'form-error-msg';
      input.parentElement.appendChild(msg);
    }
    msg.textContent = message;
  }

  function clearError(input) {
    input.classList.remove('input-error');
    const msg = input.parentElement.querySelector('.form-error-msg');
    if (msg) msg.remove();
  }

  form.addEventListener('submit', (e) => {
    let valid = true;
    const name = form.querySelector('[name="name"]');
    const email = form.querySelector('[name="email"]');
    const message = form.querySelector('[name="message"]');

    [name, email, message].forEach(clearError);

    if (!name.value.trim()) { setError(name, 'Please enter your name.'); valid = false; }
    if (!email.value.trim() || !emailRe.test(email.value.trim())) {
      setError(email, 'Please enter a valid email.'); valid = false;
    }
    if (!message.value.trim() || message.value.trim().length < 10) {
      setError(message, 'Message should be at least 10 characters.'); valid = false;
    }

    if (!valid) {
      e.preventDefault();
      return;
    }

    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) {
      submitBtn.querySelector('.btn-text').style.display = 'none';
      submitBtn.querySelector('.btn-loading').style.display = 'inline';
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.7';
    }
  });

  [form.querySelector('[name="name"]'), form.querySelector('[name="email"]'), form.querySelector('[name="message"]')]
    .forEach(input => input && input.addEventListener('input', () => clearError(input)));
})();

// ── Hero portrait tilt ────────────────────────────────────────
(function initTilt() {
  const wrap = $('.hero-visual'), portrait = $('.portrait');
  if (!wrap || !portrait || prefersReducedMotion || !window.matchMedia('(hover: hover)').matches) return;
  wrap.addEventListener('mousemove', e => {
    const r = wrap.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    portrait.style.setProperty('--ry', (x * 14) + 'deg');
    portrait.style.setProperty('--rx', (-y * 14) + 'deg');
  });
  wrap.addEventListener('mouseleave', () => {
    portrait.style.setProperty('--ry', '0deg'); portrait.style.setProperty('--rx', '0deg');
  });
})();

// ── Magnetic buttons ──────────────────────────────────────────
(function initMagnetic() {
  if (prefersReducedMotion || !window.matchMedia('(hover: hover)').matches) return;
  $$('.btn-primary, .btn-sayhello, .footer-cta-btn, .contact-btn').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      btn.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.18}px, ${(e.clientY - r.top - r.height / 2) * 0.28}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });
})();

// ── Side dots: where am I on the page ─────────────────────────
(function initSectionDots() {
  const secs = $$('main section[id][data-label]');
  if (secs.length < 3 || !('IntersectionObserver' in window)) return;
  const nav = document.createElement('nav');
  nav.className = 'dots-nav';
  nav.setAttribute('aria-label', 'Page sections');
  secs.forEach(s => {
    const a = document.createElement('a');
    a.href = '#' + s.id; a.dataset.for = s.id; a.setAttribute('aria-label', s.dataset.label);
    const tip = document.createElement('span'); tip.textContent = s.dataset.label;
    a.appendChild(tip); nav.appendChild(a);
  });
  document.body.appendChild(nav);
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) $$('a', nav).forEach(a => a.classList.toggle('active', a.dataset.for === e.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  secs.forEach(s => io.observe(s));
})();

// ── Project detail modal ──────────────────────────────────────
(function initProjectModal() {
  const modal = $('#projModal');
  if (!modal) return;
  const q = sel => $(sel, modal);
  let lastFocus = null;

  function open(card) {
    lastFocus = document.activeElement;
    const art = $('.proj-media .cover', card);
    const cover = q('#pmCover'); cover.innerHTML = '';
    if (art) cover.appendChild(art.cloneNode(true));
    q('#pmCat').textContent = $('.proj-cat', card).textContent;
    q('#pmTitle').textContent = $('h3', card).textContent;
    q('#pmLead').textContent = $('.proj-desc', card).textContent;
    const pts = q('#pmPoints'); pts.innerHTML = '';
    $$('.proj-more li', card).forEach(li => { const n = document.createElement('li'); n.textContent = li.textContent; pts.appendChild(n); });
    const chips = q('#pmChips'); chips.innerHTML = '';
    $$('.proj-more .chip', card).forEach(c => chips.appendChild(c.cloneNode(true)));
    const links = q('#pmLinks'); links.innerHTML = '';
    $$('.proj-actions a', card).forEach(a => links.appendChild(a.cloneNode(true)));
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    q('.modal-close').focus();
  }
  function close() {
    modal.hidden = true;
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  document.addEventListener('click', e => {
    if (!modal.hidden) { if (e.target === modal || e.target.closest('.modal-close')) close(); return; }
    const card = e.target.closest('.proj');
    if (card && !e.target.closest('a')) open(card);
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hidden) close(); });
})();
