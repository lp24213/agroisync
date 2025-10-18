import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Check, Star, Zap, Shield, Users, CreditCard, Gift, 
  Brain, Globe, MessageCircle, Award, Target, BarChart3,
  Phone, ArrowRight, Sparkles, Rocket, DollarSign, Clock
} from 'lucide-react';
import CryptoHash from '../components/CryptoHash';
import paymentService from '../services/paymentService';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AgroisyncPlans = () => {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState('monthly'); // monthly, semiannual, annual
  const [paymentMethod, setPaymentMethod] = useState('card'); // card ou pix
  const [loading, setLoading] = useState(null); // ID do plano sendo processado
  
  const handleSubscribe = async (plan, paymentMethod = 'pix') => {
    try {
      setLoading(plan.name);
      // canonical slug for plan
      const slug = plan.slug || plan.id || (plan.name && plan.name.toLowerCase());

      // Verificar se está logado
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      if (!token) {
        // redirecionar para login e passar o plano selecionado como query param
        navigate(`/login?plan=${encodeURIComponent(slug)}`);
        return;
      }

      // Buscar perfil do usuário para validar CPF/CNPJ ou email
      const profileResp = await fetch(`${process.env.REACT_APP_API_BASE_URL || ''}/api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(r => r.json()).catch(() => null);

      const userProfile = profileResp && profileResp.success ? profileResp.data : null;
      const cpfCnpj = userProfile ? (userProfile.cpf || userProfile.cnpj) : null;
      if (!userProfile || (!userProfile.email && !cpfCnpj)) {
        toast.error('É necessário preencher E-mail ou CPF/CNPJ no seu perfil antes de assinar. Você será redirecionado para seu perfil.');
        navigate('/user/profile');
        return;
      }

      // Criar pagamento (PIX ou Boleto)
  console.log('💳 Criando checkout para plano:', slug);
  const result = await paymentService.createCheckoutSession(slug, billingCycle, paymentMethod);
      console.log('✅ Resultado do checkout:', result);
      
      // Se for cartão, redirecionar para página de cartão primeiro
      if (paymentMethod === 'credit_card') {
        // compute numeric amount preferring cents when available
        const basePrice = plan.price_cents ? (plan.price_cents / 100) : (typeof plan.price === 'number' ? plan.price : Number(plan.price));
        const amount = billingCycle === 'monthly' ? basePrice : billingCycle === 'semiannual' ? (plan.semiannualPrice ?? basePrice * 6) : (plan.annualPrice ?? basePrice * 12);
        navigate('/payment/credit-card', {
          state: {
            plan: plan.name,
            billingCycle: billingCycle,
            amount: amount
          }
        });
        return;
      }

      if (result.success) {
        // Mostrar modal com PIX ou Boleto
        if (result.paymentMethod === 'pix') {
          // Redirecionar para página de PIX com QR Code
          navigate('/payment/pix', {
            state: {
              qrCode: result.qrCode,
              qrCodeText: result.qrCodeText,
              amount: result.amount,
              txid: result.txid,
              expiresAt: result.expiresAt,
              plan: plan.name
            }
          });
        } else {
          // Redirecionar para página de Boleto
          navigate('/payment/boleto', {
            state: {
              barcode: result.barcode,
              barcodeNumber: result.barcodeNumber,
              pdfUrl: result.pdfUrl,
              amount: result.amount,
              dueDate: result.dueDate,
              plan: plan.name
            }
          });
        }
      } else {
        toast.error('Erro ao gerar pagamento');
      }
    } catch (error) {
      console.error('❌ Erro ao assinar plano:', error);
      console.error('❌ Detalhes do erro:', error.response?.data || error.message);
      toast.error(error.message || 'Erro ao processar assinatura');
    } finally {
      setLoading(null);
    }
  }

  const plans = [
    {
      name: 'Inicial',
      price: 9.90,
      semiannualPrice: 59.40, // 9.90 x 6 meses (sem desconto)
      annualPrice: 118.80, // 9.90 x 12 meses (sem desconto)
      annualPixPrice: 118.80, // Sem desconto no PIX para o inicial
      description: 'Ideal para quem está começando no agronegócio digital',
      features: [
        '🎁 3 DIAS DE TESTE GRÁTIS',
        '2 fretes por mês',
        '2 anúncios de produtos',
        'Suporte por e-mail',
        'Dashboard básico com relatórios simples',
        'Visibilidade padrão nas buscas'
      ],
      noDiscount: true,
      popular: false,
      trial: true,
      trialDays: 3,
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

  // plans carregados do backend (fonte canônica)
  const [remotePlans, setRemotePlans] = useState(null);

  useEffect(() => {
    let mounted = true;
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    const url = `${process.env.REACT_APP_API_BASE_URL || ''}/api/plans`;

    fetch(url, { headers: token ? { Authorization: `Bearer ${token}` } : {} })
      .then(r => {
        if (!r.ok) throw new Error('Resposta /api/plans não ok');
        return r.json();
      })
      .then(data => {
        if (!mounted) return;
        if (!data) return;
        // Normalize different possible shapes coming from backend
        // Possible shapes:
        // 1) { success: true, data: { plans: [...] } }
        // 2) { plans: [...] }
        // 3) { success: true, data: [...] }
        // 4) [...] (array)
        let list = null;
        if (data.success && data.data) {
          if (Array.isArray(data.data)) list = data.data;
          else if (Array.isArray(data.data.plans)) list = data.data.plans;
          else list = Object.values(data.data).flat();
        } else if (Array.isArray(data)) {
          list = data;
        } else if (Array.isArray(data.plans)) {
          list = data.plans;
        }

        if (list && Array.isArray(list)) {
          const normalize = p => {
            const priceMonthly = p.price_monthly ?? p.price ?? null;
            let price = null;
            if (typeof priceMonthly === 'number') price = priceMonthly;
            else if (typeof priceMonthly === 'string' && priceMonthly.trim() !== '') {
              const parsed = Number(priceMonthly.replace(',', '.'));
              if (!Number.isNaN(parsed)) price = parsed;
            }

            const price_cents = p.price_monthly_cents ?? p.price_cents ?? (price !== null ? Math.round(price * 100) : null);
            const semiannualPrice = p.price_6months ?? p.semiannualPrice ?? (price !== null ? price * 6 : null);
            const annualPrice = p.price_annual ?? p.annualPrice ?? (price !== null ? price * 12 : null);
            const features = Array.isArray(p.features) ? p.features : (typeof p.features === 'string' ? (() => { try { return JSON.parse(p.features); } catch { return []; } })() : []);

            return {
              slug: p.slug || p.id || (p.name && p.name.toLowerCase()),
              name: p.name || p.id || 'Plano',
              price: price !== null ? price : p.price,
              price_cents: price_cents,
              semiannualPrice: p.price_6months ?? p.semiannualPrice ?? null,
              semiannualPrice_cents: p.price_6months_cents ?? null,
              annualPrice: annualPrice,
              annualPrice_cents: p.price_annual_cents ?? null,
              annualPixPrice: p.annualPixPrice ?? p.annual_pix_price ?? null,
              noDiscount: p.noDiscount || p.noDiscount === true || p.no_discount || false,
              features,
              product_limit: p.product_limit,
              freight_limit: p.freight_limit,
              raw: p
            };
          };

          setRemotePlans(list.map(normalize));
        }
      })
      .catch(err => {
        // fallback: manter os planos locais definidos acima
        console.debug('Não foi possível carregar /api/plans, usando fallback local', err.message);
      });

    return () => {
      mounted = false;
    };
  }, []);

  // Usar planos remotos (se disponíveis) como fonte da verdade
  const displayPlans = remotePlans || plans;

  const centsToFloat = cents => (typeof cents === 'number' ? cents / 100 : null);

  const getPrice = plan => {
    // suporta planos vindos do backend com campos em centavos
    const price = plan.price_cents ? centsToFloat(plan.price_cents) : plan.price;
    const semi = plan.semiannualPrice_cents ? centsToFloat(plan.semiannualPrice_cents) : plan.semiannualPrice;
    const annual = plan.annualPrice_cents ? centsToFloat(plan.annualPrice_cents) : plan.annualPrice;
    const annualPix = plan.annualPixPrice_cents ? centsToFloat(plan.annualPixPrice_cents) : plan.annualPixPrice;

    if (plan.noDiscount) {
      if (billingCycle === 'semiannual') return semi;
      if (billingCycle === 'annual') return annual;
      return price;
    }
    if (billingCycle === 'semiannual') return semi || price * 6;
    if (billingCycle === 'annual') return paymentMethod === 'pix' ? (annualPix || annual) : annual || price * 12;
    return price;
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
            {displayPlans.map((plan, index) => (
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
                      {/* Precise badge when price_cents is available */}
                      {plan.price_cents && (
                        <div className='mt-2 flex items-center justify-center'>
                          <span className='rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700'>
                            Preço exato: R$ {formatBRL(plan.price_cents / 100)}
                          </span>
                        </div>
                      )}
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
                    onClick={() => handleSubscribe(plan, paymentMethod === 'card' ? 'credit_card' : paymentMethod)}
                    disabled={loading === plan.name}
                    whileHover={{ scale: loading === plan.name ? 1 : 1.05 }}
                    whileTap={{ scale: loading === plan.name ? 1 : 0.95 }}
                    className={`w-full rounded-lg px-6 py-3 font-semibold transition-all duration-300 ${
                      loading === plan.name
                        ? 'bg-gray-400 cursor-not-allowed'
                        : plan.popular
                          ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg hover:shadow-xl'
                          : plan.color === 'gold'
                            ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg hover:shadow-xl'
                            : plan.color === 'black'
                              ? 'bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-lg hover:shadow-xl'
                              : 'bg-gray-900 text-white hover:bg-gray-800'
                    }`}
                  >
                    <span className='flex items-center justify-center gap-2'>
                      {loading === plan.name ? 'Processando...' : 'Assinar Agora'}
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
