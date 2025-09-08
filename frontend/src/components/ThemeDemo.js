import React from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../contexts/ThemeContext'

const ThemeDemo = () => {
  const { theme } = useTheme()

  const demoCards = [
    {
      title: 'Card Primário',
      description: 'Este é um exemplo de card usando as variáveis de tema',
      type: 'primary'
    },
    {
      title: 'Card Secundário',
      description: 'Card com estilo secundário e efeitos de hover',
      type: 'secondary'
    },
    {
      title: 'Card com Glassmorphism',
      description: 'Efeito de vidro translúcido com backdrop-blur',
      type: 'glass'
    }
  ]

  const demoButtons = [
    { text: 'Botão Primário', variant: 'primary' },
    { text: 'Botão Secundário', variant: 'secondary' },
    { text: 'Botão Outline', variant: 'outline' }
  ]

  return (
    <div className='px-4 py-20 sm:px-6 lg:px-8'>
      <div className='mx-auto max-w-7xl'>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className='mb-16 text-center'
        >
          <h2 className='text-text-primary mb-6 text-4xl font-bold md:text-5xl'>Demonstração do Sistema de Temas</h2>
          <p className='text-text-secondary mx-auto max-w-3xl text-xl'>
            Veja como o AgroConecta se adapta automaticamente entre os temas claro e escuro, mantendo sempre a elegância
            e profissionalismo.
          </p>
          <div className='bg-bg-card border-border-primary mt-6 inline-block rounded-2xl border p-4'>
            <span className='text-text-primary font-semibold'>
              Tema Atual: <span className='text-accent-primary'>{theme === 'dark' ? 'Escuro' : 'Claro'}</span>
            </span>
          </div>
        </motion.div>

        {/* Cards de Demonstração */}
        <div className='mb-16 grid grid-cols-1 gap-8 md:grid-cols-3'>
          {demoCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className='group'
            >
              <div className={`card ${card.type === 'glass' ? 'glass-effect' : ''}`}>
                <h3 className='text-text-primary mb-3 text-xl font-semibold'>{card.title}</h3>
                <p className='text-text-secondary mb-4 leading-relaxed'>{card.description}</p>
                <div className='flex space-x-2'>
                  {demoButtons.slice(0, 2).map((btn, btnIndex) => (
                    <button key={btn.text} className={`btn btn-${btn.variant} px-4 py-2 text-sm`}>
                      {btn.text}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Botões de Demonstração */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className='mb-16 text-center'
        >
          <h3 className='text-text-primary mb-8 text-2xl font-semibold'>Botões e Componentes</h3>
          <div className='flex flex-wrap justify-center gap-4'>
            {demoButtons.map((btn, index) => (
              <motion.button
                key={btn.text}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`btn btn-${btn.variant}`}
              >
                {btn.text}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Seção de Cores */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className='mb-16 text-center'
        >
          <h3 className='text-text-primary mb-8 text-2xl font-semibold'>Paleta de Cores do Tema</h3>
          <div className='mx-auto grid max-w-4xl grid-cols-2 gap-4 md:grid-cols-4'>
            <div className='bg-accent-primary rounded-xl p-4 font-semibold text-white'>Primário</div>
            <div className='bg-accent-secondary rounded-xl p-4 font-semibold text-white'>Secundário</div>
            <div className='bg-accent-success rounded-xl p-4 font-semibold text-white'>Sucesso</div>
            <div className='bg-accent-warning rounded-xl p-4 font-semibold text-white'>Aviso</div>
          </div>
        </motion.div>

        {/* Seção de Tipografia */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className='text-center'
        >
          <h3 className='text-text-primary mb-8 text-2xl font-semibold'>Tipografia e Fontes</h3>
          <div className='mx-auto max-w-4xl space-y-4'>
            <h1 className='text-text-primary'>Título H1 - Orbitron</h1>
            <h2 className='text-text-primary'>Título H2 - Orbitron</h2>
            <h3 className='text-text-primary'>Título H3 - Orbitron</h3>
            <p className='text-text-secondary text-lg'>
              Texto de parágrafo usando Inter - Esta é uma fonte moderna e legível que funciona perfeitamente para
              conteúdo de leitura.
            </p>
            <p className='text-text-tertiary'>Texto secundário menor para informações complementares e detalhes.</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ThemeDemo
