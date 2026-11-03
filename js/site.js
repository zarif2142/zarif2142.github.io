const init = () => {
  const doc = document.documentElement, b = document.querySelector('.header-brand'), motion = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Jump the name to the centre (no transition), so it never slides in from the corner on load
  const setPos = () => {
    if (!b || !doc.classList.contains('is-intro')) return;
    b.style.transition = 'none'; b.style.transform = 'none'; const r = b.getBoundingClientRect(); b.style.removeProperty('transform');
    b.style.setProperty('--ix', (Math.round((window.innerWidth - r.width) / 2 - r.left)) + 'px');
    b.style.setProperty('--iy', (Math.round((window.innerHeight - r.height) / 2 - 25 - r.top)) + 'px');
    void b.offsetWidth; b.style.removeProperty('transition'); doc.classList.add('is-placed');
  };
  // Section rules draw in as they scroll into view; starts only once the intro is gone
  let revealing = false;
  const reveal = () => { if (revealing || !motion || !('IntersectionObserver' in window)) return; revealing = true; doc.classList.add('has-reveal');
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -12% 0px' });
    document.querySelectorAll('.notebook-section').forEach(s => io.observe(s)); };
  // The gesture that ends the intro must not also scroll the page (iOS keeps a swipe's momentum going)
  let hold = 0, ty = 0, held = false;
  const unlock = () => { if (doc.classList.contains('is-intro')) { doc.classList.remove('is-intro'); window.scrollTo(0, 0); hold = Date.now() + 900; reveal(); } };
  if (doc.classList.contains('is-intro')) {
    window.scrollTo(0, 0); setPos(); window.addEventListener('resize', setPos); if (document.fonts) document.fonts.ready.then(setPos);
    window.addEventListener('wheel', e => { if (doc.classList.contains('is-intro') || Date.now() < hold) e.preventDefault(); if (e.deltaY > 0) unlock(); }, { passive: false });
    window.addEventListener('touchstart', e => { ty = e.touches[0].clientY; held = doc.classList.contains('is-intro'); }, { passive: true });
    window.addEventListener('touchmove', e => { if (held) e.preventDefault(); if (ty - e.touches[0].clientY > 10) unlock(); }, { passive: false });
    window.addEventListener('touchend', () => { held = false; }, { passive: true });
    window.addEventListener('keydown', e => { if (!doc.classList.contains('is-intro')) return; if (['ArrowDown', 'PageDown', ' ', 'End'].includes(e.key)) e.preventDefault(); if (['ArrowDown', 'PageDown', ' ', 'End', 'Tab'].includes(e.key)) unlock(); });
    window.addEventListener('hashchange', unlock);
    const p = document.getElementById('scroll-prompt'); if (p) p.onclick = unlock;
    if (b) b.onclick = e => { if (doc.classList.contains('is-intro')) { e.preventDefault(); unlock(); } };
  } else reveal();
  // Slim bar appears once the header scrolls away; nav links follow the section in view
  const bar = document.querySelector('.mini-bar'), head = document.querySelector('.site-header'), links = document.querySelectorAll('.nav-link');
  if (bar && head && 'IntersectionObserver' in window) { new IntersectionObserver(([e]) => bar.classList.toggle('is-shown', !e.isIntersecting)).observe(head);
    const spy = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id)); }), { rootMargin: '-40% 0px -55% 0px' });
    document.querySelectorAll('.notebook-section[id]').forEach(s => spy.observe(s)); }
  const y = document.getElementById('current-year'), cp = document.getElementById('copy-email-btn');
  if (y) y.textContent = new Date().getFullYear();
  if (cp) cp.onclick = async () => { try { await navigator.clipboard.writeText('zariftahmed@gmail.com'); } catch {} cp.textContent = 'Copied'; setTimeout(() => cp.textContent = 'copy', 2000); };
  document.querySelectorAll('.work-disclosure').forEach(d => { d.ontoggle = () => { const btn = d.querySelector('.work-toggle-btn'); if (btn) btn.textContent = d.open ? '−' : '+'; }; });
  // Cycling words roll out upward, then the next rolls in from below while the slot eases to its new width
  const swap = (el, text) => { const w0 = el.offsetWidth; el.style.width = w0 + 'px'; el.classList.add('is-leaving'); setTimeout(() => { el.textContent = text; el.style.width = 'auto'; const w1 = el.offsetWidth; el.style.width = w0 + 'px'; el.classList.replace('is-leaving', 'is-entering'); void el.offsetWidth; el.classList.remove('is-entering'); el.style.width = w1 + 'px'; }, 300); };
  if (motion) {
    const anims = [
      { el: document.getElementById('morph-pronoun'), list: ['you', 'we', 'I'], idx: 0 },
      { el: document.getElementById('morph-role'), list: ['Software', 'Data', 'Security'], idx: 0 },
      { el: document.getElementById('morph-phrase'), list: ["make my parents' lives easier", "help me work", "help me study", "help me find jobs", "help me invest", "help me organize", "help me train"], idx: 0 }
    ].filter(a => a.el);
    setInterval(() => { anims.forEach(a => { a.idx = (a.idx + 1) % a.list.length; swap(a.el, a.list[a.idx]); }); }, 2800);
  }
};
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
