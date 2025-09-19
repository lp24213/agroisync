import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import paymentService from '../services/paymentService';
import { 
  Check, 
  X, 
  Star, 
  Truck,
  Package,
  Coins,
  CreditCard,
  Wallet
} from 'lucide-react';

const PlansSystem = () => {
  const { user } = useAuth();
  const [selectedService, setSelectedService] = useState('agroconecta');
  const [selectedPlan, setSelectedPlan] = useState('premium');
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [isProcessing, setIsProcessing] = useState(false);

  const services = [
    {
      id: 'agroconecta',
      name: 'AgroConecta',
      description: 'Plataforma de transporte e logística',
      icon: <Truck size={24} />,
      color: 'var(--agro-primary-color)'
    },
    {
      id: 'loja',
      name: 'Loja',
      description: 'Marketplace de produtos agrícolas',
      icon: <Package size={24} />,
      color: 'var(--agro-secondary-color)'
    },
    {
      id: 'crypto',
      name: 'Crypto Agro',
      description: 'Pagamentos em criptomoedas',
      icon: <Coins size={24} />,
      color: 'var(--agro-gold)'
    }
  ];

  const plans = {
    agroconecta: [
      {
        id: 'basic',
        name: 'Básico',
        price: 29.90,
        period: 'mês',
        description: 'Ideal para pequenos produtores',
        features: [
          'Até 5 anúncios de carga',
          'Suporte por email',
          'Relatórios básicos',
          'Dashboard simples',
          'Integração básica'
        ],
        limitations: [
          'Sem suporte prioritário',
          'Sem API access',
          'Relatórios limitados'
        ],
        popular: false,
        color: 'var(--agro-secondary-color)'
      },
      {
        id: 'premium',
        name: 'Premium',
        price: 59.90,
        period: 'mês',
        description: 'Para produtores em crescimento',
        features: [
          'Até 20 anúncios de carga',
          'Suporte prioritário',
          'Relatórios avançados',
          'Dashboard completo',
          'API access',
          'Integração com ERPs',
          'Análise de rotas'
        ],
        limitations: [
          'Sem suporte 24/7',
          'Sem relatórios customizados'
        ],
        popular: true,
        color: 'var(--agro-primary-color)'
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        price: 149.90,
        period: 'mês',
        description: 'Para grandes operações',
        features: [
          'Anúncios ilimitados',
          'Suporte 24/7',
          'Relatórios customizados',
          'Dashboard personalizado',
          'API completa',
          'Integração completa',
          'Análise avançada',
          'Consultoria especializada'
        ],
        limitations: [],
        popular: false,
        color: 'var(--agro-gold)'
      }
    ],
    loja: [
      {
        id: 'basic',
        name: 'Básico',
        price: 39.90,
        period: 'mês',
        description: 'Para pequenos vendedores',
        features: [
          'Até 10 produtos',
          'Suporte por email',
          'Dashboard básico',
          'Relatórios simples',
          'Integração básica'
        ],
        limitations: [
          'Sem suporte prioritário',
          'Sem analytics avançado'
        ],
        popular: false,
        color: 'var(--agro-secondary-color)'
      },
      {
        id: 'premium',
        name: 'Premium',
        price: 79.90,
        period: 'mês',
        description: 'Para vendedores estabelecidos',
        features: [
          'Até 50 produtos',
          'Suporte prioritário',
          'Dashboard avançado',
          'Analytics completo',
          'API access',
          'Integração com ERPs',
          'Gestão de estoque'
        ],
        limitations: [
          'Sem suporte 24/7',
          'Sem dashboard customizado'
        ],
        popular: true,
        color: 'var(--agro-primary-color)'
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        price: 199.90,
        period: 'mês',
        description: 'Para grandes varejistas',
        features: [
          'Produtos ilimitados',
          'Suporte 24/7',
          'Dashboard personalizado',
          'Analytics customizado',
          'API completa',
          'Integração ERP completa',
          'Gestão avançada',
          'Consultoria especializada'
        ],
        limitations: [],
        popular: false,
        color: 'var(--agro-gold)'
      }
    ],
    crypto: [
      {
        id: 'basic',
        name: 'Básico',
        price: 0.01,
        period: 'ETH',
        description: 'Para transações simples',
        features: [
          'Transações básicas',
          'Wallet integrado',
          'Suporte básico',
          'Histórico de transações',
          'Taxas baixas'
        ],
        limitations: [
          'Sem staking',
          'Sem DeFi integration'
        ],
        popular: false,
        color: 'var(--agro-secondary-color)'
      },
      {
        id: 'premium',
        name: 'Premium',
        price: 0.05,
        period: 'ETH',
        description: 'Para usuários avançados',
        features: [
          'Transações avançadas',
          'Wallet premium',
          'Suporte prioritário',
          'Staking rewards',
          'Taxas reduzidas',
          'DeFi integration',
          'Analytics avançado'
        ],
        limitations: [
          'Sem suporte 24/7'
        ],
        popular: true,
        color: 'var(--agro-primary-color)'
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        price: 0.1,
        period: 'ETH',
        description: 'Para instituições',
        features: [
          'Transações ilimitadas',
          'Wallet enterprise',
          'Suporte 24/7',
          'Staking premium',
          'Taxas zero',
          'DeFi integration completa',
          'Analytics customizado',
          'Consultoria especializada'
        ],
        limitations: [],
        popular: false,
        color: 'var(--agro-gold)'
      }
    ]
  };

  const currentPlans = plans[selectedService] || [];

  const handlePlanSelect = (planId) => {
    setSelectedPlan(planId);
  };

  const handlePayment = async () => {
    if (!user) {
      alert('Você precisa estar logado para assinar um plano');
      return;
    }

    setIsProcessing(true);
    
    try {
      const plan = currentPlans.find(p => p.id === selectedPlan);
      const service = services.find(s => s.id === selectedService);
      
      const paymentData = {
        amount: plan.price,
        currency: selectedService === 'crypto' ? 'ETH' : 'brl',
        paymentMethod: paymentMethod,
        service: selectedService,
        metadata: {
          plan: plan.id,
          planName: plan.name,
          service: service.name,
          userId: user.id,
          userName: user.name
        }
      };

      if (paymentMethod === 'stripe') {
        // Redirecionar para Stripe Checkout
        const stripeUrl = `/payment/stripe?amount=${plan.price}&service=${selectedService}&plan=${plan.id}`;
        window.location.href = stripeUrl;
      } else if (paymentMethod === 'metamask') {
        // Redirecionar para página de pagamento crypto
        const cryptoUrl = `/payment/crypto?amount=${plan.price}&service=${selectedService}&plan=${plan.id}`;
        window.location.href = cryptoUrl;
      }
      
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      alert('Erro ao processar pagamento. Tente novamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  const getCommissionInfo = () => {
    const plan = currentPlans.find(p => p.id === selectedPlan);
    if (!plan) return null;
    
    return paymentService.calculateCommission(plan.price, selectedService);
  };

  const commission = getCommissionInfo();

  return (
    <div className="plans-system">
      <div className="plans-container">
        {/* Header */}
        <div className="plans-header">
          <h1>Escolha seu Plano</h1>
          <p>Selecione o serviço e plano ideal para seu negócio</p>
        </div>

        {/* Service Selection */}
        <div className="service-selection">
          <h2>Selecione o Serviço</h2>
          <div className="services-grid">
            {services.map((service) => (
              <motion.div
                key={service.id}
                className={`service-card ${selectedService === service.id ? 'selected' : ''}`}
                onClick={() => setSelectedService(service.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{ borderColor: service.color }}
              >
                <div className="service-icon" style={{ color: service.color }}>
                  {service.icon}
                </div>
                <h3>{service.name}</h3>
                <p>{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Plans Selection */}
        <div className="plans-selection">
          <h2>Escolha seu Plano</h2>
          <div className="plans-grid">
            {currentPlans.map((plan) => (
              <motion.div
                key={plan.id}
                className={`plan-card ${plan.popular ? 'popular' : ''} ${selectedPlan === plan.id ? 'selected' : ''}`}
                onClick={() => handlePlanSelect(plan.id)}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
              >
                {plan.popular && (
                  <div className="popular-badge">
                    <Star size={16} />
                    Mais Popular
                  </div>
                )}
                
                <div className="plan-header">
                  <h3>{plan.name}</h3>
                  <div className="plan-price">
                    <span className="price-amount">
                      {selectedService === 'crypto' ? plan.price : `R$ ${plan.price.toFixed(2)}`}
                    </span>
                    <span className="price-period">/{plan.period}</span>
                  </div>
                  <p className="plan-description">{plan.description}</p>
                </div>

                <div className="plan-features">
                  <h4>Inclui:</h4>
                  <ul>
                    {plan.features.map((feature, index) => (
                      <li key={index}>
                        <Check size={16} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  {plan.limitations.length > 0 && (
                    <>
                      <h4>Limitações:</h4>
                      <ul className="limitations">
                        {plan.limitations.map((limitation, index) => (
                          <li key={index}>
                            <X size={16} />
                            {limitation}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>

                <button 
                  className={`plan-button ${selectedPlan === plan.id ? 'selected' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlanSelect(plan.id);
                  }}
                >
                  {selectedPlan === plan.id ? 'Selecionado' : 'Selecionar'}
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Payment Method */}
        <div className="payment-method">
          <h2>Método de Pagamento</h2>
          <div className="payment-options">
            <div 
              className={`payment-option ${paymentMethod === 'stripe' ? 'selected' : ''}`}
              onClick={() => setPaymentMethod('stripe')}
            >
              <CreditCard size={24} />
              <span>Cartão de Crédito (Stripe)</span>
            </div>
            <div 
              className={`payment-option ${paymentMethod === 'metamask' ? 'selected' : ''}`}
              onClick={() => setPaymentMethod('metamask')}
            >
              <Wallet size={24} />
              <span>MetaMask (Crypto)</span>
            </div>
          </div>
        </div>

        {/* Commission Info */}
        {commission && (
          <div className="commission-info">
            <h3>Informações de Comissão</h3>
            <div className="commission-details">
              <div className="commission-item">
                <span>Valor do Plano:</span>
                <span>R$ {commission.netAmount.toFixed(2)}</span>
              </div>
              <div className="commission-item">
                <span>Comissão AGROISYNC ({commission.rate}%):</span>
                <span>R$ {commission.commission.toFixed(2)}</span>
              </div>
              <div className="commission-item total">
                <span>Total:</span>
                <span>R$ {(commission.netAmount + commission.commission).toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="plans-action">
          <button 
            className="subscribe-button"
            onClick={handlePayment}
            disabled={isProcessing}
          >
            {isProcessing ? 'Processando...' : 'Assinar Plano'}
          </button>
        </div>
      </div>

      <style jsx>{`
        .plans-system {
          min-height: 100vh;
          background: var(--agro-gradient-primary);
          padding: 40px 20px;
        }

        .plans-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .plans-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .plans-header h1 {
          color: var(--agro-text-color);
          font-size: 32px;
          font-weight: 700;
          margin: 0 0 16px 0;
        }

        .plans-header p {
          color: var(--agro-secondary-color);
          font-size: 18px;
          margin: 0;
        }

        .service-selection {
          margin-bottom: 40px;
        }

        .service-selection h2 {
          color: var(--agro-text-color);
          font-size: 24px;
          font-weight: 600;
          margin: 0 0 20px 0;
          text-align: center;
        }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
        }

        .service-card {
          background: var(--agro-card-bg);
          border: 2px solid var(--agro-border-color);
          border-radius: 16px;
          padding: 24px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: center;
        }

        .service-card:hover {
          border-color: var(--agro-primary-color);
          transform: translateY(-4px);
        }

        .service-card.selected {
          border-color: var(--agro-primary-color);
          background: var(--agro-active-bg);
        }

        .service-icon {
          margin-bottom: 16px;
        }

        .service-card h3 {
          color: var(--agro-text-color);
          font-size: 20px;
          font-weight: 600;
          margin: 0 0 8px 0;
        }

        .service-card p {
          color: var(--agro-secondary-color);
          font-size: 14px;
          margin: 0;
        }

        .plans-selection {
          margin-bottom: 40px;
        }

        .plans-selection h2 {
          color: var(--agro-text-color);
          font-size: 24px;
          font-weight: 600;
          margin: 0 0 20px 0;
          text-align: center;
        }

        .plans-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 24px;
        }

        .plan-card {
          background: var(--agro-card-bg);
          border: 2px solid var(--agro-border-color);
          border-radius: 16px;
          padding: 24px;
          position: relative;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .plan-card:hover {
          border-color: var(--agro-primary-color);
        }

        .plan-card.selected {
          border-color: var(--agro-primary-color);
          background: var(--agro-active-bg);
        }

        .plan-card.popular {
          border-color: var(--agro-gold);
        }

        .popular-badge {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          background: var(--agro-gold);
          color: var(--agro-primary-text);
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .plan-header {
          text-align: center;
          margin-bottom: 24px;
        }

        .plan-header h3 {
          color: var(--agro-text-color);
          font-size: 24px;
          font-weight: 700;
          margin: 0 0 8px 0;
        }

        .plan-price {
          margin-bottom: 8px;
        }

        .price-amount {
          color: var(--agro-primary-color);
          font-size: 36px;
          font-weight: 800;
        }

        .price-period {
          color: var(--agro-secondary-color);
          font-size: 16px;
        }

        .plan-description {
          color: var(--agro-secondary-color);
          font-size: 14px;
          margin: 0;
        }

        .plan-features h4 {
          color: var(--agro-text-color);
          font-size: 16px;
          font-weight: 600;
          margin: 0 0 12px 0;
        }

        .plan-features ul {
          list-style: none;
          padding: 0;
          margin: 0 0 20px 0;
        }

        .plan-features li {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
          color: var(--agro-text-color);
          font-size: 14px;
        }

        .plan-features li svg {
          color: var(--agro-primary-color);
        }

        .limitations li svg {
          color: var(--agro-secondary-color);
        }

        .plan-button {
          width: 100%;
          background: var(--agro-button-bg);
          border: 1px solid var(--agro-border-color);
          color: var(--agro-text-color);
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .plan-button:hover {
          background: var(--agro-hover-bg);
          color: var(--agro-primary-color);
        }

        .plan-button.selected {
          background: var(--agro-primary-color);
          color: var(--agro-primary-text);
        }

        .payment-method {
          margin-bottom: 40px;
        }

        .payment-method h2 {
          color: var(--agro-text-color);
          font-size: 24px;
          font-weight: 600;
          margin: 0 0 20px 0;
          text-align: center;
        }

        .payment-options {
          display: flex;
          gap: 20px;
          justify-content: center;
        }

        .payment-option {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 24px;
          background: var(--agro-button-bg);
          border: 2px solid var(--agro-border-color);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .payment-option:hover {
          border-color: var(--agro-primary-color);
        }

        .payment-option.selected {
          border-color: var(--agro-primary-color);
          background: var(--agro-active-bg);
        }

        .payment-option span {
          color: var(--agro-text-color);
          font-weight: 500;
        }

        .commission-info {
          background: var(--agro-card-bg);
          border: 1px solid var(--agro-border-color);
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 40px;
        }

        .commission-info h3 {
          color: var(--agro-text-color);
          font-size: 18px;
          font-weight: 600;
          margin: 0 0 16px 0;
        }

        .commission-details {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .commission-item {
          display: flex;
          justify-content: space-between;
          color: var(--agro-text-color);
          font-size: 14px;
        }

        .commission-item.total {
          font-weight: 600;
          font-size: 16px;
          padding-top: 8px;
          border-top: 1px solid var(--agro-border-color);
        }

        .plans-action {
          text-align: center;
        }

        .subscribe-button {
          background: var(--agro-primary-color);
          color: var(--agro-primary-text);
          border: none;
          padding: 16px 32px;
          border-radius: 12px;
          font-size: 18px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .subscribe-button:hover:not(:disabled) {
          background: var(--agro-primary-hover);
          transform: translateY(-2px);
        }

        .subscribe-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .plans-system {
            padding: 20px 10px;
          }

          .services-grid {
            grid-template-columns: 1fr;
          }

          .plans-grid {
            grid-template-columns: 1fr;
          }

          .payment-options {
            flex-direction: column;
          }

          .commission-details {
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default PlansSystem;
