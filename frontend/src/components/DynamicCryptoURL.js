import { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const DynamicCryptoURL = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Gera valores de parâmetros criptografados (querystring) - ESTÁVEIS
  const generateParams = useCallback(() => {
    // IDs persistentes para estabilidade - NÃO mudam constantemente
    let storedUsr = localStorage.getItem('agro_usr');
    let storedSess = sessionStorage.getItem('agro_sess');
    let storedZx = localStorage.getItem('agro_zx');
    let storedCr = localStorage.getItem('agro_cr');
    
    // Gerar apenas se não existirem
    if (!storedUsr) {
      storedUsr = `usr_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 8)}`;
      localStorage.setItem('agro_usr', storedUsr);
    }
    
    if (!storedSess) {
      storedSess = `sess_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
      sessionStorage.setItem('agro_sess', storedSess);
    }
    
    if (!storedZx) {
      storedZx = Date.now().toString();
      localStorage.setItem('agro_zx', storedZx);
    }
    
    if (!storedCr) {
      storedCr = Math.random().toString(36).substring(2, 10);
      localStorage.setItem('agro_cr', storedCr);
    }

    return {
      zx: storedZx, // timestamp fixo
      no_sw_cr: storedCr, // token fixo
      usr: storedUsr, // estável por dispositivo
      sess: storedSess // estável por sessão do navegador
    };
  }, []);

  const hasValidParams = useCallback(search => {
    const sp = new URLSearchParams(search || '');
    const zx = sp.get('zx');
    const no_sw_cr = sp.get('no_sw_cr');
    const usr = sp.get('usr');
    const sess = sp.get('sess');
    const alnum = /^[a-z0-9_-]+$/i;
    return !!(zx && zx.length >= 10 && alnum.test(no_sw_cr || '') && alnum.test(usr || '') && alnum.test(sess || ''));
  }, []);

  const mergeParams = useCallback((search, paramsToEnsure) => {
    const sp = new URLSearchParams(search || '');
    Object.entries(paramsToEnsure).forEach(([k, v]) => {
      if (!sp.get(k)) sp.set(k, v);
    });
    return `?${sp.toString()}`;
  }, []);

  const updateCryptoURL = useCallback(() => {
    if (isUpdating) return; // Evitar múltiplas atualizações simultâneas

    try {
      // Rotas que NÃO devem ter criptografia (mantidas sem hash por compatibilidade externa)
      const excludeCrypto = [
        '/payment/success',
        '/payment/cancel',
        '/unauthorized'
      ];
      
      // IMPORTANTE: Permitir TODAS as rotas funcionarem, apenas adicionar parâmetros se não existirem

      const shouldExclude = excludeCrypto.some(route => {
        return location.pathname === route || (route !== '/' && location.pathname.startsWith(route + '/'));
      });

      // Para todas as demais rotas, exigir hash criptográfico
      if (shouldExclude) {
        setIsInitialized(true);
        return;
      }

      // SEMPRE permitir acesso às páginas, mas adicionar parâmetros se necessário
      if (!hasValidParams(location.search) && !isUpdating) {
        setIsUpdating(true);

        const ensured = generateParams();
        const newSearch = mergeParams(location.search, ensured);
        const newUrl = `${location.pathname}${newSearch}`;

        // Navegar para a URL com query params criptografados
        navigate(newUrl, { replace: true });

        // Reset flag após navegação
        setTimeout(() => {
          setIsUpdating(false);
          setIsInitialized(true);
        }, 100);
      } else {
        // Se já tem parâmetros válidos ou deve ser excluído, marcar como inicializado
        setIsInitialized(true);
      }
    } catch (error) {
      setIsUpdating(false);
      if (process.env.NODE_ENV !== 'production') {
        // Erro ao gerar URL criptografada
      }
    }
  }, [location.pathname, location.search, navigate, generateParams, hasValidParams, mergeParams, isUpdating]);

  useEffect(() => {
    // Executar apenas uma vez na inicialização
    if (!isInitialized) {
      setIsInitialized(true);
      updateCryptoURL();
    }
  }, [isInitialized, updateCryptoURL]);

  // Executar apenas quando a rota muda (não constantemente)
  useEffect(() => {
    if (isInitialized && !isUpdating) {
      updateCryptoURL();
    }
  }, [location.pathname, isInitialized, isUpdating, updateCryptoURL]); // Todas as dependências

  // SEMPRE renderizar as páginas, independente do estado de inicialização
  return children;
};

export default DynamicCryptoURL;
