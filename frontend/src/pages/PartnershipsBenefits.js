import React from 'react';

const PartnershipsBenefits = () => {
  return (
    <div className='mx-auto max-w-5xl p-4'>
      <h1 className='mb-2 text-3xl font-bold text-gray-900'>Benefícios das Parcerias</h1>
      <p className='mb-8 text-gray-600'>Parcerias verdadeiras e transparentes para construir resultados sustentáveis.</p>

      <section aria-labelledby='benefits-cards'>
        <h2 id='benefits-cards' className='sr-only'>Principais benefícios</h2>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
          <div className='rounded-2xl border border-gray-200 bg-white p-6 shadow-sm'>
            <h3 className='mb-2 text-xl font-semibold text-gray-900'>Exposição no Marketplace</h3>
            <p className='text-gray-700'>
              Destque com páginas de vitrine e ranqueamento transparente. Sem promessas irreais: sua
              visibilidade cresce conforme a qualidade dos anúncios e reputação.
            </p>
          </div>

          <div className='rounded-2xl border border-gray-200 bg-white p-6 shadow-sm'>
            <h3 className='mb-2 text-xl font-semibold text-gray-900'>Integrações Técnicas</h3>
            <p className='text-gray-700'>
              Integrações por API e webhooks (roadmap progressivo). Começamos pelo essencial e evoluímos conforme a
              necessidade do parceiro.
            </p>
          </div>

          <div className='rounded-2xl border border-gray-200 bg-white p-6 shadow-sm'>
            <h3 className='mb-2 text-xl font-semibold text-gray-900'>Co‑marketing e Campanhas</h3>
            <p className='text-gray-700'>
              Ações conjuntas e conteúdo técnico para educação do mercado. Materiais revisados para evitar informações
              exageradas ou incorretas.
            </p>
          </div>

          <div className='rounded-2xl border border-gray-200 bg-white p-6 shadow-sm'>
            <h3 className='mb-2 text-xl font-semibold text-gray-900'>Suporte Prioritário</h3>
            <p className='text-gray-700'>
              Canal dedicado para dúvidas técnicas e melhorias. SLA comunicado de forma clara e realista.
            </p>
          </div>
        </div>
      </section>

      <section className='mt-10' aria-labelledby='how-to-partner'>
        <h2 id='how-to-partner' className='mb-3 text-2xl font-bold text-gray-900'>Como firmar parceria</h2>
        <ol className='list-decimal space-y-2 pl-6 text-gray-700'>
          <li>Envie sua proposta resumida e objetivo da parceria.</li>
          <li>Reunião de alinhamento para entender necessidades e escopo.</li>
          <li>Piloto de validação (MVP) com metas simples e métricas claras.</li>
          <li>Avaliação conjunta e, se aprovado, expansão do escopo.</li>
        </ol>

        <div className='mt-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-yellow-900' role='note'>
          <p className='font-semibold'>Transparência</p>
          <p className='text-sm'>Ainda não temos parceiros públicos listados. Quando houver, serão exibidos aqui com autorização.</p>
        </div>
      </section>

      <section className='mt-10' aria-labelledby='contact-partnerships'>
        <h2 id='contact-partnerships' className='mb-3 text-2xl font-bold text-gray-900'>Contato</h2>
        <p className='text-gray-700'>Envie um e‑mail para <span className='font-medium'>parcerias@agroisync.com</span> com o assunto “Parceria”.</p>
      </section>
    </div>
  );
};

export default PartnershipsBenefits;
