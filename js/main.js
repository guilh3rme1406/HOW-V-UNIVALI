// Brooklyn Barbearia — main.js

const toggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');

toggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const isOpen = navLinks.classList.contains('open');
  toggle.setAttribute('aria-expanded', isOpen);
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
  });
});

const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.style.borderBottomColor = '#2a2a2a';
  } else {
    navbar.style.borderBottomColor = 'transparent';
  }
}, { passive: true });

const sections = document.querySelectorAll('section[id], div[id="mapa"]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navAnchors.forEach(a => {
          // Se for o mapa, ativa o link de Localização
          if (id === 'mapa' && a.getAttribute('href') === '#mapa') {
            a.style.color = 'var(--text)';
          } else if (id !== 'mapa' && a.getAttribute('href') === '#' + id) {
            a.style.color = 'var(--text)';
          } else {
            a.style.color = '';
          }
        });
      }
    });
  },
  { rootMargin: '-30% 0px -60% 0px' }
);

sections.forEach(s => observer.observe(s));

const yearSpan = document.getElementById('year');
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}
