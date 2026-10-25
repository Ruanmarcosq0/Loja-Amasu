const menuBtn = document.querySelector('.menu-btn');
const menu = document.querySelector('.mobile-menu');
const nav = document.querySelector('.nav');

menuBtn?.addEventListener('click', () => {
  const open = !menu.classList.contains('open');
  menu.classList.toggle('open', open);
  document.body.classList.toggle('menu-open', open);
  menuBtn.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-hidden', String(!open));
});

document.querySelectorAll('.mobile-menu a').forEach(a => a.addEventListener('click', () => {
  menu.classList.remove('open');
  document.body.classList.remove('menu-open');
  menuBtn?.setAttribute('aria-expanded', 'false');
  menu?.setAttribute('aria-hidden', 'true');
}));

const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => io.observe(el));

document.querySelectorAll('video').forEach(video => {
  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  const ensurePlay = () => video.play().catch(() => {});
  video.addEventListener('canplay', ensurePlay, { once: true });
  ensurePlay();
});

document.getElementById('year').textContent = new Date().getFullYear();

window.addEventListener('scroll', () => {
  if (!nav) return;
  nav.style.background = window.scrollY > 40 ? 'rgba(245,240,234,.92)' : 'transparent';
  nav.style.backdropFilter = window.scrollY > 40 ? 'blur(14px)' : 'none';
});