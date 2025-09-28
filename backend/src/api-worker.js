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

    // Geolocation proxy (evita CORS)
    if (url.pathname === '/api/geolocation' && request.method === 'GET') {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        return new Response(
          JSON.stringify(data),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      } catch (error) {
        // Fallback para São Paulo
        return new Response(
          JSON.stringify({
            city: 'São Paulo',
            region: 'São Paulo',
            country_name: 'Brasil',
            country_code: 'BR',
            latitude: -23.5505,
            longitude: -46.6333,
            timezone: 'America/Sao_Paulo',
            currency: 'BRL'
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
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
        
        // Enviar email real via Resend
        const resendResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer re_f9XgEUAJ_2FwkAe87mmUZJhTTAy8xuWg8`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: 'AgroSync <onboarding@resend.dev>',
            to: [email],
            subject: 'Código de Verificação AgroSync',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #2d5016;">🔐 Código de Verificação AgroSync</h2>
                <p>Olá!</p>
                <p>Seu código de verificação é:</p>
                <div style="background: #f0f8ff; padding: 20px; text-align: center; margin: 20px 0;">
                  <h1 style="color: #2d5016; font-size: 32px; margin: 0;">${verificationCode}</h1>
                </div>
                <p>Este código expira em 10 minutos.</p>
                <p>Se você não solicitou este código, ignore este email.</p>
                <hr style="margin: 20px 0;">
                <p style="color: #666; font-size: 12px;">AgroSync - Plataforma Agropecuária</p>
              </div>
            `,
            text: `Código de verificação AgroSync: ${verificationCode}\n\nEste código expira em 10 minutos.`
          })
        });

        const resendData = await resendResponse.json();
        console.log(`📧 Email enviado via Resend para ${email}:`, resendData);
        
        return new Response(
          JSON.stringify({
            success: true,
            message: 'Código de verificação enviado para seu email',
            data: {
              email: email.replace(/(.{2}).*(@.*)/, '$1***$2'),
              expiresIn: 600,
              messageId: resendData.id || `email-${Date.now()}`
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
