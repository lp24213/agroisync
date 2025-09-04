import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Database, CheckCircle, AlertCircle } from 'lucide-react';
import Layout from '../components/Layout';

const Privacidade = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-black text-white pt-20">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-emerald-400" />
            </div>
            <h1 className="text-4xl font-bold text-gradient-agro mb-4">
              Política de Privacidade
            </h1>
            <p className="text-white/60 text-lg">
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
              <h2 className="text-2xl font-bold text-white mb-4">1. Informações Gerais</h2>
              <p className="text-white/80 leading-relaxed">
                O AgroSync está comprometido em proteger sua privacidade e dados pessoais. 
                Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e 
                protegemos suas informações quando você usa nossos serviços.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. Dados que Coletamos</h2>
              <p className="text-white/80 leading-relaxed mb-4">
                Coletamos os seguintes tipos de informações:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                  <h3 className="font-bold text-emerald-400 mb-2 flex items-center">
                    <Database className="w-5 h-5 mr-2" />
                    Dados Pessoais
                  </h3>
                  <ul className="text-white/70 text-sm space-y-1">
                    <li>• Nome completo</li>
                    <li>• Email e telefone</li>
                    <li>• CPF/CNPJ</li>
                    <li>• Endereço</li>
                    <li>• Informações de pagamento</li>
                          </ul>
                        </div>
                        
                <div className="p-4 bg-sky-500/10 rounded-lg border border-sky-500/20">
                  <h3 className="font-bold text-sky-400 mb-2 flex items-center">
                    <Eye className="w-5 h-5 mr-2" />
                    Dados de Uso
                  </h3>
                  <ul className="text-white/70 text-sm space-y-1">
                    <li>• Histórico de navegação</li>
                    <li>• Produtos visualizados</li>
                    <li>• Transações realizadas</li>
                    <li>• Preferências de busca</li>
                    <li>• Interações com chatbot</li>
                  </ul>
                        </div>
                      </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. Como Usamos Seus Dados</h2>
              <p className="text-white/80 leading-relaxed mb-4">
                Utilizamos suas informações para:
              </p>
              <ul className="space-y-2 text-white/80">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-emerald-400 mr-3 mt-0.5 flex-shrink-0" />
                  Fornecer e melhorar nossos serviços
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-emerald-400 mr-3 mt-0.5 flex-shrink-0" />
                  Processar transações e pagamentos
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-emerald-400 mr-3 mt-0.5 flex-shrink-0" />
                  Enviar comunicações importantes
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-emerald-400 mr-3 mt-0.5 flex-shrink-0" />
                  Personalizar sua experiência
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-emerald-400 mr-3 mt-0.5 flex-shrink-0" />
                  Cumprir obrigações legais
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Compartilhamento de Dados</h2>
              <p className="text-white/80 leading-relaxed mb-4">
                Não vendemos, alugamos ou compartilhamos seus dados pessoais com terceiros, 
                exceto nas seguintes situações:
              </p>
              <ul className="space-y-2 text-white/80">
                <li className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-amber-400 mr-3 mt-0.5 flex-shrink-0" />
                  Com seu consentimento explícito
                </li>
                <li className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-amber-400 mr-3 mt-0.5 flex-shrink-0" />
                  Para processar pagamentos (processadores seguros)
                </li>
                <li className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-amber-400 mr-3 mt-0.5 flex-shrink-0" />
                  Para cumprir obrigações legais
                </li>
                <li className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-amber-400 mr-3 mt-0.5 flex-shrink-0" />
                  Para proteger nossos direitos e segurança
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. Segurança dos Dados</h2>
              <p className="text-white/80 leading-relaxed mb-4">
                Implementamos medidas de segurança robustas para proteger seus dados:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/20 text-center">
                  <Lock className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  <h3 className="font-bold text-emerald-400 mb-1">Criptografia</h3>
                  <p className="text-white/70 text-sm">Dados criptografados em trânsito e repouso</p>
            </div>
                <div className="p-4 bg-sky-500/10 rounded-lg border border-sky-500/20 text-center">
                  <Shield className="w-8 h-8 text-sky-400 mx-auto mb-2" />
                  <h3 className="font-bold text-sky-400 mb-1">Firewall</h3>
                  <p className="text-white/70 text-sm">Proteção contra ataques e intrusões</p>
            </div>
                <div className="p-4 bg-amber-500/10 rounded-lg border border-amber-500/20 text-center">
                  <CheckCircle className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                  <h3 className="font-bold text-amber-400 mb-1">Backup</h3>
                  <p className="text-white/70 text-sm">Backup seguro e redundante</p>
              </div>
            </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">6. Seus Direitos</h2>
              <p className="text-white/80 leading-relaxed mb-4">
                Conforme a LGPD, você tem os seguintes direitos:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ul className="space-y-2 text-white/80">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-emerald-400 mr-3 mt-0.5 flex-shrink-0" />
                    Acessar seus dados pessoais
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-emerald-400 mr-3 mt-0.5 flex-shrink-0" />
                    Corrigir dados incorretos
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-emerald-400 mr-3 mt-0.5 flex-shrink-0" />
                    Solicitar exclusão de dados
                  </li>
                  </ul>
                <ul className="space-y-2 text-white/80">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-emerald-400 mr-3 mt-0.5 flex-shrink-0" />
                    Revogar consentimento
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-emerald-400 mr-3 mt-0.5 flex-shrink-0" />
                    Portabilidade de dados
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-emerald-400 mr-3 mt-0.5 flex-shrink-0" />
                    Oposição ao tratamento
                  </li>
                  </ul>
                </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">7. Cookies e Tecnologias</h2>
              <p className="text-white/80 leading-relaxed mb-4">
                Utilizamos cookies e tecnologias similares para:
              </p>
              <ul className="space-y-2 text-white/80">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-emerald-400 mr-3 mt-0.5 flex-shrink-0" />
                  Manter você logado em sua conta
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-emerald-400 mr-3 mt-0.5 flex-shrink-0" />
                  Lembrar suas preferências
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-emerald-400 mr-3 mt-0.5 flex-shrink-0" />
                  Analisar o uso do site
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-emerald-400 mr-3 mt-0.5 flex-shrink-0" />
                  Melhorar a experiência do usuário
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">8. Retenção de Dados</h2>
              <p className="text-white/80 leading-relaxed">
                Mantemos seus dados pessoais apenas pelo tempo necessário para cumprir 
                os propósitos descritos nesta política ou conforme exigido por lei. 
                Quando não precisamos mais dos dados, eles são excluídos de forma segura.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">9. Menores de Idade</h2>
              <p className="text-white/80 leading-relaxed">
                Nossos serviços não são destinados a menores de 18 anos. Não coletamos 
                intencionalmente dados pessoais de menores. Se você é pai/mãe e acredita 
                que seu filho forneceu dados pessoais, entre em contato conosco.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">10. Alterações na Política</h2>
              <p className="text-white/80 leading-relaxed">
                Podemos atualizar esta Política de Privacidade periodicamente. 
                Notificaremos você sobre mudanças significativas através de email 
                ou notificação em nossa plataforma.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">11. Contato</h2>
              <p className="text-white/80 leading-relaxed mb-4">
                Para exercer seus direitos ou esclarecer dúvidas sobre esta política:
              </p>
              <div className="p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                <p className="text-emerald-400 font-medium">Email: contato@agroisync.com</p>
                <p className="text-emerald-400 font-medium">Telefone: (66) 99236-2830</p>
                <p className="text-emerald-400 font-medium">Endereço: Sinop - MT, Brasil</p>
                <p className="text-emerald-400 font-medium">DPO: dpo@agroisync.com</p>
            </div>
            </section>
          </motion.div>
        </div>
    </div>
    </Layout>
  );
};

export default Privacidade;
