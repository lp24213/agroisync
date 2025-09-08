import React from 'react'

const Unauthorized = () => {
  return (
    <div className='min-h-screen bg-gray-50 p-8'>
      <div className='mx-auto max-w-4xl'>
        <h1 className='heading-1 mb-8 text-gray-900'>Acesso Negado</h1>
        <p className='subtitle text-gray-600'>Você não tem permissão para acessar esta página.</p>
      </div>
    </div>
  )
}

export default Unauthorized
