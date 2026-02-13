/**
 * PLANOS AGROISYNC - PLATAFORMA INTERMEDIADORA
 * 
 * IMPORTANTE: Agroisync NÃO se responsabiliza por:
 * - Transporte/entrega (responsabilidade do vendedor/freteiro)
 * - Fraudes (temos sistema de verificação e avaliações)
 * - Qualidade do produto (vendedor é responsável)
 * 
 * Agroisync FORNECE:
 * - Plataforma de conexão
 * - Sistema de pagamento seguro (opcional)
 * - Sistema de avaliações
 * - Alertas e insights
 * - Suporte técnico
 */

export const PLANOS_INTERMEDIADOR = {
  
  // ============================================
  // COMPRADOR (Quem compra produtos)
  // ============================================
  
  comprador: {
    gratuito: {
      nome: 'Comprador Gratuito',
      preco: 0,
      periodo: 'mensal',
      icone: '🆓',
      cor: '#10b981',
      
      limites: {
        comprasPorMes: 10,
        alertasPreco: 3,
        favoritos: 50,
        buscasSalvas: 3
      },
      
      recursos: [
        '✅ Buscar e visualizar todos os produtos',
        '✅ Contato direto com vendedores',
        '✅ Até 10 compras por mês',
        '✅ 3 alertas de preço',
        '✅ 50 favoritos',
        '✅ Avaliações e reviews',
        '✅ Cotações em tempo real',
        '✅ Suporte por email',
        '⚠️ Sem insights de mercado',
        '⚠️ Sem recomendações personalizadas'
      ],
      
      comissao: '5%', // Por transação realizada
      
      badge: 'Comprador Básico',
      destaque: false
    },
    
    premium: {
      nome: 'Comprador Pro',
      preco: 49,
      periodo: 'mensal',
      icone: '⭐',
      cor: '#3b82f6',
      
      limites: {
        comprasPorMes: 'ilimitado',
        alertasPreco: 20,
        favoritos: 'ilimitado',
        buscasSalvas: 20
      },
      
      recursos: [
        '✅ Tudo do plano Gratuito',
        '✅ Compras ilimitadas',
        '✅ 20 alertas de preço inteligentes',
        '✅ Favoritos ilimitados',
        '✅ Análises de mercado e insights',
        '✅ Recomendações personalizadas por IA',
        '✅ Histórico de preços (até 1 ano)',
        '✅ Previsão de demanda',
        '✅ Comparador de preços regional',
        '✅ Dashboard executivo',
        '✅ Suporte prioritário (WhatsApp)',
        '✅ 2% cashback em AgroToken (AGT)',
        '💰 Comissão reduzida: 3%'
      ],
      
      comissao: '3%',
      
      badge: 'Comprador Pro',
      destaque: true,
      economia: 'Economize até R$ 5.000/ano com insights!'
    },
    
    enterprise: {
      nome: 'Comprador Enterprise',
      preco: 299,
      periodo: 'mensal',
      icone: '🏢',
      cor: '#8b5cf6',
      
      limites: {
        comprasPorMes: 'ilimitado',
        alertasPreco: 'ilimitado',
        favoritos: 'ilimitado',
        buscasSalvas: 'ilimitado',
        usuarios: 10 // Múltiplos usuários na conta
      },
      
      recursos: [
        '✅ Tudo do plano Pro',
        '✅ API dedicada para integração ERP',
        '✅ Até 10 usuários na mesma conta',
        '✅ Gerente de conta dedicado',
        '✅ Relatórios personalizados',
        '✅ Integração com sistemas próprios',
        '✅ Webhooks para automação',
        '✅ SLA de 99,9% de uptime',
        '✅ Treinamento da equipe',
        '✅ Suporte 24/7',
        '✅ 5% cashback em AgroToken (AGT)',
        '💰 Comissão reduzida: 2%',
        '🎁 Consultoria agronômica inclusa'
      ],
      
      comissao: '2%',
      
      badge: 'Enterprise',
      destaque: false,
      contato: true // Precisa entrar em contato
    }
  },

  // ============================================
  // VENDEDOR / ANUNCIANTE (Quem vende produtos)
  // ============================================
  
  anunciante: {
    gratuito: {
      nome: 'Vendedor Gratuito',
      preco: 0,
      periodo: 'mensal',
      icone: '🆓',
      cor: '#10b981',
      
      limites: {
        produtosAtivos: 5,
        fotosPorProduto: 3,
        renovacaoAnuncio: 30, // dias
        destaque: 0
      },
      
      recursos: [
        '✅ Até 5 produtos ativos',
        '✅ 3 fotos por produto',
        '✅ Anúncios válidos por 30 dias',
        '✅ Contato direto com compradores',
        '✅ Sistema de avaliações',
        '✅ Dashboard básico de vendas',
        '✅ Suporte por email',
        '⚠️ Sem destaque nos resultados',
        '⚠️ Sem analytics avançado',
        '💰 Comissão: 5% por venda'
      ],
      
      comissao: '5%',
      
      badge: 'Vendedor Básico',
      destaque: false,
      observacoes: [
        '⚠️ Vendedor é responsável pelo transporte',
        '⚠️ Agroisync não se responsabiliza por entrega',
        '✅ Sistema de avaliações protege sua reputação'
      ]
    },
    
    profissional: {
      nome: 'Vendedor Profissional',
      preco: 99,
      periodo: 'mensal',
      icone: '💼',
      cor: '#3b82f6',
      
      limites: {
        produtosAtivos: 50,
        fotosPorProduto: 10,
        renovacaoAnuncio: 60,
        destaque: 5 // Produtos em destaque
      },
      
      recursos: [
        '✅ Até 50 produtos ativos',
        '✅ 10 fotos por produto',
        '✅ Anúncios válidos por 60 dias',
        '✅ 5 produtos em DESTAQUE',
        '✅ Selo "Vendedor Profissional"',
        '✅ Analytics avançado de vendas',
        '✅ Precificação sugerida por IA',
        '✅ Dashboard completo',
        '✅ Notificações de interesse',
        '✅ Suporte prioritário',
        '✅ Aparece primeiro nos resultados',
        '💰 Comissão reduzida: 3%'
      ],
      
      comissao: '3%',
      
      badge: 'Vendedor Profissional',
      selo: '✓ Profissional',
      destaque: true,
      economia: 'Venda até 3x mais com destaque!'
    },
    
    loja: {
      nome: 'Loja Virtual',
      preco: 249,
      periodo: 'mensal',
      icone: '🏪',
      cor: '#8b5cf6',
      
      limites: {
        produtosAtivos: 'ilimitado',
        fotosPorProduto: 'ilimitado',
        renovacaoAnuncio: 'ilimitado',
        destaque: 20,
        videoProduto: true
      },
      
      recursos: [
        '✅ Produtos ilimitados',
        '✅ Fotos e vídeos ilimitados',
        '✅ Página de loja personalizada',
        '✅ 20 produtos em DESTAQUE',
        '✅ Selo "Loja Oficial"',
        '✅ URL personalizada (agroisync.com/loja/sua-fazenda)',
        '✅ Banner na página inicial (rotativo)',
        '✅ Analytics completo + BI',
        '✅ API para integração',
        '✅ Gestão de estoque automatizada',
        '✅ Múltiplos usuários (até 5)',
        '✅ Marketing integrado',
        '✅ Suporte 24/7',
        '✅ 3% cashback em AGT',
        '💰 Comissão reduzida: 2%'
      ],
      
      comissao: '2%',
      
      badge: 'Loja Oficial',
      selo: '✓ Loja Verificada',
      destaque: false,
      urlPersonalizada: true
    }
  },

  // ============================================
  // FRETEIRO (Quem oferece transporte)
  // ============================================
  
  freteiro: {
    gratuito: {
      nome: 'Freteiro Básico',
      preco: 0,
      periodo: 'mensal',
      icone: '🚛',
      cor: '#10b981',
      
      limites: {
        fretesAtivos: 10,
        rotasOtimizadas: 0
      },
      
      recursos: [
        '✅ Até 10 fretes ativos',
        '✅ Cadastro de veículos',
        '✅ Contato direto com vendedores',
        '✅ Sistema de avaliações',
        '✅ Rastreamento GPS básico',
        '✅ Dashboard de rotas',
        '⚠️ Sem otimização de rotas por IA',
        '⚠️ Sem matching automático',
        '💰 Comissão: 5% por frete'
      ],
      
      comissao: '5%',
      
      badge: 'Freteiro Básico',
      destaque: false,
      observacoes: [
        '⚠️ Freteiro é responsável pelo transporte',
        '⚠️ Agroisync não se responsabiliza por danos',
        '✅ Sistema de avaliações protege sua reputação'
      ]
    },
    
    profissional: {
      nome: 'Freteiro Pro',
      preco: 79,
      periodo: 'mensal',
      icone: '🚚',
      cor: '#3b82f6',
      
      limites: {
        fretesAtivos: 'ilimitado',
        rotasOtimizadas: 'ilimitado'
      },
      
      recursos: [
        '✅ Fretes ilimitados',
        '✅ Otimização de rotas por IA',
        '✅ Matching automático de cargas',
        '✅ Prioridade em oportunidades',
        '✅ Rastreamento GPS avançado',
        '✅ Gestão de múltiplos veículos',
        '✅ Analytics de rotas e rentabilidade',
        '✅ Notificações de cargas disponíveis',
        '✅ Suporte prioritário',
        '💰 Comissão reduzida: 3%'
      ],
      
      comissao: '3%',
      
      badge: 'Freteiro Profissional',
      destaque: true,
      economia: 'Ganhe até 40% mais com rotas otimizadas!'
    }
  }
};

/**
 * COMISSÕES DA PLATAFORMA
 * 
 * Como funciona:
 * 1. Comprador e Vendedor negociam diretamente
 * 2. Vendedor define o preço final (incluindo ou não o frete)
 * 3. Quando houver transação na plataforma, Agroisync cobra comissão
 * 4. Comissão é cobrada APENAS se a venda for concluída via plataforma
 * 5. Vendedor pode negociar fora da plataforma (sem comissão, mas sem proteção)
 */

export const MODELO_COMISSOES = {
  descricao: 'Comissão cobrada apenas em vendas concluídas via Agroisync',
  
  valores: {
    gratuito: '5%',
    profissional: '3%',
    loja: '2%',
    enterprise: '2%'
  },
  
  calculo: {
    exemplo: 'Venda de R$ 10.000 no plano Profissional',
    valorVenda: 10000,
    comissao: 300, // 3%
    vendedorRecebe: 9700,
    observacao: 'Frete NÃO entra na comissão (é responsabilidade do vendedor)'
  },
  
  isencoes: [
    'Contato inicial (grátis)',
    'Negociação (grátis)',
    'Consulta de preços (grátis)',
    'Frete (não cobramos, vendedor escolhe como entregar)'
  ],
  
  garantias: [
    '✅ Sistema de pagamento seguro (opcional)',
    '✅ Sistema de avaliações (obrigatório)',
    '✅ Suporte a disputas',
    '✅ Selo de vendedor verificado',
    '⚠️ Transporte é responsabilidade do vendedor/freteiro',
    '⚠️ Qualidade do produto é responsabilidade do vendedor'
  ]
};

/**
 * SERVIÇOS ADICIONAIS (Pagos separadamente)
 */
export const SERVICOS_ADICIONAIS = {
  destaquePremium: {
    nome: 'Destaque Premium',
    descricao: 'Produto aparece no topo por 7 dias',
    preco: 29.90,
    periodo: '7 dias',
    beneficios: [
      'Aparece no topo dos resultados',
      'Badge "DESTAQUE" dourado',
      'Até 10x mais visualizações'
    ]
  },
  
  bannerHome: {
    nome: 'Banner na Home',
    descricao: 'Banner rotativo na página inicial',
    preco: 199,
    periodo: '30 dias',
    beneficios: [
      'Banner de 1920x400px na home',
      'Até 100.000 visualizações/mês',
      'Link direto para sua loja'
    ]
  },
  
  consultoriaIA: {
    nome: 'Consultoria IA',
    descricao: 'Análise de precificação e mercado',
    preco: 149,
    periodo: 'por relatório',
    beneficios: [
      'Relatório completo de mercado',
      'Precificação sugerida por IA',
      'Análise de concorrência',
      'Melhor época para vender'
    ]
  },
  
  seoBoost: {
    nome: 'SEO Boost',
    descricao: 'Otimização de anúncios para Google',
    preco: 99,
    periodo: 'mensal',
    beneficios: [
      'Anúncios otimizados para busca',
      'Aparecer no Google Shopping',
      'Mais tráfego orgânico'
    ]
  }
};

/**
 * TERMOS DE USO (Resumo)
 */
export const TERMOS_RESPONSABILIDADE = {
  plataforma: {
    responsabilidades: [
      'Fornecer plataforma de conexão',
      'Manter sistema de pagamento seguro (opcional)',
      'Moderar avaliações e denúncias',
      'Fornecer suporte técnico',
      'Garantir uptime de 99%'
    ],
    
    naoResponsavel: [
      '❌ Transporte ou entrega dos produtos',
      '❌ Qualidade, autenticidade ou estado dos produtos',
      '❌ Ações de vendedores ou compradores fora da plataforma',
      '❌ Atrasos de entrega (responsabilidade do vendedor/freteiro)',
      '❌ Fraudes (temos sistema de prevenção, mas não garantimos)',
      '❌ Danos em transporte'
    ]
  },
  
  vendedor: {
    responsabilidades: [
      'Garantir qualidade e autenticidade do produto',
      'Entregar produto conforme anunciado',
      'Organizar e pagar o transporte (ou usar freteiro da plataforma)',
      'Responder por fraudes ou má-fé',
      'Cumprir prazos acordados'
    ]
  },
  
  comprador: {
    responsabilidades: [
      'Conferir produto ao receber',
      'Pagar pelo produto conforme acordado',
      'Avaliar vendedor após recebimento',
      'Reportar problemas em até 48h'
    ]
  },
  
  freteiro: {
    responsabilidades: [
      'Transportar carga com segurança',
      'Responder por danos durante transporte',
      'Fornecer rastreamento GPS',
      'Cumprir prazos acordados',
      'Ter seguro de carga (recomendado)'
    ]
  },
  
  sistemaProtecao: [
    '✅ Sistema de avaliações (5 estrelas)',
    '✅ Histórico de transações visível',
    '✅ Verificação de CPF/CNPJ',
    '✅ Pagamento em garantia (escrow) - opcional',
    '✅ Suporte a disputas',
    '✅ Banimento de usuários fraudulentos',
    '⚠️ Vendedor/Comprador negociam diretamente',
    '⚠️ Transporte é externo à plataforma'
  ]
};

export default PLANOS_INTERMEDIADOR;

