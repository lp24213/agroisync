import { NextPage } from 'next';
import Head from 'next/head';
import { CakeIcon, CogIcon, ShieldCheckIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { useI18n } from '@/i18n/I18nProvider';

const Cookies: NextPage = () => {
  const { t } = useI18n();
  
  return (
    <>
      <Head>
        <title>{t('cookies_title')} - {t('app_name')}</title>
        <meta name="description" content={`${t('cookies_title')} da ${t('app_name')} - Uso de cookies e tecnologias similares`} />
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
                <div className="h-20 w-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/25">
                                     <CakeIcon className="h-10 w-10 text-white" />
                </div>
              </div>
              <h1 className="text-5xl font-black text-cosmic-glow mb-6">
                {t('cookies_title')}
              </h1>
              <p className="text-xl text-purple-silver leading-relaxed">
                {t('cookies_subtitle')}
              </p>
              <div className="mt-6 text-sm text-purple-silver">
                {t('privacy_last_update')}: {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Conteúdo Principal */}
          <div className="max-w-4xl mx-auto px-4 pb-20">
            <div className="space-y-8">
              {/* Seção 1: O que são Cookies */}
              <div className="cosmic-card p-8">
                <h2 className="text-3xl font-bold text-cosmic-glow mb-6 flex items-center">
                  <InformationCircleIcon className="h-8 w-8 mr-3 text-blue-400" />
                  {t('cookies_what_title')}
                </h2>
                <div className="text-purple-silver space-y-4 text-lg leading-relaxed">
                  <p>
                    {t('cookies_what_text1')}
                  </p>
                  <p>
                    {t('cookies_what_text2')}
                  </p>
                </div>
              </div>

              {/* Seção 2: Como Utilizamos */}
              <div className="cosmic-card p-8">
                <h2 className="text-3xl font-bold text-cosmic-glow mb-6 flex items-center">
                  <CogIcon className="h-8 w-8 mr-3 text-cyan-400" />
                  {t('cookies_how_title')}
                </h2>
                <div className="text-purple-silver space-y-4">
                  <p className="text-lg leading-relaxed">
                    {t('cookies_how_subtitle')}
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                                         <li>{t('cookies_how_item1')}</li>
                     <li>{t('cookies_how_item2')}</li>
                     <li>{t('cookies_how_item3')}</li>
                     <li>{t('cookies_how_item4')}</li>
                     <li>{t('cookies_how_item5')}</li>
                     <li>{t('cookies_how_item6')}</li>
                  </ul>
                </div>
              </div>

              {/* Seção 3: Tipos de Cookies */}
              <div className="cosmic-card p-8">
                <h2 className="text-3xl font-bold text-cosmic-glow mb-6">
                  {t('cookies_types_title')}
                </h2>
                <div className="text-purple-silver space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-cosmic-glow mb-3">{t('cookies_types_essential')}</h3>
                    <p className="text-lg leading-relaxed mb-3">
                      {t('cookies_types_essential_intro')}
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>{t('cookies_types_essential_item1')}</li>
                      <li>{t('cookies_types_essential_item2')}</li>
                      <li>{t('cookies_types_essential_item3')}</li>
                      <li>{t('cookies_types_essential_item4')}</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-cosmic-glow mb-3">{t('cookies_types_performance')}</h3>
                    <p className="text-lg leading-relaxed mb-3">
                      {t('cookies_types_performance_intro')}
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>{t('cookies_types_performance_item1')}</li>
                      <li>{t('cookies_types_performance_item2')}</li>
                      <li>{t('cookies_types_performance_item3')}</li>
                      <li>{t('cookies_types_performance_item4')}</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-cosmic-glow mb-3">{t('cookies_types_functionality')}</h3>
                    <p className="text-lg leading-relaxed mb-3">
                      {t('cookies_types_functionality_intro')}
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>{t('cookies_types_functionality_item1')}</li>
                      <li>{t('cookies_types_functionality_item2')}</li>
                      <li>{t('cookies_types_functionality_item3')}</li>
                      <li>{t('cookies_types_functionality_item4')}</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-cosmic-glow mb-3">{t('cookies_types_marketing')}</h3>
                    <p className="text-lg leading-relaxed mb-3">
                      {t('cookies_types_marketing_intro')}
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>{t('cookies_types_marketing_item1')}</li>
                      <li>{t('cookies_types_marketing_item2')}</li>
                      <li>{t('cookies_types_marketing_item3')}</li>
                      <li>{t('cookies_types_marketing_item4')}</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Seção 4: Cookies de Terceiros */}
              <div className="cosmic-card p-8">
                <h2 className="text-3xl font-bold text-cosmic-glow mb-6">
                  {t('cookies_third_party_title')}
                </h2>
                <div className="text-purple-silver space-y-4">
                  <p className="text-lg leading-relaxed">
                    {t('cookies_third_party_intro')}
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                                         <li><strong className="text-cosmic-glow">Google Analytics:</strong> {t('cookies_third_party_google_analytics')}</li>
                     <li><strong className="text-cosmic-glow">Stripe:</strong> {t('cookies_third_party_stripe')}</li>
                     <li><strong className="text-cosmic-glow">Intercom:</strong> {t('cookies_third_party_intercom')}</li>
                     <li><strong className="text-cosmic-glow">Hotjar:</strong> {t('cookies_third_party_hotjar')}</li>
                     <li><strong className="text-cosmic-glow">Facebook Pixel:</strong> {t('cookies_third_party_facebook_pixel')}</li>
                  </ul>
                  <p className="text-lg leading-relaxed mt-4">
                    {t('cookies_third_party_policies')}
                  </p>
                </div>
              </div>

              {/* Seção 5: Duração dos Cookies */}
              <div className="cosmic-card p-8">
                <h2 className="text-3xl font-bold text-cosmic-glow mb-6">
                  {t('cookies_duration_title')}
                </h2>
                <div className="text-purple-silver space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-cosmic-glow mb-3">{t('cookies_duration_session')}</h3>
                    <p className="text-lg leading-relaxed">
                      {t('cookies_duration_session_intro')}
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
                                             <li>{t('cookies_duration_session_item1')}</li>
                       <li>{t('cookies_duration_session_item2')}</li>
                       <li>{t('cookies_duration_session_item3')}</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-cosmic-glow mb-3 mt-6">5.2 Cookies Persistentes</h3>
                    <p className="text-lg leading-relaxed">
                      {t('cookies_duration_persistent_intro')}
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
                                             <li>{t('cookies_duration_persistent_item1')}</li>
                       <li>{t('cookies_duration_persistent_item2')}</li>
                       <li>{t('cookies_duration_persistent_item3')}</li>
                       <li>{t('cookies_duration_persistent_item4')}</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Seção 6: Gerenciamento */}
              <div className="cosmic-card p-8">
                <h2 className="text-3xl font-bold text-cosmic-glow mb-6">
                  {t('cookies_management_title')}
                </h2>
                <div className="text-purple-silver space-y-4">
                  <h3 className="text-xl font-semibold text-cosmic-glow">{t('cookies_management_browser_title')}</h3>
                  <p className="text-lg leading-relaxed mb-3">
                    {t('cookies_management_browser_intro')}
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                                         <li><strong className="text-cosmic-glow">Chrome:</strong> {t('cookies_management_browser_chrome')}</li>
                     <li><strong className="text-cosmic-glow">Firefox:</strong> {t('cookies_management_browser_firefox')}</li>
                     <li><strong className="text-cosmic-glow">Safari:</strong> {t('cookies_management_browser_safari')}</li>
                     <li><strong className="text-cosmic-glow">Edge:</strong> {t('cookies_management_browser_edge')}</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-cosmic-glow mt-6">{t('cookies_management_platform_title')}</h3>
                  <p className="text-lg leading-relaxed mb-3">
                    {t('cookies_management_platform_intro')}
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                                         <li>{t('cookies_management_platform_item1')}</li>
                     <li>{t('cookies_management_platform_item2')}</li>
                     <li>{t('cookies_management_platform_item3')}</li>
                     <li>{t('cookies_management_platform_item4')}</li>
                  </ul>
                </div>
              </div>

              {/* Seção 7: Impacto da Desativação */}
              <div className="cosmic-card p-8">
                <h2 className="text-3xl font-bold text-cosmic-glow mb-6">
                  {t('cookies_deactivation_title')}
                </h2>
                <div className="text-purple-silver space-y-4">
                  <p className="text-lg leading-relaxed">
                    {t('cookies_deactivation_intro')}
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                                         <li>{t('cookies_deactivation_item1')}</li>
                     <li>{t('cookies_deactivation_item2')}</li>
                     <li>{t('cookies_deactivation_item3')}</li>
                     <li>{t('cookies_deactivation_item4')}</li>
                     <li>{t('cookies_deactivation_item5')}</li>
                  </ul>
                  <p className="text-lg leading-relaxed mt-4">
                    {t('cookies_deactivation_recommendation')}
                  </p>
                </div>
              </div>

              {/* Seção 8: Tecnologias Similares */}
              <div className="cosmic-card p-8">
                <h2 className="text-3xl font-bold text-cosmic-glow mb-6">
                  {t('cookies_other_technologies_title')}
                </h2>
                <div className="text-purple-silver space-y-4">
                  <p className="text-lg leading-relaxed">
                    {t('cookies_other_technologies_intro')}
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                                         <li><strong className="text-cosmic-glow">Local Storage:</strong> {t('cookies_other_technologies_local_storage')}</li>
                     <li><strong className="text-cosmic-glow">Session Storage:</strong> {t('cookies_other_technologies_session_storage')}</li>
                     <li><strong className="text-cosmic-glow">Web Beacons:</strong> {t('cookies_other_technologies_web_beacons')}</li>
                     <li><strong className="text-cosmic-glow">Fingerprinting:</strong> {t('cookies_other_technologies_fingerprinting')}</li>
                     <li><strong className="text-cosmic-glow">Pixels:</strong> {t('cookies_other_technologies_pixels')}</li>
                  </ul>
                </div>
              </div>

              {/* Seção 9: Atualizações */}
              <div className="cosmic-card p-8">
                <h2 className="text-3xl font-bold text-cosmic-glow mb-6">
                  {t('cookies_updates_title')}
                </h2>
                <div className="text-purple-silver space-y-4">
                  <p className="text-lg leading-relaxed">
                    {t('cookies_updates_intro')}
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                                         <li>{t('cookies_updates_item1')}</li>
                     <li>{t('cookies_updates_item2')}</li>
                     <li>{t('cookies_updates_item3')}</li>
                     <li>{t('cookies_updates_item4')}</li>
                  </ul>
                  <p className="text-lg leading-relaxed mt-4">
                    {t('cookies_updates_notification')}
                  </p>
                </div>
              </div>

              {/* Seção 10: Conformidade Legal */}
              <div className="cosmic-card p-8">
                <h2 className="text-3xl font-bold text-cosmic-glow mb-6 flex items-center">
                  <ShieldCheckIcon className="h-8 w-8 mr-3 text-green-400" />
                  {t('cookies_compliance_title')}
                </h2>
                <div className="text-purple-silver space-y-4">
                  <p className="text-lg leading-relaxed">
                    {t('cookies_compliance_intro')}
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                                         <li><strong className="text-cosmic-glow">LGPD (Lei Geral de Proteção de Dados):</strong> {t('cookies_compliance_lgpd')}</li>
                     <li><strong className="text-cosmic-glow">Marco Civil da Internet:</strong> {t('cookies_compliance_marco_civil')}</li>
                     <li><strong className="text-cosmic-glow">GDPR (UE):</strong> {t('cookies_compliance_gdpr')}</li>
                     <li><strong className="text-cosmic-glow">CCPA (Califórnia):</strong> {t('cookies_compliance_ccpa')}</li>
                  </ul>
                  <p className="text-lg leading-relaxed mt-4">
                    {t('cookies_compliance_rights')}
                  </p>
                </div>
              </div>

              {/* Seção 11: Dúvidas */}
              <div className="cosmic-card p-8">
                                          <h2 className="text-3xl font-bold text-cosmic-glow mb-6">
                            {t('cookies_contact_title')}
                          </h2>
                          <div className="text-purple-silver space-y-4">
                            <p className="text-lg leading-relaxed">
                              {t('cookies_contact_subtitle')}
                            </p>
                  <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-6 rounded-xl border border-green-500/20">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-cosmic-glow mb-2">{t('cookies_contact_email_title')}</h4>
                        <p>cookies@agroisync.com</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-cosmic-glow mb-2">{t('cookies_contact_phone_title')}</h4>
                        <p>+55 (66) 99999-9999</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-cosmic-glow mb-2">{t('cookies_contact_address_title')}</h4>
                        <p>Sinop, Mato Grosso, Brasil</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-cosmic-glow mb-2">{t('cookies_contact_schedule_title')}</h4>
                        <p>Segunda a Sexta: 8h às 18h</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-lg leading-relaxed mt-4">
                    {t('cookies_contact_support')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cookies;
