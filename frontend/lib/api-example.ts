/**
 * Exemplo de uso da API com autenticação Metamask
 * 
 * Este arquivo demonstra como usar a API client configurada
 * com autenticação automática via ID da Metamask.
 */

import { apiClient, post, get } from './api';

// Exemplo de função para fazer uma requisição POST
export async function exemploRequisicaoPost() {
  try {
    // A requisição automaticamente incluirá o header 'x-metamask-id'
    const resultado = await post('/endpoint-do-backend', {
      dados: 'exemplo',
      timestamp: new Date().toISOString()
    });
    
    if (resultado.success) {
      console.log('Resposta:', resultado.data);
      return resultado.data;
    } else {
      console.error('Erro:', resultado.error);
      throw new Error(resultado.error);
    }
  } catch (error) {
    console.error('Erro na requisição:', error);
    throw error;
  }
}

// Exemplo de função para fazer uma requisição GET
export async function exemploRequisicaoGet() {
  try {
    // A requisição automaticamente incluirá o header 'x-metamask-id'
    const resultado = await get('/api/v1/status');
    
    if (resultado.success) {
      console.log('Status:', resultado.data);
      return resultado.data;
    } else {
      console.error('Erro:', resultado.error);
      throw new Error(resultado.error);
    }
  } catch (error) {
    console.error('Erro na requisição:', error);
    throw error;
  }
}

// Exemplo de uso direto do apiClient
export async function exemploApiClient() {
  try {
    // Usando o apiClient diretamente
    const resultado = await apiClient.post('/endpoint-do-backend', {
      acao: 'exemplo',
      dados: { teste: true }
    });
    
    if (resultado.success) {
      console.log('Resposta do apiClient:', resultado.data);
      return resultado.data;
    } else {
      console.error('Erro do apiClient:', resultado.error);
      throw new Error(resultado.error);
    }
  } catch (error) {
    console.error('Erro no apiClient:', error);
    throw error;
  }
}

// Exemplo de função para verificar se a API está funcionando
export async function verificarStatusAPI() {
  try {
    const resultado = await apiClient.healthCheck();
    
    if (resultado.success) {
      console.log('✅ API está funcionando:', resultado.data);
      return true;
    } else {
      console.error('❌ API não está funcionando:', resultado.error);
      return false;
    }
  } catch (error) {
    console.error('❌ Erro ao verificar API:', error);
    return false;
  }
}
