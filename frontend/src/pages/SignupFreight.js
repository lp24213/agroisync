import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, Phone, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import freightService from '../services/freightService';

const SignupFreight = () => {
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

    // Dados do Veículo (Completo - estilo FreteBrás)
    licensePlate: '',
    vehicleType: '',
    vehicleBrand: '', // Marca (Mercedes, Scania, Volvo, etc)
    vehicleModel: '', // Modelo específico
    vehicleYear: '', // Ano de fabricação
    vehicleColor: '', // Cor do veículo
    capacity: '', // Capacidade em toneladas
    vehicleBodyType: '', // Tipo de carroceria (baú, sider, graneleiro, etc)
    vehicleAxles: '', // Número de eixos
    chassisNumber: '', // Número do chassi
    renavam: '', // RENAVAM
    antt: '', // Número ANTT
    crlv: '', // CRLV (documento do veículo)

    // Serviços de Frete
    freightDescription: '',
    freightPrice: '',
    freightRoute: '',
    freightAvailability: '',

    // Tipo fixo - TRANSPORTADOR
    userType: 'transporter',
    businessType: 'transporter'
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
        const response = await fetch('/api/user/profile', {
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

    // Validações de veículo
    if (!formData.licensePlate.trim()) {
      newErrors.licensePlate = 'Placa é obrigatória';
    }
    if (!formData.vehicleModel.trim()) {
      newErrors.vehicleModel = 'Modelo é obrigatório';
    }

    // Validações de serviços
    if (!formData.freightDescription.trim()) {
      newErrors.freightDescription = 'Descrição dos serviços é obrigatória';
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
      const response = await fetch('/api/user/profile', {
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
          userType: 'transporter',
          businessType: 'transporter'
        })
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar perfil');
      }

      // Criar primeiro frete
      if (formData.freightDescription && formData.freightRoute) {
        await freightService.createFreight({
          description: formData.freightDescription,
          price: parseFloat(formData.freightPrice) || 0,
          route: formData.freightRoute,
          availability: formData.freightAvailability,
          // Dados completos do veículo
          vehicleType: formData.vehicleType,
          vehicleBrand: formData.vehicleBrand,
          vehicleModel: formData.vehicleModel,
          vehicleYear: formData.vehicleYear,
          vehicleColor: formData.vehicleColor,
          capacity: formData.capacity,
          vehicleBodyType: formData.vehicleBodyType,
          vehicleAxles: formData.vehicleAxles,
          licensePlate: formData.licensePlate,
          chassisNumber: formData.chassisNumber,
          renavam: formData.renavam,
          antt: formData.antt
        });
      }

      toast.success('Perfil de transportador criado com sucesso!');
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

      <section
        style={{
          minHeight: '100vh',
          background: 'var(--bg-gradient)',
          display: 'flex',
          alignItems: 'center',
          padding: '2rem 0'
        }}
      >
        <div className='container'>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
              gap: '3rem',
              alignItems: 'center',
              maxWidth: '1000px',
              margin: '0 auto'
            }}
          >
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
              style={{
                background: 'var(--card-bg)',
                padding: '2.5rem',
                borderRadius: '16px',
                boxShadow: '0 12px 30px rgba(0, 0, 0, 0.08)',
                border: '1px solid rgba(15, 15, 15, 0.05)'
              }}
            >
              <motion.div variants={itemVariants} style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h2
                  style={{
                    fontSize: '1.8rem',
                    fontWeight: '700',
                    marginBottom: '0.5rem',
                    color: 'var(--text-primary)'
                  }}
                >
                  Complete seu Perfil - Transportador
                </h2>
                <p style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>
                  Complete seus dados de transportador e cadastre seu primeiro frete
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
                    fontSize: '0.9rem'
                  }}
                >
                  {errors.general}
                </motion.div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Dados do usuário logado (somente exibição) */}
                <motion.div variants={itemVariants} style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '8px', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
                  <p style={{ color: 'var(--text-primary)', fontSize: '0.9rem', margin: 0 }}>
                    <strong>Usuário:</strong> {formData.name} ({formData.email})
                  </p>
                  <p style={{ color: 'var(--muted)', fontSize: '0.8rem', margin: '0.25rem 0 0 0' }}>
                    Complete seus dados de transportador abaixo
                  </p>
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
                        borderRadius: '8px',
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
                        borderRadius: '8px',
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
                          borderRadius: '8px',
                          fontSize: '1rem',
                          background: 'white',
                          transition: 'all 0.2s ease',
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
                          borderRadius: '8px',
                          fontSize: '1rem',
                          background: 'white',
                          transition: 'all 0.2s ease',
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
                          borderRadius: '8px',
                          fontSize: '1rem',
                          background: 'white',
                          transition: 'all 0.2s ease',
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
                          borderRadius: '8px',
                          fontSize: '1rem',
                          background: 'white',
                          transition: 'all 0.2s ease',
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
                          borderRadius: '8px',
                          fontSize: '1rem',
                          background: 'white',
                          transition: 'all 0.2s ease',
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
                          borderRadius: '8px',
                          fontSize: '1rem',
                          background: 'white',
                          transition: 'all 0.2s ease',
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
                          borderRadius: '8px',
                          fontSize: '1rem',
                          background: 'white',
                          transition: 'all 0.2s ease',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>
                  <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                    * É obrigatório preencher CPF ou CNPJ
                  </p>
                </motion.div>

                {/* SEÇÃO VEÍCULO */}
                <motion.div variants={itemVariants} style={{ marginBottom: '2rem' }}>
                  <h3
                    style={{
                      color: 'var(--text-primary)',
                      marginBottom: '1rem',
                      fontSize: '1.2rem',
                      fontWeight: '600'
                    }}
                  >
                    🚛 Veículo
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
                        Placa *
                      </label>
                      <input
                        type='text'
                        name='licensePlate'
                        value={formData.licensePlate}
                        onChange={handleInputChange}
                        placeholder='ABC-1234'
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: `2px solid ${errors.licensePlate ? '#dc2626' : 'rgba(15, 15, 15, 0.1)'}`,
                          borderRadius: '8px',
                          fontSize: '1rem',
                          background: 'white',
                          transition: 'all 0.2s ease',
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
                        Modelo *
                      </label>
                      <input
                        type='text'
                        name='vehicleModel'
                        value={formData.vehicleModel}
                        onChange={handleInputChange}
                        placeholder='Scania R440'
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: `2px solid ${errors.vehicleModel ? '#dc2626' : 'rgba(15, 15, 15, 0.1)'}`,
                          borderRadius: '8px',
                          fontSize: '1rem',
                          background: 'white',
                          transition: 'all 0.2s ease',
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
                        Tipo
                      </label>
                      <select
                        name='vehicleType'
                        value={formData.vehicleType}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: `2px solid ${errors.vehicleType ? '#dc2626' : 'rgba(15, 15, 15, 0.1)'}`,
                          borderRadius: '8px',
                          fontSize: '1rem',
                          background: 'white',
                          transition: 'all 0.2s ease',
                          outline: 'none'
                        }}
                      >
                        <option value=''>Selecione o tipo</option>
                        <option value='truck'>Caminhão</option>
                        <option value='van'>Van</option>
                        <option value='pickup'>Pickup</option>
                        <option value='semi-trailer'>Carreta</option>
                        <option value='bitruck'>Bitruck</option>
                      </select>
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
                        Capacidade (kg)
                      </label>
                      <input
                        type='number'
                        name='capacity'
                        value={formData.capacity}
                        onChange={handleInputChange}
                        placeholder='15000'
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: `2px solid ${errors.capacity ? '#dc2626' : 'rgba(15, 15, 15, 0.1)'}`,
                          borderRadius: '8px',
                          fontSize: '1rem',
                          background: 'white',
                          transition: 'all 0.2s ease',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>

                  {/* Marca e Ano */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                        Marca *
                      </label>
                      <select
                        name='vehicleBrand'
                        value={formData.vehicleBrand}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: `2px solid ${errors.vehicleBrand ? '#dc2626' : 'rgba(15, 15, 15, 0.1)'}`,
                          borderRadius: '8px',
                          fontSize: '1rem',
                          background: 'white',
                          transition: 'all 0.2s ease',
                          outline: 'none'
                        }}
                      >
                        <option value=''>Selecione a marca</option>
                        <option value='Mercedes-Benz'>Mercedes-Benz</option>
                        <option value='Scania'>Scania</option>
                        <option value='Volvo'>Volvo</option>
                        <option value='Volkswagen'>Volkswagen</option>
                        <option value='Ford'>Ford</option>
                        <option value='Iveco'>Iveco</option>
                        <option value='DAF'>DAF</option>
                        <option value='MAN'>MAN</option>
                        <option value='Outro'>Outro</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                        Ano *
                      </label>
                      <input
                        type='number'
                        name='vehicleYear'
                        value={formData.vehicleYear}
                        onChange={handleInputChange}
                        placeholder='2020'
                        min='1990'
                        max='2025'
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: `2px solid ${errors.vehicleYear ? '#dc2626' : 'rgba(15, 15, 15, 0.1)'}`,
                          borderRadius: '8px',
                          fontSize: '1rem',
                          background: 'white',
                          transition: 'all 0.2s ease',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>

                  {/* Tipo de Carroceria e Eixos */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                        Tipo de Carroceria *
                      </label>
                      <select
                        name='vehicleBodyType'
                        value={formData.vehicleBodyType}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: `2px solid ${errors.vehicleBodyType ? '#dc2626' : 'rgba(15, 15, 15, 0.1)'}`,
                          borderRadius: '8px',
                          fontSize: '1rem',
                          background: 'white',
                          transition: 'all 0.2s ease',
                          outline: 'none'
                        }}
                      >
                        <option value=''>Selecione o tipo</option>
                        <option value='bau'>Baú</option>
                        <option value='sider'>Sider</option>
                        <option value='graneleiro'>Graneleiro</option>
                        <option value='cacamba'>Caçamba</option>
                        <option value='tanque'>Tanque</option>
                        <option value='refrigerado'>Refrigerado</option>
                        <option value='cegonha'>Cegonha</option>
                        <option value='plataforma'>Plataforma</option>
                        <option value='porta-container'>Porta Container</option>
                        <option value='basculante'>Basculante</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                        Número de Eixos
                      </label>
                      <input
                        type='number'
                        name='vehicleAxles'
                        value={formData.vehicleAxles}
                        onChange={handleInputChange}
                        placeholder='3'
                        min='2'
                        max='9'
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '2px solid rgba(15, 15, 15, 0.1)',
                          borderRadius: '8px',
                          fontSize: '1rem',
                          background: 'white',
                          transition: 'all 0.2s ease',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>

                  {/* Chassi e RENAVAM */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                        Chassi
                      </label>
                      <input
                        type='text'
                        name='chassisNumber'
                        value={formData.chassisNumber}
                        onChange={handleInputChange}
                        placeholder='9BM384610G8123456'
                        maxLength='17'
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '2px solid rgba(15, 15, 15, 0.1)',
                          borderRadius: '8px',
                          fontSize: '1rem',
                          background: 'white',
                          transition: 'all 0.2s ease',
                          outline: 'none'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                        RENAVAM
                      </label>
                      <input
                        type='text'
                        name='renavam'
                        value={formData.renavam}
                        onChange={handleInputChange}
                        placeholder='12345678901'
                        maxLength='11'
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '2px solid rgba(15, 15, 15, 0.1)',
                          borderRadius: '8px',
                          fontSize: '1rem',
                          background: 'white',
                          transition: 'all 0.2s ease',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>

                  {/* ANTT e Cor */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                        ANTT (Registro)
                      </label>
                      <input
                        type='text'
                        name='antt'
                        value={formData.antt}
                        onChange={handleInputChange}
                        placeholder='Número ANTT'
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '2px solid rgba(15, 15, 15, 0.1)',
                          borderRadius: '8px',
                          fontSize: '1rem',
                          background: 'white',
                          transition: 'all 0.2s ease',
                          outline: 'none'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                        Cor do Veículo
                      </label>
                      <input
                        type='text'
                        name='vehicleColor'
                        value={formData.vehicleColor}
                        onChange={handleInputChange}
                        placeholder='Branca'
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '2px solid rgba(15, 15, 15, 0.1)',
                          borderRadius: '8px',
                          fontSize: '1rem',
                          background: 'white',
                          transition: 'all 0.2s ease',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>
                </motion.div>

                {/* SEÇÃO SERVIÇOS DE FRETE */}
                <motion.div variants={itemVariants} style={{ marginBottom: '2rem' }}>
                  <h3
                    style={{
                      color: 'var(--text-primary)',
                      marginBottom: '1rem',
                      fontSize: '1.2rem',
                      fontWeight: '600'
                    }}
                  >
                    💰 Serviços de Frete
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
                      Descrição dos serviços *
                    </label>
                    <textarea
                      name='freightDescription'
                      value={formData.freightDescription}
                      onChange={handleInputChange}
                      placeholder='Descreva os tipos de carga que transporta, regiões atendidas...'
                      rows={3}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: `2px solid ${errors.freightDescription ? '#dc2626' : 'rgba(15, 15, 15, 0.1)'}`,
                        borderRadius: '8px',
                        fontSize: '1rem',
                        background: 'white',
                        transition: 'all 0.2s ease',
                        outline: 'none',
                        resize: 'vertical'
                      }}
                    />
                  </div>

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
                        Preço por km (R$)
                      </label>
                      <input
                        type='number'
                        step='0.01'
                        name='freightPrice'
                        value={formData.freightPrice}
                        onChange={handleInputChange}
                        placeholder='2.50'
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: `2px solid ${errors.freightPrice ? '#dc2626' : 'rgba(15, 15, 15, 0.1)'}`,
                          borderRadius: '8px',
                          fontSize: '1rem',
                          background: 'white',
                          transition: 'all 0.2s ease',
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
                        Rota principal
                      </label>
                      <input
                        type='text'
                        name='freightRoute'
                        value={formData.freightRoute}
                        onChange={handleInputChange}
                        placeholder='SP - RJ - MG'
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: `2px solid ${errors.freightRoute ? '#dc2626' : 'rgba(15, 15, 15, 0.1)'}`,
                          borderRadius: '8px',
                          fontSize: '1rem',
                          background: 'white',
                          transition: 'all 0.2s ease',
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
                        Disponibilidade
                      </label>
                      <select
                        name='freightAvailability'
                        value={formData.freightAvailability}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: `2px solid ${errors.freightAvailability ? '#dc2626' : 'rgba(15, 15, 15, 0.1)'}`,
                          borderRadius: '8px',
                          fontSize: '1rem',
                          background: 'white',
                          transition: 'all 0.2s ease',
                          outline: 'none'
                        }}
                      >
                        <option value=''>Selecione</option>
                        <option value='24h'>24 horas</option>
                        <option value='business'>Horário comercial</option>
                        <option value='weekends'>Fins de semana</option>
                        <option value='flexible'>Flexível</option>
                      </select>
                    </div>
                  </div>
                </motion.div>


                <motion.button
                  variants={itemVariants}
                  type='submit'
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: isLoading ? 'var(--muted)' : 'var(--accent)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
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
                      Completando perfil...
                    </>
                  ) : (
                    <>
                      Completar Perfil
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
      </section>

      {/* Footer já incluído no App.js */}
    </>
  );
};

export default SignupFreight;
