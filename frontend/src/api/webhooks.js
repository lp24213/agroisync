import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://agroisync.com';

// Webhook para confirmação de pagamento
export const confirmPayment = async (paymentData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/webhooks/payment-confirmation`, {
      paymentId: paymentData.paymentId,
      orderId: paymentData.orderId,
      userId: paymentData.userId,
      amount: paymentData.amount,
      currency: paymentData.currency,
      status: paymentData.status,
      paymentMethod: paymentData.paymentMethod,
      timestamp: new Date().toISOString()
    });

    return response.data;
  } catch (error) {
    console.error('Erro ao confirmar pagamento:', error);
    throw error;
  }
};

// Webhook para atualização de status de pedido
export const updateOrderStatus = async (orderData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/webhooks/order-status-update`, {
      orderId: orderData.orderId,
      userId: orderData.userId,
      status: orderData.status,
      timestamp: new Date().toISOString(),
      notes: orderData.notes
    });

    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar status do pedido:', error);
    throw error;
  }
};

// Webhook para notificação de frete
export const notifyFreightUpdate = async (freightData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/webhooks/freight-update`, {
      freightId: freightData.freightId,
      driverId: freightData.driverId,
      status: freightData.status,
      location: freightData.location,
      timestamp: new Date().toISOString()
    });

    return response.data;
  } catch (error) {
    console.error('Erro ao notificar atualização de frete:', error);
    throw error;
  }
};

// Webhook para notificação de mensagem
export const notifyNewMessage = async (messageData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/webhooks/new-message`, {
      messageId: messageData.messageId,
      senderId: messageData.senderId,
      receiverId: messageData.receiverId,
      type: messageData.type, // 'product', 'freight', 'general'
      timestamp: new Date().toISOString()
    });

    return response.data;
  } catch (error) {
    console.error('Erro ao notificar nova mensagem:', error);
    throw error;
  }
};

// Função para processar webhook de pagamento bem-sucedido
export const processPaymentSuccess = async (paymentData) => {
  try {
    // Confirmar pagamento
    await confirmPayment(paymentData);
    
    // Atualizar status do pedido
    await updateOrderStatus({
      orderId: paymentData.orderId,
      userId: paymentData.userId,
      status: 'paid',
      notes: 'Pagamento confirmado via webhook'
    });

    // Notificar usuário via mensageria
    await notifyNewMessage({
      messageId: `payment_${paymentData.paymentId}`,
      senderId: 'system',
      receiverId: paymentData.userId,
      type: 'payment_confirmation'
    });

    return { success: true, message: 'Pagamento processado com sucesso' };
  } catch (error) {
    console.error('Erro ao processar pagamento:', error);
    throw error;
  }
};

// Função para processar webhook de pagamento cancelado
export const processPaymentCancel = async (paymentData) => {
  try {
    // Atualizar status do pedido
    await updateOrderStatus({
      orderId: paymentData.orderId,
      userId: paymentData.userId,
      status: 'cancelled',
      notes: 'Pagamento cancelado pelo usuário'
    });

    return { success: true, message: 'Pagamento cancelado processado' };
  } catch (error) {
    console.error('Erro ao processar cancelamento:', error);
    throw error;
  }
};

export default {
  confirmPayment,
  updateOrderStatus,
  notifyFreightUpdate,
  notifyNewMessage,
  processPaymentSuccess,
  processPaymentCancel
};
