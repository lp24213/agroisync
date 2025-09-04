import React from 'react';
import { motion } from 'framer-motion';
import { Shield, FileText, CheckCircle, AlertCircle } from 'lucide-react';

const Termos = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-8 h-8 text-emerald-400" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Termos de Uso
            </h1>
            <p className="text-gray-600 text-lg">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card space-y-8"
          >
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Aceitação dos Termos</h2>
              <p className="text-gray-700 leading-relaxed">
                Ao acessar e usar o AgroSync, você concorda em cumprir e estar vinculado a estes Termos de Uso. 
                Se você não concordar com qualquer parte destes termos, não poderá usar nossos serviços.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. Descrição do Serviço</h2>
              <p className="text-white/80 leading-relaxed mb-4">
                O AgroSync é uma plataforma de tecnologia agrícola que oferece:
              </p>
              <ul className="space-y-2 text-white/80">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-emerald-400 mr-3 mt-0.5 flex-shrink-0" />
                  Marketplace para produtos agrícolas
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-emerald-400 mr-3 mt-0.5 flex-shrink-0" />
                  Sistema de fretes e logística
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-emerald-400 mr-3 mt-0.5 flex-shrink-0" />
                  Integração com criptomoedas
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-emerald-400 mr-3 mt-0.5 flex-shrink-0" />
                  Ferramentas de gestão agrícola
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. Conta do Usuário</h2>
              <p className="text-white/80 leading-relaxed mb-4">
                Para usar certos recursos do AgroSync, você deve criar uma conta. Você é responsável por:
              </p>
              <ul className="space-y-2 text-white/80">
                <li className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-amber-400 mr-3 mt-0.5 flex-shrink-0" />
                  Manter a confidencialidade de suas credenciais
                </li>
                <li className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-amber-400 mr-3 mt-0.5 flex-shrink-0" />
                  Fornecer informações precisas e atualizadas
                </li>
                <li className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-amber-400 mr-3 mt-0.5 flex-shrink-0" />
                  Aceitar responsabilidade por todas as atividades em sua conta
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Uso Aceitável</h2>
              <p className="text-white/80 leading-relaxed mb-4">
                Você concorda em não usar o AgroSync para:
              </p>
              <ul className="space-y-2 text-white/80">
                <li className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
                  Violar leis ou regulamentos aplicáveis
                </li>
                <li className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
                  Enviar spam ou conteúdo malicioso
                </li>
                <li className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
                  Tentar acessar sistemas não autorizados
                </li>
                <li className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
                  Interferir no funcionamento da plataforma
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. Privacidade e Dados</h2>
              <p className="text-white/80 leading-relaxed">
                Sua privacidade é importante para nós. Nossa coleta e uso de dados pessoais 
                são regidos pela nossa Política de Privacidade, que faz parte destes Termos de Uso.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">6. Propriedade Intelectual</h2>
              <p className="text-white/80 leading-relaxed">
                O AgroSync e todo o conteúdo relacionado são protegidos por direitos autorais, 
                marcas registradas e outras leis de propriedade intelectual. Você não pode 
                copiar, modificar ou distribuir nosso conteúdo sem autorização.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">7. Limitação de Responsabilidade</h2>
              <p className="text-white/80 leading-relaxed">
                O AgroSync é fornecido "como está" sem garantias. Não nos responsabilizamos 
                por danos indiretos, incidentais ou consequenciais decorrentes do uso de nossos serviços.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">8. Modificações</h2>
              <p className="text-white/80 leading-relaxed">
                Reservamo-nos o direito de modificar estes Termos de Uso a qualquer momento. 
                As mudanças entrarão em vigor imediatamente após a publicação. 
                Seu uso contínuo do serviço constitui aceitação das modificações.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">9. Contato</h2>
              <p className="text-white/80 leading-relaxed">
                Se você tiver dúvidas sobre estes Termos de Uso, entre em contato conosco:
              </p>
              <div className="mt-4 p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                <p className="text-emerald-400 font-medium">Email: contato@agroisync.com</p>
                <p className="text-emerald-400 font-medium">Telefone: (66) 99236-2830</p>
                <p className="text-emerald-400 font-medium">Endereço: Sinop - MT, Brasil</p>
            </div>
            </section>
          </motion.div>
        </div>
      </div>
  );
};

export default Termos;
