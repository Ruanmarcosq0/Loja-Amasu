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

document.querySelectorAll('video').forEach((video, index) => {
  video.muted = true;
  video.defaultMuted = true;
  video.volume = 0;
  video.autoplay = true;
  video.loop = true;
  video.playsInline = true;
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'playback-toggle';
  button.setAttribute('aria-label', 'Pausar vídeo do look ' + (index + 1));
  button.textContent = 'Pausar';
  video.parentElement.append(button);
  let userPaused = false;
  const sync = () => {
    button.textContent = video.paused ? 'Reproduzir' : 'Pausar';
    button.setAttribute('aria-label', (video.paused ? 'Reproduzir' : 'Pausar') + ' vídeo do look ' + (index + 1));
  };
  button.addEventListener('click', () => {
    userPaused = !video.paused;
    if (video.paused) video.play().catch(sync);
    else video.pause();
  });
  video.addEventListener('play', sync);
  video.addEventListener('pause', sync);
  video.addEventListener('volumechange', () => { if (!video.muted) video.muted = true; });
  const start = () => { if (!userPaused) video.play().catch(sync); };
  video.addEventListener('loadeddata', start, {once:true});
  start();
});
document.getElementById('year').textContent = new Date().getFullYear();
