/**
 * AGROISYNC PROMPT CERTEIRO - JavaScript de controle
 * 1) Detecta se a página tem .hero-image e aplica classe no header para ficar TRANSPARENTE
 * 2) Mobile hamburger
 * 3) Carregamento de imagens por página
 */

(function () {
  const header = document.getElementById('main-header');

  function checkHero() {
    const hero = document.querySelector('.hero-image');
    if (hero && hero.getBoundingClientRect().top <= 0) {
      header.classList.add('header-over-image');
    } else {
      header.classList.remove('header-over-image');
    }
  }

  window.addEventListener('scroll', checkHero);
  window.addEventListener('resize', checkHero);
  checkHero();

  // 2) Mobile hamburger
  const hamburger = document.getElementById('hamburger');
  hamburger &&
    hamburger.addEventListener('click', () => {
      document.body.classList.toggle('mobile-menu-open');
      // adicionar lógica para abrir menu mobile (renderizar slide-in)
    });

  // 3) Carregamento de imagens por página: definir imagens 4K específicas
  document.querySelectorAll('.hero-image').forEach(el => {
    if (el.dataset.heroImg) {
      el.style.backgroundImage = `url('${el.dataset.heroImg}')`;
    }
  });
})();
