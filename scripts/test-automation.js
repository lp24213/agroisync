#!/usr/bin/env node

/**
 * Script de Teste Automatizado - AGROISYNC
 * 
 * Este script executa testes automatizados para verificar
 * as funcionalidades principais da plataforma.
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Configurações
const config = {
  baseURL: process.env.API_URL || 'http://localhost:3001/api',
  frontendURL: process.env.FRONTEND_URL || 'http://localhost:3000',
  testUser: {
    email: 'test@agroisync.com',
    password: 'test123456',
    name: 'Test User'
  },
  adminUser: {
    email: process.env.ADMIN_EMAIL || 'luispaulodeoliveira@agrotm.com.br',
    password: process.env.ADMIN_PASSWORD || 'Th@ys15221008'
  }
};

// Utilitários
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const log = (message, type = 'info') => {
  const timestamp = new Date().toISOString();
  const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';
  console.log(`${prefix} [${timestamp}] ${message}`);
};

const logError = (message) => log(message, 'error');
const logSuccess = (message) => log(message, 'success');

// Classe principal de testes
class AgroSyncTester {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      total: 0,
      details: []
    };
    this.authToken = null;
    this.adminToken = null;
  }

  async runTest(testName, testFunction) {
    this.results.total++;
    log(`Executando teste: ${testName}`);
    
    try {
      await testFunction();
      this.results.passed++;
      this.results.details.push({ name: testName, status: 'PASSED' });
      logSuccess(`Teste passou: ${testName}`);
    } catch (error) {
      this.results.failed++;
      this.results.details.push({ 
        name: testName, 
        status: 'FAILED', 
        error: error.message 
      });
      logError(`Teste falhou: ${testName} - ${error.message}`);
    }
  }

  // Testes de Autenticação
  async testUserRegistration() {
    const response = await axios.post(`${config.baseURL}/auth/register`, {
      name: config.testUser.name,
      email: config.testUser.email,
      password: config.testUser.password,
      turnstileToken: 'test-token' // Mock token para teste
    });

    if (!response.data.success) {
      throw new Error('Falha no registro de usuário');
    }
  }

  async testUserLogin() {
    const response = await axios.post(`${config.baseURL}/auth/login`, {
      email: config.testUser.email,
      password: config.testUser.password,
      turnstileToken: 'test-token'
    });

    if (!response.data.success || !response.data.data.token) {
      throw new Error('Falha no login de usuário');
    }

    this.authToken = response.data.data.token;
  }

  async testAdminLogin() {
    const response = await axios.post(`${config.baseURL}/auth/login`, {
      email: config.adminUser.email,
      password: config.adminUser.password,
      turnstileToken: 'test-token'
    });

    if (!response.data.success || !response.data.data.token) {
      throw new Error('Falha no login de admin');
    }

    this.adminToken = response.data.data.token;
  }

  async testPasswordReset() {
    const response = await axios.post(`${config.baseURL}/auth/forgot-password`, {
      email: config.testUser.email,
      turnstileToken: 'test-token'
    });

    if (!response.data.success) {
      throw new Error('Falha na solicitação de reset de senha');
    }
  }

  // Testes de Chat
  async testChatSend() {
    if (!this.authToken) {
      throw new Error('Token de autenticação não disponível');
    }

    const response = await axios.post(`${config.baseURL}/chat/send`, {
      message: 'Olá, como funciona a plataforma?',
      conversationId: null
    }, {
      headers: { Authorization: `Bearer ${this.authToken}` }
    });

    if (!response.data.success) {
      throw new Error('Falha no envio de mensagem no chat');
    }
  }

  async testChatHistory() {
    if (!this.authToken) {
      throw new Error('Token de autenticação não disponível');
    }

    const response = await axios.get(`${config.baseURL}/chat/conversations`, {
      headers: { Authorization: `Bearer ${this.authToken}` }
    });

    if (!response.data.success) {
      throw new Error('Falha na obtenção do histórico do chat');
    }
  }

  // Testes de Fretes
  async testFreightCreation() {
    if (!this.authToken) {
      throw new Error('Token de autenticação não disponível');
    }

    const freightData = {
      origin: {
        address: 'São Paulo, SP',
        coordinates: { lat: -23.5505, lng: -46.6333 }
      },
      destination: {
        address: 'Mato Grosso, MT',
        coordinates: { lat: -15.6014, lng: -56.0979 }
      },
      pickupDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      deliveryDateEstimate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      items: [{
        name: 'Soja',
        quantity: 1000,
        weight: 1000,
        value: 50000
      }],
      pricing: {
        totalValue: 50000,
        freightCost: 5000
      }
    };

    const response = await axios.post(`${config.baseURL}/freight-orders`, freightData, {
      headers: { Authorization: `Bearer ${this.authToken}` }
    });

    if (!response.data.success) {
      throw new Error('Falha na criação de frete');
    }

    return response.data.data._id;
  }

  async testFreightTracking(freightId) {
    if (!this.authToken) {
      throw new Error('Token de autenticação não disponível');
    }

    const trackingData = {
      location: 'São Paulo, SP',
      status: 'in_transit',
      coordinates: { lat: -23.5505, lng: -46.6333 },
      notes: 'Carga em trânsito'
    };

    const response = await axios.post(
      `${config.baseURL}/freight-orders/${freightId}/track`,
      trackingData,
      { headers: { Authorization: `Bearer ${this.authToken}` } }
    );

    if (!response.data.success) {
      throw new Error('Falha na atualização de rastreamento');
    }
  }

  async testAIClosure(freightId) {
    if (!this.authToken) {
      throw new Error('Token de autenticação não disponível');
    }

    const response = await axios.post(
      `${config.baseURL}/freight-orders/${freightId}/ai-closure`,
      {},
      { headers: { Authorization: `Bearer ${this.authToken}` } }
    );

    if (!response.data.success) {
      throw new Error('Falha no fechamento assistido por IA');
    }
  }

  // Testes de Validação de Endereços
  async testAddressValidation() {
    const response = await axios.post(`${config.baseURL}/address/validate-cep`, {
      cep: '01310-100'
    });

    if (!response.data.success) {
      throw new Error('Falha na validação de CEP');
    }
  }

  async testInternationalAddressValidation() {
    const response = await axios.post(`${config.baseURL}/address/validate-address`, {
      country: 'Brasil',
      address: {
        street: 'Avenida Paulista',
        number: '1000',
        district: 'Bela Vista',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01310-100'
      }
    });

    if (!response.data.success) {
      throw new Error('Falha na validação de endereço internacional');
    }
  }

  // Testes de Auditoria
  async testAuditLogs() {
    if (!this.adminToken) {
      throw new Error('Token de admin não disponível');
    }

    const response = await axios.get(`${config.baseURL}/audit-logs`, {
      headers: { Authorization: `Bearer ${this.adminToken}` }
    });

    if (!response.data.success) {
      throw new Error('Falha na obtenção de logs de auditoria');
    }
  }

  async testPIIAccessLogs() {
    if (!this.adminToken) {
      throw new Error('Token de admin não disponível');
    }

    const response = await axios.get(`${config.baseURL}/audit-logs/pii-access`, {
      headers: { Authorization: `Bearer ${this.adminToken}` }
    });

    if (!response.data.success) {
      throw new Error('Falha na obtenção de logs de acesso PII');
    }
  }

  // Testes de Sistema
  async testHealthCheck() {
    const response = await axios.get(`${config.baseURL.replace('/api', '')}/health`);

    if (response.data.status !== 'OK') {
      throw new Error('Health check falhou');
    }
  }

  async testDatabaseConnection() {
    // Teste indireto através de uma operação que requer banco
    const response = await axios.get(`${config.baseURL}/products`);

    if (!response.data.success) {
      throw new Error('Conexão com banco de dados falhou');
    }
  }

  // Executar todos os testes
  async runAllTests() {
    log('🚀 Iniciando testes automatizados do AGROISYNC');
    log(`📡 API URL: ${config.baseURL}`);
    log(`🌐 Frontend URL: ${config.frontendURL}`);

    // Testes de Sistema
    await this.runTest('Health Check', () => this.testHealthCheck());
    await this.runTest('Database Connection', () => this.testDatabaseConnection());

    // Testes de Autenticação
    await this.runTest('User Registration', () => this.testUserRegistration());
    await this.runTest('User Login', () => this.testUserLogin());
    await this.runTest('Admin Login', () => this.testAdminLogin());
    await this.runTest('Password Reset Request', () => this.testPasswordReset());

    // Testes de Chat
    await this.runTest('Chat Send Message', () => this.testChatSend());
    await this.runTest('Chat History', () => this.testChatHistory());

    // Testes de Fretes
    let freightId = null;
    await this.runTest('Freight Creation', async () => {
      freightId = await this.testFreightCreation();
    });

    if (freightId) {
      await this.runTest('Freight Tracking Update', () => this.testFreightTracking(freightId));
      await this.runTest('AI-Assisted Closure', () => this.testAIClosure(freightId));
    }

    // Testes de Validação de Endereços
    await this.runTest('CEP Validation', () => this.testAddressValidation());
    await this.runTest('International Address Validation', () => this.testInternationalAddressValidation());

    // Testes de Auditoria
    await this.runTest('Audit Logs Access', () => this.testAuditLogs());
    await this.runTest('PII Access Logs', () => this.testPIIAccessLogs());

    // Relatório final
    this.generateReport();
  }

  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        total: this.results.total,
        passed: this.results.passed,
        failed: this.results.failed,
        successRate: ((this.results.passed / this.results.total) * 100).toFixed(2) + '%'
      },
      details: this.results.details,
      environment: {
        apiUrl: config.baseURL,
        frontendUrl: config.frontendURL,
        nodeVersion: process.version,
        platform: process.platform
      }
    };

    // Salvar relatório
    const reportPath = path.join(__dirname, '..', 'test-results.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    // Exibir resumo
    log('\n📊 RESUMO DOS TESTES');
    log(`Total de testes: ${this.results.total}`);
    log(`Testes passaram: ${this.results.passed}`);
    log(`Testes falharam: ${this.results.failed}`);
    log(`Taxa de sucesso: ${report.summary.successRate}`);

    if (this.results.failed > 0) {
      log('\n❌ TESTES QUE FALHARAM:');
      this.results.details
        .filter(test => test.status === 'FAILED')
        .forEach(test => {
          log(`- ${test.name}: ${test.error}`);
        });
    }

    log(`\n📄 Relatório completo salvo em: ${reportPath}`);

    // Exit code baseado nos resultados
    process.exit(this.results.failed > 0 ? 1 : 0);
  }
}

// Executar testes se chamado diretamente
if (require.main === module) {
  const tester = new AgroSyncTester();
  tester.runAllTests().catch(error => {
    logError(`Erro fatal nos testes: ${error.message}`);
    process.exit(1);
  });
}

module.exports = AgroSyncTester;
