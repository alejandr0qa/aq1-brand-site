const progress = document.getElementById('progress');
const navToggle = document.getElementById('navToggle');
const nav = document.getElementById('nav');

function updateProgress() {
  const height = document.documentElement.scrollHeight - window.innerHeight;
  const scrolled = height > 0 ? (window.scrollY / height) * 100 : 0;
  if (progress) progress.style.width = `${scrolled}%`;
}
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

navToggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(open));
});

nav?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
  });
});

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = Number(el.dataset.count || 0);
    const duration = 1100;
    const start = performance.now();
    function tick(now) {
      const pct = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - pct, 3);
      el.textContent = Math.round(target * eased).toString();
      if (pct < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.55 });

document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));
