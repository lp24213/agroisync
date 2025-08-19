import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { 
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  ChartBarIcon,
  RocketLaunchIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  SparklesIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { useI18n } from '@/i18n/I18nProvider';

const About: NextPage = () => {
  const { t } = useI18n();
  
  const features = [
    {
      icon: <RocketLaunchIcon className="h-8 w-8" />,
      title: t('about_revolution_title'),
      description: t('about_revolution_desc'),
      color: 'from-cyan-500 to-blue-600'
    },
    {
      icon: <CurrencyDollarIcon className="h-8 w-8" />,
      title: t('about_payments_title'),
      description: t('about_payments_desc'),
      color: 'from-emerald-500 to-teal-600'
    },
    {
      icon: <GlobeAltIcon className="h-8 w-8" />,
      title: t('about_international_title'),
      description: t('about_international_desc'),
      color: 'from-purple-500 to-pink-600'
    },
    {
      icon: <ShieldCheckIcon className="h-8 w-8" />,
      title: t('about_blockchain_title'),
      description: t('about_blockchain_desc'),
      color: 'from-orange-500 to-red-600'
    }
  ];

  const team = [
    {
      name: t('about_team_title'),
      role: t('about_team_role'),
      description: t('about_team_desc'),
      image: '/images/team-agroisync.jpg'
    }
  ];

  return (
    <>
      <Head>
        <title>{t('about_title')} - {t('app_name')}</title>
        <meta name="description" content={t('about_subtitle')} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen cosmic-background text-white relative overflow-hidden">
        {/* Efeitos cósmicos de fundo */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          {/* Nebulosas flutuantes */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-cyan-900/20 to-blue-900/20 rounded-full blur-3xl animate-nebula-drift"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-full blur-3xl animate-nebula-drift animation-delay-2000"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-900/20 to-cyan-900/20 rounded-full blur-3xl animate-nebula-drift animation-delay-4000"></div>
          
          {/* Portais quânticos */}
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-purple-500/20 rounded-full animate-quantum-orbital"></div>
          <div className="absolute top-1/3 right-1/3 w-24 h-24 bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-cyan-500/20 rounded-full animate-quantum-orbital animation-delay-2000"></div>
          <div className="absolute bottom-1/4 right-1/4 w-28 h-28 bg-gradient-to-br from-blue-500/20 via-cyan-500/20 to-purple-500/20 rounded-full animate-quantum-orbital animation-delay-4000"></div>
          
          {/* Ondas de energia cósmica */}
          <div className="absolute top-1/2 left-0 w-64 h-1 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent animate-cosmic-wave"></div>
          <div className="absolute bottom-1/3 right-0 w-64 h-1 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent animate-cosmic-wave animation-delay-2000"></div>
          
          {/* Estrelas cintilantes */}
          <div className="absolute top-20 left-20 w-2 h-2 bg-white rounded-full animate-sparkle animation-delay-100"></div>
          <div className="absolute top-40 right-40 w-1 h-1 bg-cyan-400 rounded-full animate-sparkle animation-delay-2000"></div>
          <div className="absolute bottom-40 left-40 w-1.5 h-1.5 bg-blue-400 rounded-full animate-sparkle animation-delay-3000"></div>
          <div className="absolute bottom-20 right-20 w-1 h-1 bg-purple-400 rounded-full animate-sparkle animation-delay-4000"></div>
          
          {/* Partículas flutuantes */}
          <div className="absolute top-1/3 left-1/2 w-3 h-3 bg-cyan-400/60 rounded-full animate-cosmic-float"></div>
          <div className="absolute top-2/3 right-1/3 w-2 h-2 bg-blue-400/60 rounded-full animate-cosmic-float animation-delay-1500"></div>
          <div className="absolute bottom-1/3 left-1/3 w-2.5 h-2.5 bg-purple-400/60 rounded-full animate-cosmic-float animation-delay-3000"></div>
        </div>

        <div className="relative z-10">
          {/* Hero Section */}
          <section className="relative overflow-hidden py-32">
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/20 via-blue-900/20 to-purple-900/20"></div>
              <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-cyan-500/30 to-blue-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-cosmic-pulse"></div>
              <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-cosmic-pulse animation-delay-2000"></div>
            </div>
            
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <div className="animate-fade-in">
                {/* Badge Animado CÓSMICO */}
                <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 border border-cyan-500/30 rounded-full px-6 py-3 mb-8 animate-fade-in animation-delay-300 hover-cosmic-pulse">
                  <SparklesIcon className="h-5 w-5 text-cyan-400 animate-sparkle" />
                  <span className="text-cyan-400 font-semibold text-sm">🚀 {t('about_badge_text')}</span>
                </div>

                <h1 className="text-6xl md:text-7xl font-black mb-8 text-cosmic-glow leading-tight animate-fade-in animation-delay-600">
                  {t('about_main_title')}
                </h1>
                
                <p className="text-2xl md:text-3xl text-purple-silver mb-12 max-w-5xl mx-auto leading-relaxed animate-fade-in animation-delay-900">
                  {t('about_main_subtitle')}
                </p>

                <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in animation-delay-1200">
                  <Link href="/contact" className="group relative cosmic-button px-10 py-5 rounded-2xl text-xl font-bold hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 hover:scale-105 transform overflow-hidden">
                    <span className="relative z-10 flex items-center space-x-3">
                      <EnvelopeIcon className="h-6 w-6 group-hover:animate-bounce" />
                      <span>{t('about_contact_button')}</span>
                    </span>
                    <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  </Link>
                  
                  <Link href="/marketplace" className="group border-2 border-cyan-400 text-cyan-400 px-10 py-5 rounded-2xl text-xl font-bold hover:bg-cyan-400 hover:text-black transition-all duration-500 hover:scale-105 transform relative overflow-hidden hover-float">
                    <span className="relative z-10 flex items-center space-x-3">
                      <RocketLaunchIcon className="h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
                      <span>{t('about_explore_button')}</span>
                    </span>
                    <div className="absolute inset-0 bg-cyan-400/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Mission Section */}
          <section className="py-24 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/5 via-blue-900/5 to-purple-900/5"></div>
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-20">
                <h2 className="text-5xl font-black text-cosmic-glow mb-6">
                  {t('about_mission_title')}
                </h2>
                <p className="text-xl text-purple-silver max-w-4xl mx-auto">
                  {t('about_mission_subtitle')}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, index) => (
                  <div key={index} className="group">
                    <div className="cosmic-card h-full hover:scale-105 transition-all duration-700 hover:-translate-y-4 overflow-hidden">
                      <div className="text-center p-8">
                        <div className={`mb-6 inline-flex p-4 bg-gradient-to-br ${feature.color} rounded-2xl group-hover:scale-110 transition-transform duration-500 shadow-2xl`}>
                          <div className="text-white">
                            {feature.icon}
                          </div>
                        </div>
                        <h3 className="text-2xl font-bold text-cosmic-glow mb-4 group-hover:text-cyan-400 transition-colors duration-300">
                          {feature.title}
                        </h3>
                        <p className="text-purple-silver leading-relaxed text-lg">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Location & Contact Section */}
          <section className="py-24 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/10 via-blue-900/10 to-purple-900/10"></div>
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div>
                  <h2 className="text-5xl font-black text-cosmic-glow mb-8">
                    {t('about_location_title')}
                  </h2>
                  
                  <div className="space-y-8">
                    <div className="flex items-start space-x-4 group">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-2xl shadow-cyan-500/25 group-hover:scale-110 transition-transform duration-300">
                          <MapPinIcon className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-cosmic-glow mb-2 group-hover:text-cyan-400 transition-colors duration-300">{t('about_location_city')}</h3>
                        <p className="text-purple-silver text-lg leading-relaxed">
                          {t('about_location_desc')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4 group">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-2xl shadow-emerald-500/25 group-hover:scale-110 transition-transform duration-300">
                          <PhoneIcon className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-cosmic-glow mb-2 group-hover:text-emerald-400 transition-colors duration-300">{t('about_phone_title')}</h3>
                        <p className="text-purple-silver text-lg">
                          <a href="tel:+5566992362830" className="text-cyan-400 hover:text-cyan-300 transition-colors duration-300">
                            +55 (66) 99236-2830
                          </a>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4 group">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-2xl shadow-purple-500/25 group-hover:scale-110 transition-transform duration-300">
                          <EnvelopeIcon className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-cosmic-glow mb-2 group-hover:text-purple-400 transition-colors duration-300">{t('about_email_title')}</h3>
                        <p className="text-purple-silver text-lg">
                          <a href="mailto:contato@agroisync.com" className="text-cyan-400 hover:text-cyan-300 transition-colors duration-300">
                            contato@agroisync.com
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <div className="cosmic-card p-8">
                    <div className="text-center">
                      <div className="mb-6 inline-flex p-6 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                        <BuildingOfficeIcon className="h-16 w-16 text-cyan-400" />
                      </div>
                      <h3 className="text-3xl font-bold text-cosmic-glow mb-4">AGROISYNC</h3>
                      <p className="text-purple-silver text-lg mb-6">
                        {t('about_company_desc')}
                      </p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-cyan-400 animate-energy-pulse">+2000</div>
                          <div className="text-purple-silver">{t('about_stats_farmers')}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-400 animate-energy-pulse animation-delay-500">+150%</div>
                          <div className="text-purple-silver">{t('about_stats_productivity')}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-24 bg-gradient-to-r from-cyan-900 via-blue-900 to-purple-900 relative overflow-hidden">
            <div className="absolute inset-0">
              <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl animate-cosmic-pulse"></div>
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-cosmic-pulse animation-delay-2000"></div>
            </div>
            
            {/* Portais quânticos flutuantes */}
            <div className="absolute top-1/4 left-1/4 w-24 h-24 bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-purple-500/20 rounded-full animate-quantum-orbital"></div>
            <div className="absolute bottom-1/4 right-1/4 w-20 h-20 bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-cyan-500/20 rounded-full animate-quantum-orbital animation-delay-3000"></div>
            
            <div className="relative z-10 max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8">
              <h2 className="text-5xl font-black text-white mb-8 text-glow">
                {t('about_cta_title')}
              </h2>
              <p className="text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
                {t('about_cta_subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-8 justify-center">
                <Link href="/marketplace" className="group relative cosmic-button px-12 py-6 rounded-2xl text-2xl font-bold hover:shadow-2xl hover:shadow-white/25 transition-all duration-500 hover:scale-105 transform overflow-hidden">
                  <span className="relative z-10 flex items-center space-x-4">
                    <RocketLaunchIcon className="h-8 w-8 group-hover:animate-bounce" />
                    <span>{t('about_cta_create_account')}</span>
                  </span>
                  <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </Link>
                <Link href="/contact" className="group border-2 border-white text-white px-12 py-6 rounded-2xl text-2xl font-bold hover:bg-white hover:text-black transition-all duration-500 hover:scale-105 transform relative overflow-hidden hover-float">
                  <span className="relative z-10">{t('about_cta_learn_more')}</span>
                  <div className="absolute inset-0 bg-white/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

export default About;
