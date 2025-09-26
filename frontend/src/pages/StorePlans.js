import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Store, Package, Star, Zap } from 'lucide-react';

const StorePlans = () => {
  const [selectedPlan, setSelectedPlan] = useState('');

  const plans = [
    {
      id: 'basic',
      name: 'BÁSICO',
      icon: <Package size={32} />,
      price: '149,99',
      period: 'mês',
      description: 'Ideal para lojas iniciantes',
      features: [
        '1 Loja cadastrada',
        'Até 10 produtos',
        'Painel administrativo',
        'Suporte por email',
        'Relatórios básicos',
        'Integração com estoque'
      ],
      color: 'from-blue-500 to-blue-600',
      popular: false
    },
    {
      id: 'intermediate',
      name: 'INTERMEDIÁRIO',
      icon: <Store size={32} />,
      price: '259,99',
      period: 'mês',
      description: 'Para lojas em crescimento',
      features: [
        '1 Loja cadastrada',
        'Até 20 produtos',
        'Painel administrativo completo',
        'Suporte prioritário',
        'Relatórios avançados',
        'Integração com estoque',
        'Análise de vendas',
        'Promoções automáticas'
      ],
      color: 'from-purple-500 to-purple-600',
      popular: true
    },
    {
      id: 'premium',
      name: 'PREMIUM',
      icon: <Star size={32} />,
      price: '599,99',
      period: 'ano',
      description: 'Para lojas estabelecidas',
      features: [
        '1 Loja cadastrada',
        'Até 50 produtos',
        'Painel administrativo premium',
        'Suporte 24/7',
        'Relatórios completos',
        'Integração com estoque',
        'Análise de vendas avançada',
        'Promoções automáticas',
        'Marketing digital',
        'Consultoria especializada',
        'API personalizada'
      ],
      color: 'from-yellow-500 to-orange-500',
      popular: false
    }
  ];

  const handlePlanSelect = (planId) => {
    setSelectedPlan(planId);
  };

  const handleContinue = () => {
    if (selectedPlan) {
      // Redirecionar para o cadastro da loja com o plano selecionado
      window.location.href = `/signup/store?plan=${selectedPlan}`;
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem 1rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ maxWidth: '1200px', width: '100%' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '3rem' }}
        >
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '0.75rem 1.5rem',
            borderRadius: '50px',
            marginBottom: '1rem',
            backdropFilter: 'blur(10px)'
          }}>
            <Store size={24} style={{ color: 'white' }} />
            <span style={{ color: 'white', fontWeight: '600', fontSize: '1.1rem' }}>
              PLANOS PARA LOJAS
            </span>
          </div>
          
          <h1 style={{
            color: 'white',
            fontSize: '2.5rem',
            fontWeight: '700',
            marginBottom: '1rem',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}>
            Escolha o Plano Ideal para sua Loja
          </h1>
          
          <p style={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '1.2rem',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Como a <strong>Agrobiológica</strong>, cadastre sua loja e gerencie seus produtos com nossos planos especializados
          </p>
        </motion.div>

        {/* Plans Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '2rem',
          marginBottom: '3rem'
        }}>
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              style={{
                background: 'white',
                borderRadius: '20px',
                padding: '2rem',
                position: 'relative',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: selectedPlan === plan.id ? '3px solid #10b981' : '3px solid transparent',
                boxShadow: selectedPlan === plan.id 
                  ? '0 20px 40px rgba(16, 185, 129, 0.3)' 
                  : '0 10px 30px rgba(0, 0, 0, 0.1)',
                transform: selectedPlan === plan.id ? 'translateY(-5px)' : 'translateY(0)'
              }}
              onClick={() => handlePlanSelect(plan.id)}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div style={{
                  position: 'absolute',
                  top: '-10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  color: 'white',
                  padding: '0.5rem 1.5rem',
                  borderRadius: '20px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)'
                }}>
                  <Zap size={16} style={{ marginRight: '0.5rem', display: 'inline' }} />
                  MAIS POPULAR
                </div>
              )}

              {/* Plan Header */}
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '80px',
                  height: '80px',
                  background: `linear-gradient(135deg, ${plan.color})`,
                  borderRadius: '20px',
                  marginBottom: '1rem',
                  color: 'white'
                }}>
                  {plan.icon}
                </div>
                
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: '#1f2937',
                  marginBottom: '0.5rem'
                }}>
                  {plan.name}
                </h3>
                
                <p style={{
                  color: '#6b7280',
                  fontSize: '1rem',
                  marginBottom: '1rem'
                }}>
                  {plan.description}
                </p>

                <div style={{ marginBottom: '1rem' }}>
                  <span style={{
                    fontSize: '3rem',
                    fontWeight: '800',
                    color: '#1f2937',
                    lineHeight: '1'
                  }}>
                    R$ {plan.price}
                  </span>
                  <span style={{
                    color: '#6b7280',
                    fontSize: '1rem',
                    marginLeft: '0.5rem'
                  }}>
                    /{plan.period}
                  </span>
                </div>
              </div>

              {/* Features */}
              <div style={{ marginBottom: '2rem' }}>
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    marginBottom: '0.75rem',
                    padding: '0.5rem 0'
                  }}>
                    <Check size={20} style={{ color: '#10b981', flexShrink: 0 }} />
                    <span style={{
                      color: '#374151',
                      fontSize: '1rem',
                      lineHeight: '1.5'
                    }}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {/* Select Button */}
              <button
                style={{
                  width: '100%',
                  padding: '1rem',
                  background: selectedPlan === plan.id 
                    ? 'linear-gradient(135deg, #10b981, #059669)' 
                    : 'linear-gradient(135deg, #6b7280, #4b5563)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: selectedPlan === plan.id 
                    ? '0 8px 20px rgba(16, 185, 129, 0.4)' 
                    : '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}
                onClick={() => handlePlanSelect(plan.id)}
              >
                {selectedPlan === plan.id ? '✓ SELECIONADO' : 'SELECIONAR PLANO'}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={{ textAlign: 'center' }}
        >
          <button
            onClick={handleContinue}
            disabled={!selectedPlan}
            style={{
              background: selectedPlan 
                ? 'linear-gradient(135deg, #10b981, #059669)' 
                : 'linear-gradient(135deg, #9ca3af, #6b7280)',
              color: 'white',
              border: 'none',
              padding: '1.25rem 3rem',
              borderRadius: '15px',
              fontSize: '1.2rem',
              fontWeight: '700',
              cursor: selectedPlan ? 'pointer' : 'not-allowed',
              transition: 'all 0.3s ease',
              boxShadow: selectedPlan 
                ? '0 10px 25px rgba(16, 185, 129, 0.4)' 
                : '0 4px 12px rgba(0, 0, 0, 0.1)',
              opacity: selectedPlan ? 1 : 0.6
            }}
          >
            CONTINUAR CADASTRO DA LOJA
          </button>
          
          {!selectedPlan && (
            <p style={{
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '1rem',
              marginTop: '1rem'
            }}>
              Selecione um plano para continuar
            </p>
          )}
        </motion.div>

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          style={{ textAlign: 'center', marginTop: '2rem' }}
        >
          <button
            onClick={() => window.history.back()}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              padding: '0.75rem 2rem',
              borderRadius: '10px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)'
            }}
          >
            ← Voltar para Seleção de Tipo
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default StorePlans;
