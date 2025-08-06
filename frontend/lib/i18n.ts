import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Supported languages
export const supportedLanguages = [
  { code: 'pt', name: 'Português', flag: '🇧🇷', nativeName: 'Português Brasil' },
  { code: 'en', name: 'English', flag: '🇬🇧', nativeName: 'English' },
  { code: 'es', name: 'Español', flag: '🇪🇸', nativeName: 'Español' }
];

// Language detection
export const detectLanguage = () => {
  if (typeof window !== 'undefined') {
    const savedLang = localStorage.getItem('preferred-language');
    if (savedLang && supportedLanguages.find(lang => lang.code === savedLang)) {
      return savedLang;
    }
    const browserLang = navigator.language.split('-')[0];
    const supported = supportedLanguages.find(lang => lang.code === browserLang);
    return supported ? browserLang : 'pt';
  }
  return 'pt';
};

// Initialize i18n
i18n
  .use(initReactI18next)
  .init({
    resources: {
      pt: {
        translation: {
          // Navigation
          home: "Início",
          about: "Sobre",
          contact: "Contato",
          dashboard: "Dashboard",
          staking: "Staking",
          documentation: "Documentação",
          getStarted: "Começar",
          
          // Hero Section
          welcome: "Bem-vindo ao AGROTM",
          heroTitle: "Revolucione a Agricultura com Tecnologia Blockchain",
          heroSubtitle: "AGROTM oferece soluções DeFi inovadoras para o agronegócio global",
          startNow: "Começar Agora",
          
          // Features Section
          whyChooseAGROTM: "Por que escolher a AGROTM?",
          platformDescription: "Nossa plataforma combina inovação DeFi com sustentabilidade agrícola, oferecendo oportunidades únicas de investimento.",
          sustainableAgriculture: "Agricultura Sustentável",
          sustainableAgricultureDesc: "Tecnologia blockchain para rastreamento completo da cadeia agrícola, garantindo transparência e sustentabilidade.",
          defiStaking: "DeFi & Staking",
          defiStakingDesc: "Stake seus tokens AGROTM e ganhe recompensas enquanto apoia projetos agrícolas sustentáveis.",
          agriculturalNFTs: "NFTs Agrícolas",
          agriculturalNFTsDesc: "Tokenize propriedades rurais e ativos agrícolas como NFTs únicos e valiosos.",
          advancedAnalytics: "Analytics Avançados",
          advancedAnalyticsDesc: "Dashboard completo com métricas em tempo real sobre performance agrícola e retornos DeFi.",
          integratedWallet: "Wallet Integrado",
          integratedWalletDesc: "Carteira digital segura integrada para gerenciar seus ativos AGROTM e NFTs.",
          daoGovernance: "Governança DAO",
          daoGovernanceDesc: "Participe das decisões da plataforma através de votação descentralizada com tokens AGROTM.",
          
          // About Section
          aboutTitle: "Sobre o AGROTM",
          aboutDescription: "Estamos revolucionando o setor agrícola através da tecnologia blockchain e soluções DeFi",
          mission: "Nossa Missão",
          vision: "Nossa Visão",
          values: "Nossos Valores",
          activeUsers: "Usuários Ativos",
          totalValueLocked: "Total Value Locked",
          sustainability: "Sustentabilidade",
          sustainabilityDesc: "Apoiamos projetos agrícolas que promovem práticas sustentáveis",
          security: "Segurança",
          securityDesc: "Todas as transações são seguras e transparentes na blockchain",
          growth: "Crescimento",
          growthDesc: "Oportunidades de retorno atrativas para investidores",
          impact: "Impacto",
          impactDesc: "Contribuímos para um futuro mais sustentável e justo",
          
          // Stats Section
          impressiveNumbers: "Números Impressionantes",
          ourPlatformInNumbers: "Nossa plataforma em números",
          averageAPR: "APR Médio",
          totalTransactions: "Transações Totais",
          
          // Contact Section
          contactTitle: "Entre em Contato",
          contactSubtitle: "Pronto para revolucionar seu negócio agrícola?",
          email: "E-mail",
          phone: "Telefone",
          address: "Endereço",
          sendMessage: "Enviar Mensagem",
          
          // Footer
          quickLinks: "Links Rápidos",
          resources: "Recursos",
          support: "Suporte",
          privacyPolicy: "Política de Privacidade",
          termsOfService: "Termos de Serviço",
          cookiePolicy: "Política de Cookies",
          allRightsReserved: "Todos os direitos reservados",
          
          // Transaction Types
          stake: "Stake",
          unstake: "Unstake",
          claim: "Claim",
          transfer: "Transfer",
          
          // Transaction Status
          confirmed: "Confirmado",
          pending: "Pendente",
          failed: "Falhou",
          
          // Dashboard
          recentTransactions: "Transações Recentes",
          noTransactionsFound: "Nenhuma transação encontrada",
          
          // Common
          loading: "Carregando...",
          error: "Erro",
          success: "Sucesso",
          cancel: "Cancelar",
          save: "Salvar",
          delete: "Excluir",
          edit: "Editar",
          view: "Visualizar",
          close: "Fechar",
          back: "Voltar",
          next: "Próximo",
          previous: "Anterior",
          submit: "Enviar",
          reset: "Resetar",
          search: "Pesquisar",
          filter: "Filtrar",
          sort: "Ordenar",
          refresh: "Atualizar",
          download: "Baixar",
          upload: "Enviar",
          share: "Compartilhar",
          copy: "Copiar",
          paste: "Colar",
          cut: "Recortar",
          undo: "Desfazer",
          redo: "Refazer"
        }
      },
      en: {
        translation: {
          // Navigation
          home: "Home",
          about: "About",
          contact: "Contact",
          dashboard: "Dashboard",
          staking: "Staking",
          documentation: "Documentation",
          getStarted: "Get Started",
          
          // Hero Section
          welcome: "Welcome to AGROTM",
          heroTitle: "Revolutionize Agriculture with Blockchain Technology",
          heroSubtitle: "AGROTM offers innovative DeFi solutions for global agribusiness",
          startNow: "Start Now",
          
          // Features Section
          whyChooseAGROTM: "Why choose AGROTM?",
          platformDescription: "Our platform combines DeFi innovation with agricultural sustainability, offering unique investment opportunities.",
          sustainableAgriculture: "Sustainable Agriculture",
          sustainableAgricultureDesc: "Blockchain technology for complete agricultural chain tracking, ensuring transparency and sustainability.",
          defiStaking: "DeFi & Staking",
          defiStakingDesc: "Stake your AGROTM tokens and earn rewards while supporting sustainable agricultural projects.",
          agriculturalNFTs: "Agricultural NFTs",
          agriculturalNFTsDesc: "Tokenize rural properties and agricultural assets as unique and valuable NFTs.",
          advancedAnalytics: "Advanced Analytics",
          advancedAnalyticsDesc: "Complete dashboard with real-time metrics on agricultural performance and DeFi returns.",
          integratedWallet: "Integrated Wallet",
          integratedWalletDesc: "Secure integrated digital wallet to manage your AGROTM assets and NFTs.",
          daoGovernance: "DAO Governance",
          daoGovernanceDesc: "Participate in platform decisions through decentralized voting with AGROTM tokens.",
          
          // About Section
          aboutTitle: "About AGROTM",
          aboutDescription: "We are revolutionizing the agricultural sector through blockchain technology and DeFi solutions",
          mission: "Our Mission",
          vision: "Our Vision",
          values: "Our Values",
          activeUsers: "Active Users",
          totalValueLocked: "Total Value Locked",
          sustainability: "Sustainability",
          sustainabilityDesc: "We support agricultural projects that promote sustainable practices",
          security: "Security",
          securityDesc: "All transactions are secure and transparent on the blockchain",
          growth: "Growth",
          growthDesc: "Attractive return opportunities for investors",
          impact: "Impact",
          impactDesc: "We contribute to a more sustainable and fair future",
          
          // Stats Section
          impressiveNumbers: "Impressive Numbers",
          ourPlatformInNumbers: "Our platform in numbers",
          averageAPR: "Average APR",
          totalTransactions: "Total Transactions",
          
          // Contact Section
          contactTitle: "Get in Touch",
          contactSubtitle: "Ready to revolutionize your agricultural business?",
          email: "Email",
          phone: "Phone",
          address: "Address",
          sendMessage: "Send Message",
          
          // Footer
          quickLinks: "Quick Links",
          resources: "Resources",
          support: "Support",
          privacyPolicy: "Privacy Policy",
          termsOfService: "Terms of Service",
          cookiePolicy: "Cookie Policy",
          allRightsReserved: "All rights reserved",
          
          // Transaction Types
          stake: "Stake",
          unstake: "Unstake",
          claim: "Claim",
          transfer: "Transfer",
          
          // Transaction Status
          confirmed: "Confirmed",
          pending: "Pending",
          failed: "Failed",
          
          // Dashboard
          recentTransactions: "Recent Transactions",
          noTransactionsFound: "No transactions found",
          
          // Common
          loading: "Loading...",
          error: "Error",
          success: "Success",
          cancel: "Cancel",
          save: "Save",
          delete: "Delete",
          edit: "Edit",
          view: "View",
          close: "Close",
          back: "Back",
          next: "Next",
          previous: "Previous",
          submit: "Submit",
          reset: "Reset",
          search: "Search",
          filter: "Filter",
          sort: "Sort",
          refresh: "Refresh",
          download: "Download",
          upload: "Upload",
          share: "Share",
          copy: "Copy",
          paste: "Paste",
          cut: "Cut",
          undo: "Undo",
          redo: "Redo"
        }
      },
      es: {
        translation: {
          // Navigation
          home: "Inicio",
          about: "Acerca de",
          contact: "Contacto",
          dashboard: "Dashboard",
          staking: "Staking",
          documentation: "Documentación",
          getStarted: "Comenzar",
          
          // Hero Section
          welcome: "Bienvenido a AGROTM",
          heroTitle: "Revoluciona la Agricultura con Tecnología Blockchain",
          heroSubtitle: "AGROTM ofrece soluciones DeFi innovadoras para el agronegocio global",
          startNow: "Comenzar Ahora",
          
          // Features Section
          whyChooseAGROTM: "¿Por qué elegir AGROTM?",
          platformDescription: "Nuestra plataforma combina innovación DeFi con sostenibilidad agrícola, ofreciendo oportunidades únicas de inversión.",
          sustainableAgriculture: "Agricultura Sostenible",
          sustainableAgricultureDesc: "Tecnología blockchain para el seguimiento completo de la cadena agrícola, garantizando transparencia y sostenibilidad.",
          defiStaking: "DeFi & Staking",
          defiStakingDesc: "Haz staking de tus tokens AGROTM y gana recompensas mientras apoyas proyectos agrícolas sostenibles.",
          agriculturalNFTs: "NFTs Agrícolas",
          agriculturalNFTsDesc: "Tokeniza propiedades rurales y activos agrícolas como NFTs únicos y valiosos.",
          advancedAnalytics: "Analytics Avanzados",
          advancedAnalyticsDesc: "Dashboard completo con métricas en tiempo real sobre rendimiento agrícola y retornos DeFi.",
          integratedWallet: "Wallet Integrado",
          integratedWalletDesc: "Billetera digital segura integrada para gestionar tus activos AGROTM y NFTs.",
          daoGovernance: "Gobernanza DAO",
          daoGovernanceDesc: "Participa en las decisiones de la plataforma a través de votación descentralizada con tokens AGROTM.",
          
          // About Section
          aboutTitle: "Acerca de AGROTM",
          aboutDescription: "Estamos revolucionando el sector agrícola a través de la tecnología blockchain y soluciones DeFi",
          mission: "Nuestra Misión",
          vision: "Nuestra Visión",
          values: "Nuestros Valores",
          activeUsers: "Usuarios Activos",
          totalValueLocked: "Total Value Locked",
          sustainability: "Sostenibilidad",
          sustainabilityDesc: "Apoyamos proyectos agrícolas que promueven prácticas sostenibles",
          security: "Seguridad",
          securityDesc: "Todas las transacciones son seguras y transparentes en la blockchain",
          growth: "Crecimiento",
          growthDesc: "Oportunidades de retorno atractivas para inversores",
          impact: "Impacto",
          impactDesc: "Contribuimos a un futuro más sostenible y justo",
          
          // Stats Section
          impressiveNumbers: "Números Impresionantes",
          ourPlatformInNumbers: "Nuestra plataforma en números",
          averageAPR: "APR Promedio",
          totalTransactions: "Transacciones Totales",
          
          // Contact Section
          contactTitle: "Ponte en Contacto",
          contactSubtitle: "¿Listo para revolucionar tu negocio agrícola?",
          email: "Correo",
          phone: "Teléfono",
          address: "Dirección",
          sendMessage: "Enviar Mensaje",
          
          // Footer
          quickLinks: "Enlaces Rápidos",
          resources: "Recursos",
          support: "Soporte",
          privacyPolicy: "Política de Privacidad",
          termsOfService: "Términos de Servicio",
          cookiePolicy: "Política de Cookies",
          allRightsReserved: "Todos los derechos reservados",
          
          // Transaction Types
          stake: "Stake",
          unstake: "Unstake",
          claim: "Claim",
          transfer: "Transfer",
          
          // Transaction Status
          confirmed: "Confirmado",
          pending: "Pendiente",
          failed: "Falló",
          
          // Dashboard
          recentTransactions: "Transacciones Recientes",
          noTransactionsFound: "No se encontraron transacciones",
          
          // Common
          loading: "Cargando...",
          error: "Error",
          success: "Éxito",
          cancel: "Cancelar",
          save: "Guardar",
          delete: "Eliminar",
          edit: "Editar",
          view: "Ver",
          close: "Cerrar",
          back: "Atrás",
          next: "Siguiente",
          previous: "Anterior",
          submit: "Enviar",
          reset: "Restablecer",
          search: "Buscar",
          filter: "Filtrar",
          sort: "Ordenar",
          refresh: "Actualizar",
          download: "Descargar",
          upload: "Subir",
          share: "Compartir",
          copy: "Copiar",
          paste: "Pegar",
          cut: "Cortar",
          undo: "Deshacer",
          redo: "Rehacer"
        }
      }
    },
    lng: detectLanguage(),
    fallbackLng: 'pt',
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false
    }
  });

export default i18n;

// Change language
export const changeLanguage = (lang: string) => {
  i18n.changeLanguage(lang);
  if (typeof window !== 'undefined') {
    localStorage.setItem('preferred-language', lang);
    // Trigger a custom event to notify components about language change
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
  }
};

// Get navigation links for language switcher
export const getLanguageLinks = (currentPath: string) => {
  return supportedLanguages.map(lang => ({
    code: lang.code,
    name: lang.name,
    flag: lang.flag,
    nativeName: lang.nativeName,
    href: `/${lang}`,
  }));
}; 