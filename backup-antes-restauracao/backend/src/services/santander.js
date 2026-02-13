// ============================================
// SANTANDER API INTEGRATION
// ============================================
// API Documentation: https://developer.santander.com.br/

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

  // ============================================
  // AUTENTICAÇÃO (OAuth 2.0)
  // ============================================
  async authenticate() {
    try {
      // Se já temos token válido, retornar
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
      // Token expira em 1 hora, renovar 5 min antes
      this.tokenExpiry = Date.now() + ((data.expires_in || 3600) - 300) * 1000;

      console.log('✅ Autenticado no Santander');
      return this.accessToken;
    } catch (error) {
      console.error('❌ Erro na autenticação:', error);
      throw error;
    }
  }

  // ============================================
  // PIX - GERAR QR CODE DINÂMICO
  // ============================================
  async createPixQRCode({ amount, description, customerName, customerDocument, expiresIn = 3600 }) {
    try {
      const token = await this.authenticate();

      const txid = this.generateTxid(); // ID único da transação (26-35 caracteres)
      
      const payload = {
        calendario: {
          expiracao: expiresIn // Segundos até expirar
        },
        devedor: {
          cpf: customerDocument.replace(/\D/g, '').substring(0, 11), // CPF
          nome: customerName
        },
        valor: {
          original: amount.toFixed(2) // Formato: "99.90"
        },
        chave: this.clientId, // Sua chave PIX (pode ser diferente, verificar no portal)
        solicitacaoPagador: description || 'Pagamento AgroSync',
        infoAdicionais: [
          {
            nome: 'Plataforma',
            valor: 'AgroSync'
          }
        ]
      };

      console.log('🔄 Gerando QR Code PIX:', { txid, amount });

      const response = await fetch(`${this.baseUrl}/pix/v2/cob/${txid}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-Application-Key': this.clientId
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('❌ Erro ao gerar PIX:', error);
        throw new Error(error.message || 'Erro ao gerar QR Code PIX');
      }

      const data = await response.json();

      console.log('✅ QR Code PIX gerado:', data.txid);

      // Buscar QR Code em base64
      const qrCodeResponse = await fetch(`${this.baseUrl}/pix/v2/cob/${txid}/qrcode`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-Application-Key': this.clientId
        }
      });

      const qrCodeData = await qrCodeResponse.json();

      return {
        success: true,
        txid: data.txid,
        status: data.status,
        location: data.location,
        qrCode: qrCodeData.imagemQrcode, // Base64
        qrCodeText: qrCodeData.qrcode, // PIX copia e cola
        expiresAt: new Date(Date.now() + expiresIn * 1000).toISOString()
      };
    } catch (error) {
      console.error('❌ Erro ao criar PIX:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // ============================================
  // PIX - CONSULTAR STATUS
  // ============================================
  async checkPixStatus(txid) {
    try {
      const token = await this.authenticate();

      const response = await fetch(`${this.baseUrl}/pix/v2/cob/${txid}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-Application-Key': this.clientId
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao consultar status do PIX');
      }

      const data = await response.json();

      return {
        success: true,
        status: data.status, // ATIVA, CONCLUIDA, REMOVIDA_PELO_USUARIO_RECEBEDOR
        txid: data.txid,
        amount: data.valor?.original,
        paidAt: data.pix?.[0]?.horario
      };
    } catch (error) {
      console.error('❌ Erro ao consultar PIX:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // ============================================
  // BOLETO - EMITIR
  // ============================================
  async createBoleto({ amount, customerName, customerDocument, customerEmail, dueDate, description }) {
    try {
      const token = await this.authenticate();

      const payload = {
        beneficiario: {
          nome: 'AgroSync', // Seu nome/empresa
          documento: '00000000000000', // Seu CNPJ (configurar)
          agencia: '0000', // Sua agência (configurar)
          conta: '00000000', // Sua conta (configurar)
          convenio: '0000000' // Seu convênio (configurar)
        },
        pagador: {
          nome: customerName,
          documento: customerDocument.replace(/\D/g, ''),
          email: customerEmail,
          endereco: {
            logradouro: '',
            numero: '',
            bairro: '',
            cidade: '',
            uf: '',
            cep: ''
          }
        },
        dataVencimento: dueDate, // Formato: YYYY-MM-DD
        valor: amount.toFixed(2),
        numeroTitulo: this.generateBoletoNumber(),
        descricao: description || 'Pagamento AgroSync',
        instrucoes: [
          'Não receber após o vencimento',
          'Em caso de dúvidas, entre em contato: contato@agroisync.com'
        ],
        multa: {
          percentual: 2.0, // 2% após vencimento
          dataInicio: this.addDays(dueDate, 1)
        },
        juros: {
          percentual: 0.033, // 1% ao mês (0.033% ao dia)
          dataInicio: this.addDays(dueDate, 1)
        }
      };

      console.log('🔄 Gerando boleto:', { amount, dueDate });

      const response = await fetch(`${this.baseUrl}/cobranca/v1/boletos`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-Application-Key': this.clientId
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('❌ Erro ao gerar boleto:', error);
        throw new Error(error.message || 'Erro ao gerar boleto');
      }

      const data = await response.json();

      console.log('✅ Boleto gerado:', data.nossoNumero);

      return {
        success: true,
        boletoId: data.nossoNumero,
        barcode: data.linhaDigitavel,
        barcodeNumber: data.codigoBarras,
        pdfUrl: data.urlBoleto,
        dueDate: data.dataVencimento,
        amount: data.valor
      };
    } catch (error) {
      console.error('❌ Erro ao criar boleto:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // ============================================
  // BOLETO - CONSULTAR STATUS
  // ============================================
  async checkBoletoStatus(boletoId) {
    try {
      const token = await this.authenticate();

      const response = await fetch(`${this.baseUrl}/cobranca/v1/boletos/${boletoId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-Application-Key': this.clientId
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao consultar status do boleto');
      }

      const data = await response.json();

      return {
        success: true,
        status: data.situacao, // REGISTRADO, LIQUIDADO, BAIXADO
        boletoId: data.nossoNumero,
        amount: data.valor,
        paidAt: data.dataLiquidacao
      };
    } catch (error) {
      console.error('❌ Erro ao consultar boleto:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // ============================================
  // WEBHOOKS - PROCESSAR NOTIFICAÇÃO
  // ============================================
  async processWebhook(payload, signature, secret) {
    try {
      // Validar assinatura HMAC
      const isValid = await this.validateSignature(payload, signature, secret);
      
      if (!isValid) {
        console.error('❌ Assinatura inválida do webhook');
        return { success: false, error: 'Assinatura inválida' };
      }

      const data = JSON.parse(payload);

      console.log('📥 Webhook recebido:', data.tipo);

      // PIX recebido
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

      // Boleto pago
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

  // ============================================
  // HELPERS
  // ============================================

  generateTxid() {
    // Gerar ID único de 26-35 caracteres alfanuméricos
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let txid = '';
    for (let i = 0; i < 32; i++) {
      txid += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return txid;
  }

  generateBoletoNumber() {
    // Gerar número único do boleto
    return Date.now().toString() + Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  }

  addDays(dateString, days) {
    const date = new Date(dateString);
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
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

// Export
export default SantanderService;

