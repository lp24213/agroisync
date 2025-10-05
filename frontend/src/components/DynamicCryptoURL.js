import { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const DynamicCryptoURL = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Gera valores de parâmetros criptografados (querystring)
  const generateParams = useCallback(() => {
    const ts = Date.now().toString();
    const rand = Math.random().toString(36).substring(2, 10);
    // IDs persistentes para estabilidade
    const storedUsr = localStorage.getItem('agro_usr') || `${ts}${rand}`;
    const storedSess = sessionStorage.getItem('agro_sess') || `${ts.substring(ts.length - 6)}${rand}`;
    localStorage.setItem('agro_usr', storedUsr);
    sessionStorage.setItem('agro_sess', storedSess);

    return {
      zx: ts, // timestamp atual
      no_sw_cr: rand, // token aleatório simples
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

      const shouldExclude = excludeCrypto.some(route => {
        return location.pathname === route || (route !== '/' && location.pathname.startsWith(route + '/'));
      });

      // Para todas as demais rotas, exigir hash criptográfico
      if (shouldExclude) {
        setIsInitialized(true);
        return;
      }

      // Verificar se já tem parametros válidos
      if (hasValidParams(location.search)) {
        setIsInitialized(true);
        return;
      }

      // Aplicar criptografia para todas as rotas (exceto excluídas)
      if (!isUpdating) {
        setIsUpdating(true);

        const ensured = generateParams();
        const newSearch = mergeParams(location.search, ensured);
        const newUrl = `${location.pathname}${newSearch}`;

        // Navegar para a URL com query params criptografados
        navigate(newUrl, { replace: true });

        // Reset flag após navegação
        setTimeout(() => setIsUpdating(false), 100);
      }
    } catch (error) {
      setIsUpdating(false);
      if (process.env.NODE_ENV !== 'production') {
        // Erro ao gerar URL criptografada
      }
    }
  }, [location.pathname, location.search, navigate, generateParams, hasValidParams, mergeParams, isUpdating]);

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
