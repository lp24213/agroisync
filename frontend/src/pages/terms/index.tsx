import React from 'react'
import { NextPage } from 'next'
import Head from 'next/head'
import { useI18n } from '@/i18n/I18nProvider'
import { 
  DocumentTextIcon,
  UserIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  CogIcon
} from '@heroicons/react/24/outline'
import Footer from '@/components/layout/Footer'
import Chatbot from '@/components/Chatbot'

const Terms: NextPage = () => {
  const { t } = useI18n()

  const termsSections = [
    {
      title: 'Aceitação dos Termos',
      icon: <CheckCircleIcon className="h-6 w-6 text-green-400" />,
      content: [
        'Ao acessar e usar a plataforma AgroSync, você concorda com estes termos de serviço',
        'Seus dados de acesso são pessoais e intransferíveis',
        'Você deve ter pelo menos 18 anos para usar nossos serviços',
        'O uso da plataforma implica na aceitação de todas as políticas e regulamentos'
      ]
    },
    {
      title: 'Descrição dos Serviços',
      icon: <CogIcon className="h-6 w-6 text-blue-400" />,
      content: [
        'Marketplace para produtos agrícolas com tecnologia blockchain',
        'Sistema de staking e investimentos em criptomoedas',
        'Análise de dados agrícolas e previsões de mercado',
        'Plataforma de conexão entre produtores e investidores',
        'Serviços de pagamento e transferência segura'
      ]
    },
    {
      title: 'Responsabilidades do Usuário',
      icon: <UserIcon className="h-6 w-6 text-purple-400" />,
      content: [
        'Fornecer informações verdadeiras e atualizadas',
        'Manter a segurança de suas credenciais de acesso',
        'Não usar a plataforma para atividades ilegais',
        'Respeitar os direitos de outros usuários',
        'Cumprir todas as leis e regulamentos aplicáveis'
      ]
    },
    {
      title: 'Limitações de Responsabilidade',
      icon: <ExclamationTriangleIcon className="h-6 w-6 text-yellow-400" />,
      content: [
        'Não nos responsabilizamos por perdas financeiras decorrentes de investimentos',
        'A plataforma é fornecida "como está" sem garantias expressas',
        'Limitação de responsabilidade conforme permitido pela legislação',
        'Não garantimos disponibilidade contínua ou ininterrupta dos serviços'
      ]
    }
  ]

  const prohibitedActivities = [
    {
      title: 'Atividades Proibidas',
      description: 'Uso da plataforma para atividades ilegais ou fraudulentas',
      icon: <XCircleIcon className="h-5 w-5 text-red-400" />
    },
    {
      title: 'Manipulação de Mercado',
      description: 'Tentativas de manipular preços ou volumes de negociação',
      icon: <XCircleIcon className="h-5 w-5 text-red-400" />
    },
    {
      title: 'Spam e Marketing Não Autorizado',
      description: 'Envio de mensagens não solicitadas ou marketing agressivo',
      icon: <XCircleIcon className="h-5 w-5 text-red-400" />
    },
    {
      title: 'Violação de Propriedade Intelectual',
      description: 'Uso não autorizado de marcas, logos ou conteúdo protegido',
      icon: <XCircleIcon className="h-5 w-5 text-red-400" />
    },
    {
      title: 'Ataques à Plataforma',
      description: 'Tentativas de hackear, derrubar ou comprometer a segurança',
      icon: <XCircleIcon className="h-5 w-5 text-red-400" />
    },
    {
      title: 'Fraude e Estelionato',
      description: 'Criação de contas falsas ou uso de informações fraudulentas',
      icon: <XCircleIcon className="h-5 w-5 text-red-400" />
    }
  ]

  const userObligations = [
    {
      title: 'Verificação de Identidade',
      description: 'Completar processo de KYC quando solicitado',
      icon: <CheckCircleIcon className="h-5 w-5 text-green-400" />
    },
    {
      title: 'Conformidade Legal',
      description: 'Cumprir todas as leis e regulamentos aplicáveis',
      icon: <CheckCircleIcon className="h-5 w-5 text-green-400" />
    },
    {
      title: 'Pagamento de Taxas',
      description: 'Pagar todas as taxas e comissões devidas',
      icon: <CheckCircleIcon className="h-5 w-5 text-green-400" />
    },
    {
      title: 'Manutenção de Segurança',
      description: 'Manter senhas seguras e ativar 2FA',
      icon: <CheckCircleIcon className="h-5 w-5 text-green-400" />
    },
    {
      title: 'Reportar Problemas',
      description: 'Notificar sobre bugs ou vulnerabilidades encontradas',
      icon: <CheckCircleIcon className="h-5 w-5 text-green-400" />
    },
    {
      title: 'Respeito aos Outros',
      description: 'Tratar outros usuários com respeito e profissionalismo',
      icon: <CheckCircleIcon className="h-5 w-5 text-green-400" />
    }
  ]

  const fees = [
    {
      type: 'Taxa de Transação',
      description: 'Cobrada sobre cada transação realizada na plataforma',
      rate: '0.5%',
      details: 'Aplicada a compras, vendas e transferências'
    },
    {
      type: 'Taxa de Staking',
      description: 'Cobrada sobre recompensas de staking',
      rate: '10%',
      details: 'Dos ganhos gerados pelos pools de staking'
    },
    {
      type: 'Taxa de Withdrawal',
      description: 'Cobrada para saques de criptomoedas',
      rate: '0.1%',
      details: 'Mínimo de R$ 5,00 por saque'
    },
    {
      type: 'Taxa de Marketplace',
      description: 'Cobrada sobre vendas no marketplace',
      rate: '2%',
      details: 'Sobre o valor total da venda'
    }
  ]

  return (
    <>
      <Head>
        <title>{t('terms_of_service')} - {t('app_name')}</title>
        <meta name="description" content="Termos de Serviço do AgroSync - Condições de uso da plataforma" />
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
                  <DocumentTextIcon className="h-12 w-12 text-purple-400" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {t('terms_of_service')}
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Leia atentamente estes termos antes de usar nossos serviços. 
                Eles estabelecem as regras e responsabilidades para o uso da plataforma AgroSync.
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
              <h2 className="text-2xl font-bold text-white mb-4">Aceitação dos Termos</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Estes Termos de Serviço ("Termos") constituem um acordo legal entre você e a AgroSync 
                ("nós", "nosso" ou "a Empresa") que rege o uso de nossos serviços e plataforma.
              </p>
              <p className="text-gray-400 leading-relaxed">
                Ao acessar ou usar qualquer parte de nossos serviços, você concorda em cumprir estes Termos. 
                Se você não concordar com qualquer parte destes Termos, não deve usar nossos serviços.
              </p>
            </div>
          </div>

          {/* Seções dos Termos */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Principais Cláusulas</h2>
            
            <div className="space-y-6">
              {termsSections.map((section, index) => (
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

          {/* Atividades Proibidas */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Atividades Proibidas</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {prohibitedActivities.map((activity, index) => (
                <div
                  key={index}
                  className="bg-gray-800/50 rounded-2xl p-6 border border-red-500/20 hover:border-red-500/40 transition-all duration-300"
                >
                  <div className="flex items-start space-x-3">
                    {activity.icon}
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">{activity.title}</h3>
                      <p className="text-gray-400 text-sm">{activity.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Obrigações do Usuário */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Suas Obrigações</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userObligations.map((obligation, index) => (
                <div
                  key={index}
                  className="bg-gray-800/50 rounded-2xl p-6 border border-green-500/20 hover:border-green-500/40 transition-all duration-300"
                >
                  <div className="flex items-start space-x-3">
                    {obligation.icon}
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">{obligation.title}</h3>
                      <p className="text-gray-400 text-sm">{obligation.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Taxas e Comissões */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Taxas e Comissões</h2>
            
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-purple-500/20">
              <p className="text-gray-300 mb-6 leading-relaxed">
                Nossa plataforma cobra taxas para manter e melhorar os serviços oferecidos. 
                Todas as taxas são transparentes e comunicadas antecipadamente.
              </p>
              
              <div className="space-y-4">
                {fees.map((fee, index) => (
                  <div key={index} className="p-4 bg-gray-700/30 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-white">{fee.type}</h4>
                      <span className="text-lg font-bold text-purple-400 bg-purple-500/20 px-3 py-1 rounded-full">
                        {fee.rate}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm mb-2">{fee.description}</p>
                    <p className="text-gray-400 text-xs">{fee.details}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <p className="text-sm text-blue-300">
                  <strong>Importante:</strong> Todas as taxas são calculadas automaticamente e 
                  exibidas antes da confirmação de qualquer transação.
                </p>
              </div>
            </div>
          </div>

          {/* Propriedade Intelectual */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">Propriedade Intelectual</h2>
            
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-purple-500/20">
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Direitos da AgroSync</h3>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    A plataforma AgroSync, incluindo seu design, funcionalidades, algoritmos, 
                    código-fonte e conteúdo, é protegida por direitos autorais, marcas registradas 
                    e outras leis de propriedade intelectual.
                  </p>
                  <ul className="space-y-2 text-gray-400">
                    <li>• Logotipos, marcas e nomes comerciais</li>
                    <li>• Interface do usuário e experiência do usuário</li>
                    <li>• Algoritmos de análise e machine learning</li>
                    <li>• Base de dados e conteúdo proprietário</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Licença de Uso</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Concedemos a você uma licença limitada, não exclusiva, não transferível e revogável 
                    para usar nossos serviços, sujeita ao cumprimento destes Termos.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Rescisão */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">Rescisão do Contrato</h2>
            
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-purple-500/20">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <XCircleIcon className="h-6 w-6 text-red-400 mr-2" />
                    Rescisão pela AgroSync
                  </h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Violação dos Termos de Serviço</li>
                    <li>• Atividades fraudulentas ou ilegais</li>
                    <li>• Não pagamento de taxas devidas</li>
                    <li>• Comportamento abusivo ou prejudicial</li>
                    <li>• Decisão administrativa ou legal</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <UserIcon className="h-6 w-6 text-blue-400 mr-2" />
                    Rescisão pelo Usuário
                  </h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Cancelamento da conta a qualquer momento</li>
                    <li>• Solicitação de exclusão de dados</li>
                    <li>• Transferência de ativos pendentes</li>
                    <li>• Liquidação de posições abertas</li>
                    <li>• Resolução de disputas pendentes</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Disputas e Arbitragem */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">Disputas e Arbitragem</h2>
            
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-purple-500/20">
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Resolução de Disputas</h3>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Em caso de disputas relacionadas a estes Termos ou nossos serviços, 
                    comprometemo-nos a tentar resolver a questão de forma amigável.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Arbitragem</h3>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Qualquer disputa não resolvida será submetida à arbitragem vinculante 
                    conforme as regras da Câmara de Arbitragem de São Paulo.
                  </p>
                  <ul className="space-y-2 text-gray-400">
                    <li>• Local: São Paulo, Brasil</li>
                    <li>• Idioma: Português</li>
                    <li>• Lei aplicável: Lei brasileira</li>
                    <li>• Procedimento: Arbitragem expedita</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Modificações */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">Modificações dos Termos</h2>
            
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-purple-500/20">
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Direito de Modificação</h3>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Reservamo-nos o direito de modificar estes Termos a qualquer momento. 
                    As modificações entrarão em vigor imediatamente após sua publicação na plataforma.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Notificação de Mudanças</h3>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Notificaremos sobre mudanças significativas através de:
                  </p>
                  <ul className="space-y-2 text-gray-400">
                    <li>• Email para sua conta registrada</li>
                    <li>• Notificação na plataforma</li>
                    <li>• Atualização da data de modificação</li>
                    <li>• Banner de aviso na interface</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                  <p className="text-sm text-yellow-300">
                    <strong>Continuidade do Uso:</strong> O uso continuado de nossos serviços após 
                    modificações constitui aceitação dos novos Termos.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contato */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">Entre em Contato</h2>
            
            <div className="bg-gray-800/50 rounded-2xl p-8 border border-purple-500/20 text-center">
              <h3 className="text-xl font-semibold text-white mb-4">Dúvidas sobre os Termos?</h3>
              <p className="text-gray-300 mb-6">
                Nossa equipe jurídica está disponível para esclarecer qualquer dúvida sobre 
                estes Termos de Serviço e suas implicações.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-gray-700/30 rounded-xl">
                  <h4 className="font-semibold text-white mb-2">Email Legal</h4>
                  <a href="mailto:legal@agroisync.com" className="text-purple-400 hover:text-purple-300 transition-colors">
                    legal@agroisync.com
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
                  <strong>Tempo de resposta:</strong> Respondemos a consultas jurídicas em até 48 horas úteis.
                </p>
              </div>
            </div>
          </div>

          {/* Aceitação Final */}
          <div className="text-center">
            <div className="bg-gray-800/50 rounded-2xl p-8 border border-purple-500/20">
              <h3 className="text-2xl font-bold text-white mb-4">Aceitação dos Termos</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Ao usar nossos serviços, você confirma que leu, entendeu e concorda com estes Termos de Serviço 
                em sua totalidade, incluindo todas as políticas e regulamentos referenciados.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                  <div className="text-2xl font-bold text-green-400">✓</div>
                  <div className="text-sm text-green-300">Li e Entendi</div>
                </div>
                <div className="text-center p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                  <div className="text-2xl font-bold text-blue-400">✓</div>
                  <div className="text-sm text-blue-300">Concordo</div>
                </div>
                <div className="text-center p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                  <div className="text-2xl font-bold text-purple-400">✓</div>
                  <div className="text-sm text-purple-300">Aceito</div>
                </div>
              </div>
              
              <p className="text-gray-400 text-sm">
                <strong>Última atualização:</strong> {new Date().toLocaleDateString('pt-BR')} | 
                <strong>Versão:</strong> 2.1.0 | <strong>Vigência:</strong> Imediata
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

export default Terms
