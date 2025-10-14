import React from 'react';

const Terms = () => {
  return (
    <div className='from-dark-primary via-dark-secondary to-dark-tertiary min-h-screen bg-gradient-to-br p-8'>
      <div className='mx-auto max-w-4xl'>
        <h1 className='mb-8 text-4xl font-bold text-white'>Termos de Uso</h1>
        <div className='space-y-6 text-gray-200'>
          <p className='text-lg leading-relaxed text-gray-300'>
            Estes Termos regem o uso da plataforma Agroisync por Produtores, Compradores, Transportadores e demais usuários.
          </p>

          <section>
            <h2 className='mb-2 text-2xl font-semibold text-white'>1. Aceitação</h2>
            <p className='text-gray-300'>
              Ao acessar ou utilizar a plataforma, você concorda com estes Termos e com a Política de Privacidade.
            </p>
          </section>

          <section>
            <h2 className='mb-2 text-2xl font-semibold text-white'>2. Cadastro e Conta</h2>
            <ul className='list-disc space-y-1 pl-6 text-gray-300'>
              <li>Você deve fornecer informações verdadeiras e mantê-las atualizadas.</li>
              <li>Você é responsável por manter a confidencialidade das credenciais.</li>
              <li>Podemos suspender contas em caso de uso indevido ou fraude.</li>
            </ul>
          </section>

          <section>
            <h2 className='mb-2 text-2xl font-semibold text-white'>3. Uso da Plataforma</h2>
            <ul className='list-disc space-y-1 pl-6 text-gray-300'>
              <li>É proibido publicar conteúdo ilegal, enganoso, ofensivo ou que viole direitos de terceiros.</li>
              <li>Negociações e contratos entre usuários são de responsabilidade das partes envolvidas.</li>
              <li>Podemos remover conteúdo ou restringir acesso em caso de violação.</li>
            </ul>
          </section>

          <section>
            <h2 className='mb-2 text-2xl font-semibold text-white'>4. Pagamentos e Taxas</h2>
            <p className='text-gray-300'>
              Quando aplicável, tarifas, comissões e meios de pagamento serão apresentados de forma clara antes da contratação. Reembolsos seguem as políticas aplicáveis do meio de pagamento e da legislação vigente.
            </p>
          </section>

          <section>
            <h2 className='mb-2 text-2xl font-semibold text-white'>5. Propriedade Intelectual</h2>
            <p className='text-gray-300'>
              Marcas, nomes, código-fonte e conteúdos da plataforma são protegidos por direitos de propriedade intelectual. É vedado copiar, modificar ou distribuir sem autorização.
            </p>
          </section>

          <section>
            <h2 className='mb-2 text-2xl font-semibold text-white'>6. Limitação de Responsabilidade</h2>
            <p className='text-gray-300'>
              A plataforma é fornecida “como está”. Na extensão permitida pela lei, não nos responsabilizamos por perdas indiretas, lucros cessantes ou danos decorrentes de uso indevido por terceiros.
            </p>
          </section>

          <section>
            <h2 className='mb-2 text-2xl font-semibold text-white'>7. LGPD e Privacidade</h2>
            <p className='text-gray-300'>
              Tratamos dados pessoais conforme a LGPD e nossa Política de Privacidade. Você pode exercer direitos como acesso, correção, exclusão e portabilidade conforme descrito na política.
            </p>
          </section>

          <section>
            <h2 className='mb-2 text-2xl font-semibold text-white'>8. Modificações</h2>
            <p className='text-gray-300'>
              Podemos atualizar estes Termos para refletir mudanças legais ou operacionais. Notificaremos alterações relevantes e manteremos a data de última atualização.
            </p>
          </section>

          <section>
            <h2 className='mb-2 text-2xl font-semibold text-white'>9. Contato</h2>
            <p className='text-gray-300'>
              DPO/Encarregado: contato@agroisync.com — Sinop, MT, Brasil.
            </p>
          </section>

          <p className='text-sm text-gray-400'>Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
        </div>
      </div>
    </div>
  );
};

export default Terms;
