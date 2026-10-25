const menuButton = document.querySelector('.menu-btn');
const menu = document.querySelector('.mobile-menu');
function setMenu(open) {
  menu.classList.toggle('open', open);
  menu.inert = !open;
  menu.setAttribute('aria-hidden', String(!open));
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  menuButton.textContent = open ? 'Fechar' : 'Menu';
  document.body.classList.toggle('menu-open', open);
}
menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    setMenu(false);
    menuButton.focus();
  }
});
matchMedia('(min-width:981px)').addEventListener('change', event => { if (event.matches) setMenu(false); });

const playbackControllers = [];
document.querySelectorAll('video').forEach((video, index) => {
  video.muted = true;
  video.defaultMuted = true;
  video.volume = 0;
  video.autoplay = true;
  video.loop = true;
  video.playsInline = true;
  video.setAttribute('muted', '');
  video.setAttribute('playsinline', '');
  video.setAttribute('webkit-playsinline', '');
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'playback-toggle';
  button.setAttribute('aria-label', 'Pausar vídeo do look ' + (index + 1));
  button.textContent = 'Reproduzir';
  video.parentElement.append(button);
  let userPaused = false;
  let pendingPlay = false;
  const sync = () => {
    button.textContent = video.paused ? 'Reproduzir' : 'Pausar';
    button.setAttribute('aria-label', (video.paused ? 'Reproduzir' : 'Pausar') + ' vídeo do look ' + (index + 1));
  };
  button.addEventListener('click', () => {
    userPaused = !video.paused;
    if (video.paused) start();
    else video.pause();
  });
  video.addEventListener('play', sync);
  video.addEventListener('pause', sync);
  video.addEventListener('volumechange', () => { if (!video.muted) video.muted = true; });
  const start = () => {
    if (userPaused || pendingPlay || document.hidden || !video.paused) return;
    video.muted = true;
    video.defaultMuted = true;
    video.volume = 0;
    pendingPlay = true;
    Promise.resolve(video.play()).catch(() => {
      // Keep an honest, usable play control when a browser blocks autoplay.
      sync();
    }).finally(() => { pendingPlay = false; sync(); });
  };
  playbackControllers.push({ video, start });
  ['loadeddata', 'canplay', 'canplaythrough', 'suspend'].forEach(event => video.addEventListener(event, start));
  video.addEventListener('pause', () => { if (!userPaused) start(); });
  video.addEventListener('ended', () => {
    if (!userPaused) { video.currentTime = 0; start(); }
  });
  if ('IntersectionObserver' in window) {
    const visibility = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) start();
    }, { threshold: 0.05 });
    visibility.observe(video);
  }
  sync();
  start();
});
const resumeVideos = () => playbackControllers.forEach(({ start }) => start());
document.addEventListener('visibilitychange', () => { if (!document.hidden) resumeVideos(); });
window.addEventListener('pageshow', resumeVideos);
window.addEventListener('focus', resumeVideos);
// iOS and battery-saving browsers can require a real interaction to begin.
['pointerdown', 'touchend', 'keydown'].forEach(event => {
  document.addEventListener(event, event => {
    if (event.target instanceof Element && event.target.closest('.playback-toggle')) return;
    resumeVideos();
  }, { passive: true });
});
window.setInterval(() => {
  if (document.hidden) return;
  playbackControllers.forEach(({video, start}) => {
    const rect = video.getBoundingClientRect();
    if (rect.bottom > 0 && rect.top < innerHeight && video.paused) start();
  });
}, 2000);
document.getElementById('year').textContent = new Date().getFullYear();
