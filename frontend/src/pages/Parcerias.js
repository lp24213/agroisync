import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  Building2, Globe, Award, Handshake, Users, 
  TrendingUp, Shield, Zap, Leaf, Truck, Sprout,
  Bitcoin, Bot, CreditCard, Dna
} from 'lucide-react';

const Parcerias = () => {
  const { isDark } = useTheme();
  const { t } = useLanguage();

  // Função para renderizar os ícones dos parceiros
  const getIconComponent = (iconName) => {
    switch (iconName) {
      case 'Leaf':
        return <Leaf className="w-10 h-10" />;
      case 'Sprout':
        return <Sprout className="w-10 h-10" />;
      case 'Truck':
        return <Truck className="w-10 h-10" />;
      case 'Bitcoin':
        return <Bitcoin className="w-10 h-10" />;
      case 'Bot':
        return <Bot className="w-10 h-10" />;
      case 'Seedling':
        return <Sprout className="w-10 h-10" />;
      case 'CreditCard':
        return <CreditCard className="w-10 h-10" />;
      case 'Dna':
        return <Dna className="w-10 h-10" />;
      default:
        return <Leaf className="w-10 h-10" />;
    }
  };

  // Lista de parceiros
  const parceiros = [
    {
      id: 1,
      nome: 'AgroTech Solutions',
      logo: 'Leaf',
      descricao: 'Tecnologia avançada para agricultura de precisão e IoT agrícola',
      website: 'https://agrotech-solutions.com',
      categoria: 'Tecnologia',
      destaque: true
    },
    {
      id: 2,
      nome: 'GreenHarvest Corp',
      logo: 'Sprout',
      descricao: 'Sementes certificadas e insumos orgânicos de alta qualidade',
      website: 'https://greenharvest.com',
      categoria: 'Insumos',
      destaque: true
    },
    {
      id: 3,
      nome: 'FarmLogistics',
      logo: 'Truck',
      descricao: 'Soluções logísticas especializadas em transporte agrícola',
      website: 'https://farmlogistics.com',
      categoria: 'Logística',
      destaque: false
    },
    {
      id: 4,
      nome: 'CryptoAgro',
      logo: 'Bitcoin',
      descricao: 'Plataforma de DeFi para financiamento agrícola via blockchain',
      website: 'https://cryptoagro.io',
      categoria: 'Fintech',
      destaque: true
    },
    {
      id: 5,
      nome: 'SmartFarm Systems',
      logo: 'Bot',
      descricao: 'Automação inteligente para estufas e sistemas de irrigação',
      website: 'https://smartfarm.com',
      categoria: 'Automação',
      destaque: false
    },
    {
      id: 6,
      nome: 'EcoSeed Bank',
      logo: 'Seedling',
      descricao: 'Banco de sementes nativas e preservação de biodiversidade',
      website: 'https://ecoseedbank.org',
      categoria: 'Conservação',
      destaque: false
    },
    {
      id: 7,
      nome: 'AgroFinance',
      logo: 'CreditCard',
      descricao: 'Crédito rural digital e seguros agrícolas inovadores',
      website: 'https://agrofinance.com',
      categoria: 'Finanças',
      destaque: true
    },
    {
      id: 8,
      nome: 'BioControl Labs',
      logo: 'Dna',
      descricao: 'Pesquisa em controle biológico e produtos naturais',
      website: 'https://biocontrol-labs.com',
      categoria: 'Pesquisa',
      destaque: false
    }
  ];

  const categorias = ['Todos', 'Tecnologia', 'Insumos', 'Logística', 'Fintech', 'Automação', 'Conservação', 'Finanças', 'Pesquisa'];
  const [categoriaAtiva, setCategoriaAtiva] = React.useState('Todos');

  const parceirosFiltrados = categoriaAtiva === 'Todos' 
    ? parceiros 
    : parceiros.filter(p => p.categoria === categoriaAtiva);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} transition-colors duration-300 pt-16`}>
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative py-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <Handshake className={`w-20 h-20 mx-auto mb-6 ${
              isDark ? 'text-cyan-400' : 'text-green-600'
            }`} />
          </motion.div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gradient-agro">
            Nossos Parceiros
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-80">
            Conectando o agronegócio com as melhores soluções e tecnologias do mercado
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categorias.map((categoria) => (
              <motion.button
                key={categoria}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCategoriaAtiva(categoria)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                                     categoriaAtiva === categoria
                     ? 'bg-gradient-to-r from-emerald-600 to-blue-600 text-white shadow-lg'
                     : 'bg-slate-100 text-slate-700 hover:bg-gradient-to-r hover:from-emerald-600 hover:to-blue-600 hover:text-white hover:shadow-md border border-slate-300'
                }`}
              >
                {categoria}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Parceiros Grid */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {parceirosFiltrados.map((parceiro) => (
            <motion.div
              key={parceiro.id}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.02,
                y: -5,
                transition: { duration: 0.2 }
              }}
              className={`relative overflow-hidden rounded-2xl shadow-xl transition-all duration-300 ${
                isDark
                  ? 'bg-gray-800/50 border border-gray-700 hover:border-cyan-400/50'
                  : 'bg-white/50 border border-gray-200 hover:border-green-500/50'
              } ${parceiro.destaque ? 'ring-2 ring-yellow-400/50' : ''}`}
            >
              {/* Badge de destaque */}
              {parceiro.destaque && (
                <div className="absolute top-4 right-4 z-10">
                  <div className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <Award className="w-3 h-3" />
                    Destaque
                  </div>
                </div>
              )}

              {/* Logo e informações */}
              <div className="p-6">
                <div className="text-center mb-4">
                  <div className={`w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-blue-600 flex items-center justify-center text-white ${
                    parceiro.destaque ? 'animate-pulse' : ''
                  }`}>
                    {getIconComponent(parceiro.logo)}
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2">
                    {parceiro.nome}
                  </h3>
                  
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    isDark
                      ? 'bg-cyan-400/20 text-cyan-400 border border-cyan-400/30'
                      : 'bg-green-500/20 text-green-600 border border-green-500/30'
                  }`}>
                    {parceiro.categoria}
                  </span>
                </div>
                
                <p className="text-center mb-6 opacity-80 leading-relaxed">
                  {parceiro.descricao}
                </p>
                
                {/* Botão de acesso */}
                <div className="text-center">
                  <motion.a
                    href={parceiro.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                      isDark
                        ? 'bg-gradient-to-r from-cyan-400 to-purple-500 text-white hover:shadow-lg hover:shadow-cyan-400/25'
                        : 'bg-gradient-to-r from-green-500 to-blue-600 text-white hover:shadow-lg hover:shadow-green-500/25'
                    }`}
                  >
                    <Globe className="w-4 h-4" />
                    Visitar Site
                  </motion.a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className={`py-20 px-4 sm:px-6 lg:px-8 ${
          isDark ? 'bg-gray-800/50' : 'bg-gray-50'
        }`}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Quer ser nosso parceiro?
          </h2>
          
          <p className="text-xl mb-8 opacity-80">
            Junte-se à nossa rede de parceiros e ajude a transformar o agronegócio brasileiro
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="p-6 rounded-2xl bg-white dark:bg-gray-700 shadow-lg"
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center text-white">
                  <Building2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">Email</h3>
                <p className="text-gray-600 mb-4">contato@agroisync.com</p>
                <a
                  href="mailto:contato@agroisync.com"
                  className="text-green-600 hover:text-green-700 text-sm font-medium"
                >
                  Enviar Email
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="p-6 rounded-2xl bg-white dark:bg-gray-700 shadow-lg"
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white">
                  <Users className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">WhatsApp</h3>
                <p className="text-gray-600 mb-4">+55 66 99236-2830</p>
                <a
                  href="https://wa.me/5566992362830"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Abrir WhatsApp
                </a>
              </div>
            </motion.div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`inline-flex items-center gap-3 px-8 py-4 rounded-full text-lg font-bold transition-all duration-300 ${
              isDark
                ? 'bg-gradient-to-r from-cyan-400 to-purple-500 text-white hover:shadow-xl hover:shadow-cyan-400/25'
                : 'bg-gradient-to-r from-green-500 to-blue-600 text-white hover:shadow-xl hover:shadow-green-500/25'
            }`}
          >
            <Users className="w-5 h-5" />
            Solicitar Parceria
          </motion.button>
        </div>
      </motion.section>
    </div>
  );
};

export default Parcerias;
