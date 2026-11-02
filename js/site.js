const init = () => {
  const doc = document.documentElement, b = document.querySelector('.header-brand');
  const setPos = () => {
    if (!b || !doc.classList.contains('is-intro')) return;
    b.style.transform = 'none'; const r = b.getBoundingClientRect(); b.style.removeProperty('transform');
    b.style.setProperty('--ix', (Math.round((window.innerWidth - r.width) / 2 - r.left)) + 'px');
    b.style.setProperty('--iy', (Math.round((window.innerHeight - r.height) / 2 - 25 - r.top)) + 'px');
  };
  const unlock = () => { if (doc.classList.contains('is-intro')) doc.classList.remove('is-intro'); };
  if (doc.classList.contains('is-intro')) {
    window.scrollTo(0, 0); setPos(); window.addEventListener('resize', setPos);
    window.addEventListener('wheel', e => { if (e.deltaY > 0) unlock(); }, { passive: true });
    let ty = 0; window.addEventListener('touchstart', e => { ty = e.touches[0].clientY; }, { passive: true });
    window.addEventListener('touchmove', e => { if (ty - e.touches[0].clientY > 10) unlock(); }, { passive: true });
    window.addEventListener('keydown', e => { if (['ArrowDown', 'PageDown', ' ', 'End', 'Tab'].includes(e.key)) unlock(); });
    window.addEventListener('hashchange', unlock);
    const p = document.getElementById('scroll-prompt'); if (p) p.onclick = unlock;
    if (b) b.onclick = e => { if (doc.classList.contains('is-intro')) { e.preventDefault(); unlock(); } };
  }
  const y = document.getElementById('current-year'), cp = document.getElementById('copy-email-btn');
  if (y) y.textContent = new Date().getFullYear();
  if (cp) cp.onclick = async () => { try { await navigator.clipboard.writeText('zariftahmed@gmail.com'); } catch {} cp.textContent = 'Copied'; setTimeout(() => cp.textContent = 'copy', 2000); };
  document.querySelectorAll('.work-disclosure').forEach(d => { d.ontoggle = () => { const btn = d.querySelector('.work-toggle-btn'); if (btn) btn.textContent = d.open ? '−' : '+'; }; });
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const anims = [
      { el: document.getElementById('morph-pronoun'), list: ['you', 'we', 'I'], idx: 0 },
      { el: document.getElementById('morph-role'), list: ['Software', 'Data', 'Security'], idx: 0 },
      { el: document.getElementById('morph-phrase'), list: ["make my parents' lives easier", "help me work", "help me study", "help me find jobs", "help me invest", "help me organize", "help me train"], idx: 0 }
    ].filter(a => a.el);
    setInterval(() => { anims.forEach(a => { a.idx = (a.idx + 1) % a.list.length; a.el.classList.add('is-changing'); setTimeout(() => { a.el.textContent = a.list[a.idx]; a.el.classList.remove('is-changing'); }, 350); }); }, 2800);
  }
};
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
