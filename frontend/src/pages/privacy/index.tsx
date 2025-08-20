import React from 'react'
import { NextPage } from 'next'
import Head from 'next/head'
import { useI18n } from '@/i18n/I18nProvider'
import { 
  ShieldCheckIcon,
  EyeIcon,
  LockClosedIcon,
  UserIcon,
  CogIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import Footer from '@/components/layout/Footer'
import Chatbot from '@/components/Chatbot'

const Privacy: NextPage = () => {
  const { t } = useI18n()

  const privacySections = [
    {
      title: 'Coleta de Informações',
      icon: <UserIcon className="h-6 w-6 text-blue-400" />,
      content: [
        'Informações pessoais (nome, email, telefone, endereço)',
        'Informações de perfil e preferências',
        'Dados de transações e histórico de atividades',
        'Informações técnicas (IP, cookies, logs de acesso)',
        'Dados de localização quando necessário para serviços'
      ]
    },
    {
      title: 'Uso das Informações',
      icon: <CogIcon className="h-6 w-6 text-green-400" />,
      content: [
        'Fornecer e melhorar nossos serviços',
        'Processar transações e pagamentos',
        'Comunicar atualizações e novidades',
        'Personalizar experiência do usuário',
        'Cumprir obrigações legais e regulatórias'
      ]
    },
    {
      title: 'Proteção de Dados',
      icon: <ShieldCheckIcon className="h-6 w-6 text-purple-400" />,
      content: [
        'Criptografia de ponta a ponta',
        'Acesso restrito e controlado',
        'Monitoramento contínuo de segurança',
        'Backup e recuperação de dados',
        'Conformidade com LGPD e GDPR'
      ]
    },
    {
      title: 'Compartilhamento',
      icon: <EyeIcon className="h-6 w-6 text-yellow-400" />,
      content: [
        'Apenas com consentimento explícito',
        'Parceiros de confiança e seguros',
        'Quando exigido por lei',
        'Para proteção de direitos e segurança',
        'Nunca vendemos dados pessoais'
      ]
    }
  ]

  const userRights = [
    {
      title: 'Acesso aos Dados',
      description: 'Solicitar cópia de todos os dados pessoais armazenados',
      icon: <CheckCircleIcon className="h-5 w-5 text-green-400" />
    },
    {
      title: 'Correção',
      description: 'Solicitar correção de dados incorretos ou incompletos',
      icon: <CheckCircleIcon className="h-5 w-5 text-blue-400" />
    },
    {
      title: 'Exclusão',
      description: 'Solicitar exclusão de dados pessoais (direito ao esquecimento)',
      icon: <CheckCircleIcon className="h-5 w-5 text-red-400" />
    },
    {
      title: 'Portabilidade',
      description: 'Receber dados em formato estruturado e legível',
      icon: <CheckCircleIcon className="h-5 w-5 text-purple-400" />
    },
    {
      title: 'Oposição',
      description: 'Opor-se ao processamento de dados pessoais',
      icon: <CheckCircleIcon className="h-5 w-5 text-yellow-400" />
    },
    {
      title: 'Revogação',
      description: 'Revogar consentimento a qualquer momento',
      icon: <CheckCircleIcon className="h-5 w-5 text-cyan-400" />
    }
  ]

  const cookies = [
    {
      type: 'Essenciais',
      description: 'Necessários para o funcionamento básico do site',
      examples: 'Login, carrinho de compras, preferências básicas',
      duration: 'Sessão'
    },
    {
      type: 'Analíticos',
      description: 'Ajudam a entender como os usuários interagem com o site',
      examples: 'Google Analytics, métricas de performance',
      duration: '2 anos'
    },
    {
      type: 'Funcionais',
      description: 'Permitem funcionalidades avançadas e personalização',
      examples: 'Idioma, região, configurações avançadas',
      duration: '1 ano'
    },
    {
      type: 'Marketing',
      description: 'Usados para publicidade e marketing direcionado',
      examples: 'Anúncios personalizados, redes sociais',
      duration: '6 meses'
    }
  ]

  return (
    <>
      <Head>
        <title>{t('privacy_policy')} - {t('app_name')}</title>
        <meta name="description" content="Política de Privacidade do AgroSync - Saiba como protegemos seus dados" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        {/* Header da Página */}
        <div className="bg-gradient-to-r from-purple-600/20 to-cyan-600/20 border-b border-purple-500/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-purple-500/20 rounded-2xl">
                  <ShieldCheckIcon className="h-12 w-12 text-purple-400" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {t('privacy_policy')}
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Sua privacidade é fundamental para nós. Saiba como coletamos, usamos e protegemos suas informações.
              </p>
              <div className="mt-6 text-sm text-gray-400">
                Última atualização: {new Date().toLocaleDateString('pt-BR')}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          
          {/* Introdução */}
          <div className="mb-12">
            <div className="bg-gray-800/50 rounded-2xl p-8 border border-purple-500/20">
              <h2 className="text-2xl font-bold text-white mb-4">Compromisso com a Privacidade</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                O AgroSync está comprometido em proteger sua privacidade e garantir a segurança de seus dados pessoais. 
                Esta política descreve como coletamos, usamos, armazenamos e protegemos suas informações.
              </p>
              <p className="text-gray-400 leading-relaxed">
                Ao usar nossos serviços, você concorda com as práticas descritas nesta política. 
                Reservamo-nos o direito de atualizar esta política periodicamente, notificando sobre mudanças significativas.
              </p>
            </div>
          </div>

          {/* Seções de Privacidade */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Como Protegemos Sua Privacidade</h2>
            
            <div className="space-y-6">
              {privacySections.map((section, index) => (
                <div
                  key={index}
                  className="bg-gray-800/50 rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300"
                >
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-gray-700/30 rounded-xl">
                      {section.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-4">{section.title}</h3>
                      <ul className="space-y-2">
                        {section.content.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-start space-x-2">
                            <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-300">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Direitos do Usuário */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Seus Direitos</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userRights.map((right, index) => (
                <div
                  key={index}
                  className="bg-gray-800/50 rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300"
                >
                  <div className="flex items-start space-x-3">
                    {right.icon}
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">{right.title}</h3>
                      <p className="text-gray-400 text-sm">{right.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cookies */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Política de Cookies</h2>
            
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-purple-500/20">
              <p className="text-gray-300 mb-6 leading-relaxed">
                Utilizamos cookies e tecnologias similares para melhorar sua experiência, analisar o tráfego 
                e personalizar conteúdo. Você pode controlar o uso de cookies através das configurações do seu navegador.
              </p>
              
              <div className="space-y-4">
                {cookies.map((cookie, index) => (
                  <div key={index} className="p-4 bg-gray-700/30 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-white">{cookie.type}</h4>
                      <span className="text-sm text-gray-400 bg-gray-600 px-2 py-1 rounded-full">
                        {cookie.duration}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm mb-2">{cookie.description}</p>
                    <p className="text-gray-400 text-xs">Exemplos: {cookie.examples}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Segurança */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Medidas de Segurança</h2>
            
            <div className="bg-gray-800/50 rounded-2xl p-8 border border-purple-500/20">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <LockClosedIcon className="h-6 w-6 text-green-400 mr-2" />
                    Segurança Técnica
                  </h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Criptografia AES-256 para dados em repouso</li>
                    <li>• TLS 1.3 para transmissão de dados</li>
                    <li>• Autenticação de dois fatores (2FA)</li>
                    <li>• Monitoramento 24/7 de segurança</li>
                    <li>• Testes de penetração regulares</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <ShieldCheckIcon className="h-6 w-6 text-blue-400 mr-2" />
                    Conformidade Legal
                  </h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Conformidade com LGPD (Brasil)</li>
                    <li>• Conformidade com GDPR (Europa)</li>
                    <li>• Auditorias de segurança anuais</li>
                    <li>• Relatórios de transparência</li>
                    <li>• Política de retenção de dados</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Transferência de Dados */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">Transferência Internacional de Dados</h2>
            
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-purple-500/20">
              <div className="flex items-start space-x-4">
                <ExclamationTriangleIcon className="h-8 w-8 text-yellow-400 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Transferências Seguras</h3>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Seus dados podem ser transferidos e processados em países fora do Brasil. 
                    Garantimos que todas as transferências internacionais seguem padrões rigorosos de segurança.
                  </p>
                  <ul className="space-y-2 text-gray-400">
                    <li>• Acordos de processamento de dados (DPAs)</li>
                    <li>• Cláusulas contratuais padrão</li>
                    <li>• Certificações de adequação</li>
                    <li>• Mecanismos de proteção adicionais</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Retenção de Dados */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">Retenção de Dados</h2>
            
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-purple-500/20">
              <p className="text-gray-300 leading-relaxed mb-4">
                Mantemos seus dados pessoais apenas pelo tempo necessário para cumprir os propósitos 
                para os quais foram coletados, incluindo obrigações legais, contábeis ou de relatórios.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-700/30 rounded-xl">
                  <div className="text-2xl font-bold text-purple-400">7 anos</div>
                  <div className="text-sm text-gray-400">Dados contábeis</div>
                </div>
                <div className="text-center p-4 bg-gray-700/30 rounded-xl">
                  <div className="text-2xl font-bold text-blue-400">3 anos</div>
                  <div className="text-sm text-gray-400">Histórico de transações</div>
                </div>
                <div className="text-center p-4 bg-gray-700/30 rounded-xl">
                  <div className="text-2xl font-bold text-green-400">1 ano</div>
                  <div className="text-sm text-gray-400">Dados de marketing</div>
                </div>
              </div>
            </div>
          </div>

          {/* Contato */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">Entre em Contato</h2>
            
            <div className="bg-gray-800/50 rounded-2xl p-8 border border-purple-500/20 text-center">
              <h3 className="text-xl font-semibold text-white mb-4">Dúvidas sobre Privacidade?</h3>
              <p className="text-gray-300 mb-6">
                Nossa equipe de privacidade está disponível para responder suas perguntas e 
                processar suas solicitações relacionadas aos seus dados pessoais.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-gray-700/30 rounded-xl">
                  <h4 className="font-semibold text-white mb-2">Email</h4>
                  <a href="mailto:privacy@agroisync.com" className="text-purple-400 hover:text-purple-300 transition-colors">
                    privacy@agroisync.com
                  </a>
                </div>
                
                <div className="p-4 bg-gray-700/30 rounded-xl">
                  <h4 className="font-semibold text-white mb-2">Telefone</h4>
                  <a href="tel:+5566999999999" className="text-purple-400 hover:text-purple-300 transition-colors">
                    +55 (66) 99999-9999
                  </a>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                <p className="text-sm text-purple-300">
                  <strong>Tempo de resposta:</strong> Respondemos a todas as solicitações de privacidade 
                  em até 30 dias, conforme exigido pela legislação aplicável.
                </p>
              </div>
            </div>
          </div>

          {/* Atualizações */}
          <div className="text-center">
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-purple-500/20">
              <h3 className="text-xl font-semibold text-white mb-3">Atualizações da Política</h3>
              <p className="text-gray-300 mb-4">
                Esta política pode ser atualizada periodicamente para refletir mudanças em nossas práticas 
                ou por outros motivos operacionais, legais ou regulatórios.
              </p>
              <p className="text-gray-400 text-sm">
                <strong>Última atualização:</strong> {new Date().toLocaleDateString('pt-BR')} | 
                <strong>Versão:</strong> 2.1.0
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>

      {/* Chatbot */}
      <Chatbot />
    </>
  )
}

export default Privacy
