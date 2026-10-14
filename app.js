(() => {
  const navigation = [...document.querySelectorAll('.top-nav a')];
  const sections = navigation.map(link => document.querySelector(link.getAttribute('href')));
  const progress = document.querySelector('.reading-progress');
  const backToTop = document.querySelector('.back-to-top');
  let pending = false;
  let requestedSection = null;
  const update = () => {
    const length = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${length > 0 ? Math.min(1, window.scrollY / length) : 0})`;
    backToTop.hidden = window.scrollY < 350;
    let active = 0;
    sections.forEach((section, index) => { if (section.getBoundingClientRect().top <= 130) active = index; });
    if (requestedSection !== null) active = requestedSection;
    navigation.forEach((link, index) => {
      if (index === active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    pending = false;
  };
  const requestUpdate = () => { if (!pending) { pending = true; window.requestAnimationFrame(update); } };
  document.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener('click', () => {
    const index = navigation.findIndex(item => item.getAttribute('href') === link.getAttribute('href'));
    if (index >= 0) { requestedSection = index; requestUpdate(); }
  }));
  const clearRequestedSection = () => { requestedSection = null; requestUpdate(); };
  window.addEventListener('wheel', clearRequestedSection, { passive: true });
  window.addEventListener('touchstart', clearRequestedSection, { passive: true });
  window.addEventListener('keydown', event => { if (['ArrowUp','ArrowDown','PageUp','PageDown','Home','End',' '].includes(event.key)) clearRequestedSection(); });
  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);
  document.querySelector('details').addEventListener('toggle', requestUpdate);
  backToTop.addEventListener('click', () => {
    requestedSection = 0;
    window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    requestUpdate();
  });
  update();
})();
