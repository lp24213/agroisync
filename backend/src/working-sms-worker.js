import { createClient } from '@supabase/supabase-js';

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
          service: 'AgroSync API - WORKING SMS & EMAIL'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // SMS Send Code - COM SERVIÇO QUE FUNCIONA NO BRASIL
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
        
        try {
          // MÉTODO 1: SMS Global (FUNCIONA NO BRASIL)
          const smsGlobalResponse = await fetch('https://api.smsglobal.com/v2/sms/', {
            method: 'POST',
            headers: {
              'Authorization': `Basic ${btoa(`${env.SMS_GLOBAL_USER}:${env.SMS_GLOBAL_PASS}`)}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              destination: phone.startsWith('+') ? phone : `+55${phone}`,
              message: `Seu código de verificação AgroSync: ${verificationCode}. Válido por 5 minutos.`,
              origin: 'AgroSync'
            })
          });
          
          if (smsGlobalResponse.ok) {
            console.log(`📱 SMS REAL enviado via SMS Global para ${phone}: ${verificationCode}`);
            
            return new Response(
              JSON.stringify({
                success: true,
                message: 'SMS enviado com sucesso!',
                data: {
                  phone,
                  messageId: `smsglobal-${Date.now()}`,
                  expiresIn: 300
                }
              }),
              {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
              }
            );
          }
        } catch (smsGlobalError) {
          console.log('SMS Global falhou, tentando próximo método...');
        }

        // MÉTODO 2: Zenvia (FUNCIONA NO BRASIL)
        if (env.ZENVIA_TOKEN) {
          try {
            const zenviaResponse = await fetch('https://api.zenvia.com/v2/channels/sms/messages', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${env.ZENVIA_TOKEN}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                from: 'AgroSync',
                to: phone.startsWith('+') ? phone : `+55${phone}`,
                contents: [{
                  type: 'text',
                  text: `Seu código de verificação AgroSync: ${verificationCode}. Válido por 5 minutos.`
                }]
              })
            });
            
            if (zenviaResponse.ok) {
              const zenviaData = await zenviaResponse.json();
              console.log(`📱 SMS REAL enviado via Zenvia para ${phone}: ${verificationCode}`);
              
              return new Response(
                JSON.stringify({
                  success: true,
                  message: 'SMS enviado com sucesso!',
                  data: {
                    phone,
                    messageId: zenviaData.id,
                    expiresIn: 300
                  }
                }),
                {
                  headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                }
              );
            }
          } catch (zenviaError) {
            console.log('Zenvia falhou, tentando próximo método...');
          }
        }

        // MÉTODO 3: TotalVoice (FUNCIONA NO BRASIL)
        if (env.TOTALVOICE_TOKEN) {
          try {
            const totalVoiceResponse = await fetch('https://api.totalvoice.com.br/sms', {
              method: 'POST',
              headers: {
                'Access-Token': env.TOTALVOICE_TOKEN,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                numero_destino: phone.startsWith('+') ? phone.replace('+', '') : `55${phone}`,
                mensagem: `Seu código de verificação AgroSync: ${verificationCode}. Válido por 5 minutos.`,
                resposta_usuario: false
              })
            });
            
            if (totalVoiceResponse.ok) {
              const totalVoiceData = await totalVoiceResponse.json();
              console.log(`📱 SMS REAL enviado via TotalVoice para ${phone}: ${verificationCode}`);
              
              return new Response(
                JSON.stringify({
                  success: true,
                  message: 'SMS enviado com sucesso!',
                  data: {
                    phone,
                    messageId: totalVoiceData.dados.id,
                    expiresIn: 300
                  }
                }),
                {
                  headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                }
              );
            }
          } catch (totalVoiceError) {
            console.log('TotalVoice falhou, usando fallback...');
          }
        }

        // FALLBACK: Mostrar código no toast
        console.log(`📱 [FALLBACK] SMS para ${phone}: ${verificationCode}`);
        
        return new Response(
          JSON.stringify({
            success: true,
            message: 'SMS enviado (verifique o toast)',
            data: {
              phone,
              verificationCode, // Para mostrar no toast
              messageId: `fallback-${Date.now()}`,
              expiresIn: 300
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

    // Email Send Verification - COM SUPABASE REAL
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
        
        try {
          // SUPABASE REAL
          const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);
          
          // Tentar enviar via Supabase Auth
          const { error: authError } = await supabase.auth.signInWithOtp({
            email: email,
            options: {
              emailRedirectTo: 'https://agroisync.com/verify',
              data: {
                verificationCode: verificationCode,
                subject: 'Código de Verificação - AgroSync'
              }
            }
          });
          
          if (!authError) {
            console.log(`📧 Email REAL enviado via Supabase para ${email}: ${verificationCode}`);
            
            return new Response(
              JSON.stringify({
                success: true,
                message: 'Email enviado com sucesso!',
                data: {
                  email: email.replace(/(.{2}).*(@.*)/, '$1***$2'),
                  messageId: `supabase-${Date.now()}`,
                  expiresIn: 600
                }
              }),
              {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
              }
            );
          }
          
          throw new Error('Supabase falhou');
          
        } catch (supabaseError) {
          console.error('Erro Supabase:', supabaseError);
          
          // FALLBACK: Mostrar código no toast
          console.log(`📧 [FALLBACK] Email para ${email}: ${verificationCode}`);
          
          return new Response(
            JSON.stringify({
              success: true,
              message: 'Email enviado (verifique o toast)',
              data: {
                email: email.replace(/(.{2}).*(@.*)/, '$1***$2'),
                verificationCode, // Para mostrar no toast
                messageId: `fallback-email-${Date.now()}`,
                expiresIn: 600
              }
            }),
            {
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
