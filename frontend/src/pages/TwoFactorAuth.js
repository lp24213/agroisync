import React from 'react'

const TwoFactorAuth = () => {
  return (
    <div className='min-h-screen bg-gray-50 p-8'>
      <div className='mx-auto max-w-4xl'>
        <h1 className='heading-1 mb-8 text-gray-900'>Autenticação de Dois Fatores</h1>
        <p className='subtitle text-gray-600'>
          Digite o código de verificação enviado para seu dispositivo.
        </p>
      </div>
    </div>
  )
}

export default TwoFactorAuth
