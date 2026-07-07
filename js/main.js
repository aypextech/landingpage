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
  var els = document.querySelectorAll('.info-cell, .center, .svc-head, .ccard, .tool-card, .step, .feature .f-media, .feature .f-copy, .stat, .tst, .faq-item, .foot-grid > div');
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
    bio_en: 'Founder & CEO of Aypex. Mauricio spent 10+ years as a QA Automation Engineer at multinational companies, building automated testing across web, mobile and backend where shipping broken code was never an option.\n\nHis work spans four industries and continents: Ualá, Argentina\'s fintech unicorn driving financial inclusion across Latin America (Argentina, Mexico and Colombia); Opratel, an Argentine mobile-technology company delivering value-added services with telecom operators across the Americas, Europe, Africa and Asia; DGUIAF, part of the Government of Argentina, where he automated and validated critical financial systems; and Clue Insights, the Los Angeles-based startup whose AI-driven platform manages heavy construction equipment for clients around the world.\n\nAfter years scaling quality for large, global teams, he moved from Argentina to Asia and founded Aypex with a single idea: build software and tailor-made solutions that truly fit the people who use them. He is also the creator of Khronos and Koibranch — his own developer tools.',
    bio_es: 'Fundador y CEO de Aypex. Mauricio pasó más de 10 años como ingeniero de QA Automation en empresas multinacionales, construyendo testing automatizado en web, mobile y backend, donde no había lugar para el código roto.\n\nSu experiencia atraviesa cuatro industrias y continentes: Ualá, el unicornio fintech argentino que impulsa la inclusión financiera en Latinoamérica (Argentina, México y Colombia); Opratel, empresa argentina de tecnología móvil que brinda servicios de valor agregado junto a operadores de telecomunicaciones en América, Europa, África y Asia; DGUIAF, del Gobierno de Argentina, donde automatizó y validó sistemas financieros críticos; y Clue Insights, la startup con sede en Los Ángeles cuya plataforma con IA gestiona maquinaria pesada de construcción para clientes de todo el mundo.\n\nTras años escalando la calidad de grandes equipos globales, se mudó de Argentina a Asia y fundó Aypex con una sola idea: crear software y soluciones a medida que realmente se ajusten a las personas que los usan. Además es el creador de Khronos y Koibranch, sus propias herramientas para desarrolladores.',
  },
  ezequiel: { name: 'Ezequiel Rodriguez', initial: 'E', role_en: 'CTO', role_es: 'CTO',
    bio_en: 'CTO and engineering lead at Aypex. Ezequiel turns product vision into scalable, reliable architecture across web and mobile, defining the technical direction, standards and stack behind everything the team builds.',
    bio_es: 'CTO y líder de ingeniería de Aypex. Ezequiel convierte la visión de producto en arquitectura escalable y confiable en web y mobile, definiendo la dirección técnica, los estándares y el stack detrás de todo lo que construye el equipo.' },
  dante: { name: 'Dante Roldan', initial: 'D', role_en: 'Software Engineer', role_es: 'Ingeniero de Software',
    bio_en: 'Software engineer at Aypex, building the products and custom solutions our clients rely on — from CRM features to automations and polished, high-performance web apps.',
    bio_es: 'Ingeniero de software en Aypex. Construye los productos y soluciones a medida en los que confían nuestros clientes — desde funcionalidades del CRM hasta automatizaciones y web apps pulidas y de alto rendimiento.' },
  sebastian: { name: 'Sebastian Couto', initial: 'S', role_en: 'Head of Quality Engineering', role_es: 'Jefe de Ingeniería de Calidad',
    bio_en: 'Sebastian Couto is a quality engineering leader with more than a decade of experience building dependable automation strategies for complex digital products. He has worked at the intersection of development, testing and delivery, designing scalable test frameworks, CI/CD pipelines, API validation processes and end-to-end quality systems that help teams release faster without losing control over quality. His approach combines technical rigor with business awareness, turning quality into a real enabler of product growth, reliability and customer trust. He has led initiatives across web, mobile and backend ecosystems and is known for creating structured, measurable processes that make teams more confident, efficient and predictable.',
    bio_es: 'Sebastián Couto es un líder en ingeniería de calidad con más de una década de experiencia creando estrategias de automatización fiables para productos digitales complejos. Ha trabajado en la intersección entre desarrollo, testing y entrega, diseñando frameworks de pruebas escalables, pipelines CI/CD, procesos de validación de APIs y sistemas de calidad end-to-end que ayudan a los equipos a lanzar más rápido sin perder control sobre la calidad. Su enfoque combina rigor técnico con visión de negocio, convirtiendo la calidad en un verdadero motor de crecimiento, confiabilidad y confianza del cliente. Ha liderado iniciativas en ecosistemas web, mobile y backend y es conocido por crear procesos estructurados y medibles que hacen a los equipos más seguros, eficientes y predecibles.' }
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
  if (t.projects && t.projects.length) {
    extra += '<div class="tm-h">' + (es ? 'Creador de' : 'Creator of') + '</div><div class="tm-proj">' + t.projects.map(function (pr) {
      return '<div class="tm-p"><b>' + pr.name + '</b><p>' + (es ? pr.d_es : pr.d_en) + '</p></div>';
    }).join('') + '</div>';
  }
  var ex = document.getElementById('tmExtra'); if (ex) ex.innerHTML = extra;
  var av = document.getElementById('tmAvatar');
  av.classList.toggle('sebastian-avatar', id === 'sebastian');
  av.classList.toggle('ezequiel-avatar', id === 'ezequiel');
  av.textContent = ''; av.style.backgroundImage = '';
  var candidates = ['assets/team/' + id + '.jpg', 'assets/team/' + id + '.png', 'assets/team/' + id + '.jpeg'];
  function tryLoad(i) {
    if (i >= candidates.length) { av.textContent = t.initial; return; }
    var src = candidates[i];
    var im = new Image();
    im.onload = function () { av.style.backgroundImage = "url('" + src + "')"; };
    im.onerror = function () { tryLoad(i + 1); };
    im.src = src;
  }
  tryLoad(0);
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
  var base = src.replace(/\.(jpe?g|png)$/i, '');
  var candidates = [src];
  var ext = (src.match(/\.(jpe?g|png)$/i) || [])[1];
  if (ext) {
    var lower = ext.toLowerCase();
    if (lower === 'jpg' || lower === 'jpeg') candidates.push(base + '.png');
    if (lower === 'png') candidates.push(base + '.jpg');
    if (lower !== 'jpeg') candidates.push(base + '.jpeg');
  }
  function tryLoad(i) {
    if (i >= candidates.length) { av.textContent = av.getAttribute('data-initial') || ''; av.classList.remove('has-img'); return; }
    var url = candidates[i];
    var im = new Image();
    im.onload = function () { av.style.backgroundImage = "url('" + url + "')"; av.classList.add('has-img'); };
    im.onerror = function () { tryLoad(i + 1); };
    im.src = url;
  }
  tryLoad(0);
});

// ---- Servicios (modales) ----
var K_FOOT = { en: 'Part of the Khronos suite — available tailor-made, or license Khronos directly.', es: 'Parte de la suite Khronos — disponible a medida, o licenciando Khronos directamente.' };
var SERVICE = {
  web: { ico: '🌐', tag_en: 'Khronos suite', tag_es: 'Suite Khronos',
    name_en: 'Web Automation', name_es: 'Automatización Web',
    desc_en: 'End-to-end web testing that runs on every release — so bugs never reach your users.',
    desc_es: 'Testing web end-to-end que corre en cada release — para que los bugs nunca lleguen a tus usuarios.',
    feats: [
      { en: '<b>Multi-browser</b> — Chromium, Firefox &amp; WebKit/Safari.', es: '<b>Multi-browser</b> — Chromium, Firefox y WebKit/Safari.' },
      { en: '<b>Auto-generated Page Objects</b> — our crawler logs in and maps your whole app.', es: '<b>Page Objects automáticos</b> — nuestro crawler se loguea y mapea toda tu app.' },
      { en: '<b>Self-healing locators</b> — tests survive UI changes without breaking.', es: '<b>Locators auto-reparables</b> — los tests sobreviven a cambios de UI sin romperse.' },
      { en: '<b>Rich reports</b> — Allure with history, trends &amp; flaky detection.', es: '<b>Reportes ricos</b> — Allure con historial, tendencias y detección de flaky.' }
    ], foot_en: K_FOOT.en, foot_es: K_FOOT.es },
  mobile: { ico: '📱', tag_en: 'Khronos suite', tag_es: 'Suite Khronos',
    name_en: 'Mobile Automation', name_es: 'Automatización Mobile',
    desc_en: 'Native app testing on real Android and iOS — the same quality bar on every device.',
    desc_es: 'Testing de apps nativas en Android e iOS reales — la misma vara de calidad en cada dispositivo.',
    feats: [
      { en: '<b>Android</b> — Maestro flows: fast, resilient UI automation.', es: '<b>Android</b> — flujos Maestro: automatización UI rápida y resiliente.' },
      { en: '<b>iOS</b> — native XCUITest coverage.', es: '<b>iOS</b> — cobertura nativa con XCUITest.' },
      { en: '<b>Native flows</b> — gestures, permissions &amp; device farms.', es: '<b>Flujos nativos</b> — gestos, permisos y granjas de dispositivos.' },
      { en: '<b>One pipeline</b> — same reports &amp; CI as web.', es: '<b>Un solo pipeline</b> — mismos reportes y CI que web.' }
    ], foot_en: K_FOOT.en, foot_es: K_FOOT.es },
  api: { ico: '🔌', tag_en: 'Khronos suite', tag_es: 'Suite Khronos',
    name_en: 'API Automation', name_es: 'Automatización de APIs',
    desc_en: 'REST APIs validated on every build — contracts that never silently break.',
    desc_es: 'APIs REST validadas en cada build — contratos que nunca se rompen en silencio.',
    feats: [
      { en: '<b>REST endpoint testing</b> — full request/response coverage.', es: '<b>Testing de endpoints REST</b> — cobertura completa de request/response.' },
      { en: '<b>Schema &amp; contract validation</b> — catch breaking changes early.', es: '<b>Validación de schema y contratos</b> — detecta cambios rompientes temprano.' },
      { en: '<b>Data-driven</b> — realistic fixtures for real edge cases.', es: '<b>Data-driven</b> — fixtures realistas para casos borde reales.' },
      { en: '<b>CI-ready</b> — parallel execution on every commit.', es: '<b>Listo para CI</b> — ejecución paralela en cada commit.' }
    ], foot_en: K_FOOT.en, foot_es: K_FOOT.es },
  performance: { ico: '🚀', tag_en: 'Khronos suite', tag_es: 'Suite Khronos',
    name_en: 'Performance Testing', name_es: 'Testing de Performance',
    desc_en: 'Know exactly how your system behaves under load — before your users do.',
    desc_es: 'Sabé exactamente cómo se comporta tu sistema bajo carga — antes que tus usuarios.',
    feats: [
      { en: '<b>K6 &amp; Locust</b> — industry-standard load engines.', es: '<b>K6 y Locust</b> — motores de carga estándar de la industria.' },
      { en: '<b>Profiles</b> — smoke, stress, soak &amp; spike.', es: '<b>Perfiles</b> — smoke, stress, soak y spike.' },
      { en: '<b>Breakpoint analysis</b> — latency, throughput &amp; limits.', es: '<b>Análisis de límites</b> — latencia, throughput y puntos de quiebre.' },
      { en: '<b>Actionable reports</b> — know what to fix and why.', es: '<b>Reportes accionables</b> — sabé qué arreglar y por qué.' }
    ], foot_en: K_FOOT.en, foot_es: K_FOOT.es },
  accessibility: { ico: '♿', tag_en: 'Khronos suite', tag_es: 'Suite Khronos',
    name_en: 'Accessibility', name_es: 'Accesibilidad',
    desc_en: 'Software everyone can use — audited against WCAG 2.1 and real inclusive scenarios.',
    desc_es: 'Software que todos pueden usar — auditado contra WCAG 2.1 y escenarios inclusivos reales.',
    feats: [
      { en: '<b>WCAG 2.1 audits</b> — automated, on every build.', es: '<b>Auditorías WCAG 2.1</b> — automáticas, en cada build.' },
      { en: '<b>Inclusive coverage</b> — visual, auditory, motor &amp; cognitive.', es: '<b>Cobertura inclusiva</b> — visual, auditiva, motriz y cognitiva.' },
      { en: '<b>Remediation reports</b> — clear fixes, prioritized.', es: '<b>Reportes de remediación</b> — arreglos claros y priorizados.' },
      { en: '<b>Reach more users</b> — accessible is also better UX &amp; SEO.', es: '<b>Llegá a más usuarios</b> — accesible es también mejor UX y SEO.' }
    ], foot_en: K_FOOT.en, foot_es: K_FOOT.es },
  pentesting: { ico: '🛡', soon: true, tag_en: 'Coming soon', tag_es: 'Próximamente',
    name_en: 'Pen Testing', name_es: 'Pen Testing',
    desc_en: 'Security testing against the OWASP Top 10 — coming soon to the Khronos suite.',
    desc_es: 'Testing de seguridad contra el OWASP Top 10 — próximamente en la suite Khronos.',
    feats: [
      { en: '<b>OWASP Top 10</b> — coverage of the most critical risks.', es: '<b>OWASP Top 10</b> — cobertura de los riesgos más críticos.' },
      { en: '<b>Automated scans</b> — vulnerabilities surfaced early.', es: '<b>Escaneos automáticos</b> — vulnerabilidades detectadas temprano.' },
      { en: '<b>On the roadmap</b> — in active development for Khronos.', es: '<b>En el roadmap</b> — en desarrollo activo para Khronos.' }
    ], foot_en: 'In active development — want early access? Let\'s talk.', foot_es: 'En desarrollo activo — ¿querés acceso anticipado? Hablemos.' },
  'web-design': { ico: '🎨', tag_en: 'Design &amp; build', tag_es: 'Diseño y desarrollo',
    name_en: 'Web Design', name_es: 'Diseño Web',
    desc_en: 'From a single landing page to a full e-commerce — fast, beautiful and 100% responsive.',
    desc_es: 'De una simple landing page a un e-commerce completo — rápido, hermoso y 100% responsive.',
    feats: [
      { en: '<b>Landing pages</b> — crafted to convert.', es: '<b>Landing pages</b> — diseñadas para convertir.' },
      { en: '<b>E-commerce</b> — full online stores, ready to sell.', es: '<b>E-commerce</b> — tiendas online completas, listas para vender.' },
      { en: '<b>100% responsive</b> — flawless on every screen.', es: '<b>100% responsive</b> — impecable en cada pantalla.' },
      { en: '<b>Built to last</b> — fast, SEO-friendly and easy to grow.', es: '<b>Hecho para durar</b> — rápido, SEO-friendly y fácil de escalar.' }
    ], foot_en: '<a class="btn solid" href="#contacto" onclick="closeService()">Start your project</a>', foot_es: '<a class="btn solid" href="#contacto" onclick="closeService()">Empezá tu proyecto</a>' },
  crm: { ico: '📊', tag_en: 'Flagship product', tag_es: 'Producto estrella',
    name_en: 'CRM &amp; ERP', name_es: 'CRM &amp; ERP',
    desc_en: 'Run clients, sales, operations, inventory and finance in one platform — molded to your business, not the other way around.',
    desc_es: 'Gestioná clientes, ventas, operaciones, stock y finanzas en una sola plataforma — amoldada a tu negocio, y no al revés.',
    feats: [
      { en: '<b>Clients &amp; sales</b> — profiles, pipeline, payments &amp; history.', es: '<b>Clientes y ventas</b> — fichas, pipeline, pagos e historial.' },
      { en: '<b>Inventory &amp; finance</b> — stock, invoicing &amp; reporting.', es: '<b>Stock y finanzas</b> — inventario, facturación y reportes.' },
      { en: '<b>Automation</b> — reminders, workflows &amp; reports on autopilot.', es: '<b>Automatización</b> — recordatorios, flujos y reportes en piloto automático.' },
      { en: '<b>Web + mobile</b> — secure access from anywhere.', es: '<b>Web + mobile</b> — acceso seguro desde cualquier lugar.' }
    ], foot_en: '<a class="btn solid" href="#producto" onclick="closeService()">Meet the Aypex CRM</a>', foot_es: '<a class="btn solid" href="#producto" onclick="closeService()">Conocé el CRM de Aypex</a>' },
  custom: { ico: '🛠', tag_en: 'Tailor-made', tag_es: 'A medida',
    name_en: 'Custom Tools', name_es: 'Herramientas a medida',
    desc_en: 'Have an idea? We can make it true. Custom tools built around exactly how you work.',
    desc_es: '¿Tenés una idea? La hacemos realidad. Herramientas a medida construidas alrededor de cómo trabajás.',
    feats: [
      { en: '<b>Quotation &amp; budgeting</b> — tools that speed up your sales.', es: '<b>Cotizaciones y presupuestos</b> — herramientas que aceleran tus ventas.' },
      { en: '<b>Client &amp; ops portals</b> — self-service for your customers and team.', es: '<b>Portales de clientes y operaciones</b> — autogestión para tus clientes y equipo.' },
      { en: '<b>Dashboards</b> — the numbers that matter, at a glance.', es: '<b>Dashboards</b> — los números que importan, de un vistazo.' },
      { en: '<b>Automations</b> — anything repetitive, off your plate.', es: '<b>Automatizaciones</b> — todo lo repetitivo, fuera de tu mesa.' }
    ], foot_en: '<a class="btn solid" href="#contacto" onclick="closeService()">Tell us your idea</a>', foot_es: '<a class="btn solid" href="#contacto" onclick="closeService()">Contanos tu idea</a>' }
};
function openService(id) {
  var s = SERVICE[id]; if (!s) return;
  var es = (typeof LANG !== 'undefined' && LANG === 'es');
  var card = document.querySelector('#serviceModal .tmodal-card');
  if (card) card.classList.toggle('is-soon', !!s.soon);
  document.getElementById('svcIco').textContent = s.ico || '';
  document.getElementById('svcTag').innerHTML = es ? s.tag_es : s.tag_en;
  document.getElementById('svcName').innerHTML = es ? s.name_es : s.name_en;
  document.getElementById('svcDesc').innerHTML = es ? s.desc_es : s.desc_en;
  var body = '';
  if (s.feats && s.feats.length) {
    body = '<ul class="svc-flist">' + s.feats.map(function (f) { return '<li>' + (es ? f.es : f.en) + '</li>'; }).join('') + '</ul>';
  }
  document.getElementById('svcBody').innerHTML = body;
  document.getElementById('svcFoot').innerHTML = (es ? s.foot_es : s.foot_en) || '';
  document.getElementById('serviceModal').hidden = false;
  document.body.style.overflow = 'hidden';
}
function closeService() {
  var m = document.getElementById('serviceModal'); if (m) m.hidden = true;
  document.body.style.overflow = '';
}
document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeService(); });

// ---- Herramientas (Khronos / Koibranch) modales ----
var TOOLS = {
  khronos: { img: 'assets/tools/khronos.png', name: 'Khronos',
    kicker_en: 'QA automation framework', kicker_es: 'Framework de automatización QA',
    desc_en: 'A production-grade QA framework that unifies web, mobile, API, performance, security and accessibility testing in one Python stack — with a crawler that auto-generates page objects, self-healing locators and a live dashboard. It powers our Automation suite, and it\'s available as a standalone subscription.',
    desc_es: 'Un framework de QA de nivel producción que unifica testing web, mobile, API, performance, seguridad y accesibilidad en un solo stack de Python — con un crawler que genera page objects solo, locators auto-reparables y un dashboard en vivo. Impulsa nuestra suite de automatización, y está disponible como suscripción aparte.',
    chips: ['Playwright', 'Maestro', 'K6 · Locust', 'OWASP', 'WCAG 2.1', 'Allure'] },
  koibranch: { img: 'assets/tools/koibranch.png', name: 'Koibranch',
    kicker_en: 'Git guardian', kicker_es: 'Guardián de git',
    desc_en: 'Our git guardian: it visualizes a repo\'s history as a colored graph, catches conflicts before they hurt, reviews changes pre-push and stops teammates from stepping on each other\'s work. It\'s what keeps our teamwork clean and our releases safe.',
    desc_es: 'Nuestro guardián de git: visualiza la historia de un repo como un grafo de colores, detecta conflictos antes de que duelan, revisa los cambios antes de pushear y evita que el equipo se pise. Es lo que mantiene nuestro trabajo en equipo prolijo y nuestros releases seguros.',
    chips: ['Git graph', { en: 'Conflict radar', es: 'Radar de conflictos' }, { en: 'Pre-push review', es: 'Revisión pre-push' }, { en: 'Anti-collision', es: 'Anti-colisión' }] }
};
function openTool(id) {
  var t = TOOLS[id]; if (!t) return;
  var es = (typeof LANG !== 'undefined' && LANG === 'es');
  var img = document.getElementById('tlImg');
  img.src = t.img; img.alt = t.name + ' logo';
  document.getElementById('tlKicker').textContent = es ? t.kicker_es : t.kicker_en;
  document.getElementById('tlName').textContent = t.name;
  document.getElementById('tlDesc').textContent = es ? t.desc_es : t.desc_en;
  document.getElementById('tlChips').innerHTML = t.chips.map(function (c) {
    var lbl = (typeof c === 'string') ? c : (es ? c.es : c.en);
    return '<span>' + lbl + '</span>';
  }).join('');
  document.getElementById('toolModal').hidden = false;
  document.body.style.overflow = 'hidden';
}
function closeTool() {
  var m = document.getElementById('toolModal'); if (m) m.hidden = true;
  document.body.style.overflow = '';
}
document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeTool(); });

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
