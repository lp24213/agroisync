/* ========================================
   UI TXC FINAL BEHAVIORS - AGROISYNC
   Scripts para correção de comportamentos e i18n
   ======================================== */

(function () {
  'use strict';

  // === NAVBAR SCROLL BEHAVIOR ===
  let lastScrollY = window.scrollY;
  let ticking = false;

  function updateNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    const currentScrollY = window.scrollY;

    if (currentScrollY > 100) {
      navbar.classList.add('navbar-scrolled');
    } else {
      navbar.classList.remove('navbar-scrolled');
    }

    lastScrollY = currentScrollY;
    ticking = false;
  }

  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateNavbar);
      ticking = true;
    }
  }

  window.addEventListener('scroll', requestTick);

  // === LANGUAGE SELECTOR BEHAVIOR ===
  function initLanguageSelector() {
    const languageBtn = document.querySelector('.agro-language-btn');
    const languageDropdown = document.querySelector('.agro-language-dropdown');

    if (!languageBtn || !languageDropdown) return;

    let isOpen = false;

    function toggleDropdown() {
      isOpen = !isOpen;
      languageDropdown.style.display = isOpen ? 'block' : 'none';

      // Update aria attributes
      languageBtn.setAttribute('aria-expanded', isOpen);
    }

    function closeDropdown() {
      isOpen = false;
      languageDropdown.style.display = 'none';
      languageBtn.setAttribute('aria-expanded', false);
    }

    // Toggle on button click
    languageBtn.addEventListener('click', e => {
      e.stopPropagation();
      toggleDropdown();
    });

    // Close on outside click
    document.addEventListener('click', e => {
      if (!languageBtn.contains(e.target) && !languageDropdown.contains(e.target)) {
        closeDropdown();
      }
    });

    // Close on escape key
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        closeDropdown();
      }
    });

    // Handle language option clicks
    const languageOptions = languageDropdown.querySelectorAll('.agro-lang-option');
    languageOptions.forEach(option => {
      option.addEventListener('click', e => {
        e.preventDefault();
        const langCode = option.dataset.lang || option.textContent.trim().toLowerCase();

        // Update active state
        languageOptions.forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');

        // Update button text
        const flag = option.querySelector('.agro-lang-flag')?.textContent || '🌐';
        const name = option.querySelector('.agro-lang-name')?.textContent || langCode.toUpperCase();
        languageBtn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          </svg>
          <span class="agro-lang-text">${name}</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="6,9 12,15 18,9"/>
          </svg>
        `;

        closeDropdown();

        // Trigger language change event
        window.dispatchEvent(
          new CustomEvent('languageChange', {
            detail: { langCode, flag, name }
          })
        );
      });
    });
  }

  // === MOBILE MENU BEHAVIOR ===
  function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (!mobileMenuBtn || !mobileMenu) return;

    let isOpen = false;

    function toggleMobileMenu() {
      isOpen = !isOpen;
      mobileMenu.style.display = isOpen ? 'block' : 'none';
      mobileMenuBtn.setAttribute('aria-expanded', isOpen);

      // Update button icon
      const icon = mobileMenuBtn.querySelector('svg');
      if (icon) {
        icon.innerHTML = isOpen ? '<path d="M18 6L6 18M6 6l12 12"/>' : '<path d="M3 12h18M3 6h18M3 18h18"/>';
      }
    }

    mobileMenuBtn.addEventListener('click', e => {
      e.stopPropagation();
      toggleMobileMenu();
    });

    // Close on outside click
    document.addEventListener('click', e => {
      if (!mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
        isOpen = false;
        mobileMenu.style.display = 'none';
        mobileMenuBtn.setAttribute('aria-expanded', false);
      }
    });

    // Close on escape key
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && isOpen) {
        toggleMobileMenu();
      }
    });
  }

  // === I18N EXPOSED KEYS DETECTION ===
  function detectExposedI18nKeys() {
    const exposedKeys = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);

    let node;
    while ((node = walker.nextNode())) {
      const text = node.textContent.trim();
      const i18nPattern = /\b[a-z0-9_]+\.[a-z0-9_.]+\b/i;

      if (i18nPattern.test(text)) {
        const matches = text.match(i18nPattern);
        matches.forEach(match => {
          exposedKeys.push({
            key: match,
            text: text,
            element: node.parentElement,
            selector: getElementSelector(node.parentElement)
          });
        });
      }
    }

    return exposedKeys;
  }

  function getElementSelector(element) {
    if (element.id) return `#${element.id}`;

    let selector = element.tagName.toLowerCase();
    if (element.className) {
      selector += '.' + element.className.split(' ').join('.');
    }

    return selector;
  }

  // === FIX EXPOSED I18N KEYS ===
  function fixExposedI18nKeys() {
    const exposedKeys = detectExposedI18nKeys();

    exposedKeys.forEach(item => {
      const element = item.element;

      // Add visual indicator for debugging (only in development)
      if (process.env.NODE_ENV === 'development') {
        element.style.border = '2px solid #ef4444';
        element.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
        element.title = `I18N Key Exposed: ${item.key}`;
      }

      // Try to replace with fallback text
      const fallbackText = getFallbackText(item.key);
      if (fallbackText && element.textContent.trim() === item.text) {
        element.textContent = fallbackText;
        if (process.env.NODE_ENV === 'development') {
          element.style.border = '2px solid #f59e0b';
          element.style.backgroundColor = 'rgba(245, 158, 11, 0.1)';
          element.title = `Fixed I18N Key: ${item.key} -> ${fallbackText}`;
        }
      }
    });

    // Generate report
    const report = {
      timestamp: new Date().toISOString(),
      totalExposedKeys: exposedKeys.length,
      keys: exposedKeys.map(item => ({
        key: item.key,
        selector: item.selector,
        text: item.text
      }))
    };

    // Store report in global variable for access
    window.i18nAuditReport = report;

    // Log to console
    console.group('🔍 I18N Audit Report');
    console.log(`Found ${exposedKeys.length} exposed i18n keys`);
    console.table(report.keys);
    console.groupEnd();

    return report;
  }

  function getFallbackText(key) {
    const fallbacks = {
      'nav.inicio': 'Início',
      'nav.loja': 'Loja',
      'nav.agroconecta': 'AgroConecta',
      'nav.marketplace': 'Marketplace',
      'nav.tecnologia': 'Tecnologia',
      'nav.parcerias': 'Parcerias',
      'nav.languages': 'Idiomas',
      'nav.selectLanguage': 'Selecionar Idioma',
      'home.title': 'Agroisync',
      'home.subtitle': 'A Plataforma de Agronegócio Mais Futurista do Mundo',
      'home.exploreMarketplace': 'Explorar Marketplace',
      'home.learnMore': 'Saiba Mais',
      'features.marketplace.title': 'Marketplace Digital',
      'features.marketplace.description':
        'Conecte-se com compradores e vendedores em uma plataforma segura e eficiente.',
      'features.agroconecta.title': 'AgroConecta',
      'features.agroconecta.description': 'Logística inteligente para otimizar toda a cadeia de suprimentos agrícolas.',
      'features.crypto.title': 'Tecnologia Blockchain',
      'features.crypto.description': 'Transações seguras e transparentes com tecnologia de ponta.',
      'features.analytics.title': 'Analytics Avançado',
      'features.analytics.description': 'Insights poderosos para tomar decisões estratégicas no agronegócio.'
    };

    return fallbacks[key] || key.replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  // === SMOOTH SCROLLING ===
  function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
      link.addEventListener('click', e => {
        const href = link.getAttribute('href');
        if (href === '#') return;

        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  // === FORM VALIDATION ===
  function initFormValidation() {
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
      form.addEventListener('submit', e => {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
          if (!field.value.trim()) {
            isValid = false;
            field.style.borderColor = '#dc3545';
            field.style.backgroundColor = 'rgba(220, 53, 69, 0.1)';
          } else {
            field.style.borderColor = '#3B5D2A';
            field.style.backgroundColor = 'transparent';
          }
        });

        if (!isValid) {
          e.preventDefault();
          alert('Por favor, preencha todos os campos obrigatórios.');
        }
      });
    });
  }

  // === INITIALIZATION ===
  function init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    console.log('🚀 Initializing UI TXC Final Behaviors...');

    // Initialize all behaviors
    initLanguageSelector();
    initMobileMenu();
    initSmoothScrolling();
    initFormValidation();

    // Run i18n audit
    setTimeout(() => {
      const report = fixExposedI18nKeys();

      // Save report to localStorage for debugging
      localStorage.setItem('i18nAuditReport', JSON.stringify(report));
    }, 1000);

    console.log('✅ UI TXC Final Behaviors initialized successfully');
  }

  // Start initialization
  init();

  // Export functions for external access
  window.UITXCFinal = {
    detectExposedI18nKeys,
    fixExposedI18nKeys,
    getFallbackText,
    initLanguageSelector,
    initMobileMenu
  };
})();
