import React from 'react'

const AgroSyncLogo = ({ className = 'w-12 h-12', variant = 'default' }) => {
  if (variant === 'text') {
    return (
      <div className={`flex items-center space-x-3 ${className}`}>
        <AgroSyncIcon className='h-8 w-8' />
        <span className='text-gradient text-2xl font-bold'>AgroSync</span>
      </div>
    )
  }

  if (variant === 'full') {
    return (
      <div className={`flex items-center space-x-4 ${className}`}>
        <AgroSyncIcon className='h-12 w-12' />
        <div className='flex flex-col'>
          <span className='text-gradient text-3xl font-bold'>AgroSync</span>
          <span className='-mt-1 text-sm text-gray-600 dark:text-gray-400'>Agronegócio Inteligente</span>
        </div>
      </div>
    )
  }

  return <AgroSyncIcon className={className} />
}

const AgroSyncIcon = ({ className }) => (
  <svg className={className} viewBox='0 0 64 64' fill='none' xmlns='http://www.w3.org/2000/svg'>
    {/* Círculo de fundo com gradiente */}
    <defs>
      <linearGradient id='logoGradient' x1='0%' y1='0%' x2='100%' y2='100%'>
        <stop offset='0%' stopColor='#3b82f6' />
        <stop offset='50%' stopColor='#8b5cf6' />
        <stop offset='100%' stopColor='#22c55e' />
      </linearGradient>
      <linearGradient id='logoGradientDark' x1='0%' y1='0%' x2='100%' y2='100%'>
        <stop offset='0%' stopColor='#00d4ff' />
        <stop offset='50%' stopColor='#8b5cf6' />
        <stop offset='100%' stopColor='#00ff88' />
      </linearGradient>
    </defs>

    {/* Círculo de fundo */}
    <circle cx='32' cy='32' r='30' fill='url(#logoGradient)' className='dark:hidden' />
    <circle cx='32' cy='32' r='30' fill='url(#logoGradientDark)' className='hidden dark:block' />

    {/* Ícone de planta/agricultura */}
    <g transform='translate(16, 12)'>
      {/* Caule */}
      <path d='M16 8 L16 32' stroke='white' strokeWidth='3' strokeLinecap='round' fill='none' />

      {/* Folhas */}
      <path d='M16 12 Q8 8 8 16 Q8 20 12 18 Q16 20 20 18 Q24 20 24 16 Q24 8 16 12' fill='white' opacity='0.9' />

      {/* Folha direita */}
      <path d='M16 16 Q24 12 24 20 Q24 24 20 22 Q16 24 12 22 Q8 24 8 20 Q8 12 16 16' fill='white' opacity='0.7' />

      {/* Folha esquerda */}
      <path d='M16 20 Q8 16 8 24 Q8 28 12 26 Q16 28 20 26 Q24 28 24 24 Q24 16 16 20' fill='white' opacity='0.5' />
    </g>

    {/* Elementos de conexão/tecnologia */}
    <g transform='translate(8, 8)'>
      {/* Pontos de conexão */}
      <circle cx='8' cy='8' r='2' fill='white' opacity='0.8' />
      <circle cx='48' cy='8' r='2' fill='white' opacity='0.8' />
      <circle cx='8' cy='48' r='2' fill='white' opacity='0.8' />
      <circle cx='48' cy='48' r='2' fill='white' opacity='0.8' />

      {/* Linhas de conexão */}
      <path d='M8 8 L48 8' stroke='white' strokeWidth='1' opacity='0.4' strokeDasharray='2,2' />
      <path d='M8 8 L8 48' stroke='white' strokeWidth='1' opacity='0.4' strokeDasharray='2,2' />
      <path d='M48 8 L48 48' stroke='white' strokeWidth='1' opacity='0.4' strokeDasharray='2,2' />
      <path d='M8 48 L48 48' stroke='white' strokeWidth='1' opacity='0.4' strokeDasharray='2,2' />
    </g>

    {/* Elemento central - símbolo de sincronização */}
    <g transform='translate(28, 28)'>
      <circle cx='0' cy='0' r='6' fill='none' stroke='white' strokeWidth='2' opacity='0.8' />
      <path
        d='M-4 -2 L-2 0 L-4 2 M4 -2 L2 0 L4 2'
        stroke='white'
        strokeWidth='2'
        strokeLinecap='round'
        fill='none'
        opacity='0.8'
      />
    </g>
  </svg>
)

export default AgroSyncLogo
