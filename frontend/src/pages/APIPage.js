// 🔑 PÁGINA DE VENDA DE API - AGROISYNC
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Code, Zap, Shield, TrendingUp, Check, Key, Book, DollarSign } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getApiUrl } from '../config/constants';
import { useNavigate } from 'react-router-dom';

const APIPage = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState('pro');

  const apiPlans = [
    {
      id: 'basic',
      name: 'API Basic',
      price: 49.90,
      annualPrice: 499.00,
      description: 'Ideal para pequenos projetos e testes',
      icon: '🌱',
      color: 'green',
      limits: {
        perMinute: 60,
        perDay: 10000,
        perMonth: 300000
      },
      features: [
        '✅ 60 requisições/minuto',
        '✅ 10.000 requisições/dia',
        '✅ 300.000 requisições/mês',
        '✅ Acesso a endpoints públicos',
        '✅ Documentação completa',
        '✅ Suporte por e-mail',
        '✅ 99% uptime garantido',
        '❌ Webhooks',
        '❌ Prioridade nas requisições'
      ]
    },
    {
      id: 'pro',
      name: 'API Pro',
      price: 149.90,
      annualPrice: 1499.00,
      description: 'Para aplicações profissionais',
      icon: '💼',
      color: 'blue',
      popular: true,
      limits: {
        perMinute: 300,
        perDay: 100000,
        perMonth: 3000000
      },
      features: [
        '✅ 300 requisições/minuto',
        '✅ 100.000 requisições/dia',
        '✅ 3.000.000 requisições/mês',
        '✅ Todos os endpoints disponíveis',
        '✅ Webhooks inclusos',
        '✅ Prioridade nas requisições',
        '✅ Dashboard de métricas',
        '✅ Suporte prioritário (24h)',
        '✅ 99.5% uptime garantido'
      ]
    },
    {
      id: 'enterprise',
      name: 'API Enterprise',
      price: 499.90,
      annualPrice: 4999.00,
      description: 'Ilimitado com SLA e suporte dedicado',
      icon: '🏢',
      color: 'purple',
      limits: {
        perMinute: 1000,
        perDay: 1000000,
        perMonth: 'Ilimitado'
      },
      features: [
        '✅ 1.000 requisições/minuto',
        '✅ 1.000.000 requisições/dia',
        '✅ ILIMITADO por mês',
        '✅ Todos os endpoints + exclusivos',
        '✅ Webhooks avançados',
        '✅ Máxima prioridade',
        '✅ White-label disponível',
        '✅ Gerente de conta dedicado',
        '✅ SLA 99.9% com compensação',
        '✅ Suporte 24/7 VIP',
        '✅ Infraestrutura dedicada'
      ]
    }
  ];

  const handlePurchase = async (plan) => {
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    
    if (!token) {
      toast.error('Faça login para adquirir acesso à API');
      navigate('/login?redirect=/api');
      return;
    }

    try {
      const response = await fetch(`${getApiUrl('')}/api-keys/create`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          plan_type: plan.id,
          price: plan.price
        })
      });

      const data = await response.json();
      
      if (data.success) {
        // Mostrar API Key UMA VEZ
        alert(`🔑 SUA API KEY (guarde com segurança!):\n\n${data.apiKey}\n\n⚠️ Esta chave NÃO será mostrada novamente!`);
        toast.success('API Key criada! Aguardando pagamento...');
        navigate('/user-dashboard?tab=api');
      } else {
        toast.error(data.error || 'Erro ao criar API Key');
      }
    } catch (error) {
      console.error('Error purchasing API:', error);
      toast.error('Erro ao processar compra');
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-blue-50'>
      {/* Hero */}
      <section className='relative py-20 px-4 overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-br from-green-900/10 to-blue-900/10'></div>
        <div className='relative container mx-auto text-center max-w-4xl'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className='inline-block mb-4 px-4 py-2 bg-green-100 text-green-800 rounded-full font-bold text-sm'>
              🚀 API Agroisync
            </div>
            <h1 className='text-5xl font-bold text-gray-900 mb-6'>
              Integre o <span className='text-green-600'>Maior Marketplace</span><br/>
              do Agronegócio na Sua Aplicação
            </h1>
            <p className='text-xl text-gray-600 mb-8 max-w-2xl mx-auto'>
              Acesse dados de fretes, produtos, cotações e mais. API REST completa, segura e escalável.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Benefícios */}
      <section className='py-16 px-4'>
        <div className='container mx-auto max-w-6xl'>
          <div className='grid md:grid-cols-4 gap-6 mb-16'>
            {[
              { icon: <Zap />, title: 'Ultra Rápido', desc: 'Respostas em < 100ms' },
              { icon: <Shield />, title: 'Seguro', desc: 'JWT + HTTPS + Rate Limit' },
              { icon: <TrendingUp />, title: 'Escalável', desc: 'Cloudflare Workers' },
              { icon: <Book />, title: 'Documentado', desc: 'Docs completas + exemplos' }
            ].map((benefit, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className='bg-white rounded-xl p-6 shadow-lg text-center'
              >
                <div className='mb-4 text-green-600'>{React.cloneElement(benefit.icon, { size: 40 })}</div>
                <h3 className='font-bold text-gray-900 mb-2'>{benefit.title}</h3>
                <p className='text-sm text-gray-600'>{benefit.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Planos */}
          <h2 className='text-3xl font-bold text-center text-gray-900 mb-12'>
            💰 Escolha Seu Plano de API
          </h2>
          
          <div className='grid md:grid-cols-3 gap-8'>
            {apiPlans.map((plan, i) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className={`bg-white rounded-2xl overflow-hidden shadow-xl ${
                  plan.popular ? 'ring-4 ring-green-500 relative' : ''
                }`}
              >
                {plan.popular && (
                  <div className='absolute top-0 right-0 bg-green-500 text-white px-4 py-1 text-xs font-bold rounded-bl-xl'>
                    MAIS POPULAR
                  </div>
                )}
                
                <div className='p-8'>
                  <div className='text-4xl mb-4'>{plan.icon}</div>
                  <h3 className='text-2xl font-bold text-gray-900 mb-2'>{plan.name}</h3>
                  <p className='text-gray-600 mb-6'>{plan.description}</p>
                  
                  <div className='mb-6'>
                    <span className='text-4xl font-bold text-gray-900'>R$ {plan.price}</span>
                    <span className='text-gray-600'>/mês</span>
                    <p className='text-sm text-green-600 font-semibold mt-1'>
                      ou R$ {plan.annualPrice}/ano (economize 17%)
                    </p>
                  </div>

                  <div className='mb-6 space-y-2'>
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className='flex items-start gap-2 text-sm'>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => handlePurchase(plan)}
                    className={`w-full py-3 rounded-xl font-bold text-white transition-all ${
                      plan.popular
                        ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg'
                        : 'bg-gray-800 hover:bg-gray-900'
                    }`}
                  >
                    🚀 Adquirir Agora
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Endpoints disponíveis */}
      <section className='py-16 px-4 bg-gray-900 text-white'>
        <div className='container mx-auto max-w-4xl'>
          <h2 className='text-3xl font-bold text-center mb-12'>📚 Endpoints Disponíveis</h2>
          
          <div className='grid gap-4'>
            {[
              { method: 'GET', endpoint: '/api/products', desc: 'Listar produtos' },
              { method: 'GET', endpoint: '/api/products/:id', desc: 'Detalhes do produto' },
              { method: 'GET', endpoint: '/api/freights', desc: 'Listar fretes disponíveis' },
              { method: 'GET', endpoint: '/api/freights/:id', desc: 'Detalhes do frete' },
              { method: 'GET', endpoint: '/api/cotacoes', desc: 'Cotações do agro' },
              { method: 'GET', endpoint: '/api/weather', desc: 'Dados climáticos' },
              { method: 'POST', endpoint: '/api/ai/chat', desc: 'IA Agroisync (somente Pro+)' },
              { method: 'POST', endpoint: '/api/webhooks/subscribe', desc: 'Registrar webhook (Enterprise)' }
            ].map((endpoint, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className='bg-gray-800 rounded-lg p-4 flex items-center gap-4 hover:bg-gray-700 transition-colors'
              >
                <span className={`px-3 py-1 rounded font-bold text-xs ${
                  endpoint.method === 'GET' ? 'bg-green-600' : 'bg-blue-600'
                }`}>
                  {endpoint.method}
                </span>
                <code className='flex-1 font-mono text-green-400'>{endpoint.endpoint}</code>
                <span className='text-gray-400 text-sm'>{endpoint.desc}</span>
              </motion.div>
            ))}
          </div>

          <div className='mt-12 text-center'>
            <a
              href='/api/docs'
              className='inline-block px-8 py-3 bg-white text-gray-900 rounded-xl font-bold hover:bg-gray-100 transition-colors'
            >
              📖 Ver Documentação Completa
            </a>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className='py-20 px-4 bg-gradient-to-br from-green-600 to-blue-600 text-white'>
        <div className='container mx-auto max-w-3xl text-center'>
          <h2 className='text-4xl font-bold mb-6'>
            Pronto para integrar?
          </h2>
          <p className='text-xl mb-8 opacity-90'>
            Milhares de desenvolvedores já confiam na API Agroisync
          </p>
          <button
            onClick={() => handlePurchase(apiPlans.find(p => p.id === 'pro'))}
            className='px-10 py-4 bg-white text-green-600 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-2xl'
          >
            🚀 Começar Agora
          </button>
        </div>
      </section>
    </div>
  );
};

export default APIPage;

