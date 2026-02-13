import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { 
  Check, Star, Zap, Shield, Users, CreditCard, Gift, 
  Brain, Globe, MessageCircle, Award, Target, BarChart3,
  Phone, ArrowRight, Sparkles, DollarSign, Clock
} from 'lucide-react';
import CryptoHash from '../components/CryptoHash';
import paymentService from '../services/paymentService';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AgroisyncPlans = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState('monthly'); // monthly, semiannual, annual
  const [paymentMethod, setPaymentMethod] = useState('card'); // card ou pix
  const [loading, setLoading] = useState(null); // ID do plano sendo processado
  const [accountType, setAccountType] = useState('anunciante'); // comprador, freteiro, anunciante
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const type = params.get('type');
    if (type && ['comprador', 'freteiro', 'anunciante'].includes(type)) {
      setAccountType(type);
    }
  }, []);
  
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

  // ❌ REMOVIDO - Planos antigos por tipo de conta
  // Agora usamos apenas os 3 planos universais simples

  // 🔥 PLANOS REVOLUCIONÁRIOS - MATANDO A CONCORRÊNCIA!
  // Planos com features traduzidas
  const originalPlans = useMemo(() => [
    {
      name: 'Gratuito',
      slug: 'gratuito',
      price: 0,
      semiannualPrice: 0,
      annualPrice: 0,
      annualPixPrice: 0,
      description: t('plans.freeDescription') || 'O melhor plano FREE do mercado!',
      features: [
        t('plans.free.feature1') || '✅ 5 FRETES por mês grátis',
        t('plans.free.feature2') || '✅ 5 PRODUTOS grátis',
        t('plans.free.feature3') || '✅ IA que calcula fretes automaticamente',
        t('plans.free.feature4') || '✅ Rastreamento GPS em tempo real',
        t('plans.free.feature5') || '✅ Chat ilimitado',
        t('plans.free.feature6') || '✅ Dashboard completo com analytics',
        t('plans.free.feature7') || '✅ Suporte via E-mail',
        t('plans.free.feature8') || '💰 Pós-pago (sem comissões, sem risco)',
        t('plans.free.feature9') || '🎁 API básica inclusa'
      ],
      noDiscount: true,
      popular: false,
      trial: false,
      trialDays: 0,
      color: 'green',
      icon: '🌱',
      target: t('plans.free.target') || 'Comece GRÁTIS e venda HOJE!'
    },
    {
      name: 'Profissional',
      slug: 'profissional',
      price: 29.90,
      semiannualPrice: 161.46,
      annualPrice: 299.04,
      annualPixPrice: 239.23,
      description: t('plans.professionalDescription') || 'Plano PRO completo por menos que um almoço!',
      features: [
        t('plans.professional.feature1') || '✅ FRETES ILIMITADOS',
        t('plans.professional.feature2') || '✅ PRODUTOS ILIMITADOS',
        t('plans.professional.feature3') || '✅ IA Premium que otimiza rotas e custos',
        t('plans.professional.feature4') || '✅ Matching automático em 2 minutos',
        t('plans.professional.feature5') || '✅ Rastreamento GPS avançado',
        t('plans.professional.feature6') || '✅ Previsão climática integrada',
        t('plans.professional.feature7') || '✅ Dashboard com insights automáticos',
        t('plans.professional.feature8') || '✅ Relatórios de desempenho em tempo real',
        t('plans.professional.feature9') || '✅ Selo "Verificado ✓"',
        t('plans.professional.feature10') || '✅ API completa sem limites',
        t('plans.professional.feature11') || '✅ Suporte prioritário (resposta até 1h)',
        t('plans.professional.feature12') || '💰 Plano pós-pago, sem comissão',
        t('plans.professional.feature13') || '🎁 Gestão automatizada com IA'
      ],
      popular: true,
      color: 'blue',
      icon: '💼',
      trial: false,
      trialDays: 0,
      target: t('plans.professional.target') || 'Profissionalize-se gastando MENOS!'
    },
    {
      name: 'Enterprise',
      slug: 'enterprise',
      price: 99.90,
      semiannualPrice: 539.46,
      annualPrice: 1019.04,
      annualPixPrice: 815.23,
      description: t('plans.enterpriseDescription') || 'Plano corporativo completo!',
      features: [
        t('plans.enterprise.feature1') || '✅ Tudo ilimitado (fretes, produtos e usuários)',
        t('plans.enterprise.feature2') || '✅ IA corporativa dedicada à sua empresa',
        t('plans.enterprise.feature3') || '✅ Loja virtual com domínio próprio',
        t('plans.enterprise.feature4') || '✅ White-label (sua marca na plataforma)',
        t('plans.enterprise.feature5') || '✅ API Enterprise + Webhooks',
        t('plans.enterprise.feature6') || '✅ Integração com ERP, CRM e marketplaces',
        t('plans.enterprise.feature7') || '✅ Até 20 usuários na conta',
        t('plans.enterprise.feature8') || '✅ Gerente de conta exclusivo',
        t('plans.enterprise.feature9') || '✅ Treinamento e consultoria personalizada',
        t('plans.enterprise.feature10') || '✅ Dashboard corporativo customizado',
        t('plans.enterprise.feature11') || '✅ SLA 99,9% garantido',
        t('plans.enterprise.feature12') || '✅ Suporte VIP 24/7',
        t('plans.enterprise.feature13') || '💰 Pós-pago e sem comissão sobre transações'
      ],
      popular: false,
      color: 'purple',
      icon: '🏢',
      trial: false,
      trialDays: 0,
      target: t('plans.enterprise.target') || 'Domine o mercado com tecnologia de ponta!'
    }
  ], [t]);

  // Usar os planos originais unificados (ignora seletor de tipo de conta)
  const plans = originalPlans;

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
    <>
      <Helmet>
        <title>Planos e Preços | AGROISYNC</title>
        <meta name="description" content="Escolha o plano ideal para seu agronegócio. Planos gratuitos e premium com recursos avançados de marketplace, fretes e IA." />
        <meta name="keywords" content="planos agronegócio, preços marketplace, planos fretes, assinatura agronegócio" />
        <meta property="og:title" content="Planos e Preços | AGROISYNC" />
        <meta property="og:description" content="Planos flexíveis para produtores, transportadores e compradores. Comece grátis!" />
        <link rel="canonical" href="https://agroisync.com/planos" />
      </Helmet>
      <div className='agro-plans-container' data-page='planos'>
      
      {/* AVISO: PLATAFORMA INTERMEDIADORA */}
      <div style={{
        background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
        borderBottom: '3px solid #f59e0b',
        padding: '20px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <p style={{ fontSize: '15px', fontWeight: '600', color: '#92400e', marginBottom: '8px' }}>
            💎 PLANOS COM IA AVANÇADA
          </p>
          <p style={{ fontSize: '13px', color: '#78350f' }}>
            Escolha o plano ideal para o seu negócio e aproveite todos os recursos da plataforma.<br/>
            Planos pós-pagos, com segurança total e IA em todos os níveis.
          </p>
        </div>
      </div>
      
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
        <div className='absolute inset-0 bg-gradient-to-br from-purple-900/70 via-black/60 to-blue-900/30'></div>
        <div className='relative z-10 mx-auto max-w-5xl px-4 text-center'>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            style={{ 
              background: 'rgba(168, 85, 247, 0.15)',
              padding: '8px 20px',
              borderRadius: '30px',
              border: '2px solid rgba(168, 85, 247, 0.3)',
              marginBottom: '20px',
              display: 'inline-block'
            }}
          >
            <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#a855f7' }}>
              💎 PLANOS COM IA AVANÇADA
            </span>
          </motion.div>

          <motion.h1
            className='mb-6 text-7xl font-bold'
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #a855f7 50%, #3b82f6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              lineHeight: '1.2'
            }}
          >
            💼 {t('plans.heroTitle')}
          </motion.h1>
          <motion.p
            className='mb-8 text-xl text-white/90'
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ maxWidth: '750px', margin: '0 auto 2rem', lineHeight: '1.6' }}
          >
            {t('plans.heroSubtitle')}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{ marginBottom: '2rem', display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0, 0, 0, 0.4)', padding: '10px 18px', borderRadius: '30px', backdropFilter: 'blur(10px)' }}>
              <span style={{ fontSize: '20px' }}>🎁</span>
              <span style={{ color: '#fff', fontWeight: '600', fontSize: '14px' }}>{t('plans.freePlanAvailable')}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0, 0, 0, 0.4)', padding: '10px 18px', borderRadius: '30px', backdropFilter: 'blur(10px)' }}>
              <span style={{ fontSize: '20px' }}>🤖</span>
              <span style={{ color: '#fff', fontWeight: '600', fontSize: '14px' }}>{t('plans.aiIncludedAll')}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0, 0, 0, 0.4)', padding: '10px 18px', borderRadius: '30px', backdropFilter: 'blur(10px)' }}>
              <span style={{ fontSize: '20px' }}>💰</span>
              <span style={{ color: '#fff', fontWeight: '600', fontSize: '14px' }}>0% Comissão</span>
            </div>
          </motion.div>

          <motion.div
            className='flex justify-center gap-4 flex-wrap'
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <button 
              onClick={() => window.scrollTo({ top: 900, behavior: 'smooth' })}
              style={{
                background: 'linear-gradient(135deg, #a855f7 0%, #8b5cf6 100%)',
                padding: '16px 36px',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                borderRadius: '12px',
                boxShadow: '0 10px 30px rgba(168, 85, 247, 0.4)',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            >
              🚀 {t('plans.viewPlansBelow')}
            </button>
            <button 
              onClick={() => window.location.href = 'https://wa.me/5565999999999'}
              style={{
                padding: '16px 36px',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.15)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                backdropFilter: 'blur(10px)',
                color: '#fff',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.25)';
                e.target.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                e.target.style.transform = 'scale(1)';
              }}
            >
              📞 {t('plans.talkToSales')}
            </button>
          </motion.div>
        </div>
      </section>

      {/* Controles de Billing e Pagamento */}
      <section className='bg-gray-50 py-12'>
        <div className='mx-auto max-w-6xl px-4'>
          {/* Seletor de Tipo de Conta - OCULTO (usando planos unificados) */}
          <div className='mb-8 hidden justify-center'>
            <div className='inline-flex rounded-lg bg-white p-1 shadow-md'>
              <button
                onClick={() => setAccountType('comprador')}
                className={`flex items-center gap-2 rounded-md px-6 py-3 text-sm font-semibold transition-all ${
                  accountType === 'comprador'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span>🛒</span>
                Comprador
              </button>
              <button
                onClick={() => setAccountType('freteiro')}
                className={`flex items-center gap-2 rounded-md px-6 py-3 text-sm font-semibold transition-all ${
                  accountType === 'freteiro'
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span>🚛</span>
                Freteiro
              </button>
              <button
                onClick={() => setAccountType('anunciante')}
                className={`flex items-center gap-2 rounded-md px-6 py-3 text-sm font-semibold transition-all ${
                  accountType === 'anunciante'
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span>📦</span>
                Anunciante
              </button>
            </div>
          </div>

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
              { icon: Gift, title: 'Pós-pago com total controle', desc: 'Total controle financeiro' }
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

      {/* LEADS & IMPULSIONAMENTO */}
      <section className='bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 py-16'>
        <div className='mx-auto max-w-6xl px-4'>
          <div className='mb-12 text-center'>
            <motion.h2 
              className='mb-4 text-4xl font-bold text-gray-900'
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              🎯 LEADS & IMPULSIONAMENTO DE ANÚNCIOS
            </motion.h2>
            <motion.p 
              className='text-xl text-gray-700'
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              💡 Serviço adicional separado dos planos principais.<br/>
              Ideal para produtores, transportadores e empresas que desejam impulsionar visibilidade e vendas dentro da plataforma.
            </motion.p>
          </div>

          <div className='grid grid-cols-1 gap-8 lg:grid-cols-2 mb-12'>
            {/* Planos de Leads */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className='rounded-2xl bg-white p-8 shadow-xl'
            >
              <h3 className='mb-6 text-2xl font-bold text-gray-900'>
                📈 Planos de Leads (Captação Direta)
              </h3>
              <div className='mb-6 overflow-x-auto'>
                <table className='w-full border-collapse'>
                  <thead>
                    <tr className='bg-gray-100'>
                      <th className='border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-900'>Pacote</th>
                      <th className='border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-900'>Leads/Mês</th>
                      <th className='border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-900'>Valor</th>
                      <th className='border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-900'>Tipo</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className='border border-gray-300 px-4 py-3 text-sm font-medium'>Básico</td>
                      <td className='border border-gray-300 px-4 py-3 text-sm'>até 50 qualificados</td>
                      <td className='border border-gray-300 px-4 py-3 text-sm font-bold text-green-600'>R$ 49,90</td>
                      <td className='border border-gray-300 px-4 py-3 text-sm text-gray-600'>Pós-pago</td>
                    </tr>
                    <tr className='bg-blue-50'>
                      <td className='border border-gray-300 px-4 py-3 text-sm font-medium'>Avançado</td>
                      <td className='border border-gray-300 px-4 py-3 text-sm'>até 200</td>
                      <td className='border border-gray-300 px-4 py-3 text-sm font-bold text-green-600'>R$ 149,90</td>
                      <td className='border border-gray-300 px-4 py-3 text-sm text-gray-600'>Pós-pago</td>
                    </tr>
                    <tr>
                      <td className='border border-gray-300 px-4 py-3 text-sm font-medium'>Profissional</td>
                      <td className='border border-gray-300 px-4 py-3 text-sm'>até 500</td>
                      <td className='border border-gray-300 px-4 py-3 text-sm font-bold text-green-600'>R$ 299,90</td>
                      <td className='border border-gray-300 px-4 py-3 text-sm text-gray-600'>Pós-pago</td>
                    </tr>
                    <tr className='bg-purple-50'>
                      <td className='border border-gray-300 px-4 py-3 text-sm font-medium'>Corporativo</td>
                      <td className='border border-gray-300 px-4 py-3 text-sm'>ilimitado</td>
                      <td className='border border-gray-300 px-4 py-3 text-sm font-bold text-purple-600'>Sob consulta</td>
                      <td className='border border-gray-300 px-4 py-3 text-sm text-gray-600'>Pós-pago</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <ul className='space-y-2 text-sm text-gray-700'>
                <li className='flex items-start gap-2'>
                  <Check className='h-5 w-5 flex-shrink-0 text-green-500 mt-0.5' />
                  <span>Leads filtrados por região, categoria e tipo de produto</span>
                </li>
                <li className='flex items-start gap-2'>
                  <Check className='h-5 w-5 flex-shrink-0 text-green-500 mt-0.5' />
                  <span>Envio automático via dashboard</span>
                </li>
                <li className='flex items-start gap-2'>
                  <Check className='h-5 w-5 flex-shrink-0 text-green-500 mt-0.5' />
                  <span>Atualização em tempo real</span>
                </li>
                <li className='flex items-start gap-2'>
                  <Check className='h-5 w-5 flex-shrink-0 text-green-500 mt-0.5' />
                  <span>Garantia de qualidade e verificação automática</span>
                </li>
                <li className='flex items-start gap-2'>
                  <Check className='h-5 w-5 flex-shrink-0 text-green-500 mt-0.5' />
                  <span>Pagamento apenas após confirmação de entrega</span>
                </li>
              </ul>
            </motion.div>

            {/* Planos de Impulsionamento */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className='rounded-2xl bg-white p-8 shadow-xl'
            >
              <h3 className='mb-6 text-2xl font-bold text-gray-900'>
                📢 Planos de Impulsionamento de Anúncios
              </h3>
              <div className='mb-6 space-y-4'>
                {[
                  { name: 'Start', duration: '7 dias', price: 39.90, color: 'blue' },
                  { name: 'Turbo', duration: '15 dias', price: 89.90, color: 'green', popular: true },
                  { name: 'Pro+', duration: '30 dias', price: 149.90, color: 'purple' },
                  { name: 'Enterprise Boost', duration: 'Contínuo + destaque', price: 'Sob consulta', color: 'orange' }
                ].map((plan, idx) => (
                  <div key={idx} className={`rounded-lg border-2 p-4 ${plan.popular ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50'}`}>
                    <div className='flex items-center justify-between'>
                      <div>
                        <h4 className='font-bold text-gray-900'>{plan.name}</h4>
                        <p className='text-sm text-gray-600'>{plan.duration}</p>
                      </div>
                      <div className='text-right'>
                        <div className={`text-lg font-bold ${plan.price === 'Sob consulta' ? 'text-orange-600' : 'text-green-600'}`}>
                          {typeof plan.price === 'number' ? `R$ ${plan.price.toFixed(2).replace('.', ',')}` : plan.price}
                        </div>
                        <p className='text-xs text-gray-500'>Pós-pago</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className='rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white'>
                <h4 className='mb-2 font-bold'>💡 Seus anúncios ganham destaque automático:</h4>
                <ul className='space-y-1 text-sm'>
                  <li>✓ Posição premium nos resultados de busca</li>
                  <li>✓ Destaque no topo das categorias</li>
                  <li>✓ Aumento direto de visualizações e cliques</li>
                  <li>✓ Relatórios de alcance e performance</li>
                </ul>
              </div>
            </motion.div>
          </div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 text-center'
          >
            <button
              onClick={() => navigate('/contato?service=leads')}
              className='rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl'
            >
              🚀 Impulsione seus anúncios e receba leads qualificados agora!
            </button>
            <button
              onClick={() => navigate('/contato?service=leads')}
              className='rounded-xl bg-gradient-to-r from-green-600 to-green-700 px-6 py-4 font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl'
            >
              📈 Capte novos clientes todos os dias com o Agroisync Leads.
            </button>
            <button
              onClick={() => navigate('/contato?service=boost')}
              className='rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4 font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl'
            >
              💼 Seus anúncios no topo — mais visibilidade, mais vendas.
            </button>
            <button
              onClick={() => navigate('/contato?service=all')}
              className='rounded-xl bg-gradient-to-r from-orange-600 to-red-600 px-6 py-4 font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl'
            >
              🌾 IA, automação e leads em tempo real — ative agora!
            </button>
          </motion.div>
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
                <Gift className='mx-auto mb-3 h-8 w-8 text-white' />
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
    </>
  );
};

export default AgroisyncPlans;
