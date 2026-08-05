/**
 * KRUNCHIES - Main Interactive Script
 */

document.addEventListener('DOMContentLoaded', () => {
  console.log('KRUNCHIES Official Website initialized! Domain: krunchies.eu.org');

  // Smooth Scrolling for Navigation Links
  const navLinks = document.querySelectorAll('a[href^="#"]');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElem = document.querySelector(targetId);
        if (targetElem) {
          targetElem.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  // Micro-interaction: Subtle Tilt on Hover for Product Card Frame
  const cardFrame = document.querySelector('.comic-card-frame');
  if (cardFrame) {
    cardFrame.addEventListener('mousemove', (e) => {
      const rect = cardFrame.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const rotateX = (-y / rect.height) * 10;
      const rotateY = (x / rect.width) * 10;
      cardFrame.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });

    cardFrame.addEventListener('mouseleave', () => {
      cardFrame.style.transform = 'rotate(2deg) scale(1)';
    });
  }
});
