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

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
} else {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
}

function animateCounter(el) {
  if (el.dataset.animated === 'true') return;
  const target = Number(el.dataset.count || el.textContent || 0);
  if (!Number.isFinite(target)) return;
  el.dataset.animated = 'true';
  el.textContent = '0';
  const duration = 900;
  const start = performance.now();

  function tick(now) {
    const pct = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - pct, 3);
    el.textContent = Math.round(target * eased).toString();
    if (pct < 1) requestAnimationFrame(tick);
    else el.textContent = String(target);
  }

  requestAnimationFrame(tick);
}

const counters = document.querySelectorAll('[data-count]');
if ('IntersectionObserver' in window) {
  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    });
  }, { threshold: 0.2 });

  counters.forEach(el => counterObserver.observe(el));
  window.setTimeout(() => {
    counters.forEach(el => {
      if (el.dataset.animated !== 'true') el.textContent = el.dataset.count;
    });
  }, 1400);
} else {
  counters.forEach(el => {
    el.textContent = el.dataset.count;
  });
}

function applyLanguage(lang) {
  const selected = lang === 'en' ? 'en' : 'es';
  document.documentElement.lang = selected;

  document.querySelectorAll('[data-es][data-en]').forEach(el => {
    el.textContent = el.dataset[selected];
  });

  const body = document.body;
  const pageTitle = selected === 'en' ? body.dataset.titleEn : body.dataset.titleEs;
  if (pageTitle) document.title = pageTitle;

  document.querySelectorAll('.language-switch button').forEach(button => {
    button.classList.toggle('active', button.dataset.lang === selected);
  });

  localStorage.setItem('aq1-language', selected);
}

document.querySelectorAll('.language-switch button').forEach(button => {
  button.addEventListener('click', () => applyLanguage(button.dataset.lang));
});

applyLanguage(localStorage.getItem('aq1-language') || 'es');
