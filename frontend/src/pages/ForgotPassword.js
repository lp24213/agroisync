import React from 'react'

const ForgotPassword = () => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-dark-primary via-dark-secondary to-dark-tertiary p-8'>
      <div className='mx-auto max-w-4xl'>
        <h1 className='mb-8 text-4xl font-bold text-white'>Esqueci minha senha</h1>
        <p className='text-lg leading-relaxed text-gray-400'>
          Digite seu e-mail para receber instruções de redefinição de senha.
        </p>
      </div>
    </div>
  )
}

export default ForgotPassword
