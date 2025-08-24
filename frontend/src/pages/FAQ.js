import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { 
  ChevronDown, Search, HelpCircle, MessageCircle, 
  FileText, Phone, Mail, Globe, Clock
} from 'lucide-react';
import GlobalTicker from '../components/GlobalTicker';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WeatherWidget from '../components/WeatherWidget';
import Chatbot from '../components/Chatbot';

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
          question: 'O que é o AgroISync?',
          answer: 'O AgroISync é o hub mais completo do agronegócio brasileiro, unindo marketplace de produtos agrícolas, plataforma de fretes e soluções em criptomoedas em uma única plataforma profissional e integrada.'
        },
        {
          question: 'Como funciona o sistema de cadastro?',
          answer: 'O sistema oferece cadastros separados para Loja (vendedores e clientes), AgroConecta (transportadoras e motoristas) e Cripto (usuários de criptomoedas), cada um com campos específicos e validação completa.'
        },
        {
          question: 'Quais são os planos disponíveis?',
          answer: 'Oferecemos planos Básico (gratuito), Pro e Enterprise para Loja e AgroConecta, com funcionalidades escaláveis e preços competitivos para diferentes necessidades do agronegócio.'
        }
      ]
    },
    {
      id: 'marketplace',
      title: 'Marketplace',
      icon: <FileText className="w-5 h-5" />,
      items: [
        {
          question: 'Como cadastrar produtos na Loja?',
          answer: 'Para cadastrar produtos, faça login como vendedor, acesse "Meus Produtos" e preencha as informações: nome, categoria, preço, estoque, descrição e fotos. Todos os produtos passam por moderação.'
        },
        {
          question: 'Quais categorias de produtos são aceitas?',
          answer: 'Aceitamos Insumos (sementes, fertilizantes), Máquinas/Implementos, Pecuária (bovinos, suínos), Commodities (grãos, café) e Serviços (consultoria, análise).'
        },
        {
          question: 'Como funciona o sistema de pagamentos?',
          answer: 'Aceitamos PIX, Boleto Bancário e Cartão de Crédito/Débito. Para produtos de alto valor, oferecemos opções de financiamento e parcelamento.'
        }
      ]
    },
    {
      id: 'freight',
      title: 'Fretes',
      icon: <Globe className="w-5 h-5" />,
      items: [
        {
          question: 'Como cadastrar fretes no AgroConecta?',
          answer: 'Transportadoras e motoristas podem cadastrar fretes informando produto, quantidade, origem, destino, tipo de caminhão, valor e prazo. O sistema oferece rastreamento e seguro de carga.'
        },
        {
          question: 'Quais tipos de carga são aceitos?',
          answer: 'Aceitamos grãos (soja, milho, trigo), commodities (café, algodão), máquinas agrícolas, bovinos vivos e insumos, com veículos adequados para cada tipo de carga.'
        },
        {
          question: 'Como funciona o sistema de busca de fretes?',
          answer: 'Produtores podem buscar fretes por origem, destino, produto, preço e tipo de caminhão. O sistema mostra opções em tempo real com avaliações e histórico das transportadoras.'
        }
      ]
    },
    {
      id: 'crypto',
      title: 'Criptomoedas',
      icon: <MessageCircle className="w-5 h-5" />,
      items: [
        {
          question: 'Quais criptomoedas são aceitas?',
          answer: 'Aceitamos Bitcoin (BTC), Ethereum (ETH), Tether (USDT), Binance Coin (BNB), Solana (SOL), Cardano (ADA), Polkadot (DOT) e Chainlink (LINK).'
        },
        {
          question: 'Como funciona a integração com carteiras?',
          answer: 'Integramos com MetaMask, Phantom e WalletConnect de forma segura. Os endereços das carteiras não são expostos publicamente, garantindo total segurança.'
        },
        {
          question: 'O sistema é seguro para transações?',
          answer: 'Sim, utilizamos as melhores práticas de segurança blockchain, com criptografia avançada e auditorias regulares. Todas as transações são rastreadas e seguras.'
        }
      ]
    },
    {
      id: 'technical',
      title: 'Técnico',
      icon: <Clock className="w-5 h-5" />,
      items: [
        {
          question: 'O site funciona em dispositivos móveis?',
          answer: 'Sim, o AgroISync é totalmente responsivo e funciona perfeitamente em smartphones, tablets e desktops, com interface otimizada para cada dispositivo.'
        },
        {
          question: 'Como funciona o sistema de notificações?',
          answer: 'Oferecemos notificações em tempo real para novos fretes, atualizações de produtos, mensagens e status de pedidos, via email e push notifications.'
        },
        {
          question: 'O sistema está sempre disponível?',
          answer: 'Garantimos 99.9% de uptime com infraestrutura AWS robusta, backups automáticos e monitoramento 24/7 para máxima disponibilidade.'
        }
      ]
    }
  ];

  const toggleItem = (categoryId, itemIndex) => {
    const key = `${categoryId}-${itemIndex}`;
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(key)) {
      newOpenItems.delete(key);
    } else {
      newOpenItems.add(key);
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
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} transition-colors duration-300`}>
      <GlobalTicker />
      <Navbar />
      
      {/* Header Section */}
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

        <div className="relative max-w-6xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent"
          >
            Perguntas Frequentes
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Encontre respostas para as principais dúvidas sobre o AgroISync
          </motion.p>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar perguntas ou respostas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-12 pr-4 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                isDark 
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
            />
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          {filteredCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
              className="mb-12"
            >
              <div className={`flex items-center space-x-3 mb-6 ${
                isDark ? 'text-green-400' : 'text-green-600'
              }`}>
                {category.icon}
                <h2 className="text-2xl font-bold">{category.title}</h2>
              </div>

              <div className="space-y-4">
                {category.items.map((item, itemIndex) => {
                  const key = `${category.id}-${itemIndex}`;
                  const isOpen = openItems.has(key);

                  return (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: itemIndex * 0.1 }}
                      className={`border rounded-xl overflow-hidden ${
                        isDark 
                          ? 'border-gray-700 bg-gray-800' 
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      <button
                        onClick={() => toggleItem(category.id, itemIndex)}
                        className={`w-full px-6 py-4 text-left flex items-center justify-between hover:bg-opacity-50 transition-colors duration-200 ${
                          isDark 
                            ? 'hover:bg-gray-700' 
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <span className="font-medium">{item.question}</span>
                        <ChevronDown 
                          className={`w-5 h-5 transition-transform duration-200 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className={`px-6 pb-4 ${
                            isDark ? 'text-gray-300' : 'text-gray-600'
                          }`}
                        >
                          {item.answer}
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold mb-8"
          >
            Ainda tem dúvidas?
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className={`p-6 rounded-xl border ${
                isDark 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-200'
              }`}
            >
              <Phone className="w-12 h-12 mx-auto mb-4 text-green-500" />
              <h3 className="font-bold mb-2">Telefone</h3>
              <p className="text-sm">(66) 99236-2830</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`p-6 rounded-xl border ${
                isDark 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-200'
              }`}
            >
              <Mail className="w-12 h-12 mx-auto mb-4 text-green-500" />
              <h3 className="font-bold mb-2">Email</h3>
              <p className="text-sm">contato@agroisync.com</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className={`p-6 rounded-xl border ${
                isDark 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-200'
              }`}
            >
              <MessageCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
              <h3 className="font-bold mb-2">Chat</h3>
              <p className="text-sm">Suporte em tempo real</p>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
      <WeatherWidget />
      <Chatbot />
    </div>
  );
};

export default FAQ;
