import { NextPage } from 'next';
import Head from 'next/head';
import { DocumentTextIcon, ScaleIcon, HandRaisedIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { useI18n } from '@/i18n/I18nProvider';

const Terms: NextPage = () => {
  const { t } = useI18n();
  
  return (
    <>
      <Head>
        <title>{t('terms_title')} - {t('app_name')}</title>
        <meta name="description" content={`${t('terms_title')} da ${t('app_name')} - Condições e responsabilidades`} />
      </Head>

      <div className="cosmic-background min-h-screen">
        {/* Efeitos cósmicos de fundo */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-cyan-900/10 to-blue-900/10 rounded-full blur-3xl animate-nebula-drift"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-900/10 to-pink-900/10 rounded-full blur-3xl animate-nebula-drift animation-delay-2000"></div>
          <div className="absolute top-1/4 left-1/4 w-24 h-24 bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-purple-500/20 rounded-full animate-quantum-orbital"></div>
          <div className="absolute bottom-1/4 right-1/4 w-20 h-20 bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-cyan-500/20 rounded-full animate-quantum-orbital animation-delay-3000"></div>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent animate-cosmic-wave"></div>
          <div className="absolute top-20 left-20 w-1 h-1 bg-white rounded-full animate-sparkle"></div>
          <div className="absolute top-40 right-40 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-sparkle animation-delay-2000"></div>
          <div className="absolute bottom-40 left-40 w-1 h-1 bg-blue-400 rounded-full animate-sparkle animation-delay-4000"></div>
        </div>

        <div className="relative z-10">
          {/* Header */}
          <div className="text-center py-20">
            <div className="cosmic-card p-8 max-w-4xl mx-auto">
              <div className="flex justify-center mb-6">
                <div className="h-20 w-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <ScaleIcon className="h-10 w-10 text-white" />
                </div>
              </div>
              <h1 className="text-5xl font-black text-cosmic-glow mb-6">
                {t('terms_title')}
              </h1>
              <p className="text-xl text-purple-silver leading-relaxed">
                {t('terms_subtitle')}
              </p>
              <div className="mt-6 text-sm text-purple-silver">
                {t('privacy_last_update')}: {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Conteúdo Principal */}
          <div className="max-w-4xl mx-auto px-4 pb-20">
            <div className="space-y-8">
              {/* Seção 1: Aceitação */}
              <div className="cosmic-card p-8">
                <h2 className="text-3xl font-bold text-cosmic-glow mb-6 flex items-center">
                  <HandRaisedIcon className="h-8 w-8 mr-3 text-green-400" />
                  {t('terms_acceptance_title')}
                </h2>
                <div className="text-purple-silver space-y-4 text-lg leading-relaxed">
                  <p>
                    {t('terms_acceptance_text1')}
                  </p>
                  <p>
                    {t('terms_acceptance_text2')}
                  </p>
                </div>
              </div>

              {/* Seção 2: Descrição dos Serviços */}
              <div className="cosmic-card p-8">
                <h2 className="text-3xl font-bold text-cosmic-glow mb-6 flex items-center">
                  <DocumentTextIcon className="h-8 w-8 mr-3 text-cyan-400" />
                  {t('terms_services_title')}
                </h2>
                <div className="text-purple-silver space-y-4">
                  <p className="text-lg leading-relaxed">
                    {t('terms_services_subtitle')}
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Gestão de propriedades rurais</li>
                    <li>Análise de mercado e preços agrícolas</li>
                    <li>Plataforma de compra e venda de produtos</li>
                    <li>Ferramentas de staking e farming</li>
                    <li>Dashboard com métricas em tempo real</li>
                    <li>Suporte técnico e consultoria</li>
                  </ul>
                </div>
              </div>

              {/* Seção 3: Elegibilidade */}
              <div className="cosmic-card p-8">
                <h2 className="text-3xl font-bold text-cosmic-glow mb-6">
                  {t('terms_eligibility_title')}
                </h2>
                <div className="text-purple-silver space-y-4">
                  <p className="text-lg leading-relaxed">
                    {t('terms_eligibility_intro')}
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Ter pelo menos 18 anos de idade</li>
                    <li>Possuir capacidade legal para celebrar contratos</li>
                    <li>Fornecer informações verdadeiras e precisas</li>
                    <li>Respeitar todas as leis aplicáveis</li>
                    <li>Não estar em lista de restrições ou sanções</li>
                  </ul>
                </div>
              </div>

              {/* Seção 4: Criação de Conta */}
              <div className="cosmic-card p-8">
                <h2 className="text-3xl font-bold text-cosmic-glow mb-6">
                  {t('terms_account_title')}
                </h2>
                <div className="text-purple-silver space-y-4">
                  <h3 className="text-xl font-semibold text-cosmic-glow">{t('terms_account_registration')}</h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Você deve criar uma conta para acessar recursos premium</li>
                    <li>Informações fornecidas devem ser precisas e atualizadas</li>
                    <li>Você é responsável pela confidencialidade de sua senha</li>
                    <li>Notifique-nos imediatamente sobre uso não autorizado</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-cosmic-glow mt-6">{t('terms_account_verification')}</h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Podemos solicitar verificação de identidade</li>
                    <li>Documentos podem ser solicitados para validação</li>
                    <li>Contas não verificadas podem ter acesso limitado</li>
                  </ul>
                </div>
              </div>

              {/* Seção 5: Uso Aceitável */}
              <div className="cosmic-card p-8">
                <h2 className="text-3xl font-bold text-cosmic-glow mb-6">
                  {t('terms_acceptable_use_title')}
                </h2>
                <div className="text-purple-silver space-y-4">
                  <p className="text-lg leading-relaxed">
                    {t('terms_acceptable_use_intro')}
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Navegar e utilizar recursos disponíveis</li>
                    <li>Realizar transações legítimas</li>
                    <li>Comunicar-se de forma respeitosa</li>
                    <li>Reportar problemas ou bugs encontrados</li>
                    <li>Fornecer feedback construtivo</li>
                  </ul>
                </div>
              </div>

              {/* Seção 6: Uso Proibido */}
              <div className="cosmic-card p-8">
                <h2 className="text-3xl font-bold text-cosmic-glow mb-6 flex items-center">
                  <ExclamationTriangleIcon className="h-8 w-8 mr-3 text-red-400" />
                  {t('terms_prohibited_use_title')}
                </h2>
                <div className="text-purple-silver space-y-4">
                  <p className="text-lg leading-relaxed">
                    {t('terms_prohibited_use_intro')}
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Usar a plataforma para atividades ilegais</li>
                    <li>Tentar acessar contas de outros usuários</li>
                    <li>Interferir no funcionamento dos sistemas</li>
                    <li>Distribuir malware ou código malicioso</li>
                    <li>Spam ou mensagens não solicitadas</li>
                    <li>Violar direitos de propriedade intelectual</li>
                    <li>Usar bots ou automação não autorizada</li>
                  </ul>
                </div>
              </div>

              {/* Seção 7: Transações */}
              <div className="cosmic-card p-8">
                <h2 className="text-3xl font-bold text-cosmic-glow mb-6">
                  {t('terms_transactions_title')}
                </h2>
                <div className="text-purple-silver space-y-4">
                  <h3 className="text-xl font-semibold text-cosmic-glow">{t('terms_transactions_processing')}</h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Todas as transações são processadas com segurança</li>
                    <li>Taxas podem ser aplicadas conforme serviços</li>
                    <li>Pagamentos são processados em tempo real</li>
                    <li>Recebemos confirmação antes da execução</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-cosmic-glow mt-6">{t('terms_transactions_responsibilities')}</h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Você é responsável pela precisão das informações</li>
                    <li>Transações são irreversíveis após confirmação</li>
                    <li>Mantenha comprovantes de todas as operações</li>
                  </ul>
                </div>
              </div>

              {/* Seção 8: Propriedade Intelectual */}
              <div className="cosmic-card p-8">
                <h2 className="text-3xl font-bold text-cosmic-glow mb-6">
                  {t('terms_intellectual_property_title')}
                </h2>
                <div className="text-purple-silver space-y-4">
                  <p className="text-lg leading-relaxed">
                    {t('terms_intellectual_property_intro')}
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Software e código fonte</li>
                    <li>Design e interface gráfica</li>
                    <li>Conteúdo e materiais educativos</li>
                    <li>Logotipos e marcas registradas</li>
                    <li>Algoritmos e análises proprietárias</li>
                  </ul>
                  <p className="text-lg leading-relaxed mt-4">
                    {t('terms_intellectual_property_prohibition')}
                  </p>
                </div>
              </div>

              {/* Seção 9: Privacidade */}
              <div className="cosmic-card p-8">
                <h2 className="text-3xl font-bold text-cosmic-glow mb-6">
                  {t('terms_privacy_title')}
                </h2>
                <div className="text-purple-silver space-y-4">
                  <p className="text-lg leading-relaxed">
                    {t('terms_privacy_text1')}
                  </p>
                  <p className="text-lg leading-relaxed">
                    {t('terms_privacy_text2')}
                  </p>
                </div>
              </div>

              {/* Seção 10: Limitação de Responsabilidade */}
              <div className="cosmic-card p-8">
                <h2 className="text-3xl font-bold text-cosmic-glow mb-6">
                  {t('terms_liability_title')}
                </h2>
                <div className="text-purple-silver space-y-4">
                  <p className="text-lg leading-relaxed">
                    {t('terms_liability_intro')}
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Perdas financeiras decorrentes de transações</li>
                    <li>Interrupções temporárias do serviço</li>
                    <li>Danos indiretos ou consequenciais</li>
                    <li>Ações de terceiros ou usuários</li>
                    <li>Eventos de força maior</li>
                  </ul>
                  <p className="text-lg leading-relaxed mt-4">
                    {t('terms_liability_limit')}
                  </p>
                </div>
              </div>

              {/* Seção 11: Indenização */}
              <div className="cosmic-card p-8">
                <h2 className="text-3xl font-bold text-cosmic-glow mb-6">
                  {t('terms_indemnification_title')}
                </h2>
                <div className="text-purple-silver space-y-4">
                  <p className="text-lg leading-relaxed">
                    {t('terms_indemnification_intro')}
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Uso inadequado da plataforma</li>
                    <li>Violação destes termos</li>
                    <li>Violação de direitos de terceiros</li>
                    <li>Atividades ilegais ou fraudulentas</li>
                  </ul>
                </div>
              </div>

              {/* Seção 12: Rescisão */}
              <div className="cosmic-card p-8">
                <h2 className="text-3xl font-bold text-cosmic-glow mb-6">
                  {t('terms_termination_title')}
                </h2>
                <div className="text-purple-silver space-y-4">
                  <p className="text-lg leading-relaxed">
                    {t('terms_termination_intro')}
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Por violação destes termos</li>
                    <li>Por atividades fraudulentas</li>
                    <li>Por solicitação sua</li>
                    <li>Por inatividade prolongada</li>
                    <li>Por obrigações legais</li>
                  </ul>
                  <p className="text-lg leading-relaxed mt-4">
                    {t('terms_termination_consequence')}
                  </p>
                </div>
              </div>

              {/* Seção 13: Lei Aplicável */}
              <div className="cosmic-card p-8">
                <h2 className="text-3xl font-bold text-cosmic-glow mb-6">
                  {t('terms_law_title')}
                </h2>
                <div className="text-purple-silver space-y-4">
                  <p className="text-lg leading-relaxed">
                    {t('terms_law_text1')}
                  </p>
                  <p className="text-lg leading-relaxed">
                    {t('terms_law_text2')}
                  </p>
                </div>
              </div>

              {/* Seção 14: Alterações */}
              <div className="cosmic-card p-8">
                <h2 className="text-3xl font-bold text-cosmic-glow mb-6">
                  {t('terms_modifications_title')}
                </h2>
                <div className="text-purple-silver space-y-4">
                  <p className="text-lg leading-relaxed">
                    {t('terms_modifications_intro')}
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Alterações serão notificadas com antecedência</li>
                    <li>Uso contínuo constitui aceitação das mudanças</li>
                    <li>Mudanças significativas requerem consentimento explícito</li>
                    <li>Versão atual sempre estará disponível na plataforma</li>
                  </ul>
                </div>
              </div>

              {/* Seção 15: Disposições Gerais */}
              <div className="cosmic-card p-8">
                <h2 className="text-3xl font-bold text-cosmic-glow mb-6">
                  {t('terms_general_title')}
                </h2>
                <div className="text-purple-silver space-y-4">
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>{t('terms_general_item1')}</li>
                    <li>{t('terms_general_item2')}</li>
                    <li>{t('terms_general_item3')}</li>
                    <li>{t('terms_general_item4')}</li>
                  </ul>
                </div>
              </div>

              {/* Seção 16: Contato */}
              <div className="cosmic-card p-8">
                                          <h2 className="text-3xl font-bold text-cosmic-glow mb-6">
                            {t('terms_contact_title')}
                          </h2>
                          <div className="text-purple-silver space-y-4">
                            <p className="text-lg leading-relaxed">
                              {t('terms_contact_subtitle')}
                            </div>
                  <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-6 rounded-xl border border-blue-500/20">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-cosmic-glow mb-2">{t('terms_contact_email')}</h4>
                        <p>legal@agroisync.com</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-cosmic-glow mb-2">{t('terms_contact_phone')}</h4>
                        <p>+55 (66) 99999-9999</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-cosmic-glow mb-2">{t('terms_contact_address')}</h4>
                        <p>Sinop, Mato Grosso, Brasil</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-cosmic-glow mb-2">{t('terms_contact_hours')}</h4>
                        <p>Segunda a Sexta: 8h às 18h</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Terms;
