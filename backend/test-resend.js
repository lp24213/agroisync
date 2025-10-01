#!/usr/bin/env node

/**
 * Script de teste para verificar configuração do Resend
 * Execute: node test-resend.js
 */

import { Resend } from 'resend';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

async function testResend() {
  console.log('🧪 Testando configuração do Resend...\n');

  // Verificar se a API key está configurada
  if (!process.env.RESEND_API_KEY) {
    console.error('❌ RESEND_API_KEY não encontrada nas variáveis de ambiente');
    console.log('💡 Configure a variável RESEND_API_KEY no arquivo .env');
    process.exit(1);
  }

  console.log('✅ RESEND_API_KEY encontrada');
  console.log(`📧 RESEND_FROM: ${process.env.RESEND_FROM || 'AgroSync <contato@agroisync.com>'}`);

  try {
    // Testar envio de email
    console.log('\n📤 Enviando email de teste...');
    
    const result = await resend.emails.send({
      from: process.env.RESEND_FROM || 'AgroSync <contato@agroisync.com>',
      to: ['contato@agroisync.com'], // Email de teste
      subject: 'Teste de Configuração Resend - AgroSync',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #059669; margin: 0;">AgroSync</h1>
            <p style="color: #666; margin: 10px 0 0 0;">Teste de Configuração</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 10px;">
            <h2 style="color: #333; margin: 0 0 20px 0;">✅ Configuração do Resend Funcionando!</h2>
            <p style="color: #666; margin: 0 0 20px 0;">
              Este é um email de teste para verificar se a configuração do Resend está funcionando corretamente.
            </p>
            <p style="color: #666; margin: 0;">
              <strong>Timestamp:</strong> ${new Date().toISOString()}<br>
              <strong>Ambiente:</strong> ${process.env.NODE_ENV || 'development'}
            </p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 14px; margin: 0;">
              AgroSync - Plataforma Inteligente de Agronegócio
            </p>
          </div>
        </div>
      `,
      text: `
        AgroSync - Teste de Configuração
        
        ✅ Configuração do Resend Funcionando!
        
        Este é um email de teste para verificar se a configuração do Resend está funcionando corretamente.
        
        Timestamp: ${new Date().toISOString()}
        Ambiente: ${process.env.NODE_ENV || 'development'}
        
        AgroSync - Plataforma Inteligente de Agronegócio
      `
    });

    if (result.data?.id) {
      console.log('✅ Email enviado com sucesso!');
      console.log(`📧 ID do email: ${result.data.id}`);
      console.log('📬 Verifique a caixa de entrada de contato@agroisync.com');
    } else {
      console.error('❌ Falha no envio do email');
      console.log('Resposta:', result);
    }

  } catch (error) {
    console.error('❌ Erro ao enviar email:', error.message);
    
    if (error.message.includes('Invalid API key')) {
      console.log('\n💡 Possíveis soluções:');
      console.log('1. Verifique se a RESEND_API_KEY está correta');
      console.log('2. Confirme se a chave está ativa no painel do Resend');
      console.log('3. Verifique se o domínio contato@agroisync.com está verificado no Resend');
    }
    
    if (error.message.includes('domain')) {
      console.log('\n💡 Possíveis soluções:');
      console.log('1. Verifique se o domínio agroisync.com está verificado no Resend');
      console.log('2. Configure os registros DNS necessários');
      console.log('3. Use um domínio de teste do Resend temporariamente');
    }
  }
}

// Executar teste
testResend().catch(console.error);
