import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, Phone, ArrowRight, User, Mail } from 'lucide-react';
import { toast } from 'react-hot-toast';
// Modern UI components intentionally not used on this page (kept for future UI upgrades)

const SignupStore = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // Dados Pessoais (já cadastrados - só para exibição)
    name: '',
    email: '',
    phone: '',
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

    // Dados da Loja
    storeName: '',
    storeDescription: '',
    storeCategory: '',

    // Produtos
    productName: '',
    productDescription: '',
    productCategory: '',
    productPrice: '',
    productStock: '',
    productWeight: '',

    // Tipo fixo - LOJA
    userType: 'store',
    businessType: 'store'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Carregar dados do usuário logado
  useEffect(() => {
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    if (!token) {
      toast.error('Você precisa estar logado para completar seu perfil');
      navigate('/login');
      return;
    }

    // Buscar dados do usuário logado
    const fetchUserData = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'https://backend.contato-00d.workers.dev';
        const response = await fetch(`${apiUrl}/api/user/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const userData = await response.json();
          setFormData(prev => ({
            ...prev,
            name: userData.data?.name || '',
            email: userData.data?.email || ''
          }));
        }
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
      }
    };

    fetchUserData();
  }, [navigate]);

  const heroVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.8, ease: 'easeOut' }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' }
    }
  };

  const handleInputChange = async e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Validações em tempo real
    await validateField(name, value);
  };

  const validateField = async (fieldName, value) => {
    // Validações removidas temporariamente - validationService não está mais importado
    // Se necessário, reimporte: import validationService from '../services/validationService';
    return;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.company.trim()) {
      newErrors.company = 'Empresa é obrigatória';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório';
    }

    // Validações de endereço
    if (!formData.cep.trim()) {
      newErrors.cep = 'CEP é obrigatório';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Endereço é obrigatório';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'Cidade é obrigatória';
    }
    if (!formData.state.trim()) {
      newErrors.state = 'UF é obrigatório';
    }

    // Validação CPF ou CNPJ (pelo menos um obrigatório)
    if (!formData.cpf.trim() && !formData.cnpj.trim()) {
      newErrors.cpf = 'CPF ou CNPJ é obrigatório';
      newErrors.cnpj = 'CPF ou CNPJ é obrigatório';
    }

    // Validações de produto
    if (!formData.productName.trim()) {
      newErrors.productName = 'Nome do produto é obrigatório';
    }
    if (!formData.productCategory.trim()) {
      newErrors.productCategory = 'Categoria é obrigatória';
    }
    if (!formData.productDescription.trim()) {
      newErrors.productDescription = 'Descrição é obrigatória';
    }
    if (!formData.productPrice) {
      newErrors.productPrice = 'Preço é obrigatório';
    }
    if (!formData.productStock) {
      newErrors.productStock = 'Estoque é obrigatório';
    }


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async e => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      if (!token) {
        toast.error('Você precisa estar logado');
        navigate('/login');
        return;
      }

      // Atualizar perfil do usuário logado
      const apiUrl = process.env.REACT_APP_API_URL || 'https://backend.contato-00d.workers.dev';
      const response = await fetch(`${apiUrl}/api/user/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phone: formData.phone,
          company: formData.company,
          cep: formData.cep,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          cpf: formData.cpf,
          cnpj: formData.cnpj,
          ie: formData.ie,
          userType: 'store',
          businessType: 'store'
        })
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar perfil');
      }

      // Criar primeira loja e produto
      if (formData.storeName && formData.productName) {
        // Aqui você pode criar a loja e o primeiro produto
        // Por enquanto, apenas redirecionamos para o dashboard
      }

      toast.success('Perfil de loja criado com sucesso!');
      navigate('/user-dashboard');
    } catch (error) {
      console.error('Erro ao completar perfil:', error);
      toast.error(error.message || 'Erro ao completar perfil');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Header já incluído no App.js */}

      <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4'>
        <div className='mx-auto w-full max-w-6xl'>
          <div className='grid grid-cols-1 items-center gap-8 lg:grid-cols-2'>
            {/* Left Side - Info */}
            <motion.div
              variants={heroVariants}
              initial='hidden'
              animate='visible'
              className='agro-text-center'
              style={{ color: 'var(--text-primary)' }}
            >
              <motion.div variants={itemVariants} style={{ marginBottom: '2rem' }}>
                <div
                  style={{
                    width: '100px',
                    height: '100px',
                    margin: '0 auto',
                    background: 'var(--accent)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    boxShadow: '0 6px 20px rgba(42, 127, 79, 0.3)'
                  }}
                >
                  <Building2 size={40} />
                </div>
              </motion.div>

              <motion.h1
                style={{
                  fontSize: '2.5rem',
                  fontWeight: '800',
                  marginBottom: '1rem',
                  color: 'var(--text-primary)'
                }}
                variants={itemVariants}
              >
                Junte-se ao Agroisync!
              </motion.h1>

              <motion.p
                style={{
                  fontSize: '1.1rem',
                  color: 'var(--muted)',
                  marginBottom: '2rem',
                  lineHeight: '1.6'
                }}
                variants={itemVariants}
              >
                Crie sua conta e comece sua jornada no futuro do agronegócio digital.
              </motion.p>

              <motion.div
                variants={itemVariants}
                style={{
                  display: 'flex',
                  gap: '1rem',
                  justifyContent: 'center',
                  flexWrap: 'wrap'
                }}
              >
                <div
                  style={{
                    padding: '0.5rem 1rem',
                    background: 'rgba(42, 127, 79, 0.1)',
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                    color: 'var(--accent)',
                    fontWeight: '600'
                  }}
                >
                  ✓ Gratuito
                </div>
                <div
                  style={{
                    padding: '0.5rem 1rem',
                    background: 'rgba(42, 127, 79, 0.1)',
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                    color: 'var(--accent)',
                    fontWeight: '600'
                  }}
                >
                  ✓ Sem compromisso
                </div>
                <div
                  style={{
                    padding: '0.5rem 1rem',
                    background: 'rgba(42, 127, 79, 0.1)',
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                    color: 'var(--accent)',
                    fontWeight: '600'
                  }}
                >
                  ✓ Suporte 24/7
                </div>
              </motion.div>
            </motion.div>

            {/* Right Side - Form */}
            <motion.div
              variants={heroVariants}
              initial='hidden'
              animate='visible'
              className='rounded-3xl border border-white/30 bg-white/90 p-8 shadow-2xl shadow-blue-500/20 backdrop-blur-xl'
            >
              <motion.div variants={itemVariants} className='mb-8 text-center'>
                <h2 className='mb-2 text-3xl font-bold text-gray-900'>Cadastro - Loja/Produtor</h2>
                <p style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>
                  Preencha os dados abaixo para criar sua conta
                </p>

                {/* Plano Selecionado */}
                <div
                  style={{
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    borderRadius: '15px',
                    padding: '1.5rem',
                    marginTop: '1rem',
                    color: 'white',
                    textAlign: 'center'
                  }}
                >
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                    📦 Plano Selecionado: {formData.planName}
                  </h3>
                  <p style={{ fontSize: '1rem', opacity: 0.9, marginBottom: '0.5rem' }}>
                    R$ {formData.planPrice}/{formData.planPeriod} • Até {formData.maxProducts} produtos
                  </p>
                  <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>Ideal para lojas como a Agrobiológica</p>
                </div>
              </motion.div>

              {errors.general && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    background: 'rgba(220, 38, 38, 0.1)',
                    border: '1px solid rgba(220, 38, 38, 0.2)',
                    borderRadius: '16px',
                    padding: '0.75rem',
                    marginBottom: '1.5rem',
                    color: '#dc2626',
                    fontSize: '0.9rem'
                  }}
                >
                  {errors.general}
                </motion.div>
              )}

              <form onSubmit={handleSubmit}>
                <motion.div variants={itemVariants} style={{ marginBottom: '1.5rem' }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontWeight: '600',
                      color: 'var(--text-primary)'
                    }}
                  >
                    Nome Completo
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User
                      size={20}
                      style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--muted)'
                      }}
                    />
                    <input
                      type='text'
                      name='name'
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder='Seu nome completo'
                      className={`w-full rounded-2xl border-2 bg-gray-50/80 px-4 py-4 pl-12 text-gray-900 placeholder-gray-500 transition-all duration-300 hover:bg-gray-100/80 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${errors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200'}`}
                      onFocus={e => {
                        e.target.style.background = 'white';
                        e.target.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.1)';
                      }}
                      onBlur={e => {
                        e.target.style.background = 'rgba(248, 250, 252, 0.8)';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                  {errors.name && (
                    <p style={{ color: '#dc2626', fontSize: '0.85rem', marginTop: '0.25rem' }}>{errors.name}</p>
                  )}
                </motion.div>

                <motion.div variants={itemVariants} style={{ marginBottom: '1.5rem' }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontWeight: '600',
                      color: 'var(--text-primary)'
                    }}
                  >
                    Email
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail
                      size={20}
                      style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--muted)'
                      }}
                    />
                    <input
                      type='email'
                      name='email'
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder='seu@email.com'
                      style={{
                        width: '100%',
                        padding: '12px 12px 12px 44px',
                        border: `2px solid ${errors.email ? '#dc2626' : 'rgba(15, 15, 15, 0.1)'}`,
                        borderRadius: '16px',
                        fontSize: '1rem',
                        background: 'white',
                        transition: 'all 0.2s ease',
                        outline: 'none'
                      }}
                      onFocus={e => {
                        e.target.style.borderColor = 'var(--accent)';
                      }}
                      onBlur={e => {
                        e.target.style.borderColor = errors.email ? '#dc2626' : 'rgba(15, 15, 15, 0.1)';
                      }}
                    />
                  </div>
                  {errors.email && (
                    <p style={{ color: '#dc2626', fontSize: '0.85rem', marginTop: '0.25rem' }}>{errors.email}</p>
                  )}
                </motion.div>

                <motion.div variants={itemVariants} style={{ marginBottom: '1.5rem' }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontWeight: '600',
                      color: 'var(--text-primary)'
                    }}
                  >
                    Empresa
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Building2
                      size={20}
                      style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--muted)'
                      }}
                    />
                    <input
                      type='text'
                      name='company'
                      value={formData.company}
                      onChange={handleInputChange}
                      placeholder='Nome da sua empresa'
                      style={{
                        width: '100%',
                        padding: '12px 12px 12px 44px',
                        border: `2px solid ${errors.company ? '#dc2626' : 'rgba(15, 15, 15, 0.1)'}`,
                        borderRadius: '16px',
                        fontSize: '1rem',
                        background: 'white',
                        transition: 'all 0.2s ease',
                        outline: 'none'
                      }}
                      onFocus={e => {
                        e.target.style.borderColor = 'var(--accent)';
                      }}
                      onBlur={e => {
                        e.target.style.borderColor = errors.company ? '#dc2626' : 'rgba(15, 15, 15, 0.1)';
                      }}
                    />
                  </div>
                  {errors.company && (
                    <p style={{ color: '#dc2626', fontSize: '0.85rem', marginTop: '0.25rem' }}>{errors.company}</p>
                  )}
                </motion.div>

                <motion.div variants={itemVariants} style={{ marginBottom: '1.5rem' }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontWeight: '600',
                      color: 'var(--text-primary)'
                    }}
                  >
                    Telefone *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Phone
                      size={20}
                      style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--muted)'
                      }}
                    />
                    <input
                      type='tel'
                      name='phone'
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder='(11) 99999-9999'
                      style={{
                        width: '100%',
                        padding: '12px 12px 12px 44px',
                        border: `2px solid ${errors.phone ? '#dc2626' : 'rgba(15, 15, 15, 0.1)'}`,
                        borderRadius: '16px',
                        fontSize: '1rem',
                        background: 'white',
                        transition: 'all 0.2s ease',
                        outline: 'none'
                      }}
                      onFocus={e => {
                        e.target.style.borderColor = 'var(--accent)';
                      }}
                      onBlur={e => {
                        e.target.style.borderColor = errors.phone ? '#dc2626' : 'rgba(15, 15, 15, 0.1)';
                      }}
                    />
                  </div>
                  {errors.phone && (
                    <p style={{ color: '#dc2626', fontSize: '0.85rem', marginTop: '0.25rem' }}>{errors.phone}</p>
                  )}
                </motion.div>


                {/* SEÇÃO ENDEREÇO */}
                <motion.div variants={itemVariants} style={{ marginBottom: '2rem' }}>
                  <h3
                    style={{
                      color: 'var(--text-primary)',
                      marginBottom: '1rem',
                      fontSize: '1.2rem',
                      fontWeight: '600'
                    }}
                  >
                    📍 Endereço
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <label
                        style={{
                          display: 'block',
                          marginBottom: '0.5rem',
                          fontWeight: '600',
                          color: 'var(--text-primary)'
                        }}
                      >
                        CEP *
                      </label>
                      <input
                        type='text'
                        name='cep'
                        value={formData.cep}
                        onChange={handleInputChange}
                        placeholder='00000-000'
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: `2px solid ${errors.cep ? '#dc2626' : 'rgba(15, 15, 15, 0.1)'}`,
                          borderRadius: '12px',
                          fontSize: '1rem',
                          background: 'rgba(248, 250, 252, 0.8)',
                          transition: 'all 0.3s ease',
                          outline: 'none'
                        }}
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          display: 'block',
                          marginBottom: '0.5rem',
                          fontWeight: '600',
                          color: 'var(--text-primary)'
                        }}
                      >
                        UF *
                      </label>
                      <input
                        type='text'
                        name='state'
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder='SP'
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: `2px solid ${errors.state ? '#dc2626' : 'rgba(15, 15, 15, 0.1)'}`,
                          borderRadius: '12px',
                          fontSize: '1rem',
                          background: 'rgba(248, 250, 252, 0.8)',
                          transition: 'all 0.3s ease',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <label
                        style={{
                          display: 'block',
                          marginBottom: '0.5rem',
                          fontWeight: '600',
                          color: 'var(--text-primary)'
                        }}
                      >
                        Endereço *
                      </label>
                      <input
                        type='text'
                        name='address'
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder='Rua, número'
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: `2px solid ${errors.address ? '#dc2626' : 'rgba(15, 15, 15, 0.1)'}`,
                          borderRadius: '12px',
                          fontSize: '1rem',
                          background: 'rgba(248, 250, 252, 0.8)',
                          transition: 'all 0.3s ease',
                          outline: 'none'
                        }}
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          display: 'block',
                          marginBottom: '0.5rem',
                          fontWeight: '600',
                          color: 'var(--text-primary)'
                        }}
                      >
                        Cidade *
                      </label>
                      <input
                        type='text'
                        name='city'
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder='Cidade'
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: `2px solid ${errors.city ? '#dc2626' : 'rgba(15, 15, 15, 0.1)'}`,
                          borderRadius: '12px',
                          fontSize: '1rem',
                          background: 'rgba(248, 250, 252, 0.8)',
                          transition: 'all 0.3s ease',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>
                </motion.div>

                {/* SEÇÃO DOCUMENTOS */}
                <motion.div variants={itemVariants} style={{ marginBottom: '2rem' }}>
                  <h3
                    style={{
                      color: 'var(--text-primary)',
                      marginBottom: '1rem',
                      fontSize: '1.2rem',
                      fontWeight: '600'
                    }}
                  >
                    📄 Documentos
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label
                        style={{
                          display: 'block',
                          marginBottom: '0.5rem',
                          fontWeight: '600',
                          color: 'var(--text-primary)'
                        }}
                      >
                        CPF
                      </label>
                      <input
                        type='text'
                        name='cpf'
                        value={formData.cpf}
                        onChange={handleInputChange}
                        placeholder='000.000.000-00'
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: `2px solid ${errors.cpf ? '#dc2626' : 'rgba(15, 15, 15, 0.1)'}`,
                          borderRadius: '12px',
                          fontSize: '1rem',
                          background: 'rgba(248, 250, 252, 0.8)',
                          transition: 'all 0.3s ease',
                          outline: 'none'
                        }}
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          display: 'block',
                          marginBottom: '0.5rem',
                          fontWeight: '600',
                          color: 'var(--text-primary)'
                        }}
                      >
                        CNPJ
                      </label>
                      <input
                        type='text'
                        name='cnpj'
                        value={formData.cnpj}
                        onChange={handleInputChange}
                        placeholder='00.000.000/0000-00'
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: `2px solid ${errors.cnpj ? '#dc2626' : 'rgba(15, 15, 15, 0.1)'}`,
                          borderRadius: '12px',
                          fontSize: '1rem',
                          background: 'rgba(248, 250, 252, 0.8)',
                          transition: 'all 0.3s ease',
                          outline: 'none'
                        }}
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          display: 'block',
                          marginBottom: '0.5rem',
                          fontWeight: '600',
                          color: 'var(--text-primary)'
                        }}
                      >
                        IE
                      </label>
                      <input
                        type='text'
                        name='ie'
                        value={formData.ie}
                        onChange={handleInputChange}
                        placeholder='Inscrição Estadual'
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: `2px solid ${errors.ie ? '#dc2626' : 'rgba(15, 15, 15, 0.1)'}`,
                          borderRadius: '12px',
                          fontSize: '1rem',
                          background: 'rgba(248, 250, 252, 0.8)',
                          transition: 'all 0.3s ease',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>
                  <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                    * É obrigatório preencher CPF ou CNPJ
                  </p>
                </motion.div>

                {/* SEÇÃO PRODUTOS */}
                <motion.div variants={itemVariants} style={{ marginBottom: '2rem' }}>
                  <h3
                    style={{
                      color: 'var(--text-primary)',
                      marginBottom: '1rem',
                      fontSize: '1.2rem',
                      fontWeight: '600'
                    }}
                  >
                    🛍️ Produtos
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <label
                        style={{
                          display: 'block',
                          marginBottom: '0.5rem',
                          fontWeight: '600',
                          color: 'var(--text-primary)'
                        }}
                      >
                        Nome do produto *
                      </label>
                      <input
                        type='text'
                        name='productName'
                        value={formData.productName}
                        onChange={handleInputChange}
                        placeholder='Ex: Soja Premium'
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: `2px solid ${errors.productName ? '#dc2626' : 'rgba(15, 15, 15, 0.1)'}`,
                          borderRadius: '12px',
                          fontSize: '1rem',
                          background: 'rgba(248, 250, 252, 0.8)',
                          transition: 'all 0.3s ease',
                          outline: 'none'
                        }}
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          display: 'block',
                          marginBottom: '0.5rem',
                          fontWeight: '600',
                          color: 'var(--text-primary)'
                        }}
                      >
                        Categoria *
                      </label>
                      <select
                        name='productCategory'
                        value={formData.productCategory}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: `2px solid ${errors.productCategory ? '#dc2626' : 'rgba(15, 15, 15, 0.1)'}`,
                          borderRadius: '12px',
                          fontSize: '1rem',
                          background: 'rgba(248, 250, 252, 0.8)',
                          transition: 'all 0.3s ease',
                          outline: 'none'
                        }}
                      >
                        <option value=''>Selecione a categoria</option>
                        <option value='grains'>Grãos</option>
                        <option value='vegetables'>Hortaliças</option>
                        <option value='fruits'>Frutas</option>
                        <option value='livestock'>Pecuária</option>
                        <option value='equipment'>Equipamentos</option>
                        <option value='seeds'>Sementes</option>
                        <option value='fertilizers'>Fertilizantes</option>
                        <option value='other'>Outros</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        fontWeight: '600',
                        color: 'var(--text-primary)'
                      }}
                    >
                      Descrição do produto *
                    </label>
                    <textarea
                      name='productDescription'
                      value={formData.productDescription}
                      onChange={handleInputChange}
                      placeholder='Descreva o produto, qualidade, origem...'
                      rows={3}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: `2px solid ${errors.productDescription ? '#dc2626' : 'rgba(15, 15, 15, 0.1)'}`,
                        borderRadius: '12px',
                        fontSize: '1rem',
                        background: 'rgba(248, 250, 252, 0.8)',
                        transition: 'all 0.3s ease',
                        outline: 'none',
                        resize: 'vertical'
                      }}
                    />
                  </div>

                  <div
                    style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}
                  >
                    <div>
                      <label
                        style={{
                          display: 'block',
                          marginBottom: '0.5rem',
                          fontWeight: '600',
                          color: 'var(--text-primary)'
                        }}
                      >
                        Preço (R$) *
                      </label>
                      <input
                        type='number'
                        step='0.01'
                        name='productPrice'
                        value={formData.productPrice}
                        onChange={handleInputChange}
                        placeholder='25.50'
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: `2px solid ${errors.productPrice ? '#dc2626' : 'rgba(15, 15, 15, 0.1)'}`,
                          borderRadius: '12px',
                          fontSize: '1rem',
                          background: 'rgba(248, 250, 252, 0.8)',
                          transition: 'all 0.3s ease',
                          outline: 'none'
                        }}
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          display: 'block',
                          marginBottom: '0.5rem',
                          fontWeight: '600',
                          color: 'var(--text-primary)'
                        }}
                      >
                        Estoque (kg) *
                      </label>
                      <input
                        type='number'
                        name='productStock'
                        value={formData.productStock}
                        onChange={handleInputChange}
                        placeholder='1000'
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: `2px solid ${errors.productStock ? '#dc2626' : 'rgba(15, 15, 15, 0.1)'}`,
                          borderRadius: '12px',
                          fontSize: '1rem',
                          background: 'rgba(248, 250, 252, 0.8)',
                          transition: 'all 0.3s ease',
                          outline: 'none'
                        }}
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          display: 'block',
                          marginBottom: '0.5rem',
                          fontWeight: '600',
                          color: 'var(--text-primary)'
                        }}
                      >
                        Peso (kg)
                      </label>
                      <input
                        type='number'
                        name='productWeight'
                        value={formData.productWeight}
                        onChange={handleInputChange}
                        placeholder='50'
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: `2px solid ${errors.productWeight ? '#dc2626' : 'rgba(15, 15, 15, 0.1)'}`,
                          borderRadius: '12px',
                          fontSize: '1rem',
                          background: 'rgba(248, 250, 252, 0.8)',
                          transition: 'all 0.3s ease',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label
                        style={{
                          display: 'block',
                          marginBottom: '0.5rem',
                          fontWeight: '600',
                          color: 'var(--text-primary)'
                        }}
                      >
                        Origem
                      </label>
                      <input
                        type='text'
                        name='productOrigin'
                        value={formData.productOrigin}
                        onChange={handleInputChange}
                        placeholder='Ex: São Paulo, Brasil'
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: `2px solid ${errors.productOrigin ? '#dc2626' : 'rgba(15, 15, 15, 0.1)'}`,
                          borderRadius: '12px',
                          fontSize: '1rem',
                          background: 'rgba(248, 250, 252, 0.8)',
                          transition: 'all 0.3s ease',
                          outline: 'none'
                        }}
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          display: 'block',
                          marginBottom: '0.5rem',
                          fontWeight: '600',
                          color: 'var(--text-primary)'
                        }}
                      >
                        Qualidade
                      </label>
                      <select
                        name='productQuality'
                        value={formData.productQuality}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: `2px solid ${errors.productQuality ? '#dc2626' : 'rgba(15, 15, 15, 0.1)'}`,
                          borderRadius: '12px',
                          fontSize: '1rem',
                          background: 'rgba(248, 250, 252, 0.8)',
                          transition: 'all 0.3s ease',
                          outline: 'none'
                        }}
                      >
                        <option value=''>Selecione a qualidade</option>
                        <option value='premium'>Premium</option>
                        <option value='standard'>Padrão</option>
                        <option value='basic'>Básica</option>
                        <option value='organic'>Orgânica</option>
                      </select>
                    </div>
                  </div>
                </motion.div>

                {/* SEÇÃO UPLOAD DE IMAGEM */}
                <motion.div variants={itemVariants} style={{ marginBottom: '2rem' }}>
                  <h3
                    style={{
                      color: 'var(--text-primary)',
                      marginBottom: '1rem',
                      fontSize: '1.2rem',
                      fontWeight: '600'
                    }}
                  >
                    📸 Imagem do Produto
                  </h3>

                  <div style={{ marginBottom: '1rem' }}>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        fontWeight: '600',
                        color: 'var(--text-primary)'
                      }}
                    >
                      Foto do produto
                    </label>
                    <input
                      type='file'
                      name='productImage'
                      onChange={handleInputChange}
                      accept='image/*'
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: `2px solid ${errors.productImage ? '#dc2626' : 'rgba(15, 15, 15, 0.1)'}`,
                        borderRadius: '12px',
                        fontSize: '1rem',
                        background: 'rgba(248, 250, 252, 0.8)',
                        transition: 'all 0.3s ease',
                        outline: 'none'
                      }}
                    />
                    <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                      Formatos aceitos: JPG, PNG, GIF (máx. 5MB)
                    </p>
                  </div>
                </motion.div>


                <motion.button
                  variants={itemVariants}
                  type='submit'
                  disabled={isLoading}
                  className={`flex w-full items-center justify-center gap-3 rounded-2xl px-6 py-4 text-lg font-semibold text-white transition-all duration-300 ${
                    isLoading
                      ? 'cursor-not-allowed bg-gray-400'
                      : 'transform bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg hover:-translate-y-0.5 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl'
                  }`}
                  whileHover={!isLoading ? { scale: 1.02 } : {}}
                  whileTap={!isLoading ? { scale: 0.98 } : {}}
                >
                  {isLoading ? (
                    <>
                      <div
                        className='spin-animation'
                        style={{
                          width: '20px',
                          height: '20px',
                          border: '2px solid transparent',
                          borderTop: '2px solid white',
                          borderRadius: '50%'
                        }}
                      />
                      Criando conta...
                    </>
                  ) : (
                    <>
                      Cadastro - Loja/Produtor
                      <ArrowRight size={20} />
                    </>
                  )}
                </motion.button>
              </form>

              <motion.div variants={itemVariants} style={{ textAlign: 'center', marginTop: '2rem' }}>
                <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
                  Já tem uma conta?{' '}
                  <Link
                    to='/login'
                    style={{
                      color: 'var(--accent)',
                      textDecoration: 'none',
                      fontWeight: '600'
                    }}
                  >
                    Fazer Login
                  </Link>
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Footer já incluído no App.js */}
    </>
  );
};

export default SignupStore;
