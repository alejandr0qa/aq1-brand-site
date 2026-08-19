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

/* Los indicadores siempre conservan el valor real visible.
   Se elimina la animacion a 0 para evitar que queden en 0% o 0+ en carga real. */
document.querySelectorAll('[data-count]').forEach(el => {
  const target = Number(el.dataset.count);
  if (Number.isFinite(target)) el.textContent = String(target);
});

function applyLanguage(lang) {
  const selected = lang === 'en' ? 'en' : 'es';
  document.documentElement.lang = selected;

  document.querySelectorAll('[data-es][data-en]').forEach(el => {
    el.innerHTML = el.dataset[selected];
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
