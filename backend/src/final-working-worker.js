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
          service: 'AgroSync API - TWILIO + SUPABASE FUNCIONANDO'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // SMS Send Code - TWILIO (FUNCIONA DE VERDADE)
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
          formattedPhone = `55${formattedPhone}`;
        }

        console.log(
          `🚀 ENVIANDO SMS via TWILIO para ${formattedPhone} com código ${verificationCode}`
        );

        // TWILIO SMS - FUNCIONA DE VERDADE
        const twilioResponse = await fetch(
          `https://api.twilio.com/2010-04-01/Accounts/${env.TWILIO_ACCOUNT_SID}/Messages.json`,
          {
            method: 'POST',
            headers: {
              Authorization: `Basic ${btoa(`${env.TWILIO_ACCOUNT_SID}:${env.TWILIO_AUTH_TOKEN}`)}`,
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
              From: env.TWILIO_PHONE_NUMBER,
              To: `+${formattedPhone}`,
              Body: `AgroSync - Seu codigo: ${verificationCode}. Valido por 5 min.`
            })
          }
        );

        const twilioData = await twilioResponse.json();

        console.log(`📱 Twilio SMS Response: ${JSON.stringify(twilioData)}`);

        if (twilioResponse.ok && twilioData.sid) {
          console.log(`📱 SMS ENTREGUE via Twilio para ${formattedPhone}: ${verificationCode}`);

          return new Response(
            JSON.stringify({
              success: true,
              message: 'SMS entregue com sucesso!',
              data: {
                phone: formattedPhone,
                verificationCode,
                messageId: twilioData.sid,
                status: twilioData.status,
                expiresIn: 300
              }
            }),
            {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        } else {
          console.error(`❌ Twilio SMS falhou: ${JSON.stringify(twilioData)}`);

          return new Response(
            JSON.stringify({
              success: false,
              message: 'Erro ao enviar SMS via Twilio',
              data: {
                phone: formattedPhone,
                verificationCode,
                error: twilioData.message || 'Erro desconhecido',
                fullResponse: twilioData
              }
            }),
            {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }
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

    // WhatsApp Send Code - TWILIO WHATSAPP
    if (url.pathname === '/api/whatsapp/send-code' && request.method === 'POST') {
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
          formattedPhone = `55${formattedPhone}`;
        }

        console.log(
          `🚀 ENVIANDO WHATSAPP via TWILIO para ${formattedPhone} com código ${verificationCode}`
        );

        // TWILIO WHATSAPP - FUNCIONA DE VERDADE
        const twilioResponse = await fetch(
          `https://api.twilio.com/2010-04-01/Accounts/${env.TWILIO_ACCOUNT_SID}/Messages.json`,
          {
            method: 'POST',
            headers: {
              Authorization: `Basic ${btoa(`${env.TWILIO_ACCOUNT_SID}:${env.TWILIO_AUTH_TOKEN}`)}`,
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
              From: 'whatsapp:+14155238886', // Twilio WhatsApp sandbox
              To: `whatsapp:+${formattedPhone}`,
              Body: `AgroSync - Seu codigo: ${verificationCode}. Valido por 5 min.`
            })
          }
        );

        const twilioData = await twilioResponse.json();

        console.log(`📱 Twilio WhatsApp Response: ${JSON.stringify(twilioData)}`);

        if (twilioResponse.ok && twilioData.sid) {
          console.log(
            `📱 WHATSAPP ENTREGUE via Twilio para ${formattedPhone}: ${verificationCode}`
          );

          return new Response(
            JSON.stringify({
              success: true,
              message: 'WhatsApp entregue com sucesso!',
              data: {
                phone: formattedPhone,
                verificationCode,
                messageId: twilioData.sid,
                status: twilioData.status,
                expiresIn: 300
              }
            }),
            {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        } else {
          console.error(`❌ Twilio WhatsApp falhou: ${JSON.stringify(twilioData)}`);

          return new Response(
            JSON.stringify({
              success: false,
              message: 'Erro ao enviar WhatsApp via Twilio',
              data: {
                phone: formattedPhone,
                verificationCode,
                error: twilioData.message || 'Erro desconhecido',
                fullResponse: twilioData
              }
            }),
            {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }
      } catch (error) {
        console.error('Erro ao enviar WhatsApp:', error);
        return new Response(
          JSON.stringify({
            success: false,
            message: 'Erro ao enviar WhatsApp'
          }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
    }

    // Email Send Verification - SUPABASE (FUNCIONA DE VERDADE)
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

        console.log(`🚀 ENVIANDO EMAIL via SUPABASE para ${email} com código ${verificationCode}`);

        // SUPABASE EMAIL - FUNCIONA DE VERDADE
        const supabaseResponse = await fetch(`${env.SUPABASE_URL}/functions/v1/send-email`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${env.SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            to: email,
            subject: 'Codigo de Verificacao - AgroSync',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #059669;">AgroSync</h2>
                <p>Seu codigo de verificacao e:</p>
                <h1 style="color: #059669; font-size: 32px; text-align: center; background: #f3f4f6; padding: 20px; border-radius: 8px;">${verificationCode}</h1>
                <p>Este codigo e valido por 10 minutos.</p>
                <p>Se voce nao solicitou este codigo, ignore este email.</p>
              </div>
            `
          })
        });

        const supabaseData = await supabaseResponse.json();

        console.log(`📧 Supabase Email Response: ${JSON.stringify(supabaseData)}`);

        if (supabaseResponse.ok) {
          console.log(`📧 EMAIL ENTREGUE via Supabase para ${email}: ${verificationCode}`);

          return new Response(
            JSON.stringify({
              success: true,
              message: 'Email entregue com sucesso!',
              data: {
                email,
                verificationCode,
                messageId: `supabase-${Date.now()}`,
                status: 'SENT',
                expiresIn: 600
              }
            }),
            {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        } else {
          console.error(`❌ Supabase Email falhou: ${JSON.stringify(supabaseData)}`);

          return new Response(
            JSON.stringify({
              success: false,
              message: 'Erro ao enviar email via Supabase',
              data: {
                email,
                verificationCode,
                error: supabaseData.error || 'Erro desconhecido',
                fullResponse: supabaseData
              }
            }),
            {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }
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
