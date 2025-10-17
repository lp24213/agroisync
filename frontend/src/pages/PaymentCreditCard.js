import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import paymentService from '../services/paymentService';

function PaymentCreditCard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { plan, billingCycle, amount } = location.state || {};

  const [loading, setLoading] = useState(false);
  const [cardData, setCardData] = useState({
    holderName: '',
    number: '',
    expiryMonth: '',
    expiryYear: '',
    ccv: ''
  });

  const [holderInfo, setHolderInfo] = useState({
    name: '',
    email: '',
    cpfCnpj: '',
    postalCode: '',
    addressNumber: '',
    phone: ''
  });

  const [installments, setInstallments] = useState(1);

  useEffect(() => {
    if (!plan || !amount) {
      toast.error('Dados do plano não encontrados');
      navigate('/plans');
    }

    // Buscar dados do usuário
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user) {
      setHolderInfo({
        name: user.name || '',
        email: user.email || '',
        cpfCnpj: user.cpf || user.cnpj || '',
        postalCode: user.cep || '',
        addressNumber: '',
        phone: user.phone || ''
      });
    }
  }, [plan, amount, navigate]);

  const handleCardChange = (e) => {
    let { name, value } = e.target;

    // Formatação do número do cartão
    if (name === 'number') {
      value = value.replace(/\D/g, '').slice(0, 16);
      value = value.replace(/(\d{4})/g, '$1 ').trim();
    }

    // Formatação do CVV
    if (name === 'ccv') {
      value = value.replace(/\D/g, '').slice(0, 4);
    }

    // Formatação do mês
    if (name === 'expiryMonth') {
      value = value.replace(/\D/g, '').slice(0, 2);
      if (parseInt(value) > 12) value = '12';
    }

    // Formatação do ano
    if (name === 'expiryYear') {
      value = value.replace(/\D/g, '').slice(0, 4);
    }

    setCardData({ ...cardData, [name]: value });
  };

  const handleHolderChange = (e) => {
    let { name, value } = e.target;

    // Formatação do CPF/CNPJ
    if (name === 'cpfCnpj') {
      value = value.replace(/\D/g, '');
      if (value.length <= 11) {
        value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
      } else {
        value = value.slice(0, 14).replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
      }
    }

    // Formatação do CEP
    if (name === 'postalCode') {
      value = value.replace(/\D/g, '').slice(0, 8);
      value = value.replace(/(\d{5})(\d{3})/, '$1-$2');
    }

    // Formatação do telefone
    if (name === 'phone') {
      value = value.replace(/\D/g, '').slice(0, 11);
      value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }

    setHolderInfo({ ...holderInfo, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validações
      if (!cardData.holderName || !cardData.number || !cardData.expiryMonth || !cardData.expiryYear || !cardData.ccv) {
        toast.error('Preencha todos os dados do cartão');
        setLoading(false);
        return;
      }

      if (!holderInfo.name || !holderInfo.cpfCnpj || !holderInfo.postalCode || !holderInfo.addressNumber) {
        toast.error('Preencha todos os dados do titular');
        setLoading(false);
        return;
      }

      // Processar pagamento
      const result = await paymentService.createCheckoutSession(
        plan.toLowerCase(),
        billingCycle,
        'credit_card',
        {
          creditCard: {
            holderName: cardData.holderName,
            number: cardData.number.replace(/\s/g, ''),
            expiryMonth: cardData.expiryMonth,
            expiryYear: cardData.expiryYear,
            ccv: cardData.ccv
          },
          creditCardHolderInfo: {
            name: holderInfo.name,
            email: holderInfo.email,
            cpfCnpj: holderInfo.cpfCnpj.replace(/\D/g, ''),
            postalCode: holderInfo.postalCode.replace(/\D/g, ''),
            addressNumber: holderInfo.addressNumber,
            phone: holderInfo.phone.replace(/\D/g, '')
          },
          installmentCount: installments
        }
      );

      if (result.success) {
        toast.success('Pagamento processado com sucesso!');
        setTimeout(() => {
          navigate('/user-dashboard');
        }, 2000);
      } else {
        toast.error(result.error || 'Erro ao processar pagamento');
      }
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      toast.error(error.message || 'Erro ao processar pagamento');
    } finally {
      setLoading(false);
    }
  };

  const installmentOptions = [];
  for (let i = 1; i <= 12; i++) {
    const installmentValue = (amount / i).toFixed(2);
    installmentOptions.push(
      <option key={i} value={i}>
        {i}x de R$ {installmentValue} {i === 1 ? '(à vista)' : ''}
      </option>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Pagamento com Cartão
          </h1>
          <p className="text-gray-600">
            Plano {plan} - {billingCycle === 'monthly' ? 'Mensal' : billingCycle === 'semiannual' ? 'Semestral' : 'Anual'}
          </p>
          <p className="text-2xl font-bold text-green-600 mt-2">
            R$ {amount?.toFixed(2)}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-xl p-8 space-y-6">
          {/* Dados do Cartão */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Dados do Cartão</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome no Cartão
                </label>
                <input
                  type="text"
                  name="holderName"
                  value={cardData.holderName}
                  onChange={handleCardChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="NOME COMO ESTÁ NO CARTÃO"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número do Cartão
                </label>
                <input
                  type="text"
                  name="number"
                  value={cardData.number}
                  onChange={handleCardChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="1234 5678 9012 3456"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mês
                  </label>
                  <input
                    type="text"
                    name="expiryMonth"
                    value={cardData.expiryMonth}
                    onChange={handleCardChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="12"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ano
                  </label>
                  <input
                    type="text"
                    name="expiryYear"
                    value={cardData.expiryYear}
                    onChange={handleCardChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="2025"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CVV
                  </label>
                  <input
                    type="text"
                    name="ccv"
                    value={cardData.ccv}
                    onChange={handleCardChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="123"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Parcelamento
                </label>
                <select
                  value={installments}
                  onChange={(e) => setInstallments(parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {installmentOptions}
                </select>
              </div>
            </div>
          </div>

          {/* Dados do Titular */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Dados do Titular</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={holderInfo.name}
                    onChange={handleHolderChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CPF/CNPJ
                  </label>
                  <input
                    type="text"
                    name="cpfCnpj"
                    value={holderInfo.cpfCnpj}
                    onChange={handleHolderChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CEP
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={holderInfo.postalCode}
                    onChange={handleHolderChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número
                  </label>
                  <input
                    type="text"
                    name="addressNumber"
                    value={holderInfo.addressNumber}
                    onChange={handleHolderChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={holderInfo.email}
                    onChange={handleHolderChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={holderInfo.phone}
                    onChange={handleHolderChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={() => navigate('/plans')}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Voltar
            </button>
            
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processando...' : 'Pagar Agora'}
            </button>
          </div>

          {/* Segurança */}
          <div className="text-center text-sm text-gray-500 pt-4">
            🔒 Pagamento seguro processado por Asaas
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default PaymentCreditCard;

