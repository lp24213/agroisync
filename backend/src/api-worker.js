export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Health check
    if (url.pathname === '/api/health') {
      return new Response(
        JSON.stringify({
          status: 'ok',
          timestamp: new Date().toISOString(),
          service: 'AgroSync API',
          version: '1.0.0'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // SMS Send Code
    if (url.pathname === '/api/sms/send-code' && request.method === 'POST') {
      try {
        const { phone } = await request.json();
        
        if (!phone) {
          return new Response(
            JSON.stringify({
              success: false,
              message: 'Telefone é obrigatório'
            }),
            {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }

        // Gerar código de verificação
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Simular envio de SMS (em produção, usar Twilio)
        console.log(`📱 SMS enviado para ${phone}: ${verificationCode}`);
        
        return new Response(
          JSON.stringify({
            success: true,
            message: 'Código de verificação enviado com sucesso',
            data: {
              phone,
              verificationCode, // Apenas para desenvolvimento
              expiresIn: 300,
              messageId: `sms-${Date.now()}`
            }
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      } catch (error) {
        console.error('Erro ao enviar SMS:', error);
        return new Response(
          JSON.stringify({
            success: false,
            message: 'Erro ao enviar SMS'
          }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
    }

    // SMS Verify Code
    if (url.pathname === '/api/sms/verify-code' && request.method === 'POST') {
      try {
        const { phone, code } = await request.json();
        
        if (!phone || !code) {
          return new Response(
            JSON.stringify({
              success: false,
              message: 'Telefone e código são obrigatórios'
            }),
            {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }
        
        // Simular verificação (em produção, verificar no banco)
        if (code.length === 6 && /^\d+$/.test(code)) {
          console.log(`✅ SMS verificado para ${phone}: ${code}`);
          return new Response(
            JSON.stringify({
              success: true,
              message: 'SMS verificado com sucesso',
              data: {
                phone,
                verified: true,
                verifiedAt: new Date().toISOString()
              }
            }),
            {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        } else {
          return new Response(
            JSON.stringify({
              success: false,
              message: 'Código inválido'
            }),
            {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }
      } catch (error) {
        console.error('Erro ao verificar SMS:', error);
        return new Response(
          JSON.stringify({
            success: false,
            message: 'Erro ao verificar SMS'
          }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
    }

    // Email Send Verification
    if (url.pathname === '/api/email/send-verification' && request.method === 'POST') {
      try {
        const { email } = await request.json();
        
        if (!email) {
          return new Response(
            JSON.stringify({
              success: false,
              message: 'Email é obrigatório'
            }),
            {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }

        // Gerar código de verificação
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Simular envio de email (em produção, usar Nodemailer)
        console.log(`📧 Email enviado para ${email}: ${verificationCode}`);
        
        return new Response(
          JSON.stringify({
            success: true,
            message: 'Código de verificação enviado para seu email',
            data: {
              email: email.replace(/(.{2}).*(@.*)/, '$1***$2'),
              verificationCode, // Apenas para desenvolvimento
              expiresIn: 600,
              messageId: `email-${Date.now()}`
            }
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      } catch (error) {
        console.error('Erro ao enviar email:', error);
        return new Response(
          JSON.stringify({
            success: false,
            message: 'Erro ao enviar email'
          }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
    }

    // Email Verify
    if (url.pathname === '/api/email/verify' && request.method === 'POST') {
      try {
        const { email, code } = await request.json();
        
        if (!email || !code) {
          return new Response(
            JSON.stringify({
              success: false,
              message: 'Email e código são obrigatórios'
            }),
            {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }
        
        // Simular verificação (em produção, verificar no banco)
        if (code.length === 6 && /^\d+$/.test(code)) {
          console.log(`✅ Email verificado para ${email}: ${code}`);
          return new Response(
            JSON.stringify({
              success: true,
              message: 'Email verificado com sucesso',
              data: {
                email,
                emailVerified: true,
                verifiedAt: new Date().toISOString()
              }
            }),
            {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        } else {
          return new Response(
            JSON.stringify({
              success: false,
              message: 'Código inválido'
            }),
            {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }
      } catch (error) {
        console.error('Erro ao verificar email:', error);
        return new Response(
          JSON.stringify({
            success: false,
            message: 'Erro ao verificar email'
          }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
    }

    // Register User
    if (url.pathname === '/api/auth/register' && request.method === 'POST') {
      try {
        const { name, email, company, phone, password } = await request.json();
        
        if (!name || !email || !company || !phone || !password) {
          return new Response(
            JSON.stringify({
              success: false,
              message: 'Todos os campos são obrigatórios'
            }),
            {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }

        // Simular criação de usuário (em produção, salvar no banco)
        console.log(`👤 Usuário criado: ${name} (${email})`);
        
        return new Response(
          JSON.stringify({
            success: true,
            message: 'Conta criada com sucesso',
            data: {
              user: {
                id: Date.now(),
                name,
                email,
                company,
                phone,
                createdAt: new Date().toISOString()
              },
              token: `token-${Date.now()}`
            }
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      } catch (error) {
        console.error('Erro ao registrar usuário:', error);
        return new Response(
          JSON.stringify({
            success: false,
            message: 'Erro ao criar conta'
          }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
    }

    // 404 - Rota não encontrada
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Rota não encontrada',
        availableRoutes: [
          'GET /api/health',
          'POST /api/sms/send-code',
          'POST /api/sms/verify-code',
          'POST /api/email/send-verification',
          'POST /api/email/verify',
          'POST /api/auth/register'
        ]
      }),
      {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
};
