/**
 * Exemplo de uso da API com autenticação Metamask
 * 
 * Este arquivo demonstra como usar a API client configurada
 * com autenticação automática via ID da Metamask.
 */

import { apiGet, apiPost, checkApiHealth } from './api-functions';

// Exemplo de função para fazer uma requisição POST
export async function exemploRequisicaoPost() {
  try {
    const resultado = await apiPost('/endpoint-do-backend', {
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
    const resultado = await apiGet('/api/v1/status');
    
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

// Exemplo de uso direto das funções funcionais
export async function exemploApiClient() {
  try {
    // Usando as funções funcionais diretamente
    const resultado = await apiPost('/endpoint-do-backend', {
      acao: 'exemplo',
      dados: { teste: true }
    });
    
    if (resultado.success) {
      console.log('Resposta das funções funcionais:', resultado.data);
      return resultado.data;
    } else {
      console.error('Erro das funções funcionais:', resultado.error);
      throw new Error(resultado.error);
    }
  } catch (error) {
    console.error('Erro nas funções funcionais:', error);
    throw error;
  }
}

// Exemplo de função para verificar se a API está funcionando
export async function verificarStatusAPI() {
  try {
    const resultado = await checkApiHealth();
    
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
