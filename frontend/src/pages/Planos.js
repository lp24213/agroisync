import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Check, Star, ShoppingCart, Truck, Package, Leaf, Wrench, User, 
  Circle, Settings, BarChart3, Headphones, Zap, Shield, Globe
} from 'lucide-react';

const Planos = () => {
  const { isDark } = useTheme();
  const [selectedModule, setSelectedModule] = useState('loja');
  const [selectedPlan, setSelectedPlan] = useState(null);

  // Planos da Loja AgroSync
  const lojaPlans = [
    {
      id: 'loja-basico',
      name: 'Básico',
      price: 'R$ 0,00',
      period: 'Sempre grátis',
      description: 'Ideal para pequenos produtores e vendedores iniciantes',
      features: [
        'Até 3 anúncios ativos',
        'Perfil básico de vendedor',
        'Suporte por email',
        'Estatísticas básicas',
        'Acesso ao marketplace'
      ],
      limitations: [
        'Sem destaque nos anúncios',
        'Sem relatórios avançados',
        'Sem prioridade na busca'
      ],
      color: 'from-gray-500 to-gray-600',
      buttonColor: 'bg-gray-600 hover:bg-gray-700',
      popular: false
    },
    {
      id: 'loja-pro',
      name: 'Pro',
      price: 'R$ 99,00',
      period: 'por mês',
      description: 'Perfeito para produtores e vendedores ativos',
      features: [
        'Até 50 anúncios ativos',
        'Anúncios em destaque',
        'Relatórios básicos de vendas',
        'Suporte prioritário',
        'Perfil verificado',
        'Acesso a ferramentas de marketing',
        'Notificações de interesse'
      ],
      limitations: [
        'Limite de anúncios',
        'Sem relatórios avançados'
      ],
      color: 'from-green-500 to-green-600',
      buttonColor: 'bg-green-600 hover:bg-green-700',
      popular: true
    },
    {
      id: 'loja-enterprise',
      name: 'Enterprise',
      price: 'R$ 399,00',
      period: 'por mês',
      description: 'Para grandes produtores e empresas do agronegócio',
      features: [
        'Anúncios ilimitados',
        'Destaque premium',
        'Relatórios avançados',
        'Prioridade máxima na busca',
        'Suporte dedicado 24/7',
        'API de integração',
        'Dashboard personalizado',
        'Consultoria especializada',
        'Acesso antecipado a novos recursos'
      ],
      limitations: [],
      color: 'from-blue-600 to-purple-600',
      buttonColor: 'bg-blue-600 hover:bg-blue-700',
      popular: false
    }
  ];

  // Planos do AgroConecta
  const agroconectaPlans = [
    {
      id: 'agroconecta-basico',
      name: 'Básico',
      price: 'R$ 0,00',
      period: 'Sempre grátis',
      description: 'Para motoristas e transportadoras iniciantes',
      features: [
        'Até 5 fretes ativos/mês',
        'Perfil básico de transportador',
        'Acesso à listagem de fretes',
        'Suporte por email',
        'Notificações básicas'
      ],
      limitations: [
        'Sem destaque nas listagens',
        'Sem acesso ao chat direto',
        'Sem relatórios'
      ],
      color: 'from-orange-500 to-orange-600',
      buttonColor: 'bg-orange-600 hover:bg-orange-700',
      popular: false
    },
    {
      id: 'agroconecta-pro',
      name: 'Pro',
      price: 'R$ 149,00',
      period: 'por mês',
      description: 'Para transportadoras e motoristas profissionais',
      features: [
        'Até 100 fretes ativos/mês',
        'Destaque em listagens',
        'Chat direto com contratantes',
        'Relatórios de fretes',
        'Suporte prioritário',
        'Perfil verificado',
        'Notificações avançadas',
        'Histórico completo de fretes'
      ],
      limitations: [
        'Limite de fretes ativos',
        'Sem relatórios detalhados'
      ],
      color: 'from-blue-500 to-blue-600',
      buttonColor: 'bg-blue-600 hover:bg-blue-700',
      popular: true
    },
    {
      id: 'agroconecta-enterprise',
      name: 'Enterprise',
      price: 'R$ 499,00',
      period: 'por mês',
      description: 'Para grandes transportadoras e frotas',
      features: [
        'Fretes ilimitados',
        'Prioridade máxima nas buscas',
        'Relatórios detalhados',
        'Suporte dedicado 24/7',
        'API de integração',
        'Dashboard de frota',
        'Gestão de motoristas',
        'Consultoria logística',
        'Acesso antecipado a novos recursos'
      ],
      limitations: [],
      color: 'from-purple-600 to-indigo-600',
      buttonColor: 'bg-purple-600 hover:bg-purple-700',
      popular: false
    }
  ];

  const handlePlanSelection = (planId) => {
    setSelectedPlan(planId);
    // Aqui você implementaria a lógica de seleção de plano
    console.log('Plano selecionado:', planId);
  };

  const getCurrentPlans = () => {
    return selectedModule === 'loja' ? lojaPlans : agroconectaPlans;
  };

  const getModuleIcon = () => {
    return selectedModule === 'loja' ? <ShoppingCart className="w-6 h-6" /> : <Truck className="w-6 h-6" />;
  };

  const getModuleColor = () => {
    return selectedModule === 'loja' ? 'from-green-500 to-blue-600' : 'from-blue-500 to-purple-600';
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-green-900/20 to-blue-900/20">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent"
          >
            Planos AgroSync
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Escolha o plano ideal para impulsionar seu negócio no agronegócio brasileiro
          </motion.p>
        </div>
      </section>

      {/* Module Selection */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">
              Escolha seu Módulo
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Loja AgroSync */}
              <button
                onClick={() => setSelectedModule('loja')}
                className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                  selectedModule === 'loja'
                    ? 'border-green-500 bg-green-50 shadow-lg'
                    : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
                }`}
              >
                <div className="text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center text-white`}>
                    <ShoppingCart className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Loja AgroSync</h3>
                  <p className="text-gray-600 text-sm">
                    Marketplace completo para vender e comprar produtos agrícolas
                  </p>
                  {selectedModule === 'loja' && (
                    <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      <Check className="w-4 h-4 mr-1" />
                      Selecionado
                    </div>
                  )}
                </div>
              </button>

              {/* AgroConecta */}
              <button
                onClick={() => setSelectedModule('agroconecta')}
                className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                  selectedModule === 'agroconecta'
                    ? 'border-blue-500 bg-blue-50 shadow-lg'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                }`}
              >
                <div className="text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white`}>
                    <Truck className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">AgroConecta</h3>
                  <p className="text-gray-600 text-sm">
                    Plataforma de fretes para conectar produtores e transportadoras
                  </p>
                  {selectedModule === 'agroconecta' && (
                    <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      <Check className="w-4 h-4 mr-1" />
                      Selecionado
                    </div>
                  )}
                </div>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Plans Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Module Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r ${getModuleColor()} text-white mb-6`}>
              {getModuleIcon()}
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Planos {selectedModule === 'loja' ? 'Loja AgroSync' : 'AgroConecta'}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {selectedModule === 'loja' 
                ? 'Escolha o plano ideal para vender seus produtos agrícolas no maior marketplace do Brasil'
                : 'Selecione o plano perfeito para conectar sua transportadora aos melhores fretes do agronegócio'
              }
            </p>
          </motion.div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {getCurrentPlans().map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${
                  plan.popular ? 'border-green-500 scale-105' : 'border-gray-200'
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-green-500 text-white px-6 py-2 rounded-full text-sm font-bold flex items-center">
                      <Star className="w-4 h-4 mr-2 fill-current" />
                      Mais Popular
                    </div>
                  </div>
                )}

                <div className="p-8">
                  {/* Plan Header */}
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <div className="mb-4">
                      <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                      <span className="text-gray-600 ml-2">{plan.period}</span>
                    </div>
                    <p className="text-gray-600">{plan.description}</p>
                  </div>

                  {/* Features */}
                  <div className="mb-8">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-2" />
                      Incluído no plano:
                    </h4>
                    <ul className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start">
                          <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Limitations */}
                  {plan.limitations.length > 0 && (
                    <div className="mb-8">
                      <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                        <Package className="w-5 h-5 text-gray-500 mr-2" />
                        Limitações:
                      </h4>
                      <ul className="space-y-3">
                        {plan.limitations.map((limitation, limitationIndex) => (
                          <li key={limitationIndex} className="flex items-start">
                            <div className="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0">•</div>
                            <span className="text-gray-600">{limitation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* CTA Button */}
                  <button
                    onClick={() => handlePlanSelection(plan.id)}
                    className={`w-full py-4 px-6 rounded-xl text-white font-bold transition-all duration-300 hover:scale-105 ${plan.buttonColor}`}
                  >
                    {plan.price === 'R$ 0,00' ? 'Começar Grátis' : 'Escolher Plano'}
                  </button>

                  {/* Additional Info */}
                  {plan.price !== 'R$ 0,00' && (
                    <p className="text-center text-sm text-gray-500 mt-4">
                      Cancelamento a qualquer momento • Sem taxa de setup
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Comparação Detalhada
            </h2>
            <p className="text-xl text-gray-600">
              Veja todas as funcionalidades incluídas em cada plano
            </p>
          </motion.div>

          {/* Comparison Table */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Funcionalidade
                    </th>
                    {getCurrentPlans().map((plan) => (
                      <th key={plan.id} className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                        {plan.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {/* Anúncios/Fretes */}
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      {selectedModule === 'loja' ? 'Anúncios Ativos' : 'Fretes Ativos'}
                    </td>
                    {getCurrentPlans().map((plan) => (
                      <td key={plan.id} className="px-6 py-4 text-center text-sm text-gray-600">
                        {plan.id.includes('basico') 
                          ? (selectedModule === 'loja' ? '3' : '5/mês')
                          : plan.id.includes('pro')
                          ? (selectedModule === 'loja' ? '50' : '100/mês')
                          : 'Ilimitado'
                        }
                      </td>
                    ))}
                  </tr>

                  {/* Destaque */}
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      Destaque nas Listagens
                    </td>
                    {getCurrentPlans().map((plan) => (
                      <td key={plan.id} className="px-6 py-4 text-center text-sm text-gray-600">
                        {plan.id.includes('basico') ? (
                          <span className="text-red-500">✗</span>
                        ) : (
                          <span className="text-green-500">✓</span>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Relatórios */}
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      Relatórios
                    </td>
                    {getCurrentPlans().map((plan) => (
                      <td key={plan.id} className="px-6 py-4 text-center text-sm text-gray-600">
                        {plan.id.includes('basico') ? 'Básicos' : 
                         plan.id.includes('pro') ? 'Intermediários' : 'Avançados'}
                      </td>
                    ))}
                  </tr>

                  {/* Suporte */}
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      Suporte
                    </td>
                    {getCurrentPlans().map((plan) => (
                      <td key={plan.id} className="px-6 py-4 text-center text-sm text-gray-600">
                        {plan.id.includes('basico') ? 'Email' : 
                         plan.id.includes('pro') ? 'Prioritário' : 'Dedicado 24/7'}
                      </td>
                    ))}
                  </tr>

                  {/* Chat/API */}
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      {selectedModule === 'loja' ? 'API de Integração' : 'Chat Direto'}
                    </td>
                    {getCurrentPlans().map((plan) => (
                      <td key={plan.id} className="px-6 py-4 text-center text-sm text-gray-600">
                        {plan.id.includes('enterprise') ? (
                          <span className="text-green-500">✓</span>
                        ) : (
                          <span className="text-red-500">✗</span>
                        )}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-white mb-6"
          >
            Pronto para Impulsionar seu Negócio?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-green-100 mb-8"
          >
            Junte-se a milhares de produtores e transportadoras que já escolheram o AgroSync
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button className="px-8 py-4 bg-white text-green-600 font-bold rounded-xl hover:bg-gray-100 transition-colors duration-300">
              Começar Agora
            </button>
            <button className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-green-600 transition-colors duration-300">
              Falar com Especialista
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Planos;
