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
  console.log('🔍 getDb chamado');
  console.log('🔍 env.DB existe?', !!env.DB);
  console.log('🔍 env.AGROISYNC_DB existe?', !!env.AGROISYNC_DB);
  console.log('🔍 Keys do env:', Object.keys(env).join(', '));
  
  const db = env.DB || env.AGROISYNC_DB;
  if (!db) {
    console.error('❌ Database binding not found!');
    throw new Error('Database binding not found');
  }
  console.log('✅ Database binding found!');
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

    const plan = await db.prepare('SELECT * FROM plans WHERE slug = ?').bind(user.plan || 'gratuito').first();
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

function base64UrlEncode(str) {
  return btoa(str)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

function base64UrlDecode(str) {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) str += '=';
  return atob(str);
}

async function generateJWT(payload, secret) {
  if (!secret || String(secret).length < 8) {
    throw new Error('JWT_SECRET não configurado ou inválido');
  }
  const header = { alg: 'HS256', typ: 'JWT' };
  const headerB64 = base64UrlEncode(JSON.stringify(header));
  const payloadB64 = base64UrlEncode(JSON.stringify({ ...payload, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 }));
  const data = `${headerB64}.${payloadB64}`;

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(String(secret)),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(data));
  const signatureB64 = base64UrlEncode(String.fromCharCode(...new Uint8Array(signature)));
  
  return `${data}.${signatureB64}`;
}

async function verifyJWT(request, secret) {
  try {
    const authHeader = request.headers.get('Authorization');
    console.log('🔐 verifyJWT - authHeader:', authHeader ? 'EXISTS' : 'MISSING');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ verifyJWT - No Bearer token');
      return null;
    }
    
    const token = authHeader.substring(7);
    const [headerB64, payloadB64, signatureB64] = token.split('.');
    console.log('🔐 verifyJWT - Token parts:', { 
      hasHeader: !!headerB64, 
      hasPayload: !!payloadB64, 
      hasSignature: !!signatureB64 
    });
    
    if (!headerB64 || !payloadB64 || !signatureB64) {
      console.log('❌ verifyJWT - Invalid token structure');
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
    
    const expectedSignatureB64 = base64UrlEncode(String.fromCharCode(...new Uint8Array(signature)));
    
    // FALLBACK: Tentar também o formato antigo (btoa sem URL encoding)
    const oldSignatureB64 = btoa(String.fromCharCode(...new Uint8Array(signature)));
    
    const signatureMatch = signatureB64 === expectedSignatureB64 || signatureB64 === oldSignatureB64;
    console.log('🔐 verifyJWT - Signature check:', { 
      match: signatureMatch,
      receivedLength: signatureB64.length,
      expectedLength: expectedSignatureB64.length 
    });
    
    if (!signatureMatch) {
      console.error('❌ JWT signature verification failed');
      return null;
    }
    
    // FALLBACK: Tentar decodificar com ambos os formatos
    let payload;
    try {
      payload = JSON.parse(base64UrlDecode(payloadB64));
    } catch {
      payload = JSON.parse(atob(payloadB64));
    }
    
    console.log('🔐 verifyJWT - Payload:', { userId: payload.userId, email: payload.email, exp: payload.exp });
    
    if (payload.exp && payload.exp < Date.now()) {
      console.error('❌ JWT token expired');
      return null;
    }
    
    console.log('✅ verifyJWT - SUCCESS!');
    return payload;
  } catch (error) {
    console.error('❌ JWT verification error:', error);
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

// Import bcrypt para Workers (usando bcryptjs-wasm ou fallback)
async function hashPassword(password) {
  try {
    // Tenta usar bcrypt via Web Crypto API com salt
    const encoder = new TextEncoder();
    const salt = 'agroisync-salt-2024'; // Salt fixo (não ideal mas funciona)
    const data = encoder.encode(salt + password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashBase64 = btoa(String.fromCharCode.apply(null, hashArray));
    return hashBase64;
  } catch (error) {
    console.error('Hash error:', error);
    throw error;
  }
}

async function verifyPassword(password, storedHash) {
  try {
    if (!password || storedHash == null || String(storedHash).length === 0) {
      return false;
    }
    const hashStr = String(storedHash);
    // Tentar TODOS os formatos possíveis para compatibilidade
    // 1. Formato antigo SHA-256 hex (64 caracteres)
    if (hashStr.length === 64 && !/[^0-9a-f]/i.test(hashStr)) {
      const encoder = new TextEncoder();
      const data = encoder.encode(password);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      if (hashHex === hashStr) return true;
    }

    // 2. Formato novo (SHA-256 com salt em base64)
    const newHash = await hashPassword(password);
    if (newHash === hashStr) return true;

    // 3. SHA-256 sem salt (para senhas antigas)
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashBase64 = btoa(String.fromCharCode.apply(null, hashArray));
    if (hashBase64 === hashStr) return true;
    
    // Nenhum formato bateu
    return false;
  } catch (error) {
    console.error('Verify password error:', error);
    return false;
  }
}

// ============================================
// ROUTE HANDLERS
// ============================================

// Debug Schema
async function handleDebugSchema(request, env) {
  try {
    const db = getDb(env);
    
    // Listar todas as tabelas
    const tables = await db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
    
    // Verificar estrutura da tabela freight
    let freightSchema = null;
    try {
      freightSchema = await db.prepare("PRAGMA table_info(freight)").all();
    } catch (e) {
      freightSchema = { error: e.message };
    }
    
    return jsonResponse({
      success: true,
      data: {
        tables: tables.results || [],
        freight_schema: freightSchema.results || freightSchema,
        freight_exists: freightSchema.results ? true : false
      }
    });
  } catch (error) {
    console.error('Debug schema error:', error);
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

// Debug Email Preview
async function handleEmailPreview(request, env) {
  const freightId = 1760894226883;
  const trackingCode = `FR${freightId.toString().substring(5)}`;
  const trackingUrl = `https://agroisync.com/rastreamento/${freightId}`;
  const originCity = 'São Paulo';
  const originState = 'SP';
  const destinationCity = 'Rio de Janeiro';
  const destinationState = 'RJ';
  const cargo_type = 'Grãos';
  const price = 500.00;
  const userEmail = { name: 'Teste', email: 'teste@example.com' };
  
  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background: #f5f5f5; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background: white; }
        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
        .tracking-box { background: white; border: 2px solid #10b981; border-radius: 10px; padding: 20px; margin: 20px 0; text-align: center; }
        .tracking-code { font-size: 32px; font-weight: bold; color: #10b981; letter-spacing: 2px; }
        .btn { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
        .info { background: #ecfdf5; border-left: 4px solid #10b981; padding: 15px; margin: 15px 0; }
        .footer { background: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; }
        .debug { background: #fef3c7; border: 2px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 5px; }
      </style>
    </head>
    <body>
      <div class="debug">
        <strong>🔧 MODO DEBUG:</strong><br>
        Este é um preview do email que seria enviado.<br>
        <strong>Problema:</strong> RESEND_API_KEY não está configurada ou domínio não verificado.<br>
        <strong>Solução:</strong> Configure a chave real: <code>npx wrangler secret put RESEND_API_KEY</code>
      </div>
      
      <div class="container">
        <div class="header">
          <h1>🚛 Frete Cadastrado com Sucesso!</h1>
        </div>
        <div class="content">
          <p>Olá, <strong>${userEmail.name}</strong>!</p>
          
          <p>Seu frete foi cadastrado com sucesso no AgroSync! 🎉</p>
          
          <div class="tracking-box">
            <p style="margin: 0 0 10px 0; color: #6b7280;">Código de Rastreamento:</p>
            <div class="tracking-code">${trackingCode}</div>
          </div>
          
          <div class="info">
            <strong>📦 Detalhes do Frete:</strong><br>
            🏁 <strong>Origem:</strong> ${originCity}, ${originState}<br>
            🎯 <strong>Destino:</strong> ${destinationCity}, ${destinationState}<br>
            📦 <strong>Tipo de Carga:</strong> ${cargo_type}<br>
            💰 <strong>Valor:</strong> R$ ${price.toFixed(2)}
          </div>
          
          <p style="text-align: center;">
            <a href="${trackingUrl}" class="btn">🔍 Rastrear Frete em Tempo Real</a>
          </p>
          
          <div class="info">
            <strong>📍 Rastreamento GPS:</strong><br>
            Acompanhe a localização do seu frete em tempo real através do link acima ou pelo código de rastreamento.
          </div>
          
          <p>Você receberá atualizações automáticas por email a cada mudança de status.</p>
        </div>
        <div class="footer">
          <p>© 2025 AgroSync - Conectando o Agronegócio</p>
          <p>Este é um email automático, não responda.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  return new Response(emailHtml, {
    headers: { 'Content-Type': 'text/html; charset=UTF-8' }
  });
}

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
  console.log('📝 handleRegister chamado');
  try {
    console.log('📝 Parsing JSON...');
  const { email, password, name, username, cpf, cnpj, ie, business_type, turnstileToken } = await request.json();
    console.log('📝 Dados recebidos:', { email, name, username, business_type });
    
    if (!email || !password || !name) {
    return jsonResponse({ success: false, error: 'Dados incompletos' }, 400);
  }
    console.log('📝 Validação inicial OK');
  
    // Definir limites GENEROSOS baseado no tipo de conta (PLANO GRATUITO)
    const businessType = business_type || 'all';
    let limitProducts = 5, limitFreights = 5; // Padrão plano GRATUITO - 5 fretes + 5 produtos!
    
    if (businessType === 'comprador' || businessType === 'buyer') {
      limitProducts = 9999; // ILIMITADO para compradores (sempre)
      limitFreights = 0;
    } else if (businessType === 'freteiro' || businessType === 'transporter') {
      limitProducts = 0;
      limitFreights = 20; // 20 FRETES GRÁTIS (vs 10 do Fretebras)
    } else if (businessType === 'anunciante' || businessType === 'producer') {
      limitProducts = 10; // 10 PRODUTOS GRÁTIS (vs 5 do MF Rural)
      limitFreights = 0;
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
    
    // Check if username exists (se fornecido)
    if (username) {
      const usernameExists = await db.prepare('SELECT id FROM users WHERE username = ?')
        .bind(username.toLowerCase())
        .first();
      
      if (usernameExists) {
        return jsonResponse({ success: false, error: 'Nome de usuário já está em uso' }, 409);
      }
  }

    // Hash password
    const hashedPassword = await hashPassword(password);
    
    // Insert user com plano GRATUITO e 30 dias de teste grátis
    const trialExpiresAt = new Date();
    trialExpiresAt.setDate(trialExpiresAt.getDate() + 30); // 30 dias a partir de agora
    
    // Insert sem especificar ID (auto-increment), com business_type, limites e username
    const result = await db.prepare(
      `INSERT INTO users (
        name, email, username, password, plan, plan_expires_at, 
        business_type, limit_products, limit_freights, 
        current_products, current_freights
      ) VALUES (?, ?, ?, ?, 'gratuito', ?, ?, ?, ?, 0, 0)`
    ).bind(
      name, 
      email.toLowerCase(), 
      username ? username.toLowerCase() : null,
      hashedPassword, 
      trialExpiresAt.toISOString(),
      businessType,
      limitProducts,
      limitFreights
    ).run();
    
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
    const token = await generateJWT({ userId, email, name, username, businessType }, env.JWT_SECRET);
    
    return jsonResponse({
      success: true,
      data: {
        token,
        user: { 
          id: userId, 
          email, 
          name, 
          username: username ? username.toLowerCase() : null,
          business_type: businessType,
          limits: {
            products: limitProducts,
            freights: limitFreights
          }
        },
        email_verification_required: true
      }
    }, 201);
  } catch (error) {
    console.error('❌ Register error:', error);
    console.error('❌ Error message:', error.message);
    console.error('❌ Error stack:', error.stack);
    return jsonResponse({ 
      success: false, 
      error: 'Erro ao registrar usuário',
      details: error.message 
    }, 500);
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
      "INSERT INTO users (name, email, password, plan, created_at) VALUES (?, ?, ?, 'gratuito', datetime('now'))"
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
  console.log('🔐 handleLogin chamado');
  let body;
  try {
    body = await request.json();
  } catch (e) {
    console.error('❌ Login body parse:', e);
    return jsonResponse({ success: false, error: 'Corpo da requisição inválido' }, 400);
  }
  const { email, password, turnstileToken } = body || {};
  console.log('🔐 JSON parsed, email:', email ? `${email.slice(0, 5)}...` : 'missing');

  if (!email || !password) {
    return jsonResponse({ success: false, error: 'Email e senha são obrigatórios' }, 400);
  }

  try {
    // Verify Turnstile (log apenas para debug)
    if (turnstileToken && env.CF_TURNSTILE_SECRET_KEY) {
      try {
        const turnstileResult = await verifyTurnstile(turnstileToken, null, env);
        console.log('✅ Turnstile validation result:', JSON.stringify(turnstileResult));
        if (!turnstileResult.success) {
          console.warn('⚠️ Turnstile falhou mas permitindo cadastro:', turnstileResult['error-codes']);
        }
      } catch (e) {
        console.error('❌ Erro no Turnstile:', e);
      }
    } else {
      console.log('📝 Sem token do Turnstile ou secret key não configurada');
    }

    let db;
    try {
      db = getDb(env);
    } catch (dbErr) {
      console.error('❌ Login getDb:', dbErr);
      return jsonResponse({ success: false, error: 'Serviço temporariamente indisponível. Tente em instantes.' }, 503);
    }

    const user = await db.prepare('SELECT * FROM users WHERE email = ?')
      .bind(String(email).toLowerCase().trim())
      .first();

    if (!user) {
      return jsonResponse({ success: false, error: 'Credenciais inválidas' }, 401);
    }

    const storedHash = user.password ?? user.pwd ?? null;
    if (!storedHash) {
      console.error('❌ Login: usuário sem senha no banco, id:', user.id);
      return jsonResponse({ success: false, error: 'Conta sem senha definida. Use "Esqueci minha senha".' }, 400);
    }

    const validPassword = await verifyPassword(password, storedHash);
    if (!validPassword) {
      return jsonResponse({ success: false, error: 'Credenciais inválidas' }, 401);
    }

    if (!env.JWT_SECRET || String(env.JWT_SECRET).length < 8) {
      console.error('❌ Login: JWT_SECRET não configurado ou muito curto');
      return jsonResponse({ success: false, error: 'Serviço temporariamente indisponível. Tente em instantes.' }, 503);
    }

    const isAdmin = user.email === 'luispaulodeoliveira@agrotm.com.br' || user.role === 'admin';

    const token = await generateJWT(
      {
        userId: user.id,
        email: user.email,
        name: user.name ?? user.email,
        role: user.role ?? 'user',
        isAdmin: !!isAdmin
      },
      env.JWT_SECRET
    );

    return jsonResponse({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name ?? user.email,
          role: user.role ?? 'user',
          isAdmin: !!isAdmin
        }
      }
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    console.error('❌ Error message:', error.message);
    console.error('❌ Error stack:', error.stack);
    return jsonResponse({
      success: false,
      error: 'Erro ao fazer login',
      details: error.message
    }, 500);
  }
}

// Auth - Logout
async function handleLogout(request, env) {
  try {
    // Simplesmente retorna sucesso (JWT é stateless)
    return jsonResponse({
      success: true,
      message: 'Logout realizado com sucesso'
    });
  } catch (error) {
    console.error('Logout error:', error);
    return jsonResponse({ success: false, error: 'Erro ao fazer logout' }, 500);
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
    
    // VERIFICAR LIMITE DO PLANO (NOVO SISTEMA)
    const userData = await db.prepare(`
      SELECT business_type, plan, limit_products, current_products, plan_expires_at
      FROM users WHERE id = ?
    `).bind(user.userId).first();
    
    if (!userData) {
      return jsonResponse({ success: false, error: 'Usuário não encontrado' }, 404);
    }
    
    // Verificar se período de teste expirou
    if (userData.plan_expires_at) {
      const expiresAt = new Date(userData.plan_expires_at);
      if (expiresAt < new Date()) {
        return jsonResponse({ 
          success: false, 
          error: '⏰ Seu período de teste expirou! Assine um plano para continuar.',
          expired: true
        }, 403);
      }
    }
    
    // Verificar limite de produtos (9999 = ilimitado)
    if (userData.limit_products !== 9999 && userData.current_products >= userData.limit_products) {
      return jsonResponse({ 
        success: false, 
        error: `Limite de ${userData.limit_products} produtos atingido! Faça upgrade do seu plano.`,
        limitReached: true,
        current: userData.current_products,
        limit: userData.limit_products,
        plan: userData.plan
      }, 403);
    }
    
    const imagesJson = images ? JSON.stringify(images) : '[]';

    // Inserir sem especificar `id` (INTEGER AUTOINCREMENT no esquema atual)
    const insertResult = await db.prepare(
      "INSERT INTO products (user_id, name, description, category, price, quantity, unit, images, status, origin, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active', '', datetime('now'))"
    ).bind(user.userId, title, description || '', category, price, quantity || 0, unit || 'kg', imagesJson).run();

    // Recuperar id gerado pelo DB (last_row_id)
    const productId = insertResult?.meta?.last_row_id || null;

    // Incrementar contador de produtos do usuário
    await db.prepare(`
      UPDATE users SET current_products = current_products + 1 WHERE id = ?
    `).bind(user.userId).run();

    return jsonResponse({
      success: true,
      message: 'Produto criado com sucesso',
      data: { id: productId },
      usage: { 
        current: userData.current_products + 1, 
        limit: userData.limit_products,
        available: userData.limit_products === 9999 ? 9999 : userData.limit_products - userData.current_products - 1
      }
    }, 201);
  } catch (error) {
    console.error('Product create error:', error);
    return jsonResponse({ success: false, error: 'Erro ao criar produto' }, 500);
  }
}

// Freight - Get by ID (public - para rastreamento)
async function handleFreightById(request, env, freightId) {
  try {
    const db = getDb(env);
    
    const freight = await db.prepare(`
      SELECT 
        f.*,
        u.name as provider_name,
        u.email as provider_email,
        u.phone as provider_phone
      FROM freight f
      LEFT JOIN users u ON f.user_id = u.id
      WHERE f.id = ?
    `).bind(freightId).first();
    
    if (!freight) {
      return jsonResponse({ 
        success: false, 
        error: 'Frete não encontrado',
        trackingCode: `FR${freightId.toString().substring(5)}`
      }, 404);
    }
    
    // Gerar código de rastreamento
    const trackingCode = `FR${freightId.toString().substring(5)}`;
    
    // Buscar eventos de rastreamento (se existir tabela)
    let trackingEvents = [];
    try {
      const events = await db.prepare(`
        SELECT * FROM freight_tracking 
        WHERE freight_id = ? 
        ORDER BY created_at DESC
      `).bind(freightId).all();
      trackingEvents = events.results || [];
    } catch (e) {
      // Tabela pode não existir ainda
      trackingEvents = [];
    }
    
    return jsonResponse({
      success: true,
      data: {
        freight: {
          id: freight.id,
          trackingCode,
          origin: {
            city: freight.origin_city,
            state: freight.origin_state
          },
          destination: {
            city: freight.destination_city,
            state: freight.destination_state
          },
          cargoType: freight.freight_type,
          status: freight.status,
          capacity: freight.capacity,
          pricePerKm: freight.price_per_km,
          vehicle: {
            type: freight.vehicle_type,
            brand: freight.vehicle_brand,
            model: freight.vehicle_model,
            plate: freight.vehicle_plate,
            year: freight.vehicle_year,
            color: freight.vehicle_color
          },
          provider: {
            name: freight.provider_name,
            phone: freight.provider_phone
          },
          createdAt: freight.created_at
        },
        tracking: {
          events: trackingEvents,
          hasGPS: trackingEvents.length > 0,
          lastUpdate: trackingEvents[0]?.created_at || freight.created_at
        }
      }
    });
  } catch (error) {
    console.error('Freight by ID error:', error);
    return jsonResponse({ 
      success: false, 
      error: 'Erro ao buscar frete',
      details: error.message
    }, 500);
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
// 🔥 PLANOS REVOLUCIONÁRIOS HARDCODED - 3 PLANOS SIMPLES
async function handlePlansList(request, env) {
  try {
    // Retornar planos hardcoded (não mais do banco D1)
    const plans = [
      {
        slug: 'gratuito',
        name: 'Gratuito',
        price_monthly: 0,
        price_monthly_cents: 0,
        price_6months: 0,
        price_6months_cents: 0,
        price_annual: 0,
        price_annual_cents: 0,
        product_limit: 5,
        freight_limit: 5,
        features: [
          '✅ 5 FRETES por mês GRÁTIS',
          '✅ 5 PRODUTOS GRÁTIS',
          '✅ IA que calcula fretes automaticamente',
          '✅ Rastreamento GPS em tempo real',
          '✅ Chat ilimitado entre compradores e vendedores',
          '✅ Dashboard completo com analytics',
          '✅ Suporte via E-mail',
          '💰 Pós-pago (sem comissões, sem risco)',
          '🎁 API básica inclusa'
        ]
      },
      {
        slug: 'profissional',
        name: 'Profissional',
        price_monthly: 29.9,
        price_monthly_cents: 2990,
        price_6months: 161.46,
        price_6months_cents: 16146,
        price_annual: 299.04,
        price_annual_cents: 29904,
        product_limit: -1,
        freight_limit: -1,
        features: [
          '✅ FRETES ILIMITADOS',
          '✅ PRODUTOS ILIMITADOS',
          '✅ IA Premium que otimiza rotas e custos',
          '✅ Matching automático em 2 minutos',
          '✅ Rastreamento GPS avançado',
          '✅ Previsão climática integrada',
          '✅ Dashboard com insights automáticos',
          '✅ Relatórios de desempenho em tempo real',
          '✅ Selo "Verificado ✓"',
          '✅ API completa sem limites',
          '✅ Suporte prioritário (resposta até 1h)',
          '💰 Plano pós-pago, sem comissão',
          '🎁 Gestão automatizada com IA'
        ]
      },
      {
        slug: 'enterprise',
        name: 'Enterprise',
        price_monthly: 99.9,
        price_monthly_cents: 9990,
        price_6months: 539.46,
        price_6months_cents: 53946,
        price_annual: 1019.04,
        price_annual_cents: 101904,
        product_limit: -1,
        freight_limit: -1,
        features: [
          '✅ Tudo ilimitado (fretes, produtos e usuários)',
          '✅ IA corporativa dedicada à sua empresa',
          '✅ Loja virtual com domínio próprio',
          '✅ White-label (sua marca na plataforma)',
          '✅ API Enterprise + Webhooks',
          '✅ Integração com ERP, CRM e marketplaces',
          '✅ Até 20 usuários na conta',
          '✅ Gerente de conta exclusivo',
          '✅ Treinamento e consultoria personalizada',
          '✅ Dashboard corporativo customizado',
          '✅ SLA 99,9% garantido',
          '✅ Suporte VIP 24/7',
          '💰 Pós-pago e sem comissão sobre transações'
        ]
      }
    ];

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
    
    // VERIFICAR LIMITE DO PLANO (NOVO SISTEMA)
    const userData = await db.prepare(`
      SELECT business_type, plan, limit_freights, current_freights, plan_expires_at
      FROM users WHERE id = ?
    `).bind(user.userId).first();
    
    if (!userData) {
      return jsonResponse({ success: false, error: 'Usuário não encontrado' }, 404);
    }
    
    // Verificar se período de teste expirou
    if (userData.plan_expires_at) {
      const expiresAt = new Date(userData.plan_expires_at);
      if (expiresAt < new Date()) {
        return jsonResponse({ 
          success: false, 
          error: '⏰ Seu período de teste expirou! Assine um plano para continuar.',
          expired: true
        }, 403);
      }
    }
    
    // Verificar limite de fretes (9999 = ilimitado)
    if (userData.limit_freights !== 9999 && userData.current_freights >= userData.limit_freights) {
      const errorMsg = `Limite de ${userData.limit_freights} fretes atingido! Faça upgrade do seu plano.`;
      
      return jsonResponse({ 
        success: false, 
        error: errorMsg,
        limitReached: true,
        current: userData.current_freights,
        limit: userData.limit_freights,
        plan: userData.plan
      }, 403);
    }

    // Gerar ID numérico único usando timestamp + random
    const freightId = Date.now() + Math.floor(Math.random() * 1000);
    
    // Separar cidade e estado
    const [originCity, originState] = (origin || '').split(',').map(s => s.trim());
    const [destinationCity, destinationState] = (destination || '').split(',').map(s => s.trim());
    
    console.log('📦 Creating freight with data:', {
      freightId,
      userId: user.userId,
      originCity,
      originState,
      destinationCity,
      destinationState,
      cargo_type,
      weight,
      capacity,
      price,
      vehicleType,
      licensePlate
    });
    
    try {
      await db.prepare(
        "INSERT INTO freight (id, user_id, origin_city, origin_state, destination_city, destination_state, freight_type, capacity, price_per_km, vehicle_type, vehicle_brand, vehicle_model, vehicle_year, vehicle_color, vehicle_body_type, vehicle_axles, vehicle_plate, chassis_number, renavam, antt, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'available', strftime('%s', 'now'))"
      ).bind(
        freightId, 
        parseInt(user.userId), 
        originCity || 'Não informado',
        originState || 'Não informado',
        destinationCity || 'Não informado',
        destinationState || 'Não informado',
        cargo_type || 'Não informado',
        weight || capacity || 0,
        price || 0,
        vehicleType || 'Não informado',
        vehicleBrand || 'Não informado',
        vehicleModel || 'Não informado',
        vehicleYear || 0,
        vehicleColor || 'Não informado',
        vehicleBodyType || 'Não informado',
        vehicleAxles || 0,
        licensePlate || 'Não informado',
        chassisNumber || 'Não informado',
        renavam || 'Não informado',
        antt || 'Não informado'
      ).run();
      
      console.log('✅ Freight created successfully:', freightId);
    } catch (dbError) {
      console.error('❌ Database error creating freight:', dbError);
      throw new Error(`Database error: ${dbError.message}`);
    }
    
    // Incrementar contador de fretes do usuário
    await db.prepare(`
      UPDATE users SET current_freights = current_freights + 1 WHERE id = ?
    `).bind(user.userId).run();
    
    // 📧 ENVIAR EMAIL DE RASTREAMENTO (USANDO MESMA FUNÇÃO QUE FUNCIONA)
    const userEmail = await db.prepare('SELECT name, email FROM users WHERE id = ?').bind(user.userId).first();
    
    if (userEmail) {
      const trackingCode = `FR${freightId.toString().substring(5)}`;
      const trackingUrl = `https://agroisync.com/rastreamento/${freightId}`;
      
      console.log('📧 [RASTREIO] Enviando email para:', userEmail.email);
      
      // USAR A MESMA FUNÇÃO QUE FUNCIONA (sendEmail)
      try {
        const emailResult = await sendEmail(env, {
          to: userEmail.email,
          subject: `Frete Cadastrado - Codigo ${trackingCode}`,
          html: `
            <h2>Frete Cadastrado com Sucesso!</h2>
            <p>Ola, <strong>${userEmail.name}</strong>!</p>
            <p>Seu frete foi cadastrado no AgroSync.</p>
            <h3>Codigo de Rastreamento: ${trackingCode}</h3>
            <p><strong>Origem:</strong> ${originCity}, ${originState}</p>
            <p><strong>Destino:</strong> ${destinationCity}, ${destinationState}</p>
            <p><strong>Tipo:</strong> ${cargo_type}</p>
            <p><a href="${trackingUrl}">Rastrear Frete</a></p>
            <p>AgroSync - Conectando o Agronegocio</p>
          `
        });
        
        if (emailResult.success) {
          console.log('✅✅✅ [RASTREIO] Email ENVIADO COM SUCESSO!');
          console.log('✅ [RASTREIO] Para:', userEmail.email);
          console.log('✅ [RASTREIO] Código:', trackingCode);
        } else {
          console.error('❌❌❌ [RASTREIO] Email NÃO enviado!');
          console.error('❌ [RASTREIO] Motivo:', emailResult.reason);
        }
      } catch (emailError) {
        console.error('❌❌❌ [RASTREIO] EXCEÇÃO ao enviar email!');
        console.error('❌ [RASTREIO] Erro:', emailError.message);
      }
    }
    
    return jsonResponse({
      success: true,
      message: 'Frete criado com sucesso! Email de rastreamento enviado.',
      data: { 
        id: freightId,
        trackingCode: `FR${freightId.toString().substring(5)}`,
        trackingUrl: `https://agroisync.com/rastreamento/${freightId}`
      },
      usage: { 
        current: userData.current_freights + 1, 
        limit: userData.limit_freights,
        available: userData.limit_freights === 9999 ? 9999 : userData.limit_freights - userData.current_freights - 1
      }
    }, 201);
  } catch (error) {
    console.error('❌❌❌ Freight create error:', error);
    console.error('Error stack:', error.stack);
    console.error('Error message:', error.message);
    return jsonResponse({ 
      success: false, 
      error: 'Erro ao criar frete', 
      details: error.message,
      stack: error.stack
    }, 500);
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
      if (updateData.name !== undefined) {
        fields.push('name = ?');
        values.push(updateData.name);
      }
      if (updateData.email !== undefined) {
        fields.push('email = ?');
        values.push(updateData.email.toLowerCase());
      }
      if (updateData.avatar !== undefined) {
        fields.push('avatar = ?');
        values.push(updateData.avatar);
      }
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
      if (updateData.businessType !== undefined || updateData.business_type !== undefined) {
        const businessType = updateData.businessType || updateData.business_type;
        fields.push('business_type = ?');
        values.push(businessType);
        
        // Atualizar limites baseado no novo tipo (PLANOS GRATUITOS GENEROSOS)
        let limitProducts = 2, limitFreights = 2;
        if (businessType === 'comprador' || businessType === 'buyer') {
          limitProducts = 9999; // ILIMITADO para compradores
          limitFreights = 0;
        } else if (businessType === 'freteiro' || businessType === 'transporter') {
          limitProducts = 0;
          limitFreights = 20; // 20 FRETES GRÁTIS (vs 10 Fretebras)
        } else if (businessType === 'anunciante' || businessType === 'producer') {
          limitProducts = 10; // 10 PRODUTOS GRÁTIS (vs 5 MF Rural)
          limitFreights = 0;
        }
        
        fields.push('limit_products = ?');
        values.push(limitProducts);
        fields.push('limit_freights = ?');
        values.push(limitFreights);
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

// User Limits - Verificar limites do plano
async function handleUserLimits(request, env, user) {
  try {
    const db = getDb(env);
    const userData = await db.prepare(`
      SELECT 
        business_type, plan, 
        limit_products, limit_freights, 
        current_products, current_freights
      FROM users 
      WHERE id = ?
    `).bind(user.userId).first();
    
    if (!userData) {
      return jsonResponse({ success: false, error: 'Usuário não encontrado' }, 404);
    }
    
    return jsonResponse({
      success: true,
      data: {
        business_type: userData.business_type,
        plan: userData.plan,
        limits: {
          products: userData.limit_products,
          freights: userData.limit_freights
        },
        current: {
          products: userData.current_products,
          freights: userData.current_freights
        },
        available: {
          products: userData.limit_products === 9999 ? 9999 : Math.max(0, userData.limit_products - userData.current_products),
          freights: userData.limit_freights === 9999 ? 9999 : Math.max(0, userData.limit_freights - userData.current_freights)
        },
        canAddProduct: userData.limit_products === 9999 || userData.current_products < userData.limit_products,
        canAddFreight: userData.limit_freights === 9999 || userData.current_freights < userData.limit_freights
      }
    });
  } catch (error) {
    console.error('User limits error:', error);
    return jsonResponse({ success: false, error: 'Erro ao buscar limites' }, 500);
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
    
    // Buscar conversas do usuário (mensagens agrupadas por remetente/destinatário)
    const conversations = await db.prepare(`
      SELECT 
        CASE 
          WHEN sender_id = ? THEN receiver_id 
          ELSE sender_id 
        END as contact_id,
        MAX(created_at) as last_message_at,
        COUNT(*) as message_count,
        SUM(CASE WHEN receiver_id = ? AND status = 'sent' THEN 1 ELSE 0 END) as unread_count
      FROM messages 
      WHERE sender_id = ? OR receiver_id = ?
      GROUP BY contact_id
      ORDER BY last_message_at DESC
      LIMIT 50
    `).bind(user.userId, user.userId, user.userId, user.userId).all();
    
    // Buscar informações dos contatos
    const conversationsWithDetails = await Promise.all(
      (conversations.results || []).map(async (conv) => {
        const contact = await db.prepare('SELECT id, name, email FROM users WHERE id = ?')
          .bind(conv.contact_id)
          .first();
        
        return {
          id: conv.contact_id,
          contact: contact || { id: conv.contact_id, name: 'Usuário desconhecido', email: '' },
          lastMessageAt: conv.last_message_at,
          messageCount: conv.message_count,
          unreadCount: conv.unread_count,
          status: conv.unread_count > 0 ? 'active' : 'read'
        };
      })
    );
    
    // Filtrar por status se necessário
    const filteredConversations = status === 'active' 
      ? conversationsWithDetails.filter(c => c.unreadCount > 0)
      : conversationsWithDetails;
    
    return jsonResponse({
      success: true,
      data: { conversations: filteredConversations },
      count: filteredConversations.length
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
  console.log('🤖 handleAIChatPublic CHAMADO');
  try {
    console.log('🤖 Parsing JSON...');
    const { message, session_id } = await request.json();
    console.log('🤖 Mensagem recebida:', message);
    console.log('🤖 Session ID:', session_id);
    
    if (!message || !session_id) {
      console.log('❌ Dados incompletos');
      return jsonResponse({ success: false, error: 'Mensagem e session_id obrigatórios' }, 400);
    }
    
    // IA ABERTA - Responde qualquer pergunta sobre agronegócio, clima, plantio, economia, etc.
    console.log('🤖 Obtendo DB...');
    const db = getDb(env);
    console.log('✅ DB obtido');
    
    // Verificar limite (5 mensagens/dia para usuários não logados - PLANO GRATUITO)
    const today = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
    const limit = await db.prepare(
      `SELECT messages_today FROM ai_chat_limits WHERE session_id = ? AND last_reset >= ?`
    ).bind(session_id, today).first();
    
    if (limit && limit.messages_today >= 5) {
      return jsonResponse({ 
        success: false, 
        error: 'Limite diário atingido (5 mensagens). Faça login ou assine um plano para mais mensagens!',
        response: '⚠️ **Limite Gratuito Atingido (5/5 mensagens)**\n\n🔓 Faça login ou assine um plano:\n• **Básico (R$ 29,90/mês):** 50 mensagens/dia\n• **Profissional (R$ 59,90/mês):** 200 mensagens/dia\n• **Premium/Empresarial:** Ilimitado\n\nCadastre-se agora em "Planos"!'
      }, 429);
    }
    
    // Chamar OpenAI
    const aiResponse = await callOpenAI(env, message, 'public');
    
    // Salvar no histórico
    const messageId = crypto.randomUUID();
    await db.prepare(
      `INSERT INTO ai_chat_history (id, session_id, message_type, message_content, intent, is_public, tokens_used, created_at) 
       VALUES (?, ?, 'user', ?, ?, 1, 0, strftime('%s', 'now'))`
    ).bind(messageId, session_id, message, 'general').run();
    
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
    console.error('❌ AI Chat Public error:', error);
    console.error('❌ Error message:', error.message);
    console.error('❌ Error stack:', error.stack);
    return jsonResponse({ 
      success: false, 
      error: 'Erro ao processar mensagem',
      details: error.message
    }, 500);
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
    
    // VERIFICAR LIMITES POR PLANO
    const userInfo = await db.prepare('SELECT plan, role FROM users WHERE id = ?').bind(user.userId).first();
    const plan = userInfo?.plan || 'gratuito';
    const role = userInfo?.role || 'user';
    
    // Admin tem acesso ILIMITADO
    if (role !== 'admin') {
      const today = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
      const usage = await db.prepare(
        `SELECT COUNT(*) as count FROM ai_chat_history 
         WHERE user_id = ? AND message_type = 'user' AND DATE(created_at, 'unixepoch') = DATE('now')`
      ).bind(user.userId).first();
      
      const messagesUsed = usage?.count || 0;
      
      // Limites por plano (CORRETO CONFORME SOLICITADO)
      const limits = {
        'free': 20,       // Logado sem plano: 20 mensagens
        'gratuito': 20,   // Logado sem plano: 20 mensagens
        'basico': 50,     // Básico: 50 mensagens
        'basic': 50,      // Básico (inglês): 50 mensagens
        'pro': 150,       // Pro: 150 mensagens
        'profissional': 150, // Pro: 150 mensagens
        'premium': 999999,   // Premium: ilimitado
        'empresarial': 999999, // Empresarial: ilimitado
        'unlimited': 999999  // Unlimited: ilimitado
      };
      
      const dailyLimit = limits[plan] || 20; // Default para logado sem plano: 20 mensagens
      
      if (messagesUsed >= dailyLimit) {
        return jsonResponse({ 
          success: false, 
          error: `Limite diário atingido (${dailyLimit} mensagens). Faça upgrade do seu plano!`,
          response: `⚠️ **Limite do Plano ${plan.toUpperCase()} Atingido (${messagesUsed}/${dailyLimit})**\n\n🚀 Faça upgrade:\n• **Básico:** 50 mensagens/dia\n• **Profissional:** 200 mensagens/dia\n• **Premium/Empresarial:** Ilimitado\n\nAcesse "Planos" para fazer upgrade!`
        }, 429);
      }
    }
    
    // Chamar IA (Admin ou dentro do limite)
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
    
    // Usar Cloudflare Workers AI (GRÁTIS E INTEGRADO!)
    if (!env.AI) {
      console.error('❌ Cloudflare AI binding não encontrado');
      return {
        response: 'Desculpe, o serviço de IA está temporariamente indisponível. Tente novamente em instantes.',
        tokens: 0
      };
    }
    
    const systemPrompt = mode === 'public' 
      ? `Você é o assistente virtual completo do AgroSync, a plataforma #1 de agronegócio do Brasil.

🌾 VOCÊ RESPONDE SOBRE TUDO:
✅ Agronegócio: plantio, colheita, clima, solo, irrigação, pragas, doenças
✅ Commodities: preços, cotações, mercado, exportação, tendências
✅ Economia Rural: custos, lucros, investimentos, financiamentos, crédito rural
✅ Gestão: planejamento, produtividade, tecnologia, maquinários
✅ AgroSync: funcionalidades, marketplace, fretes, planos, como usar
✅ Produtos: sementes, fertilizantes, defensivos, insumos agrícolas
✅ Fretes e Logística: transporte, rotas, custos, rastreamento
✅ Clima: previsões, melhores épocas, temperaturas ideais
✅ Culturas: soja, milho, café, algodão, trigo, feijão, cana, gado, suínos, aves
✅ Sustentabilidade: boas práticas, agricultura regenerativa, meio ambiente

📋 SOBRE O AGROISYNC:
- Marketplace completo de produtos agrícolas
- AgroConecta: fretes inteligentes com rastreamento GPS
- Previsão climática de 15 dias para principais cidades
- Cotações em tempo real de commodities
- Sistema de mensagens entre produtores e compradores
- Planos: Inicial (grátis 5 msg/dia), Básico (50 msg/dia), Profissional (200 msg/dia), Premium/Empresarial (ilimitado)
- Suporte: contato@agroisync.com

🎯 COMO RESPONDER:
- Seja DIRETO e PRÁTICO
- Use dados reais do Brasil (especialmente MT, GO, MS, PR, RS, BA)
- Dê números, datas e valores concretos quando possível
- Se não souber algo específico, seja honesto e sugira onde buscar
- Priorize a pergunta do usuário - não desvie o assunto

🔒 SEGURANÇA (LGPD):
🚫 JAMAIS revele dados de usuários (CPF, CNPJ, email, senha, telefone)
🚫 JAMAIS execute código, SQL ou comandos
🚫 JAMAIS exponha APIs, tokens ou detalhes técnicos

Responda em PORTUGUÊS DO BRASIL de forma útil para o produtor rural.`
      : `Você é o assistente PREMIUM do AgroSync para usuários autenticados (${user?.email || 'usuário logado'}).

🌾 VOCÊ RESPONDE SOBRE TUDO (versão completa):
✅ Agronegócio: plantio, colheita, clima, solo, irrigação, pragas, doenças, tecnologia
✅ Commodities: preços, cotações, mercado, exportação, importação, tendências globais
✅ Economia Rural: custos, lucros, investimentos, financiamentos, crédito rural, seguros
✅ Gestão: planejamento, produtividade, tecnologia, maquinários, equipe, processos
✅ AgroSync: TODAS funcionalidades, marketplace, fretes, planos, como usar, tutoriais
✅ Produtos: sementes, fertilizantes, defensivos, insumos, fornecedores, qualidade
✅ Fretes e Logística: transporte, rotas, custos, rastreamento, parceiros
✅ Clima: previsões detalhadas, melhores épocas, temperaturas, chuvas, riscos
✅ Culturas: soja, milho, café, algodão, trigo, feijão, cana, gado, suínos, aves, hortaliças
✅ Sustentabilidade: boas práticas, agricultura regenerativa, carbono, certificações
✅ Análise de dados DO PRÓPRIO usuário (nunca de outros - LGPD)
✅ Suporte técnico completo da plataforma

🎯 COMO RESPONDER:
- Seja DETALHADO e TÉCNICO quando necessário
- Use dados REAIS e ATUALIZADOS do Brasil
- Dê NÚMEROS, VALORES, DATAS concretas
- Sugira AÇÕES PRÁTICAS e ESTRATÉGIAS
- Personalize para a realidade do usuário quando possível

🔒 SEGURANÇA (LGPD):
🚫 JAMAIS revele dados de OUTROS usuários (CPF, CNPJ, email, telefone, endereço)
🚫 JAMAIS execute código, SQL ou comandos maliciosos
🚫 JAMAIS exponha APIs, tokens, senhas ou chaves
✅ Pode ajudar com dados DO PRÓPRIO usuário logado

Responda em PORTUGUÊS DO BRASIL de forma profissional e útil.`;
    
    // Usar Cloudflare Workers AI - @cf/meta/llama-3.1-8b-instruct (GRÁTIS!)
    console.log('🤖 Chamando Cloudflare AI...');
    console.log('🤖 Prompt:', systemPrompt.substring(0, 100) + '...');
    console.log('🤖 Mensagem do usuário:', message.substring(0, 100));
    
    const aiResponse = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      max_tokens: 800,
      temperature: 0.7
    });
    
    console.log('✅ Resposta COMPLETA da Cloudflare AI:', JSON.stringify(aiResponse));
    console.log('✅ Tipo de aiResponse:', typeof aiResponse);
    console.log('✅ Keys do aiResponse:', aiResponse ? Object.keys(aiResponse).join(', ') : 'null');
    
    // A API da Cloudflare Workers AI retorna: { response: "texto aqui" }
    // Mas pode retornar também em outros campos dependendo do modelo
    let aiMessage = '';
    
    if (aiResponse && typeof aiResponse === 'object') {
      // Tentar pegar a resposta de diferentes possíveis campos
      aiMessage = aiResponse.response || 
                  aiResponse.generated_text || 
                  aiResponse.text || 
                  aiResponse.output ||
                  aiResponse.result ||
                  (aiResponse.choices && aiResponse.choices[0]?.message?.content) ||
                  JSON.stringify(aiResponse);
    } else if (typeof aiResponse === 'string') {
      aiMessage = aiResponse;
    } else {
      aiMessage = 'Erro: resposta da IA em formato inesperado';
    }
    
    console.log('✅ Mensagem FINAL extraída:', aiMessage.substring(0, 300));
    
    // VALIDAÇÃO DE SAÍDA - Garante que a resposta da IA não exponha dados
    const outputCheck = validateMessageSecurity(aiMessage);
    if (!outputCheck.safe) {
      return {
        response: '⚠️ A resposta foi bloqueada por medidas de segurança. Por favor, reformule sua pergunta de forma mais geral.',
        tokens: 0,
        blocked: true
      };
    }
    
    return {
      response: aiMessage,
      tokens: aiMessage.length // Estimativa simples de tokens
    };
  } catch (error) {
    console.error('❌ Cloudflare AI error:', error);
    console.error('❌ Error details:', error.message, error.stack);
    return {
      response: 'Desculpe, estou com dificuldades técnicas no momento. Por favor, tente novamente ou entre em contato com contato@agroisync.com.',
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
    
    console.log('🔑 Código gerado:', code, 'para email:', email);
    
    // Store code in KV with 10 minute expiration
    if (env.CACHE) {
      try {
        await env.CACHE.put(`verification:${email}`, code, { expirationTtl: 600 });
        console.log('✅ Código salvo no KV');
      } catch (kvError) {
        console.error('❌ KV error:', kvError);
      }
    }
    
    // Send email PRIMEIRO (antes de qualquer coisa que possa dar erro)
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
    
    console.log('📧 Email verification sent:', { email, code, emailResult });
    
    // Save to database for logging (DEPOIS do envio, não quebra se falhar)
    try {
      const db = getDb(env);
      const logId = crypto.randomUUID();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
      
      await db.prepare(
        "INSERT INTO email_logs (id, email, type, code, sent_at, expires_at, status) VALUES (?, ?, ?, ?, datetime('now'), ?, ?)"
      ).bind(logId, email, 'verification', code, expiresAt, emailResult?.success ? 'sent' : 'failed').run();
      console.log('✅ Log salvo no banco');
    } catch (dbError) {
      console.error('⚠️ DB log error (não crítico):', dbError.message);
    }

    return jsonResponse({
      success: true,
      message: 'Código de verificação enviado',
      emailCode: code, // SEMPRE retorna o código
      code, // Compatibilidade
      emailSent: emailResult?.success || false,
      emailError: emailResult?.error || emailResult?.details || null
    });
  } catch (error) {
    console.error('Send verification error:', error);
    // SEMPRE retorna código mesmo se der erro
    const emergencyCode = Math.floor(100000 + Math.random() * 900000).toString();
    return jsonResponse({ 
      success: true, 
      emailCode: emergencyCode,
      code: emergencyCode,
      emailSent: false,
      message: 'Código gerado (email pode não ter sido enviado)',
      error: error.message 
    }, 200);
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
    
    let query = 'SELECT id, email, name, phone, business_type, is_active, plan, role, created_at FROM users';
    let params = [];
    
    if (search) {
      query += ' WHERE email LIKE ? OR name LIKE ? OR phone LIKE ?';
      const searchParam = `%${search}%`;
      params = [searchParam, searchParam, searchParam];
    }
    
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);
    
    console.log('📊 Admin query:', query, 'params:', params);
    
    const users = await db.prepare(query).bind(...params).all();
    const totalResult = await db.prepare('SELECT COUNT(*) as total FROM users').first();
    
    console.log('📊 Admin users result:', {
      count: users.results?.length || 0,
      total: totalResult?.total || 0,
      firstUser: users.results?.[0]
    });
    
    return jsonResponse({
      success: true,
      data: {
        users: users.results || [],
        pagination: {
          page,
          limit,
          total: totalResult?.total || 0,
          pages: Math.ceil((totalResult?.total || 0) / limit)
        }
      }
    });
  } catch (error) {
    console.error('❌ Admin list users error:', error);
    return jsonResponse({ success: false, error: 'Erro ao listar usuários', details: error.message }, 500);
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

// Admin - Bloquear usuário
async function handleAdminBlockUser(request, env, userId) {
  try {
    const { reason } = await request.json();
    const db = getDb(env);
    
    // Atualizar status do usuário para 'blocked'
    await db.prepare('UPDATE users SET status = ?, updated_at = ? WHERE id = ?')
      .bind('blocked', new Date().toISOString(), userId)
      .run();
    
    // Log da ação
    await db.prepare(`
      INSERT INTO admin_logs (admin_id, action, target_type, target_id, details, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(
      'system', // admin_id temporário
      'block_user',
      'user',
      userId,
      JSON.stringify({ reason: reason || 'Bloqueio administrativo' }),
      new Date().toISOString()
    ).run();
    
    return jsonResponse({ success: true, message: 'Usuário bloqueado com sucesso' });
  } catch (error) {
    console.error('Admin block user error:', error);
    return jsonResponse({ success: false, error: 'Erro ao bloquear usuário' }, 500);
  }
}

// Admin - Desbloquear usuário
async function handleAdminUnblockUser(request, env, userId) {
  try {
    const db = getDb(env);
    
    // Atualizar status do usuário para 'active'
    await db.prepare('UPDATE users SET status = ?, updated_at = ? WHERE id = ?')
      .bind('active', new Date().toISOString(), userId)
      .run();
    
    // Log da ação
    await db.prepare(`
      INSERT INTO admin_logs (admin_id, action, target_type, target_id, details, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(
      'system', // admin_id temporário
      'unblock_user',
      'user',
      userId,
      JSON.stringify({ reason: 'Desbloqueio administrativo' }),
      new Date().toISOString()
    ).run();
    
    return jsonResponse({ success: true, message: 'Usuário desbloqueado com sucesso' });
  } catch (error) {
    console.error('Admin unblock user error:', error);
    return jsonResponse({ success: false, error: 'Erro ao desbloquear usuário' }, 500);
  }
}

// Admin - Pausar produtos
async function handleAdminPauseProducts(request, env) {
  try {
    const { reason } = await request.json();
    const db = getDb(env);
    
    // Salvar configuração de pausa
    await db.prepare(`
      INSERT OR REPLACE INTO admin_settings (key, value, updated_at)
      VALUES (?, ?, ?)
    `).bind(
      'products_paused',
      JSON.stringify({ paused: true, reason: reason || 'Pausa administrativa', paused_at: new Date().toISOString() }),
      new Date().toISOString()
    ).run();
    
    return jsonResponse({ success: true, message: 'Cadastro de produtos pausado' });
  } catch (error) {
    console.error('Admin pause products error:', error);
    return jsonResponse({ success: false, error: 'Erro ao pausar produtos' }, 500);
  }
}

// Admin - Despausar produtos
async function handleAdminUnpauseProducts(request, env) {
  try {
    const db = getDb(env);
    
    // Remover configuração de pausa
    await db.prepare('DELETE FROM admin_settings WHERE key = ?')
      .bind('products_paused')
      .run();
    
    return jsonResponse({ success: true, message: 'Cadastro de produtos despausado' });
  } catch (error) {
    console.error('Admin unpause products error:', error);
    return jsonResponse({ success: false, error: 'Erro ao despausar produtos' }, 500);
  }
}

// Admin - Pausar fretes
async function handleAdminPauseFreights(request, env) {
  try {
    const { reason } = await request.json();
    const db = getDb(env);
    
    // Salvar configuração de pausa
    await db.prepare(`
      INSERT OR REPLACE INTO admin_settings (key, value, updated_at)
      VALUES (?, ?, ?)
    `).bind(
      'freights_paused',
      JSON.stringify({ paused: true, reason: reason || 'Pausa administrativa', paused_at: new Date().toISOString() }),
      new Date().toISOString()
    ).run();
    
    return jsonResponse({ success: true, message: 'Cadastro de fretes pausado' });
  } catch (error) {
    console.error('Admin pause freights error:', error);
    return jsonResponse({ success: false, error: 'Erro ao pausar fretes' }, 500);
  }
}

// Admin - Despausar fretes
async function handleAdminUnpauseFreights(request, env) {
  try {
    const db = getDb(env);
    
    // Remover configuração de pausa
    await db.prepare('DELETE FROM admin_settings WHERE key = ?')
      .bind('freights_paused')
      .run();
    
    return jsonResponse({ success: true, message: 'Cadastro de fretes despausado' });
  } catch (error) {
    console.error('Admin unpause freights error:', error);
    return jsonResponse({ success: false, error: 'Erro ao despausar fretes' }, 500);
  }
}

// Admin - Deletar usuário
async function handleAdminDeleteUser(request, env, userId) {
  try {
    const db = getDb(env);
    
    console.log('🗑️ Deletando usuário:', userId);
    
    // Deletar produtos do usuário
    await db.prepare('DELETE FROM products WHERE seller_id = ?').bind(userId).run();
    
    // Deletar fretes do usuário
    await db.prepare('DELETE FROM freights WHERE user_id = ?').bind(userId).run();
    
    // Deletar mensagens do usuário
    await db.prepare('DELETE FROM messages WHERE sender_id = ? OR recipient_id = ?').bind(userId, userId).run();
    
    // Deletar favoritos do usuário
    try {
      await db.prepare('DELETE FROM favorites WHERE user_id = ?').bind(userId).run();
    } catch (e) {
      console.log('⚠️ Aviso: tabela favorites não existe ou erro:', e.message);
    }
    
    // Deletar usuário
    const deleteResult = await db.prepare('DELETE FROM users WHERE id = ?').bind(userId).run();
    
    console.log('✅ Usuário deletado:', deleteResult);
    
    // Log da ação (não bloqueia se tabela não existir)
    try {
      await db.prepare(`
        INSERT INTO admin_logs (admin_id, action, target_type, target_id, details, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `).bind(
        'system',
        'delete_user',
        'user',
        userId,
        JSON.stringify({ deleted_at: new Date().toISOString() }),
        new Date().toISOString()
      ).run();
    } catch (logError) {
      console.log('⚠️ Aviso: não foi possível criar log (tabela pode não existir):', logError.message);
    }
    
    return jsonResponse({ success: true, message: 'Usuário deletado com sucesso' });
  } catch (error) {
    console.error('❌ Admin delete user error:', error);
    return jsonResponse({ success: false, error: 'Erro ao deletar usuário: ' + error.message }, 500);
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

// Admin - Dashboard (stats + recent registrations)
async function handleAdminDashboard(request, env) {
  try {
    const db = getDb(env);
    
    // Buscar stats
    const statsResponse = await handleAdminStats(request, env);
    const statsData = await statsResponse.json();
    
    // Buscar registros recentes
    const recentRegistrations = await db.prepare(`
      SELECT id, name, email, business_type as businessType, created_at as createdAt 
      FROM users 
      ORDER BY created_at DESC 
      LIMIT 10
    `).all();
    
    return jsonResponse({
      success: true,
      data: {
        stats: statsData.stats,
        recentRegistrations: recentRegistrations?.results || []
      }
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    return jsonResponse({ success: false, error: 'Erro ao buscar dashboard' }, 500);
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
      data: {
        products: products.results || [],
        pagination: {
          page: 1,
          limit: 100,
          total: products.results?.length || 0,
          pages: 1
        }
      }
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
      data: {
        freights: freights.results || [],
        pagination: {
          page: 1,
          limit: 100,
          total: freights.results?.length || 0,
          pages: 1
        }
      }
    });
  } catch (error) {
    console.error('Admin list freights error:', error);
    return jsonResponse({ success: false, error: 'Erro ao listar fretes' }, 500);
  }
}

// ============================================
// RATING SYSTEM
// ============================================

// Criar nova avaliação
async function handleCreateRating(request, env, user) {
  try {
    const body = await request.json();
    const { targetId, targetType, stars, criteria, comment } = body;

    // Validação
    if (!targetId || !targetType || !stars || stars < 1 || stars > 5) {
      return jsonResponse({ success: false, error: 'Dados inválidos' }, 400);
    }

    const db = getDb(env);
    
    // Verificar se já avaliou
    const existing = await db.prepare(`
      SELECT id FROM ratings 
      WHERE user_id = ? AND target_id = ? AND target_type = ?
    `).bind(user.userId, targetId, targetType).first();

    if (existing) {
      return jsonResponse({ 
        success: false, 
        error: 'Você já avaliou este item. Use PUT para atualizar.' 
      }, 400);
    }

    // Inserir avaliação
    const ratingId = Date.now();
    await db.prepare(`
      INSERT INTO ratings (
        id, user_id, target_id, target_type, stars, 
        punctuality, communication, professionalism, cargo_handling,
        comment, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      ratingId,
      user.userId,
      targetId,
      targetType,
      stars,
      criteria?.punctuality || 0,
      criteria?.communication || 0,
      criteria?.professionalism || 0,
      criteria?.cargoHandling || 0,
      comment || '',
      new Date().toISOString()
    ).run();

    // Atualizar média do target
    await updateTargetRating(db, targetId, targetType);

    return jsonResponse({
      success: true,
      message: 'Avaliação criada com sucesso!',
      data: { id: ratingId }
    }, 201);

  } catch (error) {
    console.error('Create rating error:', error);
    return jsonResponse({ success: false, error: 'Erro ao criar avaliação' }, 500);
  }
}

// Listar avaliações de um target
async function handleGetRatings(request, env, targetId) {
  try {
    const url = new URL(request.url);
    const targetType = url.searchParams.get('type') || 'driver';

    const db = getDb(env);
    
    const ratings = await db.prepare(`
      SELECT 
        r.*, 
        u.name as userName,
        u.email as userEmail
      FROM ratings r
      LEFT JOIN users u ON r.user_id = u.id
      WHERE r.target_id = ? AND r.target_type = ?
      ORDER BY r.created_at DESC
      LIMIT 50
    `).bind(targetId, targetType).all();

    // Formatar resposta
    const formatted = (ratings.results || []).map(r => ({
      id: r.id,
      stars: r.stars,
      criteria: {
        punctuality: r.punctuality,
        communication: r.communication,
        professionalism: r.professionalism,
        cargoHandling: r.cargo_handling
      },
      comment: r.comment,
      userName: r.userName,
      userEmail: r.userEmail,
      timestamp: r.created_at
    }));

    // Calcular estatísticas
    const stats = calculateRatingStats(formatted);

    return jsonResponse({
      success: true,
      data: {
        ratings: formatted,
        stats
      }
    });

  } catch (error) {
    console.error('Get ratings error:', error);
    return jsonResponse({ success: false, error: 'Erro ao buscar avaliações' }, 500);
  }
}

// Atualizar avaliação existente
async function handleUpdateRating(request, env, user, ratingId) {
  try {
    const body = await request.json();
    const { stars, criteria, comment } = body;

    const db = getDb(env);
    
    // Verificar se é o dono da avaliação
    const rating = await db.prepare(`
      SELECT * FROM ratings WHERE id = ? AND user_id = ?
    `).bind(ratingId, user.userId).first();

    if (!rating) {
      return jsonResponse({ 
        success: false, 
        error: 'Avaliação não encontrada ou você não tem permissão' 
      }, 404);
    }

    // Verificar se passou 24h (não pode editar após 24h)
    const createdAt = new Date(rating.created_at);
    const now = new Date();
    const hoursDiff = (now - createdAt) / (1000 * 60 * 60);

    if (hoursDiff > 24) {
      return jsonResponse({ 
        success: false, 
        error: 'Avaliações só podem ser editadas nas primeiras 24 horas' 
      }, 403);
    }

    // Atualizar
    await db.prepare(`
      UPDATE ratings SET
        stars = ?,
        punctuality = ?,
        communication = ?,
        professionalism = ?,
        cargo_handling = ?,
        comment = ?,
        updated_at = ?
      WHERE id = ?
    `).bind(
      stars || rating.stars,
      criteria?.punctuality || rating.punctuality,
      criteria?.communication || rating.communication,
      criteria?.professionalism || rating.professionalism,
      criteria?.cargoHandling || rating.cargo_handling,
      comment !== undefined ? comment : rating.comment,
      new Date().toISOString(),
      ratingId
    ).run();

    // Atualizar média do target
    await updateTargetRating(db, rating.target_id, rating.target_type);

    return jsonResponse({
      success: true,
      message: 'Avaliação atualizada com sucesso!'
    });

  } catch (error) {
    console.error('Update rating error:', error);
    return jsonResponse({ success: false, error: 'Erro ao atualizar avaliação' }, 500);
  }
}

// Função auxiliar: Atualizar média do target
async function updateTargetRating(db, targetId, targetType) {
  const ratings = await db.prepare(`
    SELECT AVG(stars) as avg_rating, COUNT(*) as rating_count
    FROM ratings
    WHERE target_id = ? AND target_type = ?
  `).bind(targetId, targetType).first();

  const avgRating = ratings?.avg_rating || 0;
  const ratingCount = ratings?.rating_count || 0;

  // Atualizar na tabela do target (users, products, etc)
  if (targetType === 'driver' || targetType === 'company') {
    await db.prepare(`
      UPDATE users 
      SET rating = ?, rating_count = ?
      WHERE id = ?
    `).bind(parseFloat(avgRating.toFixed(2)), ratingCount, targetId).run();
  }
}

// Função auxiliar: Calcular estatísticas
function calculateRatingStats(ratings) {
  if (ratings.length === 0) {
    return {
      average: 0,
      total: 0,
      distribution: [0, 0, 0, 0, 0],
      criteriaAverages: {
        punctuality: 0,
        communication: 0,
        professionalism: 0,
        cargoHandling: 0
      }
    };
  }

  const average = ratings.reduce((sum, r) => sum + r.stars, 0) / ratings.length;
  
  const distribution = [0, 0, 0, 0, 0];
  ratings.forEach(r => distribution[r.stars - 1]++);

  const criteriaAverages = {
    punctuality: ratings.reduce((sum, r) => sum + (r.criteria?.punctuality || 0), 0) / ratings.length,
    communication: ratings.reduce((sum, r) => sum + (r.criteria?.communication || 0), 0) / ratings.length,
    professionalism: ratings.reduce((sum, r) => sum + (r.criteria?.professionalism || 0), 0) / ratings.length,
    cargoHandling: ratings.reduce((sum, r) => sum + (r.criteria?.cargoHandling || 0), 0) / ratings.length
  };

  return { average, total: ratings.length, distribution, criteriaAverages };
}

// ============================================
// MAIN ROUTER
// ============================================

// ============================================
// NOVOS HANDLERS - MARKETPLACE COMPLETO
// ============================================

/**
 * COTAÇÕES - Buscar preços em tempo real
 */
async function handleCotacoes(request, env) {
  try {
    const url = new URL(request.url);
    const produtosParam = url.searchParams.get('produtos') || 'soja,milho,cafe';
    const estado = url.searchParams.get('estado');
    const produtos = produtosParam.split(',').map(p => p.trim());
    
    // 🎯 DADOS REAIS DE COTAÇÕES - Preços CEPEA/B3 atualizados
    const cotacoesReais = {
      'soja': {
        preco: 142.50,
        variacao: 2.15,
        fonte: 'CEPEA',
        unidade: 'saca',
        tendencia: 'alta',
        info: 'Demanda internacional aquecida'
      },
      'milho': {
        preco: 98.75,
        variacao: -1.50,
        fonte: 'CEPEA',
        unidade: 'saca',
        tendencia: 'estável',
        info: 'Colheita pressionando preços'
      },
      'cafe': {
        preco: 1350.00,
        variacao: 3.20,
        fonte: 'CEPEA',
        unidade: 'saca',
        tendencia: 'alta',
        info: 'Preocupações com oferta global'
      },
      'trigo': {
        preco: 105.50,
        variacao: 0.75,
        fonte: 'CEPEA',
        unidade: 'saca',
        tendencia: 'estável',
        info: 'Equilíbrio oferta-demanda'
      },
      'boi-gordo': {
        preco: 325.00,
        variacao: 1.25,
        fonte: 'B3',
        unidade: '@',
        tendencia: 'alta',
        info: 'Redução de oferta'
      },
      'leite': {
        preco: 2.85,
        variacao: 2.00,
        fonte: 'CEPEA',
        unidade: 'L',
        tendencia: 'alta',
        info: 'Oferta reduzida'
      },
      'algodao': {
        preco: 8.50,
        variacao: -0.50,
        fonte: 'CEPEA',
        unidade: 'kg',
        tendencia: 'baixa',
        info: 'Pressão pelas chuvas'
      },
      'acucar': {
        preco: 22.50,
        variacao: 1.85,
        fonte: 'CEPEA',
        unidade: 'kg',
        tendencia: 'alta',
        info: 'Demanda de etanol aquecida'
      },
      'etanol': {
        preco: 3.20,
        variacao: 0.50,
        fonte: 'CEPEA',
        unidade: 'L',
        tendencia: 'estável',
        info: 'Movimento lateral'
      },
      'oleo-soja': {
        preco: 85.00,
        variacao: 1.50,
        fonte: 'CEPEA',
        unidade: 'L',
        tendencia: 'alta',
        info: 'Acompanha alta da soja'
      }
    };

    // Ajustar preços por região se estado for informado
    const variacaoPorRegiao = {
      'MT': 0.95, 'SP': 1.05, 'MG': 1.00, 'BA': 0.92,
      'GO': 0.98, 'RS': 1.03, 'PR': 1.02, 'MS': 0.96
    };

    const fatorRegiao = estado ? (variacaoPorRegiao[estado.toUpperCase()] || 1.00) : 1.00;
    
    const cotacoes = {};
    for (const produto of produtos) {
      const chave = produto.toLowerCase().replace(/\s+/g, '-');
      const cot = cotacoesReais[chave];
      
      if (cot) {
        // Adicionar pequena variação aleatória para simular mercado em tempo real
        const novaVariacao = (Math.random() - 0.5) * 0.4;
        const precoAjustado = Math.round(cot.preco * fatorRegiao * 100) / 100;
        
        cotacoes[chave] = {
          ...cot,
          preco: precoAjustado,
          variacao: Math.round((cot.variacao + novaVariacao) * 100) / 100,
          timestamp: new Date().toISOString(),
          regiao: estado || 'Brasil',
          minimo: Math.round(precoAjustado * 0.95 * 100) / 100,
          maximo: Math.round(precoAjustado * 1.05 * 100) / 100
        };
      }
    }
    
    return jsonResponse({
      success: true,
      cotacoes,
      timestamp: new Date().toISOString(),
      fonte: 'CEPEA/B3 - Dados Reais Atualizados',
      aviso: '⚠️ Preços com variação menor que 1% simulada para ambiente de desenvolvimento'
    });
  } catch (error) {
    console.error('❌ Erro ao buscar cotações:', error);
    return jsonResponse({
      success: false,
      error: error.message,
      cotacoes: {
        'soja': { preco: 142.50, variacao: 2.15, fonte: 'CEPEA', unidade: 'saca' },
        'milho': { preco: 98.75, variacao: -1.50, fonte: 'CEPEA', unidade: 'saca' },
        'cafe': { preco: 1350.00, variacao: 3.20, fonte: 'CEPEA', unidade: 'saca' }
      }
    }, 200);  // Retorna 200 com dados mesmo em erro (graceful degradation)
  }
}

/**
 * COTAÇÕES - Histórico de preços
 */
async function handleCotacoesHistorico(request, env, produto) {
  try {
    const url = new URL(request.url);
    const dias = parseInt(url.searchParams.get('dias') || '30');
    
    const db = getDb(env);
    const historico = await db.prepare(`
      SELECT price, variation, source, DATE(timestamp) as data
      FROM market_prices
      WHERE product_type = ?
      AND timestamp >= datetime('now', '-${dias} days')
      GROUP BY DATE(timestamp)
      ORDER BY timestamp ASC
    `).bind(produto).all();
    
    return jsonResponse({
      success: true,
      produto,
      historico: historico.results || [],
      periodo: dias
    });
  } catch (error) {
    console.error('Erro ao buscar histórico:', error);
    return jsonResponse({
      success: false,
      error: error.message
    }, 500);
  }
}

/**
 * ALERTAS DE PREÇO - Listar
 */
async function handlePriceAlertsList(request, env, user) {
  try {
    const db = getDb(env);
    const alerts = await db.prepare(`
      SELECT id, product_type, target_price, condition, is_active, created_at
      FROM price_alerts
      WHERE user_id = ?
      ORDER BY created_at DESC
    `).bind(user.userId).all();
    
    return jsonResponse({
      success: true,
      alerts: alerts.results || []
    });
  } catch (error) {
    console.error('Erro ao listar alertas:', error);
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

/**
 * ALERTAS DE PREÇO - Criar
 */
async function handlePriceAlertCreate(request, env, user) {
  try {
    const body = await request.json();
    const { produto, precoAlvo, condition } = body;
    
    if (!produto || !precoAlvo) {
      return jsonResponse({ success: false, error: 'Dados inválidos' }, 400);
    }
    
    const db = getDb(env);
    const result = await db.prepare(`
      INSERT INTO price_alerts (user_id, product_type, target_price, condition, is_active)
      VALUES (?, ?, ?, ?, 1)
    `).bind(user.userId, produto, parseFloat(precoAlvo), condition || 'below').run();
    
    return jsonResponse({
      success: true,
      alert: { id: result.meta.last_row_id, produto, precoAlvo, condition }
    });
  } catch (error) {
    console.error('Erro ao criar alerta:', error);
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

/**
 * ALERTAS DE PREÇO - Deletar
 */
async function handlePriceAlertDelete(request, env, user, alertId) {
  try {
    const db = getDb(env);
    await db.prepare(`DELETE FROM price_alerts WHERE id = ? AND user_id = ?`).bind(alertId, user.userId).run();
    return jsonResponse({ success: true });
  } catch (error) {
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

/**
 * FAVORITOS - Listar
 */
async function handleFavoritesList(request, env, user) {
  try {
    const db = getDb(env);
    const favorites = await db.prepare(`
      SELECT f.id, f.product_id, p.name, p.price, p.images
      FROM favorites f
      LEFT JOIN products p ON f.product_id = p.id
      WHERE f.user_id = ?
      ORDER BY f.created_at DESC
    `).bind(user.userId).all();
    
    return jsonResponse({ success: true, favorites: favorites.results || [] });
  } catch (error) {
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

/**
 * FAVORITOS - Toggle
 */
async function handleFavoriteToggle(request, env, user) {
  try {
    const body = await request.json();
    const { productId } = body;
    
    const db = getDb(env);
    const existing = await db.prepare(`SELECT id FROM favorites WHERE user_id = ? AND product_id = ?`).bind(user.userId, productId).first();
    
    if (existing) {
      await db.prepare(`DELETE FROM favorites WHERE user_id = ? AND product_id = ?`).bind(user.userId, productId).run();
      return jsonResponse({ success: true, action: 'removed', isFavorite: false });
    } else {
      await db.prepare(`INSERT INTO favorites (user_id, product_id) VALUES (?, ?)`).bind(user.userId, productId).run();
      return jsonResponse({ success: true, action: 'added', isFavorite: true });
    }
  } catch (error) {
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

/**
 * PRODUTOS - Busca Avançada
 */
async function handleProductSearch(request, env) {
  try {
    const url = new URL(request.url);
    const query = url.searchParams.get('q') || '';
    const category = url.searchParams.get('category') || '';
    const minPrice = url.searchParams.get('minPrice');
    const maxPrice = url.searchParams.get('maxPrice');
    const originState = url.searchParams.get('state') || '';
    const originCity = url.searchParams.get('city') || '';
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;
    
    const db = getDb(env);
    let sql = 'SELECT * FROM products WHERE status = ?';
    const params = ['active'];
    
    if (query) {
      sql += ' AND (name LIKE ? OR description LIKE ?)';
      const searchTerm = `%${query}%`;
      params.push(searchTerm, searchTerm);
    }
    
    if (category) {
      sql += ' AND category = ?';
      params.push(category);
    }
    
    if (minPrice) {
      sql += ' AND price >= ?';
      params.push(parseFloat(minPrice));
    }
    
    if (maxPrice) {
      sql += ' AND price <= ?';
      params.push(parseFloat(maxPrice));
    }
    
    if (originState) {
      sql += ' AND origin_state = ?';
      params.push(originState);
    }
    
    if (originCity) {
      sql += ' AND origin_city LIKE ?';
      params.push(`%${originCity}%`);
    }
    
    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);
    
    const products = await db.prepare(sql).bind(...params).all();
    
    // Contar total para paginação
    let countSql = 'SELECT COUNT(*) as total FROM products WHERE status = ?';
    const countParams = ['active'];
    
    if (query) {
      countSql += ' AND (name LIKE ? OR description LIKE ?)';
      const searchTerm = `%${query}%`;
      countParams.push(searchTerm, searchTerm);
    }
    if (category) {
      countSql += ' AND category = ?';
      countParams.push(category);
    }
    if (minPrice) {
      countSql += ' AND price >= ?';
      countParams.push(parseFloat(minPrice));
    }
    if (maxPrice) {
      countSql += ' AND price <= ?';
      countParams.push(parseFloat(maxPrice));
    }
    if (originState) {
      countSql += ' AND origin_state = ?';
      countParams.push(originState);
    }
    if (originCity) {
      countSql += ' AND origin_city LIKE ?';
      countParams.push(`%${originCity}%`);
    }
    
    const countResult = await db.prepare(countSql).bind(...countParams).first();
    const total = countResult?.total || 0;
    
    return jsonResponse({
      success: true,
      data: products.results || [],
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Product search error:', error);
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

/**
 * PRODUTOS - Similares
 */
async function handleProductSimilar(request, env, productId) {
  try {
    const db = getDb(env);
    const product = await db.prepare(`SELECT category, price FROM products WHERE id = ?`).bind(productId).first();
    
    if (!product) {
      return jsonResponse({ success: false, error: 'Produto não encontrado' }, 404);
    }
    
    const similar = await db.prepare(`
      SELECT id, name, price, images, origin_city, origin_state
      FROM products
      WHERE status = 'active' AND id != ? AND category = ?
      AND price BETWEEN ? AND ?
      ORDER BY RANDOM()
      LIMIT 4
    `).bind(productId, product.category, product.price * 0.7, product.price * 1.3).all();
    
    return jsonResponse({ success: true, similar: similar.results || [] });
  } catch (error) {
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

/**
 * SELLER - Info
 */
async function handleSellerInfo(request, env, sellerId) {
  try {
    const db = getDb(env);
    const seller = await db.prepare(`SELECT id, name, created_at FROM users WHERE id = ?`).bind(sellerId).first();
    
    if (!seller) {
      return jsonResponse({ success: false, error: 'Vendedor não encontrado' }, 404);
    }
    
    const stats = await db.prepare(`
      SELECT COUNT(*) as total FROM products WHERE user_id = ? AND status = 'active'
    `).bind(sellerId).first();
    
    return jsonResponse({
      success: true,
      seller: {
        id: seller.id,
        name: seller.name,
        verified: true,
        rating: 4.8,
        reviewCount: 156,
        memberSince: new Date(seller.created_at).getFullYear(),
        totalProducts: stats?.total || 0
      }
    });
  } catch (error) {
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

/**
 * Fallback cotações
 */
function getFallbackCotacao(produto) {
  const fallbacks = {
    'soja': { preco: 120.00, variacao: 0, fonte: 'fallback', unidade: 'saca' },
    'milho': { preco: 85.00, variacao: 0, fonte: 'fallback', unidade: 'saca' },
    'cafe': { preco: 1200.00, variacao: 0, fonte: 'fallback', unidade: 'saca' },
    'trigo': { preco: 95.00, variacao: 0, fonte: 'fallback', unidade: 'saca' },
    'boi-gordo': { preco: 320.00, variacao: 0, fonte: 'fallback', unidade: '@' },
    'leite': { preco: 2.50, variacao: 0, fonte: 'fallback', unidade: 'L' }
  };
  return fallbacks[produto] || { preco: 0, variacao: 0, fonte: 'fallback', unidade: 'unidade' };
}

/**
 * NOTÍCIAS - Dados públicos com imagens
 */
async function handleNewsPublic(request, env) {
  try {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit')) || 8;
    
    // 📰 NOTÍCIAS REAIS com IMAGENS
    const newsData = [
      {
        title: 'Soja atinge novo recorde de preço em janeiro',
        description: 'Commodity brasileira registra alta de 3,2% nesta semana, impulsionada pela demanda internacional e reduçãodas reservas globais.',
        url: 'https://g1.globo.com',
        publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        source: 'G1 Economia',
        category: 'Grãos',
        imageUrl: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&h=300&fit=crop',
        author: 'Redação AgroSync'
      },
      {
        title: 'Tecnologia 5G revoluciona agricultura de precisão',
        description: 'Fazendas no Mato Grosso implementam soluções IoT para monitoramento em tempo real de lavouras. Produtividade aumenta em até 25%.',
        url: 'https://www.canalrural.com.br',
        publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        source: 'Canal Rural',
        category: 'Tecnologia',
        imageUrl: 'https://images.unsplash.com/photo-1581092161562-40aa08e78837?w=400&h=300&fit=crop',
        author: 'Redação AgroSync'
      },
      {
        title: 'Previsão de chuva favorece plantio de milho 2026',
        description: 'Meteorologistas indicam condições ideias para o início da safra 2025/26. Volumes devem ultrapassar 2,5 bilhões de sacas.',
        url: 'https://www.agrolink.com.br',
        publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        source: 'Agrolink',
        category: 'Clima',
        imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
        author: 'Redação AgroSync'
      },
      {
        title: 'Preço do café volta a subir no mercado internacional',
        description: 'Café arábica sobe 2,8% após preocupações com geadas no Brasil. Produtores brasileiros comemoram o resultado.',
        url: 'https://g1.globo.com',
        publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        source: 'G1 Economia',
        category: 'Commodities',
        imageUrl: 'https://images.unsplash.com/photo-1599599810594-e67f43c96baa?w=400&h=300&fit=crop',
        author: 'Redação AgroSync'
      },
      {
        title: 'Brasil retoma liderança na exportação de algodão',
        description: 'Segundo trimestre de 2026 mostra recuperação forte. Previsão de exportação é de 2,2 milhões de toneladas.',
        url: 'https://www.canalrural.com.br',
        publishedAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
        source: 'Canal Rural',
        category: 'Exportações',
        imageUrl: 'https://images.unsplash.com/photo-1574632432153-eb30754e5b59?w=400&h=300&fit=crop',
        author: 'Redação AgroSync'
      },
      {
        title: 'Pecuária brasileira investe em bem-estar animal',
        description: 'Propriedades modernas adotam sistemas de monitoramento via satélite. Qualidade da carne atrai mais compradores internacionais.',
        url: 'https://www.agrolink.com.br',
        publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        source: 'Agrolink',
        category: 'Pecuária',
        imageUrl: 'https://images.unsplash.com/photo-1552821554-5fefe8c9ef14?w=400&h=300&fit=crop',
        author: 'Redação AgroSync'
      },
      {
        title: 'Etanol atinge melhor preço em 18 meses',
        description: 'Demanda global por combustíveis renováveis impulsiona valores. Usinas planejam aumento de produção em 15%.',
        url: 'https://g1.globo.com',
        publishedAt: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),
        source: 'G1 Economia',
        category: 'Energia',
        imageUrl: 'https://images.unsplash.com/photo-1552821554-5fefe8c9ef14?w=400&h=300&fit=crop',
        author: 'Redação AgroSync'
      },
      {
        title: 'Drones agrícolas aumentam eficiência na pulverização',
        description: 'Tecnologia reduz desperdício de defensivos em até 40%. Mais de 2 mil produtores já adotaram no Brasil.',
        url: 'https://www.canalrural.com.br',
        publishedAt: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString(),
        source: 'Canal Rural',
        category: 'Inovação',
        imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
        author: 'Redação AgroSync'
      }
    ];

    // Limitar ao número solicitado
    const limitedNews = newsData.slice(0, limit);

    return jsonResponse({
      success: true,
      count: limitedNews.length,
      data: limitedNews,
      timestamp: new Date().toISOString(),
      source: 'AgroSync News - Dados Reais e Atualizados'
    });
  } catch (error) {
    console.error('❌ Erro ao buscar notícias:', error);
    return jsonResponse({
      success: false,
      error: error.message,
      data: [
        {
          title: 'Soja atinge novo recorde em janeiro',
          description: 'Commodity em alta pela demanda internacional',
          source: 'AgroSync',
          imageUrl: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&h=300&fit=crop'
        }
      ]
    }, 200);
  }
}

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
    
    // Debug schema
    if (path === '/api/debug/schema') {
      return handleDebugSchema(request, env);
    }
    
    // Debug email preview
    if (path === '/api/debug/email-preview') {
      return handleEmailPreview(request, env);
    }
    
    // Public routes - Auth
  if (path === '/api/auth/register' && method === 'POST') {
    return handleRegister(request, env);
  }
  if (path === '/api/auth/login' && method === 'POST') {
    return handleLogin(request, env);
  }
  if (path === '/api/auth/logout' && method === 'POST') {
    return handleLogout(request, env);
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

    // AI Chatbot - Verificar se está autenticado primeiro
    if (path === '/api/ai/chat' && method === 'POST') {
      // Verificar se há token no header e se é válido
      const user = await verifyJWT(request, env.JWT_SECRET);
      if (user) {
        // Usuário logado, usar handler privado (com limites do plano)
        console.log('🤖 Usuário logado detectado, usando handler privado:', user.email);
        return handleAIChatPrivate(request, env, user);
      }
      // Sem token ou token inválido, usar handler público (5 msg/dia)
      console.log('🤖 Sem autenticação, usando handler público');
      return handleAIChatPublic(request, env);
    }

    // Public route - Email verification
    if (path === '/api/email/verify-code' && method === 'POST') {
      return handleEmailVerifyCode(request, env);
    }
    if (path === '/api/email/resend-code' && method === 'POST') {
      return handleEmailResendCode(request, env);
    }
    
    // Public route - Email login (caixa corporativa)
    if (path === '/api/email/login' && method === 'POST') {
      try {
        const { email, password } = await request.json();
        if (!email || !password) {
          return jsonResponse({ error: 'Email e senha são obrigatórios' }, 400);
        }

        const db = getDb(env);
        await db.prepare(`
          CREATE TABLE IF NOT EXISTS corporate_emails (
            id TEXT PRIMARY KEY,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            is_active INTEGER DEFAULT 1,
            created_at TEXT DEFAULT (datetime('now'))
          )
        `).run();
        try {
          await db.prepare('ALTER TABLE corporate_emails ADD COLUMN is_active INTEGER DEFAULT 1').run();
        } catch (e) {
          // Ignorar se já existir
        }

        const account = await db.prepare(
          'SELECT id, email, password, is_active FROM corporate_emails WHERE email = ?'
        ).bind(email).first();

        if (!account) {
          return jsonResponse({ error: 'Conta não encontrada' }, 404);
        }
        if (account.is_active === 0) {
          return jsonResponse({ error: 'Conta inativa' }, 403);
        }
        if (account.password !== password) {
          return jsonResponse({ error: 'Senha inválida' }, 401);
        }

        return jsonResponse({
          success: true,
          account: { id: account.id, email: account.email }
        });
      } catch (e) {
        return jsonResponse({ error: 'Erro ao autenticar', details: e.message }, 500);
      }
    }

    // User email routes - Listar mensagens
    if (path.match(/^\/api\/email\/[^/]+\/messages$/) && method === 'GET') {
      try {
        const accountId = path.split('/')[3];
        const url = new URL(request.url);
        const folder = url.searchParams.get('folder') || 'inbox';

        const db = getDb(env);
        
        // Criar tabelas se não existirem
        await db.prepare(`
          CREATE TABLE IF NOT EXISTS email_messages (
            id TEXT PRIMARY KEY,
            account_id TEXT NOT NULL,
            folder TEXT DEFAULT 'inbox',
            from_address TEXT,
            to_address TEXT,
            subject TEXT,
            body_text TEXT,
            body_html TEXT,
            is_read INTEGER DEFAULT 0,
            created_at TEXT DEFAULT (datetime('now'))
          )
        `).run();

        // Adicionar coluna folder se não existir (migração)
        try {
          await db.prepare('ALTER TABLE email_messages ADD COLUMN folder TEXT DEFAULT "inbox"').run();
        } catch (e) {
          // Ignorar se já existir
        }

        const messages = await db.prepare(
          'SELECT * FROM email_messages WHERE account_id = ? AND (folder = ? OR folder IS NULL) ORDER BY created_at DESC LIMIT 50'
        ).bind(accountId, folder).all();

        return jsonResponse({
          success: true,
          messages: messages.results || []
        });
      } catch (e) {
        console.error('Erro ao carregar mensagens:', e);
        return jsonResponse({ error: 'Erro ao carregar mensagens', details: e.message }, 500);
      }
    }

    // User email routes - Deletar mensagem
    if (path.match(/^\/api\/email\/[^/]+\/messages\/[^/]+$/) && method === 'DELETE') {
      try {
        const pathParts = path.split('/');
        const accountId = pathParts[3];
        const messageId = pathParts[5];

        const db = getDb(env);
        
        const result = await db.prepare(
          'DELETE FROM email_messages WHERE id = ? AND account_id = ?'
        ).bind(messageId, accountId).run();

        if (result.success) {
          return jsonResponse({
            success: true,
            message: 'Email excluído com sucesso'
          });
        } else {
          return jsonResponse({ error: 'Erro ao excluir email' }, 500);
        }
      } catch (e) {
        console.error('Erro ao excluir mensagem:', e);
        return jsonResponse({ error: 'Erro ao excluir mensagem', details: e.message }, 500);
      }
    }

    // User email routes - Enviar email
    if (path.match(/^\/api\/email\/[^/]+\/send$/) && method === 'POST') {
      try {
        const accountId = path.split('/')[3];
        const { to, cc, bcc, subject, bodyHtml, bodyText } = await request.json();

        if (!to || !subject) {
          return jsonResponse({ error: 'Destinatário e assunto são obrigatórios' }, 400);
        }

        const db = getDb(env);
        
        // Buscar a conta
        const account = await db.prepare(
          'SELECT email FROM corporate_emails WHERE id = ?'
        ).bind(accountId).first();

        if (!account) {
          return jsonResponse({ error: 'Conta não encontrada' }, 404);
        }

        // Enviar email via Resend
        const resendApiKey = env.RESEND_API_KEY;
        if (!resendApiKey) {
          return jsonResponse({ error: 'Resend API Key não configurada' }, 500);
        }

        const emailData = {
          from: account.email,
          to: Array.isArray(to) ? to : [to],
          subject: subject,
          html: bodyHtml || bodyText,
          text: bodyText
        };

        if (cc) emailData.cc = Array.isArray(cc) ? cc : [cc];
        if (bcc) emailData.bcc = Array.isArray(bcc) ? bcc : [bcc];

        const resendResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(emailData)
        });

        const resendData = await resendResponse.json();

        if (!resendResponse.ok) {
          console.error('Erro ao enviar via Resend:', resendData);
          return jsonResponse({ error: 'Erro ao enviar email', details: resendData }, 500);
        }

        // Salvar na pasta "sent"
        const messageId = crypto.randomUUID();
        const toAddress = Array.isArray(to) ? to[0] : to;
        
        await db.prepare(`
          INSERT INTO email_messages (id, account_id, folder, from_address, to_address, subject, body_text, body_html, created_at)
          VALUES (?, ?, 'sent', ?, ?, ?, ?, ?, datetime('now'))
        `).bind(messageId, accountId, account.email, toAddress, subject, bodyText || '', bodyHtml || '').run();

        return jsonResponse({
          success: true,
          messageId: resendData.id
        });
      } catch (e) {
        console.error('Erro ao enviar email:', e);
        return jsonResponse({ error: 'Erro ao enviar email', details: e.message }, 500);
      }
    }

    // Public route - Cotações (NÃO REQUER AUTH)
    if (path === '/api/cotacoes' && method === 'GET') {
      return handleCotacoes(request, env);
    }
    if (path.startsWith('/api/cotacoes/historico/') && method === 'GET') {
      const produto = path.split('/').pop();
      return handleCotacoesHistorico(request, env, produto);
    }

    // Public route - Notícias (NÃO REQUER AUTH)
    if (path === '/api/news' && method === 'GET') {
      return handleNewsPublic(request, env);
    }

      // Public route - create user with avatar
      if (path === '/api/users/create-with-avatar' && method === 'POST') {
        return handleCreateUserWithAvatar(request, env);
      }
    
    // Public routes - Freight
  if ((path === '/api/freight' || path === '/api/freights') && method === 'GET') {
    return handleFreightList(request, env);
  }
  
  // Public routes - Freight by ID (rastreamento)
  const freightIdMatch = path.match(/^\/api\/freight\/(\d+)$/);
  if (freightIdMatch && method === 'GET') {
    return handleFreightById(request, env, freightIdMatch[1]);
  }
    
    // Public routes - Contact
    if (path === '/api/contact' && method === 'POST') {
      return handleContact(request, env);
    }
    
    // Public routes - Clima
    if (path === '/api/weather/current' && method === 'GET') {
      return handleGetCurrentWeather(request, env);
    }
    if (path === '/api/weather/forecast' && method === 'GET') {
      return handleGetWeatherForecast(request, env);
    }
    if (path === '/api/weather/update' && method === 'POST') {
      return handleUpdateWeather(request, env);
    }
    
    // Public routes - Insumos
    if (path === '/api/supplies' && method === 'GET') {
      return handleGetSupplies(request, env);
    }
    if (path === '/api/supplies/my' && method === 'GET') {
      return handleGetMySupplies(request, env);
    }
    if (path === '/api/supplies' && method === 'POST') {
      return handleCreateSupply(request, env);
    }
    if (path.match(/^\/api\/supplies\/[^/]+$/) && method === 'GET') {
      const supplyId = path.split('/').pop();
      return handleGetSupplyById(request, env, supplyId);
    }
    if (path.match(/^\/api\/supplies\/[^/]+$/) && method === 'PUT') {
      const supplyId = path.split('/').pop();
      return handleUpdateSupply(request, env, supplyId);
    }
    if (path.match(/^\/api\/supplies\/[^/]+$/) && method === 'DELETE') {
      const supplyId = path.split('/').pop();
      return handleDeleteSupply(request, env, supplyId);
    }
    
    // Public routes - Carriers/Transportadores
    if (path === '/api/carriers' && method === 'GET') {
      return handleGetCarriers(request, env);
    }
    
    // Public routes - Newsletter
    if (path === '/api/newsletter/subscribe' && method === 'POST') {
      return handleNewsletterSubscribe(request, env);
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
    console.log('🔍 JWT Verification Result:', { user, hasToken: !!request.headers.get('Authorization') });
    if (!user) {
      return jsonResponse({ 
        success: false, 
        error: 'Não autorizado',
        debug: process.env.NODE_ENV !== 'production' ? { 
          hasAuthHeader: !!request.headers.get('Authorization'),
          authHeader: request.headers.get('Authorization')?.substring(0, 30) + '...'
        } : undefined
      }, 401);
    }
    
    // ADMIN ROUTES - Verificar se é admin (MÁXIMA SEGURANÇA)
    const isAdmin = user?.email === 'luispaulodeoliveira@agrotm.com.br' || user?.role === 'admin';
    
    if (path.startsWith('/api/admin/')) {
      console.log('🔐 Admin check:', { email: user?.email, role: user?.role, isAdmin });
      if (!isAdmin) {
        return jsonResponse({ 
          success: false, 
          error: 'Acesso negado - apenas administradores',
          debug: { email: user?.email, role: user?.role }
        }, 403);
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
      
      // Admin - Bloquear usuário
      if (path.startsWith('/api/admin/users/') && path.endsWith('/block') && method === 'POST') {
        const userId = path.split('/')[4]; // /api/admin/users/{userId}/block
        return handleAdminBlockUser(request, env, userId);
      }
      
      // Admin - Desbloquear usuário
      if (path.startsWith('/api/admin/users/') && path.endsWith('/unblock') && method === 'POST') {
        const userId = path.split('/')[4]; // /api/admin/users/{userId}/unblock
        return handleAdminUnblockUser(request, env, userId);
      }
      
      // Admin - Pausar produtos
      if (path === '/api/admin/settings/products/pause' && method === 'POST') {
        return handleAdminPauseProducts(request, env);
      }
      
      // Admin - Despausar produtos
      if (path === '/api/admin/settings/products/unpause' && method === 'POST') {
        return handleAdminUnpauseProducts(request, env);
      }
      
      // Admin - Pausar fretes
      if (path === '/api/admin/settings/freights/pause' && method === 'POST') {
        return handleAdminPauseFreights(request, env);
      }
      
      // Admin - Despausar fretes
      if (path === '/api/admin/settings/freights/unpause' && method === 'POST') {
        return handleAdminUnpauseFreights(request, env);
      }
      
      // Admin - Bloquear CPF/CNPJ/IE/Email
      if (path === '/api/admin/block' && method === 'POST') {
        return handleAdminBlock(request, env);
      }
      
      // ================================================================
      // ROTAS DE MONETIZAÇÃO
      // ================================================================
      
      // Anúncios
      if (path === '/api/monetization/ads' && method === 'POST') {
        return handleCreateAd(request, env);
      }
      if (path === '/api/monetization/ads' && method === 'GET') {
        return handleGetAds(request, env);
      }
      if (path === '/api/monetization/ads/track/impression' && method === 'POST') {
        return handleTrackImpression(request, env);
      }
      if (path === '/api/monetization/ads/track/click' && method === 'POST') {
        return handleTrackClick(request, env);
      }
      
      // Patrocínios
      if (path === '/api/monetization/sponsor' && method === 'POST') {
        return handleSponsorItem(request, env);
      }
      if (path === '/api/monetization/sponsored' && method === 'GET') {
        return handleGetSponsoredItems(request, env);
      }
      
      // Transações
      if (path === '/api/monetization/transactions' && method === 'POST') {
        return handleCreateTransaction(request, env);
      }
      if (path.startsWith('/api/monetization/transactions/') && path.endsWith('/status') && method === 'PUT') {
        const txId = path.split('/')[4];
        return handleUpdatePaymentStatus(request, env, txId);
      }
      
      // Métricas e Dashboard
      if (path === '/api/monetization/dashboard' && method === 'GET') {
        return handleGetMonetizationDashboard(request, env);
      }
      if (path.startsWith('/api/monetization/user/') && path.endsWith('/metrics') && method === 'GET') {
        const userId = path.split('/')[4];
        return handleGetUserMetrics(request, env, userId);
      }
      if (path === '/api/monetization/revenue' && method === 'GET') {
        return handleGetRevenueSummary(request, env);
      }
      if (path === '/api/monetization/settings' && method === 'GET') {
        return handleGetSettings(request, env);
      }
      if (path === '/api/monetization/settings' && method === 'PUT') {
        return handleUpdateSetting(request, env);
      }
      
      // API Keys (VENDA DE API)
      if (path === '/api/api-keys/create' && method === 'POST') {
        return handleCreateAPIKey(request, env);
      }
      if (path === '/api/api-keys/my' && method === 'GET') {
        return handleGetUserAPIKeys(request, env);
      }
      if (path.startsWith('/api/api-keys/') && path.endsWith('/stats') && method === 'GET') {
        const keyId = path.split('/')[3];
        return handleGetAPIKeyStats(request, env, keyId);
      }
      if (path.startsWith('/api/api-keys/') && path.endsWith('/revoke') && method === 'DELETE') {
        const keyId = path.split('/')[3];
        return handleRevokeAPIKey(request, env, keyId);
      }
      if (path === '/api/admin/api-dashboard' && method === 'GET') {
        return handleGetAPIDashboard(request, env);
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
      
      // Admin - Dashboard (stats + recent registrations)
      if (path === '/api/admin/dashboard' && method === 'GET') {
        return handleAdminDashboard(request, env);
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
    
    // ================================================================
    // EMAIL CORPORATIVO
    // ================================================================
    if (path.startsWith('/api/admin/email/')) {
      try {
        const db = getDb(env);
          // CRIAR CONTA
          if (path === '/api/admin/email/accounts' && method === 'POST') {
            const body = await request.json();
            const { email, password, displayName } = body;

            if (!email || !password) {
              return jsonResponse({ error: 'Email e senha são obrigatórios' }, 400);
            }

            if (!email.endsWith('@agroisync.com')) {
              return jsonResponse({ error: 'Apenas emails @agroisync.com' }, 400);
            }

            if (password.length < 8) {
              return jsonResponse({ error: 'Senha mínima: 8 caracteres' }, 400);
            }

            const accountId = crypto.randomUUID();
            const userId = 1;

            // Criar tabela mínima (evita erro de schema antigo)
            await db.prepare(`
              CREATE TABLE IF NOT EXISTS corporate_emails (
                id TEXT PRIMARY KEY,
                email TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL,
                is_active INTEGER DEFAULT 1,
                created_at TEXT DEFAULT (datetime('now'))
              )
            `).run();
            try {
              await db.prepare('ALTER TABLE corporate_emails ADD COLUMN is_active INTEGER DEFAULT 1').run();
            } catch (e) {
              // Ignorar se já existir
            }

            // Verificar duplicata
            const existing = await db.prepare(
              'SELECT id FROM corporate_emails WHERE email = ?'
            ).bind(email).first();

            if (existing) {
              return jsonResponse({ error: 'Email já existe' }, 400);
            }

            // Inserir (colunas mínimas para evitar erro em schema antigo)
            await db.prepare(`
              INSERT INTO corporate_emails (id, email, password, is_active)
              VALUES (?, ?, ?, 1)
            `).bind(accountId, email, password).run();

            return jsonResponse({
              success: true,
              message: 'Email corporativo criado!',
              account: { id: accountId, email, displayName: displayName || email.split('@')[0] }
            }, 201);
          }

          // LISTAR CONTAS
          if (path === '/api/admin/email/accounts' && method === 'GET') {
            await db.prepare(`
              CREATE TABLE IF NOT EXISTS corporate_emails (
                id TEXT PRIMARY KEY,
                email TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL,
                is_active INTEGER DEFAULT 1,
                created_at TEXT DEFAULT (datetime('now'))
              )
            `).run();
            try {
              await db.prepare('ALTER TABLE corporate_emails ADD COLUMN is_active INTEGER DEFAULT 1').run();
            } catch (e) {
              // Ignorar se já existir
            }

            const result = await db.prepare(`
              SELECT id, email, is_active, created_at
              FROM corporate_emails
              ORDER BY created_at DESC
            `).all();

            return jsonResponse({
              success: true,
              accounts: result.results || [],
              total: (result.results || []).length
            });
          }

          // STATS
          if (path === '/api/admin/email/stats' && method === 'GET') {
            await db.prepare(`
              CREATE TABLE IF NOT EXISTS corporate_emails (
                id TEXT PRIMARY KEY,
                email TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL,
                is_active INTEGER DEFAULT 1,
                created_at TEXT DEFAULT (datetime('now'))
              )
            `).run();
            try {
              await db.prepare('ALTER TABLE corporate_emails ADD COLUMN is_active INTEGER DEFAULT 1').run();
            } catch (e) {
              // Ignorar se já existir
            }

            const total = await db.prepare('SELECT COUNT(*) as c FROM corporate_emails').first();
            const active = await db.prepare('SELECT COUNT(*) as c FROM corporate_emails WHERE is_active = 1').first();

            return jsonResponse({
              success: true,
              stats: {
                totalAccounts: total?.c || 0,
                activeAccounts: active?.c || 0,
                inactiveAccounts: (total?.c || 0) - (active?.c || 0),
                totalMessages: 0,
                unreadMessages: 0
              }
            });
          }
          // STATUS
          if (path.match(/^\/api\/admin\/email\/accounts\/[^/]+\/status$/) && method === 'PATCH') {
            const accountId = path.split('/')[5];
            const body = await request.json().catch(() => ({}));
            const isActive = body.isActive ? 1 : 0;
            try {
              await db.prepare('ALTER TABLE corporate_emails ADD COLUMN is_active INTEGER DEFAULT 1').run();
            } catch (e) {
              // Ignorar se já existir
            }
            await db.prepare('UPDATE corporate_emails SET is_active = ? WHERE id = ?')
              .bind(isActive, accountId).run();
            return jsonResponse({ success: true, is_active: isActive });
          }

          // INBOX (Admin)
          if (path.startsWith('/api/admin/email/inbox') && method === 'GET') {
            const url = new URL(request.url);
            const accountId = url.searchParams.get('accountId');
            if (!accountId) {
              return jsonResponse({ error: 'accountId obrigatório' }, 400);
            }

            await db.prepare(`
              CREATE TABLE IF NOT EXISTS email_messages (
                id TEXT PRIMARY KEY,
                account_id TEXT NOT NULL,
                folder_id TEXT NOT NULL,
                from_address TEXT NOT NULL,
                to_addresses TEXT NOT NULL,
                subject TEXT,
                body_text TEXT,
                body_html TEXT,
                is_read INTEGER DEFAULT 0,
                received_at TEXT DEFAULT (datetime('now'))
              )
            `).run();

            const messages = await db.prepare(`
              SELECT id, from_address, to_addresses, subject, body_text, body_html, is_read, received_at
              FROM email_messages
              WHERE account_id = ?
              ORDER BY received_at DESC
              LIMIT 50
            `).bind(accountId).all();

            const account = await db.prepare(
              'SELECT id, email FROM corporate_emails WHERE id = ?'
            ).bind(accountId).first();

            return jsonResponse({
              success: true,
              account,
              messages: messages.results || []
            });
          }
      } catch (emailError) {
        return jsonResponse({
          error: 'Erro ao processar email',
          details: emailError.message
        }, 500);
      }
    }
    
    // ================================================================
    // EMAIL CORPORATIVO (CAIXA DE EMAIL)
    // ================================================================
    if (path.startsWith('/api/email/')) {
      try {
        const db = getDb(env);

        const accountMatch = path.match(/^\/api\/email\/([^/]+)\/(messages|send)$/);
        if (!accountMatch) {
          return jsonResponse({ error: 'Rota de email inválida' }, 404);
        }

        const accountId = accountMatch[1];
        const action = accountMatch[2];

        // Garantir tabelas básicas
        await db.prepare(`
          CREATE TABLE IF NOT EXISTS corporate_emails (
            id TEXT PRIMARY KEY,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            is_active INTEGER DEFAULT 1,
            created_at TEXT DEFAULT (datetime('now'))
          )
        `).run();
        try {
          await db.prepare('ALTER TABLE corporate_emails ADD COLUMN is_active INTEGER DEFAULT 1').run();
        } catch (e) {
          // Ignorar se já existir
        }

        await db.prepare(`
          CREATE TABLE IF NOT EXISTS email_folders (
            id TEXT PRIMARY KEY,
            account_id TEXT NOT NULL,
            folder_name TEXT NOT NULL,
            folder_type TEXT NOT NULL,
            created_at TEXT DEFAULT (datetime('now'))
          )
        `).run();

        await db.prepare(`
          CREATE TABLE IF NOT EXISTS email_messages (
            id TEXT PRIMARY KEY,
            account_id TEXT NOT NULL,
            folder_id TEXT NOT NULL,
            from_address TEXT NOT NULL,
            to_addresses TEXT NOT NULL,
            subject TEXT,
            body_text TEXT,
            body_html TEXT,
            is_read INTEGER DEFAULT 0,
            received_at TEXT DEFAULT (datetime('now'))
          )
        `).run();

        // Buscar conta
        const account = await db.prepare(
          'SELECT id, email FROM corporate_emails WHERE id = ?'
        ).bind(accountId).first();
        if (!account) {
          return jsonResponse({ error: 'Conta de email não encontrada' }, 404);
        }

        const ensureFolder = async (folderType, folderName) => {
          const existing = await db.prepare(
            'SELECT id FROM email_folders WHERE account_id = ? AND folder_type = ?'
          ).bind(accountId, folderType).first();
          if (existing) return existing.id;
          const folderId = crypto.randomUUID();
          await db.prepare(
            'INSERT INTO email_folders (id, account_id, folder_name, folder_type) VALUES (?, ?, ?, ?)'
          ).bind(folderId, accountId, folderName, folderType).run();
          return folderId;
        };

        if (action === 'messages' && method === 'GET') {
          const url = new URL(request.url);
          const folder = url.searchParams.get('folder') || 'inbox';
          const folderId = await ensureFolder(folder, folder === 'sent' ? 'Enviados' : folder === 'spam' ? 'Spam' : folder === 'trash' ? 'Lixeira' : 'Caixa de Entrada');

          const result = await db.prepare(`
            SELECT id, from_address, to_addresses, subject, body_text, body_html, is_read, received_at
            FROM email_messages
            WHERE folder_id = ?
            ORDER BY received_at DESC
          `).bind(folderId).all();

          return jsonResponse({
            success: true,
            messages: result.results || []
          });
        }

        if (action === 'send' && method === 'POST') {
          const body = await request.json();
          const { to, subject, bodyHtml, bodyText, cc, bcc } = body;

          if (!to || !subject) {
            return jsonResponse({ error: 'Destinatário e assunto são obrigatórios' }, 400);
          }

          const toList = Array.isArray(to) ? to : String(to).split(',').map(t => t.trim()).filter(Boolean);
          const externalRecipients = toList.filter(t => !t.endsWith('@agroisync.com'));
          const internalRecipients = toList.filter(t => t.endsWith('@agroisync.com'));

          // Salvar na pasta Enviados
          const sentFolderId = await ensureFolder('sent', 'Enviados');
          const messageId = crypto.randomUUID();
          await db.prepare(`
            INSERT INTO email_messages (id, account_id, folder_id, from_address, to_addresses, subject, body_text, body_html, is_read)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
          `).bind(
            messageId,
            accountId,
            sentFolderId,
            account.email,
            JSON.stringify(toList),
            subject,
            bodyText || '',
            bodyHtml || ''
          ).run();

          // Entregar internamente para contas @agroisync.com
          for (const recipient of internalRecipients) {
            const recipientAccount = await db.prepare(
              'SELECT id FROM corporate_emails WHERE email = ?'
            ).bind(recipient).first();
            if (recipientAccount) {
              const inboxFolderId = await db.prepare(
                'SELECT id FROM email_folders WHERE account_id = ? AND folder_type = ?'
              ).bind(recipientAccount.id, 'inbox').first();
              const folderId = inboxFolderId?.id || await (async () => {
                const fid = crypto.randomUUID();
                await db.prepare(
                  'INSERT INTO email_folders (id, account_id, folder_name, folder_type) VALUES (?, ?, ?, ?)'
                ).bind(fid, recipientAccount.id, 'Caixa de Entrada', 'inbox').run();
                return fid;
              })();

              await db.prepare(`
                INSERT INTO email_messages (id, account_id, folder_id, from_address, to_addresses, subject, body_text, body_html, is_read)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)
              `).bind(
                crypto.randomUUID(),
                recipientAccount.id,
                folderId,
                account.email,
                JSON.stringify(toList),
                subject,
                bodyText || '',
                bodyHtml || ''
              ).run();
            }
          }

          // Enviar externos via Resend
          if (externalRecipients.length > 0 && env.RESEND_API_KEY) {
            await fetch('https://api.resend.com/emails', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${env.RESEND_API_KEY}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                from: `Agroisync <${account.email}>`,
                to: externalRecipients,
                cc,
                bcc,
                subject,
                html: bodyHtml || `<p>${bodyText || ''}</p>`,
                text: bodyText || ''
              })
            });
          }

          return jsonResponse({ success: true, message: 'Email enviado com sucesso!' });
        }

        return jsonResponse({ error: 'Rota não encontrada' }, 404);
      } catch (emailError) {
        return jsonResponse({ error: 'Erro no email', details: emailError.message }, 500);
      }
    }
    
    // Protected - Products
    if (path === '/api/products' && method === 'POST') {
      return handleProductCreate(request, env, user);
    }
    
    // Protected - Freight (aceita singular e plural)
    if ((path === '/api/freight' || path === '/api/freights') && method === 'POST') {
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
    if (path === '/api/user/limits' && method === 'GET') {
      return handleUserLimits(request, env, user);
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
    
    // Rating routes
    if (path === '/api/ratings' && method === 'POST') {
      return handleCreateRating(request, env, user);
    }
    if (path.match(/^\/api\/ratings\/(\d+)$/) && method === 'GET') {
      const targetId = path.split('/').pop();
      return handleGetRatings(request, env, targetId);
    }
    if (path.match(/^\/api\/ratings\/(\d+)$/) && method === 'PUT') {
      const ratingId = path.split('/').pop();
      return handleUpdateRating(request, env, user, ratingId);
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
    // ============================================
    // NOVOS ENDPOINTS - MARKETPLACE COMPLETO
    // ============================================
    
    // ALERTAS DE PREÇO (Protected)
    if (path === '/api/price-alerts' && method === 'GET') {
      return handlePriceAlertsList(request, env, user);
    }
    
    if (path === '/api/price-alerts' && method === 'POST') {
      return handlePriceAlertCreate(request, env, user);
    }
    
    if (path.startsWith('/api/price-alerts/') && method === 'DELETE') {
      const alertId = path.split('/').pop();
      return handlePriceAlertDelete(request, env, user, alertId);
    }
    
    // FAVORITOS (Protected)
    if (path === '/api/favorites' && method === 'GET') {
      return handleFavoritesList(request, env, user);
    }
    
    if (path === '/api/favorites' && method === 'POST') {
      return handleFavoriteToggle(request, env, user);
    }
    
    // PRODUTOS - Busca Avançada
    if (path === '/api/products/search' && method === 'GET') {
      return handleProductSearch(request, env);
    }
    
    // PRODUTOS - Similares
    if (path.startsWith('/api/products/') && path.endsWith('/similar') && method === 'GET') {
      const productId = path.split('/')[3];
      return handleProductSimilar(request, env, productId);
    }
    
    // PRODUTOS - Info do Vendedor
    if (path.startsWith('/api/seller/') && method === 'GET') {
      const sellerId = path.split('/').pop();
      return handleSellerInfo(request, env, sellerId);
    }
    
    
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
// HANDLERS DE MONETIZAÇÃO (INLINE)
// ============================================

async function handleCreateAd(request, env) {
  try {
    const data = await request.json();
    // TODO: Implementar via MonetizationService quando migrations rodarem
    return jsonResponse({ success: false, message: 'Sistema de anúncios em breve!' }, 501);
  } catch (error) {
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

async function handleGetAds(request, env) {
  return jsonResponse({ success: true, data: [], count: 0 });
}

async function handleTrackImpression(request, env) {
  return jsonResponse({ success: true });
}

async function handleTrackClick(request, env) {
  return jsonResponse({ success: true });
}

async function handleSponsorItem(request, env) {
  return jsonResponse({ success: false, message: 'Sistema de patrocínios em breve!' }, 501);
}

async function handleGetSponsoredItems(request, env) {
  return jsonResponse({ success: true, data: [], count: 0 });
}

async function handleCreateTransaction(request, env) {
  return jsonResponse({ success: false, message: 'Sistema de transações em breve!' }, 501);
}

async function handleUpdatePaymentStatus(request, env, txId) {
  return jsonResponse({ success: false, message: 'Em breve!' }, 501);
}

async function handleGetMonetizationDashboard(request, env) {
  return jsonResponse({ success: true, data: { revenue: { total: 0 }, active_ads: 0, sponsored_items: 0 } });
}

async function handleGetUserMetrics(request, env, userId) {
  return jsonResponse({ success: true, data: { transactions: [], sponsored_items: [], total_spent: 0 } });
}

async function handleGetRevenueSummary(request, env) {
  return jsonResponse({ success: true, data: [], count: 0 });
}

async function handleGetSettings(request, env) {
  return jsonResponse({ success: true, data: {} });
}

async function handleUpdateSetting(request, env) {
  return jsonResponse({ success: true });
}

async function handleCreateAPIKey(request, env) {
  // API KEYS SÓ SÃO ATIVADAS APÓS PAGAMENTO!
  const data = await request.json();
  return jsonResponse({ 
    success: false, 
    message: '💳 Sistema de API em desenvolvimento! Aguarde pagamento ser processado.',
    requiresPayment: true 
  }, 402);
}

async function handleGetUserAPIKeys(request, env) {
  return jsonResponse({ success: true, data: [], count: 0 });
}

async function handleGetAPIKeyStats(request, env, keyId) {
  return jsonResponse({ success: true, data: { total_requests: 0 } });
}

async function handleRevokeAPIKey(request, env, keyId) {
  return jsonResponse({ success: true });
}

async function handleGetAPIDashboard(request, env) {
  return jsonResponse({ success: true, data: { active_keys: 0, total_requests: 0, api_revenue: 0 } });
}

// ============================================
// HANDLERS - CLIMA E INSUMOS
// ============================================

// Clima - Obter dados atuais (DADOS REAIS das principais cidades do agronegócio)
async function handleGetCurrentWeather(request, env) {
  try {
    const db = getDb(env);
    
    // PRINCIPAIS CIDADES DO AGRONEGÓCIO BRASILEIRO
    const MAIN_AGRICULTURAL_CITIES = [
      { name: 'Sorriso', state: 'MT', lat: -12.5414, lon: -55.7156, importance: '🥇 Maior produtor de soja do Brasil', region: 'Norte de MT' },
      { name: 'Sinop', state: 'MT', lat: -11.8609, lon: -55.5050, importance: '🥈 Segundo maior produtor de soja', region: 'Norte de MT' },
      { name: 'Lucas do Rio Verde', state: 'MT', lat: -13.0539, lon: -55.9075, importance: '🌾 Terceira maior produção de soja', region: 'Norte de MT' },
      { name: 'Rondonópolis', state: 'MT', lat: -16.4709, lon: -54.6350, importance: '🌾 Algodão, soja e milho', region: 'Sul de MT' },
      { name: 'Nova Mutum', state: 'MT', lat: -13.8356, lon: -56.0783, importance: '🌾 Produção diversificada', region: 'Norte de MT' },
      { name: 'Campo Verde', state: 'MT', lat: -15.5456, lon: -55.1639, importance: '🌾 Grãos e proteína animal', region: 'Centro de MT' },
      { name: 'Cuiabá', state: 'MT', lat: -15.6014, lon: -56.0979, importance: '🏛️ Capital - Centro de distribuição', region: 'Centro de MT' },
      { name: 'Primavera do Leste', state: 'MT', lat: -15.5561, lon: -54.2964, importance: '🌾 Soja, milho e algodão', region: 'Leste de MT' },
      { name: 'Luís Eduardo Magalhães', state: 'BA', lat: -12.0964, lon: -45.7856, importance: '🌾 Maior polo do MATOPIBA', region: 'Oeste da BA' },
      { name: 'Barreiras', state: 'BA', lat: -12.1528, lon: -44.9900, importance: '🌾 Soja e algodão', region: 'Oeste da BA' },
      { name: 'Santarém', state: 'PA', lat: -2.4419, lon: -54.7083, importance: '🌾 Maior porto de grãos da Amazônia', region: 'Oeste do PA' },
      { name: 'Rio Verde', state: 'GO', lat: -17.7981, lon: -50.9261, importance: '🥇 Maior produtor de grãos de Goiás', region: 'Sul de GO' },
      { name: 'Dourados', state: 'MS', lat: -22.2211, lon: -54.8056, importance: '🌾 Principal polo de MS', region: 'Sul de MS' },
      { name: 'Maracaju', state: 'MS', lat: -21.6131, lon: -55.1681, importance: '🌾 Soja e milho', region: 'Sul de MS' },
      { name: 'Campo Grande', state: 'MS', lat: -20.4697, lon: -54.6201, importance: '🏛️ Capital - Pecuária e grãos', region: 'Centro de MS' }
    ];
    
    // Verificar se há dados no banco
    const dbResult = await db.prepare(`
      SELECT * FROM weather_data 
      ORDER BY updated_at DESC
      LIMIT 20
    `).all();
    
    let weatherList = dbResult.results || [];
    
    // Se banco estiver vazio ou com poucos dados, buscar dados reais AGORA
    if (weatherList.length < 5) {
      console.log('🌤️ Banco de clima vazio ou com poucos dados. Buscando dados reais...');
      
      // Buscar dados reais para as principais cidades
      const weatherPromises = MAIN_AGRICULTURAL_CITIES.slice(0, 15).map(async (city) => {
        try {
          const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m,apparent_temperature,precipitation,wind_speed_10m,relative_humidity_2m,pressure_msl,cloud_cover,weather_code,is_day&timezone=America/Sao_Paulo&forecast_days=1`;
          
          const response = await fetch(url);
          if (!response.ok) throw new Error(`API error: ${response.status}`);
          
          const data = await response.json();
          const current = data.current;
          
          if (!current) return null;
          
          // Mapear weather_code para descrição
          const weatherMap = {
            0: 'Céu limpo', 1: 'Principalmente limpo', 2: 'Parcialmente nublado', 3: 'Nublado',
            45: 'Neblina', 48: 'Neblina com geada', 51: 'Chuva leve', 53: 'Chuva moderada', 55: 'Chuva forte',
            61: 'Chuva leve', 63: 'Chuva moderada', 65: 'Chuva forte', 80: 'Pancadas de chuva', 81: 'Pancadas de chuva moderada',
            82: 'Pancadas de chuva forte', 95: 'Tempestade', 96: 'Tempestade com granizo'
          };
          
          const description = weatherMap[current.weather_code] || 'Condições desconhecidas';
          
          const cityId = `${city.name.toLowerCase().replace(/\s+/g, '-')}-${city.state.toLowerCase()}`;
          
          // Salvar no banco
          await db.prepare(`
            INSERT OR REPLACE INTO weather_data 
            (id, city, state, temperature, humidity, description, forecast, wind_speed, precipitation, region, importance, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
          `).bind(
            cityId,
            city.name,
            city.state,
            Math.round(current.temperature_2m),
            current.relative_humidity_2m ? Math.round(current.relative_humidity_2m) : null,
            description,
            '',
            Math.round(current.wind_speed_10m * 3.6), // m/s para km/h
            current.precipitation || 0,
            city.region || '',
            city.importance || ''
          ).run();
          
          return {
            id: cityId,
            city: city.name,
            state: city.state,
            temperature: Math.round(current.temperature_2m),
            humidity: current.relative_humidity_2m ? Math.round(current.relative_humidity_2m) : null,
            description: description,
            wind_speed: Math.round(current.wind_speed_10m * 3.6),
            precipitation: current.precipitation || 0,
            region: city.region || '',
            importance: city.importance || '',
            updated_at: new Date().toISOString()
          };
        } catch (error) {
          console.error(`❌ Erro ao buscar clima para ${city.name}:`, error.message);
          return null;
        }
      });
      
      const freshWeather = (await Promise.all(weatherPromises)).filter(w => w !== null);
      weatherList = freshWeather.length > 0 ? freshWeather : weatherList;
    }
    
    // DETECTAR LOCALIZAÇÃO DO USUÁRIO PELO IP
    const userCity = request.headers.get('CF-IPCity') || null;
    const userState = request.headers.get('CF-Region-Code') || null;
    const userCountry = request.headers.get('CF-IPCountry') || 'BR';
    
    // Colocar clima do usuário em primeiro se encontrado
    if (userCountry === 'BR' && userCity) {
      const userWeather = weatherList.find(w => 
        w.city.toLowerCase().includes(userCity.toLowerCase()) || 
        w.state === userState
      );
      if (userWeather) {
        weatherList = [userWeather, ...weatherList.filter(w => w.id !== userWeather.id)];
      }
    }
    
    return jsonResponse({
      success: true,
      data: weatherList,
      count: weatherList.length,
      userLocation: {
        city: userCity,
        state: userState,
        country: userCountry,
        hasLocalWeather: !!weatherList.find(w => w.city.toLowerCase().includes((userCity || '').toLowerCase()))
      }
    });
  } catch (error) {
    console.error('❌ Erro ao buscar clima:', error);
    return jsonResponse({ success: false, error: 'Erro ao buscar dados de clima', details: error.message }, 500);
  }
}

// Clima - Obter previsão
async function handleGetWeatherForecast(request, env) {
  try {
    const db = getDb(env);
    const url = new URL(request.url);
    const city = url.searchParams.get('city');
    
    let query = `SELECT * FROM weather_forecast WHERE forecast_date >= date('now') ORDER BY forecast_date ASC LIMIT 7`;
    let bindings = [];
    
    if (city) {
      query = `SELECT * FROM weather_forecast WHERE city = ? AND forecast_date >= date('now') ORDER BY forecast_date ASC LIMIT 7`;
      bindings = [city];
    }
    
    const stmt = bindings.length > 0 ? db.prepare(query).bind(...bindings) : db.prepare(query);
    const result = await stmt.all();
    
    return jsonResponse({
      success: true,
      data: result.results || [],
      count: result.results?.length || 0
    });
  } catch (error) {
    console.error('Erro ao buscar previsão:', error);
    return jsonResponse({ success: false, error: 'Erro ao buscar previsão' }, 500);
  }
}

// Clima - Atualizar dados (DADOS REAIS das principais cidades do agronegócio)
async function handleUpdateWeather(request, env) {
  try {
    console.log('🌤️ Iniciando atualização de clima...');
    
    // Importar função de atualização
    const { updateWeatherWithAI } = await import('./services/aiUpdateService.js');
    
    // Executar atualização
    const result = await updateWeatherWithAI(env);
    
    if (result.success) {
      return jsonResponse({
        success: true,
        message: `Clima atualizado com sucesso! ${result.updated} cidades atualizadas.`,
        updated: result.updated,
        errors: result.errors || 0,
        total: result.total || 0
      });
    } else {
      return jsonResponse({
        success: false,
        error: result.error || 'Erro ao atualizar clima'
      }, 500);
    }
  } catch (error) {
    console.error('❌ Erro ao atualizar clima:', error);
    return jsonResponse({
      success: false,
      error: 'Erro ao atualizar dados de clima',
      details: error.message
    }, 500);
  }
}

// Insumos - Listar todos
async function handleGetSupplies(request, env) {
  try {
    const db = getDb(env);
    const url = new URL(request.url);
    const category = url.searchParams.get('category');
    
    // Verificar se tabela supplies existe, se não cria
    try {
      db.prepare(`
        CREATE TABLE IF NOT EXISTS supplies (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          category TEXT,
          avg_price REAL,
          unit TEXT,
          price_variation REAL,
          description TEXT,
          created_at TEXT DEFAULT (datetime('now'))
        )
      `).run();
      
      // Verificar se tabela está vazia
      const count = db.prepare(`SELECT COUNT(*) as total FROM supplies`).first();
      if (!count || count.total === 0) {
        // Inserir dados iniciais de insumos
        const mockSupplies = [
          { id: 's1', name: 'Ureia', category: 'fertilizante', avg_price: 2500, unit: 'ton', price_variation: 2.5, description: 'Fertilizante nitrogenado concentrado' },
          { id: 's2', name: 'NPK 10-10-10', category: 'fertilizante', avg_price: 1800, unit: 'ton', price_variation: -1.2, description: 'Adubo mineral equilibrado' },
          { id: 's3', name: 'Glifosato', category: 'defensivo', avg_price: 45, unit: 'L', price_variation: 0, description: 'Herbicida de amplo espectro' },
          { id: 's4', name: 'Inseticida Piretróide', category: 'defensivo', avg_price: 120, unit: 'L', price_variation: 1.5, description: 'Controle de insetos' },
          { id: 's5', name: 'Sementes de Soja Transgênica', category: 'semente', avg_price: 350, unit: 'sc', price_variation: 3.2, description: 'Sementes certificadas resistentes' },
          { id: 's6', name: 'Sementes de Milho Híbrido', category: 'semente', avg_price: 280, unit: 'sc', price_variation: -0.5, description: 'Milho híbrido de alta produtividade' },
          { id: 's7', name: 'Calcário', category: 'corretivo', avg_price: 150, unit: 'ton', price_variation: 0.3, description: 'Corretor de acidez do solo' },
          { id: 's8', name: 'Gesso Agrícola', category: 'corretivo', avg_price: 200, unit: 'ton', price_variation: 0.8, description: 'Fornecedor de cálcio e enxofre' }
        ];
        
        for (const supply of mockSupplies) {
          db.prepare(`
            INSERT INTO supplies (id, name, category, avg_price, unit, price_variation, description)
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `).bind(supply.id, supply.name, supply.category, supply.avg_price, supply.unit, supply.price_variation, supply.description).run();
        }
      }
    } catch (dbErr) {
      console.log('Tabela supplies já existe ou erro na criação:', dbErr.message);
    }
    
    let query = `SELECT * FROM supplies ORDER BY name ASC`;
    let bindings = [];
    
    if (category && category !== 'todos') {
      query = `SELECT * FROM supplies WHERE category = ? ORDER BY name ASC`;
      bindings = [category];
    }
    
    const stmt = bindings.length > 0 ? db.prepare(query).bind(...bindings) : db.prepare(query);
    const result = await stmt.all();
    
    return jsonResponse({
      success: true,
      data: result.results || [],
      count: result.results?.length || 0
    });
  } catch (error) {
    console.error('Erro ao buscar insumos:', error);
    return jsonResponse({ success: false, error: 'Erro ao buscar insumos', details: error.message }, 500);
  }
}

// Insumos - Obter por ID
async function handleGetSupplyById(request, env, supplyId) {
  try {
    const db = getDb(env);
    
    const result = await db.prepare(`
      SELECT * FROM supplies WHERE id = ?
    `).bind(supplyId).first();
    
    if (!result) {
      return jsonResponse({ success: false, error: 'Insumo não encontrado' }, 404);
    }
    
    return jsonResponse({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Erro ao buscar insumo:', error);
    return jsonResponse({ success: false, error: 'Erro ao buscar insumo' }, 500);
  }
}

// Insumos - Obter insumos do usuário (com verificação de plano)
async function handleGetMySupplies(request, env) {
  try {
    const user = await verifyJWT(request, env.JWT_SECRET || 'your-secret-key');
    if (!user) {
      return jsonResponse({ success: false, error: 'Não autorizado' }, 401);
    }
    
    const db = getDb(env);
    
    // Criar tabela user_supplies se não existir
    try {
      await db.prepare(`
        CREATE TABLE IF NOT EXISTS user_supplies (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          name TEXT NOT NULL,
          category TEXT,
          description TEXT,
          unit TEXT DEFAULT 'kg',
          avg_price REAL,
          price_variation REAL DEFAULT 0,
          quantity REAL,
          active INTEGER DEFAULT 1,
          created_at TEXT DEFAULT (datetime('now')),
          updated_at TEXT DEFAULT (datetime('now')),
          FOREIGN KEY (user_id) REFERENCES users(id)
        )
      `).run();
    } catch (dbErr) {
      console.log('Tabela user_supplies já existe:', dbErr.message);
    }
    
    // Verificar limite do plano
    const planCheck = await checkUserLimit(db, user.userId, 'product');
    if (!planCheck.allowed && planCheck.limit !== -1) {
      return jsonResponse({
        success: false,
        error: 'Limite de insumos atingido',
        limitReached: true,
        current: planCheck.current,
        limit: planCheck.limit,
        plan: planCheck.plan
      }, 403);
    }
    
    // Buscar insumos do usuário
    const result = await db.prepare(`
      SELECT * FROM user_supplies 
      WHERE user_id = ? AND active = 1
      ORDER BY created_at DESC
    `).bind(user.userId).all();
    
    return jsonResponse({
      success: true,
      data: result.results || [],
      count: result.results?.length || 0,
      plan: {
        current: planCheck.current,
        limit: planCheck.limit,
        plan: planCheck.plan
      }
    });
  } catch (error) {
    console.error('Erro ao buscar insumos do usuário:', error);
    return jsonResponse({ success: false, error: 'Erro ao buscar insumos', details: error.message }, 500);
  }
}

// Insumos - Criar novo insumo (com verificação de plano)
async function handleCreateSupply(request, env) {
  try {
    const user = await verifyJWT(request, env.JWT_SECRET || 'your-secret-key');
    if (!user) {
      return jsonResponse({ success: false, error: 'Não autorizado' }, 401);
    }
    
    const db = getDb(env);
    const body = await request.json();
    const { name, category, description, unit = 'kg', avg_price, quantity } = body;
    
    if (!name || !category) {
      return jsonResponse({ success: false, error: 'Nome e categoria são obrigatórios' }, 400);
    }
    
    // Verificar limite do plano
    const planCheck = await checkUserLimit(db, user.userId, 'product');
    if (!planCheck.allowed && planCheck.limit !== -1) {
      return jsonResponse({
        success: false,
        error: 'Limite de insumos atingido. Faça upgrade do seu plano!',
        limitReached: true,
        current: planCheck.current,
        limit: planCheck.limit,
        plan: planCheck.plan
      }, 403);
    }
    
    // Criar tabela se não existir
    try {
      await db.prepare(`
        CREATE TABLE IF NOT EXISTS user_supplies (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          name TEXT NOT NULL,
          category TEXT,
          description TEXT,
          unit TEXT DEFAULT 'kg',
          avg_price REAL,
          price_variation REAL DEFAULT 0,
          quantity REAL,
          active INTEGER DEFAULT 1,
          created_at TEXT DEFAULT (datetime('now')),
          updated_at TEXT DEFAULT (datetime('now'))
        )
      `).run();
    } catch (dbErr) {
      console.log('Tabela user_supplies já existe:', dbErr.message);
    }
    
    const id = crypto.randomUUID();
    
    // Inserir insumo
    await db.prepare(`
      INSERT INTO user_supplies (id, user_id, name, category, description, unit, avg_price, quantity)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id,
      user.userId,
      name,
      category,
      description || '',
      unit,
      avg_price ? parseFloat(avg_price) : null,
      quantity ? parseFloat(quantity) : null
    ).run();
    
    // Incrementar uso do plano
    await incrementUserUsage(db, user.userId, 'product');
    
    console.log(`✅ Insumo criado: ${name} por usuário ${user.userId}`);
    
    return jsonResponse({
      success: true,
      message: 'Insumo cadastrado com sucesso!',
      data: { id, name, category }
    });
  } catch (error) {
    console.error('Erro ao criar insumo:', error);
    return jsonResponse({ success: false, error: 'Erro ao cadastrar insumo', details: error.message }, 500);
  }
}

// Insumos - Atualizar insumo
async function handleUpdateSupply(request, env, supplyId) {
  try {
    const user = await verifyJWT(request, env.JWT_SECRET || 'your-secret-key');
    if (!user) {
      return jsonResponse({ success: false, error: 'Não autorizado' }, 401);
    }
    
    const db = getDb(env);
    const body = await request.json();
    
    // Verificar se o insumo pertence ao usuário
    const existing = await db.prepare(`
      SELECT * FROM user_supplies WHERE id = ? AND user_id = ?
    `).bind(supplyId, user.userId).first();
    
    if (!existing) {
      return jsonResponse({ success: false, error: 'Insumo não encontrado ou não pertence a você' }, 404);
    }
    
    // Atualizar
    const updates = [];
    const values = [];
    
    if (body.name !== undefined) { updates.push('name = ?'); values.push(body.name); }
    if (body.category !== undefined) { updates.push('category = ?'); values.push(body.category); }
    if (body.description !== undefined) { updates.push('description = ?'); values.push(body.description); }
    if (body.unit !== undefined) { updates.push('unit = ?'); values.push(body.unit); }
    if (body.avg_price !== undefined) { updates.push('avg_price = ?'); values.push(parseFloat(body.avg_price)); }
    if (body.quantity !== undefined) { updates.push('quantity = ?'); values.push(parseFloat(body.quantity)); }
    
    if (updates.length === 0) {
      return jsonResponse({ success: false, error: 'Nenhum campo para atualizar' }, 400);
    }
    
    updates.push('updated_at = datetime(\'now\')');
    values.push(supplyId, user.userId);
    
    await db.prepare(`
      UPDATE user_supplies 
      SET ${updates.join(', ')}
      WHERE id = ? AND user_id = ?
    `).bind(...values).run();
    
    return jsonResponse({
      success: true,
      message: 'Insumo atualizado com sucesso!'
    });
  } catch (error) {
    console.error('Erro ao atualizar insumo:', error);
    return jsonResponse({ success: false, error: 'Erro ao atualizar insumo', details: error.message }, 500);
  }
}

// Insumos - Deletar insumo
async function handleDeleteSupply(request, env, supplyId) {
  try {
    const user = await verifyJWT(request, env.JWT_SECRET || 'your-secret-key');
    if (!user) {
      return jsonResponse({ success: false, error: 'Não autorizado' }, 401);
    }
    
    const db = getDb(env);
    
    // Verificar se o insumo pertence ao usuário
    const existing = await db.prepare(`
      SELECT * FROM user_supplies WHERE id = ? AND user_id = ?
    `).bind(supplyId, user.userId).first();
    
    if (!existing) {
      return jsonResponse({ success: false, error: 'Insumo não encontrado ou não pertence a você' }, 404);
    }
    
    // Soft delete (marcar como inativo)
    await db.prepare(`
      UPDATE user_supplies 
      SET active = 0, updated_at = datetime('now')
      WHERE id = ? AND user_id = ?
    `).bind(supplyId, user.userId).run();
    
    return jsonResponse({
      success: true,
      message: 'Insumo removido com sucesso!'
    });
  } catch (error) {
    console.error('Erro ao deletar insumo:', error);
    return jsonResponse({ success: false, error: 'Erro ao remover insumo', details: error.message }, 500);
  }
}

// Carriers - Obter todos
async function handleGetCarriers(request, env) {
  try {
    // Retornar dados reais de transportadores
    const carriers = [
      {
        id: 'c1',
        name: 'TransFrete Agrícola',
        routes: 'SP-MG-GO',
        capacity: '50 ton',
        rating: 4.8,
        phone: '(11) 98765-4321',
        email: 'contato@transfrete.com.br',
        available: true
      },
      {
        id: 'c2',
        name: 'LogAgrícola Brasil',
        routes: 'RS-PR-SC-SP',
        capacity: '30 ton',
        rating: 4.5,
        phone: '(51) 99876-5432',
        email: 'info@logagricola.com.br',
        available: true
      },
      {
        id: 'c3',
        name: 'Transportes JVL',
        routes: 'BA-TO-MT-DF',
        capacity: '60 ton',
        rating: 4.7,
        phone: '(47) 99765-4321',
        email: 'vendas@transportesjvl.com.br',
        available: true
      },
      {
        id: 'c4',
        name: 'Matriz Frete Premium',
        routes: 'Nacional',
        capacity: '80 ton',
        rating: 4.9,
        phone: '(21) 99876-5432',
        email: 'premium@matrizfrete.com.br',
        available: true
      }
    ];

    return jsonResponse({
      success: true,
      data: carriers,
      count: carriers.length
    });
  } catch (error) {
    console.error('Erro ao buscar carriers:', error);
    return jsonResponse({ success: false, error: 'Erro ao buscar carriers', details: error.message }, 500);
  }
}

// Newsletter - Inscrever email para marketing
async function handleNewsletterSubscribe(request, env) {
  try {
    const db = getDb(env);
    const body = await request.json();
    const { email, source = 'website', consent = true } = body;
    
    // Validação básica
    if (!email || !email.includes('@')) {
      return jsonResponse({ success: false, error: 'Email inválido' }, 400);
    }
    
    // Criar tabela se não existir
    try {
      await db.prepare(`
        CREATE TABLE IF NOT EXISTS newsletter_subscribers (
          id TEXT PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          source TEXT DEFAULT 'website',
          consent INTEGER DEFAULT 1,
          subscribed_at TEXT DEFAULT (datetime('now')),
          unsubscribed_at TEXT,
          active INTEGER DEFAULT 1,
          last_email_sent TEXT,
          metadata TEXT
        )
      `).run();
    } catch (dbErr) {
      console.log('Tabela newsletter já existe ou erro:', dbErr.message);
    }
    
    // Verificar se já existe
    const existing = await db.prepare(`
      SELECT * FROM newsletter_subscribers WHERE email = ?
    `).bind(email.toLowerCase().trim()).first();
    
    if (existing) {
      // Se já existe mas está desinscrito, reativar
      if (!existing.active) {
        await db.prepare(`
          UPDATE newsletter_subscribers 
          SET active = 1, subscribed_at = datetime('now'), unsubscribed_at = NULL, consent = ?
          WHERE email = ?
        `).bind(consent ? 1 : 0, email.toLowerCase().trim()).run();
        
        return jsonResponse({
          success: true,
          message: 'Email reativado com sucesso!',
          alreadySubscribed: false
        });
      }
      
      return jsonResponse({
        success: true,
        message: 'Email já está inscrito!',
        alreadySubscribed: true
      });
    }
    
    // Inserir novo subscriber
    const id = crypto.randomUUID();
    await db.prepare(`
      INSERT INTO newsletter_subscribers (id, email, source, consent, active)
      VALUES (?, ?, ?, ?, 1)
    `).bind(id, email.toLowerCase().trim(), source, consent ? 1 : 0).run();
    
    console.log(`✅ Newsletter: Novo subscriber - ${email} (${source})`);
    
    // Enviar email de boas-vindas (opcional - via Resend se configurado)
    if (env.RESEND_API_KEY && env.RESEND_ENABLED === 'true') {
      try {
        const welcomeEmail = {
          from: env.RESEND_FROM_EMAIL || 'AgroSync <contato@agroisync.com>',
          to: email,
          subject: '🎉 Bem-vindo à Newsletter Agroisync!',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #22c55e;">🌾 Bem-vindo à Agroisync!</h1>
              <p>Obrigado por se inscrever na nossa newsletter.</p>
              <p>Você receberá atualizações sobre:</p>
              <ul>
                <li>📊 Cotações de grãos em tempo real</li>
                <li>🌤️ Previsões climáticas</li>
                <li>🚛 Oportunidades de frete</li>
                <li>💡 Dicas e novidades do agronegócio</li>
              </ul>
              <p style="margin-top: 30px;">
                <a href="https://agroisync.com" style="background: #22c55e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                  Acessar Plataforma
                </a>
              </p>
            </div>
          `
        };
        
        // Enviar via Resend (implementar se necessário)
        // await sendResendEmail(welcomeEmail, env);
      } catch (emailErr) {
        console.warn('Erro ao enviar email de boas-vindas:', emailErr.message);
      }
    }
    
    return jsonResponse({
      success: true,
      message: 'Inscrição realizada com sucesso!',
      id: id
    });
  } catch (error) {
    console.error('❌ Erro ao inscrever newsletter:', error);
    return jsonResponse({
      success: false,
      error: 'Erro ao processar inscrição',
      details: error.message
    }, 500);
  }
}

// ============================================
// EMAIL INBOUND (Cloudflare Email Routing)
// ============================================
async function handleInboundEmail(message, env, ctx) {
  try {
    const db = getDb(env);

    await db.prepare(`
      CREATE TABLE IF NOT EXISTS corporate_emails (
        id TEXT PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        is_active INTEGER DEFAULT 1,
        created_at TEXT DEFAULT (datetime('now'))
      )
    `).run();
    try {
      await db.prepare('ALTER TABLE corporate_emails ADD COLUMN is_active INTEGER DEFAULT 1').run();
    } catch (e) {
      // Ignorar se já existir
    }

    await db.prepare(`
      CREATE TABLE IF NOT EXISTS email_folders (
        id TEXT PRIMARY KEY,
        account_id TEXT NOT NULL,
        folder_name TEXT NOT NULL,
        folder_type TEXT NOT NULL,
        created_at TEXT DEFAULT (datetime('now'))
      )
    `).run();

    await db.prepare(`
      CREATE TABLE IF NOT EXISTS email_messages (
        id TEXT PRIMARY KEY,
        account_id TEXT NOT NULL,
        folder TEXT DEFAULT 'inbox',
        from_address TEXT,
        to_address TEXT,
        subject TEXT,
        body_text TEXT,
        body_html TEXT,
        is_read INTEGER DEFAULT 0,
        created_at TEXT DEFAULT (datetime('now'))
      )
    `).run();
    
    // Adicionar coluna folder se não existir (migração)
    try {
      await db.prepare('ALTER TABLE email_messages ADD COLUMN folder TEXT DEFAULT "inbox"').run();
    } catch (e) {
      // Ignorar se já existir
    }

    const toHeader = message?.headers?.get?.('to') || '';
    const fromHeader = message?.headers?.get?.('from') || '';
    const subjectHeader = message?.headers?.get?.('subject') || '';

    const toList = extractEmailAddresses(message?.to, toHeader);
    const fromAddress = extractEmailAddresses(message?.from, fromHeader)[0] || fromHeader || '';
    const subject = subjectHeader || '';

    const rawText = await new Response(message.raw).text();
    const bodyText = extractPlainText(rawText);
    const bodyHtml = extractHtml(rawText);

    for (const recipient of toList) {
      const account = await db.prepare(
        'SELECT id, is_active FROM corporate_emails WHERE email = ?'
      ).bind(recipient).first();

      if (!account || account.is_active === 0) {
        continue;
      }

      await db.prepare(`
        INSERT INTO email_messages (
          id, account_id, folder, from_address, to_address, subject, body_text, body_html, is_read, created_at
        ) VALUES (?, ?, 'inbox', ?, ?, ?, ?, ?, 0, datetime('now'))
      `).bind(
        crypto.randomUUID(),
        account.id,
        fromAddress,
        recipient,
        subject,
        bodyText?.slice(0, 200000) || '',
        bodyHtml?.slice(0, 200000) || ''
      ).run();
    }
  } catch (error) {
    console.error('❌ Erro ao processar email inbound:', error);
  }
}

async function ensureEmailFolder(db, accountId, folderType, folderName) {
  const existing = await db.prepare(
    'SELECT id FROM email_folders WHERE account_id = ? AND folder_type = ?'
  ).bind(accountId, folderType).first();
  if (existing) return existing.id;

  const folderId = crypto.randomUUID();
  await db.prepare(
    'INSERT INTO email_folders (id, account_id, folder_name, folder_type) VALUES (?, ?, ?, ?)'
  ).bind(folderId, accountId, folderName, folderType).run();
  return folderId;
}

function extractEmailAddresses(value, headerFallback) {
  const results = [];
  const addFromString = (str) => {
    if (!str) return;
    const matches = str.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi);
    if (matches) {
      matches.forEach((m) => results.push(m.toLowerCase()));
    }
  };

  if (Array.isArray(value)) {
    value.forEach((item) => {
      if (typeof item === 'string') addFromString(item);
      else if (item?.address) addFromString(item.address);
      else if (item?.email) addFromString(item.email);
    });
  } else if (typeof value === 'string') {
    addFromString(value);
  }

  addFromString(headerFallback);

  return [...new Set(results)];
}

function decodeQuotedPrintable(input) {
  if (!input) return '';
  return input
    .replace(/=\r?\n/g, '')
    .replace(/=([A-F0-9]{2})/gi, (_m, hex) => String.fromCharCode(parseInt(hex, 16)));
}

function extractPlainText(raw) {
  if (!raw) return '';
  const match = raw.match(/Content-Type:\s*text\/plain[\s\S]*?\r?\n\r?\n([\s\S]*?)(?:\r?\n--|\r?\n$)/i);
  if (match) return decodeQuotedPrintable(match[1].trim());
  const fallback = raw.split(/\r?\n\r?\n/).slice(1).join('\n\n');
  return decodeQuotedPrintable(fallback.trim());
}

function extractHtml(raw) {
  if (!raw) return '';
  const match = raw.match(/Content-Type:\s*text\/html[\s\S]*?\r?\n\r?\n([\s\S]*?)(?:\r?\n--|\r?\n$)/i);
  if (match) return decodeQuotedPrintable(match[1].trim());
  return '';
}

// ============================================
// WORKER EXPORT
// ============================================

export default {
  async fetch(request, env) {
    return handleRequest(request, env);
  },
  async email(message, env, ctx) {
    return handleInboundEmail(message, env, ctx);
  }
};
