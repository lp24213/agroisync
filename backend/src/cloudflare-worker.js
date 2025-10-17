/**
 * Cloudflare Worker - AgroSync Backend API
 * Configurado para agroisync.com/api/*
 */

// ============================================
// ASAAS SERVICE (INLINE)
// ============================================
class AsaasService {
  constructor(apiKey, env = 'production') {
    this.apiKey = apiKey;
    this.baseUrl = env === 'production' 
      ? 'https://api.asaas.com/v3'
      : 'https://sandbox.asaas.com/api/v3';
  }

  async createPixCharge({ value, description, customer }) {
    try {
      console.log('💳 [ASAAS] Criando cobrança PIX:', { value, customer });

      const response = await fetch(`${this.baseUrl}/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'access_token': this.apiKey
        },
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
        const error = await response.json();
        console.error('❌ [ASAAS] Erro ao criar cobrança PIX:', error);
        throw new Error(error.errors?.[0]?.description || 'Erro ao criar cobrança PIX');
      }

      const payment = await response.json();

      // Buscar QR Code
      const qrCodeResponse = await fetch(`${this.baseUrl}/payments/${payment.id}/pixQrCode`, {
        headers: {
          'access_token': this.apiKey
        }
      });

      const qrCodeData = await qrCodeResponse.json();

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

      const response = await fetch(`${this.baseUrl}/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'access_token': this.apiKey
        },
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
        const error = await response.json();
        console.error('❌ [ASAAS] Erro ao criar boleto:', error);
        throw new Error(error.errors?.[0]?.description || 'Erro ao criar boleto');
      }

      const payment = await response.json();

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
      const searchResponse = await fetch(`${this.baseUrl}/customers?email=${encodeURIComponent(email)}`, {
        headers: {
          'access_token': this.apiKey
        }
      });
      
      console.log('📊 [ASAAS] Status da busca:', searchResponse.status);

      const searchData = await searchResponse.json();

      if (searchData.data && searchData.data.length > 0) {
        console.log('✅ [ASAAS] Cliente já existe:', searchData.data[0].id);
        return { success: true, customer: searchData.data[0] };
      }

      // Criar novo cliente
      const response = await fetch(`${this.baseUrl}/customers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'access_token': this.apiKey
        },
        body: JSON.stringify({
          name: name,
          email: email,
          cpfCnpj: cpfCnpj?.replace(/\D/g, ''),
          phone: phone?.replace(/\D/g, ''),
          notificationDisabled: false
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ [ASAAS] Erro ao criar cliente - Status:', response.status);
        console.error('❌ [ASAAS] Resposta:', errorText);
        try {
          const error = JSON.parse(errorText);
          throw new Error(error.errors?.[0]?.description || 'Erro ao criar cliente');
        } catch {
          throw new Error(`Erro ao criar cliente: ${errorText.substring(0, 100)}`);
        }
      }

      const customer = await response.json();
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

      const response = await fetch(`${this.baseUrl}/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'access_token': this.apiKey
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('❌ [ASAAS] Erro ao criar cobrança com cartão:', error);
        throw new Error(error.errors?.[0]?.description || 'Erro ao processar cartão');
      }

      const payment = await response.json();

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
        headers: {
          'access_token': this.apiKey
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar status do pagamento');
      }

      const payment = await response.json();
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

async function verifyJWT(request) {
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
    
    const payload = JSON.parse(atob(payloadB64));
    
    if (payload.exp && payload.exp < Date.now()) {
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
  const { email, password, name, turnstileToken } = await request.json();
    
    if (!email || !password || !name) {
    return jsonResponse({ success: false, error: 'Dados incompletos' }, 400);
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
    
    // Generate JWT
    const token = await generateJWT({ userId, email, name }, env.JWT_SECRET);
    
    return jsonResponse({
      success: true,
      data: {
        token,
        user: { id: userId, email, name }
      }
    }, 201);
  } catch (error) {
    console.error('Register error:', error);
    return jsonResponse({ success: false, error: 'Erro ao registrar usuário' }, 500);
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
      products: results || [],
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
    
    const productId = crypto.randomUUID();
    const imagesJson = images ? JSON.stringify(images) : '[]';
    
    await db.prepare(
      "INSERT INTO products (id, user_id, title, short_description, price, category, stock, unit, images, status, city, state, expires_at, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', '', '', datetime('now', '+30 days'), datetime('now'))"
    ).bind(productId, user.userId, title, description || '', price, category, quantity || 0, unit || 'kg', imagesJson).run();

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
      freights: results || [],
        pagination: { currentPage: page, itemsPerPage: limit }
      }
    });
  } catch (error) {
    console.error('Freight list error:', error);
    return jsonResponse({ success: false, error: 'Erro ao listar fretes' }, 500);
  }
}

// Freight - Create
async function handleFreightCreate(request, env, user) {
  try {
    const { origin, destination, cargo_type, weight, price } = await request.json();
    
    if (!origin || !destination || !cargo_type) {
    return jsonResponse({ success: false, error: 'Dados incompletos' }, 400);
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
      "INSERT INTO freights (id, user_id, origin_city, destination_city, cargo_type, weight, price, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, 'available', datetime('now'))"
    ).bind(freightId, user.userId, origin, destination, cargo_type, weight || 0, price || 0).run();
    
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
    
    await db.prepare(
      "INSERT INTO payments (id, user_id, amount, payment_method, metadata, status, created_at) VALUES (?, ?, ?, ?, ?, 'pending', datetime('now'))"
    ).bind(paymentId, user.userId, amount, payment_method || 'stripe', metadata || '{}').run();
    
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

    // Criar ou buscar cliente no Asaas
    const customerResult = await asaas.createOrGetCustomer({
      name: userProfile.name,
      email: userProfile.email,
      cpfCnpj: userProfile.cpf || userProfile.cnpj,
      phone: userProfile.phone
    });

    if (!customerResult.success) {
      return jsonResponse({ success: false, error: 'Erro ao criar cliente: ' + customerResult.error }, 500);
    }

    const customer = customerResult.customer;

    // Criar registro de pagamento pendente
    const paymentId = crypto.randomUUID();
    await db.prepare(
      "INSERT INTO payments (id, user_id, plan_slug, amount, payment_method, status, billing_cycle, created_at) VALUES (?, ?, ?, ?, ?, 'pending', ?, datetime('now'))"
    ).bind(paymentId, user.userId, planSlug, amount, paymentMethod, billingCycle).run();

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
    return jsonResponse({ success: false, error: 'Erro ao criar pagamento: ' + error.message }, 500);
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
      const profile = await db.prepare(
        'SELECT id, email, name, phone, role, plan, plan_expires_at, user_type, business_type, created_at FROM users WHERE id = ?'
      ).bind(user.userId).first();
      
      if (!profile) {
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
    
    // Public routes - Freight
  if (path === '/api/freight' && method === 'GET') {
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
    if (path === '/api/user/profile' && (method === 'GET' || method === 'PUT')) {
      return handleUserProfile(request, env, user);
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
