'use client';

import { Layout } from '../../components/layout/Layout';
import { motion } from 'framer-motion';

export default function TermsPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-[#000000] text-[#ffffff]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Header */}
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-orbitron font-bold text-[#00FF7F] mb-4">
                Termos de Uso
              </h1>
              <p className="text-[#cccccc] text-lg max-w-2xl mx-auto">
                Leia atentamente os termos e condições que regem o uso da plataforma AGROTM.
              </p>
            </div>

            {/* Content */}
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-[#000000]/50 border border-[#00FF7F]/20 rounded-xl p-8 backdrop-blur-sm"
              >
                <h2 className="text-2xl font-orbitron font-semibold text-[#00FF7F] mb-4">
                  1. Aceitação dos Termos
                </h2>
                <p className="text-[#cccccc] leading-relaxed">
                  Ao acessar e usar a plataforma AGROTM, você concorda em cumprir e estar vinculado a estes Termos de Uso. 
                  Se você não concordar com qualquer parte destes termos, não deve usar nossos serviços.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-[#000000]/50 border border-[#00FF7F]/20 rounded-xl p-8 backdrop-blur-sm"
              >
                <h2 className="text-2xl font-orbitron font-semibold text-[#00FF7F] mb-4">
                  2. Descrição dos Serviços
                </h2>
                <p className="text-[#cccccc] leading-relaxed mb-4">
                  A AGROTM é uma plataforma que oferece:
                </p>
                <ul className="text-[#cccccc] space-y-2 ml-6">
                  <li>• Intermediação de produtos do agronegócio com blockchain</li>
                  <li>• Sistema de staking e yield farming</li>
                  <li>• Marketplace de NFTs agrícolas</li>
                  <li>• Tecnologia de smart farming</li>
                  <li>• Dashboard interativo para gestão</li>
                  <li>• Ferramentas de tokenização de ativos</li>
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-[#000000]/50 border border-[#00FF7F]/20 rounded-xl p-8 backdrop-blur-sm"
              >
                <h2 className="text-2xl font-orbitron font-semibold text-[#00FF7F] mb-4">
                  3. Elegibilidade
                </h2>
                <p className="text-[#cccccc] leading-relaxed mb-4">
                  Para usar nossos serviços, você deve:
                </p>
                <ul className="text-[#cccccc] space-y-2 ml-6">
                  <li>• Ter pelo menos 18 anos de idade</li>
                  <li>• Ter capacidade legal para celebrar contratos</li>
                  <li>• Residir em uma jurisdição onde nossos serviços são permitidos</li>
                  <li>• Fornecer informações precisas e atualizadas</li>
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-[#000000]/50 border border-[#00FF7F]/20 rounded-xl p-8 backdrop-blur-sm"
              >
                <h2 className="text-2xl font-orbitron font-semibold text-[#00FF7F] mb-4">
                  4. Conta do Usuário
                </h2>
                <div className="space-y-4">
                  <p className="text-[#cccccc]">
                    Você é responsável por manter a confidencialidade de sua conta e senha. 
                    Você concorda em aceitar responsabilidade por todas as atividades que ocorrem em sua conta.
                  </p>
                  <p className="text-[#cccccc]">
                    Você deve notificar-nos imediatamente sobre qualquer uso não autorizado de sua conta 
                    ou qualquer outra violação de segurança.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="bg-[#000000]/50 border border-[#00FF7F]/20 rounded-xl p-8 backdrop-blur-sm"
              >
                <h2 className="text-2xl font-orbitron font-semibold text-[#00FF7F] mb-4">
                  5. Uso Aceitável
                </h2>
                <p className="text-[#cccccc] leading-relaxed mb-4">
                  Você concorda em usar nossos serviços apenas para propósitos legais e de acordo com estes Termos. 
                  Você não deve:
                </p>
                <ul className="text-[#cccccc] space-y-2 ml-6">
                  <li>• Usar nossos serviços para atividades ilegais</li>
                  <li>• Tentar acessar sistemas não autorizados</li>
                  <li>• Interferir na operação da plataforma</li>
                  <li>• Transmitir vírus ou código malicioso</li>
                  <li>• Violar direitos de propriedade intelectual</li>
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="bg-[#000000]/50 border border-[#00FF7F]/20 rounded-xl p-8 backdrop-blur-sm"
              >
                <h2 className="text-2xl font-orbitron font-semibold text-[#00FF7F] mb-4">
                  6. Propriedade Intelectual
                </h2>
                <p className="text-[#cccccc] leading-relaxed">
                  Todo o conteúdo da plataforma AGROTM, incluindo mas não se limitando a textos, gráficos, 
                  logotipos, ícones, imagens, clipes de áudio, downloads digitais e compilações de dados, 
                  é propriedade da AGROTM ou de seus fornecedores de conteúdo e está protegido pelas leis de direitos autorais.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="bg-[#000000]/50 border border-[#00FF7F]/20 rounded-xl p-8 backdrop-blur-sm"
              >
                <h2 className="text-2xl font-orbitron font-semibold text-[#00FF7F] mb-4">
                  7. Limitação de Responsabilidade
                </h2>
                <p className="text-[#cccccc] leading-relaxed">
                  A AGROTM não será responsável por quaisquer danos indiretos, incidentais, especiais, 
                  consequenciais ou punitivos, incluindo perda de lucros, dados ou uso, incorridos por você 
                  ou qualquer terceiro, seja em uma ação contratual ou de responsabilidade civil.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="bg-[#000000]/50 border border-[#00FF7F]/20 rounded-xl p-8 backdrop-blur-sm"
              >
                <h2 className="text-2xl font-orbitron font-semibold text-[#00FF7F] mb-4">
                  8. Modificações dos Termos
                </h2>
                <p className="text-[#cccccc] leading-relaxed">
                  Reservamo-nos o direito de modificar estes Termos de Uso a qualquer momento. 
                  As modificações entrarão em vigor imediatamente após sua publicação na plataforma. 
                  Seu uso continuado da plataforma após as modificações constitui aceitação dos novos termos.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                className="bg-[#000000]/50 border border-[#00FF7F]/20 rounded-xl p-8 backdrop-blur-sm"
              >
                <h2 className="text-2xl font-orbitron font-semibold text-[#00FF7F] mb-4">
                  9. Contato
                </h2>
                <p className="text-[#cccccc] leading-relaxed mb-4">
                  Se você tiver dúvidas sobre estes Termos de Uso, entre em contato conosco:
                </p>
                <div className="space-y-2 text-[#cccccc]">
                  <p>📧 Email: contato@agroisync.com</p>
                  <p>📞 Telefone: +55 (66) 99236-2830</p>
                </div>
              </motion.div>
            </div>

            {/* Last Updated */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="text-center text-[#888888] text-sm border-t border-[#00FF7F]/20 pt-8"
            >
              <p>Última atualização: Janeiro de 2024</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
