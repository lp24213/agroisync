/**
 * AGROISYNC PROMPT CERTEIRO - JavaScript de controle
 * 1) Detecta se a página tem .hero-image e aplica classe no header para ficar TRANSPARENTE
 * 2) Mobile hamburger
 * 3) Carregamento de imagens por página
 */

(function() {
  const header = document.getElementById('main-header');
  const hero = document.querySelector('.hero-image');
  
  function updateHeader() {
    if (hero && hero.getBoundingClientRect().bottom > 0) {
      header.classList.add('header-over-image');
    } else {
      header.classList.remove('header-over-image');
    }
  }
  
  updateHeader();
  window.addEventListener('scroll', updateHeader);
  window.addEventListener('resize', updateHeader);

  // 2) Mobile hamburger
  const hamburger = document.getElementById('hamburger');
  hamburger && hamburger.addEventListener('click', () => {
    document.body.classList.toggle('mobile-menu-open');
    // adicionar lógica para abrir menu mobile (renderizar slide-in)
  });

  // 3) Carregamento de imagens por página: definir imagens 4K específicas
  // Exemplo: setar via data-hero-img em cada template
  if (hero && hero.dataset.heroImg) {
    hero.style.backgroundImage = `url('${hero.dataset.heroImg}')`;
  }
})();
