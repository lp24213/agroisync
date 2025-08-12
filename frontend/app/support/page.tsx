'use client';

import { Layout } from '../../components/layout/Layout';
import { motion } from 'framer-motion';
import { Mail, Phone, MessageCircle, Clock, HelpCircle, FileText, Shield, Zap } from 'lucide-react';

export default function SupportPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-[#000000] text-[#ffffff]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-12"
          >
            {/* Header */}
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-orbitron font-bold text-[#00FF7F] mb-4">
                Suporte AGROTM
              </h1>
              <p className="text-[#cccccc] text-lg max-w-3xl mx-auto">
                Estamos aqui para ajudar você a aproveitar ao máximo a plataforma AGROTM. 
                Encontre respostas rápidas ou entre em contato conosco.
              </p>
            </div>

            {/* Contact Methods */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <div className="bg-[#000000]/50 border border-[#00FF7F]/20 rounded-xl p-6 backdrop-blur-sm text-center">
                <Mail className="w-12 h-12 text-[#00FF7F] mx-auto mb-4" />
                <h3 className="text-xl font-orbitron font-semibold text-[#00FF7F] mb-2">Email</h3>
                <p className="text-[#cccccc] mb-4">contato@agroisync.com</p>
                <p className="text-sm text-[#888888]">Resposta em até 24h</p>
              </div>

              <div className="bg-[#000000]/50 border border-[#00FF7F]/20 rounded-xl p-6 backdrop-blur-sm text-center">
                <Phone className="w-12 h-12 text-[#00FF7F] mx-auto mb-4" />
                <h3 className="text-xl font-orbitron font-semibold text-[#00FF7F] mb-2">Telefone</h3>
                <p className="text-[#cccccc] mb-4">+55 (66) 99236-2830</p>
                <p className="text-sm text-[#888888]">Seg-Sex, 8h-18h</p>
              </div>

              <div className="bg-[#000000]/50 border border-[#00FF7F]/20 rounded-xl p-6 backdrop-blur-sm text-center">
                <MessageCircle className="w-12 h-12 text-[#00FF7F] mx-auto mb-4" />
                <h3 className="text-xl font-orbitron font-semibold text-[#00FF7F] mb-2">Chat</h3>
                <p className="text-[#cccccc] mb-4">Assistente Virtual</p>
                <p className="text-sm text-[#888888]">24/7 disponível</p>
              </div>
            </motion.div>

            {/* FAQ Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-orbitron font-bold text-[#00FF7F] text-center mb-8">
                Perguntas Frequentes
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-[#000000]/50 border border-[#00FF7F]/20 rounded-xl p-6 backdrop-blur-sm">
                  <h3 className="text-xl font-semibold text-[#ffffff] mb-3">Como criar uma conta?</h3>
                  <p className="text-[#cccccc]">
                    Clique no botão "Acessar" no cabeçalho e siga o processo de registro. 
                    Você precisará fornecer informações básicas e conectar sua carteira digital.
                  </p>
                </div>

                <div className="bg-[#000000]/50 border border-[#00FF7F]/20 rounded-xl p-6 backdrop-blur-sm">
                  <h3 className="text-xl font-semibold text-[#ffffff] mb-3">Como funciona o staking?</h3>
                  <p className="text-[#cccccc]">
                    O staking permite que você bloqueie seus tokens AGROTM para ganhar recompensas. 
                    Quanto mais tempo você mantém os tokens bloqueados, maiores são os retornos.
                  </p>
                </div>

                <div className="bg-[#000000]/50 border border-[#00FF7F]/20 rounded-xl p-6 backdrop-blur-sm">
                  <h3 className="text-xl font-semibold text-[#ffffff] mb-3">O que são NFTs agrícolas?</h3>
                  <p className="text-[#cccccc]">
                    NFTs agrícolas são tokens únicos que representam ativos do agronegócio, 
                    como terras, colheitas ou equipamentos. Eles permitem tokenização de ativos reais.
                  </p>
                </div>

                <div className="bg-[#000000]/50 border border-[#00FF7F]/20 rounded-xl p-6 backdrop-blur-sm">
                  <h3 className="text-xl font-semibold text-[#ffffff] mb-3">Como funciona o smart farming?</h3>
                  <p className="text-[#cccccc]">
                    O smart farming utiliza IoT e blockchain para otimizar processos agrícolas, 
                    monitorando condições em tempo real e automatizando decisões de gestão.
                  </p>
                </div>

                <div className="bg-[#000000]/50 border border-[#00FF7F]/20 rounded-xl p-6 backdrop-blur-sm">
                  <h3 className="text-xl font-semibold text-[#ffffff] mb-3">É seguro investir na AGROTM?</h3>
                  <p className="text-[#cccccc]">
                    Sim! Utilizamos tecnologia blockchain avançada e implementamos medidas de segurança 
                    rigorosas para proteger seus ativos e dados.
                  </p>
                </div>

                <div className="bg-[#000000]/50 border border-[#00FF7F]/20 rounded-xl p-6 backdrop-blur-sm">
                  <h3 className="text-xl font-semibold text-[#ffffff] mb-3">Como funciona o dashboard?</h3>
                  <p className="text-[#cccccc]">
                    O dashboard oferece uma visão completa dos seus investimentos, 
                    incluindo gráficos de performance, histórico de transações e análises em tempo real.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Resources */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-orbitron font-bold text-[#00FF7F] text-center mb-8">
                Recursos Úteis
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-[#000000]/50 border border-[#00FF7F]/20 rounded-xl p-6 backdrop-blur-sm text-center hover:border-[#00FF7F]/40 transition-colors">
                  <FileText className="w-8 h-8 text-[#00FF7F] mx-auto mb-3" />
                  <h3 className="font-semibold text-[#ffffff] mb-2">Documentação</h3>
                  <p className="text-sm text-[#cccccc]">Guias técnicos completos</p>
                </div>

                <div className="bg-[#000000]/50 border border-[#00FF7F]/20 rounded-xl p-6 backdrop-blur-sm text-center hover:border-[#00FF7F]/40 transition-colors">
                  <HelpCircle className="w-8 h-8 text-[#00FF7F] mx-auto mb-3" />
                  <h3 className="font-semibold text-[#ffffff] mb-2">Tutoriais</h3>
                  <p className="text-sm text-[#cccccc]">Vídeos e guias passo a passo</p>
                </div>

                <div className="bg-[#000000]/50 border border-[#00FF7F]/20 rounded-xl p-6 backdrop-blur-sm text-center hover:border-[#00FF7F]/40 transition-colors">
                  <Shield className="w-8 h-8 text-[#00FF7F] mx-auto mb-3" />
                  <h3 className="font-semibold text-[#ffffff] mb-2">Segurança</h3>
                  <p className="text-sm text-[#cccccc]">Dicas de segurança e boas práticas</p>
                </div>

                <div className="bg-[#000000]/50 border border-[#00FF7F]/20 rounded-xl p-6 backdrop-blur-sm text-center hover:border-[#00FF7F]/40 transition-colors">
                  <Zap className="w-8 h-8 text-[#00FF7F] mx-auto mb-3" />
                  <h3 className="font-semibold text-[#ffffff] mb-2">Status</h3>
                  <p className="text-sm text-[#cccccc]">Monitoramento da plataforma</p>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-[#000000]/50 border border-[#00FF7F]/20 rounded-xl p-8 backdrop-blur-sm"
            >
              <h2 className="text-2xl font-orbitron font-bold text-[#00FF7F] text-center mb-6">
                Envie sua Mensagem
              </h2>
              <div className="max-w-2xl mx-auto space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Nome completo"
                    className="w-full px-4 py-3 bg-[#000000]/30 border border-[#00FF7F]/20 rounded-lg text-[#ffffff] placeholder-[#888888] focus:border-[#00FF7F] focus:outline-none transition-colors"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full px-4 py-3 bg-[#000000]/30 border border-[#00FF7F]/20 rounded-lg text-[#ffffff] placeholder-[#888888] focus:border-[#00FF7F] focus:outline-none transition-colors"
                  />
                </div>
                <select className="w-full px-4 py-3 bg-[#000000]/30 border border-[#00FF7F]/20 rounded-lg text-[#ffffff] focus:border-[#00FF7F] focus:outline-none transition-colors">
                  <option value="">Selecione o assunto</option>
                  <option value="technical">Suporte Técnico</option>
                  <option value="account">Conta e Segurança</option>
                  <option value="investment">Investimentos</option>
                  <option value="general">Geral</option>
                </select>
                <textarea
                  placeholder="Descreva sua dúvida ou problema..."
                  rows={5}
                  className="w-full px-4 py-3 bg-[#000000]/30 border border-[#00FF7F]/20 rounded-lg text-[#ffffff] placeholder-[#888888] focus:border-[#00FF7F] focus:outline-none transition-colors resize-none"
                ></textarea>
                <button className="w-full bg-[#00FF7F] text-black px-6 py-3 rounded-lg font-orbitron font-semibold hover:bg-[#00cc66] transition-colors">
                  Enviar Mensagem
                </button>
              </div>
            </motion.div>

            {/* Response Time */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-center text-[#888888] text-sm border-t border-[#00FF7F]/20 pt-8"
            >
              <p>⏱️ Tempo médio de resposta: 2-4 horas em dias úteis</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
