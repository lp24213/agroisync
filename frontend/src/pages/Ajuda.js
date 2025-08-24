import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { 
  BookOpen, Video, FileText, MessageCircle, 
  Phone, Mail, Clock, Users, Shield, Zap,
  Truck, Coins, ShoppingCart, Settings,
  HelpCircle, Star, Award, Bookmark, Ticket,
  UserPlus, Store, Database, Lock, Wallet
} from 'lucide-react';

const Ajuda = () => {
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('primeiros-passos');

  const helpSections = [
    {
      id: 'primeiros-passos',
      title: 'Primeiros Passos',
      icon: <UserPlus className="w-6 h-6" />,
      description: 'Guia completo para começar a usar a plataforma Agroisync',
      items: [
        {
          title: 'Criar Conta',
          description: 'Crie sua conta pessoal ou empresarial na plataforma',
          duration: '3 min',
          type: 'video',
          link: '#',
          steps: [
            'Acesse a página de cadastro',
            'Escolha entre conta pessoal ou empresarial',
            'Preencha seus dados básicos',
            'Verifique seu email para ativação'
          ]
        },
        {
          title: 'Completar Cadastro',
          description: 'Configure seu perfil completo com dados pessoais, empresa, produtos e fretes',
          duration: '8 min',
          type: 'video',
          link: '#',
          steps: [
            'Adicione informações pessoais completas',
            'Configure dados da empresa (se aplicável)',
            'Cadastre produtos da sua loja',
            'Configure ofertas de frete no AgroConecta'
          ]
        },
        {
          title: 'Navegar na Loja e AgroConecta',
          description: 'Aprenda a usar as principais funcionalidades da plataforma',
          duration: '5 min',
          type: 'video',
          link: '#',
          steps: [
            'Explore o marketplace de produtos',
            'Navegue pelo sistema de fretes',
            'Configure filtros e preferências',
            'Teste as funcionalidades básicas'
          ]
        }
      ]
    },
    {
      id: 'loja',
      title: 'Loja (Marketplace de Produtos)',
      icon: <Store className="w-6 h-6" />,
      description: 'Como cadastrar e gerenciar produtos no marketplace',
      items: [
        {
          title: 'Cadastrar Produtos',
          description: 'Aprenda a cadastrar produtos com todas as informações necessárias',
          duration: '6 min',
          type: 'video',
          link: '#',
          steps: [
            'Nome e descrição do produto',
            'Especificações técnicas detalhadas',
            'Upload de imagens de qualidade',
            'Definir preço e quantidade disponível'
          ]
        },
        {
          title: 'Dados Públicos vs Privados',
          description: 'Entenda o que é visível para todos e o que é confidencial',
          duration: '4 min',
          type: 'video',
          link: '#',
          steps: [
            'Dados públicos: nome, preço, descrição, imagens',
            'Dados privados: NF, contatos diretos, custos internos',
            'Configurar visibilidade de cada campo',
            'Gerenciar permissões de acesso'
          ]
        },
        {
          title: 'Anunciar e Comprar',
          description: 'Como criar anúncios atrativos e realizar compras seguras',
          duration: '7 min',
          type: 'video',
          link: '#',
          steps: [
            'Criar anúncios com palavras-chave',
            'Configurar categorias e tags',
            'Processo de compra passo a passo',
            'Sistema de avaliações e feedback'
          ]
        }
      ]
    },
    {
      id: 'agroconecta',
      title: 'AgroConecta (Fretes e Logística)',
      icon: <Truck className="w-6 h-6" />,
      description: 'Sistema completo de fretes e logística agropecuária',
      items: [
        {
          title: 'Cadastrar Frete',
          description: 'Como registrar suas necessidades de transporte',
          duration: '8 min',
          type: 'video',
          link: '#',
          steps: [
            'Peso e tipo da carga',
            'Rota de origem e destino',
            'Dados fiscais (NF)',
            'Informações sigilosas e específicas'
          ]
        },
        {
          title: 'Visibilidade de Informações',
          description: 'Controle o que é público e o que é privado',
          duration: '5 min',
          type: 'video',
          link: '#',
          steps: [
            'Informações públicas: rota geral, tipo de carga',
            'Informações privadas: NF, contatos, preços',
            'Configurar níveis de acesso',
            'Gerenciar permissões por usuário'
          ]
        },
        {
          title: 'Negociação entre Partes',
          description: 'Como negociar entre anunciante e transportador',
          duration: '6 min',
          type: 'video',
          link: '#',
          steps: [
            'Sistema de propostas',
            'Chat interno para negociação',
            'Contratos digitais',
            'Acompanhamento de entrega'
          ]
        }
      ]
    },
    {
      id: 'cripto-nfts',
      title: 'Cripto, NFTs e Staking',
      icon: <Coins className="w-6 h-6" />,
      description: 'Tecnologias blockchain para o agronegócio',
      items: [
        {
          title: 'Conectar Carteira Solana',
          description: 'Configure sua carteira digital para transações',
          duration: '4 min',
          type: 'video',
          link: '#',
          steps: [
            'Instalar Phantom ou Solflare',
            'Criar ou importar carteira',
            'Conectar à plataforma Agroisync',
            'Configurar permissões de transação'
          ]
        },
        {
          title: 'Mintagem de NFTs',
          description: 'Crie NFTs únicos para seus produtos',
          duration: '7 min',
          type: 'video',
          link: '#',
          steps: [
            'Preparar metadados do produto',
            'Configurar características únicas',
            'Escolher blockchain Solana',
            'Mintar NFT com custos mínimos'
          ]
        },
        {
          title: 'Staking e Recompensas',
          description: 'Sistema de recompensas por participação',
          duration: '6 min',
          type: 'video',
          link: '#',
          steps: [
            'Como funciona o staking',
            'Períodos de lock disponíveis',
            'Configurar recompensas',
            'Monitorar ganhos e progresso'
          ]
        },
        {
          title: 'Segurança e Boas Práticas',
          description: 'Proteja seus ativos digitais',
          duration: '5 min',
          type: 'video',
          link: '#',
          steps: [
            'Armazenamento seguro de chaves',
            'Verificação de contratos inteligentes',
            'Proteção contra fraudes',
            'Backup e recuperação de carteira'
          ]
        }
      ]
    },
    {
      id: 'pagamentos-seguranca',
      title: 'Pagamentos & Segurança',
      icon: <Shield className="w-6 h-6" />,
      description: 'Métodos de pagamento e proteção de dados',
      items: [
        {
          title: 'Formas de Pagamento Aceitas',
          description: 'Conheça todas as opções disponíveis',
          duration: '4 min',
          type: 'video',
          link: '#',
          steps: [
            'PIX e transferências bancárias',
            'Cartões de crédito e débito',
            'Criptomoedas (Bitcoin, Ethereum, Solana)',
            'Boleto bancário'
          ]
        },
        {
          title: 'Proteção de Dados (LGPD)',
          description: 'Conformidade total com a legislação brasileira',
          duration: '6 min',
          type: 'video',
          link: '#',
          steps: [
            'Criptografia de dados em trânsito',
            'Armazenamento seguro em MongoDB',
            'Autenticação AWS Cognito',
            'Seus direitos como usuário'
          ]
        },
        {
          title: 'Políticas de Sigilo',
          description: 'Como suas informações são protegidas',
          duration: '5 min',
          type: 'video',
          link: '#',
          steps: [
            'Dados nunca compartilhados com terceiros',
            'Controle total sobre visibilidade',
            'Auditoria de acesso',
            'Política de retenção de dados'
          ]
        }
      ]
    },
    {
      id: 'chatbot-ia',
      title: 'Chatbot IA',
      icon: <MessageCircle className="w-6 h-6" />,
      description: 'Assistente virtual inteligente 24/7',
      items: [
        {
          title: 'Ativar Funcionalidade de Voz',
          description: 'Use comandos de voz para interagir',
          duration: '3 min',
          type: 'video',
          link: '#',
          steps: [
            'Permitir acesso ao microfone',
            'Configurar idioma preferido',
            'Testar comandos de voz',
            'Ajustar sensibilidade do microfone'
          ]
        },
        {
          title: 'Enviar Imagens para Análise',
          description: 'Chatbot analisa imagens de produtos',
          duration: '4 min',
          type: 'video',
          link: '#',
          steps: [
            'Tipos de imagens aceitas',
            'Como enviar imagens',
            'Interpretação dos resultados',
            'Limitações e precisão'
          ]
        },
        {
          title: 'Uso Multilíngue',
          description: 'Suporte em português, inglês, espanhol e chinês',
          duration: '3 min',
          type: 'video',
          link: '#',
          steps: [
            'Mudar idioma do chatbot',
            'Tradução automática',
            'Idiomas específicos por região',
            'Personalização de respostas'
          ]
        }
      ]
    },
    {
      id: 'planos-assinaturas',
      title: 'Planos & Assinaturas',
      icon: <Award className="w-6 h-6" />,
      description: 'Diferenças entre planos e benefícios exclusivos',
      items: [
        {
          title: 'Plano Grátis vs AGROCONNECT+',
          description: 'Compare as funcionalidades disponíveis',
          duration: '5 min',
          type: 'video',
          link: '#',
          steps: [
            'Funcionalidades do plano grátis',
            'Benefícios exclusivos do AGROCONNECT+',
            'Limitações de cada plano',
            'Casos de uso recomendados'
          ]
        },
        {
          title: 'Benefícios Exclusivos',
          description: 'Recursos premium disponíveis',
          duration: '6 min',
          type: 'video',
          link: '#',
          steps: [
            'Mensageria privada entre usuários',
            'Destaque na loja e busca',
            'Frete premium com prioridade',
            'Suporte técnico prioritário'
          ]
        },
        {
          title: 'Como Fazer Upgrade',
          description: 'Processo para migrar para planos superiores',
          duration: '4 min',
          type: 'video',
          link: '#',
          steps: [
            'Acessar página de planos',
            'Comparar opções disponíveis',
            'Escolher método de pagamento',
            'Ativação imediata do plano'
          ]
        }
      ]
    }
  ];

  const getActiveSection = () => {
    return helpSections.find(section => section.id === activeTab);
  };

  const handleOpenTicket = () => {
    // Implementar abertura de ticket de suporte
    alert('Sistema de tickets será implementado em breve. Entre em contato via email: suporte@agroisync.com');
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} transition-colors duration-300`}>
      
      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-4 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          {isDark ? (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900">
              <div className="absolute inset-0 bg-gray-800 opacity-20"></div>
            </div>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-blue-50">
              <div className="absolute inset-0 bg-white opacity-95"></div>
            </div>
          )}
        </div>

        <div className="relative max-w-7xl mx-auto text-center">
          {/* Main Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Central de Suporte
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Encontre respostas para todas as suas dúvidas sobre a plataforma Agroisync
            </p>
          </motion.div>

          {/* Support Ticket Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-12"
          >
            <button
              onClick={handleOpenTicket}
              className="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-red-600 to-pink-600 text-white font-bold rounded-xl hover:from-red-700 hover:to-pink-700 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <Ticket className="w-6 h-6" />
              <span>Abrir Ticket de Suporte</span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* Help Sections */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Section Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-wrap justify-center gap-4 mb-16"
          >
            {helpSections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveTab(section.id)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === section.id
                    ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg'
                    : isDark
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <div className="flex items-center space-x-2">
                {section.icon}
                  <span>{section.title}</span>
                </div>
              </button>
            ))}
          </motion.div>

          {/* Active Section Content */}
              <motion.div
            key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
              >
            {getActiveSection() && (
              <div>
                {/* Section Header */}
                <div className="text-center mb-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-blue-600 text-white mb-4">
                    {getActiveSection().icon}
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    {getActiveSection().title}
                  </h2>
                  <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    {getActiveSection().description}
                  </p>
                </div>

                {/* Section Items */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {getActiveSection().items.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className={`p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-xl ${
                        isDark 
                          ? 'bg-gray-800 border-gray-700 hover:border-green-500'
                          : 'bg-white border-gray-200 hover:border-green-500'
                      }`}
                    >
                      {/* Item Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                          <p className="text-gray-600 mb-3">{item.description}</p>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Clock className="w-4 h-4" />
                          <span>{item.duration}</span>
                          </div>
                        </div>

                      {/* Steps */}
                      <div className="space-y-2">
                        <h4 className="font-semibold text-gray-700 dark:text-gray-300">Passos:</h4>
                        <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                          {item.steps.map((step, stepIndex) => (
                            <li key={stepIndex}>{step}</li>
                          ))}
                        </ol>
                      </div>

                      {/* Action Button */}
                      <div className="mt-6">
                        <a
                          href={item.link}
                          className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                            isDark
                              ? 'bg-green-600 text-white hover:bg-green-700'
                              : 'bg-green-600 text-white hover:bg-green-700'
                          }`}
                        >
                          <Video className="w-4 h-4" />
                          <span>Assistir Tutorial</span>
                        </a>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
              </motion.div>
        </div>
      </section>

      {/* Additional Support */}
      <section className={`py-20 px-4 ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Precisa de Mais Ajuda?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Nossa equipe de suporte está sempre pronta para ajudar você
            </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
                className="p-6 rounded-2xl bg-white dark:bg-gray-700 shadow-lg"
              >
                <Mail className="w-12 h-12 mx-auto mb-4 text-green-600" />
                <h3 className="text-xl font-bold mb-2">Email</h3>
                <p className="text-gray-600 mb-4">suporte@agroisync.com</p>
                <p className="text-sm text-gray-500">Resposta em até 24h</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
                className="p-6 rounded-2xl bg-white dark:bg-gray-700 shadow-lg"
              >
                <Phone className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                <h3 className="text-xl font-bold mb-2">Telefone</h3>
                <p className="text-gray-600 mb-4">(66) 99236-2830</p>
                <p className="text-sm text-gray-500">Segunda a Sexta, 8h às 18h</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
                className="p-6 rounded-2xl bg-white dark:bg-gray-700 shadow-lg"
              >
                <MessageCircle className="w-12 h-12 mx-auto mb-4 text-purple-600" />
                <h3 className="text-xl font-bold mb-2">Chat ao Vivo</h3>
                <p className="text-gray-600 mb-4">Chatbot IA 24/7</p>
                <p className="text-sm text-gray-500">Respostas instantâneas</p>
            </motion.div>
          </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Ajuda;
