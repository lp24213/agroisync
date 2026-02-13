import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const CryptoURLManager = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Gera parâmetros criptográficos estáveis
  const generateParams = () => {
    let storedUsr = localStorage.getItem('agro_usr');
    let storedSess = sessionStorage.getItem('agro_sess');
    let storedZx = localStorage.getItem('agro_zx');
    let storedCr = localStorage.getItem('agro_cr');
    
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
      zx: storedZx,
      no_sw_cr: storedCr,
      usr: storedUsr,
      sess: storedSess
    };
  };

  // Verifica se tem parâmetros válidos
  const hasValidParams = (search) => {
    const sp = new URLSearchParams(search || '');
    const zx = sp.get('zx');
    const no_sw_cr = sp.get('no_sw_cr');
    const usr = sp.get('usr');
    const sess = sp.get('sess');
    return !!(zx && no_sw_cr && usr && sess);
  };

  useEffect(() => {
    // Rotas excluídas da criptografia
    const excludeCrypto = [
      '/payment/success',
      '/payment/cancel',
      '/unauthorized'
    ];

    const shouldExclude = excludeCrypto.some(route => 
      location.pathname === route || location.pathname.startsWith(route + '/')
    );

    // Se não deve ser excluído e não tem parâmetros válidos, adicionar
    if (!shouldExclude && !hasValidParams(location.search)) {
      const params = generateParams();
      const sp = new URLSearchParams(location.search);
      
      Object.entries(params).forEach(([key, value]) => {
        if (!sp.get(key)) {
          sp.set(key, value);
        }
      });

      const newSearch = `?${sp.toString()}`;
      const newUrl = `${location.pathname}${newSearch}`;
      console.log(`[CryptoURLManager] Redirecionando para adicionar parâmetros: ${newUrl}`);
      // Navegar sem replace para não interferir no histórico
      navigate(newUrl, { replace: true });
    }
  }, [location.pathname, location.search, navigate]);

  return null; // Componente invisível
};

export default CryptoURLManager;
