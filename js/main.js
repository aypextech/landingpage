/* ===========================================================
   Aypex — Software & Solutions · main.js
   =========================================================== */

// ---- Header sólido al scrollear ----
var hdr = document.getElementById('hdr');
function onHdr() { if (window.scrollY > 40) hdr.classList.add('scrolled'); else hdr.classList.remove('scrolled'); }
window.addEventListener('scroll', onHdr); onHdr();

// ---- Menú mobile ----
document.getElementById('burger').addEventListener('click', function () {
  document.getElementById('menu').classList.toggle('open');
});
document.querySelectorAll('#menu a').forEach(function (a) {
  a.addEventListener('click', function () { document.getElementById('menu').classList.remove('open'); });
});

// ---- Idioma: Inglés <-> Español ----
var LANG = 'en';
try { LANG = localStorage.getItem('ax_lang') || 'en'; } catch (e) {}
function setLang(l) {
  LANG = (l === 'es') ? 'es' : 'en';
  document.documentElement.lang = LANG;
  document.body.classList.toggle('es', LANG === 'es');
  document.querySelectorAll('[data-en]').forEach(function (el) {
    var v = el.getAttribute('data-' + LANG); if (v != null) el.innerHTML = v;
  });
  document.querySelectorAll('[data-ph-en]').forEach(function (el) {
    var v = el.getAttribute('data-ph-' + LANG); if (v != null) el.placeholder = v;
  });
  var t = document.getElementById('langToggle');
  if (t) t.textContent = (LANG === 'en') ? 'ES' : 'EN';
  try { localStorage.setItem('ax_lang', LANG); } catch (e) {}
}
document.getElementById('langToggle').addEventListener('click', function () {
  setLang(LANG === 'en' ? 'es' : 'en');
  document.getElementById('menu').classList.remove('open');
});
setLang(LANG);

// ---- Hero slideshow opcional (si hay imágenes en assets/hero*) ----
(function () {
  var srcs = [];  // sin fotos: el hero usa la malla de color animada (CSS)
  var host = document.getElementById('heroSlides');
  var dotsHost = document.getElementById('heroDots');
  if (!host || !srcs.length) return;
  var slides = [], dots = [], idx = 0, timer;
  function show(i) {
    slides[idx].classList.remove('on'); if (dots[idx]) dots[idx].classList.remove('on');
    idx = (i + slides.length) % slides.length;
    slides[idx].classList.add('on'); if (dots[idx]) dots[idx].classList.add('on');
  }
  function start() { clearInterval(timer); if (slides.length > 1) timer = setInterval(function () { show(idx + 1); }, 5200); }
  srcs.forEach(function (src) {
    var im = new Image();
    im.onload = function () {
      var d = document.createElement('div'); d.className = 'hero-slide';
      d.style.backgroundImage = "url('" + src + "')"; host.appendChild(d); slides.push(d);
      if (dotsHost) { var dot = document.createElement('i'); var mine = slides.length - 1; dot.addEventListener('click', function () { show(mine); start(); }); dotsHost.appendChild(dot); dots.push(dot); }
      if (slides.length === 1) { d.classList.add('on'); if (dots[0]) dots[0].classList.add('on'); } start();
    };
    im.src = src;
  });
})();

// ---- Reveal al scrollear ----
(function () {
  var els = document.querySelectorAll('.info-cell, .center, .ccard, .step, .feature .f-media, .feature .f-copy, .stat, .tst, .faq-item, .foot-grid > div');
  els.forEach(function (el) { el.classList.add('reveal'); });
  ['.cards .ccard', '.steps .step', '.stats .stat'].forEach(function (sel) {
    document.querySelectorAll(sel).forEach(function (el, i) { el.style.transitionDelay = (i * 0.08) + 's'; });
  });
  if (!('IntersectionObserver' in window)) { els.forEach(function (el) { el.classList.add('in'); }); return; }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });
  els.forEach(function (el) { io.observe(el); });
})();

// ---- Contador de stats ----
(function () {
  var counts = document.querySelectorAll('.count');
  if (!counts.length || !('IntersectionObserver' in window)) return;
  function run(el) {
    var to = parseFloat(el.getAttribute('data-to')) || 0, suf = el.getAttribute('data-suffix') || '', t0 = null;
    function step(ts) { if (!t0) t0 = ts; var p = Math.min((ts - t0) / 1400, 1); el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))) + suf; if (p < 1) requestAnimationFrame(step); }
    requestAnimationFrame(step);
  }
  var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { run(e.target); io.unobserve(e.target); } }); }, { threshold: 0.6 });
  counts.forEach(function (el) { io.observe(el); });
})();

// ---- Testimonios (carousel) ----
(function () {
  var track = document.getElementById('tstTrack'), dots = document.getElementById('tstDots');
  if (!track) return;
  var n = track.children.length, i = 0, timer = null;
  for (var k = 0; k < n; k++) { var d = document.createElement('i'); d.addEventListener('click', (function (idx) { return function () { go(idx); }; })(k)); dots.appendChild(d); }
  function render() { track.style.transform = 'translateX(-' + (i * 100) + '%)'; Array.prototype.forEach.call(dots.children, function (el, idx) { el.classList.toggle('on', idx === i); }); }
  function go(idx) { i = (idx + n) % n; render(); restart(); }
  function restart() { clearInterval(timer); timer = setInterval(function () { go(i + 1); }, 6500); }
  window.tstShift = function (dir) { go(i + dir); };
  var box = track.closest('.tst');
  if (box) { box.addEventListener('mouseenter', function () { clearInterval(timer); }); box.addEventListener('mouseleave', restart); }
  render(); restart();
})();

// ---- Showcase del estudio (carrusel de imágenes) ----
(function () {
  var track = document.getElementById('scTrack'), dots = document.getElementById('scDots');
  if (!track) return;
  var n = track.children.length, i = 0, timer = null;
  for (var k = 0; k < n; k++) { var d = document.createElement('i'); d.addEventListener('click', (function (idx) { return function () { go(idx); }; })(k)); dots.appendChild(d); }
  function render() { track.style.transform = 'translateX(-' + (i * 100) + '%)'; Array.prototype.forEach.call(dots.children, function (el, idx) { el.classList.toggle('on', idx === i); }); }
  function go(idx) { i = (idx + n) % n; render(); restart(); }
  function restart() { clearInterval(timer); if (n > 1) timer = setInterval(function () { go(i + 1); }, 5000); }
  window.scShift = function (dir) { go(i + dir); };
  var box = track.closest('.showcase');
  if (box) { box.addEventListener('mouseenter', function () { clearInterval(timer); }); box.addEventListener('mouseleave', restart); }
  render(); restart();
})();

// ---- Equipo (modales) ----
var TEAM = {
  mauricio: { name: 'Mauricio Rodriguez', initial: 'M', role_en: 'CEO', role_es: 'CEO',
    bio_en: 'Founder & CEO of Aypex and a QA Automation Engineer with 10+ years shipping reliable software across web, mobile and backend in high-stakes environments — fintech, biometric identity, government and industrial systems. He treats quality as an engineering discipline: reading code diffs, tracing affected paths and building AI-driven, white-box test pipelines with full evidence traceability.',
    bio_es: 'Fundador y CEO de Aypex e ingeniero de QA Automation con más de 10 años entregando software confiable en web, mobile y backend en entornos exigentes — fintech, identidad biométrica, gobierno e industrial. Trata la calidad como una disciplina de ingeniería: lee los diffs de código, rastrea los caminos afectados y construye pipelines de testing white-box asistidos por IA con trazabilidad total de la evidencia.',
    skills: ['White-Box Testing', 'Python', 'Selenium', 'Appium', 'Playwright', 'Pytest', 'API Testing', 'Security Testing', 'AI Agents', 'Claude Workflows', 'XRAY', 'Jira', 'React Native', 'CI/CD', 'Fintech', 'Biometric Identity'],
    timeline: [
      { c: 'Clue Insights', p: '2025 — Now', r_en: 'AI-Enhanced QA Engineer', r_es: 'AI-Enhanced QA Engineer', d_en: 'AI-driven, white-box QA across web, mobile & APIs for cross-platform industrial software (US).', d_es: 'QA white-box asistido por IA en web, mobile y APIs para software industrial multiplataforma (EE.UU.).' },
      { c: 'Valida', p: '2025 — Now', r_en: 'QA Automation · Biometric & Security', r_es: 'QA Automation · Biometría y Seguridad', d_en: 'Dual-layer framework (pytest + Playwright, ~480 tests); 200+ requests scanned per run for security flaws & exposed PII.', d_es: 'Framework de doble capa (pytest + Playwright, ~480 tests); 200+ requests escaneados por corrida por vulnerabilidades y PII expuesta.' },
      { c: 'Ualá', p: '2021 — 2025', r_en: 'QA Engineer · Payments', r_es: 'QA Engineer · Pagos', d_en: 'QA automation at fintech scale (Selenium/Appium · AWS · CI/CD); merchant onboarding to QR payment networks.', d_es: 'Automatización de QA a escala fintech (Selenium/Appium · AWS · CI/CD); alta de comercios a redes de pago QR.' },
      { c: 'Opratel', p: '2019 — 2021', r_en: 'QA Automation Lead', r_es: 'QA Automation Lead', d_en: 'Defined QA strategy; built custom Python automation frameworks; trained the team.', d_es: 'Definí la estrategia de QA; construí frameworks de automatización en Python; formé al equipo.' },
      { c: 'Gobierno de la Ciudad de Buenos Aires', p: '2017 — 2019', r_en: 'QA Automation Engineer', r_es: 'QA Automation Engineer', d_en: 'Automated & validated financial/regulatory systems (Java · JavaScript · Zephyr) under strict compliance.', d_es: 'Automaticé y validé sistemas financieros y regulatorios (Java · JavaScript · Zephyr) bajo estricto cumplimiento.' },
      { c: 'Freelance QA', p: '2017 — 2019', r_en: 'QA · CRM / ERP', r_es: 'QA · CRM / ERP', d_en: 'Manual QA for CRM/ERP products (incl. Kaizen).', d_es: 'QA manual para productos CRM/ERP (incl. Kaizen).' },
      { c: 'Consilium Service', p: '2016 — 2019', r_en: 'Software Tester QA', r_es: 'Software Tester QA', d_en: 'Where it all started — QA testing on CRM software.', d_es: 'Donde empezó todo — testing QA sobre software CRM.' }
    ] },
  ezequiel: { name: 'Ezequiel Rodriguez', initial: 'E', role_en: 'CTO', role_es: 'CTO',
    bio_en: 'CTO and engineering lead at Aypex. Ezequiel turns product vision into scalable, reliable architecture across web and mobile, defining the technical direction, standards and stack behind everything the team builds.',
    bio_es: 'CTO y líder de ingeniería de Aypex. Ezequiel convierte la visión de producto en arquitectura escalable y confiable en web y mobile, definiendo la dirección técnica, los estándares y el stack detrás de todo lo que construye el equipo.' },
  dante: { name: 'Dante Roldan', initial: 'D', role_en: 'Software Engineer', role_es: 'Ingeniero de Software',
    bio_en: 'Software engineer at Aypex, building the products and custom solutions our clients rely on — from CRM features to automations and polished, high-performance web apps.',
    bio_es: 'Ingeniero de software en Aypex. Construye los productos y soluciones a medida en los que confían nuestros clientes — desde funcionalidades del CRM hasta automatizaciones y web apps pulidas y de alto rendimiento.' }
};
function openTeam(id) {
  var t = TEAM[id]; if (!t) return;
  var es = (typeof LANG !== 'undefined' && LANG === 'es');
  document.getElementById('tmName').textContent = t.name;
  document.getElementById('tmRole').textContent = es ? t.role_es : t.role_en;
  document.getElementById('tmBio').textContent = es ? t.bio_es : t.bio_en;
  var extra = '';
  if (t.skills && t.skills.length) {
    extra += '<div class="tm-h">Skills</div><div class="tm-chips">' + t.skills.map(function (s) { return '<span>' + s + '</span>'; }).join('') + '</div>';
  }
  if (t.timeline && t.timeline.length) {
    extra += '<div class="tm-h">' + (es ? 'Trayectoria' : 'Journey') + '</div><ul class="tm-time">' + t.timeline.map(function (j) {
      return '<li><span class="tm-per">' + j.p + '</span><b>' + j.c + '</b><i>' + (es ? j.r_es : j.r_en) + '</i><p>' + (es ? j.d_es : j.d_en) + '</p></li>';
    }).join('') + '</ul>';
  }
  var ex = document.getElementById('tmExtra'); if (ex) ex.innerHTML = extra;
  var av = document.getElementById('tmAvatar');
  av.textContent = ''; av.style.backgroundImage = '';
  var src = 'assets/team/' + id + '.jpg';
  var im = new Image();
  im.onload = function () { av.style.backgroundImage = "url('" + src + "')"; };
  im.onerror = function () { av.textContent = t.initial; };
  im.src = src;
  document.getElementById('teamModal').hidden = false;
  document.body.style.overflow = 'hidden';
}
function closeTeam() {
  var m = document.getElementById('teamModal'); if (m) m.hidden = true;
  document.body.style.overflow = '';
}
document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeTeam(); });
// Cargar fotos del equipo si existen (si no, queda la inicial)
document.querySelectorAll('.tavatar[data-img]').forEach(function (av) {
  var src = av.getAttribute('data-img'); if (!src) return;
  var im = new Image();
  im.onload = function () { av.style.backgroundImage = "url('" + src + "')"; av.classList.add('has-img'); };
  im.src = src;
});

// ---- FX: hue al scrollear + glow que sigue el cursor ----
(function () {
  var root = document.documentElement, cg = document.querySelector('.cursor-glow');
  function onScroll() { var h = root.scrollHeight - window.innerHeight; var p = h > 0 ? window.scrollY / h : 0; root.style.setProperty('--scrollhue', (p * 300).toFixed(1) + 'deg'); }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  var fine = window.matchMedia('(pointer:fine)').matches, reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (cg && fine && !reduce) {
    document.body.classList.add('has-cursor');
    var rx = innerWidth / 2, ry = innerHeight / 2, cx = rx, cy = ry, raf = null;
    window.addEventListener('mousemove', function (e) { rx = e.clientX; ry = e.clientY; if (!raf) raf = requestAnimationFrame(tick); });
    function tick() { cx += (rx - cx) * 0.16; cy += (ry - cy) * 0.16; cg.style.transform = 'translate(' + cx.toFixed(1) + 'px,' + cy.toFixed(1) + 'px) translate(-50%,-50%)'; raf = (Math.abs(rx - cx) > 0.4 || Math.abs(ry - cy) > 0.4) ? requestAnimationFrame(tick) : null; }
  }
})();

// ---- Botones primarios "magnéticos" ----
(function () {
  if (!window.matchMedia('(pointer:fine)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.querySelectorAll('.btn.solid').forEach(function (b) {
    b.addEventListener('mousemove', function (e) { var r = b.getBoundingClientRect(); b.style.transform = 'translate(' + ((e.clientX - r.left - r.width / 2) * 0.16) + 'px,' + ((e.clientY - r.top - r.height / 2) * 0.26) + 'px)'; });
    b.addEventListener('mouseleave', function () { b.style.transform = ''; });
  });
})();

// ---- Formulario de contacto (AJAX FormSubmit) ----
(function () {
  var form = document.getElementById('contactForm'); if (!form) return;
  var btn = document.getElementById('cformBtn'), msg = document.getElementById('cformMsg');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (form._honey && form._honey.value) return;
    var es = LANG === 'es';
    var sending = es ? 'Enviando…' : 'Sending…';
    var okTxt = es ? '¡Gracias! Te responderemos muy pronto ✓' : 'Thanks! We\'ll get back to you soon ✓';
    var errTxt = es ? 'Algo salió mal. Probá de nuevo o escribinos por email.' : 'Something went wrong. Please try again or email us.';
    var orig = btn.textContent; btn.disabled = true; btn.textContent = sending; msg.hidden = true;
    fetch(form.action, { method: 'POST', headers: { 'Accept': 'application/json' }, body: new FormData(form) })
      .then(function (r) { return r.json(); })
      .then(function (d) { if (d && (d.success === 'true' || d.success === true)) { form.reset(); msg.textContent = okTxt; msg.className = 'cform-msg ok'; msg.hidden = false; } else { throw new Error('fail'); } btn.textContent = orig; btn.disabled = false; })
      .catch(function () { msg.textContent = errTxt; msg.className = 'cform-msg err'; msg.hidden = false; btn.textContent = orig; btn.disabled = false; });
  });
})();
