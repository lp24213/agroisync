import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, Unlock, CreditCard, CheckCircle, AlertCircle } from 'lucide-react';
import paymentService from '../services/paymentService';

const VisibilityManager = ({ item, itemType, onVisibilityChange }) => {
  const [isPublic, setIsPublic] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Verificar status de pagamento do item
    checkPaymentStatus();
  }, [item]);

  const checkPaymentStatus = async () => {
    try {
      const status = await paymentService.checkItemPaymentStatus(item.id, itemType);
      setPaymentStatus(status);
      setIsPublic(status === 'paid');
    } catch (error) {
      console.error('Erro ao verificar status de pagamento:', error);
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      const paymentResult = await paymentService.processItemPayment(item.id, itemType);
      
      if (paymentResult.success) {
        setPaymentStatus('paid');
        setIsPublic(true);
        onVisibilityChange?.(true);
      }
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPublicData = () => {
    if (itemType === 'product') {
      return {
        name: item.name,
        location: item.location,
        category: item.category,
        image: item.image
      };
    } else if (itemType === 'freight') {
      return {
        origin: item.origin,
        destination: item.destination,
        value: item.value,
        vehicleType: item.vehicleType
      };
    }
    return {};
  };

  const getPrivateData = () => {
    if (itemType === 'product') {
      return {
        ...item,
        // Dados completos após pagamento
        fullDescription: item.fullDescription,
        price: item.price,
        quantity: item.quantity,
        contact: item.contact,
        specifications: item.specifications
      };
    } else if (itemType === 'freight') {
      return {
        ...item,
        // Dados completos após pagamento
        fullDescription: item.fullDescription,
        contact: item.contact,
        requirements: item.requirements,
        schedule: item.schedule
      };
    }
    return item;
  };

  const renderVisibilityStatus = () => {
    if (paymentStatus === 'paid') {
      return (
        <div className="flex items-center gap-2 text-green-600">
          <CheckCircle className="w-5 h-5" />
          <span className="text-sm font-medium">Dados Completos Liberados</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-2 text-orange-600">
          <AlertCircle className="w-5 h-5" />
          <span className="text-sm font-medium">Apenas Dados Públicos</span>
        </div>
      );
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Controle de Visibilidade
        </h3>
        {renderVisibilityStatus()}
      </div>

      <div className="space-y-4">
        {/* Dados Públicos */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Eye className="w-5 h-5 text-green-600" />
            <h4 className="font-medium text-gray-900">Dados Públicos</h4>
          </div>
          <div className="text-sm text-gray-600">
            {itemType === 'product' ? (
              <div className="space-y-2">
                <p><strong>Nome:</strong> {getPublicData().name}</p>
                <p><strong>Localização:</strong> {getPublicData().location}</p>
                <p><strong>Categoria:</strong> {getPublicData().category}</p>
              </div>
            ) : (
              <div className="space-y-2">
                <p><strong>Origem:</strong> {getPublicData().origin}</p>
                <p><strong>Destino:</strong> {getPublicData().destination}</p>
                <p><strong>Valor:</strong> R$ {getPublicData().value}</p>
                <p><strong>Tipo de Veículo:</strong> {getPublicData().vehicleType}</p>
              </div>
            )}
          </div>
        </div>

        {/* Dados Privados */}
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            {paymentStatus === 'paid' ? (
              <Unlock className="w-5 h-5 text-blue-600" />
            ) : (
              <Lock className="w-5 h-5 text-gray-400" />
            )}
            <h4 className="font-medium text-gray-900">Dados Completos</h4>
          </div>
          
          {paymentStatus === 'paid' ? (
            <div className="text-sm text-gray-600">
              {itemType === 'product' ? (
                <div className="space-y-2">
                  <p><strong>Descrição Completa:</strong> {getPrivateData().fullDescription}</p>
                  <p><strong>Preço:</strong> R$ {getPrivateData().price}</p>
                  <p><strong>Quantidade:</strong> {getPrivateData().quantity}</p>
                  <p><strong>Contato:</strong> {getPrivateData().contact}</p>
                  <p><strong>Especificações:</strong> {getPrivateData().specifications}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p><strong>Descrição Completa:</strong> {getPrivateData().fullDescription}</p>
                  <p><strong>Contato:</strong> {getPrivateData().contact}</p>
                  <p><strong>Requisitos:</strong> {getPrivateData().requirements}</p>
                  <p><strong>Cronograma:</strong> {getPrivateData().schedule}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-sm text-gray-500">
              <p>Dados completos serão liberados após o pagamento.</p>
              <p>Inclui: descrição completa, preços, contatos e especificações.</p>
            </div>
          )}
        </div>

        {/* Botão de Pagamento */}
        {paymentStatus !== 'paid' && (
          <motion.button
            onClick={handlePayment}
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <CreditCard className="w-5 h-5" />
            )}
            {loading ? 'Processando...' : 'Liberar Dados Completos'}
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default VisibilityManager;
