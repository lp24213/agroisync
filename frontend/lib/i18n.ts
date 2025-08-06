import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Detectar idioma do navegador ou localStorage
const detectLanguage = (): string => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('agrotm-language');
    if (saved && ['pt', 'en', 'es', 'zh'].includes(saved)) {
      return saved;
    }
    
    const browserLang = navigator.language.split('-')[0];
    if (['pt', 'en', 'es', 'zh'].includes(browserLang)) {
      return browserLang;
    }
  }
  return 'pt'; // Padrão português
};

// Idiomas suportados
export const supportedLanguages = [
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'zh', name: '中文', flag: '🇨🇳' }
];

// Função para trocar idioma
export const changeLanguage = (language: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('agrotm-language', language);
  }
  i18n.changeLanguage(language);
  
  // Disparar evento customizado
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: language }));
  }
};

// Recursos de tradução
const resources = {
  pt: {
    translation: {
      // Header
      home: 'Início',
      dashboard: 'Dashboard',
      staking: 'Staking',
      about: 'Sobre',
      contact: 'Contato',
      getStarted: 'Começar Agora',
      documentation: 'Documentação',
      
      // Hero
      heroTitle: 'Agricultura Tokenizada do Futuro',
      heroSubtitle: 'Conectando agricultores e investidores através da tecnologia blockchain',
      heroButton: 'Começar Agora',
      heroDocButton: 'Documentação',
      
      // Features
      stakingPremium: 'Staking Premium',
      stakingDesc: 'Stake seus tokens AGROTM e ganhe recompensas',
      advancedSecurity: 'Segurança Avançada',
      securityDesc: 'Proteção de nível bancário para seus ativos',
      agriculturalNFTs: 'NFTs Agrícolas',
      nftDesc: 'Tokenização de propriedades agrícolas reais',
      smartContracts: 'Contratos Inteligentes',
      contractsDesc: 'Automação completa e transparente',
      yieldFarming: 'Yield Farming',
      yieldDesc: 'Maximize seus retornos com estratégias avançadas',
      liquidityPools: 'Pools de Liquidez',
      liquidityDesc: 'Forneça liquidez e ganhe taxas',
      
      // About
      aboutTitle: 'Sobre a AGROTM',
      aboutDesc1: 'Nossa plataforma combina inovação DeFi com sustentabilidade agrícola, oferecendo oportunidades únicas de investimento.',
      aboutDesc2: 'Conectamos agricultores que precisam de capital com investidores que buscam retornos sustentáveis.',
      aboutActiveUsers: 'Usuários Ativos',
      aboutTotalValueLocked: 'Valor Total Bloqueado',
      sustainability: 'Sustentabilidade',
      sustainabilityDesc: 'Agricultura responsável e impacto positivo',
      security: 'Segurança',
      securityDesc: 'Proteção máxima para seus investimentos',
      growth: 'Crescimento',
      growthDesc: 'Oportunidades de expansão contínua',
      impact: 'Impacto',
      impactDesc: 'Mudança real na agricultura global',
      
      // Stats
      statsTitle: 'Números Impressionantes',
      statsSubtitle: 'Nossa plataforma em números',
      tvl: 'Valor Total Bloqueado',
      activeUsersLabel: 'Usuários Ativos',
      averageAPR: 'APR Médio',
      totalTransactions: 'Transações Totais',
      
      // Contact
      contactTitle: 'Entre em Contato',
      contactSubtitle: 'Estamos aqui para ajudar',
      email: 'E-mail',
      phone: 'Telefone',
      chat: 'Chat',
      liveChat: 'Chat ao Vivo',
      instantResponse: 'Resposta Instantânea',
      support247: 'Suporte 24/7',
      businessHours: 'Horário Comercial',
      
      // Footer
      footerDesc: 'Conectando agricultores e investidores através da tecnologia blockchain',
      quickLinks: 'Links Rápidos',
      resources: 'Recursos',
      copyright: '© 2024 AGROTM. Todos os direitos reservados.',
      privacyPolicy: 'Política de Privacidade',
      termsOfService: 'Termos de Serviço',
      
      // Recent Transactions
      recentTransactions: 'Transações Recentes',
      noTransactions: 'Nenhuma transação encontrada',
      stake: 'Stake',
      unstake: 'Unstake',
      claim: 'Claim',
      transfer: 'Transfer',
      confirmed: 'Confirmado',
      pending: 'Pendente',
      failed: 'Falhou',
      
      // Why Choose
      whyChooseAGROTM: 'Por que escolher a AGROTM?',
      whyChooseDesc: 'Nossa plataforma combina inovação DeFi com sustentabilidade agrícola, oferecendo oportunidades únicas de investimento.'
    }
  },
  en: {
    translation: {
      // Header
      home: 'Home',
      dashboard: 'Dashboard',
      staking: 'Staking',
      about: 'About',
      contact: 'Contact',
      getStarted: 'Get Started',
      documentation: 'Documentation',
      
      // Hero
      heroTitle: 'Tokenized Agriculture of the Future',
      heroSubtitle: 'Connecting farmers and investors through blockchain technology',
      heroButton: 'Get Started',
      heroDocButton: 'Documentation',
      
      // Features
      stakingPremium: 'Premium Staking',
      stakingDesc: 'Stake your AGROTM tokens and earn rewards',
      advancedSecurity: 'Advanced Security',
      securityDesc: 'Bank-level protection for your assets',
      agriculturalNFTs: 'Agricultural NFTs',
      nftDesc: 'Tokenization of real agricultural properties',
      smartContracts: 'Smart Contracts',
      contractsDesc: 'Complete and transparent automation',
      yieldFarming: 'Yield Farming',
      yieldDesc: 'Maximize your returns with advanced strategies',
      liquidityPools: 'Liquidity Pools',
      liquidityDesc: 'Provide liquidity and earn fees',
      
      // About
      aboutTitle: 'About AGROTM',
      aboutDesc1: 'Our platform combines DeFi innovation with agricultural sustainability, offering unique investment opportunities.',
      aboutDesc2: 'We connect farmers who need capital with investors seeking sustainable returns.',
      aboutActiveUsers: 'Active Users',
      aboutTotalValueLocked: 'Total Value Locked',
      sustainability: 'Sustainability',
      sustainabilityDesc: 'Responsible agriculture and positive impact',
      security: 'Security',
      securityDesc: 'Maximum protection for your investments',
      growth: 'Growth',
      growthDesc: 'Continuous expansion opportunities',
      impact: 'Impact',
      impactDesc: 'Real change in global agriculture',
      
      // Stats
      statsTitle: 'Impressive Numbers',
      statsSubtitle: 'Our platform in numbers',
      tvl: 'Total Value Locked',
      activeUsersLabel: 'Active Users',
      averageAPR: 'Average APR',
      totalTransactions: 'Total Transactions',
      
      // Contact
      contactTitle: 'Get in Touch',
      contactSubtitle: 'We are here to help',
      email: 'Email',
      phone: 'Phone',
      chat: 'Chat',
      liveChat: 'Live Chat',
      instantResponse: 'Instant Response',
      support247: '24/7 Support',
      businessHours: 'Business Hours',
      
      // Footer
      footerDesc: 'Connecting farmers and investors through blockchain technology',
      quickLinks: 'Quick Links',
      resources: 'Resources',
      copyright: '© 2024 AGROTM. All rights reserved.',
      privacyPolicy: 'Privacy Policy',
      termsOfService: 'Terms of Service',
      
      // Recent Transactions
      recentTransactions: 'Recent Transactions',
      noTransactions: 'No transactions found',
      stake: 'Stake',
      unstake: 'Unstake',
      claim: 'Claim',
      transfer: 'Transfer',
      confirmed: 'Confirmed',
      pending: 'Pending',
      failed: 'Failed',
      
      // Why Choose
      whyChooseAGROTM: 'Why Choose AGROTM?',
      whyChooseDesc: 'Our platform combines DeFi innovation with agricultural sustainability, offering unique investment opportunities.'
    }
  },
  es: {
    translation: {
      // Header
      home: 'Inicio',
      dashboard: 'Panel',
      staking: 'Staking',
      about: 'Acerca de',
      contact: 'Contacto',
      getStarted: 'Comenzar',
      documentation: 'Documentación',
      
      // Hero
      heroTitle: 'Agricultura Tokenizada del Futuro',
      heroSubtitle: 'Conectando agricultores e inversores a través de la tecnología blockchain',
      heroButton: 'Comenzar',
      heroDocButton: 'Documentación',
      
      // Features
      stakingPremium: 'Staking Premium',
      stakingDesc: 'Haz staking de tus tokens AGROTM y gana recompensas',
      advancedSecurity: 'Seguridad Avanzada',
      securityDesc: 'Protección de nivel bancario para tus activos',
      agriculturalNFTs: 'NFTs Agrícolas',
      nftDesc: 'Tokenización de propiedades agrícolas reales',
      smartContracts: 'Contratos Inteligentes',
      contractsDesc: 'Automatización completa y transparente',
      yieldFarming: 'Yield Farming',
      yieldDesc: 'Maximiza tus retornos con estrategias avanzadas',
      liquidityPools: 'Pools de Liquidez',
      liquidityDesc: 'Proporciona liquidez y gana comisiones',
      
      // About
      aboutTitle: 'Acerca de AGROTM',
      aboutDesc1: 'Nuestra plataforma combina innovación DeFi con sostenibilidad agrícola, ofreciendo oportunidades únicas de inversión.',
      aboutDesc2: 'Conectamos agricultores que necesitan capital con inversores que buscan retornos sostenibles.',
      aboutActiveUsers: 'Usuarios Activos',
      aboutTotalValueLocked: 'Valor Total Bloqueado',
      sustainability: 'Sostenibilidad',
      sustainabilityDesc: 'Agricultura responsable e impacto positivo',
      security: 'Seguridad',
      securityDesc: 'Protección máxima para tus inversiones',
      growth: 'Crecimiento',
      growthDesc: 'Oportunidades de expansión continua',
      impact: 'Impacto',
      impactDesc: 'Cambio real en la agricultura global',
      
      // Stats
      statsTitle: 'Números Impresionantes',
      statsSubtitle: 'Nuestra plataforma en números',
      tvl: 'Valor Total Bloqueado',
      activeUsersLabel: 'Usuarios Activos',
      averageAPR: 'APR Promedio',
      totalTransactions: 'Transacciones Totales',
      
      // Contact
      contactTitle: 'Ponte en Contacto',
      contactSubtitle: 'Estamos aquí para ayudar',
      email: 'Correo',
      phone: 'Teléfono',
      chat: 'Chat',
      liveChat: 'Chat en Vivo',
      instantResponse: 'Respuesta Instantánea',
      support247: 'Soporte 24/7',
      businessHours: 'Horario Comercial',
      
      // Footer
      footerDesc: 'Conectando agricultores e inversores a través de la tecnología blockchain',
      quickLinks: 'Enlaces Rápidos',
      resources: 'Recursos',
      copyright: '© 2024 AGROTM. Todos los derechos reservados.',
      privacyPolicy: 'Política de Privacidad',
      termsOfService: 'Términos de Servicio',
      
      // Recent Transactions
      recentTransactions: 'Transacciones Recientes',
      noTransactions: 'No se encontraron transacciones',
      stake: 'Stake',
      unstake: 'Unstake',
      claim: 'Claim',
      transfer: 'Transferir',
      confirmed: 'Confirmado',
      pending: 'Pendiente',
      failed: 'Falló',
      
      // Why Choose
      whyChooseAGROTM: '¿Por qué elegir AGROTM?',
      whyChooseDesc: 'Nuestra plataforma combina innovación DeFi con sostenibilidad agrícola, ofreciendo oportunidades únicas de inversión.'
    }
  },
  zh: {
    translation: {
      // Header
      home: '首页',
      dashboard: '仪表板',
      staking: '质押',
      about: '关于',
      contact: '联系',
      getStarted: '开始使用',
      documentation: '文档',
      
      // Hero
      heroTitle: '未来的代币化农业',
      heroSubtitle: '通过区块链技术连接农民和投资者',
      heroButton: '开始使用',
      heroDocButton: '文档',
      
      // Features
      stakingPremium: '高级质押',
      stakingDesc: '质押您的AGROTM代币并获得奖励',
      advancedSecurity: '高级安全',
      securityDesc: '银行级别的资产保护',
      agriculturalNFTs: '农业NFT',
      nftDesc: '真实农业资产的代币化',
      smartContracts: '智能合约',
      contractsDesc: '完整透明的自动化',
      yieldFarming: '收益农场',
      yieldDesc: '通过高级策略最大化您的收益',
      liquidityPools: '流动性池',
      liquidityDesc: '提供流动性并赚取费用',
      
      // About
      aboutTitle: '关于AGROTM',
      aboutDesc1: '我们的平台将DeFi创新与农业可持续性相结合，提供独特的投资机会。',
      aboutDesc2: '我们连接需要资本的农民和寻求可持续回报的投资者。',
      aboutActiveUsers: '活跃用户',
      aboutTotalValueLocked: '总锁定价值',
      sustainability: '可持续性',
      sustainabilityDesc: '负责任的农业和积极影响',
      security: '安全',
      securityDesc: '为您的投资提供最大保护',
      growth: '增长',
      growthDesc: '持续扩张机会',
      impact: '影响',
      impactDesc: '全球农业的真正变革',
      
      // Stats
      statsTitle: '令人印象深刻的数字',
      statsSubtitle: '我们平台的数字',
      tvl: '总锁定价值',
      activeUsersLabel: '活跃用户',
      averageAPR: '平均年化收益率',
      totalTransactions: '总交易量',
      
      // Contact
      contactTitle: '联系我们',
      contactSubtitle: '我们随时为您服务',
      email: '电子邮件',
      phone: '电话',
      chat: '聊天',
      liveChat: '在线聊天',
      instantResponse: '即时回复',
      support247: '24/7支持',
      businessHours: '营业时间',
      
      // Footer
      footerDesc: '通过区块链技术连接农民和投资者',
      quickLinks: '快速链接',
      resources: '资源',
      copyright: '© 2024 AGROTM. 保留所有权利。',
      privacyPolicy: '隐私政策',
      termsOfService: '服务条款',
      
      // Recent Transactions
      recentTransactions: '最近交易',
      noTransactions: '未找到交易',
      stake: '质押',
      unstake: '解除质押',
      claim: '领取',
      transfer: '转账',
      confirmed: '已确认',
      pending: '待处理',
      failed: '失败',
      
      // Why Choose
      whyChooseAGROTM: '为什么选择AGROTM？',
      whyChooseDesc: '我们的平台将DeFi创新与农业可持续性相结合，提供独特的投资机会。'
    }
  }
};

// Inicializar i18n
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: detectLanguage(),
    fallbackLng: 'pt',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n; 