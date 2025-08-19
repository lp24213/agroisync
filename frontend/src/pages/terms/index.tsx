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
                <h2 className="text-3xl font-bold text-cosmic-glow mb-6 flex items-center">
                  <DocumentTextIcon className="h-8 w-8 mr-3 text-blue-400" />
                  {t('terms_account_title')}
                </h2>
                <div className="text-purple-silver space-y-4">
                  <p className="text-lg leading-relaxed">
                    {t('terms_account_intro')}
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Fornecer informações pessoais completas e precisas</li>
                    <li>Manter a confidencialidade das credenciais de acesso</li>
                    <li>Notificar imediatamente sobre uso não autorizado</li>
                    <li>Não compartilhar conta com terceiros</li>
                    <li>Responder por todas as atividades realizadas na conta</li>
                  </ul>
                </div>
              </div>

              {/* Seção 5: Uso Aceitável */}
              <div className="cosmic-card p-8">
                <h2 className="text-3xl font-bold text-cosmic-glow mb-6 flex items-center">
                  <HandRaisedIcon className="h-8 w-8 mr-3 text-green-400" />
                  {t('terms_acceptable_use_title')}
                </h2>
                <div className="text-purple-silver space-y-4">
                  <p className="text-lg leading-relaxed">
                    {t('terms_acceptable_use_intro')}
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Usar a plataforma apenas para fins legais e legítimos</li>
                    <li>Respeitar os direitos de propriedade intelectual</li>
                    <li>Não tentar acessar sistemas ou dados não autorizados</li>
                    <li>Não interferir no funcionamento da plataforma</li>
                    <li>Não usar para atividades fraudulentas ou enganosas</li>
                  </ul>
                </div>
              </div>

              {/* Seção 6: Propriedade Intelectual */}
              <div className="cosmic-card p-8">
                <h2 className="text-3xl font-bold text-cosmic-glow mb-6 flex items-center">
                  <DocumentTextIcon className="h-8 w-8 mr-3 text-purple-400" />
                  {t('terms_intellectual_property_title')}
                </h2>
                <div className="text-purple-silver space-y-4">
                  <p className="text-lg leading-relaxed">
                    {t('terms_intellectual_property_intro')}
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Software, design e funcionalidades da plataforma</li>
                    <li>Marcas registradas e logotipos</li>
                    <li>Conteúdo e materiais educativos</li>
                    <li>Base de dados e algoritmos proprietários</li>
                    <li>Documentação técnica e manuais</li>
                  </ul>
                </div>
              </div>

              {/* Seção 7: Privacidade e Dados */}
              <div className="cosmic-card p-8">
                <h2 className="text-3xl font-bold text-cosmic-glow mb-6 flex items-center">
                  <DocumentTextIcon className="h-8 w-8 mr-3 text-cyan-400" />
                  {t('terms_privacy_title')}
                </h2>
                <div className="text-purple-silver space-y-4">
                  <p className="text-lg leading-relaxed">
                    {t('terms_privacy_intro')}
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Coleta e processamento de dados pessoais</li>
                    <li>Uso de cookies e tecnologias similares</li>
                    <li>Compartilhamento com parceiros autorizados</li>
                    <li>Armazenamento seguro e medidas de proteção</li>
                    <li>Direitos de acesso, correção e exclusão</li>
                  </ul>
                </div>
              </div>

              {/* Seção 8: Limitação de Responsabilidade */}
              <div className="cosmic-card p-8">
                <h2 className="text-3xl font-bold text-cosmic-glow mb-6 flex items-center">
                  <ExclamationTriangleIcon className="h-8 w-8 mr-3 text-yellow-400" />
                  {t('terms_liability_title')}
                </h2>
                <div className="text-purple-silver space-y-4">
                  <p className="text-lg leading-relaxed">
                    {t('terms_liability_intro')}
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Interrupções temporárias do serviço</li>
                    <li>Perda de dados devido a falhas técnicas</li>
                    <li>Decisões de investimento baseadas na plataforma</li>
                    <li>Uso inadequado das ferramentas disponíveis</li>
                    <li>Eventos de força maior ou circunstâncias excepcionais</li>
                  </ul>
                </div>
              </div>

              {/* Seção 9: Rescisão */}
              <div className="cosmic-card p-8">
                <h2 className="text-3xl font-bold text-cosmic-glow mb-6 flex items-center">
                  <DocumentTextIcon className="h-8 w-8 mr-3 text-red-400" />
                  {t('terms_termination_title')}
                </h2>
                <div className="text-purple-silver space-y-4">
                  <p className="text-lg leading-relaxed">
                    {t('terms_termination_intro')}
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Violação dos termos de uso</li>
                    <li>Atividade fraudulenta ou ilegal</li>
                    <li>Uso inadequado da plataforma</li>
                    <li>Inatividade prolongada da conta</li>
                    <li>Solicitação do usuário</li>
                  </ul>
                </div>
              </div>

              {/* Seção 10: Modificações */}
              <div className="cosmic-card p-8">
                <h2 className="text-3xl font-bold text-cosmic-glow mb-6 flex items-center">
                  <DocumentTextIcon className="h-8 w-8 mr-3 text-blue-400" />
                  {t('terms_modifications_title')}
                </h2>
                <div className="text-purple-silver space-y-4">
                  <p className="text-lg leading-relaxed">
                    {t('terms_modifications_intro')}
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Notificação prévia de mudanças significativas</li>
                    <li>Direito de aceitar ou rejeitar modificações</li>
                    <li>Continuidade do serviço durante transições</li>
                    <li>Preservação de direitos adquiridos</li>
                    <li>Transparência nas alterações realizadas</li>
                  </ul>
                </div>
              </div>

              {/* Seção 11: Lei Aplicável */}
              <div className="cosmic-card p-8">
                <h2 className="text-3xl font-bold text-cosmic-glow mb-6 flex items-center">
                  <ScaleIcon className="h-8 w-8 mr-3 text-green-400" />
                  {t('terms_governing_law_title')}
                </h2>
                <div className="text-purple-silver space-y-4">
                  <p className="text-lg leading-relaxed">
                    {t('terms_governing_law_intro')}
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Legislação brasileira aplicável</li>
                    <li>Jurisdição dos tribunais brasileiros</li>
                    <li>Resolução de disputas por arbitragem</li>
                    <li>Medidas cautelares e provisórias</li>
                    <li>Execução de sentenças e acordos</li>
                  </ul>
                </div>
              </div>

              {/* Seção 12: Contato */}
              <div className="cosmic-card p-8">
                <h2 className="text-3xl font-bold text-cosmic-glow mb-6 flex items-center">
                  <DocumentTextIcon className="h-8 w-8 mr-3 text-cyan-400" />
                  {t('terms_contact_title')}
                </h2>
                <div className="text-purple-silver space-y-4">
                  <p className="text-lg leading-relaxed">
                    {t('terms_contact_intro')}
                  </p>
                  <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 p-6 rounded-lg border border-blue-500/20">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-blue-400 mb-2">Email</h4>
                        <p className="text-purple-silver">legal@agroisync.com</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-purple-400 mb-2">Telefone</h4>
                        <p className="text-purple-silver">+55 (66) 99999-9999</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-cyan-400 mb-2">Endereço</h4>
                        <p className="text-purple-silver">Sinop, Mato Grosso, Brasil</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-green-400 mb-2">Horário</h4>
                        <p className="text-purple-silver">Segunda a Sexta, 8h às 18h</p>
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
