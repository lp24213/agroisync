import { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const DynamicCryptoURL = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const generateCryptoHash = useCallback(() => {
    // Gerar hash único e limpo
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    return `${timestamp}_${random}`.substring(0, 20);
  }, []);

  const hasValidHash = useCallback((pathname) => {
    // Verificar se a URL já tem um hash válido
    const pathParts = pathname.split('/').filter(part => part.length > 0);
    if (pathParts.length < 2) return false;
    
    const lastPart = pathParts[pathParts.length - 1];
    // Hash deve ter formato: timestamp_random (ex: 1759102035_xe410no4lf)
    return /^\d+_[a-z0-9]+$/i.test(lastPart) && lastPart.length >= 15;
  }, []);

  const cleanPath = useCallback((pathname) => {
    // Remove hash existente da URL para obter o path limpo
    const pathParts = pathname.split('/').filter(part => part.length > 0);
    
    // Se o último segmento é um hash, removê-lo
    if (pathParts.length > 0) {
      const lastPart = pathParts[pathParts.length - 1];
      if (/^\d+_[a-z0-9]+$/i.test(lastPart)) {
        pathParts.pop();
      }
    }
    
    return '/' + pathParts.join('/');
  }, []);

  const updateCryptoURL = useCallback(() => {
    if (isUpdating) return; // Evitar múltiplas atualizações simultâneas
    
    try {
      // Rotas que NÃO devem ter criptografia
      const excludeCrypto = [
        '/payment/success', '/payment/cancel', '/unauthorized', 
        '/contact', '/privacy', '/terms',
        '/faq', '/help', '/'
      ];
      
      const shouldExclude = excludeCrypto.some(route => 
        location.pathname === route || location.pathname.startsWith(route + '/')
      );
      
      // Se deve excluir da criptografia, não fazer nada
      if (shouldExclude) {
        setIsInitialized(true);
        return;
      }
      
      // Verificar se já tem hash válido
      if (hasValidHash(location.pathname)) {
        setIsInitialized(true);
        return;
      }
      
      // Aplicar criptografia sempre que necessário
      if (isInitialized && !isUpdating) {
        setIsUpdating(true);
        
        const cryptoHash = generateCryptoHash();
        const basePath = cleanPath(location.pathname);
        const newPath = `${basePath}/${cryptoHash}`;
        
        // Usar replace: true para evitar loops de redirecionamento
        // Evitar redirecionar imediatamente na primeira renderização da Home
        const isHome = basePath === '' || basePath === '/';
        if (!isHome) {
          navigate(newPath, { replace: true });
        }
        
        // Reset flag após navegação
        setTimeout(() => setIsUpdating(false), 200);
      }
      
    } catch (error) {
      setIsUpdating(false);
      if (process.env.NODE_ENV !== 'production') {
        console.error('Erro ao gerar URL criptografada:', error);
      }
    }
  }, [location.pathname, navigate, generateCryptoHash, hasValidHash, cleanPath, isInitialized, isUpdating]);

  useEffect(() => {
    // Marcar como inicializado após um pequeno delay
    const timer = setTimeout(() => {
      setIsInitialized(true);
    }, 200);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      updateCryptoURL();
    }
  }, [isInitialized, updateCryptoURL]);

  return children;
};

export default DynamicCryptoURL;
