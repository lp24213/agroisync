import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  MapPin, 
  Truck, 
  CheckCircle,
  Loader,
  Search,
  Globe,
  X
} from 'lucide-react';

const RegistrationSystem = ({ type, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Dados básicos
    name: '',
    email: '',
    phone: '',
    
    // Dados da empresa
    companyName: '',
    cnpj: '',
    cpf: '',
    ie: '',
    
    // Endereço
    cep: '',
    address: '',
    city: '',
    state: '',
    country: 'Brasil',
    
    // Dados específicos por tipo
    ...(type === 'agroconecta' && {
      plate: '',
      vehicleType: '',
      capacity: '',
      license: ''
    }),
    
    // Dados da fazenda (se aplicável)
    farmName: '',
    farmSize: '',
    coordinates: '',
    
    // Produtos/Serviços
    products: [],
    services: [],
    
    // Configurações
    isPublic: false,
    plan: 'free'
  });

  const [loading, setLoading] = useState(false);
  // const [errors, setErrors] = useState({});
  const [autoFilled, setAutoFilled] = useState({});

  // Configurações por tipo
  const typeConfig = {
    agroconecta: {
      title: 'AgroConecta - Cadastro de Transportador',
      icon: <Truck size={24} />,
      color: 'from-blue-500 to-cyan-500',
      steps: [
        { id: 1, title: 'Dados Pessoais', fields: ['name', 'email', 'phone', 'cpf'] },
        { id: 2, title: 'Dados da Empresa', fields: ['companyName', 'cnpj', 'ie'] },
        { id: 3, title: 'Endereço', fields: ['cep', 'address', 'city', 'state'] },
        { id: 4, title: 'Veículo', fields: ['plate', 'vehicleType', 'capacity', 'license'] },
        { id: 5, title: 'Serviços', fields: ['services'] },
        { id: 6, title: 'Plano', fields: ['plan'] }
      ]
    },
    loja: {
      title: 'Loja - Cadastro de Vendedor',
      icon: <Building2 size={24} />,
      color: 'from-green-500 to-emerald-500',
      steps: [
        { id: 1, title: 'Dados Pessoais', fields: ['name', 'email', 'phone', 'cpf'] },
        { id: 2, title: 'Dados da Empresa', fields: ['companyName', 'cnpj', 'ie'] },
        { id: 3, title: 'Endereço', fields: ['cep', 'address', 'city', 'state'] },
        { id: 4, title: 'Produtos', fields: ['products'] },
        { id: 5, title: 'Plano', fields: ['plan'] }
      ]
    },
    marketplace: {
      title: 'Marketplace - Cadastro de Empresa',
      icon: <Globe size={24} />,
      color: 'from-purple-500 to-pink-500',
      steps: [
        { id: 1, title: 'Dados Pessoais', fields: ['name', 'email', 'phone', 'cpf'] },
        { id: 2, title: 'Dados da Empresa', fields: ['companyName', 'cnpj', 'ie'] },
        { id: 3, title: 'Endereço', fields: ['cep', 'address', 'city', 'state'] },
        { id: 4, title: 'Produtos', fields: ['products'] },
        { id: 5, title: 'Plano', fields: ['plan'] }
      ]
    },
    fazenda: {
      title: 'Fazenda - Cadastro Rural',
      icon: <MapPin size={24} />,
      color: 'from-orange-500 to-red-500',
      steps: [
        { id: 1, title: 'Dados Pessoais', fields: ['name', 'email', 'phone', 'cpf'] },
        { id: 2, title: 'Dados da Fazenda', fields: ['farmName', 'farmSize', 'coordinates'] },
        { id: 3, title: 'Endereço', fields: ['cep', 'address', 'city', 'state'] },
        { id: 4, title: 'Produtos', fields: ['products'] },
        { id: 5, title: 'Plano', fields: ['plan'] }
      ]
    }
  };

  const config = typeConfig[type] || typeConfig.loja;

  // Planos disponíveis
  const plans = [
    {
      id: 'basic',
      name: 'Básico',
      price: 29.90,
      products: 1,
      description: '1 produto ou 1 frete',
      features: ['1 produto/frete', 'Visibilidade básica', 'Suporte por email']
    },
    {
      id: 'standard',
      name: 'Padrão',
      price: 99.90,
      products: 5,
      description: '5 produtos ou 5 fretes',
      features: ['5 produtos/fretes', 'Visibilidade premium', 'Suporte prioritário', 'Analytics básico']
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 499.90,
      products: 25,
      description: '25 produtos ou 25 fretes',
      features: ['25 produtos/fretes', 'Visibilidade máxima', 'Suporte 24/7', 'Analytics avançado', 'API access']
    }
  ];

  // Preenchimento automático por IP
  const fillAddressByIP = async () => {
    setLoading(true);
    try {
      // Simular busca por IP (substituir por API real)
      const mockData = {
        cep: '01310-100',
        address: 'Av. Paulista, 1000',
        city: 'São Paulo',
        state: 'SP'
      };

      setFormData(prev => ({
        ...prev,
        cep: mockData.cep,
        address: mockData.address,
        city: mockData.city,
        state: mockData.state
      }));

      setAutoFilled(prev => ({
        ...prev,
        address: true
      }));
    } catch (error) {
      console.error('Erro ao preencher endereço:', error);
    } finally {
      setLoading(false);
    }
  };

  // Buscar dados por CEP
  const fetchCEPData = async (cep) => {
    if (cep.length === 9) {
      setLoading(true);
      try {
        // Simular API dos Correios
        const mockData = {
          cep: '01310-100',
          logradouro: 'Avenida Paulista',
          bairro: 'Bela Vista',
          localidade: 'São Paulo',
          uf: 'SP'
        };

        setFormData(prev => ({
          ...prev,
          address: mockData.logradouro,
          city: mockData.localidade,
          state: mockData.uf
        }));

        setAutoFilled(prev => ({
          ...prev,
          cep: true
        }));
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Validar CNPJ
  const validateCNPJ = async (cnpj) => {
    if (cnpj.length === 18) {
      setLoading(true);
      try {
        // Simular validação na Receita Federal
        const isValid = true; // Simular validação
        if (isValid) {
          // Simular dados da empresa
          const companyData = {
            companyName: 'Empresa Exemplo LTDA',
            ie: '123.456.789.012'
          };

          setFormData(prev => ({
            ...prev,
            companyName: companyData.companyName,
            ie: companyData.ie
          }));

          setAutoFilled(prev => ({
            ...prev,
            cnpj: true
          }));
        }
      } catch (error) {
        console.error('Erro ao validar CNPJ:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Validar CPF
  const validateCPF = async (cpf) => {
    if (cpf.length === 14) {
      setLoading(true);
      try {
        // Simular validação do CPF
        const isValid = true; // Simular validação
        if (isValid) {
          setAutoFilled(prev => ({
            ...prev,
            cpf: true
          }));
        }
      } catch (error) {
        console.error('Erro ao validar CPF:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Buscar produtos por API
  // const searchProducts = async (query) => {
  //   if (query.length > 2) {
  //     setLoading(true);
  //     try {
  //       // Simular busca de produtos
  //       const mockProducts = [
  //         { id: 1, name: 'Soja', category: 'Grãos', unit: 'saca' },
  //         { id: 2, name: 'Milho', category: 'Grãos', unit: 'saca' },
  //         { id: 3, name: 'Trigo', category: 'Grãos', unit: 'saca' },
  //         { id: 4, name: 'Café', category: 'Bebidas', unit: 'kg' },
  //         { id: 5, name: 'Açúcar', category: 'Dulçor', unit: 'kg' }
  //       ];

  //       return mockProducts.filter(product => 
  //         product.name.toLowerCase().includes(query.toLowerCase())
  //       );
  //     } catch (error) {
  //       console.error('Erro ao buscar produtos:', error);
  //       return [];
  //     } finally {
  //       setLoading(false);
  //     }
  //   }
  //   return [];
  // };

  const handleInputChange = async (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Triggers para preenchimento automático
    switch (field) {
      case 'cep':
        await fetchCEPData(value);
        break;
      case 'cnpj':
        await validateCNPJ(value);
        break;
      case 'cpf':
        await validateCPF(value);
        break;
      default:
        // Nenhuma ação necessária
        break;
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Enviar dados para o backend
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type,
          data: formData
        })
      });

      if (response.ok) {
        // Redirecionar para pagamento
        window.location.href = `/payment?plan=${formData.plan}&type=${type}`;
      }
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStep = (stepNumber) => {
    const step = config.steps.find(s => s.id === stepNumber);
    if (!step) return null;

    return (
      <motion.div
        key={stepNumber}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-4"
      >
        <h3 className="text-xl font-semibold text-gray-800">{step.title}</h3>
        
        {step.fields.includes('name') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome Completo *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        )}

        {step.fields.includes('email') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        )}

        {step.fields.includes('phone') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Telefone *
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="(11) 99999-9999"
              required
            />
          </div>
        )}

        {step.fields.includes('cpf') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CPF *
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.cpf}
                onChange={(e) => handleInputChange('cpf', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="000.000.000-00"
                required
              />
              {autoFilled.cpf && (
                <CheckCircle className="absolute right-3 top-2.5 h-5 w-5 text-green-500" />
              )}
            </div>
          </div>
        )}

        {step.fields.includes('companyName') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome da Empresa *
            </label>
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) => handleInputChange('companyName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        )}

        {step.fields.includes('cnpj') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CNPJ *
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.cnpj}
                onChange={(e) => handleInputChange('cnpj', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="00.000.000/0000-00"
                required
              />
              {autoFilled.cnpj && (
                <CheckCircle className="absolute right-3 top-2.5 h-5 w-5 text-green-500" />
              )}
            </div>
          </div>
        )}

        {step.fields.includes('ie') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Inscrição Estadual
            </label>
            <input
              type="text"
              value={formData.ie}
              onChange={(e) => handleInputChange('ie', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {step.fields.includes('cep') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CEP *
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.cep}
                onChange={(e) => handleInputChange('cep', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="00000-000"
                required
              />
              <button
                type="button"
                onClick={fillAddressByIP}
                className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                <Globe size={16} />
              </button>
            </div>
            {autoFilled.cep && (
              <p className="text-xs text-green-600 mt-1">✓ Endereço preenchido automaticamente</p>
            )}
          </div>
        )}

        {step.fields.includes('address') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Endereço *
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        )}

        {step.fields.includes('city') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cidade *
            </label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        )}

        {step.fields.includes('state') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado *
            </label>
            <select
              value={formData.state}
              onChange={(e) => handleInputChange('state', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Selecione o estado</option>
              <option value="AC">Acre</option>
              <option value="AL">Alagoas</option>
              <option value="AP">Amapá</option>
              <option value="AM">Amazonas</option>
              <option value="BA">Bahia</option>
              <option value="CE">Ceará</option>
              <option value="DF">Distrito Federal</option>
              <option value="ES">Espírito Santo</option>
              <option value="GO">Goiás</option>
              <option value="MA">Maranhão</option>
              <option value="MT">Mato Grosso</option>
              <option value="MS">Mato Grosso do Sul</option>
              <option value="MG">Minas Gerais</option>
              <option value="PA">Pará</option>
              <option value="PB">Paraíba</option>
              <option value="PR">Paraná</option>
              <option value="PE">Pernambuco</option>
              <option value="PI">Piauí</option>
              <option value="RJ">Rio de Janeiro</option>
              <option value="RN">Rio Grande do Norte</option>
              <option value="RS">Rio Grande do Sul</option>
              <option value="RO">Rondônia</option>
              <option value="RR">Roraima</option>
              <option value="SC">Santa Catarina</option>
              <option value="SP">São Paulo</option>
              <option value="SE">Sergipe</option>
              <option value="TO">Tocantins</option>
            </select>
          </div>
        )}

        {step.fields.includes('plate') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Placa do Veículo *
            </label>
            <input
              type="text"
              value={formData.plate}
              onChange={(e) => handleInputChange('plate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="ABC-1234"
              required
            />
          </div>
        )}

        {step.fields.includes('vehicleType') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Veículo *
            </label>
            <select
              value={formData.vehicleType}
              onChange={(e) => handleInputChange('vehicleType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Selecione o tipo</option>
              <option value="truck">Caminhão</option>
              <option value="tractor">Trator</option>
              <option value="van">Van</option>
              <option value="pickup">Picape</option>
            </select>
          </div>
        )}

        {step.fields.includes('capacity') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Capacidade (toneladas) *
            </label>
            <input
              type="number"
              value={formData.capacity}
              onChange={(e) => handleInputChange('capacity', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        )}

        {step.fields.includes('license') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Habilitação *
            </label>
            <select
              value={formData.license}
              onChange={(e) => handleInputChange('license', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Selecione a categoria</option>
              <option value="B">Categoria B</option>
              <option value="C">Categoria C</option>
              <option value="D">Categoria D</option>
              <option value="E">Categoria E</option>
            </select>
          </div>
        )}

        {step.fields.includes('farmName') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome da Fazenda *
            </label>
            <input
              type="text"
              value={formData.farmName}
              onChange={(e) => handleInputChange('farmName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        )}

        {step.fields.includes('farmSize') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tamanho da Fazenda (hectares) *
            </label>
            <input
              type="number"
              value={formData.farmSize}
              onChange={(e) => handleInputChange('farmSize', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        )}

        {step.fields.includes('coordinates') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Coordenadas GPS
            </label>
            <input
              type="text"
              value={formData.coordinates}
              onChange={(e) => handleInputChange('coordinates', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="-23.5505, -46.6333"
            />
          </div>
        )}

        {step.fields.includes('products') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Produtos *
            </label>
            <ProductSelector 
              products={formData.products}
              onChange={(products) => handleInputChange('products', products)}
            />
          </div>
        )}

        {step.fields.includes('services') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Serviços *
            </label>
            <ServiceSelector 
              services={formData.services}
              onChange={(services) => handleInputChange('services', services)}
            />
          </div>
        )}

        {step.fields.includes('plan') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Escolha seu Plano *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    formData.plan === plan.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleInputChange('plan', plan.id)}
                >
                  <div className="text-center">
                    <h4 className="font-semibold text-gray-800">{plan.name}</h4>
                    <div className="text-2xl font-bold text-blue-600 mt-2">
                      R$ {plan.price.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">{plan.description}</div>
                    <ul className="text-xs text-gray-600 mt-3 space-y-1">
                      {plan.features.map((feature, index) => (
                        <li key={index}>• {feature}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-800">
                💰 <strong>Desconto de 15%</strong> em assinaturas anuais!
              </p>
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl"
      >
        {/* Header */}
        <div className={`bg-gradient-to-r ${config.color} p-6 text-white rounded-t-2xl`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {config.icon}
              <div>
                <h2 className="text-xl font-bold">{config.title}</h2>
                <p className="text-sm opacity-90">Passo {currentStep} de {config.steps.length}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 border-b">
          <div className="flex items-center space-x-2">
            {config.steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    currentStep > step.id
                      ? 'bg-green-500 text-white'
                      : currentStep === step.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {currentStep > step.id ? <CheckCircle size={16} /> : step.id}
                </div>
                <span className={`ml-2 text-sm ${
                  currentStep >= step.id ? 'text-gray-800' : 'text-gray-500'
                }`}>
                  {step.title}
                </span>
                {index < config.steps.length - 1 && (
                  <div className="w-8 h-0.5 bg-gray-200 mx-4" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {renderStep(currentStep)}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-gray-50 rounded-b-2xl">
          <div className="flex justify-between">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className={`px-4 py-2 rounded-md transition-colors ${
                currentStep === 1
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
              }`}
            >
              Anterior
            </button>

            {currentStep < config.steps.length ? (
              <button
                onClick={() => setCurrentStep(Math.min(config.steps.length, currentStep + 1))}
                className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Próximo
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <Loader className="animate-spin" size={16} />
                    <span>Processando...</span>
                  </div>
                ) : (
                  'Finalizar Cadastro'
                )}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Componente para seleção de produtos
const ProductSelector = ({ products, onChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.length > 2) {
      // Simular busca de produtos
      const mockProducts = [
        { id: 1, name: 'Soja', category: 'Grãos', unit: 'saca' },
        { id: 2, name: 'Milho', category: 'Grãos', unit: 'saca' },
        { id: 3, name: 'Trigo', category: 'Grãos', unit: 'saca' },
        { id: 4, name: 'Café', category: 'Bebidas', unit: 'kg' },
        { id: 5, name: 'Açúcar', category: 'Dulçor', unit: 'kg' },
        { id: 6, name: 'Fertilizante', category: 'Insumos', unit: 'kg' },
        { id: 7, name: 'Sementes', category: 'Insumos', unit: 'kg' }
      ];

      const filtered = mockProducts.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filtered);
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  };

  const addProduct = (product) => {
    if (!products.find(p => p.id === product.id)) {
      onChange([...products, { ...product, quantity: 1, price: 0 }]);
    }
    setSearchQuery('');
    setShowResults(false);
  };

  const removeProduct = (productId) => {
    onChange(products.filter(p => p.id !== productId));
  };

  const updateProduct = (productId, field, value) => {
    onChange(products.map(p => 
      p.id === productId ? { ...p, [field]: value } : p
    ));
  };

  return (
    <div className="space-y-3">
      {/* Campo de busca */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Buscar produtos..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
        
        {/* Resultados da busca */}
        {showResults && searchResults.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
            {searchResults.map(product => (
              <div
                key={product.id}
                onClick={() => addProduct(product)}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between"
              >
                <div>
                  <div className="font-medium">{product.name}</div>
                  <div className="text-sm text-gray-500">{product.category}</div>
                </div>
                <div className="text-sm text-gray-400">{product.unit}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Produtos selecionados */}
      {products.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-700">Produtos Selecionados:</h4>
          {products.map(product => (
            <div key={product.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-md">
              <div className="flex-1">
                <div className="font-medium">{product.name}</div>
                <div className="text-sm text-gray-500">{product.category}</div>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={product.quantity}
                  onChange={(e) => updateProduct(product.id, 'quantity', parseInt(e.target.value))}
                  className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                  min="1"
                />
                <span className="text-sm text-gray-500">{product.unit}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">R$</span>
                <input
                  type="number"
                  value={product.price}
                  onChange={(e) => updateProduct(product.id, 'price', parseFloat(e.target.value))}
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                  step="0.01"
                  min="0"
                />
              </div>
              
              <button
                onClick={() => removeProduct(product.id)}
                className="p-1 text-red-500 hover:bg-red-50 rounded"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Botão para criar produto personalizado */}
      <button
        onClick={() => {
          const customProduct = {
            id: Date.now(),
            name: 'Produto Personalizado',
            category: 'Personalizado',
            unit: 'unidade',
            quantity: 1,
            price: 0,
            isCustom: true
          };
          onChange([...products, customProduct]);
        }}
        className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-md text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors"
      >
        + Adicionar Produto Personalizado
      </button>
    </div>
  );
};

// Componente para seleção de serviços
const ServiceSelector = ({ services, onChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);

  const availableServices = [
    { id: 1, name: 'Transporte de Grãos', description: 'Transporte de soja, milho, trigo' },
    { id: 2, name: 'Transporte de Cargas Gerais', description: 'Produtos diversos' },
    { id: 3, name: 'Transporte de Fertilizantes', description: 'Insumos agrícolas' },
    { id: 4, name: 'Transporte de Equipamentos', description: 'Máquinas e equipamentos' },
    { id: 5, name: 'Transporte Refrigerado', description: 'Produtos que necessitam refrigeração' },
    { id: 6, name: 'Transporte de Animais', description: 'Gado, suínos, aves' }
  ];

  const handleSearch = (query) => {
    setSearchQuery(query);
    setShowResults(query.length > 2);
  };

  const addService = (service) => {
    if (!services.find(s => s.id === service.id)) {
      onChange([...services, { ...service, price: 0 }]);
    }
    setSearchQuery('');
    setShowResults(false);
  };

  const removeService = (serviceId) => {
    onChange(services.filter(s => s.id !== serviceId));
  };

  const updateService = (serviceId, field, value) => {
    onChange(services.map(s => 
      s.id === serviceId ? { ...s, [field]: value } : s
    ));
  };

  const filteredServices = availableServices.filter(service =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-3">
      {/* Campo de busca */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Buscar serviços..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
        
        {/* Resultados da busca */}
        {showResults && filteredServices.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
            {filteredServices.map(service => (
              <div
                key={service.id}
                onClick={() => addService(service)}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              >
                <div className="font-medium">{service.name}</div>
                <div className="text-sm text-gray-500">{service.description}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Serviços selecionados */}
      {services.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-700">Serviços Selecionados:</h4>
          {services.map(service => (
            <div key={service.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-md">
              <div className="flex-1">
                <div className="font-medium">{service.name}</div>
                <div className="text-sm text-gray-500">{service.description}</div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">R$</span>
                <input
                  type="number"
                  value={service.price}
                  onChange={(e) => updateService(service.id, 'price', parseFloat(e.target.value))}
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                />
                <span className="text-sm text-gray-500">/km</span>
              </div>
              
              <button
                onClick={() => removeService(service.id)}
                className="p-1 text-red-500 hover:bg-red-50 rounded"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Botão para criar serviço personalizado */}
      <button
        onClick={() => {
          const customService = {
            id: Date.now(),
            name: 'Serviço Personalizado',
            description: 'Descrição do serviço',
            price: 0,
            isCustom: true
          };
          onChange([...services, customService]);
        }}
        className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-md text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors"
      >
        + Adicionar Serviço Personalizado
      </button>
    </div>
  );
};

export default RegistrationSystem;
