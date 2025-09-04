import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { 
  ChevronDown, Search, HelpCircle, MessageCircle, 
  FileText, Phone, Mail, Globe, Clock,
  Shield, Coins, Truck, ShoppingCart, Zap, Lock, Store, Award
} from 'lucide-react';

const FAQ = () => {
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const [openItems, setOpenItems] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  const faqCategories = [
    {
      id: 'general',
      title: 'Geral',
      icon: <HelpCircle className="w-5 h-5" />,
      items: [
        {
          question: 'O que é a Agroisync?',
          answer: 'Agroisync é uma plataforma completa de agronegócio que conecta produtores, compradores e transportadores. Oferecemos marketplace de produtos agropecuários, sistema de fretes (AgroConecta), pagamentos em criptomoedas, NFTs e um chatbot IA inteligente para suporte 24/7. Nossa missão é digitalizar e otimizar o agronegócio brasileiro.'
        },
        {
          question: 'Preciso pagar para usar a plataforma?',
          answer: 'A plataforma oferece planos gratuitos e premium. O plano gratuito permite acesso básico ao marketplace e funcionalidades essenciais. Os planos premium (AGROCONNECT+ e AGROCONNECT PRO) oferecem recursos avançados como mensageria privada, analytics detalhados, destaque na loja e suporte prioritário.'
        },
        {
          question: 'Como funciona o sistema de planos?',
          answer: 'O sistema de planos é flexível e escalável. O plano gratuito é ideal para começar, com funcionalidades básicas. O AGROCONNECT+ oferece mensageria privada, destaque na loja e frete premium. O AGROCONNECT PRO inclui analytics avançados, API personalizada e suporte VIP. Você pode fazer upgrade a qualquer momento.'
        },
        {
          question: 'Como entrar em contato com suporte?',
          answer: 'Oferecemos múltiplos canais de suporte: chatbot IA 24/7, email (contato@agroisync.com), telefone ((66) 99236-2830) e sistema de tickets. Nossa equipe responde em até 24 horas e está disponível de segunda a sexta, das 8h às 18h.'
        }
      ]
    },
    {
      id: 'loja',
      title: 'Loja (Marketplace)',
      icon: <Store className="w-5 h-5" />,
      items: [
        {
          question: 'Como cadastrar produtos na Loja?',
          answer: 'Para cadastrar produtos, você precisa ter uma conta verificada. Acesse "Minha Loja" e clique em "Adicionar Produto". Preencha todas as informações obrigatórias: nome, categoria, especificações técnicas, imagens, preço, quantidade e descrição detalhada. Produtos são aprovados em até 24h.'
        },
        {
          question: 'Quais informações são privadas e quais são públicas?',
          answer: 'Informações públicas incluem: nome do produto, preço, descrição básica, imagens e categoria. Informações privadas incluem: dados fiscais (NF), contatos diretos, custos internos, margens de lucro e informações específicas da empresa. Você controla a visibilidade de cada campo.'
        },
        {
          question: 'Como funciona o processo de compra?',
          answer: 'O processo de compra é simples e seguro. Navegue pelos produtos, use filtros para encontrar o que precisa, compare preços e especificações, adicione ao carrinho e finalize a compra. Aceitamos PIX, cartões, transferências e criptomoedas. Todas as transações são protegidas.'
        }
      ]
    },
    {
      id: 'agroconecta',
      title: 'AgroConecta (Fretes)',
      icon: <Truck className="w-5 h-5" />,
      items: [
        {
          question: 'Como cadastrar fretes no AgroConecta?',
          answer: 'Acesse a seção AgroConecta e clique em "Solicitar Frete". Preencha os campos obrigatórios: peso da carga, tipo de carga, origem, destino, prazo desejado e informações específicas. Para transportadores, cadastre sua disponibilidade com rotas, capacidade e preços.'
        },
        {
          question: 'Quais informações são visíveis para todos?',
          answer: 'Informações públicas incluem: rota geral (origem-destino), tipo de carga, peso aproximado e prazo desejado. Informações privadas incluem: dados fiscais (NF), contatos diretos, preços específicos e informações internas da empresa. Você controla o nível de detalhe.'
        },
        {
          question: 'Como negociar entre anunciante e transportador?',
          answer: 'O sistema oferece chat interno para negociação, sistema de propostas com preços e condições, contratos digitais para formalização e acompanhamento de entrega em tempo real. Todas as comunicações são seguras e auditáveis.'
        }
      ]
    },
    {
      id: 'cripto-nfts',
      title: 'Cripto, NFTs e Staking',
      icon: <Coins className="w-5 h-5" />,
      items: [
        {
          question: 'Quais criptomoedas são aceitas?',
          answer: 'Aceitamos Bitcoin (BTC), Ethereum (ETH) e Solana (SOL) como principais moedas. Também aceitamos stablecoins como USDT e USDC para maior estabilidade de preço. Todas as transações são processadas na blockchain Solana para maior velocidade e menor custo.'
        },
        {
          question: 'Como conectar minha carteira Solana?',
          answer: 'Suportamos as principais carteiras: Phantom, Solflare e WalletConnect. Clique em "Conectar Carteira" e escolha sua preferida. Autorize a conexão e configure as permissões necessárias. Suas chaves privadas nunca são acessadas pela plataforma.'
        },
        {
          question: 'NFTs representam produtos reais?',
          answer: 'Sim! Nossos NFTs são certificados digitais únicos que representam propriedade real sobre produtos físicos. Cada NFT contém metadados detalhados do produto, incluindo especificações técnicas, origem e histórico de propriedade, garantindo transparência e autenticidade.'
        }
      ]
    },
    {
      id: 'seguranca',
      title: 'Segurança e Privacidade',
      icon: <Shield className="w-5 h-5" />,
      items: [
        {
          question: 'Como meus dados são protegidos?',
          answer: 'Seguimos rigorosamente a LGPD (Lei Geral de Proteção de Dados). Todos os dados são criptografados em trânsito e em repouso. Utilizamos autenticação AWS Cognito, monitoramento de atividades suspeitas e backups seguros. Seus dados nunca são compartilhados com terceiros sem consentimento.'
        },
        {
          question: 'A plataforma é segura para transações?',
          answer: 'Sim! Utilizamos criptografia de ponta a ponta, contratos inteligentes na blockchain Solana para transações transparentes, e sistemas de detecção de fraudes em tempo real. Todas as transações são monitoradas e protegidas por seguros de plataforma.'
        },
        {
          question: 'Como funciona o processo KYC?',
          answer: 'O KYC (Know Your Customer) é obrigatório para contas empresariais e usuários que realizam transações acima de R$ 10.000. Você precisará fornecer documentos pessoais, comprovante de endereço e informações da empresa. O processo é feito de forma segura e aprovado em até 48h.'
        }
      ]
    },
    {
      id: 'tecnologia',
      title: 'Tecnologia e Infraestrutura',
      icon: <Zap className="w-5 h-5" />,
      items: [
        {
          question: 'Qual tecnologia blockchain vocês usam?',
          answer: 'Utilizamos a blockchain Solana por sua alta velocidade (65.000 TPS), baixos custos de transação e escalabilidade. Nossos contratos inteligentes são auditados e seguem padrões de segurança internacionais. A integração é feita via APIs seguras.'
        },
        {
          question: 'Como funciona o chatbot IA?',
          answer: 'Nosso chatbot IA utiliza tecnologia de linguagem natural avançada, processamento de imagens e reconhecimento de voz. Ele pode responder perguntas frequentes, ajudar com navegação, analisar imagens de produtos e oferecer suporte em português, inglês, espanhol e chinês 24/7.'
        },
        {
          question: 'A plataforma funciona em dispositivos móveis?',
          answer: 'Sim! A plataforma é totalmente responsiva e funciona perfeitamente em smartphones e tablets. Oferecemos aplicativo móvel nativo para iOS e Android com todas as funcionalidades da versão web, incluindo notificações push e acesso offline básico.'
        }
      ]
    },
    {
      id: 'planos',
      title: 'Planos e Assinaturas',
      icon: <Award className="w-5 h-5" />,
      items: [
        {
          question: 'Qual a diferença entre os planos?',
          answer: 'O plano gratuito oferece funcionalidades básicas do marketplace. O AGROCONNECT+ inclui mensageria privada, destaque na loja e frete premium. O AGROCONNECT PRO adiciona analytics avançados, API personalizada e suporte VIP. Cada plano é projetado para diferentes necessidades de negócio.'
        },
        {
          question: 'Posso mudar de plano a qualquer momento?',
          answer: 'Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento. O upgrade é ativado imediatamente, enquanto o downgrade entra em vigor no próximo ciclo de cobrança. Não há taxas de cancelamento ou mudança de plano.'
        },
        {
          question: 'Os planos incluem suporte técnico?',
          answer: 'Todos os planos incluem suporte básico via chatbot IA e email. O AGROCONNECT+ inclui suporte por telefone e chat ao vivo. O AGROCONNECT PRO oferece suporte VIP com resposta em até 2 horas e atendimento dedicado.'
        }
      ]
    }
  ];

  const toggleItem = (itemId) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(itemId)) {
      newOpenItems.delete(itemId);
    } else {
      newOpenItems.add(itemId);
    }
    setOpenItems(newOpenItems);
  };

  const filteredCategories = faqCategories.map(category => ({
    ...category,
    items: category.items.filter(item =>
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.items.length > 0);

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} transition-colors duration-300 pt-16`}>
      
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
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gradient-agro">
            Perguntas Frequentes
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Encontre respostas rápidas para as dúvidas mais comuns sobre a plataforma Agroisync
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-2xl mx-auto"
          >
          <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
                placeholder="Buscar perguntas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          {filteredCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
              className="mb-16"
            >
              {/* Category Header */}
              <div className="flex items-center space-x-3 mb-8">
                <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-blue-600 text-white">
                {category.icon}
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gradient-agro">{category.title}</h2>
              </div>

              {/* FAQ Items */}
              <div className="space-y-4">
                {category.items.map((item, itemIndex) => {
                  const itemId = `${category.id}-${itemIndex}`;
                  const isOpen = openItems.has(itemId);

                  return (
                    <motion.div
                      key={itemId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: (categoryIndex * 0.1) + (itemIndex * 0.05) }}
                      className={`border-2 rounded-2xl overflow-hidden transition-all duration-300 ${
                        isOpen
                          ? 'border-green-500 shadow-lg'
                          : isDark
                          ? 'border-gray-700 hover:border-gray-600'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {/* Question */}
                      <button
                        onClick={() => toggleItem(itemId)}
                        className={`w-full px-6 py-4 text-left flex items-center justify-between transition-colors duration-200 ${
                          isDark 
                            ? 'bg-gray-800 hover:bg-gray-700'
                            : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        <h3 className="text-lg font-semibold pr-4">{item.question}</h3>
                        <ChevronDown 
                          className={`w-5 h-5 transition-transform duration-200 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      {/* Answer */}
                        <motion.div
                        initial={false}
                        animate={{
                          height: isOpen ? 'auto' : 0,
                          opacity: isOpen ? 1 : 0
                        }}
                          transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className={`px-6 py-4 ${
                          isDark ? 'bg-gray-900' : 'bg-white'
                        }`}>
                          <p className="text-gray-600 leading-relaxed">{item.answer}</p>
                        </div>
                        </motion.div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact Support */}
      <section className={`py-20 px-4 ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Não Encontrou o Que Procurava?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Nossa equipe de suporte está sempre pronta para ajudar com suas dúvidas específicas
            </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
                className="p-6 rounded-2xl bg-white dark:bg-gray-700 shadow-lg"
              >
                <MessageCircle className="w-12 h-12 mx-auto mb-4 text-green-600" />
                <h3 className="text-xl font-bold mb-2">Chatbot IA</h3>
                <p className="text-gray-600 mb-4">Suporte instantâneo 24/7</p>
                <p className="text-sm text-gray-500">Respostas em segundos</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
                className="p-6 rounded-2xl bg-white dark:bg-gray-700 shadow-lg"
              >
                <Mail className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                <h3 className="text-xl font-bold mb-2">Email</h3>
                <p className="text-gray-600 mb-4">contato@agroisync.com</p>
                <p className="text-sm text-gray-500">Resposta em até 24h</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
                className="p-6 rounded-2xl bg-white dark:bg-gray-700 shadow-lg"
              >
                <Phone className="w-12 h-12 mx-auto mb-4 text-purple-600" />
                <h3 className="text-xl font-bold mb-2">Telefone</h3>
                <p className="text-gray-600 mb-4">(66) 99236-2830</p>
                <p className="text-sm text-gray-500">Segunda a Sexta, 8h às 18h</p>
            </motion.div>
          </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default FAQ;
