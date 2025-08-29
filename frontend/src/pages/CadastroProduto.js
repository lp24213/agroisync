import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Package, Upload, MapPin, DollarSign, Calendar, 
  FileText, CheckCircle, AlertCircle, X, Plus, Image as ImageIcon,
  Building2, User, Search, MapPin as MapPinIcon
} from 'lucide-react';
import baiduMapsService from '../services/baiduMapsService';
import receitaService from '../services/receitaService';
import transactionService from '../services/transactionService';

const CadastroProduto = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    quantity: '',
    unit: '',
    location: '',
    images: [],
    specifications: [],
    contactPhone: '',
    contactEmail: '',
    deliveryOptions: [],
    paymentMethods: [],
    // Novos campos para validação
    sellerType: 'individual', // 'individual' ou 'company'
    cpf: '',
    cnpj: '',
    ie: '',
    state: '',
    city: '',
    cep: '',
    address: '',
    coordinates: null
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  
  // Estados para validações
  const [isValidatingDocument, setIsValidatingDocument] = useState(false);
  const [isValidatingAddress, setIsValidatingAddress] = useState(false);
  const [documentValidationResult, setDocumentValidationResult] = useState(null);
  const [addressValidationResult, setAddressValidationResult] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const categories = [
    'Sementes', 'Fertilizantes', 'Maquinários', 'Serviços', 
    'Tecnologia', 'Insumos', 'Defensivos', 'Equipamentos'
  ];

  const units = [
    'kg', 'ton', 'un', 'l', 'm²', 'm³', 'hora', 'dia', 'mês', 'ano'
  ];

  const deliveryOptions = [
    'Retirada no local', 'Entrega local', 'Frete para todo Brasil', 'Frete internacional'
  ];

  const paymentMethods = [
    'Dinheiro', 'PIX', 'Cartão de crédito', 'Cartão de débito', 'Boleto', 'Transferência'
  ];

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    
    // Verificar se usuário tem plano ativo
    if (user && (!user.isPaid || !user.planActive)) {
      setError('Você precisa de um plano ativo para cadastrar produtos. Acesse a página de planos para ativar sua conta.');
      setLoading(true);
      return;
    }
    
    document.title = 'Cadastrar Produto - AgroSync';
    
    // Preencher dados de contato do usuário
    if (user) {
      setFormData(prev => ({
        ...prev,
        contactPhone: user.phone || '',
        contactEmail: user.email || ''
      }));
    }
  }, [isAuthenticated, navigate, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpar erros de validação quando o campo é alterado
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  // Validação de documentos via Receita Federal
  const validateDocuments = async () => {
    setIsValidatingDocument(true);
    setDocumentValidationResult(null);
    setValidationErrors(prev => ({ ...prev, cpf: null, cnpj: null, ie: null }));

    try {
      await receitaService.initialize();
      
      let validationResults = {};
      
      if (formData.sellerType === 'individual') {
        if (formData.cpf) {
          const cpfResult = await receitaService.validateCPF(formData.cpf);
          validationResults.cpf = cpfResult;
          
          if (!cpfResult.valid) {
            setValidationErrors(prev => ({ ...prev, cpf: 'CPF inválido' }));
          }
        }
      } else {
        if (formData.cnpj) {
          const cnpjResult = await receitaService.validateCNPJ(formData.cnpj);
          validationResults.cnpj = cnpjResult;
          
          if (!cnpjResult.valid) {
            setValidationErrors(prev => ({ ...prev, cnpj: 'CNPJ inválido' }));
          }
        }
        
        if (formData.ie && formData.state) {
          const ieResult = await receitaService.validateIE(formData.ie, formData.state);
          validationResults.ie = ieResult;
          
          if (!ieResult.valid) {
            setValidationErrors(prev => ({ ...prev, ie: 'Inscrição Estadual inválida' }));
          }
        }
      }
      
      setDocumentValidationResult(validationResults);
      
      // Verificar se todas as validações passaram
      const allValid = Object.values(validationResults).every(result => result.valid);
      return allValid;
      
    } catch (error) {
      console.error('Erro na validação de documentos:', error);
      setError('Erro ao validar documentos. Tente novamente.');
      return false;
    } finally {
      setIsValidatingDocument(false);
    }
  };

  // Validação de endereço via Baidu Maps e IBGE
  const validateAddress = async () => {
    setIsValidatingAddress(true);
    setAddressValidationResult(null);
    setValidationErrors(prev => ({ ...prev, cep: null, address: null }));

    try {
      await baiduMapsService.initialize();
      
      let validationResults = {};
      
      // Validação de CEP via IBGE
      if (formData.cep) {
        const cepResult = await baiduMapsService.validateBrazilianAddress(formData.cep);
        validationResults.cep = cepResult;
        
        if (cepResult.valid) {
          // Atualizar cidade e estado com dados do IBGE
          setFormData(prev => ({
            ...prev,
            city: cepResult.city || prev.city,
            state: cepResult.state || prev.state,
            coordinates: cepResult.coordinates || prev.coordinates
          }));
        } else {
          setValidationErrors(prev => ({ ...prev, cep: 'CEP inválido' }));
        }
      }
      
      // Validação de endereço completo via Baidu Maps
      if (formData.address && formData.city && formData.state) {
        const fullAddress = `${formData.address}, ${formData.city}, ${formData.state}, Brasil`;
        const addressResult = await baiduMapsService.validateBrazilianAddress(fullAddress);
        validationResults.address = addressResult;
        
        if (addressResult.valid) {
          setFormData(prev => ({
            ...prev,
            coordinates: addressResult.coordinates || prev.coordinates
          }));
        } else {
          setValidationErrors(prev => ({ ...prev, address: 'Endereço não encontrado' }));
        }
      }
      
      setAddressValidationResult(validationResults);
      
      // Verificar se todas as validações passaram
      const allValid = Object.values(validationResults).every(result => result.valid);
      return allValid;
      
    } catch (error) {
      console.error('Erro na validação de endereço:', error);
      setError('Erro ao validar endereço. Tente novamente.');
      return false;
    } finally {
      setIsValidatingAddress(false);
    }
  };

  // Validação completa antes de prosseguir
  const validateStep = async (step) => {
    if (step === 2) {
      // Validar documentos antes de prosseguir para preços
      const documentsValid = await validateDocuments();
      if (!documentsValid) {
        setError('Por favor, corrija os erros de validação dos documentos antes de continuar.');
        return false;
      }
    }
    
    if (step === 3) {
      // Validar endereço antes de prosseguir para imagens
      const addressValid = await validateAddress();
      if (!addressValid) {
        setError('Por favor, corrija os erros de validação do endereço antes de continuar.');
        return false;
      }
    }
    
    return true;
  };

  const nextStep = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid) {
      setCurrentStep(currentStep + 1);
      setError(''); // Limpar erros ao avançar
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => 
      file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024
    );

    if (validFiles.length + imageFiles.length > 10) {
      setError('Máximo de 10 imagens permitidas');
      return;
    }

    setImageFiles(prev => [...prev, ...validFiles]);

    // Criar previews
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(prev => [...prev, e.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreview(prev => prev.filter((_, i) => i !== index));
  };

  const addSpecification = () => {
    setFormData(prev => ({
      ...prev,
      specifications: [...prev.specifications, { key: '', value: '' }]
    }));
  };

  const updateSpecification = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.map((spec, i) => 
        i === index ? { ...spec, [field]: value } : spec
      )
    }));
  };

  const removeSpecification = (index) => {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validar dados obrigatórios
      if (!formData.name || !formData.description || !formData.category || 
          !formData.price || !formData.quantity || !formData.unit) {
        throw new Error('Preencha todos os campos obrigatórios');
      }

      if (imageFiles.length === 0) {
        throw new Error('Adicione pelo menos uma imagem do produto');
      }

      // Simular envio para API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSuccess('Produto cadastrado com sucesso! Redirecionando...');
      
      setTimeout(() => {
        navigate('/panel/loja');
      }, 2000);

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-agro-green-500 via-agro-yellow-500 to-web3-neon-blue opacity-60"></div>
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-agro-green-600 to-web3-neon-blue rounded-full opacity-10 blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-agro-yellow-500 to-web3-neon-blue rounded-full opacity-10 blur-xl animate-pulse"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="flex justify-center">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="w-20 h-20 bg-gradient-to-r from-agro-green-600 via-agro-yellow-500 to-web3-neon-blue rounded-2xl flex items-center justify-center shadow-2xl"
            >
              <Package className="w-10 h-10 text-white" />
            </motion.div>
          </div>
          <h1 className="mt-6 text-4xl font-bold title-premium">
            Cadastrar Produto
          </h1>
          <p className="mt-2 text-lg text-slate-600">
            Anuncie seus produtos no maior marketplace do agronegócio
          </p>
          
          {/* Status do Plano */}
          {user && user.isPaid && user.planActive && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-4 inline-flex items-center px-4 py-2 bg-green-100 border border-green-300 rounded-full text-green-800 text-sm font-medium"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Plano {user.planActive} Ativo
            </motion.div>
          )}
        </motion.div>

        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                  currentStep >= step 
                    ? 'bg-gradient-to-r from-agro-green-600 to-web3-neon-blue text-white shadow-lg' 
                    : 'bg-slate-200 text-slate-600'
                }`}>
                  {step}
                </div>
                {step < 4 && (
                  <div className={`w-16 h-1 mx-2 transition-all duration-300 ${
                    currentStep > step ? 'bg-gradient-to-r from-agro-green-500 to-web3-neon-blue' : 'bg-slate-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <p className="text-sm text-slate-600">
              {currentStep === 1 && 'Informações Básicas'}
              {currentStep === 2 && 'Preços e Quantidades'}
              {currentStep === 3 && 'Imagens e Localização'}
              {currentStep === 4 && 'Revisão e Publicação'}
            </p>
          </div>
        </motion.div>

        {/* Verificação de Plano */}
        {user && (!user.isPaid || !user.planActive) ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="card-premium p-8 shadow-2xl text-center"
          >
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-yellow-600" />
            </div>
            <h3 className="text-2xl font-semibold text-slate-900 mb-4">
              Plano Necessário
            </h3>
            <p className="text-slate-600 mb-6">
              Para cadastrar produtos, você precisa de um plano ativo. 
              Acesse nossa página de planos para ativar sua conta.
            </p>
            <motion.button
              onClick={() => navigate('/planos')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-3 bg-gradient-to-r from-agro-green-600 to-web3-neon-blue text-white font-medium rounded-lg hover:from-agro-green-700 hover:to-web3-neon-cyan transition-all duration-200 shadow-lg"
            >
              Ver Planos
            </motion.button>
          </motion.div>
        ) : (
          /* Formulário */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="card-premium p-8 shadow-2xl"
          >
            <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step 1: Informações Básicas */}
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <h3 className="text-2xl font-semibold text-slate-900 mb-6">Informações Básicas</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Nome do Produto *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-agro-green-500 focus:border-transparent transition-all duration-200"
                      placeholder="Ex: Sementes de Soja RR2 PRO"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Descrição Detalhada *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-agro-green-500 focus:border-transparent transition-all duration-200"
                      placeholder="Descreva detalhadamente seu produto, características, benefícios..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Categoria *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-agro-green-500 focus:border-transparent transition-all duration-200"
                      required
                    >
                      <option value="">Selecione uma categoria</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Telefone de Contato
                    </label>
                    <input
                      type="tel"
                      name="contactPhone"
                      value={formData.contactPhone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-agro-green-500 focus:border-transparent transition-all duration-200"
                      placeholder="(11) 99999-9999"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email de Contato
                    </label>
                    <input
                      type="email"
                      name="contactEmail"
                      value={formData.contactEmail}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-agro-green-500 focus:border-transparent transition-all duration-200"
                      placeholder="contato@empresa.com"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Preços e Quantidades */}
            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <h3 className="text-2xl font-semibold text-slate-900 mb-6">Preços e Quantidades</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Preço *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">R$</span>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        step="0.01"
                        min="0"
                        className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-agro-green-500 focus:border-transparent transition-all duration-200"
                        placeholder="0,00"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Quantidade *
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      min="1"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-agro-green-500 focus:border-transparent transition-all duration-200"
                      placeholder="100"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Unidade *
                    </label>
                    <select
                      name="unit"
                      value={formData.unit}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-agro-green-500 focus:border-transparent transition-all duration-200"
                      required
                    >
                      <option value="">Selecione a unidade</option>
                      {units.map(unit => (
                        <option key={unit} value={unit}>{unit}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Localização *
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-agro-green-500 focus:border-transparent transition-all duration-200"
                      placeholder="Cidade, Estado"
                      required
                    />
                  </div>
                </div>

                {/* Opções de Entrega */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    Opções de Entrega
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {deliveryOptions.map(option => (
                      <label key={option} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.deliveryOptions.includes(option)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData(prev => ({
                                ...prev,
                                deliveryOptions: [...prev.deliveryOptions, option]
                              }));
                            } else {
                              setFormData(prev => ({
                                ...prev,
                                deliveryOptions: prev.deliveryOptions.filter(o => o !== option)
                              }));
                            }
                          }}
                          className="w-4 h-4 text-agro-green-600 focus:ring-agro-green-500 border-slate-300 rounded"
                        />
                        <span className="text-sm text-slate-700">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Métodos de Pagamento */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    Métodos de Pagamento
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {paymentMethods.map(method => (
                      <label key={method} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.paymentMethods.includes(method)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData(prev => ({
                                ...prev,
                                paymentMethods: [...prev.paymentMethods, method]
                              }));
                            } else {
                              setFormData(prev => ({
                                ...prev,
                                paymentMethods: prev.paymentMethods.filter(m => m !== method)
                              }));
                            }
                          }}
                          className="w-4 h-4 text-agro-green-600 focus:ring-agro-green-500 border-slate-300 rounded"
                        />
                        <span className="text-sm text-slate-700">{method}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Imagens e Localização */}
            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <h3 className="text-2xl font-semibold text-slate-900 mb-6">Imagens e Localização</h3>
                
                {/* Upload de Imagens */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    Imagens do Produto * (Máximo 10)
                  </label>
                  
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-agro-green-400 transition-colors duration-200">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <ImageIcon className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-600 mb-2">
                        Clique para selecionar imagens ou arraste aqui
                      </p>
                      <p className="text-sm text-slate-500">
                        PNG, JPG até 5MB cada
                      </p>
                    </label>
                  </div>

                  {/* Preview das Imagens */}
                  {imagePreview.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-sm font-medium text-slate-700 mb-3">Imagens Selecionadas</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {imagePreview.map((preview, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Especificações Técnicas */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-slate-700">
                      Especificações Técnicas
                    </label>
                    <button
                      type="button"
                      onClick={addSpecification}
                      className="flex items-center space-x-1 text-sm text-agro-green-600 hover:text-agro-green-700"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Adicionar</span>
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {formData.specifications.map((spec, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <input
                          type="text"
                          placeholder="Característica"
                          value={spec.key}
                          onChange={(e) => updateSpecification(index, 'key', e.target.value)}
                          className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-agro-green-500 focus:border-transparent transition-all duration-200"
                        />
                        <input
                          type="text"
                          placeholder="Valor"
                          value={spec.value}
                          onChange={(e) => updateSpecification(index, 'value', e.target.value)}
                          className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-agro-green-500 focus:border-transparent transition-all duration-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeSpecification(index)}
                          className="w-8 h-8 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors duration-200 flex items-center justify-center"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Revisão e Publicação */}
            {currentStep === 4 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <h3 className="text-2xl font-semibold text-slate-900 mb-6">Revisão e Publicação</h3>
                
                <div className="bg-slate-50 rounded-lg p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-slate-600">Nome do Produto</p>
                      <p className="text-slate-900">{formData.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-600">Categoria</p>
                      <p className="text-slate-900">{formData.category}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-600">Preço</p>
                      <p className="text-slate-900">R$ {formData.price}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-600">Quantidade</p>
                      <p className="text-slate-900">{formData.quantity} {formData.unit}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-600">Localização</p>
                      <p className="text-slate-900">{formData.location}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-600">Imagens</p>
                      <p className="text-slate-900">{imageFiles.length} imagem(ns)</p>
                    </div>
                  </div>
                  
                  <div className="border-t border-slate-200 pt-4">
                    <p className="text-sm font-medium text-slate-600 mb-2">Descrição</p>
                    <p className="text-slate-900">{formData.description}</p>
                  </div>
                </div>

                {/* Termos e Condições */}
                <div className="flex items-start space-x-3">
                  <input
                    id="terms"
                    type="checkbox"
                    required
                    className="mt-1 h-4 w-4 text-agro-green-600 focus:ring-agro-green-500 border-slate-300 rounded"
                  />
                  <label htmlFor="terms" className="text-sm text-slate-700">
                    Concordo com os{' '}
                    <a href="/termos" className="text-agro-green-600 hover:text-agro-green-700 underline">
                      Termos de Uso
                    </a>{' '}
                    e{' '}
                    <a href="/privacidade" className="text-agro-green-600 hover:text-agro-green-700 underline">
                      Política de Privacidade
                    </a>
                  </label>
                </div>
              </motion.div>
            )}

            {/* Navegação entre steps */}
            <div className="flex justify-between pt-6">
              {currentStep > 1 && (
                <motion.button
                  type="button"
                  onClick={prevStep}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all duration-200"
                >
                  Anterior
                </motion.button>
              )}
              
              <div className="flex-1"></div>
              
              {currentStep < 4 ? (
                <motion.button
                  type="button"
                  onClick={nextStep}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 bg-gradient-to-r from-agro-green-600 to-web3-neon-blue text-white rounded-lg hover:from-agro-green-700 hover:to-web3-neon-cyan transition-all duration-200 shadow-lg"
                >
                  Próximo
                </motion.button>
              ) : (
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-3 bg-gradient-to-r from-agro-green-600 via-agro-yellow-500 to-web3-neon-blue text-white font-medium rounded-lg hover:from-agro-green-700 hover:via-agro-yellow-600 hover:to-web3-neon-cyan disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg transform hover:scale-105"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Publicando...</span>
                    </div>
                  ) : (
                    'Publicar Produto'
                  )}
                </motion.button>
              )}
            </div>

            {/* Mensagens de erro/sucesso */}
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg"
              >
                <AlertCircle className="h-5 w-5 text-red-500" />
                <span className="text-sm text-red-700">{error}</span>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center space-x-2 p-3 bg-emerald-50 border border-emerald-200 rounded-lg"
              >
                <CheckCircle className="h-5 w-5 text-emerald-500" />
                <span className="text-sm text-emerald-700">{success}</span>
              </motion.div>
            )}
          </form>
        </motion.div>
        )}
      </div>
    </div>
  );
};

export default CadastroProduto;
