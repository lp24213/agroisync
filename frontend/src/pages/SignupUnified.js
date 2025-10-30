import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Building2, Phone, Truck, Package, ShoppingCart, Store, CheckCircle, Loader2 } from 'lucide-react';
import validationService from '../services/validationService';
import authService from '../services/authService';
import { toast } from 'react-hot-toast';
import CloudflareTurnstile from '../components/CloudflareTurnstile';

const SignupUnified = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // TIPO DE CONTA SELECIONADO
  const [accountType, setAccountType] = useState('');
  
  const [formData, setFormData] = useState({
    // Dados Básicos
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    company: '',
    
    // Endereço
    cep: '',
    address: '',
    city: '',
    state: '',
    
    // Documentos
    cpf: '',
    cnpj: '',
    ie: '',
    
    // FRETE - Campos específicos
    licensePlate: '',
    vehicleModel: '',
    vehicleType: 'truck',
    capacity: '',
    freightDescription: '',
    
    // PRODUTO - Campos específicos
    productName: '',
    productDescription: '',
    productCategory: 'graos',
    productPrice: '',
    productQuantity: '',
    
    // LOJA - Campos específicos
    storeName: '',
    storeDescription: '',
    storeCategory: 'graos'
  });

  const [turnstileToken, setTurnstileToken] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [validations, setValidations] = useState({});
  
  // Estados para verificação de email
  const [emailCode, setEmailCode] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const heroVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8, ease: 'easeOut' } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
  };

  // TIPOS DE CONTA DISPONÍVEIS
  const accountTypes = [
    { 
      id: 'freight_seller', 
      icon: Truck, 
      label: '🚚 Transportadora', 
      desc: 'Ofereço serviços de logística e transporte',
      color: '#3b82f6'
    },
    { 
      id: 'product_seller', 
      icon: Package, 
      label: '📦 Produtor Rural', 
      desc: 'Comercializo produtos agrícolas',
      color: '#10b981'
    },
    { 
      id: 'freight_buyer', 
      icon: Truck, 
      label: '🚛 Contratante de Frete', 
      desc: 'Necessito de serviços de transporte',
      color: '#8b5cf6'
    },
    { 
      id: 'product_buyer', 
      icon: ShoppingCart, 
      label: '🌾 Comprador', 
      desc: 'Adquiro insumos e produtos agrícolas',
      color: '#f59e0b'
    },
    { 
      id: 'store', 
      icon: Store, 
      label: '🏪 Loja Virtual', 
      desc: 'Estabelecimento comercial online',
      color: '#ec4899'
    }
  ];

  // Enviar código de verificação de email
  const sendVerificationCode = async () => {
    if (!formData.email) {
      toast.error('Por favor, insira seu email primeiro');
      return;
    }

    setIsLoading(true);
    try {
      console.log('Enviando código para:', formData.email);
      const result = await authService.resendVerificationEmail(formData.email);
      console.log('Resultado do envio:', result);
      
      if (result.success) {
        setEmailSent(true);
        const message = result.emailSent 
          ? `✅ Email ENVIADO! Código: ${result.emailCode}` 
          : `⚠️ Código gerado (email não enviado): ${result.emailCode}`;
        toast.success(message, { duration: 10000 });
        console.log('Email enviado com sucesso:', result.emailCode);
      } else {
        toast.error(result.error || 'Erro ao enviar email');
        console.error('Erro ao enviar:', result.error);
      }
    } catch (error) {
      console.error('Erro catch:', error);
      toast.error('Erro ao enviar email: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Verificar código de email
  const verifyEmailCode = async () => {
    if (!emailCode) {
      toast.error('Por favor, insira o código de verificação');
      return;
    }

    setIsLoading(true);
    try {
      const result = await authService.verifyEmail(formData.email, emailCode);
      if (result.success) {
        setEmailVerified(true);
        toast.success('Email verificado com sucesso!');
      } else {
        toast.error(result.error || 'Código inválido');
      }
    } catch (error) {
      toast.error('Erro ao verificar código');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = async e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Validações em tempo real
    await validateField(name, value);
  };

  const validateField = async (fieldName, value) => {
    let validation = null;

    switch (fieldName) {
      case 'cnpj':
        if (value.length >= 14) {
          validation = await validationService.validateCNPJ(value);
        }
        break;
      case 'cep':
        if (value.length >= 8) {
          validation = await validationService.validateCEP(value);
          if (validation.valid) {
            setFormData(prev => ({
              ...prev,
              address: validation.address || '',
              city: validation.city || '',
              state: validation.state || ''
            }));
          }
        }
        break;
      case 'phone':
        validation = validationService.validatePhone(value);
        break;
      case 'password':
        validation = validationService.validatePassword(value);
        break;
      case 'email':
        validation = validationService.validateEmail(value);
        break;
      default:
        break;
    }

    if (validation) {
      setValidations(prev => ({ ...prev, [fieldName]: validation }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validações básicas
    if (!accountType) newErrors.accountType = 'Escolha o tipo de conta';
    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
    if (!formData.email.trim()) newErrors.email = 'Email é obrigatório';
    if (!emailVerified) newErrors.emailVerification = 'Email deve ser verificado';
    if (!formData.password.trim()) newErrors.password = 'Senha é obrigatória';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Senhas não coincidem';
    if (!formData.company.trim()) newErrors.company = 'Empresa é obrigatória';
    if (!formData.phone.trim()) newErrors.phone = 'Telefone é obrigatório';
    if (!formData.cep.trim()) newErrors.cep = 'CEP é obrigatório';
    if (!formData.address.trim()) newErrors.address = 'Endereço é obrigatório';
    if (!formData.city.trim()) newErrors.city = 'Cidade é obrigatória';
    if (!formData.state.trim()) newErrors.state = 'UF é obrigatório';
    if (!formData.cpf.trim() && !formData.cnpj.trim()) {
      newErrors.cpf = 'CPF ou CNPJ é obrigatório';
      newErrors.cnpj = 'CPF ou CNPJ é obrigatório';
    }

    // Validações específicas por tipo
    if (accountType === 'freight_seller') {
      if (!formData.licensePlate.trim()) newErrors.licensePlate = 'Placa é obrigatória';
      if (!formData.vehicleModel.trim()) newErrors.vehicleModel = 'Modelo do veículo é obrigatório';
      if (!formData.freightDescription.trim()) newErrors.freightDescription = 'Descrição é obrigatória';
    }

    if (accountType === 'product_seller') {
      if (!formData.productName.trim()) newErrors.productName = 'Nome do produto é obrigatório';
      if (!formData.productDescription.trim()) newErrors.productDescription = 'Descrição é obrigatória';
      if (!formData.productPrice.trim()) newErrors.productPrice = 'Preço é obrigatório';
    }

    if (accountType === 'store') {
      if (!formData.storeName.trim()) newErrors.storeName = 'Nome da loja é obrigatório';
      if (!formData.storeDescription.trim()) newErrors.storeDescription = 'Descrição da loja é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    if (!turnstileToken) {
      toast.error('Complete a verificação de segurança');
      return;
    }

    setIsLoading(true);

    try {
      const api = process.env.REACT_APP_API_URL || '/api';
      
      // DEFINIR TIPO DE USUÁRIO BASEADO NA SELEÇÃO
      let userType = 'buyer';
      let businessType = 'all';
      
      if (accountType === 'freight_seller') {
        userType = 'carrier';
        businessType = 'freight';
      } else if (accountType === 'product_seller') {
        userType = 'seller';
        businessType = 'product';
      } else if (accountType === 'store') {
        userType = 'seller';
        businessType = 'store';
      } else if (accountType === 'freight_buyer') {
        userType = 'buyer';
        businessType = 'freight';
      } else if (accountType === 'product_buyer') {
        userType = 'buyer';
        businessType = 'product';
      }

      // 1. REGISTRO BÁSICO
      const registerRes = await fetch(`${api}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          company: formData.company,
          cep: formData.cep,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          cpf: formData.cpf,
          cnpj: formData.cnpj,
          ie: formData.ie,
          userType,
          businessType,
          turnstileToken
        })
      });

      if (!registerRes.ok) throw new Error('Falha no cadastro');
      const registerData = await registerRes.json();

      // Salvar token
      if (registerData?.data?.token) {
        localStorage.setItem('authToken', registerData.data.token);
        localStorage.setItem('user', JSON.stringify(registerData.data.user));
      }

      // 2. CADASTRAR DADOS ESPECÍFICOS (se aplicável)
      if (accountType === 'freight_seller') {
        // Cadastrar frete
        await fetch(`${api}/freights`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${registerData.data.token}`
          },
          body: JSON.stringify({
            licensePlate: formData.licensePlate,
            vehicleModel: formData.vehicleModel,
            vehicleType: formData.vehicleType,
            capacity: formData.capacity,
            description: formData.freightDescription,
            origin: formData.city,
            destination: '',
            price: 0
          })
        });
      }

      if (accountType === 'product_seller') {
        // Cadastrar produto
        await fetch(`${api}/products`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${registerData.data.token}`
          },
          body: JSON.stringify({
            name: formData.productName,
            description: formData.productDescription,
            category: formData.productCategory,
            price: formData.productPrice,
            quantity: formData.productQuantity || 1,
            unit: 'kg'
          })
        });
      }

      if (accountType === 'store') {
        // Cadastrar loja
        await fetch(`${api}/registration/loja`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${registerData.data.token}`
          },
          body: JSON.stringify({
            storeName: formData.storeName,
            storeDescription: formData.storeDescription,
            storeCategory: formData.storeCategory
          })
        });
      }

      // SUCESSO!
      toast.success('🎉 Conta criada com sucesso!');
      
      // REDIRECIONAR BASEADO NO TIPO
      if (accountType === 'store') {
        navigate('/planos?from=signup-store', { replace: true });
      } else {
        navigate('/user-dashboard', { replace: true });
      }

    } catch (error) {
      console.error('Erro no cadastro:', error);
      toast.error('Erro ao criar conta. Tente novamente.');
      setErrors({ general: 'Erro ao criar conta. Tente novamente.' });
    } finally {
      setIsLoading(false);
    }
  };

  // RENDERIZAR CAMPOS ESPECÍFICOS
  const renderSpecificFields = () => {
    if (accountType === 'freight_seller') {
      return (
        <motion.div variants={itemVariants} style={{ marginBottom: '2rem' }}>
          <h3 style={{ color: 'var(--text-primary)', marginBottom: '1rem', fontSize: '1.2rem', fontWeight: '600' }}>
            🚚 Dados do Frete
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                Placa do Veículo *
              </label>
              <input
                type='text'
                name='licensePlate'
                value={formData.licensePlate}
                onChange={handleInputChange}
                placeholder='ABC-1234'
                style={{
                  width: '100%', padding: '12px',
                  border: `2px solid ${errors.licensePlate ? '#dc2626' : 'rgba(15, 15, 15, 0.1)'}`,
                  borderRadius: '8px', fontSize: '1rem', background: 'white'
                }}
              />
              {errors.licensePlate && <p style={{ color: '#dc2626', fontSize: '0.85rem', marginTop: '0.25rem' }}>{errors.licensePlate}</p>}
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                Modelo do Veículo *
              </label>
              <input
                type='text'
                name='vehicleModel'
                value={formData.vehicleModel}
                onChange={handleInputChange}
                placeholder='Scania R450'
                style={{
                  width: '100%', padding: '12px',
                  border: `2px solid ${errors.vehicleModel ? '#dc2626' : 'rgba(15, 15, 15, 0.1)'}`,
                  borderRadius: '8px', fontSize: '1rem', background: 'white'
                }}
              />
              {errors.vehicleModel && <p style={{ color: '#dc2626', fontSize: '0.85rem', marginTop: '0.25rem' }}>{errors.vehicleModel}</p>}
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                Tipo de Veículo
              </label>
              <select
                name='vehicleType'
                value={formData.vehicleType}
                onChange={handleInputChange}
                style={{
                  width: '100%', padding: '12px',
                  border: '2px solid rgba(15, 15, 15, 0.1)',
                  borderRadius: '8px', fontSize: '1rem', background: 'white'
                }}
              >
                <option value='truck'>Caminhão</option>
                <option value='van'>Van</option>
                <option value='tractor'>Trator</option>
                <option value='pickup'>Pickup</option>
              </select>
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                Capacidade (ton)
              </label>
              <input
                type='number'
                name='capacity'
                value={formData.capacity}
                onChange={handleInputChange}
                placeholder='25'
                style={{
                  width: '100%', padding: '12px',
                  border: '2px solid rgba(15, 15, 15, 0.1)',
                  borderRadius: '8px', fontSize: '1rem', background: 'white'
                }}
              />
            </div>
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-primary)' }}>
              Descrição do Serviço *
            </label>
            <textarea
              name='freightDescription'
              value={formData.freightDescription}
              onChange={handleInputChange}
              placeholder='Descreva os serviços de frete que você oferece...'
              rows='4'
              style={{
                width: '100%', padding: '12px',
                border: `2px solid ${errors.freightDescription ? '#dc2626' : 'rgba(15, 15, 15, 0.1)'}`,
                borderRadius: '8px', fontSize: '1rem', background: 'white', resize: 'vertical'
              }}
            />
            {errors.freightDescription && <p style={{ color: '#dc2626', fontSize: '0.85rem', marginTop: '0.25rem' }}>{errors.freightDescription}</p>}
          </div>
        </motion.div>
      );
    }

    if (accountType === 'product_seller') {
      return (
        <motion.div variants={itemVariants} style={{ marginBottom: '2rem' }}>
          <h3 style={{ color: 'var(--text-primary)', marginBottom: '1rem', fontSize: '1.2rem', fontWeight: '600' }}>
            📦 Primeiro Produto
          </h3>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-primary)' }}>
              Nome do Produto *
            </label>
            <input
              type='text'
              name='productName'
              value={formData.productName}
              onChange={handleInputChange}
              placeholder='Soja em grão'
              style={{
                width: '100%', padding: '12px',
                border: `2px solid ${errors.productName ? '#dc2626' : 'rgba(15, 15, 15, 0.1)'}`,
                borderRadius: '8px', fontSize: '1rem', background: 'white'
              }}
            />
            {errors.productName && <p style={{ color: '#dc2626', fontSize: '0.85rem', marginTop: '0.25rem' }}>{errors.productName}</p>}
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-primary)' }}>
              Descrição *
            </label>
            <textarea
              name='productDescription'
              value={formData.productDescription}
              onChange={handleInputChange}
              placeholder='Descrição detalhada do produto...'
              rows='3'
              style={{
                width: '100%', padding: '12px',
                border: `2px solid ${errors.productDescription ? '#dc2626' : 'rgba(15, 15, 15, 0.1)'}`,
                borderRadius: '8px', fontSize: '1rem', background: 'white', resize: 'vertical'
              }}
            />
            {errors.productDescription && <p style={{ color: '#dc2626', fontSize: '0.85rem', marginTop: '0.25rem' }}>{errors.productDescription}</p>}
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                Categoria
              </label>
              <select
                name='productCategory'
                value={formData.productCategory}
                onChange={handleInputChange}
                style={{
                  width: '100%', padding: '12px',
                  border: '2px solid rgba(15, 15, 15, 0.1)',
                  borderRadius: '8px', fontSize: '1rem', background: 'white'
                }}
              >
                <option value='graos'>Grãos</option>
                <option value='frutas'>Frutas</option>
                <option value='hortalicas'>Hortaliças</option>
                <option value='outros'>Outros</option>
              </select>
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                Preço (R$/kg) *
              </label>
              <input
                type='number'
                name='productPrice'
                value={formData.productPrice}
                onChange={handleInputChange}
                placeholder='50.00'
                step='0.01'
                style={{
                  width: '100%', padding: '12px',
                  border: `2px solid ${errors.productPrice ? '#dc2626' : 'rgba(15, 15, 15, 0.1)'}`,
                  borderRadius: '8px', fontSize: '1rem', background: 'white'
                }}
              />
              {errors.productPrice && <p style={{ color: '#dc2626', fontSize: '0.85rem', marginTop: '0.25rem' }}>{errors.productPrice}</p>}
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                Quantidade (kg)
              </label>
              <input
                type='number'
                name='productQuantity'
                value={formData.productQuantity}
                onChange={handleInputChange}
                placeholder='1000'
                style={{
                  width: '100%', padding: '12px',
                  border: '2px solid rgba(15, 15, 15, 0.1)',
                  borderRadius: '8px', fontSize: '1rem', background: 'white'
                }}
              />
            </div>
          </div>
        </motion.div>
      );
    }

    if (accountType === 'store') {
      return (
        <motion.div variants={itemVariants} style={{ marginBottom: '2rem' }}>
          <h3 style={{ color: 'var(--text-primary)', marginBottom: '1rem', fontSize: '1.2rem', fontWeight: '600' }}>
            🏪 Dados da Loja
          </h3>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-primary)' }}>
              Nome da Loja *
            </label>
            <input
              type='text'
              name='storeName'
              value={formData.storeName}
              onChange={handleInputChange}
              placeholder='Agrícola São João'
              style={{
                width: '100%', padding: '12px',
                border: `2px solid ${errors.storeName ? '#dc2626' : 'rgba(15, 15, 15, 0.1)'}`,
                borderRadius: '8px', fontSize: '1rem', background: 'white'
              }}
            />
            {errors.storeName && <p style={{ color: '#dc2626', fontSize: '0.85rem', marginTop: '0.25rem' }}>{errors.storeName}</p>}
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-primary)' }}>
              Descrição da Loja *
            </label>
            <textarea
              name='storeDescription'
              value={formData.storeDescription}
              onChange={handleInputChange}
              placeholder='Conte um pouco sobre sua loja...'
              rows='4'
              style={{
                width: '100%', padding: '12px',
                border: `2px solid ${errors.storeDescription ? '#dc2626' : 'rgba(15, 15, 15, 0.1)'}`,
                borderRadius: '8px', fontSize: '1rem', background: 'white', resize: 'vertical'
              }}
            />
            {errors.storeDescription && <p style={{ color: '#dc2626', fontSize: '0.85rem', marginTop: '0.25rem' }}>{errors.storeDescription}</p>}
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-primary)' }}>
              Categoria Principal
            </label>
            <select
              name='storeCategory'
              value={formData.storeCategory}
              onChange={handleInputChange}
              style={{
                width: '100%', padding: '12px',
                border: '2px solid rgba(15, 15, 15, 0.1)',
                borderRadius: '8px', fontSize: '1rem', background: 'white'
              }}
            >
              <option value='graos'>Grãos</option>
              <option value='frutas'>Frutas</option>
              <option value='hortalicas'>Hortaliças</option>
              <option value='insumos'>Insumos</option>
              <option value='maquinas'>Máquinas</option>
              <option value='outros'>Outros</option>
            </select>
          </div>
          
          <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(236, 72, 153, 0.1)', borderRadius: '8px', border: '1px solid rgba(236, 72, 153, 0.2)' }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', margin: 0 }}>
              💡 <strong>Após o cadastro</strong> você será redirecionado para escolher um plano para sua loja!
            </p>
          </div>
        </motion.div>
      );
    }

    return null;
  };

  return (
    <>
      <section
        style={{
          minHeight: '100vh',
          background: 'var(--bg-gradient)',
          display: 'flex',
          alignItems: 'center',
          padding: '3rem 1rem'
        }}
      >
        <div className='container' style={{ maxWidth: '900px', margin: '0 auto' }}>
          <motion.div
            variants={heroVariants}
            initial='hidden'
            animate='visible'
            style={{
              background: 'var(--card-bg)',
              padding: 'clamp(2rem, 4vw, 3rem)',
              borderRadius: '20px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.12)',
              border: '1px solid rgba(15, 15, 15, 0.05)'
            }}
          >
            {/* Header */}
            <motion.div variants={itemVariants} style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <h1
                style={{
                  fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
                  fontWeight: '700',
                  marginBottom: '0.5rem',
                  background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                {t('register.title')}
              </h1>
              <p style={{ color: 'var(--muted)', fontSize: '1.05rem' }}>
                {t('register.subtitle')}
              </p>
            </motion.div>

            {errors.general && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  background: 'rgba(220, 38, 38, 0.1)',
                  border: '1px solid rgba(220, 38, 38, 0.2)',
                  borderRadius: '8px',
                  padding: '0.75rem',
                  marginBottom: '1.5rem',
                  color: '#dc2626',
                  fontSize: '0.9rem',
                  textAlign: 'center'
                }}
              >
                {errors.general}
              </motion.div>
            )}

            <form onSubmit={handleSubmit}>
              {/* SELETOR DE TIPO DE CONTA */}
              <motion.div variants={itemVariants} style={{ marginBottom: '2.5rem' }}>
                <h3 style={{ color: 'var(--text-primary)', marginBottom: '1.5rem', fontSize: '1.3rem', fontWeight: '600', textAlign: 'center' }}>
                  {t('register.chooseAccountType')}
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  {accountTypes.map(type => {
                    const Icon = type.icon;
                    return (
                      <motion.div
                        key={type.id}
                        whileHover={{ scale: 1.05, y: -5 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setAccountType(type.id)}
                        style={{
                          padding: '1.5rem',
                          borderRadius: '12px',
                          border: `3px solid ${accountType === type.id ? type.color : 'rgba(15, 15, 15, 0.1)'}`,
                          background: accountType === type.id ? `${type.color}15` : 'white',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          textAlign: 'center'
                        }}
                      >
                        <Icon size={32} style={{ color: type.color, marginBottom: '0.5rem' }} />
                        <h4 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                          {type.label}
                        </h4>
                        <p style={{ fontSize: '0.85rem', color: 'var(--muted)', margin: 0 }}>
                          {type.desc}
                        </p>
                      </motion.div>
                    );
                  })}
                </div>
                {errors.accountType && <p style={{ color: '#dc2626', fontSize: '0.9rem', marginTop: '0.5rem', textAlign: 'center' }}>{errors.accountType}</p>}
              </motion.div>

              {/* CAMPOS COMUNS - SÓ APARECEM DEPOIS DE ESCOLHER O TIPO */}
              {accountType && (
                <>
                  <motion.div variants={itemVariants} style={{ marginBottom: '2rem' }}>
                    <h3 style={{ color: 'var(--text-primary)', marginBottom: '1.5rem', fontSize: '1.3rem', fontWeight: '600', textAlign: 'center' }}>
                      2️⃣ Dados pessoais
                    </h3>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                      {/* Nome */}
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                          Nome Completo *
                        </label>
                        <input
                          type='text'
                          name='name'
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder='Seu nome completo'
                          style={{
                            width: '100%', padding: '12px',
                            border: `2px solid ${errors.name ? '#dc2626' : 'rgba(15, 15, 15, 0.1)'}`,
                            borderRadius: '8px', fontSize: '1rem', background: 'white'
                          }}
                        />
                        {errors.name && <p style={{ color: '#dc2626', fontSize: '0.85rem', marginTop: '0.25rem' }}>{errors.name}</p>}
                      </div>

                      {/* Email */}
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                          Email *
                        </label>
                        <input
                          type='email'
                          name='email'
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder='seu@email.com'
                          style={{
                            width: '100%', padding: '12px',
                            border: `2px solid ${errors.email ? '#dc2626' : 'rgba(15, 15, 15, 0.1)'}`,
                            borderRadius: '8px', fontSize: '1rem', background: 'white'
                          }}
                        />
                        {errors.email && <p style={{ color: '#dc2626', fontSize: '0.85rem', marginTop: '0.25rem' }}>{errors.email}</p>}
                      </div>
                    </div>

                    {/* VERIFICAÇÃO DE EMAIL */}
                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                        📧 Verificação de Email *
                      </label>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <div style={{ position: 'relative', flex: 1 }}>
                          <Mail size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
                          <input
                            type='text'
                            value={emailCode}
                            onChange={e => setEmailCode(e.target.value)}
                            placeholder='Código de 6 dígitos'
                            maxLength='6'
                            style={{
                              width: '100%', padding: '12px 12px 12px 44px', textAlign: 'center', fontFamily: 'monospace', fontSize: '1.1rem',
                              border: `2px solid ${emailVerified ? '#10b981' : 'rgba(15, 15, 15, 0.1)'}`,
                              borderRadius: '8px', background: emailVerified ? '#f0fdf4' : 'white',
                              color: emailVerified ? '#10b981' : 'inherit'
                            }}
                          />
                          {emailVerified && <CheckCircle size={20} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#10b981' }} />}
                        </div>
                        <button
                          type='button'
                          onClick={sendVerificationCode}
                          disabled={isLoading || !formData.email}
                          style={{
                            padding: '12px 20px', borderRadius: '8px', fontWeight: '600', fontSize: '0.9rem',
                            background: 'linear-gradient(135deg, #3b82f6, #2563eb)', color: 'white', border: 'none',
                            cursor: isLoading || !formData.email ? 'not-allowed' : 'pointer',
                            opacity: isLoading || !formData.email ? 0.5 : 1,
                            transition: 'all 0.2s ease', whiteSpace: 'nowrap'
                          }}
                        >
                          {isLoading ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : emailSent ? 'Reenviar' : 'Enviar'}
                        </button>
                        <button
                          type='button'
                          onClick={verifyEmailCode}
                          disabled={!emailCode || isLoading || emailVerified}
                          style={{
                            padding: '12px 20px', borderRadius: '8px', fontWeight: '600', fontSize: '0.9rem',
                            background: emailVerified ? '#10b981' : 'linear-gradient(135deg, #10b981, #059669)', color: 'white', border: 'none',
                            cursor: !emailCode || isLoading || emailVerified ? 'not-allowed' : 'pointer',
                            opacity: !emailCode || isLoading || emailVerified ? 0.5 : 1,
                            transition: 'all 0.2s ease', whiteSpace: 'nowrap'
                          }}
                        >
                          {isLoading ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : emailVerified ? <CheckCircle size={18} /> : 'Verificar'}
                        </button>
                      </div>
                      {emailVerified && (
                        <p style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.5rem', fontSize: '0.85rem', fontWeight: '600', color: '#10b981' }}>
                          <CheckCircle size={16} />
                          Email verificado com sucesso!
                        </p>
                      )}
                      {errors.emailVerification && <p style={{ color: '#dc2626', fontSize: '0.85rem', marginTop: '0.25rem' }}>{errors.emailVerification}</p>}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                      {/* Telefone */}
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                          Telefone *
                        </label>
                        <input
                          type='tel'
                          name='phone'
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder='(11) 99999-9999'
                          style={{
                            width: '100%', padding: '12px',
                            border: `2px solid ${errors.phone ? '#dc2626' : 'rgba(15, 15, 15, 0.1)'}`,
                            borderRadius: '8px', fontSize: '1rem', background: 'white'
                          }}
                        />
                        {errors.phone && <p style={{ color: '#dc2626', fontSize: '0.85rem', marginTop: '0.25rem' }}>{errors.phone}</p>}
                      </div>

                      {/* Empresa */}
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                          Empresa *
                        </label>
                        <input
                          type='text'
                          name='company'
                          value={formData.company}
                          onChange={handleInputChange}
                          placeholder='Nome da empresa'
                          style={{
                            width: '100%', padding: '12px',
                            border: `2px solid ${errors.company ? '#dc2626' : 'rgba(15, 15, 15, 0.1)'}`,
                            borderRadius: '8px', fontSize: '1rem', background: 'white'
                          }}
                        />
                        {errors.company && <p style={{ color: '#dc2626', fontSize: '0.85rem', marginTop: '0.25rem' }}>{errors.company}</p>}
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                      {/* Senha */}
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                          Senha *
                        </label>
                        <div style={{ position: 'relative' }}>
                          <input
                            type={showPassword ? 'text' : 'password'}
                            name='password'
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder='********'
                            style={{
                              width: '100%', padding: '12px', paddingRight: '44px',
                              border: `2px solid ${errors.password ? '#dc2626' : 'rgba(15, 15, 15, 0.1)'}`,
                              borderRadius: '8px', fontSize: '1rem', background: 'white'
                            }}
                          />
                          <button
                            type='button'
                            onClick={() => setShowPassword(!showPassword)}
                            style={{
                              position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                              background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)'
                            }}
                          >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                          </button>
                        </div>
                        {errors.password && <p style={{ color: '#dc2626', fontSize: '0.85rem', marginTop: '0.25rem' }}>{errors.password}</p>}
                      </div>

                      {/* Confirmar Senha */}
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                          Confirmar Senha *
                        </label>
                        <div style={{ position: 'relative' }}>
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            name='confirmPassword'
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            placeholder='********'
                            style={{
                              width: '100%', padding: '12px', paddingRight: '44px',
                              border: `2px solid ${errors.confirmPassword ? '#dc2626' : 'rgba(15, 15, 15, 0.1)'}`,
                              borderRadius: '8px', fontSize: '1rem', background: 'white'
                            }}
                          />
                          <button
                            type='button'
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            style={{
                              position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                              background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)'
                            }}
                          >
                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                          </button>
                        </div>
                        {errors.confirmPassword && <p style={{ color: '#dc2626', fontSize: '0.85rem', marginTop: '0.25rem' }}>{errors.confirmPassword}</p>}
                      </div>
                    </div>
                  </motion.div>

                  {/* ENDEREÇO */}
                  <motion.div variants={itemVariants} style={{ marginBottom: '2rem' }}>
                    <h3 style={{ color: 'var(--text-primary)', marginBottom: '1rem', fontSize: '1.2rem', fontWeight: '600' }}>
                      📍 Endereço
                    </h3>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr 1fr', gap: '1rem' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                          CEP *
                        </label>
                        <input
                          type='text'
                          name='cep'
                          value={formData.cep}
                          onChange={handleInputChange}
                          placeholder='00000-000'
                          style={{
                            width: '100%', padding: '12px',
                            border: `2px solid ${errors.cep ? '#dc2626' : 'rgba(15, 15, 15, 0.1)'}`,
                            borderRadius: '8px', fontSize: '1rem', background: 'white'
                          }}
                        />
                        {errors.cep && <p style={{ color: '#dc2626', fontSize: '0.85rem', marginTop: '0.25rem' }}>{errors.cep}</p>}
                      </div>
                      
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                          UF *
                        </label>
                        <input
                          type='text'
                          name='state'
                          value={formData.state}
                          onChange={handleInputChange}
                          placeholder='SP'
                          style={{
                            width: '100%', padding: '12px',
                            border: `2px solid ${errors.state ? '#dc2626' : 'rgba(15, 15, 15, 0.1)'}`,
                            borderRadius: '8px', fontSize: '1rem', background: 'white'
                          }}
                        />
                        {errors.state && <p style={{ color: '#dc2626', fontSize: '0.85rem', marginTop: '0.25rem' }}>{errors.state}</p>}
                      </div>
                      
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                          Endereço *
                        </label>
                        <input
                          type='text'
                          name='address'
                          value={formData.address}
                          onChange={handleInputChange}
                          placeholder='Rua, número'
                          style={{
                            width: '100%', padding: '12px',
                            border: `2px solid ${errors.address ? '#dc2626' : 'rgba(15, 15, 15, 0.1)'}`,
                            borderRadius: '8px', fontSize: '1rem', background: 'white'
                          }}
                        />
                        {errors.address && <p style={{ color: '#dc2626', fontSize: '0.85rem', marginTop: '0.25rem' }}>{errors.address}</p>}
                      </div>
                      
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                          Cidade *
                        </label>
                        <input
                          type='text'
                          name='city'
                          value={formData.city}
                          onChange={handleInputChange}
                          placeholder='Cidade'
                          style={{
                            width: '100%', padding: '12px',
                            border: `2px solid ${errors.city ? '#dc2626' : 'rgba(15, 15, 15, 0.1)'}`,
                            borderRadius: '8px', fontSize: '1rem', background: 'white'
                          }}
                        />
                        {errors.city && <p style={{ color: '#dc2626', fontSize: '0.85rem', marginTop: '0.25rem' }}>{errors.city}</p>}
                      </div>
                    </div>
                  </motion.div>

                  {/* DOCUMENTOS */}
                  <motion.div variants={itemVariants} style={{ marginBottom: '2rem' }}>
                    <h3 style={{ color: 'var(--text-primary)', marginBottom: '1rem', fontSize: '1.2rem', fontWeight: '600' }}>
                      📄 Documentos
                    </h3>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                          CPF
                        </label>
                        <input
                          type='text'
                          name='cpf'
                          value={formData.cpf}
                          onChange={handleInputChange}
                          placeholder='000.000.000-00'
                          style={{
                            width: '100%', padding: '12px',
                            border: `2px solid ${errors.cpf ? '#dc2626' : 'rgba(15, 15, 15, 0.1)'}`,
                            borderRadius: '8px', fontSize: '1rem', background: 'white'
                          }}
                        />
                      </div>
                      
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                          CNPJ
                        </label>
                        <input
                          type='text'
                          name='cnpj'
                          value={formData.cnpj}
                          onChange={handleInputChange}
                          placeholder='00.000.000/0000-00'
                          style={{
                            width: '100%', padding: '12px',
                            border: `2px solid ${errors.cnpj ? '#dc2626' : 'rgba(15, 15, 15, 0.1)'}`,
                            borderRadius: '8px', fontSize: '1rem', background: 'white'
                          }}
                        />
                      </div>
                      
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                          IE (opcional)
                        </label>
                        <input
                          type='text'
                          name='ie'
                          value={formData.ie}
                          onChange={handleInputChange}
                          placeholder='Inscrição Estadual'
                          style={{
                            width: '100%', padding: '12px',
                            border: '2px solid rgba(15, 15, 15, 0.1)',
                            borderRadius: '8px', fontSize: '1rem', background: 'white'
                          }}
                        />
                      </div>
                    </div>
                    <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                      * É obrigatório preencher CPF ou CNPJ
                    </p>
                    {(errors.cpf || errors.cnpj) && <p style={{ color: '#dc2626', fontSize: '0.85rem', marginTop: '0.25rem' }}>CPF ou CNPJ é obrigatório</p>}
                  </motion.div>

                  {/* CAMPOS ESPECÍFICOS POR TIPO */}
                  {renderSpecificFields()}

                  {/* TURNSTILE */}
                  <motion.div variants={itemVariants} style={{ marginBottom: '1.5rem' }}>
                    <CloudflareTurnstile onVerify={setTurnstileToken} onError={() => setTurnstileToken('')} />
                  </motion.div>

                  {/* BOTÃO SUBMIT */}
                  <motion.button
                    variants={itemVariants}
                    type='submit'
                    disabled={isLoading || !turnstileToken}
                    style={{
                      width: '100%',
                      padding: '16px',
                      background: isLoading ? 'var(--muted)' : 'linear-gradient(135deg, var(--primary), var(--secondary))',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '1.1rem',
                      fontWeight: '700',
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.75rem',
                      boxShadow: '0 8px 20px rgba(42, 127, 79, 0.3)'
                    }}
                    whileHover={!isLoading ? { scale: 1.02, boxShadow: '0 12px 30px rgba(42, 127, 79, 0.4)' } : {}}
                    whileTap={!isLoading ? { scale: 0.98 } : {}}
                  >
                    {isLoading ? (
                      <>
                        <div
                          className='spin-animation'
                          style={{
                            width: '24px',
                            height: '24px',
                            border: '3px solid transparent',
                            borderTop: '3px solid white',
                            borderRadius: '50%'
                          }}
                        />
                        Criando sua conta...
                      </>
                    ) : (
                      <>
                        🚀 Criar Conta Agora
                        <ArrowRight size={24} />
                      </>
                    )}
                  </motion.button>
                </>
              )}
            </form>

            <motion.div variants={itemVariants} style={{ textAlign: 'center', marginTop: '2rem' }}>
              <p style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>
                Já tem uma conta?{' '}
                <Link
                  to='/login'
                  style={{
                    color: 'var(--accent)',
                    textDecoration: 'none',
                    fontWeight: '600',
                    borderBottom: '2px solid transparent',
                    transition: 'border-color 0.2s ease'
                  }}
                  onMouseEnter={e => (e.target.style.borderColor = 'var(--accent)')}
                  onMouseLeave={e => (e.target.style.borderColor = 'transparent')}
                >
                  Fazer Login
                </Link>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default SignupUnified;

