import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Onboarding = () => {
  const navigate = useNavigate();
  const [type, setType] = useState('carrier');
  const [form, setForm] = useState({
    // comum
    address: '',
    city: '',
    state: '',
    ie: '',
    cpf: '',
    cnpj: '',
    zipCode: '',
    // frete
    licensePlate: '',
    vehicleModel: '',
    vehicleType: '',
    capacity: '',
    vehicleImage: null,
    freightDescription: '',
    freightPrice: '',
    freightRoute: '',
    freightAvailability: '',
    // loja
    productName: '',
    productDesc: '',
    productSize: '',
    productQuantity: '',
    productImage: null,
    productCategory: '',
    productPrice: '',
    productStock: '',
    productWeight: ''
  });
  const [loading, setLoading] = useState(false);
  const [cepData, setCepData] = useState(null);

  const api = process.env.REACT_APP_API_URL || '/api';

  // Buscar dados do CEP automaticamente - CORRIGIDO
  const fetchCEPData = async cep => {
    if (cep.length === 8) {
      try {
        // Usar ViaCEP diretamente (mais confiável)
        const viaCepRes = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        if (viaCepRes.ok) {
          const viaCepData = await viaCepRes.json();
          if (!viaCepData.erro) {
            setCepData(viaCepData);
            setForm(prev => ({
              ...prev,
              address: viaCepData.logradouro || '',
              city: viaCepData.localidade || '',
              state: viaCepData.uf || ''
            }));
            if (process.env.NODE_ENV !== 'production') {

              console.log('CEP encontrado:', viaCepData);

            }
          } else {
            if (process.env.NODE_ENV !== 'production') {

              console.log('CEP não encontrado');

            }
          }
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        // Não fazer nada em caso de erro - deixar usuário preencher manualmente
      }
    }
  };

  // Validar CPF/CNPJ automaticamente
  const validateDocument = async (doc, type) => {
    if (doc.length >= 11) {
      try {
        const endpoint = type === 'cpf' ? 'cpf' : 'cnpj';
        const res = await fetch(`${api}/registration/validate/${endpoint}/${doc}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            alert(`✅ ${type.toUpperCase()} válido!`);
          } else {
            alert(`❌ ${type.toUpperCase()} inválido!`);
          }
        }
      } catch (error) {
        console.error('Erro ao validar documento:', error);
      }
    }
  };

  const submit = async e => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validação de campos obrigatórios
      const requiredFields = {
        carrier: ['zipCode', 'address', 'city', 'state', 'licensePlate', 'vehicleModel', 'freightDescription'],
        store: ['zipCode', 'address', 'city', 'state', 'productName', 'productDesc', 'productCategory', 'productPrice']
      };

      // Validar CPF OU CNPJ (pelo menos um deve estar preenchido)
      if (!form.cpf && !form.cnpj) {
        alert('❌ É obrigatório preencher CPF ou CNPJ');
        setLoading(false);
        return;
      }

      const missingFields = requiredFields[type].filter(field => !form[field] || form[field].trim() === '');

      if (missingFields.length > 0) {
        const fieldNames = {
          zipCode: 'CEP',
          address: 'Endereço',
          city: 'Cidade',
          state: 'Estado',
          licensePlate: 'Placa do veículo',
          vehicleModel: 'Modelo do veículo',
          freightDescription: 'Descrição do frete',
          productName: 'Nome do produto',
          productDesc: 'Descrição do produto',
          productCategory: 'Categoria do produto',
          productPrice: 'Preço do produto'
        };

        const missingNames = missingFields.map(field => fieldNames[field]).join(', ');
        alert(`❌ Campos obrigatórios não preenchidos: ${missingNames}`);
        setLoading(false);
        return;
      }

      // Criar FormData para incluir imagens
      const formData = new FormData();
      formData.append('type', type);
      Object.keys(form).forEach(key => {
        if (form[key] !== null && form[key] !== '') {
          formData.append(key, form[key]);
        }
      });

      const endpoint = type === 'carrier' ? '/registration/agroconecta' : '/registration/loja';
      const res = await fetch(`${api}${endpoint}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken') || ''}` },
        body: formData
      });

      if (res.ok) {
        alert('✅ Dados salvos com sucesso!');
        // Redirecionar para área de pagamento ou dashboard baseado no plano
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        if (userData.isPaid) {
          navigate('/user-dashboard', { replace: true });
        } else {
          navigate('/payment', { replace: true });
        }
      } else {
        const errorData = await res.json();
        alert(`❌ Erro: ${errorData.message || 'Erro ao salvar dados'}`);
      }
    } catch (error) {
      alert('❌ Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleImageUpload = field => e => {
    const file = e.target.files[0];
    if (file) {
      setForm(p => ({ ...p, [field]: file }));
    }
  };

  return (
    <section className='container' style={{ padding: '2rem 0', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 className='mb-2 text-3xl font-bold' style={{ color: 'var(--text-primary)' }}>
          Complete seu Perfil
        </h1>
        <p className='text-gray-600'>Escolha seu tipo de negócio e preencha os dados necessários</p>
      </div>

      {/* Seleção de Tipo */}
      <div className='mb-6' style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '1rem 2rem',
            border: `2px solid ${type === 'carrier' ? 'var(--accent)' : '#e5e7eb'}`,
            borderRadius: '12px',
            cursor: 'pointer',
            background: type === 'carrier' ? 'rgba(42, 127, 79, 0.1)' : 'white',
            transition: 'all 0.2s ease'
          }}
        >
          <input
            type='radio'
            name='t'
            value='carrier'
            checked={type === 'carrier'}
            onChange={() => setType('carrier')}
            style={{ margin: 0 }}
          />
          <span style={{ fontWeight: '600', color: type === 'carrier' ? 'var(--accent)' : 'var(--text-primary)' }}>
            🚛 Frete
          </span>
        </label>
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '1rem 2rem',
            border: `2px solid ${type === 'store' ? 'var(--accent)' : '#e5e7eb'}`,
            borderRadius: '12px',
            cursor: 'pointer',
            background: type === 'store' ? 'rgba(42, 127, 79, 0.1)' : 'white',
            transition: 'all 0.2s ease'
          }}
        >
          <input
            type='radio'
            name='t'
            value='store'
            checked={type === 'store'}
            onChange={() => setType('store')}
            style={{ margin: 0 }}
          />
          <span style={{ fontWeight: '600', color: type === 'store' ? 'var(--accent)' : 'var(--text-primary)' }}>
            🏪 Loja
          </span>
        </label>
      </div>

      <form onSubmit={submit} className='grid gap-4'>
        {/* Dados Básicos */}
        <div
          style={{
            background: 'var(--card-bg)',
            padding: '1.5rem',
            borderRadius: '12px',
            border: '1px solid rgba(15, 15, 15, 0.05)'
          }}
        >
          <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '1rem', color: 'var(--text-primary)' }}>
            📍 Localização
          </h3>
          <div className='grid gap-3'>
            <div className='grid grid-cols-2 gap-3'>
              <input
                className='form-input'
                placeholder='CEP *'
                value={form.zipCode}
                onChange={e => {
                  set('zipCode')(e);
                  fetchCEPData(e.target.value.replace(/\D/g, ''));
                }}
                maxLength='9'
                required
                style={{ borderColor: !form.zipCode ? '#dc2626' : undefined }}
              />
              <input
                className='form-input'
                placeholder='Endereço *'
                value={form.address}
                onChange={set('address')}
                required
                style={{ borderColor: !form.address ? '#dc2626' : undefined }}
              />
            </div>
            <div className='grid grid-cols-2 gap-3'>
              <input
                className='form-input'
                placeholder='Cidade *'
                value={form.city}
                onChange={set('city')}
                required
                style={{ borderColor: !form.city ? '#dc2626' : undefined }}
              />
              <input
                className='form-input'
                placeholder='UF *'
                value={form.state}
                onChange={set('state')}
                required
                style={{ borderColor: !form.state ? '#dc2626' : undefined }}
              />
            </div>
          </div>
        </div>

        {/* Documentos */}
        <div
          style={{
            background: 'var(--card-bg)',
            padding: '1.5rem',
            borderRadius: '12px',
            border: '1px solid rgba(15, 15, 15, 0.05)'
          }}
        >
          <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '1rem', color: 'var(--text-primary)' }}>
            📄 Documentos
          </h3>
          <div className='grid grid-cols-3 gap-3'>
            <input
              className='form-input'
              placeholder='CPF'
              value={form.cpf}
              onChange={e => {
                set('cpf')(e);
                if (e.target.value.length >= 11) validateDocument(e.target.value.replace(/\D/g, ''), 'cpf');
              }}
              maxLength='14'
              style={{ borderColor: !form.cpf && !form.cnpj ? '#dc2626' : undefined }}
            />
            <input
              className='form-input'
              placeholder='CNPJ'
              value={form.cnpj}
              onChange={e => {
                set('cnpj')(e);
                if (e.target.value.length >= 14) validateDocument(e.target.value.replace(/\D/g, ''), 'cnpj');
              }}
              maxLength='18'
              style={{ borderColor: !form.cpf && !form.cnpj ? '#dc2626' : undefined }}
            />
            <input className='form-input' placeholder='IE' value={form.ie} onChange={set('ie')} />
          </div>
          <p style={{ fontSize: '0.9rem', color: '#dc2626', marginTop: '0.5rem' }}>
            * É obrigatório preencher CPF ou CNPJ
          </p>
        </div>

        {type === 'carrier' ? (
          <>
            {/* Dados do Veículo */}
            <div
              style={{
                background: 'var(--card-bg)',
                padding: '1.5rem',
                borderRadius: '12px',
                border: '1px solid rgba(15, 15, 15, 0.05)'
              }}
            >
              <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '1rem', color: 'var(--text-primary)' }}>
                🚛 Veículo
              </h3>
              <div className='grid gap-3'>
                <div className='grid grid-cols-3 gap-3'>
                  <input
                    className='form-input'
                    placeholder='Placa *'
                    value={form.licensePlate}
                    onChange={set('licensePlate')}
                    required
                    style={{ borderColor: !form.licensePlate ? '#dc2626' : undefined }}
                  />
                  <input
                    className='form-input'
                    placeholder='Modelo *'
                    value={form.vehicleModel}
                    onChange={set('vehicleModel')}
                    required
                    style={{ borderColor: !form.vehicleModel ? '#dc2626' : undefined }}
                  />
                  <input
                    className='form-input'
                    placeholder='Tipo'
                    value={form.vehicleType}
                    onChange={set('vehicleType')}
                  />
                </div>
                <div className='grid grid-cols-2 gap-3'>
                  <input
                    className='form-input'
                    placeholder='Capacidade (kg)'
                    value={form.capacity}
                    onChange={set('capacity')}
                  />
                  <input
                    type='file'
                    className='form-input'
                    accept='image/*'
                    onChange={handleImageUpload('vehicleImage')}
                  />
                </div>
              </div>
            </div>

            {/* Dados do Frete */}
            <div
              style={{
                background: 'var(--card-bg)',
                padding: '1.5rem',
                borderRadius: '12px',
                border: '1px solid rgba(15, 15, 15, 0.05)'
              }}
            >
              <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '1rem', color: 'var(--text-primary)' }}>
                💰 Serviços de Frete
              </h3>
              <div className='grid gap-3'>
                <textarea
                  className='form-input'
                  placeholder='Descrição dos serviços de frete oferecidos *'
                  value={form.freightDescription}
                  onChange={set('freightDescription')}
                  rows='3'
                  required
                  style={{ borderColor: !form.freightDescription ? '#dc2626' : undefined }}
                />
                <div className='grid grid-cols-3 gap-3'>
                  <input
                    className='form-input'
                    placeholder='Preço por km (R$)'
                    value={form.freightPrice}
                    onChange={set('freightPrice')}
                  />
                  <input
                    className='form-input'
                    placeholder='Rota principal'
                    value={form.freightRoute}
                    onChange={set('freightRoute')}
                  />
                  <input
                    className='form-input'
                    placeholder='Disponibilidade'
                    value={form.freightAvailability}
                    onChange={set('freightAvailability')}
                  />
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Dados do Produto */}
            <div
              style={{
                background: 'var(--card-bg)',
                padding: '1.5rem',
                borderRadius: '12px',
                border: '1px solid rgba(15, 15, 15, 0.05)'
              }}
            >
              <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '1rem', color: 'var(--text-primary)' }}>
                📦 Produto
              </h3>
              <div className='grid gap-3'>
                <input
                  className='form-input'
                  placeholder='Nome do produto *'
                  value={form.productName}
                  onChange={set('productName')}
                  required
                  style={{ borderColor: !form.productName ? '#dc2626' : undefined }}
                />
                <textarea
                  className='form-input'
                  placeholder='Descrição detalhada do produto *'
                  value={form.productDesc}
                  onChange={set('productDesc')}
                  rows='3'
                  required
                  style={{ borderColor: !form.productDesc ? '#dc2626' : undefined }}
                />
                <div className='grid grid-cols-4 gap-3'>
                  <input
                    className='form-input'
                    placeholder='Categoria *'
                    value={form.productCategory}
                    onChange={set('productCategory')}
                    required
                    style={{ borderColor: !form.productCategory ? '#dc2626' : undefined }}
                  />
                  <input
                    className='form-input'
                    placeholder='Tamanho'
                    value={form.productSize}
                    onChange={set('productSize')}
                  />
                  <input
                    className='form-input'
                    placeholder='Quantidade'
                    value={form.productQuantity}
                    onChange={set('productQuantity')}
                  />
                  <input
                    type='file'
                    className='form-input'
                    accept='image/*'
                    onChange={handleImageUpload('productImage')}
                  />
                </div>
                <div className='grid grid-cols-3 gap-3'>
                  <input
                    className='form-input'
                    placeholder='Preço (R$) *'
                    value={form.productPrice}
                    onChange={set('productPrice')}
                    required
                    style={{ borderColor: !form.productPrice ? '#dc2626' : undefined }}
                  />
                  <input
                    className='form-input'
                    placeholder='Estoque disponível'
                    value={form.productStock}
                    onChange={set('productStock')}
                  />
                  <input
                    className='form-input'
                    placeholder='Peso (kg)'
                    value={form.productWeight}
                    onChange={set('productWeight')}
                  />
                </div>
              </div>
            </div>
          </>
        )}

        <button
          className='btn'
          type='submit'
          disabled={loading}
          style={{
            padding: '1rem 2rem',
            fontSize: '1.1rem',
            fontWeight: '600',
            background: loading ? 'var(--muted)' : 'var(--accent)',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? '⏳ Salvando...' : '✅ Salvar e Continuar'}
        </button>
      </form>
    </section>
  );
};

export default Onboarding;
