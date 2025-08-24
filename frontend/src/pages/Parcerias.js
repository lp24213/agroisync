import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { 
  Building2, Globe, Award, Handshake, Users, 
  TrendingUp, Shield, Zap, Leaf, Truck
} from 'lucide-react';

const Parcerias = () => {
  const { isDark } = useTheme();
  const { t } = useTranslation();

  // Lista de parceiros
  const parceiros = [
    {
      id: 1,
      nome: 'AgroTech Solutions',
      logo: '🌾',
      descricao: 'Tecnologia avançada para agricultura de precisão e IoT agrícola',
      website: 'https://agrotech-solutions.com',
      categoria: 'Tecnologia',
      destaque: true
    },
    {
      id: 2,
      nome: 'GreenHarvest Corp',
      logo: '🌱',
      descricao: 'Sementes certificadas e insumos orgânicos de alta qualidade',
      website: 'https://greenharvest.com',
      categoria: 'Insumos',
      destaque: true
    },
    {
      id: 3,
      nome: 'FarmLogistics',
      logo: '🚛',
      descricao: 'Soluções logísticas especializadas em transporte agrícola',
      website: 'https://farmlogistics.com',
      categoria: 'Logística',
      destaque: false
    },
    {
      id: 4,
      nome: 'CryptoAgro',
      logo: '₿',
      descricao: 'Plataforma de DeFi para financiamento agrícola via blockchain',
      website: 'https://cryptoagro.io',
      categoria: 'Fintech',
      destaque: true
    },
    {
      id: 5,
      nome: 'SmartFarm Systems',
      logo: '🤖',
      descricao: 'Automação inteligente para estufas e sistemas de irrigação',
      website: 'https://smartfarm.com',
      categoria: 'Automação',
      destaque: false
    },
    {
      id: 6,
      nome: 'EcoSeed Bank',
      logo: '🌿',
      descricao: 'Banco de sementes nativas e preservação de biodiversidade',
      website: 'https://ecoseedbank.org',
      categoria: 'Conservação',
      destaque: false
    },
    {
      id: 7,
      nome: 'AgroFinance',
      logo: '💳',
      descricao: 'Crédito rural digital e seguros agrícolas inovadores',
      website: 'https://agrofinance.com',
      categoria: 'Finanças',
      destaque: true
    },
    {
      id: 8,
      nome: 'BioControl Labs',
      logo: '🧬',
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
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} transition-colors duration-300`}>
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
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-500 to-blue-600 bg-clip-text text-transparent">
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
                    ? (isDark
                        ? 'bg-cyan-400 text-gray-900 shadow-lg shadow-cyan-400/25'
                        : 'bg-green-500 text-white shadow-lg shadow-green-500/25')
                    : (isDark
                        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300')
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
                  <div className={`text-6xl mb-4 ${
                    parceiro.destaque ? 'animate-pulse' : ''
                  }`}>
                    {parceiro.logo}
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
