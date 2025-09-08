import React from 'react'

const ResetPassword = () => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-dark-primary via-dark-secondary to-dark-tertiary p-8'>
      <div className='mx-auto max-w-4xl'>
        <h1 className='mb-8 text-4xl font-bold text-white'>Redefinir Senha</h1>
        <p className='text-lg leading-relaxed text-gray-400'>
          Digite sua nova senha para redefinir o acesso à sua conta.
        </p>
      </div>
    </div>
  )
}

export default ResetPassword
