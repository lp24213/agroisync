import { NextPage } from 'next';
import Head from 'next/head';
import { ShieldCheckIcon, LockClosedIcon, EyeIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { useI18n } from '@/i18n/I18nProvider';

const Privacy: NextPage = () => {
  const { t } = useI18n();
  
  return (
    <>
      <Head>
        <title>{t('privacy_title')} - {t('app_name')}</title>
        <meta name="description" content={`${t('privacy_title')} da ${t('app_name')} - Proteção de dados e transparência`} />
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
                <div className="h-20 w-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/25">
                  <ShieldCheckIcon className="h-10 w-10 text-white" />
                </div>
              </div>
              <h1 className="text-5xl font-black text-cosmic-glow mb-6">
                {t('privacy_title')}
              </h1>
              <p className="text-xl text-purple-silver leading-relaxed">
                {t('privacy_subtitle')}
              </p>
              <div className="mt-6 text-sm text-purple-silver">
                {t('privacy_last_update')}: {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Conteúdo Principal */}
          <div className="max-w-4xl mx-auto px-4 pb-20">
            <div className="space-y-8">
              {/* Seção 1: Introdução */}
              <div className="cosmic-card p-8">
                <h2 className="text-3xl font-bold text-cosmic-glow mb-6 flex items-center">
                  <DocumentTextIcon className="h-8 w-8 mr-3 text-cyan-400" />
                  {t('privacy_intro_title')}
                </h2>
                <div className="text-purple-silver space-y-4 text-lg leading-relaxed">
                  <p>
                    {t('privacy_intro_text1')}
                  </p>
                  <p>
                    {t('privacy_intro_text2')}
                  </p>
                </div>
              </div>

              {/* Seção 2: Dados Coletados */}
              <div className="cosmic-card p-8">
                <h2 className="text-3xl font-bold text-cosmic-glow mb-6 flex items-center">
                  <EyeIcon className="h-8 w-8 mr-3 text-blue-400" />
                  {t('privacy_data_title')}
                </h2>
                <div className="text-purple-silver space-y-4">
                  <h3 className="text-xl font-semibold text-cosmic-glow">{t('privacy_personal_data')}</h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Nome completo e informações de identificação</li>
                    <li>Endereço de e-mail e número de telefone</li>
                    <li>Endereço residencial e comercial</li>
                    <li>Documentos de identificação (CPF, CNPJ)</li>
                    <li>Informações bancárias para transações</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-cosmic-glow mt-6">{t('privacy_usage_data')}</h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Logs de acesso e navegação</li>
                    <li>Preferências e configurações da conta</li>
                    <li>Histórico de transações e operações</li>
                    <li>Dados de localização (quando relevante)</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-cosmic-glow mt-6">{t('privacy_agricultural_data')}</h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Informações sobre propriedades rurais</li>
                    <li>Dados de produção e safras</li>
                    <li>Métricas de performance agrícola</li>
                    <li>Análises de mercado e preços</li>
                  </ul>
                </div>
              </div>

              {/* Seção 3: Como Usamos */}
              <div className="cosmic-card p-8">
                                  <h2 className="text-3xl font-bold text-cosmic-glow mb-6 flex items-center">
                    <LockClosedIcon className="h-8 w-8 mr-3 text-purple-400" />
                    {t('privacy_usage_title')}
                  </h2>
                <div className="text-purple-silver space-y-4">
                  <h3 className="text-xl font-semibold text-cosmic-glow">{t('privacy_usage_main_purposes')}</h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Fornecer e manter nossos serviços</li>
                    <li>Processar transações e pagamentos</li>
                    <li>Comunicar atualizações e novidades</li>
                    <li>Melhorar a experiência do usuário</li>
                    <li>Cumprir obrigações legais</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-cosmic-glow mt-6">{t('privacy_usage_analysis')}</h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Análise de tendências de mercado</li>
                    <li>Otimização de algoritmos de preços</li>
                    <li>Desenvolvimento de novos recursos</li>
                    <li>Personalização de recomendações</li>
                  </ul>
                </div>
              </div>

              {/* Seção 4: Compartilhamento */}
              <div className="cosmic-card p-8">
                <h2 className="text-3xl font-bold text-cosmic-glow mb-6">
                  {t('privacy_sharing_title')}
                </h2>
                <div className="text-purple-silver space-y-4">
                  <p className="text-lg leading-relaxed">
                    {t('privacy_sharing_intro')}
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Com seu consentimento explícito</li>
                    <li>Para cumprir obrigações legais</li>
                    <li>Com prestadores de serviços confiáveis</li>
                    <li>Para proteger nossos direitos e segurança</li>
                    <li>Em caso de fusão ou aquisição empresarial</li>
                  </ul>
                </div>
              </div>

              {/* Seção 5: Segurança */}
              <div className="cosmic-card p-8">
                <h2 className="text-3xl font-bold text-cosmic-glow mb-6">
                  {t('privacy_security_title')}
                </h2>
                <div className="text-purple-silver space-y-4">
                  <p className="text-lg leading-relaxed">
                    {t('privacy_security_intro')}
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Criptografia de ponta a ponta</li>
                    <li>Firewalls e sistemas de detecção de intrusão</li>
                    <li>Monitoramento 24/7 de segurança</li>
                    <li>Backups regulares e redundantes</li>
                    <li>Treinamento contínuo da equipe</li>
                    <li>Auditorias de segurança regulares</li>
                  </ul>
                </div>
              </div>

              {/* Seção 6: Seus Direitos */}
              <div className="cosmic-card p-8">
                <h2 className="text-3xl font-bold text-cosmic-glow mb-6">
                  {t('privacy_rights_title')}
                </h2>
                <div className="text-purple-silver space-y-4">
                  <p className="text-lg leading-relaxed">
                    {t('privacy_rights_intro')}
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong className="text-cosmic-glow">Acesso:</strong> Solicitar cópia de seus dados</li>
                    <li><strong className="text-cosmic-glow">Correção:</strong> Atualizar informações incorretas</li>
                    <li><strong className="text-cosmic-glow">Exclusão:</strong> Solicitar remoção de dados</li>
                    <li><strong className="text-cosmic-glow">Portabilidade:</strong> Transferir dados para outro serviço</li>
                    <li><strong className="text-cosmic-glow">Revogação:</strong> Cancelar consentimentos</li>
                    <li><strong className="text-cosmic-glow">Oposição:</strong> Contestar uso de dados</li>
                  </ul>
                </div>
              </div>

              {/* Seção 7: Cookies */}
              <div className="cosmic-card p-8">
                <h2 className="text-3xl font-bold text-cosmic-glow mb-6">
                  {t('privacy_cookies_title')}
                </h2>
                <div className="text-purple-silver space-y-4">
                  <p className="text-lg leading-relaxed">
                    {t('privacy_cookies_intro')}
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Manter sua sessão ativa</li>
                    <li>Lembrar suas preferências</li>
                    <li>Analisar o uso da plataforma</li>
                    <li>Personalizar conteúdo e anúncios</li>
                    <li>Melhorar a performance</li>
                  </ul>
                  <p className="text-lg leading-relaxed mt-4">
                    {t('privacy_cookies_management')}
                  </p>
                </div>
              </div>

              {/* Seção 8: Retenção */}
              <div className="cosmic-card p-8">
                <h2 className="text-3xl font-bold text-cosmic-glow mb-6">
                  {t('privacy_retention_title')}
                </h2>
                <div className="text-purple-silver space-y-4">
                  <p className="text-lg leading-relaxed">
                    {t('privacy_retention_intro')}
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Fornecer nossos serviços</li>
                    <li>Cumprir obrigações legais</li>
                    <li>Resolver disputas</li>
                    <li>Executar contratos</li>
                  </ul>
                  <p className="text-lg leading-relaxed mt-4">
                    {t('privacy_retention_auto_deletion')}
                  </p>
                </div>
              </div>

              {/* Seção 9: Transferências */}
              <div className="cosmic-card p-8">
                <h2 className="text-3xl font-bold text-cosmic-glow mb-6">
                  {t('privacy_transfers_title')}
                </h2>
                <div className="text-purple-silver space-y-4">
                  <p className="text-lg leading-relaxed">
                    {t('privacy_transfers_text')}
                  </p>
                </div>
              </div>

              {/* Seção 10: Menores de Idade */}
              <div className="cosmic-card p-8">
                <h2 className="text-3xl font-bold text-cosmic-glow mb-6">
                  {t('privacy_minors_title')}
                </h2>
                <div className="text-purple-silver space-y-4">
                  <p className="text-lg leading-relaxed">
                    {t('privacy_minors_text')}
                  </p>
                </div>
              </div>

              {/* Seção 11: Alterações */}
              <div className="cosmic-card p-8">
                <h2 className="text-3xl font-bold text-cosmic-glow mb-6">
                  {t('privacy_changes_title')}
                </h2>
                <div className="text-purple-silver space-y-4">
                  <p className="text-lg leading-relaxed">
                    {t('privacy_changes_intro')}
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>E-mail para sua conta registrada</li>
                    <li>Notificação na plataforma</li>
                    <li>Atualização da data de modificação</li>
                  </ul>
                </div>
              </div>

              {/* Seção 12: Contato */}
              <div className="cosmic-card p-8">
                                          <h2 className="text-3xl font-bold text-cosmic-glow mb-6">
                            {t('privacy_contact_title')}
                          </h2>
                          <div className="text-purple-silver space-y-4">
                            <p className="text-lg leading-relaxed">
                              {t('privacy_contact_subtitle')}
                            </p>
                            <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 p-6 rounded-xl border border-cyan-500/20">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-semibold text-cosmic-glow mb-2">{t('privacy_contact_email')}</h4>
                                  <p>privacy@agroisync.com</p>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-cosmic-glow mb-2">{t('privacy_contact_phone')}</h4>
                                  <p>+55 (66) 99999-9999</p>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-cosmic-glow mb-2">{t('privacy_contact_address')}</h4>
                                  <p>Sinop, Mato Grosso, Brasil</p>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-cosmic-glow mb-2">{t('privacy_contact_hours')}</h4>
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

export default Privacy;
