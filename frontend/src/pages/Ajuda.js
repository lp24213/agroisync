import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { 
  BookOpen, Video, FileText, MessageCircle, 
  Phone, Mail, Clock, Users, Shield, Zap,
  Truck, Coins, ShoppingCart, Settings,
  HelpCircle, Star, Award, Bookmark, Ticket
} from 'lucide-react';

const Ajuda = () => {
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('primeiros-passos');

  const helpSections = [
    {
      id: 'primeiros-passos',
      title: 'Primeiros Passos',
      icon: <BookOpen className="w-6 h-6" />,
      description: 'Guia completo para começar a usar a plataforma Agroisync',
      items: [
        {
          title: 'Criar Conta',
          description: 'Aprenda a criar sua conta e configurar seu perfil de empresa',
          duration: '5 min',
          type: 'video',
          link: '#',
          steps: [
            'Acesse a página de cadastro',
            'Preencha seus dados pessoais e da empresa',
            'Verifique seu email',
            'Configure seu perfil completo'
          ]
        },
        {
          title: 'Conectar Carteira',
          description: 'Conecte sua carteira digital para transações seguras',
          duration: '8 min',
          type: 'video',
          link: '#',
          steps: [
            'Escolha sua carteira (MetaMask, Phantom, etc.)',
            'Conecte a carteira à plataforma',
            'Autorize as transações necessárias',
            'Configure preferências de segurança'
          ]
        },
        {
          title: 'Usar Marketplace',
          description: 'Navegue e compre produtos no marketplace agropecuário',
          duration: '6 min',
          type: 'video',
          link: '#',
          steps: [
            'Explore categorias de produtos',
            'Filtre por localização e preço',
            'Compare opções disponíveis',
            'Realize sua primeira compra'
          ]
        },
        {
          title: 'AgroConecta - Fretes',
          description: 'Encontre e ofereça serviços de transporte de carga',
          duration: '10 min',
          type: 'video',
          link: '#',
          steps: [
            'Registre suas necessidades de frete',
            'Configure rotas e prazos',
            'Receba propostas de transportadoras',
            'Selecione a melhor opção'
          ]
        }
      ]
    },
    {
      id: 'nft-staking',
      title: 'NFTs e Staking',
      icon: <Coins className="w-6 h-6" />,
      description: 'Entenda como funcionam os NFTs e o sistema de staking',
      items: [
        {
          title: 'Mintagem de NFTs',
          description: 'Crie NFTs únicos para seus produtos e serviços',
          duration: '7 min',
          type: 'video',
          link: '#',
          steps: [
            'Prepare os metadados do seu produto',
            'Configure as características únicas',
            'Escolha a blockchain (Solana)',
            'Mint seu primeiro NFT'
          ]
        },
        {
          title: 'Sistema de Staking',
          description: 'Aprenda a fazer staking e ganhar recompensas',
          duration: '9 min',
          type: 'video',
          link: '#',
          steps: [
            'Entenda como funciona o staking',
            'Escolha o período de lock',
            'Configure suas recompensas',
            'Monitore seu progresso'
          ]
        },
        {
          title: 'Recompensas e Benefícios',
          description: 'Descubra todas as vantagens do sistema de recompensas',
          duration: '5 min',
          type: 'video',
          link: '#',
          steps: [
            'Tipos de recompensas disponíveis',
            'Como acumular pontos',
            'Trocar por benefícios exclusivos',
            'Programa de fidelidade'
          ]
        },
        {
          title: 'Segurança dos NFTs',
          description: 'Proteja seus NFTs e entenda as melhores práticas',
          duration: '8 min',
          type: 'video',
          link: '#',
          steps: [
            'Armazenamento seguro de chaves',
            'Verificação de contratos inteligentes',
            'Proteção contra fraudes',
            'Backup e recuperação'
          ]
        }
      ]
    },
    {
      id: 'pagamentos-seguranca',
      title: 'Pagamentos e Segurança',
      icon: <Shield className="w-6 h-6" />,
      description: 'Informações sobre métodos de pagamento e segurança da plataforma',
      items: [
        {
          title: 'Métodos de Pagamento',
          description: 'Conheça todas as formas de pagamento aceitas',
          duration: '6 min',
          type: 'video',
          link: '#',
          steps: [
            'Cartões de crédito e débito',
            'PIX e transferências bancárias',
            'Criptomoedas (Bitcoin, Ethereum, Solana)',
            'Carteiras digitais'
          ]
        },
        {
          title: 'Boas Práticas de Segurança',
          description: 'Mantenha sua conta e transações sempre seguras',
          duration: '8 min',
          type: 'video',
          link: '#',
          steps: [
            'Senhas fortes e autenticação 2FA',
            'Verificação de emails e transações',
            'Proteção contra phishing',
            'Monitoramento de atividades'
          ]
        },
        {
          title: 'Processo KYC',
          description: 'Entenda o processo de verificação de identidade',
          duration: '10 min',
          type: 'video',
          link: '#',
          steps: [
            'Documentos necessários',
            'Processo de verificação',
            'Tempo de aprovação',
            'Manutenção da verificação'
          ]
        },
        {
          title: 'Proteção de Dados',
          description: 'Como seus dados pessoais são protegidos',
          duration: '5 min',
          type: 'video',
          link: '#',
          steps: [
            'Criptografia de dados',
            'Conformidade com LGPD',
            'Política de privacidade',
            'Seus direitos como usuário'
          ]
        }
      ]
    },
    {
      id: 'chatbot-ia',
      title: 'Chatbot IA',
      icon: <MessageCircle className="w-6 h-6" />,
      description: 'Aproveite ao máximo o assistente virtual inteligente',
      items: [
        {
          title: 'Funcionalidades de Voz',
          description: 'Use comandos de voz para interagir com o chatbot',
          duration: '4 min',
          type: 'video',
          link: '#',
          steps: [
            'Ativar reconhecimento de voz',
            'Comandos de voz disponíveis',
            'Configurar idioma preferido',
            'Ajustar sensibilidade do microfone'
          ]
        },
        {
          title: 'Processamento de Imagens',
          description: 'Envie imagens para análise e identificação',
          duration: '6 min',
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
          title: 'Suporte Multilíngue',
          description: 'Chatbot disponível em português, inglês, espanhol e chinês',
          duration: '3 min',
          type: 'video',
          link: '#',
          steps: [
            'Mudar idioma do chatbot',
            'Tradução automática',
            'Idiomas específicos por região',
            'Personalização de respostas'
          ]
        },
        {
          title: 'Integração com Produtos',
          description: 'Como o chatbot pode ajudar com produtos e fretes',
          duration: '7 min',
          type: 'video',
          link: '#',
          steps: [
            'Busca inteligente de produtos',
            'Recomendações personalizadas',
            'Acompanhamento de pedidos',
            'Suporte ao cliente 24/7'
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
              Central de Ajuda
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
