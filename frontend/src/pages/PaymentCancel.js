import React from 'react'

const PaymentCancel = () => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-dark-primary via-dark-secondary to-dark-tertiary p-8'>
      <div className='mx-auto max-w-4xl'>
        <h1 className='mb-8 text-4xl font-bold text-white'>Pagamento Cancelado</h1>
        <p className='text-lg leading-relaxed text-gray-400'>
          Seu pagamento foi cancelado. Você pode tentar novamente a qualquer momento.
        </p>
      </div>
    </div>
  )
}

export default PaymentCancel
