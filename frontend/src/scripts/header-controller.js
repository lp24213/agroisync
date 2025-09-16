/**
 * AGROISYNC HEADER CONTROLLER
 * Controla o comportamento do header transparente e funcionalidades
 */

class AgroisyncHeaderController {
  constructor() {
    this.header = document.getElementById('main-header');
    this.hero = document.querySelector('.hero-image');
    this.hamburger = document.getElementById('hamburger');
    this.mobileMenu = null;
    this.isInitialized = false;
    
    this.init();
  }

  init() {
    if (!this.header) {
      console.warn('Header element not found');
      return;
    }

    this.setupEventListeners();
    this.setupMobileMenu();
    this.updateHeaderState();
    this.setupImageLoading();
    this.isInitialized = true;
  }

  setupEventListeners() {
    // Scroll e resize para atualizar estado do header
    window.addEventListener('scroll', this.throttle(this.updateHeaderState.bind(this), 16));
    window.addEventListener('resize', this.throttle(this.updateHeaderState.bind(this), 100));

    // Hamburger menu
    if (this.hamburger) {
      this.hamburger.addEventListener('click', this.toggleMobileMenu.bind(this));
    }

    // Fechar menu mobile ao clicar fora
    document.addEventListener('click', this.handleOutsideClick.bind(this));

    // Fechar menu mobile ao pressionar ESC
    document.addEventListener('keydown', this.handleKeydown.bind(this));
  }

  setupMobileMenu() {
    // Criar menu mobile se não existir
    if (!document.querySelector('.mobile-menu')) {
      this.createMobileMenu();
    }
    this.mobileMenu = document.querySelector('.mobile-menu');
  }

  createMobileMenu() {
    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'mobile-menu';
    
    // Copiar navegação para mobile
    const nav = document.getElementById('main-nav');
    if (nav) {
      mobileMenu.innerHTML = `
        <nav aria-label="Menu mobile">
          ${nav.innerHTML}
        </nav>
        <div class="mobile-actions">
          <a href="/login" class="btn-login">Entrar</a>
          <a href="/register" class="btn-cta">Cadastrar</a>
        </div>
      `;
    }
    
    document.body.appendChild(mobileMenu);
  }

  updateHeaderState() {
    if (!this.header || !this.hero) return;

    const heroRect = this.hero.getBoundingClientRect();
    const isOverHero = heroRect.bottom > 0 && heroRect.top < window.innerHeight;

    if (isOverHero) {
      this.header.classList.add('header-over-image');
    } else {
      this.header.classList.remove('header-over-image');
    }
  }

  setupImageLoading() {
    // Configurar imagens de hero baseado no data-hero-img
    if (this.hero && this.hero.dataset.heroImg) {
      this.loadHeroImage(this.hero.dataset.heroImg);
    }
  }

  loadHeroImage(imageUrl) {
    if (!this.hero) return;

    // Criar elemento de imagem para preload
    const img = new Image();
    img.onload = () => {
      this.hero.style.backgroundImage = `url('${imageUrl}')`;
      this.hero.classList.add('loaded');
    };
    img.onerror = () => {
      console.warn('Failed to load hero image:', imageUrl);
      // Fallback para imagem padrão
      this.hero.style.backgroundImage = `url('/assets/hero-default.jpg')`;
    };
    img.src = imageUrl;
  }

  toggleMobileMenu() {
    document.body.classList.toggle('mobile-menu-open');
    
    // Atualizar aria-label do hamburger
    if (this.hamburger) {
      const isOpen = document.body.classList.contains('mobile-menu-open');
      this.hamburger.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
      this.hamburger.setAttribute('aria-expanded', isOpen);
    }
  }

  handleOutsideClick(event) {
    if (!document.body.classList.contains('mobile-menu-open')) return;
    
    const isClickInsideMenu = this.mobileMenu && this.mobileMenu.contains(event.target);
    const isClickOnHamburger = this.hamburger && this.hamburger.contains(event.target);
    
    if (!isClickInsideMenu && !isClickOnHamburger) {
      this.closeMobileMenu();
    }
  }

  handleKeydown(event) {
    if (event.key === 'Escape' && document.body.classList.contains('mobile-menu-open')) {
      this.closeMobileMenu();
    }
  }

  closeMobileMenu() {
    document.body.classList.remove('mobile-menu-open');
    if (this.hamburger) {
      this.hamburger.setAttribute('aria-label', 'Abrir menu');
      this.hamburger.setAttribute('aria-expanded', 'false');
    }
  }

  // Utility function para throttling
  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  // Método público para atualizar imagem do hero
  updateHeroImage(imageUrl) {
    if (this.hero) {
      this.hero.dataset.heroImg = imageUrl;
      this.loadHeroImage(imageUrl);
    }
  }

  // Método público para adicionar classe ao header
  addHeaderClass(className) {
    if (this.header) {
      this.header.classList.add(className);
    }
  }

  // Método público para remover classe do header
  removeHeaderClass(className) {
    if (this.header) {
      this.header.classList.remove(className);
    }
  }

  // Método público para verificar se está sobre hero
  isOverHero() {
    if (!this.hero) return false;
    const heroRect = this.hero.getBoundingClientRect();
    return heroRect.bottom > 0 && heroRect.top < window.innerHeight;
  }
}

// Auto-inicialização quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  window.agroisyncHeader = new AgroisyncHeaderController();
});

// Exportar para uso em módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AgroisyncHeaderController;
}
