import { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const DynamicCryptoURL = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const generateCryptoHash = useCallback(() => {
    // Gerar hash único e limpo - formato mais simples
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 10);
    return `${timestamp}_${random}`.substring(0, 25);
  }, []);

  const hasValidHash = useCallback(pathname => {
    // Verificar se a URL já tem um hash válido
    const pathParts = pathname.split('/').filter(part => part.length > 0);
    if (pathParts.length < 2) return false;

    const lastPart = pathParts[pathParts.length - 1];
    // Hash pode ser qualquer formato alfanumérico (mais flexível)
    return /^[a-z0-9_-]+$/i.test(lastPart) && lastPart.length >= 10;
  }, []);

  const cleanPath = useCallback(pathname => {
    // Remove hash existente da URL para obter o path limpo
    const pathParts = pathname.split('/').filter(part => part.length > 0);

    // Se o último segmento é um hash, removê-lo
    if (pathParts.length > 0) {
      const lastPart = pathParts[pathParts.length - 1];
      if (/^\d+_[a-z0-9]+$/i.test(lastPart)) {
        pathParts.pop();
      }
    }

    return pathParts.length > 0 ? '/' + pathParts.join('/') : '/';
  }, []);

  const updateCryptoURL = useCallback(() => {
    if (isUpdating) return; // Evitar múltiplas atualizações simultâneas

    try {
      // Rotas que NÃO devem ter criptografia (rotas públicas)
      const excludeCrypto = [
        '/payment/success',
        '/payment/cancel',
        '/unauthorized',
        '/contact',
        '/privacy',
        '/terms',
        '/faq',
        '/help',
        '/',
        '/home',
        '/home-prompt',
        '/marketplace',
        '/loja',
        '/store',
        '/agroconecta',
        '/usuario-geral',
        '/tecnologia',
        '/insumos',
        '/plans',
        '/planos',
        '/about',
        '/sobre',
        '/partnerships',
        '/register',
        '/login',
        '/signup',
        '/forgot-password',
        '/reset-password',
        '/two-factor-auth',
        '/verify-email',
        '/login-redirect'
      ];

      // Rotas que DEVEM ter criptografia (rotas protegidas/privadas)
      const requireCrypto = [
        '/dashboard',
        '/user-dashboard',
        '/messaging',
        '/admin',
        '/useradmin',
        '/crypto-routes',
        '/produto',
        '/crypto',
        '/payment'
      ];

      // Verificar se deve excluir da criptografia
      const shouldExclude = excludeCrypto.some(route => {
        return location.pathname === route || 
               (route !== '/' && location.pathname.startsWith(route + '/'));
      });

      // Verificar se deve ter criptografia
      const shouldHaveCrypto = requireCrypto.some(route => {
        return location.pathname === route || location.pathname.startsWith(route + '/');
      });

      // Se deve excluir da criptografia, não fazer nada
      if (shouldExclude) {
        setIsInitialized(true);
        return;
      }

      // Se não é rota que requer criptografia, não fazer nada
      if (!shouldHaveCrypto) {
        setIsInitialized(true);
        return;
      }

      // Verificar se já tem hash válido
      if (hasValidHash(location.pathname)) {
        setIsInitialized(true);
        return;
      }

      // Aplicar criptografia para rotas protegidas/privadas
      if (!isUpdating) {
        setIsUpdating(true);

        const cryptoHash = generateCryptoHash();
        const basePath = cleanPath(location.pathname);
        
        // Construir nova URL criptografada
        const newPath = basePath === '/' ? `/${cryptoHash}` : `${basePath}/${cryptoHash}`;

        // Navegar para a URL criptografada
        navigate(newPath, { replace: true });

        // Reset flag após navegação
        setTimeout(() => setIsUpdating(false), 100);
      }
    } catch (error) {
      setIsUpdating(false);
      if (process.env.NODE_ENV !== 'production') {
        console.error('Erro ao gerar URL criptografada:', error);
      }
    }
  }, [location.pathname, navigate, generateCryptoHash, hasValidHash, cleanPath, isInitialized, isUpdating]);

  useEffect(() => {
    // Marcar como inicializado imediatamente
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      updateCryptoURL();
    }
  }, [isInitialized, updateCryptoURL]);

  return children;
};

export default DynamicCryptoURL;
