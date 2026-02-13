import React from 'react';

const Privacy = () => {
  return (
    <div className='from-dark-primary via-dark-secondary to-dark-tertiary min-h-screen bg-gradient-to-br p-8'>
      <div className='mx-auto max-w-4xl'>
        <h1 className='mb-8 text-4xl font-bold text-white'>Política de Privacidade (LGPD)</h1>
        <div className='space-y-6 text-gray-200'>
          <p className='text-lg leading-relaxed text-gray-300'>
            Esta Política descreve como a Agroisync coleta, usa, compartilha e protege dados pessoais, em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).
          </p>

          <section>
            <h2 className='mb-2 text-2xl font-semibold text-white'>1. Controlador e Contato</h2>
            <p className='text-gray-300'>
              Controlador: Agroisync. DPO/Encarregado: contato@agroisync.com.
            </p>
          </section>

          <section>
            <h2 className='mb-2 text-2xl font-semibold text-white'>2. Dados Coletados</h2>
            <ul className='list-disc space-y-1 pl-6 text-gray-300'>
              <li>Dados de cadastro (nome, e-mail, telefone, empresa, CPF/CNPJ).</li>
              <li>Dados de uso (páginas acessadas, cliques, IP, dispositivo, cookies).</li>
              <li>Dados de transações (quando aplicável), conforme exigências legais.</li>
            </ul>
          </section>

          <section>
            <h2 className='mb-2 text-2xl font-semibold text-white'>3. Finalidades</h2>
            <ul className='list-disc space-y-1 pl-6 text-gray-300'>
              <li>Prestação dos serviços da plataforma e atendimento.</li>
              <li>Segurança, prevenção a fraudes e cumprimento de obrigações legais.</li>
              <li>Comunicações transacionais e marketing com consentimento.</li>
            </ul>
          </section>

          <section>
            <h2 className='mb-2 text-2xl font-semibold text-white'>4. Bases Legais</h2>
            <p className='text-gray-300'>
              Execução de contrato, cumprimento legal, legítimo interesse e consentimento (quando exigido).
            </p>
          </section>

          <section>
            <h2 className='mb-2 text-2xl font-semibold text-white'>5. Compartilhamento</h2>
            <p className='text-gray-300'>
              Fornecedores e parceiros operacionais (ex.: processamento de pagamentos, e-mail, análise), sempre com proteção contratual adequada.
            </p>
          </section>

          <section>
            <h2 className='mb-2 text-2xl font-semibold text-white'>6. Cookies e Tecnologias</h2>
            <p className='text-gray-300'>
              Utilizamos cookies necessários ao funcionamento e, mediante consentimento, cookies de análise e marketing. Você pode gerenciar preferências no banner de consentimento.
            </p>
          </section>

          <section>
            <h2 className='mb-2 text-2xl font-semibold text-white'>7. Direitos do Titular</h2>
            <ul className='list-disc space-y-1 pl-6 text-gray-300'>
              <li>Acesso, correção, exclusão, portabilidade e informação sobre compartilhamento.</li>
              <li>Revogação de consentimento a qualquer momento.</li>
              <li>Revisão de decisões automatizadas quando aplicável.</li>
            </ul>
          </section>

          <section>
            <h2 className='mb-2 text-2xl font-semibold text-white'>8. Segurança</h2>
            <p className='text-gray-300'>
              Medidas técnicas e organizacionais para proteger dados, incluindo criptografia em trânsito, controles de acesso e logs.
            </p>
          </section>

          <section>
            <h2 className='mb-2 text-2xl font-semibold text-white'>9. Retenção</h2>
            <p className='text-gray-300'>
              Mantemos dados pelo tempo necessário às finalidades declaradas e obrigações legais.
            </p>
          </section>

          <section>
            <h2 className='mb-2 text-2xl font-semibold text-white'>10. Transferências Internacionais</h2>
            <p className='text-gray-300'>
              Quando ocorrerem, serão adotadas salvaguardas adequadas conforme a LGPD.
            </p>
          </section>

          <p className='text-sm text-gray-400'>Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
