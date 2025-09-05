import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const translations = {
  pt: {
    // Navegação
    home: 'Início',
    about: 'Sobre',
    contact: 'Contato',
    login: 'Entrar',
    register: 'Cadastrar',
    dashboard: 'Painel',
    products: 'Produtos',
    freights: 'Fretes',
    plans: 'Planos',
    help: 'Ajuda',
    
    // Chatbot
    chatbot: {
      welcome: 'Olá! Sou o AgroSync AI, seu assistente inteligente. Como posso ajudar você hoje?',
      suggestions: {
        registerProduct: 'Quero cadastrar um produto',
        freightInfo: 'Como funciona o sistema de fretes?',
        paymentHelp: 'Preciso de ajuda com pagamentos',
        commodities: 'Quero ver cotações de commodities'
      }
    },
    
    // Cotações
    commodities: 'Commodities',
    live: 'Tempo Real',
    price: 'Preço',
    change: 'Variação',
    
    // Botões
    send: 'Enviar',
    cancel: 'Cancelar',
    save: 'Salvar',
    edit: 'Editar',
    delete: 'Excluir',
    search: 'Buscar',
    filter: 'Filtrar',
    
    // Status
    loading: 'Carregando...',
    error: 'Erro',
    success: 'Sucesso',
    processing: 'Processando...',
    
    // Home
    home: {
      hero: {
        title: 'AgroSync - O Futuro do Agronegócio',
        subtitle: 'Plataforma Completa para o Agronegócio',
        description: 'Conecte-se com produtores, compradores e fornecedores em uma plataforma segura e moderna.',
        cta: {
          primary: 'Começar Agora',
          secondary: 'Saiba Mais'
        }
      },
      features: {
        title: 'Recursos Principais',
        subtitle: 'Tudo que você precisa para o agronegócio',
        marketplace: {
          title: 'Marketplace Inteligente',
          description: 'Compre e venda produtos agrícolas com segurança'
        },
        freight: {
          title: 'Sistema de Fretes',
          description: 'Gerencie logística de forma eficiente'
        },
        crypto: {
          title: 'Pagamentos Crypto',
          description: 'Aceite pagamentos em criptomoedas'
        },
        quotes: {
          title: 'Cotações em Tempo Real',
          description: 'Acompanhe preços de commodities'
        }
      },
      stats: {
        users: 'Usuários Ativos',
        products: 'Produtos Cadastrados',
        freights: 'Fretes Realizados',
        uptime: 'Uptime'
      },
      highlights: {
        marketIntelligence: 'Inteligência de Mercado'
      },
      cta: {
        title: 'Pronto para Transformar seu Agronegócio?',
        subtitle: 'Junte-se a milhares de produtores que já confiam no AgroSync',
        secondary: 'Falar com Especialista'
      }
    },
    
    // Loja/Marketplace
    store: {
      title: 'Marketplace AgroSync',
      subtitle: 'A plataforma mais moderna para comprar e vender produtos agrícolas',
      search: 'Buscar produtos...',
      filters: 'Filtros',
      categories: 'Categorias',
      priceRange: 'Faixa de Preço',
      sortBy: 'Ordenar por',
      relevance: 'Relevância',
      priceLow: 'Menor Preço',
      priceHigh: 'Maior Preço',
      newest: 'Mais Recentes',
      rating: 'Melhor Avaliados',
      addToInterest: 'Demonstrar Interesse',
      removeFromInterest: 'Remover Interesse',
      interestList: 'Lista de Interesses',
      noInterests: 'Nenhum interesse registrado',
      registerInterest: 'Registrar Interesses',
      interestSubmitted: 'Interesse registrado com sucesso!',
      interestRemoved: 'Interesse removido com sucesso!'
    },
    
    // Navegação
    nav: {
      home: 'Início',
      store: 'Loja',
      commodities: 'Commodities',
      agroconecta: 'AgroConecta',
      crypto: 'Cripto',
      help: 'Ajuda',
      contact: 'Contato',
      login: 'Entrar',
      register: 'Cadastrar',
      dashboard: 'Painel',
      logout: 'Sair'
    },
    
    // Comum
    common: {
      view: 'Ver',
      all: 'Todos',
      news: 'Notícias',
      loading: 'Carregando...',
      error: 'Erro',
      success: 'Sucesso',
      cancel: 'Cancelar',
      save: 'Salvar',
      edit: 'Editar',
      delete: 'Excluir',
      search: 'Buscar',
      filter: 'Filtrar',
      send: 'Enviar',
      processing: 'Processando...'
    }
  },
  
  en: {
    home: 'Home',
    about: 'About',
    contact: 'Contact',
    login: 'Login',
    register: 'Register',
    dashboard: 'Dashboard',
    products: 'Products',
    freights: 'Freights',
    plans: 'Plans',
    help: 'Help',
    
    chatbot: {
      welcome: 'Hello! I am AgroSync AI, your intelligent assistant. How can I help you today?',
      suggestions: {
        registerProduct: 'I want to register a product',
        freightInfo: 'How does the freight system work?',
        paymentHelp: 'I need help with payments',
        commodities: 'I want to see commodity quotes'
      }
    },
    
    commodities: 'Commodities',
    live: 'Live',
    price: 'Price',
    change: 'Change',
    
    send: 'Send',
    cancel: 'Cancel',
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    search: 'Search',
    filter: 'Filter',
    
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    processing: 'Processing...',
    
    // Home
    home: {
      hero: {
        title: 'AgroSync - The Future of Agribusiness',
        subtitle: 'Complete Platform for Agribusiness',
        description: 'Connect with producers, buyers and suppliers on a secure and modern platform.',
        cta: {
          primary: 'Get Started',
          secondary: 'Learn More'
        }
      },
      features: {
        title: 'Main Features',
        subtitle: 'Everything you need for agribusiness',
        marketplace: {
          title: 'Smart Marketplace',
          description: 'Buy and sell agricultural products safely'
        },
        freight: {
          title: 'Freight System',
          description: 'Manage logistics efficiently'
        },
        crypto: {
          title: 'Crypto Payments',
          description: 'Accept cryptocurrency payments'
        },
        quotes: {
          title: 'Real-time Quotes',
          description: 'Track commodity prices'
        }
      },
      stats: {
        users: 'Active Users',
        products: 'Registered Products',
        freights: 'Completed Freights',
        uptime: 'Uptime'
      },
      highlights: {
        marketIntelligence: 'Market Intelligence'
      },
      cta: {
        title: 'Ready to Transform Your Agribusiness?',
        subtitle: 'Join thousands of producers who already trust AgroSync',
        secondary: 'Talk to Specialist'
      }
    },
    
    // Store/Marketplace
    store: {
      title: 'AgroSync Marketplace',
      subtitle: 'The most modern platform to buy and sell agricultural products',
      search: 'Search products...',
      filters: 'Filters',
      categories: 'Categories',
      priceRange: 'Price Range',
      sortBy: 'Sort by',
      relevance: 'Relevance',
      priceLow: 'Lowest Price',
      priceHigh: 'Highest Price',
      newest: 'Newest',
      rating: 'Best Rated',
      addToInterest: 'Show Interest',
      removeFromInterest: 'Remove Interest',
      interestList: 'Interest List',
      noInterests: 'No interests registered',
      registerInterest: 'Register Interests',
      interestSubmitted: 'Interest registered successfully!',
      interestRemoved: 'Interest removed successfully!'
    },
    
    // Navigation
    nav: {
      home: 'Home',
      store: 'Store',
      commodities: 'Commodities',
      agroconecta: 'AgroConnect',
      crypto: 'Crypto',
      help: 'Help',
      contact: 'Contact',
      login: 'Login',
      register: 'Register',
      dashboard: 'Dashboard',
      logout: 'Logout'
    },
    
    // Common
    common: {
      view: 'View',
      all: 'All',
      news: 'News',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      cancel: 'Cancel',
      save: 'Save',
      edit: 'Edit',
      delete: 'Delete',
      search: 'Search',
      filter: 'Filter',
      send: 'Send',
      processing: 'Processing...'
    }
  },
  
  es: {
    home: 'Inicio',
    about: 'Acerca de',
    contact: 'Contacto',
    login: 'Iniciar sesión',
    register: 'Registrarse',
    dashboard: 'Panel',
    products: 'Productos',
    freights: 'Fletes',
    plans: 'Planes',
    help: 'Ayuda',
    
    chatbot: {
      welcome: '¡Hola! Soy AgroSync AI, tu asistente inteligente. ¿Cómo puedo ayudarte hoy?',
      suggestions: {
        registerProduct: 'Quiero registrar un producto',
        freightInfo: '¿Cómo funciona el sistema de fletes?',
        paymentHelp: 'Necesito ayuda con pagos',
        commodities: 'Quiero ver cotizaciones de commodities'
      }
    },
    
    commodities: 'Commodities',
    live: 'En Vivo',
    price: 'Precio',
    change: 'Cambio',
    
    send: 'Enviar',
    cancel: 'Cancelar',
    save: 'Guardar',
    edit: 'Editar',
    delete: 'Eliminar',
    search: 'Buscar',
    filter: 'Filtrar',
    
    loading: 'Cargando...',
    error: 'Error',
    success: 'Éxito',
    processing: 'Procesando...',
    
    // Home
    home: {
      hero: {
        title: 'AgroSync - El Futuro del Agronegocio',
        subtitle: 'Plataforma Completa para el Agronegocio',
        description: 'Conéctate con productores, compradores y proveedores en una plataforma segura y moderna.',
        cta: {
          primary: 'Comenzar Ahora',
          secondary: 'Saber Más'
        }
      },
      features: {
        title: 'Características Principales',
        subtitle: 'Todo lo que necesitas para el agronegocio',
        marketplace: {
          title: 'Marketplace Inteligente',
          description: 'Compra y vende productos agrícolas con seguridad'
        },
        freight: {
          title: 'Sistema de Fletes',
          description: 'Gestiona la logística de manera eficiente'
        },
        crypto: {
          title: 'Pagos Crypto',
          description: 'Acepta pagos en criptomonedas'
        },
        quotes: {
          title: 'Cotizaciones en Tiempo Real',
          description: 'Sigue los precios de commodities'
        }
      },
      stats: {
        users: 'Usuarios Activos',
        products: 'Productos Registrados',
        freights: 'Fletes Completados',
        uptime: 'Tiempo Activo'
      },
      highlights: {
        marketIntelligence: 'Inteligencia de Mercado'
      },
      cta: {
        title: '¿Listo para Transformar tu Agronegocio?',
        subtitle: 'Únete a miles de productores que ya confían en AgroSync',
        secondary: 'Hablar con Especialista'
      }
    },
    
    // Store/Marketplace
    store: {
      title: 'Marketplace AgroSync',
      subtitle: 'La plataforma más moderna para comprar y vender productos agrícolas',
      search: 'Buscar productos...',
      filters: 'Filtros',
      categories: 'Categorías',
      priceRange: 'Rango de Precio',
      sortBy: 'Ordenar por',
      relevance: 'Relevancia',
      priceLow: 'Menor Precio',
      priceHigh: 'Mayor Precio',
      newest: 'Más Recientes',
      rating: 'Mejor Valorados',
      addToInterest: 'Mostrar Interés',
      removeFromInterest: 'Remover Interés',
      interestList: 'Lista de Intereses',
      noInterests: 'Ningún interés registrado',
      registerInterest: 'Registrar Intereses',
      interestSubmitted: '¡Interés registrado con éxito!',
      interestRemoved: '¡Interés removido con éxito!'
    },
    
    // Navigation
    nav: {
      home: 'Inicio',
      store: 'Tienda',
      commodities: 'Commodities',
      agroconecta: 'AgroConecta',
      crypto: 'Cripto',
      help: 'Ayuda',
      contact: 'Contacto',
      login: 'Iniciar Sesión',
      register: 'Registrarse',
      dashboard: 'Panel',
      logout: 'Salir'
    },
    
    // Common
    common: {
      view: 'Ver',
      all: 'Todos',
      news: 'Noticias',
      loading: 'Cargando...',
      error: 'Error',
      success: 'Éxito',
      cancel: 'Cancelar',
      save: 'Guardar',
      edit: 'Editar',
      delete: 'Eliminar',
      search: 'Buscar',
      filter: 'Filtrar',
      send: 'Enviar',
      processing: 'Procesando...'
    }
  },
  
  zh: {
    home: '首页',
    about: '关于',
    contact: '联系',
    login: '登录',
    register: '注册',
    dashboard: '仪表板',
    products: '产品',
    freights: '货运',
    plans: '计划',
    help: '帮助',
    
    chatbot: {
      welcome: '你好！我是 AgroSync AI，您的智能助手。今天我能为您做些什么？',
      suggestions: {
        registerProduct: '我想注册一个产品',
        freightInfo: '货运系统是如何工作的？',
        paymentHelp: '我需要支付方面的帮助',
        commodities: '我想看商品报价'
      }
    },
    
    commodities: '商品',
    live: '实时',
    price: '价格',
    change: '变化',
    
    send: '发送',
    cancel: '取消',
    save: '保存',
    edit: '编辑',
    delete: '删除',
    search: '搜索',
    filter: '过滤',
    
    loading: '加载中...',
    error: '错误',
    success: '成功',
    processing: '处理中...',
    
    // Home
    home: {
      hero: {
        title: 'AgroSync - 农业综合企业的未来',
        subtitle: '农业综合企业完整平台',
        description: '在安全现代的平台上与生产者、买家和供应商建立联系。',
        cta: {
          primary: '立即开始',
          secondary: '了解更多'
        }
      },
      features: {
        title: '主要功能',
        subtitle: '农业综合企业所需的一切',
        marketplace: {
          title: '智能市场',
          description: '安全地买卖农产品'
        },
        freight: {
          title: '货运系统',
          description: '高效管理物流'
        },
        crypto: {
          title: '加密货币支付',
          description: '接受加密货币支付'
        },
        quotes: {
          title: '实时报价',
          description: '跟踪商品价格'
        }
      },
      stats: {
        users: '活跃用户',
        products: '注册产品',
        freights: '完成货运',
        uptime: '运行时间'
      },
      highlights: {
        marketIntelligence: '市场情报'
      },
      cta: {
        title: '准备好改变您的农业综合企业了吗？',
        subtitle: '加入数千名已经信任 AgroSync 的生产者',
        secondary: '与专家交谈'
      }
    },
    
    // Store/Marketplace
    store: {
      title: 'AgroSync 市场',
      subtitle: '买卖农产品最现代化的平台',
      search: '搜索产品...',
      filters: '过滤器',
      categories: '类别',
      priceRange: '价格范围',
      sortBy: '排序方式',
      relevance: '相关性',
      priceLow: '最低价格',
      priceHigh: '最高价格',
      newest: '最新',
      rating: '最佳评分',
      addToInterest: '显示兴趣',
      removeFromInterest: '移除兴趣',
      interestList: '兴趣列表',
      noInterests: '未注册任何兴趣',
      registerInterest: '注册兴趣',
      interestSubmitted: '兴趣注册成功！',
      interestRemoved: '兴趣移除成功！'
    },
    
    // Navigation
    nav: {
      home: '首页',
      store: '商店',
      commodities: '商品',
      agroconecta: '农业连接',
      crypto: '加密货币',
      help: '帮助',
      contact: '联系',
      login: '登录',
      register: '注册',
      dashboard: '仪表板',
      logout: '退出'
    },
    
    // Common
    common: {
      view: '查看',
      all: '全部',
      news: '新闻',
      loading: '加载中...',
      error: '错误',
      success: '成功',
      cancel: '取消',
      save: '保存',
      edit: '编辑',
      delete: '删除',
      search: '搜索',
      filter: '过滤',
      send: '发送',
      processing: '处理中...'
    }
  }
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('pt');
  
  useEffect(() => {
    const savedLanguage = localStorage.getItem('agrosync-language');
    if (savedLanguage && translations[savedLanguage]) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);
  
  const changeLanguage = (language) => {
    if (translations[language]) {
      setCurrentLanguage(language);
      localStorage.setItem('agrosync-language', language);
    }
  };
  
  const t = (key) => {
    const keys = key.split('.');
    let value = translations[currentLanguage];
    
    for (const k of keys) {
      if (value && value[k]) {
        value = value[k];
      } else {
        return key; // Retorna a chave se não encontrar tradução
      }
    }
    
    return value;
  };
  
  const value = {
    currentLanguage,
    changeLanguage,
    t,
    translations,
    availableLanguages: Object.keys(translations)
  };
  
  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;
