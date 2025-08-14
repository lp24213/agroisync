'use client';

import { useState, useEffect } from 'react';
import { Layout } from '../../components/layout/Layout';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function CookiesPage() {
  const { t } = useTranslation('common');
  
  return (
    <Layout>
      <div className="min-h-screen bg-[#000000] text-[#ffffff] relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="grid-animation"></div>
        </div>
        
        {/* Scanlines Effect */}
        <div className="absolute inset-0 scanlines opacity-10"></div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Header */}
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-orbitron font-bold gradient-text mb-4">
                Política de Cookies
              </h1>
              <p className="text-[#cccccc] text-lg max-w-2xl mx-auto">
                Saiba como utilizamos cookies e tecnologias similares para melhorar sua experiência na AGROTM.
              </p>
            </div>

            {/* Content */}
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="cyberpunk-card p-8 backdrop-blur-sm"
              >
                <h2 className="text-2xl font-orbitron font-semibold text-[#00FF7F] mb-4">
                  O que são Cookies?
                </h2>
                <p className="text-[#cccccc] leading-relaxed">
                  Cookies são pequenos arquivos de texto que são armazenados no seu dispositivo quando você visita nosso site. 
                  Eles nos ajudam a fornecer uma experiência personalizada e melhorar a funcionalidade da plataforma AGROTM.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="cyberpunk-card p-8 backdrop-blur-sm"
              >
                <h2 className="text-2xl font-orbitron font-semibold text-[#00FF7F] mb-4">
                  Tipos de Cookies que Utilizamos
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-[#ffffff] mb-2">Cookies Essenciais</h3>
                    <p className="text-[#cccccc]">
                      Necessários para o funcionamento básico do site. Incluem autenticação, segurança e preferências essenciais.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#ffffff] mb-2">Cookies de Performance</h3>
                    <p className="text-[#cccccc]">
                      Nos ajudam a entender como os visitantes interagem com o site, coletando informações anônimas.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#ffffff] mb-2">Cookies de Funcionalidade</h3>
                    <p className="text-[#cccccc]">
                      Permitem que o site lembre escolhas que você fez e forneça funcionalidades aprimoradas.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#ffffff] mb-2">Cookies de Marketing</h3>
                    <p className="text-[#cccccc]">
                      Utilizados para rastrear visitantes em sites. A intenção é exibir anúncios relevantes e envolventes.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="cyberpunk-card p-8 backdrop-blur-sm"
              >
                <h2 className="text-2xl font-orbitron font-semibold text-[#00FF7F] mb-4">
                  Como Gerenciar Cookies
                </h2>
                <div className="space-y-4">
                  <p className="text-[#cccccc]">
                    Você pode controlar e/ou excluir cookies conforme desejar. Você pode excluir todos os cookies que já estão 
                    no seu computador e pode configurar a maioria dos navegadores para impedir que sejam colocados.
                  </p>
                  <div className="bg-[#00FF7F]/10 border border-[#00FF7F]/30 rounded-lg p-4">
                    <h4 className="font-semibold text-[#00FF7F] mb-2">Configurações do Navegador</h4>
                    <ul className="text-[#cccccc] space-y-1 text-sm">
                      <li>• Chrome: Configurações → Privacidade e segurança → Cookies</li>
                      <li>• Firefox: Opções → Privacidade e Segurança → Cookies</li>
                      <li>• Safari: Preferências → Privacidade → Cookies</li>
                      <li>• Edge: Configurações → Cookies e permissões do site</li>
                    </ul>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="cyberpunk-card p-8 backdrop-blur-sm"
              >
                <h2 className="text-2xl font-orbitron font-semibold text-[#00FF7F] mb-4">
                  Atualizações desta Política
                </h2>
                <p className="text-[#cccccc] leading-relaxed">
                  Podemos atualizar esta Política de Cookies periodicamente para refletir mudanças em nossas práticas ou por outros 
                  motivos operacionais, legais ou regulamentares. Recomendamos que você revise esta política regularmente.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="cyberpunk-card p-8 backdrop-blur-sm"
              >
                <h2 className="text-2xl font-orbitron font-semibold text-[#00FF7F] mb-4">
                  Contato
                </h2>
                <p className="text-[#cccccc] leading-relaxed">
                  Se você tiver dúvidas sobre esta Política de Cookies ou sobre como utilizamos cookies, entre em contato conosco:
                </p>
                <div className="mt-4 space-y-2">
                  <p className="text-[#cccccc]">
                    <strong>Email:</strong> privacy@agroisync.com
                  </p>
                  <p className="text-[#cccccc]">
                    <strong>Telefone:</strong> +55 (11) 9999-9999
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
