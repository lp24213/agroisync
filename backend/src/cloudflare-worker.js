/**
 * Cloudflare Worker - AgroSync Backend API
 * Configurado para agroisync.com/api/*
 */

// Helper: parse response defensively (try json, fallback to text)
async function parseResponseSafe(response) {
  try {
    const text = await response.text();
    if (!text) return null;
    try {
      return JSON.parse(text);
    } catch (e) {
      // Retornar texto cru quando não for JSON
      return text;
    }
  } catch (err) {
    return null;
  }
}

// ============================================
// ASAAS SERVICE (INLINE)
// ============================================
class AsaasService {
  constructor(apiKey, env = 'production') {
    this.apiKey = apiKey;
    this.baseUrl = env === 'production' 
      ? 'https://api.asaas.com/v3'
      : 'https://sandbox.asaas.com/api/v3';
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'access_token': this.apiKey,
      'User-Agent': 'Agroisync/1.0',
      'Accept': 'application/json'
    };
  }

  async createPixCharge({ value, description, customer }) {
    try {
      console.log('💳 [ASAAS] Criando cobrança PIX:', { value, customer });

      const defaultHeaders = this.defaultHeaders;

      const response = await fetch(`${this.baseUrl}/payments`, {
        method: 'POST',
        headers: defaultHeaders,
        body: JSON.stringify({
          customer: customer.id,
          billingType: 'PIX',
          value: value,
          dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // +1 dia
          description: description,
          externalReference: `agroisync-${Date.now()}`
        })
      });

      if (!response.ok) {
        const parsed = await parseResponseSafe(response);
        const errorMsg = typeof parsed === 'string' ? parsed : (parsed?.errors?.[0]?.description || JSON.stringify(parsed));
        console.error('❌ [ASAAS] Erro ao criar cobrança PIX:', errorMsg);
        throw new Error(errorMsg || 'Erro ao criar cobrança PIX');
      }

      const payment = await parseResponseSafe(response);

      // Buscar QR Code
      const qrCodeResponse = await fetch(`${this.baseUrl}/payments/${payment.id}/pixQrCode`, {
        headers: this.defaultHeaders
      });

      const qrCodeData = await parseResponseSafe(qrCodeResponse);

      console.log('✅ [ASAAS] Cobrança PIX criada com sucesso');

      return {
        success: true,
        paymentId: payment.id,
        invoiceUrl: payment.invoiceUrl,
        qrCode: qrCodeData.encodedImage,
        qrCodeText: qrCodeData.payload,
        expiresAt: payment.dueDate,
        value: payment.value
      };
    } catch (error) {
      console.error('❌ [ASAAS] Erro:', error);
      return { success: false, error: error.message };
    }
  }

  async createBoletoCharge({ value, description, customer, dueDate }) {
    try {
      console.log('💳 [ASAAS] Criando boleto:', { value, customer });

      const defaultHeaders = this.defaultHeaders;

      const response = await fetch(`${this.baseUrl}/payments`, {
        method: 'POST',
        headers: defaultHeaders,
        body: JSON.stringify({
          customer: customer.id,
          billingType: 'BOLETO',
          value: value,
          dueDate: dueDate || new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // +3 dias
          description: description,
          externalReference: `agroisync-${Date.now()}`
        })
      });

      if (!response.ok) {
        const parsed = await parseResponseSafe(response);
        const errorMsg = typeof parsed === 'string' ? parsed : (parsed?.errors?.[0]?.description || JSON.stringify(parsed));
        console.error('❌ [ASAAS] Erro ao criar boleto:', errorMsg);
        throw new Error(errorMsg || 'Erro ao criar boleto');
      }

      const payment = await parseResponseSafe(response);

      console.log('✅ [ASAAS] Boleto criado com sucesso');

      return {
        success: true,
        paymentId: payment.id,
        invoiceUrl: payment.invoiceUrl,
        bankSlipUrl: payment.bankSlipUrl,
        barcode: payment.identificationField,
        dueDate: payment.dueDate,
        value: payment.value
      };
    } catch (error) {
      console.error('❌ [ASAAS] Erro:', error);
      return { success: false, error: error.message };
    }
  }

  async createOrGetCustomer({ name, email, cpfCnpj, phone }) {
    try {
      console.log('🔍 [ASAAS] Buscando cliente:', email);
      console.log('🔍 [ASAAS] API Key presente:', !!this.apiKey);
      console.log('🔍 [ASAAS] Base URL:', this.baseUrl);
      
      // Verificar se cliente já existe
      // Montar query de busca: preferir email, cair para cpfCnpj quando email não disponível
      const queryParts = [];
      if (email) queryParts.push(`email=${encodeURIComponent(email)}`);
      if (cpfCnpj) queryParts.push(`cpfCnpj=${encodeURIComponent(cpfCnpj.replace(/\D/g, ''))}`);
      const searchUrl = `${this.baseUrl}/customers${queryParts.length ? '?' + queryParts.join('&') : ''}`;

      const defaultHeaders = this.defaultHeaders;

      const searchResponse = await fetch(searchUrl, {
        headers: defaultHeaders
      });

      console.log('📊 [ASAAS] Status da busca:', searchResponse.status);

      const searchData = await parseResponseSafe(searchResponse);

      if (searchData && searchData.data && searchData.data.length > 0) {
        console.log('✅ [ASAAS] Cliente já existe:', searchData.data[0].id);
        return { success: true, customer: searchData.data[0] };
      }

      // Criar novo cliente
      // Montar payload de criação contendo só campos presentes
      const payload = {};
      if (name) payload.name = name;
      if (email) payload.email = email;
      if (cpfCnpj) payload.cpfCnpj = cpfCnpj.replace(/\D/g, '');
      if (phone) payload.phone = phone.replace(/\D/g, '');
      payload.notificationDisabled = false;

      const response = await fetch(`${this.baseUrl}/customers`, {
        method: 'POST',
        headers: this.defaultHeaders,
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const parsed = await parseResponseSafe(response);
        const safeMessage = typeof parsed === 'string' ? parsed.split('\n')[0] : (parsed?.errors?.[0]?.description || `Erro desconhecido (status ${response.status})`);
        console.error('❌ [ASAAS] Erro ao criar cliente - Status:', response.status);
        console.error('❌ [ASAAS] Resposta:', parsed);
        return { success: false, error: safeMessage };
      }

      const customer = await parseResponseSafe(response);
      console.log('✅ [ASAAS] Cliente criado:', customer.id);

      return { success: true, customer };
    } catch (error) {
      console.error('❌ [ASAAS] Erro ao criar/buscar cliente:', error);
      return { success: false, error: error.message };
    }
  }

  async createCreditCardCharge({ value, description, customer, creditCard, creditCardHolderInfo, installmentCount = 1 }) {
    try {
      console.log('💳 [ASAAS] Criando cobrança com cartão:', { value, customer, installmentCount });

      const payload = {
        customer: customer.id,
        billingType: 'CREDIT_CARD',
        value: value,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // +7 dias
        description: description,
        externalReference: `agroisync-${Date.now()}`,
        creditCard: {
          holderName: creditCard.holderName,
          number: creditCard.number,
          expiryMonth: creditCard.expiryMonth,
          expiryYear: creditCard.expiryYear,
          ccv: creditCard.ccv
        },
        creditCardHolderInfo: {
          name: creditCardHolderInfo.name,
          email: creditCardHolderInfo.email,
          cpfCnpj: creditCardHolderInfo.cpfCnpj,
          postalCode: creditCardHolderInfo.postalCode,
          addressNumber: creditCardHolderInfo.addressNumber,
          phone: creditCardHolderInfo.phone
        }
      };

      if (installmentCount > 1) {
        payload.installmentCount = installmentCount;
        payload.installmentValue = (value / installmentCount).toFixed(2);
      }

      const defaultHeaders = this.defaultHeaders;

      const response = await fetch(`${this.baseUrl}/payments`, {
        method: 'POST',
        headers: defaultHeaders,
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
          const parsed = await parseResponseSafe(response);
          const errorMsg = typeof parsed === 'string' ? parsed : (parsed?.errors?.[0]?.description || JSON.stringify(parsed));
          console.error('❌ [ASAAS] Erro ao criar cobrança com cartão:', errorMsg);
          throw new Error(errorMsg || 'Erro ao processar cartão');
      }

      const payment = await parseResponseSafe(response);

      console.log('✅ [ASAAS] Cobrança com cartão criada com sucesso');

      return {
        success: true,
        paymentId: payment.id,
        status: payment.status,
        invoiceUrl: payment.invoiceUrl,
        value: payment.value,
        installmentCount: payment.installmentCount
      };
    } catch (error) {
      console.error('❌ [ASAAS] Erro:', error);
      return { success: false, error: error.message };
    }
  }

  async getPaymentStatus(paymentId) {
    try {
      const response = await fetch(`${this.baseUrl}/payments/${paymentId}`, {
        headers: this.defaultHeaders
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar status do pagamento');
      }

      const payment = await parseResponseSafe(response);
      return {
        success: true,
        status: payment.status,
        payment: payment
      };
    } catch (error) {
      console.error('❌ [ASAAS] Erro ao buscar status:', error);
      return { success: false, error: error.message };
    }
  }
}

// ============================================
// SANTANDER SERVICE (INLINE) - DEPRECATED
// ============================================
class SantanderService {
  constructor(clientId, clientSecret, env = 'production') {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.baseUrl = env === 'production' 
      ? 'https://api.santander.com.br'
      : 'https://api-sandbox.santander.com.br';
    this.authUrl = env === 'production'
      ? 'https://oauth.santander.com.br'
      : 'https://oauth-sandbox.santander.com.br';
    this.accessToken = null;
    this.tokenExpiry = null;
  }

  async authenticate() {
    try {
      if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
        return this.accessToken;
      }

      console.log('🔐 Autenticando no Santander...');

      const credentials = btoa(`${this.clientId}:${this.clientSecret}`);
      
      const response = await fetch(`${this.authUrl}/auth/oauth/v2/token`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials'
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('❌ Erro na autenticação Santander:', error);
        throw new Error('Falha na autenticação com Santander');
      }

      const data = await response.json();
      this.accessToken = data.access_token;
      this.tokenExpiry = Date.now() + ((data.expires_in || 3600) - 300) * 1000;

      console.log('✅ Autenticado no Santander');
      return this.accessToken;
    } catch (error) {
      console.error('❌ Erro na autenticação:', error);
      throw error;
    }
  }

  async createPixQRCode({ amount, description, customerName, customerDocument, expiresIn = 3600 }) {
    const txid = this.generateTxid();
    
    // Tentar API Real primeiro
    try {
      const token = await this.authenticate();
      
      const payload = {
        calendario: { expiracao: expiresIn },
        devedor: {
          cpf: customerDocument.replace(/\D/g, '').substring(0, 11),
          nome: customerName
        },
        valor: { original: amount.toFixed(2) },
        chave: this.clientId,
        solicitacaoPagador: description || 'Pagamento AgroSync'
      };

      console.log('🔄 [API REAL] Tentando gerar QR Code PIX:', { txid, amount });

      const response = await fetch(`${this.baseUrl}/pix/v2/cob/${txid}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-Application-Key': this.clientId
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        const qrCodeResponse = await fetch(`${this.baseUrl}/pix/v2/cob/${txid}/qrcode`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'X-Application-Key': this.clientId
          }
        });

        if (qrCodeResponse.ok) {
          const qrCodeData = await qrCodeResponse.json();
          console.log('✅ [API REAL] QR Code PIX gerado com sucesso');
          return {
            success: true,
            txid: data.txid,
            status: data.status,
            qrCode: qrCodeData.imagemQrcode,
            qrCodeText: qrCodeData.qrcode,
            expiresAt: new Date(Date.now() + expiresIn * 1000).toISOString()
          };
        }
      }
      
      console.warn('⚠️ [API REAL] Falhou, usando MOCK');
    } catch (apiError) {
      console.warn('⚠️ [API REAL] Erro:', apiError.message, '- usando MOCK');
    }
    
    // FALLBACK: Mock para desenvolvimento
    console.log('🎭 [MOCK] Gerando QR Code PIX simulado:', { txid, amount });
    const qrCodeText = `00020126580014br.gov.bcb.pix0136${txid}520400005303986540${amount.toFixed(2)}5802BR5913AgroSync Ltda6009SAO PAULO62070503***6304XXXX`;
    const qrCodeBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    
    return {
      success: true,
      txid: txid,
      status: 'ATIVA',
      qrCode: qrCodeBase64,
      qrCodeText: qrCodeText,
      expiresAt: new Date(Date.now() + expiresIn * 1000).toISOString()
    };
  }

  async createBoleto({ amount, customerName, customerDocument, customerEmail, dueDate, description }) {
    const boletoId = this.generateBoletoNumber();
    
    // Tentar API Real primeiro
    try {
      const token = await this.authenticate();

      const payload = {
        beneficiario: {
          nome: 'AgroSync',
          documento: '00000000000000',
          agencia: '0000',
          conta: '00000000',
          convenio: '0000000'
        },
        pagador: {
          nome: customerName,
          documento: customerDocument.replace(/\D/g, ''),
          email: customerEmail
        },
        dataVencimento: dueDate,
        valor: amount.toFixed(2),
        numeroTitulo: boletoId,
        descricao: description || 'Pagamento AgroSync'
      };

      console.log('🔄 [API REAL] Tentando gerar boleto:', { amount, dueDate });

      const response = await fetch(`${this.baseUrl}/cobranca/v1/boletos`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-Application-Key': this.clientId
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ [API REAL] Boleto gerado com sucesso');
        return {
          success: true,
          boletoId: data.nossoNumero,
          barcode: data.linhaDigitavel,
          barcodeNumber: data.codigoBarras,
          pdfUrl: data.urlBoleto,
          dueDate: data.dataVencimento,
          amount: data.valor
        };
      }
      
      console.warn('⚠️ [API REAL] Falhou, usando MOCK');
    } catch (apiError) {
      console.warn('⚠️ [API REAL] Erro:', apiError.message, '- usando MOCK');
    }
    
    // FALLBACK: Mock para desenvolvimento
    console.log('🎭 [MOCK] Gerando boleto simulado:', { amount, dueDate });
    const barcodeNumber = `03399876543210000000${boletoId}00000000${Math.floor(amount * 100)}`;
    const barcode = `${barcodeNumber.substring(0,5)}.${barcodeNumber.substring(5,10)} ${barcodeNumber.substring(10,15)}.${barcodeNumber.substring(15,21)} ${barcodeNumber.substring(21,26)}.${barcodeNumber.substring(26,32)} ${barcodeNumber.substring(32,33)} ${barcodeNumber.substring(33)}`;
    
    return {
      success: true,
      boletoId: boletoId,
      barcode: barcode,
      barcodeNumber: barcodeNumber,
      pdfUrl: `https://agroisync.com/boleto/${boletoId}.pdf`,
      dueDate: dueDate,
      amount: amount.toFixed(2)
    };
  }

  async processWebhook(payload, signature, secret) {
    try {
      const isValid = await this.validateSignature(payload, signature, secret);
      
      if (!isValid) {
        console.error('❌ Assinatura inválida do webhook');
        return { success: false, error: 'Assinatura inválida' };
      }

      const data = JSON.parse(payload);
      console.log('📥 Webhook recebido:', data.tipo);

      if (data.tipo === 'PIX_RECEBIDO') {
        return {
          success: true,
          type: 'pix',
          status: 'paid',
          txid: data.pix.txid,
          amount: parseFloat(data.pix.valor),
          paidAt: data.pix.horario
        };
      }

      if (data.tipo === 'BOLETO_LIQUIDADO') {
        return {
          success: true,
          type: 'boleto',
          status: 'paid',
          boletoId: data.boleto.nossoNumero,
          amount: parseFloat(data.boleto.valorPago),
          paidAt: data.boleto.dataLiquidacao
        };
      }

      return { success: false, error: 'Tipo de evento desconhecido' };
    } catch (error) {
      console.error('❌ Erro ao processar webhook:', error);
      return { success: false, error: error.message };
    }
  }

  generateTxid() {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let txid = '';
    for (let i = 0; i < 32; i++) {
      txid += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return txid;
  }

  generateBoletoNumber() {
    return Date.now().toString() + Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  }

  async validateSignature(payload, signature, secret) {
    try {
      const encoder = new TextEncoder();
      const key = await crypto.subtle.importKey(
        'raw',
        encoder.encode(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
      );
      
      const signatureBuffer = await crypto.subtle.sign(
        'HMAC',
        key,
        encoder.encode(payload)
      );
      
      const computedSignature = Array.from(new Uint8Array(signatureBuffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
      
      return computedSignature === signature;
    } catch (error) {
      console.error('❌ Erro ao validar assinatura:', error);
      return false;
    }
  }
}

// ============================================
// HELPERS E UTILITIES
// ============================================

function jsonResponse(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      ...headers
    }
  });
}

function getDb(env) {
  const db = env.DB || env.AGROISYNC_DB;
  if (!db) {
    throw new Error('Database binding not found');
  }
  return db;
}

// Plan Limits Helper Functions
async function checkUserLimit(db, userId, type) {
  try {
    const user = await db.prepare('SELECT plan, plan_expires_at FROM users WHERE id = ?').bind(userId).first();
    if (!user) return { allowed: false, current: 0, limit: 0, plan: null, error: 'Usuário não encontrado' };

    // VERIFICAR SE O PLANO EXPIROU
    if (user.plan_expires_at) {
      const expiresAt = new Date(user.plan_expires_at);
      const now = new Date();
      
      if (now > expiresAt) {
        return { 
          allowed: false, 
          current: 0, 
          limit: 0, 
          plan: user.plan,
          expired: true,
          error: 'Seu período de teste expirou! Assine um plano para continuar.'
        };
      }
    }

    const plan = await db.prepare('SELECT * FROM plans WHERE slug = ?').bind(user.plan || 'inicial').first();
    if (!plan) return { allowed: false, current: 0, limit: 0, plan: user.plan };

    const limit = type === 'freight' ? plan.freight_limit : plan.product_limit;
    if (limit === -1) return { allowed: true, current: 0, limit: -1, plan: user.plan, planName: plan.name };

    const currentMonth = new Date().toISOString().slice(0, 7);
    let usage = await db.prepare(
      'SELECT freights_used, products_used FROM user_usage WHERE user_id = ? AND month = ?'
    ).bind(userId, currentMonth).first();

    if (!usage) {
      await db.prepare(
        'INSERT INTO user_usage (user_id, month, freights_used, products_used) VALUES (?, ?, 0, 0)'
      ).bind(userId, currentMonth).run();
      usage = { freights_used: 0, products_used: 0 };
    }

    const current = type === 'freight' ? usage.freights_used : usage.products_used;
    return { allowed: current < limit, current, limit, plan: user.plan, planName: plan.name };
    } catch (error) {
    console.error('Erro ao verificar limite:', error);
    return { allowed: true, current: 0, limit: -1, plan: null }; // Em caso de erro, permitir
  }
}

async function incrementUserUsage(db, userId, type) {
  try {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const field = type === 'freight' ? 'freights_used' : 'products_used';
    await db.prepare(
      `UPDATE user_usage SET ${field} = ${field} + 1 WHERE user_id = ? AND month = ?`
    ).bind(userId, currentMonth).run();
    return { success: true };
  } catch (error) {
    console.error('Erro ao incrementar uso:', error);
    return { success: false };
  }
}

// ============================================
// JWT UTILITIES
// ============================================

async function generateJWT(payload, secret) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const headerB64 = btoa(JSON.stringify(header));
  const payloadB64 = btoa(JSON.stringify({ ...payload, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 }));
  const data = `${headerB64}.${payloadB64}`;
  
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(data));
  const signatureB64 = btoa(String.fromCharCode(...new Uint8Array(signature)));
  
  return `${data}.${signatureB64}`;
}

async function verifyJWT(request, secret) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    
    const token = authHeader.substring(7);
    const [headerB64, payloadB64, signatureB64] = token.split('.');
    
    if (!headerB64 || !payloadB64 || !signatureB64) {
      return null;
    }
    
    // Verificar assinatura
    const expectedSignature = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    
    const signature = await crypto.subtle.sign(
      'HMAC',
      expectedSignature,
      new TextEncoder().encode(`${headerB64}.${payloadB64}`)
    );
    
    const expectedSignatureB64 = btoa(String.fromCharCode(...new Uint8Array(signature)));
    
    if (signatureB64 !== expectedSignatureB64) {
      console.error('JWT signature verification failed');
      return null;
    }
    
    const payload = JSON.parse(atob(payloadB64));
    
    if (payload.exp && payload.exp < Date.now()) {
      console.error('JWT token expired');
      return null;
    }
    
    return payload;
  } catch (error) {
    console.error('JWT verification error:', error);
    return null;
  }
}

// ============================================
// TURNSTILE VERIFICATION
// ============================================

async function verifyTurnstile(token, remoteip, env) {
  try {
    if (!env.CF_TURNSTILE_SECRET_KEY) {
      return { success: true }; // Skip in dev
    }
    
    const formData = new FormData();
    formData.append('secret', env.CF_TURNSTILE_SECRET_KEY);
    formData.append('response', token);
    if (remoteip) formData.append('remoteip', remoteip);
    
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData
    });
    
    return await response.json();
  } catch (error) {
    console.error('Turnstile error:', error);
    return { success: false };
  }
}

// ============================================
// EMAIL UTILITIES (RESEND)
// ============================================

async function sendEmail(env, { to, subject, html, text }) {
  try {
    if (!env.RESEND_API_KEY || env.RESEND_API_KEY === 're_placeholder_configure_real_key_later') {
      console.log('Email would be sent (no Resend configured):', { to, subject });
      return { success: false, id: 'dev-mode', reason: 'no-resend-key' };
    }
    
    const from = env.RESEND_FROM_EMAIL || env.RESEND_FROM || 'AgroSync <contato@agroisync.com>';
    
    console.log('Sending email via Resend:', { to, from, subject });
    
    const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
      body: JSON.stringify({
        from,
        to,
        subject,
        html,
        ...(text ? { text } : {})
      })
    });
    
    const responseText = await response.text();
    console.log('Resend response:', { status: response.status, body: responseText });
    
    if (!response.ok) {
      console.error('Resend error:', { status: response.status, body: responseText });
      return { success: false, error: `Email failed: ${response.status}`, details: responseText };
    }
    
    const data = JSON.parse(responseText);
    console.log('Email sent successfully:', data);
    return { success: true, id: data.id };
  } catch (error) {
    console.error('Send email error:', error);
    return { success: false, error: error.message };
  }
}

// ============================================
// PASSWORD HASHING (bcrypt alternative for Workers)
// ============================================

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(hash)));
}

async function verifyPassword(password, hash) {
  const newHash = await hashPassword(password);
  return newHash === hash;
}

// ============================================
// ROUTE HANDLERS
// ============================================

// Health Check
async function handleHealth(request, env) {
  try {
    const db = getDb(env);
    await db.prepare('SELECT 1').first();

  return jsonResponse({
    success: true,
      status: 'healthy',
      message: 'AgroSync API is running',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      services: {
        database: 'connected',
        kv: env.SESSIONS ? 'connected' : 'not configured',
        resend: env.RESEND_API_KEY ? 'configured' : 'not configured',
        turnstile: env.CF_TURNSTILE_SECRET_KEY ? 'configured' : 'not configured'
      }
    });
  } catch (error) {
    return jsonResponse({
      success: false,
      status: 'unhealthy',
      error: error.message
    }, 503);
  }
}

// Auth - Register
async function handleRegister(request, env) {
  try {
  const { email, password, name, cpf, cnpj, ie, turnstileToken } = await request.json();
    
    if (!email || !password || !name) {
    return jsonResponse({ success: false, error: 'Dados incompletos' }, 400);
  }

    // VERIFICAR BLOQUEIOS (LGPD/Segurança)
    const db = getDb(env);
    
    // Criar tabela de bloqueios se não existir
    await db.prepare(`
      CREATE TABLE IF NOT EXISTS blocked_identifiers (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        value TEXT NOT NULL,
        reason TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        created_by TEXT
      )
    `).run();
    
    // Verificar se email, CPF, CNPJ ou IE estão bloqueados
    const emailBlocked = await db.prepare('SELECT * FROM blocked_identifiers WHERE type = ? AND value = ?')
      .bind('email', email.toLowerCase()).first();
    if (emailBlocked) {
      return jsonResponse({ success: false, error: 'Email bloqueado. Contate o suporte.' }, 403);
    }
    
    if (cpf) {
      const cpfBlocked = await db.prepare('SELECT * FROM blocked_identifiers WHERE type = ? AND value = ?')
        .bind('cpf', cpf.replace(/\D/g, '')).first();
      if (cpfBlocked) {
        return jsonResponse({ success: false, error: 'CPF bloqueado. Contate o suporte.' }, 403);
      }
    }
    
    if (cnpj) {
      const cnpjBlocked = await db.prepare('SELECT * FROM blocked_identifiers WHERE type = ? AND value = ?')
        .bind('cnpj', cnpj.replace(/\D/g, '')).first();
      if (cnpjBlocked) {
        return jsonResponse({ success: false, error: 'CNPJ bloqueado. Contate o suporte.' }, 403);
      }
    }
    
    if (ie) {
      const ieBlocked = await db.prepare('SELECT * FROM blocked_identifiers WHERE type = ? AND value = ?')
        .bind('ie', ie.toLowerCase()).first();
      if (ieBlocked) {
        return jsonResponse({ success: false, error: 'IE bloqueado. Contate o suporte.' }, 403);
      }
    }

    // Verify Turnstile (log apenas para debug)
    if (turnstileToken && env.CF_TURNSTILE_SECRET_KEY) {
      try {
  const turnstileResult = await verifyTurnstile(turnstileToken, null, env);
        console.log('✅ Turnstile validation result:', JSON.stringify(turnstileResult));
        
        // Temporariamente NÃO bloqueia para debug
  if (!turnstileResult.success) {
          console.warn('⚠️ Turnstile falhou mas permitindo cadastro:', turnstileResult['error-codes']);
        }
      } catch (e) {
        console.error('❌ Erro no Turnstile:', e);
      }
    } else {
      console.log('📝 Sem token do Turnstile ou secret key não configurada');
  }
    
    // Check if user exists
    const existing = await db.prepare('SELECT id FROM users WHERE email = ?')
      .bind(email.toLowerCase())
      .first();
    
    if (existing) {
    return jsonResponse({ success: false, error: 'Email já cadastrado' }, 409);
  }

    // Hash password
    const hashedPassword = await hashPassword(password);
    
    // Insert user com plano inicial e 3 dias de teste grátis
    const trialExpiresAt = new Date();
    trialExpiresAt.setDate(trialExpiresAt.getDate() + 3); // 3 dias a partir de agora
    
    // Insert sem especificar ID (auto-increment)
    const result = await db.prepare(
      "INSERT INTO users (name, email, password, plan, plan_expires_at) VALUES (?, ?, ?, 'inicial', ?)"
    ).bind(name, email.toLowerCase(), hashedPassword, trialExpiresAt.toISOString()).run();
    
    // Pegar o ID gerado automaticamente
    const userId = result.meta.last_row_id.toString();
    
    // Send welcome email
  await sendEmail(env, {
    to: email,
    subject: 'Bem-vindo ao AgroSync',
      html: `<h1>Olá ${name}!</h1><p>Sua conta foi criada com sucesso na AgroSync.</p>`
    });
    
    // Enviar código de verificação de email
    await sendVerificationEmail(env, userId, email);
    
    // Generate JWT
    const token = await generateJWT({ userId, email, name }, env.JWT_SECRET);
    
    return jsonResponse({
      success: true,
      data: {
        token,
        user: { id: userId, email, name },
        email_verification_required: true
      }
    }, 201);
  } catch (error) {
    console.error('Register error:', error);
    return jsonResponse({ success: false, error: 'Erro ao registrar usuário' }, 500);
  }
}

// Create User with optional avatar (simple, secure proposal)
// Accepts JSON: { name, email, password, avatarBase64 (optional), avatarFilename (optional) }
// If avatarBase64 present and env.R2_BUCKET is configured + R2 binding, will upload to R2 and store URL in users.avatar_url
async function handleCreateUserWithAvatar(request, env) {
  try {
    const contentType = request.headers.get('Content-Type') || '';
    if (!contentType.includes('application/json')) {
      return jsonResponse({ success: false, error: 'Use application/json com avatar em base64' }, 400);
    }

    const { name, email, password, avatarBase64, avatarFilename } = await request.json();
    if (!name || !email || !password) {
      return jsonResponse({ success: false, error: 'Dados obrigatórios: name, email, password' }, 400);
    }

    const db = getDb(env);

    // Check existing
    const existing = await db.prepare('SELECT id FROM users WHERE email = ?').bind(email.toLowerCase()).first();
    if (existing) return jsonResponse({ success: false, error: 'Email já cadastrado' }, 409);

    // Hash password
    const hashed = await hashPassword(password);

    // Insert user
    const result = await db.prepare(
      "INSERT INTO users (name, email, password, plan, created_at) VALUES (?, ?, ?, 'inicial', datetime('now'))"
    ).bind(name, email.toLowerCase(), hashed).run();

    const userId = result.meta?.last_row_id || null;
    let avatarUrl = null;

    // If avatar provided and R2 binding exists, upload
    if (avatarBase64 && env.R2_BUCKET) {
      try {
        const key = `avatars/${userId}-${Date.now()}-${avatarFilename || 'avatar.png'}`;
        const buffer = Uint8Array.from(atob(avatarBase64.replace(/^data:\w+\/[a-zA-Z]+;base64,/, '')), c => c.charCodeAt(0));
        await env.R2_BUCKET.put(key, buffer, {
          httpMetadata: { contentType: 'image/png' }
        });
        // If public, construct URL (depends on account/account-level binding). We'll store a relative key.
        avatarUrl = `https://{R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${key}`; // <-- replace token programmatically in deploy
        // Save avatar_url
        await db.prepare('UPDATE users SET avatar_url = ? WHERE id = ?').bind(avatarUrl, userId).run();
      } catch (e) {
        console.warn('Avatar upload failed:', e.message || e);
      }
    }

    // Generate token
    const token = await generateJWT({ userId: userId.toString(), email, name }, env.JWT_SECRET);

    return jsonResponse({ success: true, data: { user: { id: userId, name, email, avatar_url: avatarUrl }, token } }, 201);
  } catch (error) {
    console.error('Create user with avatar error:', error);
    return jsonResponse({ success: false, error: 'Erro ao criar usuário' }, 500);
  }
}

// R2 Upload Info - returns a structured upload info for client to PUT directly to R2
async function handleR2UploadInfo(request, env, user) {
  try {
    // Only allow authenticated users
    if (!user) return jsonResponse({ success: false, error: 'Não autorizado' }, 401);

    const { filename, contentType } = await request.json();
    if (!filename || !contentType) return jsonResponse({ success: false, error: 'filename e contentType são obrigatórios' }, 400);

    const key = `avatars/${user.userId}-${Date.now()}-${filename}`;

    // If R2 binding available, we could generate an object url; here we return structured info
    const info = {
      uploadUrl: env.R2_PUBLIC_URL ? `${env.R2_PUBLIC_URL}/${encodeURIComponent(key)}` : `https://{R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${encodeURIComponent(key)}`,
      method: 'PUT',
      headers: {
        'Content-Type': contentType
      },
      key
    };

    return jsonResponse({ success: true, data: info });
  } catch (error) {
    console.error('R2 upload info error:', error);
    return jsonResponse({ success: false, error: 'Erro ao gerar info de upload' }, 500);
  }
}

// Auth - Login
async function handleLogin(request, env) {
  try {
  const { email, password, turnstileToken } = await request.json();
    
    if (!email || !password) {
      return jsonResponse({ success: false, error: 'Email e senha são obrigatórios' }, 400);
  }

    // Verify Turnstile (log apenas para debug)
    if (turnstileToken && env.CF_TURNSTILE_SECRET_KEY) {
      try {
  const turnstileResult = await verifyTurnstile(turnstileToken, null, env);
        console.log('✅ Turnstile validation result:', JSON.stringify(turnstileResult));
        
        // Temporariamente NÃO bloqueia para debug
  if (!turnstileResult.success) {
          console.warn('⚠️ Turnstile falhou mas permitindo cadastro:', turnstileResult['error-codes']);
        }
      } catch (e) {
        console.error('❌ Erro no Turnstile:', e);
      }
    } else {
      console.log('📝 Sem token do Turnstile ou secret key não configurada');
  }

  const db = getDb(env);
    
    // Get user
    const user = await db.prepare('SELECT * FROM users WHERE email = ?')
      .bind(email.toLowerCase())
      .first();
    
  if (!user) {
    return jsonResponse({ success: false, error: 'Credenciais inválidas' }, 401);
  }
    
    // Verify password
    const validPassword = await verifyPassword(password, user.password);
  if (!validPassword) {
    return jsonResponse({ success: false, error: 'Credenciais inválidas' }, 401);
  }
    
    // Generate JWT
    const token = await generateJWT(
      { userId: user.id, email: user.email, name: user.name, role: user.role },
    env.JWT_SECRET
  );
    
  return jsonResponse({
    success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return jsonResponse({ success: false, error: 'Erro ao fazer login' }, 500);
  }
}

// Products - List
async function handleProductsList(request, env) {
  try {
  const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '20', 10);
  const offset = (page - 1) * limit;

    const db = getDb(env);
    
    const { results } = await db.prepare(
      'SELECT * FROM products WHERE status = ? ORDER BY created_at DESC LIMIT ? OFFSET ?'
    ).bind('active', limit, offset).all();
    
    const { total } = await db.prepare(
      'SELECT COUNT(*) as total FROM products WHERE status = ?'
    ).bind('active').first();

  return jsonResponse({
    success: true,
    data: {
      products: (results || []).map(p => ({
        id: p.id,
        name: p.name,
        description: p.description,
        category: p.category,
        price: p.price,
        quantity: p.quantity,
        unit: p.unit,
        origin: p.origin,
        quality_grade: p.quality_grade,
        harvest_date: p.harvest_date,
        certifications: p.certifications,
        images: p.images,
        status: p.status,
        created_at: p.created_at
      })),
      pagination: {
        currentPage: page,
        totalPages: Math.ceil((total || 0) / limit),
        totalItems: total || 0,
        itemsPerPage: limit
      }
    }
  });
  } catch (error) {
    console.error('Products list error:', error);
    return jsonResponse({ success: false, error: 'Erro ao listar produtos' }, 500);
  }
}

// Products - Create
async function handleProductCreate(request, env, user) {
  try {
    const { title, description, price, category, quantity, unit, images } = await request.json();
    
    if (!title || !price || !category) {
    return jsonResponse({ success: false, error: 'Dados incompletos' }, 400);
  }

    const db = getDb(env);
    
    // VERIFICAR LIMITE DO PLANO
    const limitCheck = await checkUserLimit(db, user.userId, 'product');
    
    if (!limitCheck.allowed) {
      const errorMsg = limitCheck.expired 
        ? '⏰ Seu período de teste de 3 dias expirou! Assine um plano para continuar usando o AgroSync.'
        : `Limite de produtos atingido! Seu plano ${limitCheck.planName} permite ${limitCheck.limit} produto(s) por mês. Você já usou ${limitCheck.current}. Faça upgrade para continuar!`;
      
      return jsonResponse({ 
        success: false, 
        error: errorMsg,
        limitReached: !limitCheck.expired,
        expired: limitCheck.expired,
        current: limitCheck.current,
        limit: limitCheck.limit,
        plan: limitCheck.plan
      }, 403);
    }
    
    const imagesJson = images ? JSON.stringify(images) : '[]';

    // Inserir sem especificar `id` (INTEGER AUTOINCREMENT no esquema atual)
    const insertResult = await db.prepare(
      "INSERT INTO products (user_id, name, description, category, price, quantity, unit, images, status, origin, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active', '', datetime('now'))"
    ).bind(user.userId, title, description || '', category, price, quantity || 0, unit || 'kg', imagesJson).run();

    // Recuperar id gerado pelo DB (last_row_id)
    const productId = insertResult?.meta?.last_row_id || null;

    // Incrementar uso
    await incrementUserUsage(db, user.userId, 'product');

    return jsonResponse({
      success: true,
      message: 'Produto criado com sucesso',
      data: { id: productId },
      usage: { current: limitCheck.current + 1, limit: limitCheck.limit }
    }, 201);
  } catch (error) {
    console.error('Product create error:', error);
    return jsonResponse({ success: false, error: 'Erro ao criar produto' }, 500);
  }
}

// Freight - List
async function handleFreightList(request, env) {
  try {
  const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '20', 10);
  const offset = (page - 1) * limit;

    const db = getDb(env);

    const { results } = await db.prepare(
      'SELECT * FROM freight WHERE status = ? ORDER BY created_at DESC LIMIT ? OFFSET ?'
    ).bind('available', limit, offset).all();

  return jsonResponse({
    success: true,
    data: {
      freights: (results || []).map(f => ({
        id: f.id,
        origin_city: f.origin_city,
        origin_state: f.origin_state,
        destination_city: f.destination_city,
        destination_state: f.destination_state,
        freight_type: f.freight_type,
        price_per_km: f.price_per_km,
        capacity: f.capacity,
        available_date: f.available_date,
        status: f.status,
        created_at: f.created_at
      })),
        pagination: { currentPage: page, itemsPerPage: limit }
      }
    });
  } catch (error) {
    console.error('Freight list error:', error);
    return jsonResponse({ success: false, error: 'Erro ao listar fretes' }, 500);
  }
}

// Plans - Public List (prices should be public)
async function handlePlansList(request, env) {
  try {
    const db = getDb(env);
    const { results } = await db.prepare('SELECT slug, name, price_monthly, price_6months, price_annual, features, product_limit, freight_limit FROM plans ORDER BY price_monthly ASC').all();

    const plans = (results || []).map(p => {
      // features may be stored as JSON string
      let features = [];
      try { features = p.features ? JSON.parse(p.features) : []; } catch (e) { features = []; }

      // try to compute price in cents if price_monthly is numeric
      let priceMonthly = p.price_monthly;
      let price_monthly_cents = null;
      if (typeof priceMonthly === 'number') {
        price_monthly_cents = Math.round(priceMonthly * 100);
      } else if (typeof priceMonthly === 'string' && priceMonthly.trim() !== '') {
        const parsed = Number(priceMonthly);
        if (!Number.isNaN(parsed)) price_monthly_cents = Math.round(parsed * 100);
      }

      return {
        slug: p.slug,
        name: p.name,
        price_monthly: p.price_monthly,
        price_monthly_cents: price_monthly_cents,
        price_6months: p.price_6months,
        price_annual: p.price_annual,
        product_limit: p.product_limit,
        freight_limit: p.freight_limit,
        features
      };
    });

    return jsonResponse({ success: true, data: { plans } });
  } catch (error) {
    console.error('Plans list error:', error);
    return jsonResponse({ success: false, error: 'Erro ao listar planos' }, 500);
  }
}

// Freight - Create
async function handleFreightCreate(request, env, user) {
  try {
    const bodyData = await request.json();
    const { 
      origin, 
      destination, 
      cargo_type, 
      weight, 
      capacity,
      price,
      // Dados completos do veículo
      vehicleType,
      vehicleBrand,
      vehicleModel,
      vehicleYear,
      vehicleColor,
      vehicleBodyType,
      vehicleAxles,
      licensePlate,
      chassisNumber,
      renavam,
      antt
    } = bodyData;
    
    if (!origin || !destination || !cargo_type) {
      return jsonResponse({ success: false, error: 'Dados incompletos' }, 400);
    }
    
    if (!licensePlate || !vehicleModel) {
      return jsonResponse({ success: false, error: 'Dados do veículo obrigatórios: placa e modelo' }, 400);
    }

    const db = getDb(env);
    
    // VERIFICAR LIMITE DO PLANO
    const limitCheck = await checkUserLimit(db, user.userId, 'freight');
    
    if (!limitCheck.allowed) {
      const errorMsg = limitCheck.expired 
        ? '⏰ Seu período de teste de 3 dias expirou! Assine um plano para continuar usando o AgroSync.'
        : `Limite de fretes atingido! Seu plano ${limitCheck.planName} permite ${limitCheck.limit} frete(s) por mês. Você já usou ${limitCheck.current}. Faça upgrade para continuar!`;
      
      return jsonResponse({ 
        success: false, 
        error: errorMsg,
        limitReached: !limitCheck.expired,
        expired: limitCheck.expired,
        current: limitCheck.current,
        limit: limitCheck.limit,
        plan: limitCheck.plan
      }, 403);
  }

  const freightId = crypto.randomUUID();
    
    await db.prepare(
      "INSERT INTO freight (id, user_id, origin_city, destination_city, freight_type, capacity, price_per_km, vehicle_type, vehicle_brand, vehicle_model, vehicle_year, vehicle_color, vehicle_body_type, vehicle_axles, vehicle_plate, chassis_number, renavam, antt, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'available', datetime('now'))"
    ).bind(
      freightId, 
      user.userId, 
      origin, 
      destination, 
      cargo_type,
      weight || capacity || 0,
      price || 0,
      vehicleType,
      vehicleBrand,
      vehicleModel,
      vehicleYear,
      vehicleColor,
      vehicleBodyType,
      vehicleAxles,
      licensePlate,
      chassisNumber,
      renavam,
      antt
    ).run();
    
    // Incrementar uso
    await incrementUserUsage(db, user.userId, 'freight');
    
    return jsonResponse({
      success: true,
      message: 'Frete criado com sucesso',
      data: { id: freightId },
      usage: { current: limitCheck.current + 1, limit: limitCheck.limit }
    }, 201);
  } catch (error) {
    console.error('Freight create error:', error);
    return jsonResponse({ success: false, error: 'Erro ao criar frete' }, 500);
  }
}

// Messages - List
async function handleMessagesList(request, env, user) {
  try {
    const db = getDb(env);
    
    const { results } = await db.prepare(
      'SELECT * FROM messages WHERE sender_id = ? OR receiver_id = ? ORDER BY created_at DESC LIMIT 50'
    ).bind(user.userId, user.userId).all();
    
      return jsonResponse({
        success: true,
      data: { messages: results || [] }
    });
  } catch (error) {
    console.error('Messages list error:', error);
    return jsonResponse({ success: false, error: 'Erro ao listar mensagens' }, 500);
  }
}

// Messages - Send
async function handleMessageSend(request, env, user) {
  try {
    const { receiver_id, content } = await request.json();
    
    if (!receiver_id || !content) {
      return jsonResponse({ success: false, error: 'Dados incompletos' }, 400);
    }
    
    const db = getDb(env);
    const messageId = crypto.randomUUID();
    
    await db.prepare(
      "INSERT INTO messages (id, sender_id, receiver_id, content, created_at) VALUES (?, ?, ?, ?, datetime('now'))"
    ).bind(messageId, user.userId, receiver_id, content).run();

    return jsonResponse({
      success: true,
      message: 'Mensagem enviada',
      data: { id: messageId }
    }, 201);
  } catch (error) {
    console.error('Message send error:', error);
    return jsonResponse({ success: false, error: 'Erro ao enviar mensagem' }, 500);
  }
}

// Payments - Create
async function handlePaymentCreate(request, env, user) {
  try {
    const { amount, payment_method, metadata } = await request.json();
    
    if (!amount) {
      return jsonResponse({ success: false, error: 'Valor é obrigatório' }, 400);
    }
    
    const db = getDb(env);
    const paymentId = crypto.randomUUID();

    // Inserir pagamento com tipo padrão 'payment' para respeitar constraint NOT NULL
    await db.prepare(
      "INSERT INTO payments (id, user_id, type, amount, payment_method, metadata, status, created_at) VALUES (?, ?, ?, ?, ?, ?, 'pending', datetime('now'))"
    ).bind(paymentId, user.userId, 'payment', amount, payment_method || 'stripe', metadata || '{}').run();
    
    return jsonResponse({
      success: true,
      message: 'Pagamento criado',
      data: { id: paymentId, status: 'pending' }
    }, 201);
  } catch (error) {
    console.error('Payment create error:', error);
    return jsonResponse({ success: false, error: 'Erro ao criar pagamento' }, 500);
  }
}

// Payments - Create Checkout (Santander)
async function handleCreateCheckout(request, env, user) {
  try {
    const { planSlug, billingCycle, paymentMethod } = await request.json();
    
    if (!planSlug) {
      return jsonResponse({ success: false, error: 'Plano é obrigatório' }, 400);
    }

    if (!paymentMethod || !['pix', 'boleto', 'credit_card'].includes(paymentMethod)) {
      return jsonResponse({ success: false, error: 'Método de pagamento inválido (use pix, boleto ou credit_card)' }, 400);
    }

    const db = getDb(env);
    const plan = await db.prepare('SELECT * FROM plans WHERE slug = ?').bind(planSlug).first();
    
    if (!plan) {
      return jsonResponse({ success: false, error: 'Plano não encontrado' }, 404);
    }

    // Determinar preço baseado no ciclo
    let amount = plan.price_monthly;
    if (billingCycle === 'semiannual') amount = plan.price_6months;
    if (billingCycle === 'annual') amount = plan.price_annual;

    // Verificar se Asaas está configurado
    if (!env.ASAAS_API_KEY) {
      console.log('❌ Asaas não configurado');
      return jsonResponse({ success: false, error: 'Sistema de pagamento não configurado' }, 500);
    }

    // Inicializar serviço Asaas
    console.log('🔧 [ASAAS] Inicializando serviço...');
    console.log('🔧 [ASAAS] NODE_ENV:', env.NODE_ENV);
    console.log('🔧 [ASAAS] API Key presente:', !!env.ASAAS_API_KEY);
    console.log('🔧 [ASAAS] API Key length:', env.ASAAS_API_KEY?.length);
    console.log('🔧 [ASAAS] API Key primeiros 20 chars:', env.ASAAS_API_KEY?.substring(0, 20));
    
    const asaas = new AsaasService(
      env.ASAAS_API_KEY,
      'production' // Forçar produção
    );

    // Buscar dados do usuário completos
    const userProfile = await db.prepare('SELECT * FROM users WHERE id = ?').bind(user.userId).first();

    // Validar que temos ao menos um identificador para criar cliente no Asaas
    const cpfCnpj = userProfile.cpf || userProfile.cnpj;
    if (!userProfile.email && !cpfCnpj) {
      console.warn('Usuário sem email nem CPF/CNPJ - não é possível criar cliente Asaas');
      return jsonResponse({ success: false, error: 'É necessário ter E-mail ou CPF/CNPJ cadastrado para gerar uma cobrança' }, 400);
    }

    // Criar ou buscar cliente no Asaas
    const customerResult = await asaas.createOrGetCustomer({
      name: userProfile.name,
      email: userProfile.email,
      cpfCnpj: cpfCnpj,
      phone: userProfile.phone
    });

    if (!customerResult.success) {
      return jsonResponse({ success: false, error: 'Erro ao criar cliente: ' + customerResult.error }, 500);
    }

    const customer = customerResult.customer;

    // Criar registro de pagamento pendente
    const paymentId = crypto.randomUUID();
    // Inserir pagamento de assinatura com type 'subscription'
    await db.prepare(
      "INSERT INTO payments (id, user_id, plan_slug, amount, payment_method, type, status, billing_cycle, created_at) VALUES (?, ?, ?, ?, ?, ?, 'pending', ?, datetime('now'))"
    ).bind(paymentId, user.userId, planSlug, amount, paymentMethod, 'subscription', billingCycle).run();

    // Gerar PIX ou Boleto
    if (paymentMethod === 'pix') {
      const pixResult = await asaas.createPixCharge({
        value: amount,
        description: `AgroSync - Plano ${plan.name} (${billingCycle})`,
        customer: customer
      });

      if (!pixResult.success) {
        return jsonResponse({ success: false, error: pixResult.error }, 500);
      }

      // Salvar paymentId do Asaas
      await db.prepare('UPDATE payments SET external_id = ? WHERE id = ?')
        .bind(pixResult.paymentId, paymentId).run();

      return jsonResponse({
        success: true,
        paymentId: paymentId,
        paymentMethod: 'pix',
        txid: pixResult.paymentId,
        qrCode: pixResult.qrCode,
        qrCodeText: pixResult.qrCodeText,
        amount: amount,
        expiresAt: pixResult.expiresAt,
        invoiceUrl: pixResult.invoiceUrl
      });
    } else if (paymentMethod === 'boleto') {
      // Boleto
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 3); // Vencimento em 3 dias

      const boletoResult = await asaas.createBoletoCharge({
        value: amount,
        description: `AgroSync - Plano ${plan.name} (${billingCycle})`,
        customer: customer,
        dueDate: dueDate.toISOString().split('T')[0]
      });

      if (!boletoResult.success) {
        return jsonResponse({ success: false, error: boletoResult.error }, 500);
      }

      // Salvar paymentId do Asaas
      await db.prepare('UPDATE payments SET external_id = ? WHERE id = ?')
        .bind(boletoResult.paymentId, paymentId).run();

      return jsonResponse({
        success: true,
        paymentId: paymentId,
        paymentMethod: 'boleto',
        boletoId: boletoResult.paymentId,
        barcode: boletoResult.barcode,
        bankSlipUrl: boletoResult.bankSlipUrl,
        invoiceUrl: boletoResult.invoiceUrl,
        amount: amount,
        dueDate: boletoResult.dueDate
      });
    } else if (paymentMethod === 'credit_card') {
      // Cartão de Crédito
      const requestData = await request.json();
      const { creditCard, creditCardHolderInfo, installmentCount } = requestData;

      if (!creditCard || !creditCardHolderInfo) {
        return jsonResponse({ success: false, error: 'Dados do cartão são obrigatórios' }, 400);
      }

      const cardResult = await asaas.createCreditCardCharge({
        value: amount,
        description: `AgroSync - Plano ${plan.name} (${billingCycle})`,
        customer: customer,
        creditCard: creditCard,
        creditCardHolderInfo: creditCardHolderInfo,
        installmentCount: installmentCount || 1
      });

      if (!cardResult.success) {
        return jsonResponse({ success: false, error: cardResult.error }, 500);
      }

      // Salvar paymentId do Asaas
      await db.prepare('UPDATE payments SET external_id = ? WHERE id = ?')
        .bind(cardResult.paymentId, paymentId).run();

      // Se pagamento aprovado, ativar plano imediatamente
      if (cardResult.status === 'CONFIRMED' || cardResult.status === 'RECEIVED') {
        const expiresAt = new Date();
        if (billingCycle === 'semiannual') expiresAt.setMonth(expiresAt.getMonth() + 6);
        else if (billingCycle === 'annual') expiresAt.setFullYear(expiresAt.getFullYear() + 1);
        else expiresAt.setMonth(expiresAt.getMonth() + 1);

        await db.prepare(
          'UPDATE users SET plan = ?, plan_expires_at = ? WHERE id = ?'
        ).bind(planSlug, expiresAt.toISOString(), user.userId).run();

        await db.prepare(
          "UPDATE payments SET status = 'completed', paid_at = datetime('now') WHERE id = ?"
        ).bind(paymentId).run();
      }

      return jsonResponse({
        success: true,
        paymentId: paymentId,
        paymentMethod: 'credit_card',
        status: cardResult.status,
        invoiceUrl: cardResult.invoiceUrl,
        amount: amount,
        installmentCount: cardResult.installmentCount
      });
    }
  } catch (error) {
    console.error('Create checkout error:', error);
    const msg = error && error.message ? error.message : String(error);
    return jsonResponse({ success: false, error: 'Erro ao criar pagamento: ' + msg }, 500);
  }
}

// Payments - Callback (redirect após pagamento)
async function handlePaymentCallback(request) {
  try {
    const url = new URL(request.url);
    const sessionId = url.searchParams.get('session_id');
    
    return jsonResponse({
      success: true,
      message: 'Pagamento processado! Redirecionando...',
      sessionId
    });
  } catch {
    return jsonResponse({ success: false, error: 'Erro no callback' }, 500);
  }
}

// Payments - Stripe Webhook
async function handleStripeWebhook(request, env) {
  try {
    const body = await request.text();
    // const signature = request.headers.get('stripe-signature');

    if (!env.STRIPE_WEBHOOK_SECRET || env.STRIPE_WEBHOOK_SECRET === 'whsec_placeholder') {
      console.log('Webhook recebido mas secret não configurado');
      return jsonResponse({ received: true });
    }

    // TODO: Verificar assinatura do Stripe
    const event = JSON.parse(body);
    
    console.log('Stripe webhook event:', event.type);

    // Processar evento de pagamento concluído
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const userId = session.metadata?.user_id;
      const planSlug = session.metadata?.plan;
      const billingCycle = session.metadata?.billing_cycle || 'monthly';

      if (userId && planSlug) {
        const db = getDb(env);
        
        // Calcular nova data de expiração
        const expiresAt = new Date();
        if (billingCycle === 'semiannual') expiresAt.setMonth(expiresAt.getMonth() + 6);
        else if (billingCycle === 'annual') expiresAt.setFullYear(expiresAt.getFullYear() + 1);
        else expiresAt.setMonth(expiresAt.getMonth() + 1);

        // Atualizar plano do usuário
        await db.prepare(
          'UPDATE users SET plan = ?, plan_expires_at = ? WHERE id = ?'
        ).bind(planSlug, expiresAt.toISOString(), userId).run();

        // Registrar pagamento
        await db.prepare(
          "INSERT INTO payments (id, user_id, amount, payment_method, metadata, status, created_at) VALUES (?, ?, ?, 'stripe', ?, 'completed', datetime('now'))"
        ).bind(
          crypto.randomUUID(),
          userId,
          session.amount_total / 100,
          JSON.stringify({ sessionId: session.id, plan: planSlug })
        ).run();

        console.log(`✅ Plano ${planSlug} ativado para usuário ${userId}`);
      }
    }

    return jsonResponse({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return jsonResponse({ error: error.message }, 400);
  }
}

// Payments - Asaas Webhook
async function handleAsaasWebhook(request, env) {
  try {
    const body = await request.text();
    const event = JSON.parse(body);
    
    console.log('🔔 [ASAAS] Webhook recebido:', event.event);

    const db = getDb(env);

    // PAYMENT_RECEIVED ou PAYMENT_CONFIRMED - Pagamento confirmado
    if (event.event === 'PAYMENT_RECEIVED' || event.event === 'PAYMENT_CONFIRMED') {
      const paymentId = event.payment?.id;

      if (!paymentId) {
        console.error('❌ [ASAAS] Payment ID não encontrado no webhook');
        return jsonResponse({ received: true });
      }

      // Buscar pagamento no banco
      const payment = await db.prepare(
        'SELECT * FROM payments WHERE external_id = ?'
      ).bind(paymentId).first();

      if (!payment) {
        console.error('❌ [ASAAS] Pagamento não encontrado no banco:', paymentId);
        return jsonResponse({ received: true });
      }

      // Atualizar status do pagamento
      await db.prepare(
        "UPDATE payments SET status = 'completed', paid_at = datetime('now') WHERE id = ?"
      ).bind(payment.id).run();

      // Calcular data de expiração baseado no ciclo
      const expiresAt = new Date();
      if (payment.billing_cycle === 'semiannual') {
        expiresAt.setMonth(expiresAt.getMonth() + 6);
      } else if (payment.billing_cycle === 'annual') {
        expiresAt.setFullYear(expiresAt.getFullYear() + 1);
      } else {
        expiresAt.setMonth(expiresAt.getMonth() + 1);
      }

      // Ativar plano do usuário
      await db.prepare(
        'UPDATE users SET plan = ?, plan_expires_at = ? WHERE id = ?'
      ).bind(payment.plan_slug, expiresAt.toISOString(), payment.user_id).run();

      console.log(`✅ [ASAAS] Plano ${payment.plan_slug} ativado para usuário ${payment.user_id}`);
    }

    // PAYMENT_OVERDUE - Pagamento atrasado
    if (event.event === 'PAYMENT_OVERDUE') {
      const paymentId = event.payment?.id;
      
      if (paymentId) {
        await db.prepare(
          "UPDATE payments SET status = 'overdue' WHERE external_id = ?"
        ).bind(paymentId).run();
        
        console.log(`⚠️ [ASAAS] Pagamento ${paymentId} marcado como atrasado`);
      }
    }

    // PAYMENT_DELETED ou PAYMENT_REFUNDED - Pagamento cancelado/estornado
    if (event.event === 'PAYMENT_DELETED' || event.event === 'PAYMENT_REFUNDED') {
      const paymentId = event.payment?.id;
      
      if (paymentId) {
        const payment = await db.prepare(
          'SELECT * FROM payments WHERE external_id = ?'
        ).bind(paymentId).first();

        if (payment) {
          await db.prepare(
            "UPDATE payments SET status = 'cancelled' WHERE id = ?"
          ).bind(payment.id).run();
          
          // Desativar plano do usuário
          await db.prepare(
            "UPDATE users SET plan = 'free', plan_expires_at = NULL WHERE id = ?"
          ).bind(payment.user_id).run();
          
          console.log(`🚫 [ASAAS] Plano desativado para usuário ${payment.user_id}`);
        }
      }
    }

    return jsonResponse({ received: true });
  } catch (error) {
    console.error('❌ [ASAAS] Webhook error:', error);
    return jsonResponse({ success: false, error: 'Erro no webhook' }, 500);
  }
}

// Payments - Santander Webhook
async function handleSantanderWebhook(request, env) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-santander-signature');

    if (!env.SANTANDER_WEBHOOK_SECRET) {
      console.log('⚠️ Webhook recebido mas secret não configurado');
      return jsonResponse({ received: true });
    }

    // Inicializar serviço do Santander
    const santander = new SantanderService(
      env.SANTANDER_CLIENT_ID,
      env.SANTANDER_CLIENT_SECRET,
      env.NODE_ENV === 'production' ? 'production' : 'sandbox'
    );

    // Validar e processar webhook
    const result = await santander.processWebhook(body, signature, env.SANTANDER_WEBHOOK_SECRET);
    
    if (!result.success) {
      console.error('❌ Webhook inválido:', result.error);
      return jsonResponse({ error: 'Webhook inválido' }, 400);
    }

    console.log('✅ Webhook Santander recebido:', result.type, result.status);

    const db = getDb(env);

    // Se pagamento foi confirmado (PIX ou Boleto)
    if (result.status === 'paid') {
      const externalId = result.txid || result.boletoId;
      
      // Buscar pagamento no banco
      const payment = await db.prepare(
        'SELECT * FROM payments WHERE external_id = ? AND status = ?'
      ).bind(externalId, 'pending').first();

      if (!payment) {
        console.log('⚠️ Pagamento não encontrado:', externalId);
        return jsonResponse({ received: true });
      }

      // Atualizar status do pagamento
      await db.prepare(
        'UPDATE payments SET status = ?, paid_at = ? WHERE id = ?'
      ).bind('completed', result.paidAt, payment.id).run();

      // Ativar plano do usuário
      const expiresAt = new Date();
      if (payment.billing_cycle === 'semiannual') expiresAt.setMonth(expiresAt.getMonth() + 6);
      else if (payment.billing_cycle === 'annual') expiresAt.setFullYear(expiresAt.getFullYear() + 1);
      else expiresAt.setMonth(expiresAt.getMonth() + 1);

      await db.prepare(
        'UPDATE users SET plan = ?, plan_expires_at = ? WHERE id = ?'
      ).bind(payment.plan_slug, expiresAt.toISOString(), payment.user_id).run();

      console.log(`✅ Plano ${payment.plan_slug} ativado para usuário ${payment.user_id}`);

      // Enviar email de confirmação via Resend
      const user = await db.prepare('SELECT name, email FROM users WHERE id = ?').bind(payment.user_id).first();
      if (user) {
        await sendEmail(env, {
          to: user.email,
          subject: '✅ Pagamento Confirmado - AgroSync',
          html: `
            <h2>Pagamento Confirmado!</h2>
            <p>Olá ${user.name || 'Cliente'},</p>
            <p>Seu pagamento de <strong>R$ ${payment.amount.toFixed(2)}</strong> foi confirmado com sucesso!</p>
            <p>Seu plano <strong>${payment.plan_slug}</strong> está ativo até <strong>${new Date(expiresAt).toLocaleDateString('pt-BR')}</strong>.</p>
            <p>Aproveite todos os recursos do AgroSync! 🚀</p>
            <p>Equipe AgroSync</p>
          `
        });
      }
    }

    return jsonResponse({ received: true, processed: true });
  } catch (error) {
    console.error('❌ Santander webhook error:', error);
    return jsonResponse({ error: error.message }, 400);
  }
}

// User Profile
async function handleUserProfile(request, env, user) {
  try {
    const db = getDb(env);
    
    if (request.method === 'PUT') {
      // Atualizar perfil do usuário
      const updateData = await request.json();
      
      const fields = [];
      const values = [];
      
      // Campos que podem ser atualizados
      if (updateData.phone !== undefined) {
        fields.push('phone = ?');
        values.push(updateData.phone);
      }
      if (updateData.company !== undefined) {
        fields.push('company = ?');
        values.push(updateData.company);
      }
      if (updateData.cep !== undefined) {
        fields.push('cep = ?');
        values.push(updateData.cep);
      }
      if (updateData.address !== undefined) {
        fields.push('address = ?');
        values.push(updateData.address);
      }
      if (updateData.city !== undefined) {
        fields.push('city = ?');
        values.push(updateData.city);
      }
      if (updateData.state !== undefined) {
        fields.push('state = ?');
        values.push(updateData.state);
      }
      if (updateData.cpf !== undefined) {
        fields.push('cpf = ?');
        values.push(updateData.cpf);
      }
      if (updateData.cnpj !== undefined) {
        fields.push('cnpj = ?');
        values.push(updateData.cnpj);
      }
      if (updateData.ie !== undefined) {
        fields.push('ie = ?');
        values.push(updateData.ie);
      }
      if (updateData.userType !== undefined) {
        fields.push('user_type = ?');
        values.push(updateData.userType);
      }
      if (updateData.businessType !== undefined) {
        fields.push('business_type = ?');
        values.push(updateData.businessType);
      }
      
      if (fields.length === 0) {
        return jsonResponse({ success: false, error: 'Nenhum campo para atualizar' }, 400);
      }
      
      // Adicionar userId ao final dos values
      values.push(user.userId);
      
      const updateQuery = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
      
      await db.prepare(updateQuery).bind(...values).run();

    return jsonResponse({
      success: true,
        message: 'Perfil atualizado com sucesso'
      });
    } else {
      // GET - Buscar perfil do usuário
      console.log('🔍 Buscando perfil para userId:', user.userId);
      const profile = await db.prepare(
        'SELECT id, email, name, phone, role, plan, plan_active as plan_status, plan_expires_at, business_type as user_type, business_type, created_at FROM users WHERE id = ?'
      ).bind(user.userId).first();
      
      console.log('📋 Perfil encontrado:', profile);
      
      if (!profile) {
        console.log('❌ Usuário não encontrado no banco');
        return jsonResponse({ success: false, error: 'Usuário não encontrado' }, 404);
      }
      
      return jsonResponse({
        success: true,
        data: { user: profile }
      });
    }
  } catch (error) {
    console.error('User profile error:', error);
    return jsonResponse({ success: false, error: 'Erro ao processar perfil' }, 500);
  }
}

// User Items (Products/Freights)
async function handleUserItems(request, env, user) {
  try {
    const url = new URL(request.url);
    const type = url.searchParams.get('type') || 'all';
    const db = getDb(env);
    
    let items = [];
    
    if (type === 'all' || type === 'products') {
      // Buscar produtos do usuário
      const products = await db.prepare(
        'SELECT id, name, description, price, category, quantity, unit, status, created_at, "public" as visibility FROM products WHERE user_id = ? ORDER BY created_at DESC LIMIT 50'
      ).bind(user.userId).all();
      
      items = [...items, ...(products.results || []).map(p => ({ ...p, type: 'product' }))];
    }
    
    if (type === 'all' || type === 'freights') {
      // Buscar fretes do usuário
      const freights = await db.prepare(
        'SELECT id, origin_city as origin, destination_city as destination, price_per_km as value, freight_type as cargo_type, capacity as weight, status, created_at, "public" as visibility FROM freight WHERE user_id = ? ORDER BY created_at DESC LIMIT 50'
      ).bind(user.userId).all();
      
      items = [...items, ...(freights.results || []).map(f => ({ ...f, type: 'freight' }))];
    }
    
    return jsonResponse({
      success: true,
      data: items,
      products: items.filter(i => i.type === 'product'),
      freights: items.filter(i => i.type === 'freight')
    });
  } catch (error) {
    console.error('User items error:', error);
    return jsonResponse({ success: false, error: 'Erro ao buscar itens' }, 500);
  }
}

// Conversations
async function handleConversations(request, env, user) {
  try {
    const url = new URL(request.url);
    const status = url.searchParams.get('status') || 'all';
    const db = getDb(env);
    
    // Por enquanto, retornar array vazio (não há sistema de conversas implementado)
    return jsonResponse({
      success: true,
      data: [],
      count: 0
    });
  } catch (error) {
    console.error('Conversations error:', error);
    return jsonResponse({ success: false, error: 'Erro ao buscar conversas' }, 500);
  }
}

// Tracking - Atualizar Localização GPS
async function handleTrackingLocationUpdate(request, env, user) {
  try {
    const { freight_order_id, latitude, longitude, address, city, state, speed, heading, accuracy } = await request.json();
    
    if (!freight_order_id || !latitude || !longitude) {
      return jsonResponse({ success: false, error: 'Dados incompletos' }, 400);
    }
    
    const db = getDb(env);
    const locationId = crypto.randomUUID();
    const timestamp = Date.now();
    
    await db.prepare(
      `INSERT INTO freight_tracking_locations (id, freight_order_id, latitude, longitude, address, city, state, timestamp, speed, heading, accuracy, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, strftime('%s', 'now'))`
    ).bind(
      locationId,
      freight_order_id,
      latitude,
      longitude,
      address || null,
      city || null,
      state || null,
      timestamp,
      speed || null,
      heading || null,
      accuracy || null
    ).run();
    
    // Enviar notificação por email se mudou de cidade
    await sendLocationUpdateEmail(env, freight_order_id, city, state);
    
    return jsonResponse({
      success: true,
      data: { id: locationId, timestamp }
    });
  } catch (error) {
    console.error('Tracking location error:', error);
    return jsonResponse({ success: false, error: 'Erro ao registrar localização' }, 500);
  }
}

// Tracking - Atualizar Status
async function handleTrackingStatusUpdate(request, env, user) {
  try {
    const { freight_order_id, status, description, location_id } = await request.json();
    
    if (!freight_order_id || !status) {
      return jsonResponse({ success: false, error: 'Dados incompletos' }, 400);
    }
    
    const db = getDb(env);
    const updateId = crypto.randomUUID();
    const timestamp = Date.now();
    
    await db.prepare(
      `INSERT INTO freight_tracking_updates (id, freight_order_id, status, description, location_id, timestamp, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, strftime('%s', 'now'))`
    ).bind(
      updateId,
      freight_order_id,
      status,
      description || null,
      location_id || null,
      timestamp
    ).run();
    
    // Atualizar status do pedido
    await db.prepare(
      `UPDATE freight_orders SET status = ?, updated_at = strftime('%s', 'now') WHERE id = ?`
    ).bind(status, freight_order_id).run();
    
    // Enviar email de atualização
    await sendStatusUpdateEmail(env, freight_order_id, status, description);
    
    return jsonResponse({
      success: true,
      data: { id: updateId, timestamp }
    });
  } catch (error) {
    console.error('Tracking update error:', error);
    return jsonResponse({ success: false, error: 'Erro ao atualizar status' }, 500);
  }
}

// Tracking - Buscar Histórico
async function handleTrackingHistory(request, env) {
  try {
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const freight_order_id = pathParts[pathParts.length - 1];
    
    if (!freight_order_id) {
      return jsonResponse({ success: false, error: 'ID do pedido não fornecido' }, 400);
    }
    
    const db = getDb(env);
    
    // Buscar localizações
    const locations = await db.prepare(
      `SELECT * FROM freight_tracking_locations WHERE freight_order_id = ? ORDER BY timestamp DESC LIMIT 100`
    ).bind(freight_order_id).all();
    
    // Buscar atualizações
    const updates = await db.prepare(
      `SELECT * FROM freight_tracking_updates WHERE freight_order_id = ? ORDER BY timestamp DESC LIMIT 50`
    ).bind(freight_order_id).all();
    
    // Buscar última localização
    const currentLocation = locations.results && locations.results.length > 0 
      ? locations.results[0] 
      : null;
    
    return jsonResponse({
      success: true,
      data: {
        freight_order_id,
        current_location: currentLocation,
        locations: locations.results || [],
        updates: updates.results || []
      }
    });
  } catch (error) {
    console.error('Tracking history error:', error);
    return jsonResponse({ success: false, error: 'Erro ao buscar histórico' }, 500);
  }
}

// Enviar email de atualização de localização
async function sendLocationUpdateEmail(env, freight_order_id, city, state) {
  try {
    const db = getDb(env);
    
    const order = await db.prepare(
      `SELECT fo.id, fo.user_id, u.email, u.name 
       FROM freight_orders fo 
       JOIN users u ON fo.user_id = u.id 
       WHERE fo.id = ?`
    ).bind(freight_order_id).first();
    
    if (!order || !order.email) {
      return;
    }
    
    const notificationId = crypto.randomUUID();
    
    await db.prepare(
      `INSERT INTO freight_tracking_notifications (id, freight_order_id, recipient_email, notification_type, status, created_at) 
       VALUES (?, ?, ?, 'location_update', 'pending', strftime('%s', 'now'))`
    ).bind(notificationId, freight_order_id, order.email).run();
    
    if (env.RESEND_API_KEY && env.RESEND_ENABLED === 'true') {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: env.RESEND_FROM_EMAIL || 'AgroSync <contato@agroisync.com>',
          to: order.email,
          subject: `🚛 Atualização de Rastreamento - Frete #${freight_order_id.substring(0, 8)}`,
          html: `
            <h2>Olá ${order.name},</h2>
            <p>Seu frete foi atualizado!</p>
            <p><strong>Localização Atual:</strong> ${city}, ${state}</p>
            <p><strong>Código de Rastreamento:</strong> ${freight_order_id}</p>
            <p>Acompanhe em tempo real em: <a href="https://agroisync.com/frete/tracking?code=${freight_order_id}">Rastrear Pedido</a></p>
            <br>
            <p>Atenciosamente,<br>Equipe AgroSync</p>
          `
        })
      });
      
      if (response.ok) {
        await db.prepare(
          `UPDATE freight_tracking_notifications SET status = 'sent', sent_at = strftime('%s', 'now') WHERE id = ?`
        ).bind(notificationId).run();
      }
    }
  } catch (error) {
    console.error('Send location email error:', error);
  }
}

// Enviar email de atualização de status
async function sendStatusUpdateEmail(env, freight_order_id, status, description) {
  try {
    const db = getDb(env);
    
    const order = await db.prepare(
      `SELECT fo.id, fo.user_id, u.email, u.name 
       FROM freight_orders fo 
       JOIN users u ON fo.user_id = u.id 
       WHERE fo.id = ?`
    ).bind(freight_order_id).first();
    
    if (!order || !order.email) {
      return;
    }
    
    const statusLabels = {
      'pending': 'Pendente',
      'confirmed': 'Confirmado',
      'in_transit': 'Em Trânsito',
      'delivered': 'Entregue',
      'cancelled': 'Cancelado'
    };
    
    const notificationId = crypto.randomUUID();
    
    await db.prepare(
      `INSERT INTO freight_tracking_notifications (id, freight_order_id, recipient_email, notification_type, status, created_at) 
       VALUES (?, ?, ?, 'status_update', 'pending', strftime('%s', 'now'))`
    ).bind(notificationId, freight_order_id, order.email).run();
    
    if (env.RESEND_API_KEY && env.RESEND_ENABLED === 'true') {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: env.RESEND_FROM_EMAIL || 'AgroSync <contato@agroisync.com>',
          to: order.email,
          subject: `📦 Status Atualizado - ${statusLabels[status] || status}`,
          html: `
            <h2>Olá ${order.name},</h2>
            <p>O status do seu frete foi atualizado!</p>
            <p><strong>Novo Status:</strong> ${statusLabels[status] || status}</p>
            ${description ? `<p><strong>Descrição:</strong> ${description}</p>` : ''}
            <p><strong>Código de Rastreamento:</strong> ${freight_order_id}</p>
            <p>Acompanhe em tempo real em: <a href="https://agroisync.com/frete/tracking?code=${freight_order_id}">Rastrear Pedido</a></p>
            <br>
            <p>Atenciosamente,<br>Equipe AgroSync</p>
          `
        })
      });
      
      if (response.ok) {
        await db.prepare(
          `UPDATE freight_tracking_notifications SET status = 'sent', sent_at = strftime('%s', 'now') WHERE id = ?`
        ).bind(notificationId).run();
      }
    }
  } catch (error) {
    console.error('Send status email error:', error);
  }
}

// Crypto - Cadastrar Carteira
async function handleCryptoWalletRegister(request, env, user) {
  try {
    const { wallet_address, wallet_type } = await request.json();
    
    if (!wallet_address) {
      return jsonResponse({ success: false, error: 'Endereço da carteira obrigatório' }, 400);
    }
    
    const db = getDb(env);
    const walletId = crypto.randomUUID();
    
    const existing = await db.prepare(
      `SELECT id FROM crypto_wallets WHERE wallet_address = ?`
    ).bind(wallet_address).first();
    
    if (existing) {
      return jsonResponse({ success: false, error: 'Carteira já cadastrada' }, 400);
    }
    
    await db.prepare(
      `INSERT INTO crypto_wallets (id, user_id, wallet_address, wallet_type, is_verified, is_active, created_at) 
       VALUES (?, ?, ?, ?, 1, 1, strftime('%s', 'now'))`
    ).bind(walletId, user.userId, wallet_address, wallet_type || 'metamask').run();
    
    return jsonResponse({
      success: true,
      data: { id: walletId, wallet_address }
    });
  } catch (error) {
    console.error('Wallet register error:', error);
    return jsonResponse({ success: false, error: 'Erro ao cadastrar carteira' }, 500);
  }
}

// Crypto - Comprar
async function handleCryptoBuy(request, env, user) {
  try {
    const { crypto_symbol, amount_brl } = await request.json();
    
    if (!crypto_symbol || !amount_brl || amount_brl <= 0) {
      return jsonResponse({ success: false, error: 'Dados inválidos' }, 400);
    }
    
    const currentPrice = await getCurrentCryptoPrice(crypto_symbol);
    
    if (!currentPrice) {
      return jsonResponse({ success: false, error: 'Criptomoeda não suportada' }, 400);
    }
    
    const COMMISSION_PERCENTAGE = 10;
    const totalWithCommission = amount_brl * (1 + COMMISSION_PERCENTAGE / 100);
    const commissionAmount = totalWithCommission - amount_brl;
    const cryptoAmount = amount_brl / currentPrice;
    
    const db = getDb(env);
    const transactionId = crypto.randomUUID();
    const paymentId = crypto.randomUUID();
    
    await db.prepare(
      `INSERT INTO crypto_transactions (id, user_id, transaction_type, crypto_symbol, amount, amount_usd, price_at_time, fee_percentage, fee_amount, status, created_at) 
       VALUES (?, ?, 'buy', ?, ?, ?, ?, ?, ?, 'completed', strftime('%s', 'now'))`
    ).bind(
      transactionId,
      user.userId,
      crypto_symbol,
      cryptoAmount,
      amount_brl / 5.5,
      currentPrice,
      COMMISSION_PERCENTAGE,
      commissionAmount
    ).run();
    
    await db.prepare(
      `INSERT INTO crypto_payments (id, user_id, transaction_id, crypto_symbol, amount, amount_brl, commission_percentage, commission_amount_brl, net_amount_brl, owner_wallet, status, payment_for, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, '0x5Ea5C5970e8AE23A5336d631707CF31C5916E8b1', 'completed', 'crypto_purchase', strftime('%s', 'now'))`
    ).bind(
      paymentId,
      user.userId,
      transactionId,
      crypto_symbol,
      cryptoAmount,
      totalWithCommission,
      COMMISSION_PERCENTAGE,
      commissionAmount,
      amount_brl
    ).run();
    
    const commissionId = crypto.randomUUID();
    await db.prepare(
      `INSERT INTO crypto_commissions (id, payment_id, amount_brl, crypto_symbol, transferred_to_owner, created_at) 
       VALUES (?, ?, ?, ?, 0, strftime('%s', 'now'))`
    ).bind(commissionId, paymentId, commissionAmount, crypto_symbol).run();
    
    const existingBalance = await db.prepare(
      `SELECT id FROM crypto_balances WHERE user_id = ? AND crypto_symbol = ?`
    ).bind(user.userId, crypto_symbol).first();
    
    if (existingBalance) {
      await db.prepare(
        `UPDATE crypto_balances SET balance = balance + ?, balance_usd = balance_usd + ?, last_updated = strftime('%s', 'now') WHERE user_id = ? AND crypto_symbol = ?`
      ).bind(cryptoAmount, cryptoAmount * currentPrice, user.userId, crypto_symbol).run();
    } else {
      const balanceId = crypto.randomUUID();
      await db.prepare(
        `INSERT INTO crypto_balances (id, user_id, crypto_symbol, balance, balance_usd, last_updated) 
         VALUES (?, ?, ?, ?, ?, strftime('%s', 'now'))`
      ).bind(balanceId, user.userId, crypto_symbol, cryptoAmount, cryptoAmount * currentPrice).run();
    }
    
    return jsonResponse({
      success: true,
      data: {
        transaction_id: transactionId,
        payment_id: paymentId,
        crypto_amount: cryptoAmount,
        total_brl: totalWithCommission,
        commission_brl: commissionAmount,
        price: currentPrice
      }
    });
  } catch (error) {
    console.error('Crypto buy error:', error);
    return jsonResponse({ success: false, error: 'Erro ao comprar criptomoeda' }, 500);
  }
}

// Crypto - Vender
async function handleCryptoSell(request, env, user) {
  try {
    const { crypto_symbol, crypto_amount } = await request.json();
    
    if (!crypto_symbol || !crypto_amount || crypto_amount <= 0) {
      return jsonResponse({ success: false, error: 'Dados inválidos' }, 400);
    }
    
    const db = getDb(env);
    
    const balance = await db.prepare(
      `SELECT balance FROM crypto_balances WHERE user_id = ? AND crypto_symbol = ?`
    ).bind(user.userId, crypto_symbol).first();
    
    if (!balance || balance.balance < crypto_amount) {
      return jsonResponse({ success: false, error: 'Saldo insuficiente' }, 400);
    }
    
    const currentPrice = await getCurrentCryptoPrice(crypto_symbol);
    const amountBrl = crypto_amount * currentPrice * 5.5;
    const COMMISSION_PERCENTAGE = 10;
    const commissionAmount = amountBrl * (COMMISSION_PERCENTAGE / 100);
    const netAmount = amountBrl - commissionAmount;
    
    const transactionId = crypto.randomUUID();
    
    await db.prepare(
      `INSERT INTO crypto_transactions (id, user_id, transaction_type, crypto_symbol, amount, amount_usd, price_at_time, fee_percentage, fee_amount, status, created_at) 
       VALUES (?, ?, 'sell', ?, ?, ?, ?, ?, ?, 'completed', strftime('%s', 'now'))`
    ).bind(
      transactionId,
      user.userId,
      crypto_symbol,
      crypto_amount,
      amountBrl / 5.5,
      currentPrice,
      COMMISSION_PERCENTAGE,
      commissionAmount
    ).run();
    
    await db.prepare(
      `UPDATE crypto_balances SET balance = balance - ?, balance_usd = balance_usd - ?, last_updated = strftime('%s', 'now') WHERE user_id = ? AND crypto_symbol = ?`
    ).bind(crypto_amount, crypto_amount * currentPrice, user.userId, crypto_symbol).run();
    
    return jsonResponse({
      success: true,
      data: {
        transaction_id: transactionId,
        crypto_amount: crypto_amount,
        gross_brl: amountBrl,
        commission_brl: commissionAmount,
        net_brl: netAmount,
        price: currentPrice
      }
    });
  } catch (error) {
    console.error('Crypto sell error:', error);
    return jsonResponse({ success: false, error: 'Erro ao vender criptomoeda' }, 500);
  }
}

// Crypto - Saldos
async function handleCryptoBalances(request, env, user) {
  try {
    const db = getDb(env);
    
    const balances = await db.prepare(
      `SELECT * FROM crypto_balances WHERE user_id = ? ORDER BY balance_usd DESC`
    ).bind(user.userId).all();
    
    return jsonResponse({
      success: true,
      data: balances.results || []
    });
  } catch (error) {
    console.error('Crypto balances error:', error);
    return jsonResponse({ success: false, error: 'Erro ao buscar saldos' }, 500);
  }
}

// Crypto - Transações
async function handleCryptoTransactions(request, env, user) {
  try {
    const db = getDb(env);
    
    const transactions = await db.prepare(
      `SELECT * FROM crypto_transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT 100`
    ).bind(user.userId).all();
    
    return jsonResponse({
      success: true,
      data: transactions.results || []
    });
  } catch (error) {
    console.error('Crypto transactions error:', error);
    return jsonResponse({ success: false, error: 'Erro ao buscar transações' }, 500);
  }
}

// Crypto - Preços (público)
async function handleCryptoPrices(request, env) {
  try {
    const prices = {
      'BTC': 43250.50,
      'ETH': 2650.30,
      'USDT': 1.00,
      'BNB': 310.50,
      'SOL': 98.75,
      'XRP': 0.52,
      'USDC': 1.00,
      'ADA': 0.45,
      'AVAX': 35.20,
      'DOGE': 0.08,
      'TRX': 0.10,
      'DOT': 6.50,
      'MATIC': 0.85,
      'LINK': 14.30,
      'SHIB': 0.000009,
      'DAI': 1.00,
      'UNI': 6.20,
      'LTC': 72.50,
      'BCH': 245.80,
      'ATOM': 9.75,
      'XMR': 158.90,
      'ETC': 20.15,
      'XLM': 0.13,
      'FIL': 4.85,
      'AAVE': 95.40,
      'ALGO': 0.18,
      'VET': 0.025,
      'ICP': 4.50,
      'APT': 8.30,
      'NEAR': 2.15
    };
    
    return jsonResponse({
      success: true,
      data: prices
    });
  } catch (error) {
    console.error('Crypto prices error:', error);
    return jsonResponse({ success: false, error: 'Erro ao buscar preços' }, 500);
  }
}

// AI Chatbot - Público (com whitelist)
async function handleAIChatPublic(request, env) {
  try {
    const { message, session_id } = await request.json();
    
    if (!message || !session_id) {
      return jsonResponse({ success: false, error: 'Mensagem e session_id obrigatórios' }, 400);
    }
    
    // Whitelist de intents públicas
    const allowedIntents = ['preços', 'cotação', 'clima', 'tempo', 'ajuda', 'contato', 'planos', 'frete', 'produtos', 'como funciona', 'sobre', 'cadastro', 'login'];
    
    const messageL = message.toLowerCase();
    const isAllowed = allowedIntents.some(intent => messageL.includes(intent));
    
    if (!isAllowed) {
      return jsonResponse({ 
        success: false, 
        error: 'Para perguntas avançadas, faça login primeiro!',
        response: 'Desculpe, para essa pergunta você precisa estar logado. Por favor, faça login ou cadastre-se para acesso completo à IA.'
      }, 403);
    }
    
    const db = getDb(env);
    
    // Verificar limite (20 mensagens/dia para não logado)
    const today = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
    const limit = await db.prepare(
      `SELECT messages_today FROM ai_chat_limits WHERE session_id = ? AND last_reset >= ?`
    ).bind(session_id, today).first();
    
    if (limit && limit.messages_today >= 20) {
      return jsonResponse({ success: false, error: 'Limite diário atingido (20 mensagens). Faça login para acesso ilimitado!' }, 429);
    }
    
    // Chamar OpenAI
    const aiResponse = await callOpenAI(env, message, 'public');
    
    // Salvar no histórico
    const messageId = crypto.randomUUID();
    await db.prepare(
      `INSERT INTO ai_chat_history (id, session_id, message_type, message_content, intent, is_public, tokens_used, created_at) 
       VALUES (?, ?, 'user', ?, ?, 1, 0, strftime('%s', 'now'))`
    ).bind(messageId, session_id, message, allowedIntents.find(i => messageL.includes(i)) || 'general').run();
    
    const responseId = crypto.randomUUID();
    await db.prepare(
      `INSERT INTO ai_chat_history (id, session_id, message_type, message_content, is_public, tokens_used, created_at) 
       VALUES (?, ?, 'ai', ?, 1, ?, strftime('%s', 'now'))`
    ).bind(responseId, session_id, aiResponse.response, aiResponse.tokens || 0).run();
    
    // Atualizar limites
    if (limit) {
      await db.prepare(
        `UPDATE ai_chat_limits SET messages_today = messages_today + 1, tokens_today = tokens_today + ? WHERE session_id = ?`
      ).bind(aiResponse.tokens || 0, session_id).run();
    } else {
      const limitId = crypto.randomUUID();
      await db.prepare(
        `INSERT INTO ai_chat_limits (id, session_id, messages_today, tokens_today, last_reset, created_at) 
         VALUES (?, ?, 1, ?, ?, strftime('%s', 'now'))`
      ).bind(limitId, session_id, aiResponse.tokens || 0, today).run();
    }
    
    return jsonResponse({
      success: true,
      response: aiResponse.response,
      tokens_used: aiResponse.tokens,
      remaining_today: 20 - ((limit?.messages_today || 0) + 1)
    });
  } catch (error) {
    console.error('AI Chat Public error:', error);
    return jsonResponse({ success: false, error: 'Erro ao processar mensagem' }, 500);
  }
}

// AI Chatbot - Privado (sem limites)
async function handleAIChatPrivate(request, env, user) {
  try {
    const { message, session_id } = await request.json();
    
    if (!message) {
      return jsonResponse({ success: false, error: 'Mensagem obrigatória' }, 400);
    }
    
    const db = getDb(env);
    const sessionId = session_id || `user_${user.userId}_${Date.now()}`;
    
    // Chamar OpenAI (sem restrições)
    const aiResponse = await callOpenAI(env, message, 'private', user);
    
    // Salvar no histórico
    const messageId = crypto.randomUUID();
    await db.prepare(
      `INSERT INTO ai_chat_history (id, user_id, session_id, message_type, message_content, is_public, tokens_used, created_at) 
       VALUES (?, ?, ?, 'user', ?, 0, 0, strftime('%s', 'now'))`
    ).bind(messageId, user.userId, sessionId, message).run();
    
    const responseId = crypto.randomUUID();
    await db.prepare(
      `INSERT INTO ai_chat_history (id, user_id, session_id, message_type, message_content, is_public, tokens_used, created_at) 
       VALUES (?, ?, ?, 'ai', ?, 0, ?, strftime('%s', 'now'))`
    ).bind(responseId, user.userId, sessionId, aiResponse.response, aiResponse.tokens || 0).run();
    
    return jsonResponse({
      success: true,
      response: aiResponse.response,
      tokens_used: aiResponse.tokens
    });
  } catch (error) {
    console.error('AI Chat Private error:', error);
    return jsonResponse({ success: false, error: 'Erro ao processar mensagem' }, 500);
  }
}

// Email Verification - Enviar código
async function sendVerificationEmail(env, userId, email) {
  try {
    const db = getDb(env);
    const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6 dígitos
    const expiresAt = Math.floor(Date.now() / 1000) + (30 * 60); // 30 minutos
    
    const codeId = crypto.randomUUID();
    await db.prepare(
      `INSERT INTO email_verification_codes (id, user_id, email, code, expires_at, created_at) 
       VALUES (?, ?, ?, ?, ?, strftime('%s', 'now'))`
    ).bind(codeId, userId, email, code, expiresAt).run();
    
    // Enviar email via Resend
    if (env.RESEND_API_KEY && env.RESEND_ENABLED === 'true') {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: env.RESEND_FROM_EMAIL || 'AgroSync <contato@agroisync.com>',
          to: email,
          subject: '🔐 Código de Verificação - AgroSync',
          html: `
            <h2>Bem-vindo ao AgroSync!</h2>
            <p>Seu código de verificação é:</p>
            <h1 style="font-size: 48px; color: #22c55e; letter-spacing: 5px;">${code}</h1>
            <p>Este código expira em 30 minutos.</p>
            <p>Se você não solicitou este código, ignore este email.</p>
            <br>
            <p>Atenciosamente,<br>Equipe AgroSync</p>
          `
        })
      });
    }
    
    return { success: true, codeId };
  } catch (error) {
    console.error('Send verification email error:', error);
    return { success: false, error };
  }
}

// Email Verification - Validar código
async function handleEmailVerifyCode(request, env) {
  try {
    const { email, code } = await request.json();
    
    if (!email || !code) {
      return jsonResponse({ success: false, error: 'Email e código obrigatórios' }, 400);
    }
    
    const db = getDb(env);
    const now = Math.floor(Date.now() / 1000);
    
    const verification = await db.prepare(
      `SELECT id, user_id FROM email_verification_codes 
       WHERE email = ? AND code = ? AND is_used = 0 AND expires_at > ?`
    ).bind(email, code, now).first();
    
    if (!verification) {
      return jsonResponse({ success: false, error: 'Código inválido ou expirado' }, 400);
    }
    
    // Marcar código como usado
    await db.prepare(
      `UPDATE email_verification_codes SET is_used = 1, verified_at = strftime('%s', 'now') WHERE id = ?`
    ).bind(verification.id).run();
    
    // Marcar email como verificado
    await db.prepare(
      `UPDATE users SET email_verified = 1 WHERE id = ?`
    ).bind(verification.user_id).run();
    
    return jsonResponse({
      success: true,
      message: 'Email verificado com sucesso!'
    });
  } catch (error) {
    console.error('Email verify code error:', error);
    return jsonResponse({ success: false, error: 'Erro ao verificar código' }, 500);
  }
}

// Email Verification - Reenviar código
async function handleEmailResendCode(request, env) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return jsonResponse({ success: false, error: 'Email obrigatório' }, 400);
    }
    
    const db = getDb(env);
    
    // Buscar usuário
    const user = await db.prepare(
      `SELECT id, email FROM users WHERE email = ?`
    ).bind(email).first();
    
    if (!user) {
      return jsonResponse({ success: false, error: 'Usuário não encontrado' }, 404);
    }
    
    if (user.email_verified === 1) {
      return jsonResponse({ success: false, error: 'Email já verificado' }, 400);
    }
    
    // Enviar novo código
    const result = await sendVerificationEmail(env, user.id, email);
    
    if (result.success) {
      return jsonResponse({
        success: true,
        message: 'Código reenviado com sucesso!'
      });
    } else {
      return jsonResponse({ success: false, error: 'Erro ao enviar código' }, 500);
    }
  } catch (error) {
    console.error('Email resend code error:', error);
    return jsonResponse({ success: false, error: 'Erro ao reenviar código' }, 500);
  }
}

// Filtro de segurança LGPD - Bloqueia tentativas de expor dados sensíveis
function validateMessageSecurity(message) {
  const dangerousPatterns = [
    // SQL Injection
    /(\bSELECT\b|\bINSERT\b|\bUPDATE\b|\bDELETE\b|\bDROP\b|\bCREATE\b|\bALTER\b).*\bFROM\b/i,
    /(\bUNION\b|\bJOIN\b).*\bSELECT\b/i,
    /\b(OR|AND)\b\s+\d+\s*=\s*\d+/i,
    /[';].*(-{2}|\/\*)/,
    
    // Tentativa de acessar dados sensíveis (LGPD)
    /(mostre|liste|retorne|busque|pegue|traga).*(senha|password|cpf|cnpj|email|telefone|endereço|cartão|credit.*card)/i,
    /(select|where|from).*(users|clientes|passwords|senhas|cpf|cnpj)/i,
    /(api.*key|secret|token|bearer|auth.*token)/i,
    
    // XSS e código malicioso
    /<script[\s\S]*?>[\s\S]*?<\/script>/i,
    /javascript:/i,
    /on(load|error|click|mouse)/i,
    
    // Path traversal
    /\.\.[/\\]/,
    /(\/etc\/passwd|\/root\/|C:\\Windows)/i,
    
    // Command injection
    /[;&|`$]\s*(rm|del|format|shutdown|reboot|kill)/i
  ];
  
  for (const pattern of dangerousPatterns) {
    if (pattern.test(message)) {
      return {
        safe: false,
        reason: 'Mensagem contém padrões potencialmente perigosos ou tentativa de acesso a dados sensíveis'
      };
    }
  }
  
  return { safe: true };
}

// Chamar OpenAI (mantém API key SEGURA no backend!)
async function callOpenAI(env, message, mode, user = null) {
  try {
    // VALIDAÇÃO DE SEGURANÇA LGPD
    const securityCheck = validateMessageSecurity(message);
    if (!securityCheck.safe) {
      return {
        response: '⚠️ Desculpe, não posso processar essa solicitação. Por questões de segurança e conformidade com a LGPD, não posso acessar, expor ou manipular dados sensíveis de usuários. Posso ajudar com informações públicas sobre o AgroSync, como planos, funcionalidades e dúvidas gerais sobre agronegócio.',
        tokens: 0,
        blocked: true
      };
    }
    
    if (!env.OPENAI_API_KEY) {
      // Fallback se não tiver OpenAI configurado
      return {
        response: 'Olá! Sou o assistente virtual do AgroSync. Como posso ajudar você hoje?',
        tokens: 0
      };
    }
    
    const systemPrompt = mode === 'public' 
      ? `Você é o assistente virtual do AgroSync, plataforma brasileira de agronegócio.

REGRAS ESTRITAS - VOCÊ DEVE SEGUIR:
1. Responda APENAS sobre: preços de commodities, funcionalidades do site, planos disponíveis, como usar a plataforma, informações públicas sobre agronegócio.
2. JAMAIS revele, busque ou mencione dados pessoais de usuários (CPF, CNPJ, email, senha, telefone, endereço, etc).
3. JAMAIS execute comandos SQL, código ou scripts.
4. JAMAIS revele detalhes técnicos internos do sistema, APIs, tokens ou chaves.
5. Se perguntarem sobre dados de clientes, responda: "Por questões de segurança e LGPD, não posso acessar dados de usuários".
6. Seja educado, profissional e focado em agronegócio.
7. Se não souber algo, seja honesto e direcione para o suporte.

SOBRE O AGROISYNC:
- Plataforma de intermediação de produtos e fretes agrícolas
- Planos: Inicial (grátis), Básico, Profissional, Premium
- Funcionalidades: Marketplace, AgroConecta (fretes), Mensageria, Crypto, AI Chatbot
- Suporte: contato@agroisync.com`
      : `Você é o assistente completo do AgroSync para usuários autenticados.

REGRAS ESTRITAS - VOCÊ DEVE SEGUIR:
1. Ajude com dúvidas sobre agronegócio, gestão, uso da plataforma, análise de dados públicos.
2. JAMAIS revele dados sensíveis de OUTROS usuários (LGPD).
3. JAMAIS execute comandos SQL, código malicioso ou scripts.
4. JAMAIS revele chaves de API, tokens ou credenciais.
5. Você pode ajudar com dados DO PRÓPRIO usuário ${user?.email || ''} (ID: ${user?.userId || ''}), mas NUNCA de outros.
6. Se perguntarem sobre vulnerabilidades, responda: "Não posso ajudar com isso. Reporte para seguranca@agroisync.com".
7. Seja profissional, educado e ético.

CAPACIDADES:
- Análise de mercado e commodities
- Dicas de gestão rural
- Explicações sobre funcionalidades
- Suporte técnico
- Orientações gerais de agronegócio`;
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 500,
        temperature: 0.7,
        presence_penalty: 0.6,
        frequency_penalty: 0.3
      })
    });
    
    if (!response.ok) {
      throw new Error('OpenAI API error');
    }
    
    const data = await response.json();
    const aiMessage = data.choices[0]?.message?.content || 'Desculpe, não consegui processar sua mensagem.';
    
    // VALIDAÇÃO DE SAÍDA - Garante que a resposta da IA não exponha dados
    const outputCheck = validateMessageSecurity(aiMessage);
    if (!outputCheck.safe) {
      return {
        response: '⚠️ A resposta foi bloqueada por medidas de segurança. Por favor, reformule sua pergunta de forma mais geral.',
        tokens: data.usage?.total_tokens || 0,
        blocked: true
      };
    }
    
    return {
      response: aiMessage,
      tokens: data.usage?.total_tokens || 0
    };
  } catch (error) {
    console.error('OpenAI error:', error);
    return {
      response: 'Desculpe, estou com dificuldades técnicas no momento. Por favor, tente novamente ou entre em contato com suporte@agroisync.com.',
      tokens: 0
    };
  }
}

// Helper para buscar preço
async function getCurrentCryptoPrice(symbol) {
  const prices = {
    'BTC': 43250.50,
    'ETH': 2650.30,
    'USDT': 1.00,
    'BNB': 310.50,
    'SOL': 98.75,
    'XRP': 0.52,
    'USDC': 1.00,
    'ADA': 0.45,
    'AVAX': 35.20,
    'DOGE': 0.08,
    'TRX': 0.10,
    'DOT': 6.50,
    'MATIC': 0.85,
    'LINK': 14.30,
    'SHIB': 0.000009,
    'DAI': 1.00,
    'UNI': 6.20,
    'LTC': 72.50,
    'BCH': 245.80,
    'ATOM': 9.75,
    'XMR': 158.90,
    'ETC': 20.15,
    'XLM': 0.13,
    'FIL': 4.85,
    'AAVE': 95.40,
    'ALGO': 0.18,
    'VET': 0.025,
    'ICP': 4.50,
    'APT': 8.30,
    'NEAR': 2.15
  };
  
  return prices[symbol] || null;
}

// User Plan Info
async function handleUserPlan(request, env, user) {
  try {
    const db = getDb(env);
    
    const userData = await db.prepare('SELECT plan, plan_expires_at FROM users WHERE id = ?').bind(user.userId).first();
    if (!userData) {
      return jsonResponse({ success: false, error: 'Usuário não encontrado' }, 404);
    }

    const plan = await db.prepare('SELECT * FROM plans WHERE slug = ?').bind(userData.plan || 'inicial').first();
    if (!plan) {
      return jsonResponse({ success: false, error: 'Plano não encontrado' }, 404);
    }

    const currentMonth = new Date().toISOString().slice(0, 7);
    const usage = await db.prepare(
      'SELECT freights_used, products_used FROM user_usage WHERE user_id = ? AND month = ?'
    ).bind(user.userId, currentMonth).first();

    return jsonResponse({
      success: true,
      data: {
        plan: plan.slug,
        planName: plan.name,
        priceMonthly: plan.price_monthly,
        freightLimit: plan.freight_limit,
        productLimit: plan.product_limit,
        freightsUsed: usage?.freights_used || 0,
        productsUsed: usage?.products_used || 0,
        expiresAt: userData.plan_expires_at,
        features: plan.features ? JSON.parse(plan.features) : []
      }
    });
  } catch (error) {
    console.error('User plan error:', error);
    return jsonResponse({ success: false, error: 'Erro ao buscar plano' }, 500);
  }
}

// Contact
async function handleContact(request, env) {
  try {
    const { name, email, phone, subject, message } = await request.json();
    
    if (!name || !email || !message) {
      return jsonResponse({ success: false, error: 'Dados incompletos' }, 400);
    }
    
    const db = getDb(env);
    const messageId = crypto.randomUUID();
    
    await db.prepare(
      "INSERT INTO contact_messages (id, name, email, phone, subject, message, created_at) VALUES (?, ?, ?, ?, ?, ?, datetime('now'))"
    ).bind(messageId, name, email, phone || '', subject || '', message).run();
    
    // Send notification email
    await sendEmail(env, {
      to: env.RESEND_FROM_EMAIL || 'contato@agroisync.com',
      subject: `Nova mensagem de contato: ${subject || 'Sem assunto'}`,
      html: `<h2>Nova mensagem de contato</h2><p><strong>Nome:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Mensagem:</strong> ${message}</p>`
    });

    return jsonResponse({
      success: true,
      message: 'Mensagem enviada com sucesso'
    }, 201);
  } catch (error) {
    console.error('Contact error:', error);
    return jsonResponse({ success: false, error: 'Erro ao enviar mensagem' }, 500);
  }
}

// Password Recovery
async function handleForgotPassword(request, env) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return jsonResponse({ success: false, error: 'Email é obrigatório' }, 400);
    }
    
    const db = getDb(env);
    
    // Check if user exists
    const user = await db.prepare('SELECT id, name FROM users WHERE email = ?')
      .bind(email.toLowerCase())
      .first();

    if (!user) {
      // Don't reveal if user exists
      return jsonResponse({
        success: true,
        message: 'Se o email existir, você receberá instruções para recuperação'
      });
    }
    
    // Generate reset token
    const resetToken = crypto.randomUUID();
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();
    
    // Store in KV with 1 hour expiration
    if (env.CACHE) {
      await env.CACHE.put(`password-reset:${email.toLowerCase()}`, JSON.stringify({
        token: resetToken,
        code: resetCode,
        userId: user.id
      }), { expirationTtl: 3600 });
    }
    
    // Save to database for logging
    const logId = crypto.randomUUID();
    await db.prepare(
      "INSERT INTO email_logs (id, email, type, code, token, sent_at, expires_at, status) VALUES (?, ?, ?, ?, ?, datetime('now'), ?, ?)"
    ).bind(logId, email.toLowerCase(), 'password-reset', resetCode, resetToken, expiresAt, 'sent').run();
    
    // Send email
    const emailResult = await sendEmail(env, {
      to: email,
      subject: '🔐 Recuperação de Senha - AgroSync',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: 'Segoe UI', Arial, sans-serif;">
          <div style="max-width: 600px; margin: 40px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #2a7f4f 0%, #1e5f3a 100%); padding: 40px 30px; text-align: center;">
              <div style="background: white; width: 80px; height: 80px; margin: 0 auto 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                <span style="font-size: 40px;">🔐</span>
              </div>
              <h1 style="margin: 0; color: white; font-size: 28px; font-weight: bold;">Recuperação de Senha</h1>
              <p style="margin: 10px 0 0; color: rgba(255,255,255,0.9); font-size: 16px;">AgroSync - Plataforma Inteligente de Agronegócio</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 30px;">
              <h2 style="color: #2a7f4f; font-size: 22px; margin: 0 0 20px;">Olá ${user.name}! 👋</h2>
              <p style="color: #666; font-size: 16px; line-height: 1.6; margin: 0 0 30px;">
                Recebemos uma solicitação para redefinir sua senha. Use o código abaixo ou clique no botão:
              </p>
              
              <!-- Code Box -->
              <div style="background: linear-gradient(135deg, #2a7f4f 0%, #1e5f3a 100%); border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0; box-shadow: 0 4px 15px rgba(42,127,79,0.3);">
                <p style="color: rgba(255,255,255,0.8); font-size: 14px; margin: 0 0 10px; text-transform: uppercase; letter-spacing: 2px;">Código de Recuperação</p>
                <div style="background: rgba(255,255,255,0.15); border-radius: 8px; padding: 20px; margin: 10px 0;">
                  <span style="color: white; font-size: 42px; font-weight: bold; letter-spacing: 8px; font-family: 'Courier New', monospace;">${resetCode}</span>
                </div>
                <p style="color: rgba(255,255,255,0.7); font-size: 13px; margin: 15px 0 0;">⏰ Válido por 1 hora</p>
              </div>
              
              <!-- Button -->
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://agroisync.com/reset-password?token=${resetToken}" style="display: inline-block; background: linear-gradient(135deg, #2a7f4f 0%, #1e5f3a 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: bold; box-shadow: 0 4px 15px rgba(42,127,79,0.3);">
                  🔓 Redefinir Minha Senha
                </a>
              </div>
              
              <!-- Info -->
              <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 20px; border-radius: 8px; margin: 30px 0;">
                <p style="color: #856404; font-size: 14px; margin: 0; line-height: 1.6;">
                  <strong>⚠️ Atenção:</strong><br>
                  • Este código expira em 1 hora<br>
                  • Não compartilhe este código com ninguém<br>
                  • Se você não solicitou esta recuperação, ignore este email e sua senha permanecerá segura
                </p>
              </div>
              
              <p style="color: #999; font-size: 13px; text-align: center; margin: 30px 0 0; line-height: 1.6;">
                Precisa de ajuda? Entre em contato:<br>
                <a href="mailto:contato@agroisync.com" style="color: #2a7f4f; text-decoration: none;">contato@agroisync.com</a>
              </p>
            </div>
            
            <!-- Footer -->
            <div style="background: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e0e0e0;">
              <p style="color: #999; font-size: 13px; margin: 0 0 10px;">
                © 2025 AgroSync. Todos os direitos reservados.
              </p>
              <p style="color: #999; font-size: 12px; margin: 0;">
                🌾 Transformando o agronegócio com tecnologia
              </p>
            </div>
          </div>
        </body>
        </html>
      `
    });

    console.log('Password reset sent:', { email, code: resetCode, token: resetToken, emailResult });

    return jsonResponse({
        success: true,
      message: 'Instruções de recuperação enviadas para seu email',
      code: resetCode, // SEMPRE retorna o código
      token: resetToken, // SEMPRE retorna o token
      emailSent: emailResult.success
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return jsonResponse({ success: false, error: 'Erro ao processar recuperação' }, 500);
  }
}

async function handleResetPassword(request, env) {
  try {
    const { email, token, code, newPassword } = await request.json();
    
    if (!email || (!token && !code) || !newPassword) {
      return jsonResponse({ success: false, error: 'Dados incompletos' }, 400);
    }
    
    const db = getDb(env);
    
    // Get reset data from KV
    let resetData = null;
    if (env.CACHE) {
      const data = await env.CACHE.get(`password-reset:${email.toLowerCase()}`);
      if (data) {
        resetData = JSON.parse(data);
      }
    }
    
    // Validate token or code
    if (resetData) {
      const validToken = token && resetData.token === token;
      const validCode = code && resetData.code === code;
      
      if (!validToken && !validCode) {
        return jsonResponse({ success: false, error: 'Token ou código inválido' }, 400);
      }
    } else {
      return jsonResponse({ success: false, error: 'Token expirado ou inválido' }, 400);
    }
    
    // Hash new password
    const hashedPassword = await hashPassword(newPassword);
    
    // Update password
    await db.prepare('UPDATE users SET password = ? WHERE id = ?')
      .bind(hashedPassword, resetData.userId)
      .run();

    // Delete used reset token
    if (env.CACHE) {
      await env.CACHE.delete(`password-reset:${email.toLowerCase()}`);
    }

    return jsonResponse({
      success: true,
      message: 'Senha redefinida com sucesso'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return jsonResponse({ success: false, error: 'Erro ao redefinir senha' }, 500);
  }
}

// Email Verification
async function handleSendVerificationEmail(request, env) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return jsonResponse({ success: false, error: 'Email é obrigatório' }, 400);
    }
    
    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    const db = getDb(env);
    const logId = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
    
    // Store code in KV with 10 minute expiration
    if (env.CACHE) {
      await env.CACHE.put(`verification:${email}`, code, { expirationTtl: 600 });
    }
    
    // Save to database for logging
    await db.prepare(
      "INSERT INTO email_logs (id, email, type, code, sent_at, expires_at, status) VALUES (?, ?, ?, ?, datetime('now'), ?, ?)"
    ).bind(logId, email, 'verification', code, expiresAt, 'sent').run();
    
    // Send email
    const emailResult = await sendEmail(env, {
      to: email,
      subject: '🌱 Código de Verificação - AgroSync',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: 'Segoe UI', Arial, sans-serif;">
          <div style="max-width: 600px; margin: 40px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #2a7f4f 0%, #1e5f3a 100%); padding: 40px 30px; text-align: center;">
              <div style="background: white; width: 80px; height: 80px; margin: 0 auto 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                <span style="font-size: 40px;">🌱</span>
              </div>
              <h1 style="margin: 0; color: white; font-size: 28px; font-weight: bold;">Código de Verificação</h1>
              <p style="margin: 10px 0 0; color: rgba(255,255,255,0.9); font-size: 16px;">AgroSync - Plataforma Inteligente de Agronegócio</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 30px;">
              <h2 style="color: #2a7f4f; font-size: 22px; margin: 0 0 20px;">Olá! 👋</h2>
              <p style="color: #666; font-size: 16px; line-height: 1.6; margin: 0 0 30px;">
                Recebemos uma solicitação para verificar seu email. Use o código abaixo para continuar:
              </p>
              
              <!-- Code Box -->
              <div style="background: linear-gradient(135deg, #2a7f4f 0%, #1e5f3a 100%); border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0; box-shadow: 0 4px 15px rgba(42,127,79,0.3);">
                <p style="color: rgba(255,255,255,0.8); font-size: 14px; margin: 0 0 10px; text-transform: uppercase; letter-spacing: 2px;">Seu Código</p>
                <div style="background: rgba(255,255,255,0.15); border-radius: 8px; padding: 20px; margin: 10px 0;">
                  <span style="color: white; font-size: 42px; font-weight: bold; letter-spacing: 8px; font-family: 'Courier New', monospace;">${code}</span>
                </div>
                <p style="color: rgba(255,255,255,0.7); font-size: 13px; margin: 15px 0 0;">⏰ Válido por 10 minutos</p>
              </div>
              
              <!-- Info -->
              <div style="background: #f8f9fa; border-left: 4px solid #2a7f4f; padding: 20px; border-radius: 8px; margin: 30px 0;">
                <p style="color: #666; font-size: 14px; margin: 0; line-height: 1.6;">
                  <strong style="color: #2a7f4f;">⚠️ Importante:</strong><br>
                  • Este código expira em 10 minutos<br>
                  • Não compartilhe este código com ninguém<br>
                  • Se você não solicitou este código, ignore este email
                </p>
              </div>
              
              <p style="color: #999; font-size: 13px; text-align: center; margin: 30px 0 0; line-height: 1.6;">
                Precisa de ajuda? Entre em contato:<br>
                <a href="mailto:contato@agroisync.com" style="color: #2a7f4f; text-decoration: none;">contato@agroisync.com</a>
              </p>
            </div>
            
            <!-- Footer -->
            <div style="background: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e0e0e0;">
              <p style="color: #999; font-size: 13px; margin: 0 0 10px;">
                © 2025 AgroSync. Todos os direitos reservados.
              </p>
              <p style="color: #999; font-size: 12px; margin: 0;">
                🌾 Transformando o agronegócio com tecnologia
              </p>
            </div>
          </div>
        </body>
        </html>
      `
    });
    
    console.log('Email verification sent:', { email, code, emailResult });

    return jsonResponse({
      success: true,
      message: 'Código de verificação enviado',
      code, // SEMPRE retorna o código
      emailSent: emailResult.success,
      emailError: emailResult.error || emailResult.details || null
    });
  } catch (error) {
    console.error('Send verification error:', error);
    return jsonResponse({ success: false, error: 'Erro ao enviar código' }, 500);
  }
}

async function handleVerifyEmail(request, env) {
  try {
    const { email, code } = await request.json();
    
    if (!email || !code) {
      return jsonResponse({ success: false, error: 'Email e código são obrigatórios' }, 400);
    }
    
    // Get stored code from KV
    let storedCode = null;
    if (env.CACHE) {
      storedCode = await env.CACHE.get(`verification:${email}`);
    }
    
    // When Resend is not configured, accept any 6-digit code if no stored code
    if (!storedCode && (!env.RESEND_API_KEY || env.RESEND_API_KEY === 're_placeholder_configure_real_key_later') && code.length === 6) {
    return jsonResponse({
      success: true,
        message: 'Email verificado (modo desenvolvimento - Resend não configurado)'
      });
    }
    
    if (storedCode !== code) {
      return jsonResponse({ success: false, error: 'Código inválido ou expirado' }, 400);
    }
    
    // Update user email verification status
    const db = getDb(env);
    await db.prepare(
      'UPDATE users SET is_email_verified = 1 WHERE email = ?'
    ).bind(email.toLowerCase()).run();
    
    // Delete used code
    if (env.CACHE) {
      await env.CACHE.delete(`verification:${email}`);
    }

    return jsonResponse({
      success: true,
      message: 'Email verificado com sucesso'
    });
  } catch (error) {
    console.error('Verify email error:', error);
    return jsonResponse({ success: false, error: 'Erro ao verificar código' }, 500);
  }
}

// ============================================
// ADMIN FUNCTIONS
// ============================================

// Admin - Listar todos os usuários
async function handleAdminListUsers(request, env) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const search = url.searchParams.get('search') || '';
    const offset = (page - 1) * limit;
    
    const db = getDb(env);
    
    let query = 'SELECT id, email, name, company, phone, cpf, cnpj, plan, plan_active, created_at FROM users';
    let params = [];
    
    if (search) {
      query += ' WHERE email LIKE ? OR name LIKE ? OR company LIKE ? OR cpf LIKE ? OR cnpj LIKE ?';
      const searchParam = `%${search}%`;
      params = [searchParam, searchParam, searchParam, searchParam, searchParam];
    }
    
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);
    
    const users = await db.prepare(query).bind(...params).all();
    const totalResult = await db.prepare('SELECT COUNT(*) as total FROM users').first();
    
    return jsonResponse({
      success: true,
      users: users.results || [],
      total: totalResult?.total || 0,
      page,
      limit,
      totalPages: Math.ceil((totalResult?.total || 0) / limit)
    });
  } catch (error) {
    console.error('Admin list users error:', error);
    return jsonResponse({ success: false, error: 'Erro ao listar usuários' }, 500);
  }
}

// Admin - Ver detalhes de um usuário
async function handleAdminGetUser(request, env, userId) {
  try {
    const db = getDb(env);
    const user = await db.prepare('SELECT * FROM users WHERE id = ?').bind(userId).first();
    
    if (!user) {
      return jsonResponse({ success: false, error: 'Usuário não encontrado' }, 404);
    }
    
    // Buscar produtos do usuário
    const products = await db.prepare('SELECT * FROM products WHERE user_id = ?').bind(userId).all();
    
    // Buscar fretes do usuário
    const freights = await db.prepare('SELECT * FROM freight WHERE user_id = ?').bind(userId).all();
    
    return jsonResponse({
      success: true,
      user,
      stats: {
        productsCount: products.results?.length || 0,
        freightsCount: freights.results?.length || 0
      }
    });
  } catch (error) {
    console.error('Admin get user error:', error);
    return jsonResponse({ success: false, error: 'Erro ao buscar usuário' }, 500);
  }
}

// Admin - Editar usuário
async function handleAdminUpdateUser(request, env, userId) {
  try {
    const data = await request.json();
    const db = getDb(env);
    
    const updateFields = [];
    const values = [];
    
    if (data.name) { updateFields.push('name = ?'); values.push(data.name); }
    if (data.email) { updateFields.push('email = ?'); values.push(data.email); }
    if (data.company) { updateFields.push('company = ?'); values.push(data.company); }
    if (data.phone) { updateFields.push('phone = ?'); values.push(data.phone); }
    if (data.plan) { updateFields.push('plan = ?'); values.push(data.plan); }
    if (data.plan_active !== undefined) { updateFields.push('plan_active = ?'); values.push(data.plan_active ? 1 : 0); }
    
    if (updateFields.length === 0) {
      return jsonResponse({ success: false, error: 'Nenhum campo para atualizar' }, 400);
    }
    
    values.push(userId);
    await db.prepare(`UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`).bind(...values).run();
    
    return jsonResponse({ success: true, message: 'Usuário atualizado com sucesso' });
  } catch (error) {
    console.error('Admin update user error:', error);
    return jsonResponse({ success: false, error: 'Erro ao atualizar usuário' }, 500);
  }
}

// Admin - Deletar usuário
async function handleAdminDeleteUser(request, env, userId) {
  try {
    const db = getDb(env);
    
    // Deletar produtos do usuário
    await db.prepare('DELETE FROM products WHERE user_id = ?').bind(userId).run();
    
    // Deletar fretes do usuário
    await db.prepare('DELETE FROM freight WHERE user_id = ?').bind(userId).run();
    
    // Deletar usuário
    await db.prepare('DELETE FROM users WHERE id = ?').bind(userId).run();
    
    return jsonResponse({ success: true, message: 'Usuário deletado com sucesso' });
  } catch (error) {
    console.error('Admin delete user error:', error);
    return jsonResponse({ success: false, error: 'Erro ao deletar usuário' }, 500);
  }
}

// Admin - Bloquear CPF/CNPJ/IE/Email
async function handleAdminBlock(request, env) {
  try {
    const { type, value, reason } = await request.json();
    
    if (!type || !value) {
      return jsonResponse({ success: false, error: 'Tipo e valor são obrigatórios' }, 400);
    }
    
    const db = getDb(env);
    const blockId = crypto.randomUUID();
    
    // Criar tabela de bloqueios se não existir
    await db.prepare(`
      CREATE TABLE IF NOT EXISTS blocked_identifiers (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        value TEXT NOT NULL,
        reason TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        created_by TEXT
      )
    `).run();
    
    await db.prepare(
      'INSERT INTO blocked_identifiers (id, type, value, reason) VALUES (?, ?, ?, ?)'
    ).bind(blockId, type, value.toLowerCase(), reason || 'Bloqueado pelo admin').run();
    
    return jsonResponse({ success: true, message: `${type.toUpperCase()} bloqueado com sucesso`, blockId });
  } catch (error) {
    console.error('Admin block error:', error);
    return jsonResponse({ success: false, error: 'Erro ao bloquear' }, 500);
  }
}

// Admin - Listar bloqueios
async function handleAdminListBlocks(request, env) {
  try {
    const db = getDb(env);
    
    // Criar tabela se não existir
    await db.prepare(`
      CREATE TABLE IF NOT EXISTS blocked_identifiers (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        value TEXT NOT NULL,
        reason TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        created_by TEXT
      )
    `).run();
    
    const blocks = await db.prepare('SELECT * FROM blocked_identifiers ORDER BY created_at DESC').all();
    
    return jsonResponse({
      success: true,
      blocks: blocks.results || []
    });
  } catch (error) {
    console.error('Admin list blocks error:', error);
    return jsonResponse({ success: false, error: 'Erro ao listar bloqueios' }, 500);
  }
}

// Admin - Remover bloqueio
async function handleAdminUnblock(request, env, blockId) {
  try {
    const db = getDb(env);
    await db.prepare('DELETE FROM blocked_identifiers WHERE id = ?').bind(blockId).run();
    
    return jsonResponse({ success: true, message: 'Bloqueio removido com sucesso' });
  } catch (error) {
    console.error('Admin unblock error:', error);
    return jsonResponse({ success: false, error: 'Erro ao remover bloqueio' }, 500);
  }
}

// Admin - Stats COMPLETO (com pagamentos, valores, percentagens)
async function handleAdminStats(request, env) {
  try {
    const db = getDb(env);
    
    // Usuários
    const totalUsers = await db.prepare('SELECT COUNT(*) as count FROM users').first();
    const usersToday = await db.prepare(
      "SELECT COUNT(*) as count FROM users WHERE DATE(created_at) = DATE('now')"
    ).first();
    const usersThisWeek = await db.prepare(
      "SELECT COUNT(*) as count FROM users WHERE created_at >= DATE('now', '-7 days')"
    ).first();
    const usersThisMonth = await db.prepare(
      "SELECT COUNT(*) as count FROM users WHERE created_at >= DATE('now', 'start of month')"
    ).first();
    const paidUsers = await db.prepare(
      "SELECT COUNT(*) as count FROM users WHERE plan != 'inicial' AND plan IS NOT NULL"
    ).first();
    
    // Produtos e Fretes
    const totalProducts = await db.prepare('SELECT COUNT(*) as count FROM products').first();
    const totalFreights = await db.prepare('SELECT COUNT(*) as count FROM freight').first();
    const productsToday = await db.prepare(
      "SELECT COUNT(*) as count FROM products WHERE DATE(created_at) = DATE('now')"
    ).first();
    const freightsToday = await db.prepare(
      "SELECT COUNT(*) as count FROM freight WHERE DATE(created_at) = DATE('now')"
    ).first();
    
    // Bloqueios
    const totalBlocks = await db.prepare('SELECT COUNT(*) as count FROM blocked_identifiers').first();
    
    // Pagamentos (se tabela existir)
    let totalRevenue = 0;
    let paymentsToday = 0;
    let paymentsThisMonth = 0;
    try {
      const revenue = await db.prepare("SELECT SUM(amount) as total FROM payments WHERE status = 'completed'").first();
      totalRevenue = revenue?.total || 0;
      
      const payToday = await db.prepare(
        "SELECT COUNT(*) as count FROM payments WHERE DATE(created_at) = DATE('now') AND status = 'completed'"
      ).first();
      paymentsToday = payToday?.count || 0;
      
      const payMonth = await db.prepare(
        "SELECT COUNT(*) as count FROM payments WHERE created_at >= DATE('now', 'start of month') AND status = 'completed'"
      ).first();
      paymentsThisMonth = payMonth?.count || 0;
    } catch (e) {
      // Tabela payments pode não existir ainda
      console.log('Payments table not found, skipping revenue stats');
    }
    
    // Conversas ativas
    let activeConversations = 0;
    try {
      const convos = await db.prepare("SELECT COUNT(DISTINCT sender_id) as count FROM messages WHERE created_at >= DATE('now', '-7 days')").first();
      activeConversations = convos?.count || 0;
    } catch (e) {
      console.log('Messages table not found');
    }
    
    // Cálculos de crescimento (%)
    const usersLastWeek = totalUsers?.count - (usersThisWeek?.count || 0);
    const growthPercentage = usersLastWeek > 0 
      ? (((usersThisWeek?.count || 0) / usersLastWeek) * 100).toFixed(2)
      : 0;
    
    const paidPercentage = totalUsers?.count > 0
      ? ((paidUsers?.count / totalUsers?.count) * 100).toFixed(2)
      : 0;
    
    return jsonResponse({
      success: true,
      stats: {
        // Usuários
        totalUsers: totalUsers?.count || 0,
        usersToday: usersToday?.count || 0,
        usersThisWeek: usersThisWeek?.count || 0,
        usersThisMonth: usersThisMonth?.count || 0,
        paidUsers: paidUsers?.count || 0,
        paidPercentage: parseFloat(paidPercentage),
        growthPercentage: parseFloat(growthPercentage),
        
        // Conteúdo
        totalProducts: totalProducts?.count || 0,
        totalFreights: totalFreights?.count || 0,
        productsToday: productsToday?.count || 0,
        freightsToday: freightsToday?.count || 0,
        
        // Financeiro
        totalRevenue: parseFloat(totalRevenue) || 0,
        paymentsToday: paymentsToday || 0,
        paymentsThisMonth: paymentsThisMonth || 0,
        
        // Atividade
        activeConversations: activeConversations || 0,
        totalBlocks: totalBlocks?.count || 0
      }
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return jsonResponse({ success: false, error: 'Erro ao buscar estatísticas' }, 500);
  }
}

// Admin - Deletar produto
async function handleAdminDeleteProduct(request, env, productId) {
  try {
    const db = getDb(env);
    await db.prepare('DELETE FROM products WHERE id = ?').bind(productId).run();
    return jsonResponse({ success: true, message: 'Produto deletado com sucesso' });
  } catch (error) {
    console.error('Admin delete product error:', error);
    return jsonResponse({ success: false, error: 'Erro ao deletar produto' }, 500);
  }
}

// Admin - Deletar frete
async function handleAdminDeleteFreight(request, env, freightId) {
  try {
    const db = getDb(env);
    await db.prepare('DELETE FROM freight WHERE id = ?').bind(freightId).run();
    return jsonResponse({ success: true, message: 'Frete deletado com sucesso' });
  } catch (error) {
    console.error('Admin delete freight error:', error);
    return jsonResponse({ success: false, error: 'Erro ao deletar frete' }, 500);
  }
}

// Admin - Listar todos os produtos
async function handleAdminListProducts(request, env) {
  try {
    const db = getDb(env);
    const products = await db.prepare(`
      SELECT p.*, u.email as user_email, u.name as user_name 
      FROM products p 
      LEFT JOIN users u ON p.user_id = u.id 
      ORDER BY p.created_at DESC 
      LIMIT 100
    `).all();
    
    return jsonResponse({
      success: true,
      products: products.results || []
    });
  } catch (error) {
    console.error('Admin list products error:', error);
    return jsonResponse({ success: false, error: 'Erro ao listar produtos' }, 500);
  }
}

// Admin - Listar todos os fretes
async function handleAdminListFreights(request, env) {
  try {
    const db = getDb(env);
    const freights = await db.prepare(`
      SELECT f.*, u.email as user_email, u.name as user_name 
      FROM freight f 
      LEFT JOIN users u ON f.user_id = u.id 
      ORDER BY f.created_at DESC 
      LIMIT 100
    `).all();
    
    return jsonResponse({
      success: true,
      freights: freights.results || []
    });
  } catch (error) {
    console.error('Admin list freights error:', error);
    return jsonResponse({ success: false, error: 'Erro ao listar fretes' }, 500);
  }
}

// ============================================
// MAIN ROUTER
// ============================================

async function handleRequest(request, env) {
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method;
  
  // CORS preflight
  if (method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400'
      }
    });
  }
  
  try {
    // Health check
    if (path === '/api/health' || path === '/health') {
      return handleHealth(request, env);
    }
    
    // Public routes - Auth
  if (path === '/api/auth/register' && method === 'POST') {
    return handleRegister(request, env);
  }
  if (path === '/api/auth/login' && method === 'POST') {
    return handleLogin(request, env);
  }
    if (path === '/api/auth/forgot-password' && method === 'POST') {
      return handleForgotPassword(request, env);
    }
    if (path === '/api/auth/reset-password' && method === 'POST') {
      return handleResetPassword(request, env);
    }
    
    // Public routes - Products
  if (path === '/api/products' && method === 'GET') {
    return handleProductsList(request, env);
  }

    // Public routes - Plans (list) - allow frontend to fetch prices without auth
    if (path === '/api/plans' && method === 'GET') {
      return handlePlansList(request, env);
    }

    // Public route - Crypto prices
    if (path === '/api/crypto/prices' && method === 'GET') {
      return handleCryptoPrices(request, env);
    }

    // Public route - AI Chatbot (whitelisted intents)
    if (path === '/api/ai/chat' && method === 'POST') {
      return handleAIChatPublic(request, env);
    }

    // Public route - Email verification
    if (path === '/api/email/verify-code' && method === 'POST') {
      return handleEmailVerifyCode(request, env);
    }
    if (path === '/api/email/resend-code' && method === 'POST') {
      return handleEmailResendCode(request, env);
    }

      // Public route - create user with avatar
      if (path === '/api/users/create-with-avatar' && method === 'POST') {
        return handleCreateUserWithAvatar(request, env);
      }
    
    // Public routes - Freight
  if ((path === '/api/freight' || path === '/api/freights') && method === 'GET') {
    return handleFreightList(request, env);
  }
    
    // Public routes - Contact
    if (path === '/api/contact' && method === 'POST') {
      return handleContact(request, env);
    }
    
    // Public routes - Email verification
    if (path === '/api/email/send-verification' && method === 'POST') {
      return handleSendVerificationEmail(request, env);
    }
    if (path === '/api/email/verify' && method === 'POST') {
      return handleVerifyEmail(request, env);
    }
    
    // Public - Payment Webhooks (DEVE ESTAR ANTES DO verifyJWT!)
    if (path === '/api/payments/callback' && method === 'POST') {
      return handlePaymentCallback(request, env);
    }
    if (path === '/api/payments/webhook' && method === 'POST') {
      return handleStripeWebhook(request, env);
    }
    if (path === '/api/webhooks/asaas/payment' && method === 'POST') {
      return handleAsaasWebhook(request, env);
    }
    if (path === '/api/webhooks/asaas/transfer' && method === 'POST') {
      return handleAsaasWebhook(request, env);
    }
    if (path === '/api/webhooks/asaas' && method === 'POST') {
      return handleAsaasWebhook(request, env);
    }
    if (path === '/api/payments/santander-webhook' && method === 'POST') {
      return handleSantanderWebhook(request, env);
    }
    
    // Protected routes - verify JWT
    const user = await verifyJWT(request, env.JWT_SECRET);
    if (!user) {
      return jsonResponse({ success: false, error: 'Não autorizado' }, 401);
    }
    
    // ADMIN ROUTES - Verificar se é admin (MÁXIMA SEGURANÇA)
    const isAdmin = user?.email === 'luispaulodeoliveira@agrotm.com.br' || user?.email === 'luispaulo-de-oliveira@hotmail.com' || user?.role === 'admin';
    
    if (path.startsWith('/api/admin/')) {
      if (!isAdmin) {
        return jsonResponse({ success: false, error: 'Acesso negado - apenas administradores' }, 403);
      }
      
      // Admin - Listar todos os usuários
      if (path === '/api/admin/users' && method === 'GET') {
        return handleAdminListUsers(request, env);
      }
      
      // Admin - Ver detalhes de um usuário
      if (path.startsWith('/api/admin/users/') && method === 'GET') {
        const userId = path.split('/').pop();
        return handleAdminGetUser(request, env, userId);
      }
      
      // Admin - Editar usuário
      if (path.startsWith('/api/admin/users/') && method === 'PUT') {
        const userId = path.split('/').pop();
        return handleAdminUpdateUser(request, env, userId);
      }
      
      // Admin - Deletar usuário
      if (path.startsWith('/api/admin/users/') && method === 'DELETE') {
        const userId = path.split('/').pop();
        return handleAdminDeleteUser(request, env, userId);
      }
      
      // Admin - Bloquear CPF/CNPJ/IE/Email
      if (path === '/api/admin/block' && method === 'POST') {
        return handleAdminBlock(request, env);
      }
      
      // Admin - Listar bloqueios
      if (path === '/api/admin/blocks' && method === 'GET') {
        return handleAdminListBlocks(request, env);
      }
      
      // Admin - Remover bloqueio
      if (path.startsWith('/api/admin/blocks/') && method === 'DELETE') {
        const blockId = path.split('/').pop();
        return handleAdminUnblock(request, env, blockId);
      }
      
      // Admin - Stats
      if (path === '/api/admin/stats' && method === 'GET') {
        return handleAdminStats(request, env);
      }
      
      // Admin - Deletar produto
      if (path.startsWith('/api/admin/products/') && method === 'DELETE') {
        const productId = path.split('/').pop();
        return handleAdminDeleteProduct(request, env, productId);
      }
      
      // Admin - Deletar frete
      if (path.startsWith('/api/admin/freights/') && method === 'DELETE') {
        const freightId = path.split('/').pop();
        return handleAdminDeleteFreight(request, env, freightId);
      }
      
      // Admin - Listar todos os produtos
      if (path === '/api/admin/products' && method === 'GET') {
        return handleAdminListProducts(request, env);
      }
      
      // Admin - Listar todos os fretes
      if (path === '/api/admin/freights' && method === 'GET') {
        return handleAdminListFreights(request, env);
      }
    }
    
    // Protected - Products
    if (path === '/api/products' && method === 'POST') {
      return handleProductCreate(request, env, user);
    }
    
    // Protected - Freight
    if (path === '/api/freight' && method === 'POST') {
      return handleFreightCreate(request, env, user);
    }
    
    // Protected - Messages
  if (path === '/api/messages' && method === 'GET') {
    return handleMessagesList(request, env, user);
  }
  if (path === '/api/messages' && method === 'POST') {
    return handleMessageSend(request, env, user);
  }

    // Protected - Payments
  if (path === '/api/payments' && method === 'POST') {
    return handlePaymentCreate(request, env, user);
  }
    if (path === '/api/payments/create-checkout' && method === 'POST') {
      return handleCreateCheckout(request, env, user);
    }
    
    // Protected - User
    if (path === '/api/users/profile' && (method === 'GET' || method === 'PUT')) {
      return handleUserProfile(request, env, user);
    }
    // R2 upload info (authenticated)
    if (path === '/api/uploads/r2-info' && method === 'POST') {
      return handleR2UploadInfo(request, env, user);
    }
    if (path === '/api/user/profile' && (method === 'GET' || method === 'PUT')) {
      return handleUserProfile(request, env, user);
    }
    if (path === '/api/user/items' && method === 'GET') {
      return handleUserItems(request, env, user);
    }
    if (path === '/api/conversations' && method === 'GET') {
      return handleConversations(request, env, user);
    }
    // Tracking routes
    if (path === '/api/tracking/location' && method === 'POST') {
      return handleTrackingLocationUpdate(request, env, user);
    }
    if (path === '/api/tracking/status' && method === 'POST') {
      return handleTrackingStatusUpdate(request, env, user);
    }
    if (path.startsWith('/api/tracking/history/') && method === 'GET') {
      return handleTrackingHistory(request, env);
    }
    // AI Chat Private (authenticated)
    if (path === '/api/ai/chat/private' && method === 'POST') {
      return handleAIChatPrivate(request, env, user);
    }
    // Crypto routes
    if (path === '/api/crypto/wallet' && method === 'POST') {
      return handleCryptoWalletRegister(request, env, user);
    }
    if (path === '/api/crypto/buy' && method === 'POST') {
      return handleCryptoBuy(request, env, user);
    }
    if (path === '/api/crypto/sell' && method === 'POST') {
      return handleCryptoSell(request, env, user);
    }
    if (path === '/api/crypto/balances' && method === 'GET') {
      return handleCryptoBalances(request, env, user);
    }
    if (path === '/api/crypto/transactions' && method === 'GET') {
      return handleCryptoTransactions(request, env, user);
    }
    if (path === '/api/users/me' && method === 'GET') {
      return handleUserProfile(request, env, user);
    }
    if (path === '/api/users/plan' && method === 'GET') {
      return handleUserPlan(request, env, user);
    }
    
    // 404 - Route not found
    return jsonResponse({
      success: false,
      error: 'Rota não encontrada',
      path,
      method
    }, 404);
    
  } catch (error) {
    console.error('Request error:', error);
    return jsonResponse({
      success: false,
      error: 'Erro interno do servidor',
      message: error.message
    }, 500);
  }
}

// ============================================
// WORKER EXPORT
// ============================================

export default {
  async fetch(request, env) {
    return handleRequest(request, env);
  }
};
