const init = () => {
  const doc = document.documentElement;
  const motion = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Section rules draw in as they scroll into view. Content is never hidden
  // behind an intro gate: if this script fails, sections stay visible.
  let revealing = false;
  const reveal = () => {
    if (revealing || !motion || !('IntersectionObserver' in window)) return;
    revealing = true; doc.classList.add('has-reveal');
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
    }), { rootMargin: '0px 0px -12% 0px' });
    document.querySelectorAll('.notebook-section').forEach((s) => io.observe(s));
  };
  reveal();
  // Slim bar appears once the header scrolls away; nav links follow the section in view
  const bar = document.querySelector('.mini-bar');
  const head = document.querySelector('.site-header');
  const links = document.querySelectorAll('.nav-link');
  if (bar && head && 'IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => bar.classList.toggle('is-shown', !e.isIntersecting)).observe(head);
    const spy = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) links.forEach((l) => {
        const on = l.getAttribute('href') === '#' + e.target.id;
        l.classList.toggle('active', on);
        if (on) l.setAttribute('aria-current', 'true'); else l.removeAttribute('aria-current');
      });
    }), { rootMargin: '-40% 0px -55% 0px' });
    document.querySelectorAll('.notebook-section[id]').forEach((s) => spy.observe(s));
  }
  const y = document.getElementById('current-year');
  const cp = document.getElementById('copy-email-btn');
  if (y) y.textContent = new Date().getFullYear();
  if (cp) cp.onclick = async () => {
    try { await navigator.clipboard.writeText('zariftahmed@gmail.com'); } catch {}
    cp.textContent = 'Copied'; setTimeout(() => cp.textContent = 'copy', 2000);
  };
  // Keep the plus and minus sign in sync with each Work disclosure
  document.querySelectorAll('.work-disclosure').forEach((d) => {
    const sync = () => { const btn = d.querySelector('.work-toggle-btn'); if (btn) btn.textContent = d.open ? '−' : '+'; };
    d.ontoggle = sync; sync();
  });
};
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
