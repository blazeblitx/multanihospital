(() => {
  const carousel = document.querySelector('#home-slider');
  if (!carousel) return;

  const slides = [...carousel.querySelectorAll('.home-slide')];
  const dots = [...carousel.querySelectorAll('[data-slide-to]')];
  const previous = carousel.querySelector('.home-slide-prev');
  const next = carousel.querySelector('.home-slide-next');
  let active = Math.max(0, slides.findIndex(slide => slide.classList.contains('is-active')));

  const show = index => {
    active = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      const selected = i === active;
      slide.classList.toggle('is-active', selected);
      slide.setAttribute('aria-hidden', String(!selected));
      slide.inert = !selected;
    });
    dots.forEach((dot, i) => {
      if (i === active) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
  };

  previous?.addEventListener('click', () => show(active - 1));
  next?.addEventListener('click', () => show(active + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => show(i)));
  carousel.addEventListener('keydown', event => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    show(active + (event.key === 'ArrowRight' ? 1 : -1));
  });

  show(active);
})();
