import React from 'react';

const MarketplaceSell = () => {
  return (
    <div className='mx-auto max-w-5xl p-4'>
      <h1 className='mb-2 text-3xl font-bold text-gray-900'>Como Vender</h1>
      <p className='mb-8 text-gray-600'>Guia rápido e transparente para publicar seus produtos sem promessas exageradas.</p>

      <section aria-labelledby='sell-steps'>
        <h2 id='sell-steps' className='sr-only'>Passos para vender</h2>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
          <div className='rounded-2xl border border-gray-200 bg-white p-6 shadow-sm'>
            <h3 className='mb-1 text-xl font-semibold text-gray-900'>1) Crie sua conta e verifique o e‑mail</h3>
            <p className='text-gray-700'>
              Segurança primeiro: verificação de e‑mail e validações básicas de CPF/CNPJ.
            </p>
          </div>

          <div className='rounded-2xl border border-gray-200 bg-white p-6 shadow-sm'>
            <h3 className='mb-1 text-xl font-semibold text-gray-900'>2) Cadastre sua loja e produtos</h3>
            <p className='text-gray-700'>
              Inclua fotos, estoque, origem e qualidade. A IA sugere categorias, palavras‑chave e descrição inicial.
            </p>
          </div>

          <div className='rounded-2xl border border-gray-200 bg-white p-6 shadow-sm'>
            <h3 className='mb-1 text-xl font-semibold text-gray-900'>3) Publique com transparência</h3>
            <p className='text-gray-700'>
              Nada de informações falsas. Anúncios passam por verificações básicas antes de aparecer publicamente.
            </p>
          </div>

          <div className='rounded-2xl border border-gray-200 bg-white p-6 shadow-sm'>
            <h3 className='mb-1 text-xl font-semibold text-gray-900'>4) Receba contatos e negocie</h3>
            <p className='text-gray-700'>
              Negociação direta com interessados. Em breve: opções de pagamento e logística integradas.
            </p>
          </div>
        </div>
      </section>

      <section className='mt-10' aria-labelledby='tips-ai'>
        <h2 id='tips-ai' className='mb-3 text-2xl font-bold text-gray-900'>Dicas da IA</h2>
        <ul className='grid grid-cols-1 gap-4 md:grid-cols-2' aria-label='Dicas assistidas por IA'>
          <li className='rounded-lg bg-emerald-50 p-4 text-emerald-900'>
            Sugestão de preço com base na categoria e sazonalidade (em evolução).
          </li>
          <li className='rounded-lg bg-emerald-50 p-4 text-emerald-900'>
            Recomendação de título e descrição mais claros para aumentar relevância.
          </li>
          <li className='rounded-lg bg-emerald-50 p-4 text-emerald-900'>
            Palavras‑chave para melhorar busca interna e ranqueamento.
          </li>
          <li className='rounded-lg bg-emerald-50 p-4 text-emerald-900'>
            Alerta de informações incompletas antes da publicação.
          </li>
        </ul>
      </section>

      <section className='mt-10' aria-labelledby='faq-sell'>
        <h2 id='faq-sell' className='mb-3 text-2xl font-bold text-gray-900'>Perguntas frequentes</h2>
        <div className='space-y-4'>
          <details className='rounded-lg border border-gray-200 bg-white p-4'>
            <summary className='cursor-pointer font-medium text-gray-900'>Quais informações são obrigatórias?</summary>
            <p className='mt-2 text-gray-700'>Nome, categoria, descrição, preço e quantidade/estoque.</p>
          </details>
          <details className='rounded-lg border border-gray-200 bg-white p-4'>
            <summary className='cursor-pointer font-medium text-gray-900'>Quando meu anúncio aparece?</summary>
            <p className='mt-2 text-gray-700'>Após validações básicas e checagens automáticas, o anúncio é publicado.</p>
          </details>
          <details className='rounded-lg border border-gray-200 bg-white p-4'>
            <summary className='cursor-pointer font-medium text-gray-900'>Posso editar depois?</summary>
            <p className='mt-2 text-gray-700'>Sim. Você pode editar e republicar a qualquer momento.</p>
          </details>
        </div>
      </section>
    </div>
  );
};

export default MarketplaceSell;
