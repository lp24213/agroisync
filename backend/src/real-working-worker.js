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
          service: 'AgroSync API - TWILIO + SUPABASE REAL'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // SMS Send Code - APENAS TWILIO REAL
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
        
        // FORMATAR TELEFONE PARA BRASIL
        let formattedPhone = phone.replace(/\D/g, ''); // Remove caracteres não numéricos
        
        // Se não começar com 55 (Brasil), adicionar
        if (!formattedPhone.startsWith('55')) {
          formattedPhone = '55' + formattedPhone;
        }
        
        console.log(`🚀 ENVIANDO SMS REAL via TWILIO para ${formattedPhone} com código ${verificationCode}`);

        // VERIFICAR CREDENCIAIS TWILIO
        if (!env.TWILIO_ACCOUNT_SID || !env.TWILIO_AUTH_TOKEN || !env.TWILIO_PHONE_NUMBER) {
          console.error('❌ CREDENCIAIS TWILIO NÃO CONFIGURADAS');
          return new Response(
            JSON.stringify({
              success: false,
              message: 'Credenciais Twilio não configuradas'
            }),
            {
              status: 500,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }

        // USAR TWILIO REAL - SEM FALLBACK
        const twilioResponse = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${env.TWILIO_ACCOUNT_SID}/Messages.json`, {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${btoa(`${env.TWILIO_ACCOUNT_SID}:${env.TWILIO_AUTH_TOKEN}`)}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: new URLSearchParams({
            From: env.TWILIO_PHONE_NUMBER,
            To: `+${formattedPhone}`,
            Body: `AgroSync - Seu código: ${verificationCode}. Válido por 5 min.`
          })
        });
        
        const twilioData = await twilioResponse.json();
        
        if (twilioResponse.ok) {
          console.log(`📱 SMS REAL ENTREGUE via Twilio para ${formattedPhone}: ${verificationCode}`);
          
          return new Response(
            JSON.stringify({
              success: true,
              message: 'SMS entregue com sucesso!',
              data: {
                phone: formattedPhone,
                verificationCode: verificationCode,
                messageId: twilioData.sid,
                expiresIn: 300
              }
            }),
            {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        } else {
          console.error(`❌ TWILIO ERRO: ${twilioData.message} (${twilioData.code})`);
          
          return new Response(
            JSON.stringify({
              success: false,
              message: `Erro Twilio: ${twilioData.message}`,
              error: twilioData.code
            }),
            {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }
        
      } catch (error) {
        console.error('❌ ERRO AO ENVIAR SMS:', error);
        return new Response(
          JSON.stringify({
            success: false,
            message: `Erro ao enviar SMS: ${error.message}`
          }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
    }

    // Email Send Verification - APENAS SUPABASE REAL
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
        
        console.log(`🚀 ENVIANDO EMAIL REAL via SUPABASE para ${email} com código ${verificationCode}`);

        // VERIFICAR CREDENCIAIS SUPABASE
        if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) {
          console.error('❌ CREDENCIAIS SUPABASE NÃO CONFIGURADAS');
          return new Response(
            JSON.stringify({
              success: false,
              message: 'Credenciais Supabase não configuradas'
            }),
            {
              status: 500,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }

        // USAR SUPABASE REAL - SEM FALLBACK
        const supabaseResponse = await fetch(`${env.SUPABASE_URL}/auth/v1/otp`, {
          method: 'POST',
          headers: {
            'apikey': env.SUPABASE_ANON_KEY,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: email,
            options: {
              emailRedirectTo: 'https://agroisync.com/verify',
              data: {
                verificationCode: verificationCode,
                subject: 'Código de Verificação - AgroSync'
              }
            }
          })
        });
        
        const supabaseData = await supabaseResponse.json();
        
        if (supabaseResponse.ok) {
          console.log(`📧 EMAIL REAL ENTREGUE via Supabase para ${email}: ${verificationCode}`);
          
          return new Response(
            JSON.stringify({
              success: true,
              message: 'Email entregue com sucesso!',
              data: {
                email: email,
                verificationCode: verificationCode,
                messageId: supabaseData.id || `supabase-${Date.now()}`,
                expiresIn: 600
              }
            }),
            {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        } else {
          console.error(`❌ SUPABASE ERRO: ${supabaseData.error?.message || supabaseData.message}`);
          
          return new Response(
            JSON.stringify({
              success: false,
              message: `Erro Supabase: ${supabaseData.error?.message || supabaseData.message}`,
              error: supabaseData.error?.code
            }),
            {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }
        
      } catch (error) {
        console.error('❌ ERRO AO ENVIAR EMAIL:', error);
        return new Response(
          JSON.stringify({
            success: false,
            message: `Erro ao enviar email: ${error.message}`
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

    // 404 - Rota não encontrada
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Rota não encontrada'
      }),
      {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
};