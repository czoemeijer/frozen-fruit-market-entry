document.addEventListener('DOMContentLoaded', () => {
  const card = document.querySelector('.hero-product-card');
  if (!card || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  card.addEventListener('pointermove', (event) => {
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(900px) rotateX(${y * -3}deg) rotateY(${x * 4}deg) rotate(3deg)`;
  });

  card.addEventListener('pointerleave', () => {
    card.style.transform = 'rotate(3deg)';
  });
});
