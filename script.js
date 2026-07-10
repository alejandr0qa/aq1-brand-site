/* ============================================================
   AQ/1 — script.js
   ============================================================ */

// ── Scroll progress bar ──────────────────────────────────────
const progress = document.getElementById('progress');

function updateProgress() {
  const height = document.documentElement.scrollHeight - window.innerHeight;
  const scrolled = height > 0 ? (window.scrollY / height) * 100 : 0;
  progress.style.width = `${scrolled}%`;
}
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

// ── Mobile nav toggle ────────────────────────────────────────
const navToggle = document.getElementById('navToggle');
const nav       = document.getElementById('nav');

navToggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(open));
});

// Close nav when a link is clicked
nav?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
  });
});

// ── Reveal on scroll ─────────────────────────────────────────
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.10, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── Animated number counters ─────────────────────────────────
// threshold at 0.4 for better mobile timing
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    const el       = entry.target;
    const target   = Number(el.dataset.count || 0);
    const duration = 1400;
    const start    = performance.now();

    function tick(now) {
      const t      = Math.min((now - start) / duration, 1);
      const eased  = 1 - Math.pow(1 - t, 3); // ease-out cubic
      el.textContent = Math.round(target * eased).toString();
      if (t < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.4 });

document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

// ── Active nav link on scroll ─────────────────────────────────
// Highlights the nav link corresponding to the visible section
const navLinks = nav?.querySelectorAll('a[href^="#"]') ?? [];
const sectionIds = Array.from(navLinks).map(a => a.getAttribute('href').slice(1));

const sections = sectionIds
  .map(id => document.getElementById(id))
  .filter(Boolean);

let activeId = null;

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      if (id !== activeId) {
        activeId = id;

        navLinks.forEach(link => {
          const isCurrent = link.getAttribute('href') === `#${id}`;
          link.setAttribute('aria-current', isCurrent ? 'true' : 'false');
        });
      }
    }
  });
}, {
  // Fire when section is at least 20% visible,
  // and bias toward top of viewport
  rootMargin: '-15% 0px -70% 0px',
  threshold: 0
});

sections.forEach(section => sectionObserver.observe(section));
