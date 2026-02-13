import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Componente de Background Parallax com Animação de Mouse
 * Detecta automaticamente imagens de fundo das páginas e aplica efeito parallax
 */
const ParallaxBackground = () => {
  const location = useLocation();
  const backgroundRef = useRef(null);
  // SEMPRE usar imagem de campo de soja como padrão
  const DEFAULT_IMAGE = 'https://plus.unsplash.com/premium_photo-1661962692274-00c1e844c90f?w=1920&h=1080&auto=format&fit=crop&q=90&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OTB8fGNhbXBvJTIwZGUlMjBzb2phfGVufDB8fDB8fHww';
  const [backgroundImage, setBackgroundImage] = useState(DEFAULT_IMAGE);
  const animationFrameIdRef = useRef(null);
  const mouseXRef = useRef(0);
  const mouseYRef = useRef(0);
  const targetXRef = useRef(0);
  const targetYRef = useRef(0);

  // Detectar imagem de fundo da página atual
  useEffect(() => {
    const detectBackgroundImage = () => {
      let foundImage = null;

      // 1. Procurar por elementos com backgroundImage inline no style
      const styleElements = document.querySelectorAll('[style*="backgroundImage"], [style*="background-image"]');
      
      for (let el of styleElements) {
        const inlineStyle = el.getAttribute('style') || '';
        const bgMatch = inlineStyle.match(/backgroundImage:\s*url\(['"]?([^'"]+)['"]?\)|background-image:\s*url\(['"]?([^'"]+)['"]?\)/i);
        
        if (bgMatch && (bgMatch[1] || bgMatch[2])) {
          const imageUrl = bgMatch[1] || bgMatch[2];
          if (imageUrl && !imageUrl.includes('data:') && !imageUrl.includes('gradient')) {
            foundImage = imageUrl;
            break;
          }
        }

        // Também verificar computed style
        const computedStyle = window.getComputedStyle(el);
        const bgImage = computedStyle.backgroundImage;
        if (bgImage && bgImage !== 'none' && bgImage.includes('url')) {
          const match = bgImage.match(/url\(['"]?([^'"]+)['"]?\)/);
          if (match && match[1] && !match[1].includes('data:') && !match[1].includes('gradient')) {
            foundImage = match[1];
            break;
          }
        }
      }

      // 2. Se não encontrou, procurar por seções hero específicas e TODAS as seções com background
      if (!foundImage) {
        // Primeiro, procurar em seções específicas
        const heroSelectors = [
          '.bloomfi-hero',
          '[class*="hero"]',
          'section[style*="background"]',
          'section[style*="backgroundImage"]',
          '[data-page]',
          'section.relative', // Seções com classe relative que geralmente têm background
          'section.flex' // Seções flex que geralmente têm background
        ];

        for (const selector of heroSelectors) {
          const heroSection = document.querySelector(selector);
          if (heroSection) {
            const inlineStyle = heroSection.getAttribute('style') || '';
            const bgMatch = inlineStyle.match(/backgroundImage:\s*url\(['"]?([^'"]+)['"]?\)|background-image:\s*url\(['"]?([^'"]+)['"]?\)/i);
            
            if (bgMatch && (bgMatch[1] || bgMatch[2])) {
              const imageUrl = bgMatch[1] || bgMatch[2];
              if (imageUrl && !imageUrl.includes('data:') && !imageUrl.includes('gradient')) {
                foundImage = imageUrl;
                break;
              }
            }

            const computedStyle = window.getComputedStyle(heroSection);
            const bgImage = computedStyle.backgroundImage;
            if (bgImage && bgImage !== 'none' && bgImage.includes('url')) {
              const match = bgImage.match(/url\(['"]?([^'"]+)['"]?\)/);
              if (match && match[1] && !match[1].includes('data:') && !match[1].includes('gradient')) {
                foundImage = match[1];
                break;
              }
            }
          }
        }
        
        // Se ainda não encontrou, procurar em TODAS as seções
        if (!foundImage) {
          const allSections = document.querySelectorAll('section');
          for (const section of allSections) {
            const inlineStyle = section.getAttribute('style') || '';
            if (inlineStyle.includes('backgroundImage') || inlineStyle.includes('background-image')) {
              const bgMatch = inlineStyle.match(/backgroundImage:\s*url\(['"]?([^'"]+)['"]?\)|background-image:\s*url\(['"]?([^'"]+)['"]?\)/i);
              if (bgMatch && (bgMatch[1] || bgMatch[2])) {
                const imageUrl = bgMatch[1] || bgMatch[2];
                if (imageUrl && !imageUrl.includes('data:') && !imageUrl.includes('gradient')) {
                  foundImage = imageUrl;
                  break;
                }
              }
            }
          }
        }
      }

      // 3. Fallback: usar imagem baseada na rota (imagens originais de cada página)
      if (!foundImage) {
        const path = window.location.pathname;
        const routeImages = {
          '/': 'https://plus.unsplash.com/premium_photo-1661962692274-00c1e844c90f?w=1920&h=1080&auto=format&fit=crop&q=90&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OTB8fGNhbXBvJTIwZGUlMjBzb2phfGVufDB8fDB8fHww', // Campo de soja para HOME
          '/marketplace': 'https://media.istockphoto.com/id/1387913618/pt/foto/modern-interface-payments-online-shopping-and-icon-customer-network-connection.jpg?s=612x612&w=0&k=20&c=VZuOaJFJxBjZYtLygWCpgGrCg1Bu2kHEm-ufWlYeeb4=',
          '/loja': 'https://media.istockphoto.com/id/2235929731/pt/foto/e-commerce-business-with-digital-shopping-cart-icons-for-online-store-digital-marketing-and.jpg?s=612x612&w=0&k=20&c=PuPwyebMsSW7UFTurrlronetuOOwQBbcB_zT8Jki7VM=',
          '/agroconecta': 'https://plus.unsplash.com/premium_photo-1661962692274-00c1e844c90f?w=1920&h=1080&auto=format&fit=crop&q=90&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OTB8fGNhbXBvJTIwZGUlMjBzb2phfGVufDB8fDB8fHww',
          '/frete': 'https://plus.unsplash.com/premium_photo-1661962692274-00c1e844c90f?w=1920&h=1080&auto=format&fit=crop&q=90&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OTB8fGNhbXBvJTIwZGUlMjBzb2phfGVufDB8fDB8fHww',
          '/planos': 'https://media.istockphoto.com/id/2177423222/pt/foto/e-commerce-concept-online-sale-business-growth-businessman-drawing-increasing-trend-graph-of.jpg?s=612x612&w=0&k=20&c=40Ax20aDzE5HNePAP3JdVjxo-uKkhhM3N0fP05crDCc=',
          '/clima': 'https://media.istockphoto.com/id/1383036942/pt/foto/agricultural-truck-irrigating-system-over-a-crop-field.webp?a=1&b=1&s=612x612&w=0&k=20&c=w4mi88dhNs4HOLmECvsahmBat4QVm2EfTVBFaesHwbQ=',
          '/about': '/images/bela-natureza-retro-com-campo.jpg',
          '/sobre': '/images/bela-natureza-retro-com-campo.jpg',
          '/partnerships': 'https://media.istockphoto.com/id/1303594191/pt/foto/man-and-woman-are-working-in-office.jpg?s=612x612&w=0&k=20&c=9QxXyI4_XpVj3RnYVxQusSs0PaCfyx6X3txIkXqMrAw='
        };

        // Verificar se a rota começa com algum dos paths
        let matchedRoute = Object.keys(routeImages).find(route => path === route || path.startsWith(route + '/'));
        foundImage = matchedRoute ? routeImages[matchedRoute] : DEFAULT_IMAGE;
      }

      // SEMPRE setar a imagem
      setBackgroundImage(foundImage || DEFAULT_IMAGE);
    };

    // Detectar imediatamente e depois com delay
    detectBackgroundImage();
    const timer = setTimeout(detectBackgroundImage, 300);
    const timer2 = setTimeout(detectBackgroundImage, 1000);
    
    // Observar mudanças na rota e no DOM
    const observer = new MutationObserver(() => {
      detectBackgroundImage();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class']
    });

    // Observar mudanças de rota
    const handleRouteChange = () => {
      setTimeout(detectBackgroundImage, 300);
    };
    window.addEventListener('popstate', handleRouteChange);

    return () => {
      if (timer) clearTimeout(timer);
      if (timer2) clearTimeout(timer2);
      observer.disconnect();
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, [location.pathname]); // Re-executar quando a rota mudar

  // Configurar eventos de mouse e animação - SEMPRE executar
  useEffect(() => {
    if (!backgroundRef.current) {
      // Se ainda não tem ref, aguardar um pouco
      const timer = setTimeout(() => {
        if (backgroundRef.current) {
          backgroundRef.current.classList.add('loaded');
        }
      }, 100);
      return () => clearTimeout(timer);
    }
    
    const imageToUse = backgroundImage || DEFAULT_IMAGE;
    
    // Garantir que a imagem está setada
    if (backgroundRef.current) {
      backgroundRef.current.style.backgroundImage = `url(${imageToUse})`;
    }

    const backgroundElement = backgroundRef.current;
    let isAnimating = true;

    const handleMouseMove = (event) => {
      // Calcular posição normalizada do mouse (-1 a 1)
      targetXRef.current = (event.clientX / window.innerWidth) * 2 - 1;
      targetYRef.current = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    const handleMouseLeave = () => {
      // Retornar ao centro quando o mouse sair da tela
      targetXRef.current = 0;
      targetYRef.current = 0;
    };

          let lastTime = 0;
          let frameCount = 0;
          const animate = (currentTime) => {
            if (!isAnimating) return;

            // Throttle mais agressivo - 30fps para melhor performance
            const deltaTime = currentTime - lastTime;
            if (deltaTime < 33) {
              animationFrameIdRef.current = requestAnimationFrame(animate);
              return;
            }
            lastTime = currentTime;
            frameCount++;

            // Pular frames para reduzir carga
            if (frameCount % 2 === 0) {
              animationFrameIdRef.current = requestAnimationFrame(animate);
              return;
            }

            // Suavizar movimento - mais rápido para menos processamento
            mouseXRef.current += (targetXRef.current - mouseXRef.current) * 0.12;
            mouseYRef.current += (targetYRef.current - mouseYRef.current) * 0.12;

            // Parallax mais sutil para melhor performance
            const translateX = mouseXRef.current * 15; // Reduzido ainda mais
            const translateY = mouseYRef.current * 15; // Reduzido ainda mais
            const scale = 1.05; // Zoom mínimo

            // Usar transform3d para GPU acceleration
            backgroundElement.style.transform = `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})`;

            animationFrameIdRef.current = requestAnimationFrame(animate);
          };

    // Desabilitar em mobile e otimizar performance
    const isMobile = window.innerWidth < 768;
    const isLowEnd = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
    
    // Throttle mais agressivo do mousemove para melhor performance
    let mouseMoveTimeout;
    let lastMouseX = 0;
    let lastMouseY = 0;
    const throttledMouseMove = (event) => {
      // Ignorar movimentos muito pequenos
      const deltaX = Math.abs(event.clientX - lastMouseX);
      const deltaY = Math.abs(event.clientY - lastMouseY);
      if (deltaX < 5 && deltaY < 5) return;
      
      lastMouseX = event.clientX;
      lastMouseY = event.clientY;
      
      if (mouseMoveTimeout) return;
      mouseMoveTimeout = setTimeout(() => {
        handleMouseMove(event);
        mouseMoveTimeout = null;
      }, 50); // ~20fps para melhor performance
    };
    
    if (!isMobile && !isLowEnd) {
      document.addEventListener('mousemove', throttledMouseMove, { passive: true });
      document.addEventListener('mouseleave', handleMouseLeave, { passive: true });
      animate();
    } else {
      // Em mobile ou dispositivos lentos, desabilitar parallax
      backgroundElement.style.transform = 'translate3d(0, 0, 0) scale(1)';
      backgroundElement.style.willChange = 'auto';
    }

    // Carregar imagem
    const img = new Image();
    img.onload = () => {
      backgroundElement.classList.add('loaded');
    };
    img.onerror = () => {
      // Se der erro, usar a imagem padrão
      backgroundElement.style.backgroundImage = `url(${DEFAULT_IMAGE})`;
      backgroundElement.classList.add('loaded');
    };
    img.src = imageToUse;
    
    // Garantir que a imagem apareça mesmo se o onload não disparar
    setTimeout(() => {
      if (backgroundElement && !backgroundElement.classList.contains('loaded')) {
        backgroundElement.classList.add('loaded');
      }
    }, 100);
    
    // Forçar aparecer após 500ms
    setTimeout(() => {
      if (backgroundElement) {
        backgroundElement.classList.add('loaded');
        backgroundElement.style.opacity = '1';
      }
    }, 500);

          return () => {
            isAnimating = false;
            if (animationFrameIdRef.current) {
              cancelAnimationFrame(animationFrameIdRef.current);
            }
            document.removeEventListener('mousemove', throttledMouseMove);
            document.removeEventListener('mouseleave', handleMouseLeave);
            if (mouseMoveTimeout) {
              clearTimeout(mouseMoveTimeout);
            }
          };
  }, [backgroundImage, DEFAULT_IMAGE]);

  // SEMPRE renderizar com a imagem de campo de soja - FORÇAR APARECER IMEDIATAMENTE
  const imageUrl = backgroundImage || DEFAULT_IMAGE;
  
  // Garantir que a classe loaded seja adicionada imediatamente
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (backgroundRef.current) {
        backgroundRef.current.classList.add('loaded');
        backgroundRef.current.style.opacity = '1';
        backgroundRef.current.style.backgroundImage = `url(${imageUrl})`;
        backgroundRef.current.style.display = 'block';
        backgroundRef.current.style.visibility = 'visible';
      }
    }, 50);
    
    return () => clearTimeout(timer);
  }, [imageUrl]);
  
  return (
    <div
      ref={backgroundRef}
      id="soy-field-background"
      className="soy-field-background loaded"
      style={{
        backgroundImage: `url(${imageUrl})`,
        opacity: 1,
        display: 'block',
        visibility: 'visible',
        zIndex: -10
      }}
    />
  );
};

export default ParallaxBackground;

