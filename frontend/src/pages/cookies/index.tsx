import React, { useState } from 'react'
import { NextPage } from 'next'
import Head from 'next/head'
import { useI18n } from '@/i18n/I18nProvider'
import { 
  CakeIcon,
  CogIcon,
  ShieldCheckIcon,
  EyeIcon,
  ClockIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'
import Footer from '@/components/layout/Footer'
import Chatbot from '@/components/Chatbot'

const Cookies: NextPage = () => {
  const { t } = useI18n()
  const [cookiePreferences, setCookiePreferences] = useState({
    essential: true,
    analytics: false,
    functional: false,
    marketing: false
  })

  const cookieTypes = [
    {
      type: 'Essenciais',
      description: 'Necessários para o funcionamento básico do site',
      examples: ['Sessão de usuário', 'Carrinho de compras', 'Preferências básicas', 'Segurança'],
      duration: 'Sessão',
      required: true,
      color: 'green'
    },
    {
      type: 'Analíticos',
      description: 'Ajudam a entender como os usuários interagem com o site',
      examples: ['Google Analytics', 'Métricas de performance', 'Análise de comportamento', 'Relatórios'],
      duration: '2 anos',
      required: false,
      color: 'blue'
    },
    {
      type: 'Funcionais',
      description: 'Permitem funcionalidades avançadas e personalização',
      examples: ['Idioma e região', 'Configurações avançadas', 'Histórico de navegação', 'Preferências'],
      duration: '1 ano',
      required: false,
      color: 'purple'
    },
    {
      type: 'Marketing',
      description: 'Usados para publicidade e marketing direcionado',
      examples: ['Anúncios personalizados', 'Redes sociais', 'Remarketing', 'Campanhas'],
      duration: '6 meses',
      required: false,
      color: 'orange'
    }
  ]

  const cookieDetails = [
    {
      name: 'session_id',
      type: 'Essencial',
      purpose: 'Manter sessão do usuário ativa',
      duration: 'Sessão',
      provider: 'AgroSync'
    },
    {
      name: 'user_preferences',
      type: 'Funcional',
      purpose: 'Armazenar preferências do usuário',
      duration: '1 ano',
      provider: 'AgroSync'
    },
    {
      name: '_ga',
      type: 'Analítico',
      purpose: 'Identificar usuários únicos',
      duration: '2 anos',
      provider: 'Google Analytics'
    },
    {
      name: '_fbp',
      type: 'Marketing',
      purpose: 'Rastrear conversões do Facebook',
      duration: '3 meses',
      provider: 'Facebook'
    },
    {
      name: 'cart_items',
      type: 'Essencial',
      purpose: 'Manter itens no carrinho',
      duration: 'Sessão',
      provider: 'AgroSync'
    },
    {
      name: 'language',
      type: 'Funcional',
      purpose: 'Lembrar idioma preferido',
      duration: '1 ano',
      provider: 'AgroSync'
    }
  ]

  const handleCookieToggle = (type: string) => {
    if (type === 'essential') return // Essenciais não podem ser desabilitados
    
    setCookiePreferences(prev => ({
      ...prev,
      [type]: !prev[type as keyof typeof prev]
    }))
  }

  const savePreferences = () => {
    // Simular salvamento das preferências
    localStorage.setItem('cookie-preferences', JSON.stringify(cookiePreferences))
    alert('Preferências de cookies salvas com sucesso!')
  }

  const clearAllCookies = () => {
    if (confirm('Tem certeza que deseja limpar todos os cookies? Isso pode afetar sua experiência na plataforma.')) {
      setCookiePreferences({
        essential: true,
        analytics: false,
        functional: false,
        marketing: false
      })
      localStorage.removeItem('cookie-preferences')
      alert('Todos os cookies não essenciais foram removidos!')
    }
  }

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'green': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'blue': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'purple': return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      case 'orange': return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  return (
    <>
      <Head>
        <title>{t('cookies_policy')} - {t('app_name')}</title>
        <meta name="description" content="Política de Cookies do AgroSync - Saiba como usamos cookies e como gerenciá-los" />
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
                  <CakeIcon className="h-12 w-12 text-purple-400" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {t('cookies_policy')}
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Saiba como usamos cookies e tecnologias similares para melhorar sua experiência 
                e como você pode controlar seu uso.
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
              <h2 className="text-2xl font-bold text-white mb-4">O que são Cookies?</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Cookies são pequenos arquivos de texto que são armazenados no seu dispositivo quando você visita 
                nosso site. Eles nos ajudam a fornecer uma experiência melhor e mais personalizada.
              </p>
              <p className="text-gray-400 leading-relaxed">
                Utilizamos cookies para lembrar suas preferências, analisar o tráfego do site, 
                personalizar conteúdo e fornecer funcionalidades avançadas. Você pode controlar 
                o uso de cookies através das configurações do seu navegador ou usando nosso painel de controle.
              </p>
            </div>
          </div>

          {/* Tipos de Cookies */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Tipos de Cookies que Utilizamos</h2>
            
            <div className="space-y-6">
              {cookieTypes.map((cookie, index) => (
                <div
                  key={index}
                  className="bg-gray-800/50 rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getColorClasses(cookie.color)}`}>
                        {cookie.type}
                      </span>
                      {cookie.required && (
                        <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full border border-red-500/30">
                          Obrigatório
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-400">Duração</div>
                      <div className="font-semibold text-white">{cookie.duration}</div>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 mb-4">{cookie.description}</p>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-gray-400 mb-2">Exemplos de uso:</h4>
                    <div className="flex flex-wrap gap-2">
                      {cookie.examples.map((example, exampleIndex) => (
                        <span
                          key={exampleIndex}
                          className="px-2 py-1 bg-gray-700/30 text-gray-300 text-xs rounded-full border border-gray-600"
                        >
                          {example}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gerenciador de Cookies */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Gerenciar Preferências de Cookies</h2>
            
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-purple-500/20">
              <p className="text-gray-300 mb-6 leading-relaxed">
                Use este painel para controlar quais tipos de cookies você permite que utilizemos. 
                As alterações serão aplicadas imediatamente.
              </p>
              
              <div className="space-y-4 mb-6">
                {cookieTypes.map((cookie, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        cookiePreferences[cookie.type.toLowerCase() as keyof typeof cookiePreferences]
                          ? 'bg-purple-500 border-purple-500'
                          : 'border-gray-400'
                      }`}></div>
                      <div>
                        <h4 className="font-semibold text-white">{cookie.type}</h4>
                        <p className="text-sm text-gray-400">{cookie.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      {cookie.required && (
                        <span className="text-xs text-gray-500">Obrigatório</span>
                      )}
                      <button
                        onClick={() => handleCookieToggle(cookie.type.toLowerCase())}
                        disabled={cookie.required}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-300 ${
                          cookie.required
                            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                            : cookiePreferences[cookie.type.toLowerCase() as keyof typeof cookiePreferences]
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}
                      >
                        {cookiePreferences[cookie.type.toLowerCase() as keyof typeof cookiePreferences] ? 'Ativado' : 'Desativado'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={savePreferences}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-purple-700 hover:to-cyan-700 transition-all duration-300 hover:scale-105"
                >
                  Salvar Preferências
                </button>
                <button
                  onClick={clearAllCookies}
                  className="bg-red-500/20 text-red-400 py-3 px-6 rounded-xl font-semibold border border-red-500/30 hover:bg-red-500/30 transition-all duration-300"
                >
                  Limpar Todos os Cookies
                </button>
              </div>
            </div>
          </div>

          {/* Detalhes dos Cookies */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Detalhes dos Cookies Utilizados</h2>
            
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-purple-500/20">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-4 text-white font-semibold">Nome</th>
                      <th className="text-left py-3 px-4 text-white font-semibold">Tipo</th>
                      <th className="text-left py-3 px-4 text-white font-semibold">Propósito</th>
                      <th className="text-left py-3 px-4 text-white font-semibold">Duração</th>
                      <th className="text-left py-3 px-4 text-white font-semibold">Provedor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cookieDetails.map((cookie, index) => (
                      <tr key={index} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors">
                        <td className="py-3 px-4 text-gray-300 font-mono text-sm">{cookie.name}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            cookie.type === 'Essencial' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                            cookie.type === 'Analítico' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                            cookie.type === 'Funcional' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                            'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                          }`}>
                            {cookie.type}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-300 text-sm">{cookie.purpose}</td>
                        <td className="py-3 px-4 text-gray-300 text-sm">{cookie.duration}</td>
                        <td className="py-3 px-4 text-gray-300 text-sm">{cookie.provider}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Como Gerenciar Cookies */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Como Gerenciar Cookies</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-800/50 rounded-2xl p-6 border border-purple-500/20">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <CogIcon className="h-6 w-6 text-blue-400 mr-2" />
                  Configurações do Navegador
                </h3>
                <p className="text-gray-300 mb-4 leading-relaxed">
                  A maioria dos navegadores permite controlar cookies através das configurações de privacidade.
                </p>
                <ul className="space-y-2 text-gray-400">
                  <li>• Chrome: Configurações {'>'} Privacidade e Segurança</li>
                  <li>• Firefox: Opções {'>'} Privacidade e Segurança</li>
                  <li>• Safari: Preferências {'>'} Privacidade</li>
                  <li>• Edge: Configurações {'>'} Cookies e Permissões</li>
                </ul>
              </div>
              
              <div className="bg-gray-800/50 rounded-2xl p-6 border border-purple-500/20">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <ShieldCheckIcon className="h-6 w-6 text-green-400 mr-2" />
                  Nossa Plataforma
                </h3>
                <p className="text-gray-300 mb-4 leading-relaxed">
                  Use nosso painel de controle para gerenciar preferências de cookies específicas.
                </p>
                <ul className="space-y-2 text-gray-400">
                  <li>• Controle granular por tipo de cookie</li>
                  <li>• Ativação/desativação em tempo real</li>
                  <li>• Salvamento automático de preferências</li>
                  <li>• Interface intuitiva e responsiva</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Impacto da Desativação */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">Impacto da Desativação de Cookies</h2>
            
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-purple-500/20">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <XCircleIcon className="h-6 w-6 text-red-400 mr-2" />
                    Cookies Essenciais (Nunca Desativar)
                  </h3>
                  <p className="text-gray-300 mb-4 leading-relaxed">
                    Estes cookies são necessários para o funcionamento básico do site.
                  </p>
                  <ul className="space-y-2 text-gray-400">
                    <li>• Login e autenticação</li>
                    <li>• Carrinho de compras</li>
                    <li>• Segurança e proteção</li>
                    <li>• Funcionalidades básicas</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <EyeIcon className="h-6 w-6 text-yellow-400 mr-2" />
                    Cookies Opcionais (Podem Ser Desativados)
                  </h3>
                  <p className="text-gray-300 mb-4 leading-relaxed">
                    Desativar estes cookies pode afetar sua experiência.
                  </p>
                  <ul className="space-y-2 text-gray-400">
                    <li>• Personalização reduzida</li>
                    <li>• Análises limitadas</li>
                    <li>• Funcionalidades avançadas</li>
                    <li>• Recomendações menos precisas</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Atualizações */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">Atualizações da Política</h2>
            
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-purple-500/20">
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Mudanças na Política</h3>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Esta política pode ser atualizada para refletir mudanças em nossas práticas 
                    ou por outros motivos operacionais, legais ou regulatórios.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Notificação de Mudanças</h3>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Notificaremos sobre mudanças significativas através de:
                  </p>
                  <ul className="space-y-2 text-gray-400">
                    <li>• Email para sua conta registrada</li>
                    <li>• Banner de notificação na plataforma</li>
                    <li>• Atualização da data de modificação</li>
                    <li>• Comunicado nas redes sociais</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                  <p className="text-sm text-blue-300">
                    <strong>Importante:</strong> O uso continuado de nossos serviços após modificações 
                    constitui aceitação da política atualizada.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contato */}
          <div className="text-center">
            <div className="bg-gray-800/50 rounded-2xl p-8 border border-purple-500/20">
              <h3 className="text-xl font-semibold text-white mb-4">Dúvidas sobre Cookies?</h3>
              <p className="text-gray-300 mb-6">
                Nossa equipe está disponível para esclarecer qualquer dúvida sobre nossa 
                política de cookies e como gerenciá-los.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-gray-700/30 rounded-xl">
                  <h4 className="font-semibold text-white mb-2">Email</h4>
                  <a href="mailto:cookies@agroisync.com" className="text-purple-400 hover:text-purple-300 transition-colors">
                    cookies@agroisync.com
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
                  <strong>Tempo de resposta:</strong> Respondemos a consultas sobre cookies em até 24 horas.
                </p>
              </div>
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

export default Cookies
