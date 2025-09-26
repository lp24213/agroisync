import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, Shield, CheckCircle, Star, Zap } from 'lucide-react';

const Payment = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
  }, []);

  const plans = {
    free: {
      name: 'Gratuito',
      price: 'R$ 0',
      period: 'para sempre',
      features: [
        '✅ Até 5 produtos/fretes',
        '✅ Busca básica',
        '✅ Chat limitado (20 msgs/dia)',
        '✅ Suporte por email',
        '❌ Sem dados avançados',
        '❌ Sem relatórios'
      ],
      limitations: 'Acesso limitado aos recursos básicos'
    },
    pro: {
      name: 'Pro',
      price: 'R$ 29',
      period: 'por mês',
      features: [
        '✅ Produtos/fretes ilimitados',
        '✅ Busca avançada com filtros',
        '✅ Chat ilimitado',
        '✅ Relatórios detalhados',
        '✅ Dados de mercado',
        '✅ Suporte prioritário',
        '✅ API de integração'
      ],
      limitations: 'Acesso completo a todos os recursos'
    },
    enterprise: {
      name: 'Enterprise',
      price: 'R$ 99',
      period: 'por mês',
      features: [
        '✅ Tudo do Pro',
        '✅ Dashboard personalizado',
        '✅ Integração com ERPs',
        '✅ Suporte dedicado',
        '✅ Treinamento personalizado',
        '✅ SLA garantido',
        '✅ Backup automático'
      ],
      limitations: 'Solução completa para grandes empresas'
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    
    try {
      // Simular processamento de pagamento
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Atualizar usuário como pago
      const updatedUser = { ...user, isPaid: true, plan: selectedPlan };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      alert('✅ Pagamento processado com sucesso!');
      navigate('/user-dashboard', { replace: true });
    } catch (error) {
      alert('❌ Erro no processamento do pagamento');
    } finally {
      setLoading(false);
    }
  };

  const handleSkipPayment = () => {
    alert('ℹ️ Você pode pagar depois! Continuando com plano gratuito.');
    navigate('/user-dashboard', { replace: true });
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'var(--bg-gradient)',
      padding: '2rem 0'
    }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '3rem' }}
        >
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: '800', 
            marginBottom: '1rem',
            color: 'var(--text-primary)'
          }}>
            Escolha seu Plano
          </h1>
          <p style={{ 
            fontSize: '1.2rem', 
            color: 'var(--muted)',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Desbloqueie todo o potencial do AgroSync com nossos planos premium
          </p>
        </motion.div>

        {/* Planos */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '2rem',
          marginBottom: '3rem'
        }}>
          {Object.entries(plans).map(([key, plan]) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: key === 'pro' ? 0.2 : 0.4 }}
              style={{
                background: 'var(--card-bg)',
                padding: '2rem',
                borderRadius: '16px',
                border: `2px solid ${selectedPlan === key ? 'var(--accent)' : 'rgba(15, 15, 15, 0.05)'}`,
                position: 'relative',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onClick={() => setSelectedPlan(key)}
              whileHover={{ scale: 1.02 }}
            >
              {key === 'pro' && (
                <div style={{
                  position: 'absolute',
                  top: '-10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'var(--accent)',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  fontSize: '0.9rem',
                  fontWeight: '600'
                }}>
                  <Star size={16} style={{ marginRight: '0.5rem', display: 'inline' }} />
                  Mais Popular
                </div>
              )}

              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: '700', 
                  marginBottom: '0.5rem',
                  color: 'var(--text-primary)'
                }}>
                  {plan.name}
                </h3>
                <div style={{ marginBottom: '0.5rem' }}>
                  <span style={{ 
                    fontSize: '2.5rem', 
                    fontWeight: '800', 
                    color: 'var(--accent)'
                  }}>
                    {plan.price}
                  </span>
                  <span style={{ 
                    fontSize: '1rem', 
                    color: 'var(--muted)',
                    marginLeft: '0.5rem'
                  }}>
                    {plan.period}
                  </span>
                </div>
                <p style={{ 
                  fontSize: '0.9rem', 
                  color: 'var(--muted)',
                  fontStyle: 'italic'
                }}>
                  {plan.limitations}
                </p>
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {plan.features.map((feature, index) => (
                  <li key={index} style={{ 
                    padding: '0.5rem 0',
                    fontSize: '0.95rem',
                    color: 'var(--text-primary)'
                  }}>
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Botões de Ação */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          style={{ 
            display: 'flex', 
            gap: '1rem', 
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}
        >
          <button
            onClick={handlePayment}
            disabled={loading || selectedPlan === 'free'}
            style={{
              padding: '1rem 2rem',
              background: selectedPlan === 'free' ? 'var(--muted)' : 'var(--accent)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: selectedPlan === 'free' ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.3s ease'
            }}
          >
            {loading ? (
              <>
                <div style={{ 
                  width: '20px', 
                  height: '20px', 
                  border: '2px solid transparent', 
                  borderTop: '2px solid white', 
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                Processando...
              </>
            ) : (
              <>
                <CreditCard size={20} />
                Pagar Agora
              </>
            )}
          </button>

          <button
            onClick={handleSkipPayment}
            style={{
              padding: '1rem 2rem',
              background: 'transparent',
              color: 'var(--text-primary)',
              border: '2px solid var(--accent)',
              borderRadius: '12px',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.3s ease'
            }}
          >
            <Zap size={20} />
            Pular por Agora
          </button>
        </motion.div>

        {/* Informações de Segurança */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          style={{ 
            textAlign: 'center', 
            marginTop: '3rem',
            padding: '1.5rem',
            background: 'rgba(42, 127, 79, 0.1)',
            borderRadius: '12px',
            border: '1px solid rgba(42, 127, 79, 0.2)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Shield size={20} style={{ color: 'var(--accent)' }} />
            <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
              Pagamento 100% Seguro
            </span>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--muted)', margin: 0 }}>
            Processado pelo Stripe • Criptografia SSL • Cancelamento a qualquer momento
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Payment;
