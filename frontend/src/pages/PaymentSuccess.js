import React from 'react'

const PaymentSuccess = () => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-dark-primary via-dark-secondary to-dark-tertiary p-8'>
      <div className='mx-auto max-w-4xl'>
        <h1 className='mb-8 text-4xl font-bold text-white'>Pagamento Realizado</h1>
        <p className='text-lg leading-relaxed text-gray-400'>Seu pagamento foi processado com sucesso!</p>
      </div>
    </div>
  )
}

export default PaymentSuccess
