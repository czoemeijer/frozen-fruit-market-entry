document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  const carousel = document.querySelector('[data-flavor-carousel]');
  if (!carousel) return;

  const flavors = [
    { id: 'banana', image: 'images/krunchies-banana-bites.png', alt: 'Krunchies Chocolate Banana Bites packaging', name: 'Chocolate banana bites', label: 'banana edit', note: 'creamy fruit / dark cocoa' },
    { id: 'strawberry', image: 'images/krunchies-strawberry-blast.png', alt: 'Krunchies Strawberry Blast packaging', name: 'Strawberry blast', label: 'berry edit', note: 'tart berry / rich chocolate' },
    { id: 'mango', image: 'images/krunchies-mango-crunch.png', alt: 'Krunchies Mango Crunch packaging', name: 'Mango crunch', label: 'tropical edit', note: 'sunny mango / dark cocoa' }
  ];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const image = document.getElementById('hero-product-image');
  const card = document.getElementById('hero-product-card');
  const name = document.getElementById('hero-product-name');
  const count = document.getElementById('hero-product-count');
  const number = document.getElementById('hero-flavor-number');
  const label = document.getElementById('hero-flavor-label');
  const note = document.getElementById('hero-flavor-note');
  const controls = [...carousel.querySelectorAll('[data-flavor]')];
  let activeIndex = 0;
  let rotationTimer;
  let touchStartX = null;

  flavors.forEach((flavor) => { const preload = new Image(); preload.src = flavor.image; });

  function showFlavor(index, shouldAnimate = true) {
    activeIndex = (index + flavors.length) % flavors.length;
    const flavor = flavors[activeIndex];
    const update = () => {
      image.src = flavor.image;
      image.alt = flavor.alt;
      name.textContent = flavor.name;
      count.textContent = `${String(activeIndex + 1).padStart(2, '0')} / 03`;
      number.textContent = String(activeIndex + 1).padStart(2, '0');
      label.textContent = flavor.label;
      note.textContent = flavor.note;
      carousel.dataset.activeFlavor = flavor.id;
      controls.forEach((control) => {
        const isActive = control.dataset.flavor === flavor.id;
        control.classList.toggle('is-active', isActive);
        control.setAttribute('aria-selected', String(isActive));
      });
    };
    if (!shouldAnimate || reduceMotion) { update(); return; }
    card.classList.add('is-changing');
    window.setTimeout(() => { update(); card.classList.remove('is-changing'); }, 150);
  }

  function restartRotation() {
    window.clearInterval(rotationTimer);
    if (!reduceMotion) rotationTimer = window.setInterval(() => showFlavor(activeIndex + 1), 5500);
  }

  controls.forEach((control) => control.addEventListener('click', () => {
    showFlavor(flavors.findIndex((flavor) => flavor.id === control.dataset.flavor));
    restartRotation();
  }));
  carousel.querySelector('.hero-arrow-prev').addEventListener('click', () => { showFlavor(activeIndex - 1); restartRotation(); });
  carousel.querySelector('.hero-arrow-next').addEventListener('click', () => { showFlavor(activeIndex + 1); restartRotation(); });
  carousel.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); showFlavor(activeIndex - 1); restartRotation(); }
    if (event.key === 'ArrowRight') { event.preventDefault(); showFlavor(activeIndex + 1); restartRotation(); }
  });
  carousel.addEventListener('mouseenter', () => window.clearInterval(rotationTimer));
  carousel.addEventListener('mouseleave', restartRotation);
  carousel.addEventListener('focusin', () => window.clearInterval(rotationTimer));
  carousel.addEventListener('focusout', restartRotation);
  carousel.addEventListener('touchstart', (event) => { touchStartX = event.changedTouches[0]?.screenX ?? null; }, { passive: true });
  carousel.addEventListener('touchend', (event) => {
    const endX = event.changedTouches[0]?.screenX;
    if (touchStartX !== null && endX !== undefined && Math.abs(endX - touchStartX) > 45) {
      showFlavor(activeIndex + (endX < touchStartX ? 1 : -1));
      restartRotation();
    }
    touchStartX = null;
  }, { passive: true });
  document.addEventListener('visibilitychange', () => document.hidden ? window.clearInterval(rotationTimer) : restartRotation());

  showFlavor(0, false);
  restartRotation();
});
