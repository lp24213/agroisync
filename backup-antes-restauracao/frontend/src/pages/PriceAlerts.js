import React, { useState, useEffect } from 'react';
import { Bell, Plus, Trash2, TrendingDown, TrendingUp, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import cotacoesService from '../services/cotacoesService';
import { getAllCategorias } from '../data/agroCategorias';

const PriceAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  
  const [newAlert, setNewAlert] = useState({
    produto: 'soja',
    precoAlvo: '',
    condition: 'below'
  });

  useEffect(() => {
    loadAlerts();
  }, []);

  async function loadAlerts() {
    const result = await cotacoesService.getMyAlerts();
    if (result.success) {
      setAlerts(result.data);
    }
    setLoading(false);
  }

  async function handleCreateAlert() {
    if (!newAlert.produto || !newAlert.precoAlvo) {
      alert('Preencha todos os campos!');
      return;
    }

    setCreating(true);
    const result = await cotacoesService.createAlert(
      newAlert.produto,
      newAlert.precoAlvo,
      newAlert.condition
    );

    if (result.success) {
      setShowCreateModal(false);
      setNewAlert({ produto: 'soja', precoAlvo: '', condition: 'below' });
      loadAlerts();
    } else {
      alert('Erro ao criar alerta: ' + result.error);
    }
    setCreating(false);
  }

  async function handleDeleteAlert(alertId) {
    if (!confirm('Deseja realmente excluir este alerta?')) return;

    const result = await cotacoesService.deleteAlert(alertId);
    if (result.success) {
      loadAlerts();
    }
  }

  const produtos = [
    { id: 'soja', nome: 'Soja', icone: '🫘' },
    { id: 'milho', nome: 'Milho', icone: '🌽' },
    { id: 'cafe', nome: 'Café', icone: '☕' },
    { id: 'trigo', nome: 'Trigo', icone: '🌾' },
    { id: 'boi-gordo', nome: 'Boi Gordo', icone: '🐂' },
    { id: 'leite', nome: 'Leite', icone: '🥛' }
  ];

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* HEADER */}
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Bell className="w-10 h-10 text-orange-500" />
          Alertas de Preço
        </h1>
        <p style={{ fontSize: '16px', color: '#6b7280' }}>
          Receba notificações quando o preço dos produtos atingir seu alvo
        </p>
      </div>

      {/* BOTÃO CRIAR */}
      <button
        onClick={() => setShowCreateModal(true)}
        style={{
          padding: '16px 24px',
          background: 'linear-gradient(135deg, #2F5233 0%, #4a7c59 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          fontSize: '16px',
          fontWeight: '700',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '30px',
          boxShadow: '0 4px 12px rgba(47, 82, 51, 0.3)'
        }}
        aria-label="Criar novo alerta de preço"
      >
        <Plus className="w-5 h-5" />
        Criar Novo Alerta
      </button>

      {/* LISTA DE ALERTAS */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <p>Carregando alertas...</p>
        </div>
      ) : alerts.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '80px 20px',
          background: '#f9fafb',
          borderRadius: '16px',
          border: '2px dashed #d1d5db'
        }}>
          <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>
            Nenhum alerta criado
          </h3>
          <p style={{ color: '#6b7280', marginBottom: '20px' }}>
            Crie seu primeiro alerta e seja notificado quando o preço atingir seu alvo!
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '16px' }}>
          <AnimatePresence>
            {alerts.map(alert => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                style={{
                  background: 'white',
                  border: '2px solid #e5e7eb',
                  borderRadius: '16px',
                  padding: '24px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <span style={{ fontSize: '32px' }}>
                      {produtos.find(p => p.id === alert.product_type)?.icone || '📊'}
                    </span>
                    <div>
                      <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '4px', textTransform: 'capitalize' }}>
                        {alert.product_type.replace('-', ' ')}
                      </h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                          padding: '4px 12px',
                          background: alert.condition === 'below' ? '#ecfdf5' : '#fef2f2',
                          color: alert.condition === 'below' ? '#065f46' : '#991b1b',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}>
                          {alert.condition === 'below' ? <TrendingDown className="w-3 h-3 inline mr-1" /> : <TrendingUp className="w-3 h-3 inline mr-1" />}
                          {alert.condition === 'below' ? 'Quando cair para' : 'Quando subir para'}
                        </span>
                        <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#2F5233' }}>
                          R$ {parseFloat(alert.target_price).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                    Criado em {new Date(alert.created_at).toLocaleDateString('pt-BR')}
                    {alert.is_active && (
                      <span style={{ marginLeft: '12px', color: '#10b981', fontWeight: '600' }}>
                        ● Ativo
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteAlert(alert.id)}
                  style={{
                    padding: '12px',
                    background: '#fee2e2',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#fecaca'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#fee2e2'}
                  aria-label="Excluir alerta"
                >
                  <Trash2 className="w-5 h-5 text-red-600" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* MODAL CRIAR ALERTA */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              padding: '20px'
            }}
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: 'white',
                borderRadius: '20px',
                padding: '32px',
                maxWidth: '500px',
                width: '100%',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
              }}
            >
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Bell className="w-7 h-7 text-orange-500" />
                Criar Alerta de Preço
              </h2>

              {/* PRODUTO */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>
                  Produto:
                </label>
                <select
                  value={newAlert.produto}
                  onChange={(e) => setNewAlert({ ...newAlert, produto: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '15px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '10px',
                    outline: 'none'
                  }}
                  aria-label="Selecionar produto para alerta"
                >
                  {produtos.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.icone} {p.nome}
                    </option>
                  ))}
                </select>
              </div>

              {/* CONDIÇÃO */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>
                  Quando:
                </label>
                <select
                  value={newAlert.condition}
                  onChange={(e) => setNewAlert({ ...newAlert, condition: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '15px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '10px',
                    outline: 'none'
                  }}
                  aria-label="Selecionar condição do alerta"
                >
                  <option value="below">Preço cair para (ou abaixo de)</option>
                  <option value="above">Preço subir para (ou acima de)</option>
                  <option value="equal">Preço atingir exatamente</option>
                </select>
              </div>

              {/* PREÇO ALVO */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>
                  Preço Alvo (R$):
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="120.50"
                  value={newAlert.precoAlvo}
                  onChange={(e) => setNewAlert({ ...newAlert, precoAlvo: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '14px',
                    fontSize: '18px',
                    fontWeight: '600',
                    border: '2px solid #e5e7eb',
                    borderRadius: '10px',
                    outline: 'none'
                  }}
                  required
                  aria-label="Preço alvo para o alerta"
                />
              </div>

              {/* BOTÕES */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => setShowCreateModal(false)}
                  disabled={creating}
                  style={{
                    flex: 1,
                    padding: '14px',
                    background: '#f3f4f6',
                    color: '#374151',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: creating ? 'not-allowed' : 'pointer'
                  }}
                  aria-label="Cancelar criação de alerta"
                >
                  Cancelar
                </button>
                
                <button
                  onClick={handleCreateAlert}
                  disabled={creating}
                  style={{
                    flex: 1,
                    padding: '14px',
                    background: creating ? '#9ca3af' : 'linear-gradient(135deg, #2F5233 0%, #4a7c59 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '16px',
                    fontWeight: '700',
                    cursor: creating ? 'not-allowed' : 'pointer',
                    boxShadow: creating ? 'none' : '0 4px 12px rgba(47, 82, 51, 0.3)'
                  }}
                  aria-label="Confirmar criação de alerta"
                >
                  {creating ? 'Criando...' : 'Criar Alerta'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PriceAlerts;

