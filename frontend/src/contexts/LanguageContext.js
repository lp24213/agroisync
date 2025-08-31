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
    processing: 'Processando...'
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
    processing: 'Processing...'
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
    processing: 'Procesando...'
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
    processing: '处理中...'
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
