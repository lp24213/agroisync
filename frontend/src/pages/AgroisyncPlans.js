import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Check, Star, Zap, Shield, Users, CreditCard, Gift, 
  Brain, Globe, MessageCircle, Award, Target, BarChart3,
  Phone, ArrowRight, Sparkles, Rocket, DollarSign, Clock
} from 'lucide-react';
import CryptoHash from '../components/CryptoHash';

const AgroisyncPlans = () => {
  const [billingCycle, setBillingCycle] = useState('monthly'); // monthly, semiannual, annual
  const [paymentMethod, setPaymentMethod] = useState('card'); // card ou pix

  const plans = [
    {
      name: 'Inicial',
      price: 9.90,
      semiannualPrice: 59.40, // 9.90 x 6 meses (sem desconto)
      annualPrice: 118.80, // 9.90 x 12 meses (sem desconto)
      annualPixPrice: 118.80, // Sem desconto no PIX para o inicial
      description: 'Ideal para quem está começando no agronegócio digital',
      features: [
        '2 fretes por mês',
        '2 anúncios de produtos',
        'Suporte por e-mail',
        'Dashboard básico com relatórios simples',
        'Visibilidade padrão nas buscas'
      ],
      noDiscount: true,
      popular: false,
      color: 'green',
      icon: '🌱',
      target: 'Pequenos produtores testarem a plataforma'
    },
    {
      name: 'Profissional',
      price: 19.90,
      semiannualPrice: 113.43, // 19.90 x 6 meses - 5% = 119.40 - 5.97 = 113.43
      annualPrice: 214.92, // 19.90 x 12 meses - 10% = 238.80 - 23.88 = 214.92
      annualPixPrice: 191.04, // 19.90 x 12 meses - 20% = 238.80 - 47.76 = 191.04
      description: 'Para produtores e caminhoneiros em crescimento',
      features: [
        '10 fretes por mês',
        '10 anúncios de produtos',
        'Suporte prioritário (resposta em até 2h úteis)',
        'Dashboard avançado com gráficos e métricas',
        'Relatórios detalhados de desempenho',
        'Prioridade nas buscas e nos resultados regionais',
        'Acesso ao painel de cotação instantânea'
      ],
      popular: true,
      color: 'blue',
      icon: '🚜',
      target: 'Quem quer profissionalizar seus negócios'
    },
    {
      name: 'Empresarial',
      price: 79.90,
      semiannualPrice: 455.43, // 79.90 x 6 meses - 5% = 479.40 - 23.97 = 455.43
      annualPrice: 863.52, // 79.90 x 12 meses - 10% = 958.80 - 95.28 = 863.52
      annualPixPrice: 767.04, // 79.90 x 12 meses - 20% = 958.80 - 191.76 = 767.04
      description: 'Para transportadoras, cooperativas e empresas do agro',
      features: [
        '50 fretes por mês',
        '50 anúncios de produtos',
        'Suporte 24h (WhatsApp e e-mail)',
        'Dashboard e relatórios personalizados',
        'API de integração com ERPs e planilhas',
        'Notificações automáticas via WhatsApp e e-mail',
        'Destaque Premium nas buscas',
        'Acesso ao painel de parceiros e distribuidores'
      ],
      popular: false,
      color: 'purple',
      icon: '🏗️',
      target: 'Performance, automação e alcance nacional'
    },
    {
      name: 'Premium',
      price: 249.90,
      semiannualPrice: 1424.43, // 249.90 x 6 meses - 5% = 1499.40 - 74.97 = 1424.43
      annualPrice: 2699.52, // 249.90 x 12 meses - 10% = 2998.80 - 299.28 = 2699.52
      annualPixPrice: 2399.04, // 249.90 x 12 meses - 20% = 2998.80 - 599.76 = 2399.04
      description: 'Para grandes operações com foco em automação e escala',
      features: [
        'Fretes e anúncios ilimitados',
        'Loja personalizada com até 20 produtos',
        'Dashboard e relatórios avançados com IA',
        'API completa e integração com marketplaces externos',
        'Suporte 24/7 dedicado',
        'Gerente de conta exclusivo',
        'Notificações inteligentes com IA',
        'Treinamento personalizado e onboarding',
        'Selo de verificação "Empresa Ouro"'
      ],
      popular: false,
      color: 'gold',
      icon: '💎',
      target: 'Dominar o mercado agro digital com IA'
    },
    {
      name: 'Loja Ilimitada',
      price: 499.90,
      semiannualPrice: 2849.43, // 499.90 x 6 meses - 5% = 2999.40 - 149.97 = 2849.43
      annualPrice: 5399.52, // 499.90 x 12 meses - 10% = 5998.80 - 599.28 = 5399.52
      annualPixPrice: 4799.04, // 499.90 x 12 meses - 20% = 5998.80 - 1199.76 = 4799.04
      description: 'Operação completa com recursos empresariais e loja virtual expandida',
      features: [
        'Loja virtual com produtos ilimitados',
        'API e integrações corporativas completas',
        'Dashboard avançado + relatórios financeiros',
        'Integração com sistemas de pagamento e logística',
        'Equipe de suporte Premium 24/7',
        'Treinamento para equipes',
        'Consultoria estratégica de vendas no agro',
        'Selo "AGROiSYNC PRO"'
      ],
      popular: false,
      color: 'black',
      icon: '🏬',
      target: 'Grandes redes, cooperativas e empresas'
    }
  ];

  const getPrice = plan => {
    // Básico (14,99) sem descontos: apenas valores brutos
    if (plan.noDiscount) {
      if (billingCycle === 'semiannual') return plan.semiannualPrice;
      if (billingCycle === 'annual') return plan.annualPrice;
      return plan.price;
    }
    if (billingCycle === 'semiannual') {
      return plan.semiannualPrice;
    }
    if (billingCycle === 'annual') {
      return paymentMethod === 'pix' ? plan.annualPixPrice : plan.annualPrice;
    }
    return plan.price; // monthly
  };

  const getDiscount = plan => {
    if (plan.noDiscount) return 0;
    if (billingCycle === 'semiannual') {
      const totalPrice = plan.price * 6;
      return Math.round(((totalPrice - plan.semiannualPrice) / totalPrice) * 100);
    }
    if (billingCycle === 'annual') {
      const totalPrice = plan.price * 12;
      const finalPrice = paymentMethod === 'pix' ? plan.annualPixPrice : plan.annualPrice;
      return Math.round(((totalPrice - finalPrice) / totalPrice) * 100);
    }
    return 0; // monthly
  };

  const formatBRL = value => {
    try {
      return Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    } catch (e) {
      return value;
    }
  };

  return (
    <div className='agro-plans-container' data-page='planos'>
      {/* HERO COM IMAGEM DE CRESCIMENTO DE NEGÓCIOS */}
      <section
        className='relative flex min-h-screen items-center justify-center'
        style={{
          backgroundImage: `url('https://media.istockphoto.com/id/2177423222/pt/foto/e-commerce-concept-online-sale-business-growth-businessman-drawing-increasing-trend-graph-of.jpg?s=612x612&w=0&k=20&c=40Ax20aDzE5HNePAP3JdVjxo-uKkhhM3N0fP05crDCc=')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'scroll'
        }}
      >
        <div className='absolute inset-0 bg-black/50'></div>
        <div className='relative z-10 mx-auto max-w-4xl px-4 text-center'>
          <motion.h1
            className='mb-6 text-6xl font-bold text-white'
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            PLANOS AGROISYNC
          </motion.h1>
          <motion.p
            className='mb-8 text-2xl text-white/90'
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Escolha o plano ideal para acelerar seu crescimento no agronegócio
          </motion.p>
          <motion.div
            className='flex justify-center gap-4'
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <button className='rounded-lg bg-green-600 px-8 py-4 font-semibold text-white transition-colors hover:bg-green-700'>
              Escolher Plano
            </button>
            <button className='rounded-lg bg-white px-8 py-4 font-semibold text-green-600 transition-colors hover:bg-gray-100'>
              Falar com Vendas
            </button>
          </motion.div>
        </div>
      </section>

      {/* Controles de Billing e Pagamento */}
      <section className='bg-gray-50 py-12'>
        <div className='mx-auto max-w-6xl px-4'>
          <div className='mb-8 flex flex-col items-center justify-center gap-6 md:flex-row'>
            {/* Toggle Billing Cycle */}
            <div className='flex items-center gap-4'>
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  billingCycle === 'monthly' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                Mensal
              </button>

              <button
                onClick={() => setBillingCycle('semiannual')}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  billingCycle === 'semiannual'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                6 Meses
                {billingCycle === 'semiannual' && (
                  <span className='ml-2 rounded bg-blue-100 px-1 py-0.5 text-xs font-semibold text-blue-800'>-5%</span>
                )}
              </button>

              <button
                onClick={() => setBillingCycle('annual')}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  billingCycle === 'annual' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                Anual
                {billingCycle === 'annual' && (
                  <span className='ml-2 rounded bg-purple-100 px-1 py-0.5 text-xs font-semibold text-purple-800'>
                    -10%
                  </span>
                )}
              </button>
            </div>

            {/* Payment Method - Só aparece se for anual */}
            {billingCycle === 'annual' && (
              <div className='flex items-center gap-4'>
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 transition-colors ${
                    paymentMethod === 'card'
                      ? 'border-2 border-blue-300 bg-blue-100 text-blue-700'
                      : 'border-2 border-gray-200 bg-gray-100 text-gray-600'
                  }`}
                >
                  <CreditCard className='h-4 w-4' />
                  Cartão
                </button>
                <button
                  onClick={() => setPaymentMethod('pix')}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 transition-colors ${
                    paymentMethod === 'pix'
                      ? 'border-2 border-green-300 bg-green-100 text-green-700'
                      : 'border-2 border-gray-200 bg-gray-100 text-gray-600'
                  }`}
                >
                  <Zap className='h-4 w-4' />
                  PIX
                  {paymentMethod === 'pix' && (
                    <span className='rounded bg-green-200 px-1 py-0.5 text-xs font-semibold text-green-800'>-10%</span>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Planos */}
      <section className='bg-white py-16'>
        <div className='mx-auto max-w-7xl px-4'>
          <div className='grid grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-3'>
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative rounded-2xl border-2 bg-white shadow-lg transition-all duration-300 hover:shadow-xl ${
                  plan.popular ? 'scale-105 border-blue-500 ring-4 ring-blue-100' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {plan.popular && (
                  <div className='absolute -top-4 left-1/2 -translate-x-1/2 transform'>
                    <div className='flex items-center gap-1 rounded-full bg-blue-500 px-4 py-1 text-sm font-semibold text-white'>
                      <Star className='h-4 w-4 fill-current' />
                      + Popular
                    </div>
                  </div>
                )}

                <div className='p-8'>
                  {/* Header do Plano */}
                  <div className='mb-8 text-center'>
                    <div className='mb-4 text-4xl'>{plan.icon}</div>
                    <h3 className='mb-2 text-2xl font-bold text-gray-900'>{plan.name}</h3>
                    <p className='mb-4 text-gray-600'>{plan.description}</p>
                    <div className='rounded-lg bg-gray-50 p-3 text-sm text-gray-700'>
                      <span className='font-medium'>🟩 {plan.target}</span>
                    </div>

                    {/* Preço */}
                    <div className='mb-6'>
                      <div className='flex items-center justify-center gap-2'>
                        <span className='text-4xl font-bold text-gray-900'>R$ {formatBRL(getPrice(plan))}</span>
                        <span className='text-gray-500'>
                          {billingCycle === 'monthly' ? '/mês' : billingCycle === 'semiannual' ? '/6 meses' : '/ano'}
                        </span>
                      </div>
                      {getDiscount(plan) > 0 && (
                        <div className='mt-2 flex items-center justify-center gap-2'>
                          <span className='text-lg text-gray-400 line-through'>
                            R$ {formatBRL(billingCycle === 'semiannual' ? plan.price * 6 : plan.price * 12)}
                          </span>
                          <span className='rounded-full bg-green-100 px-2 py-1 text-sm font-semibold text-green-800'>
                            -{getDiscount(plan)}% desconto
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Features */}
                  <div className='mb-8 space-y-4'>
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className='flex items-start gap-3'>
                        <Check className='h-5 w-5 flex-shrink-0 text-green-500 mt-0.5' />
                        <span className='text-gray-700'>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Botão de Contratação */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-full rounded-lg px-6 py-3 font-semibold transition-all duration-300 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg hover:shadow-xl'
                        : plan.color === 'gold'
                          ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg hover:shadow-xl'
                          : plan.color === 'black'
                            ? 'bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-lg hover:shadow-xl'
                            : 'bg-gray-900 text-white hover:bg-gray-800'
                    }`}
                  >
                    <span className='flex items-center justify-center gap-2'>
                      Assinar Agora
                      <ArrowRight className='h-4 w-4' />
                    </span>
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Seção de Diferenciais */}
      <section className='bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 py-16'>
        <div className='mx-auto max-w-6xl px-4'>
          <div className='mb-12 text-center'>
            <motion.h2 
              className='mb-4 text-4xl font-bold text-white'
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              ⚙️ DIFERENCIAIS AGROISYNC
            </motion.h2>
            <motion.p 
              className='text-xl text-blue-200'
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Tecnologia de ponta para acelerar seu crescimento no agronegócio
            </motion.p>
          </div>

          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {[
              { icon: DollarSign, title: 'Planos competitivos', desc: 'Preços acessíveis para democratizar o agronegócio digital' },
              { icon: Brain, title: 'Cotações instantâneas com IA', desc: 'Tempo, rota e custo médio calculados automaticamente' },
              { icon: Target, title: 'Match inteligente', desc: 'Entre produtor, comprador e transportador' },
              { icon: BarChart3, title: 'Dashboards avançados', desc: 'Métricas de rentabilidade e histórico de vendas' },
              { icon: MessageCircle, title: 'Chat direto', desc: 'Com compradores e caminhoneiros' },
              { icon: Shield, title: 'Segurança total', desc: 'Validação de CPF/CNPJ e reputação' },
              { icon: Globe, title: 'Suporte multilíngue', desc: 'Português, Inglês, Espanhol, Mandarim' },
              { icon: Award, title: 'Ranqueamento transparente', desc: 'Sistema justo e transparente' },
              { icon: Sparkles, title: 'Recomendações inteligentes', desc: 'De anúncios e rotas com IA' },
              { icon: Gift, title: 'Zero comissão', desc: 'Sobre transações internas' }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className='group rounded-xl bg-white/10 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-white/20 hover:scale-105'
              >
                <div className='mb-4 flex items-center gap-3'>
                  <div className='flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/20'>
                    <benefit.icon className='h-6 w-6 text-blue-400' />
                  </div>
                  <h3 className='text-lg font-semibold text-white'>{benefit.title}</h3>
                </div>
                <p className='text-blue-200'>{benefit.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Seção Comparativa com Concorrentes */}
      <section className='bg-white py-16'>
        <div className='mx-auto max-w-6xl px-4'>
          <div className='mb-12 text-center'>
            <h2 className='mb-4 text-3xl font-bold text-gray-900'>💰 Preços Acessíveis</h2>
            <p className='text-lg text-gray-600'>Planos pensados para democratizar o agronegócio digital</p>
          </div>

          <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
            <div className='rounded-xl bg-green-50 p-8 text-center'>
              <div className='mb-4 text-4xl'>🌱</div>
              <h3 className='mb-2 text-xl font-bold text-green-800'>Plano Inicial</h3>
              <div className='mb-4 text-3xl font-bold text-green-600'>R$ 9,90</div>
              <p className='text-green-700'>Ideal para começar no agronegócio digital</p>
            </div>
            
            <div className='rounded-xl bg-blue-50 p-8 text-center'>
              <div className='mb-4 text-4xl'>🚜</div>
              <h3 className='mb-2 text-xl font-bold text-blue-800'>Plano Profissional</h3>
              <div className='mb-4 text-3xl font-bold text-blue-600'>R$ 19,90</div>
              <p className='text-blue-700'>Para produtores em crescimento</p>
            </div>
            
            <div className='rounded-xl bg-purple-50 p-8 text-center'>
              <div className='mb-4 text-4xl'>🏗️</div>
              <h3 className='mb-2 text-xl font-bold text-purple-800'>Plano Empresarial</h3>
              <div className='mb-4 text-3xl font-bold text-purple-600'>R$ 79,90</div>
              <p className='text-purple-700'>Para empresas e cooperativas</p>
            </div>
          </div>

          <div className='mt-8 text-center'>
            <div className='inline-flex items-center gap-2 rounded-full bg-green-100 px-6 py-3 text-green-800'>
              <Sparkles className='h-5 w-5' />
              <span className='font-semibold'>Preços justos e transparentes!</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className='bg-white py-16'>
        <div className='mx-auto max-w-4xl px-4'>
          <div className='mb-12 text-center'>
            <h2 className='mb-4 text-3xl font-bold text-gray-900'>Perguntas Frequentes</h2>
          </div>

          <div className='space-y-6'>
            <div className='rounded-lg bg-gray-50 p-6'>
              <h3 className='mb-2 text-lg font-semibold text-gray-900'>Posso mudar de plano a qualquer momento?</h3>
              <p className='text-gray-600'>
                Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento. As alterações são aplicadas
                imediatamente.
              </p>
            </div>

            <div className='rounded-lg bg-gray-50 p-6'>
              <h3 className='mb-2 text-lg font-semibold text-gray-900'>Como funcionam os descontos?</h3>
              <p className='text-gray-600'>
                Oferecemos 5% de desconto no plano semestral (6 meses), 10% de desconto no plano anual (12 meses) e 20%
                de desconto total quando você escolhe o plano anual com pagamento via PIX. O plano mensal não possui
                desconto.
              </p>
            </div>

            <div className='rounded-lg bg-gray-50 p-6'>
              <h3 className='mb-2 text-lg font-semibold text-gray-900'>
                O que acontece se eu exceder os limites do meu plano?
              </h3>
              <p className='text-gray-600'>
                Você será notificado quando estiver próximo do limite. Você pode fazer upgrade do plano ou adquirir
                créditos extras conforme necessário.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Seção Consultor WhatsApp */}
      <section className='bg-gradient-to-r from-green-600 via-green-700 to-green-800 py-16'>
        <div className='mx-auto max-w-4xl px-4 text-center'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className='rounded-2xl bg-white/10 p-8 backdrop-blur-sm'
          >
            <div className='mb-6'>
              <div className='mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/20'>
                <MessageCircle className='h-10 w-10 text-white' />
              </div>
              <h2 className='mb-4 text-3xl font-bold text-white'>
                Ainda em dúvida? Fale com nosso consultor pelo WhatsApp
              </h2>
              <p className='text-xl text-green-100'>
                Nossa equipe especializada está pronta para ajudar você a escolher o plano ideal para seu negócio
              </p>
            </div>

            <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className='rounded-xl bg-white/20 p-6 backdrop-blur-sm'
              >
                <Phone className='mx-auto mb-3 h-8 w-8 text-white' />
                <h3 className='mb-2 text-lg font-semibold text-white'>Suporte Imediato</h3>
                <p className='text-green-100'>Resposta em até 2 horas úteis</p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className='rounded-xl bg-white/20 p-6 backdrop-blur-sm'
              >
                <Users className='mx-auto mb-3 h-8 w-8 text-white' />
                <h3 className='mb-2 text-lg font-semibold text-white'>Consultoria Personalizada</h3>
                <p className='text-green-100'>Análise do seu perfil de negócio</p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className='rounded-xl bg-white/20 p-6 backdrop-blur-sm'
              >
                <Rocket className='mx-auto mb-3 h-8 w-8 text-white' />
                <h3 className='mb-2 text-lg font-semibold text-white'>Onboarding Gratuito</h3>
                <p className='text-green-100'>Treinamento completo incluído</p>
              </motion.div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className='mt-8 inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-lg font-semibold text-green-700 shadow-lg transition-all duration-300 hover:shadow-xl'
            >
              <MessageCircle className='h-6 w-6' />
              Falar com Consultor AGROISYNC
              <ArrowRight className='h-5 w-5' />
            </motion.button>

            <div className='mt-6 text-sm text-green-200'>
              <Clock className='mx-auto mb-2 h-5 w-5' />
              <p>Horário de atendimento: Segunda a Sexta, 8h às 18h</p>
            </div>
          </motion.div>
        </div>
      </section>
      <div className='mt-8 flex justify-center'>
        <CryptoHash pageName='plans' style={{ display: 'none' }} />
      </div>
    </div>
  );
};

export default AgroisyncPlans;
