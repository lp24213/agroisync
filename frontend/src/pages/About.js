import React from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Users, Target, Award, TrendingUp, Shield, Zap, Globe, ArrowRight } from 'lucide-react'

const About = () => {
  const values = [
    {
      icon: Shield,
      title: 'Segurança Máxima',
      description: 'Proteção de dados com criptografia de nível bancário e conformidade total com LGPD'
    },
    {
      icon: Zap,
      title: 'Performance Extrema',
      description: 'Tecnologia de ponta para transações instantâneas e processamento em tempo real'
    },
    {
      icon: Globe,
      title: 'Conectividade Global',
      description: 'Rede mundial conectando produtores, compradores e transportadores do agronegócio'
    },
    {
      icon: TrendingUp,
      title: 'Inovação Constante',
      description: 'Sempre na vanguarda da tecnologia, desenvolvendo soluções para o futuro do agronegócio'
    }
  ]

  const team = [
    {
      name: 'Luis Paulo Oliveira',
      role: 'CEO & Fundador',
      description: 'Especialista em tecnologia e agronegócio com mais de 10 anos de experiência'
    },
    {
      name: 'Equipe de Desenvolvimento',
      role: 'Engenheiros de Software',
      description: 'Profissionais especializados em tecnologias de ponta e desenvolvimento ágil'
    },
    {
      name: 'Consultores Agrícolas',
      role: 'Especialistas do Campo',
      description: 'Profissionais com vasta experiência no agronegócio brasileiro e internacional'
    }
  ]

  const achievements = [
    { number: '10K+', label: 'Usuários Ativos' },
    { number: 'R$ 50M+', label: 'Volume Transacionado' },
    { number: '99.9%', label: 'Uptime Garantido' },
    { number: '24/7', label: 'Suporte Premium' },
    { number: '15+', label: 'Países Conectados' },
    { number: '100+', label: 'Parceiros Estratégicos' }
  ]

  return (
    <div className='bg-white min-h-screen'>
      {/* Hero Section */}
      <section className='bg-gray-50 py-24'>
        <div className='container-futuristic'>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className='text-center text-gray-900'
          >
            <h1 className='heading-1 mb-8'>
              Sobre o <span className='text-gray-700'>AgroSync</span>
            </h1>
            <p className='subtitle mx-auto mb-8 max-w-3xl text-gray-600'>
              A plataforma mais avançada do mundo para conectar produtores, compradores e transportadores do
              agronegócio. Tecnologia de ponta, segurança máxima e performance extrema.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className='bg-white py-20'>
        <div className='container-futuristic'>
          <div className='grid grid-cols-1 gap-12 lg:grid-cols-2'>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className='card-futuristic p-8'
            >
              <div className='bg-gray-100 mb-6 flex h-16 w-16 items-center justify-center rounded-xl'>
                <Target size={32} className='text-gray-700' />
              </div>
              <h2 className='heading-3 mb-4 text-gray-900'>Nossa Missão</h2>
              <p className='text-secondary leading-relaxed'>
                Revolucionar o agronegócio através da tecnologia, conectando todos os elos da cadeia produtiva em uma
                plataforma única, segura e eficiente. Democratizar o acesso às melhores oportunidades do mercado
                agrícola.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className='card-futuristic p-8'
            >
              <div className='bg-gray-100 mb-6 flex h-16 w-16 items-center justify-center rounded-xl'>
                <Award size={32} className='text-white' />
              </div>
              <h2 className='text-primary mb-4 text-3xl font-bold'>Nossa Visão</h2>
              <p className='text-secondary leading-relaxed'>
                Ser a plataforma global de referência no agronegócio, reconhecida pela inovação, confiabilidade e
                impacto positivo na vida dos produtores rurais e toda a cadeia agrícola mundial.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className='bg-gray-50 py-20'>
        <div className='container-futuristic'>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className='mb-16 text-center'
          >
            <h2 className='mb-6 text-4xl font-bold text-white md:text-5xl'>
              Nossos <span className='text-yellow-300'>Valores</span>
            </h2>
            <p className='mx-auto max-w-3xl text-xl text-white/80'>
              Os princípios que guiam nossa missão de transformar o agronegócio
            </p>
          </motion.div>

          <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4'>
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className='glass-card p-6 text-center transition-transform hover:scale-105'
              >
                <div className='bg-primary-gradient mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl'>
                  <value.icon size={32} className='text-white' />
                </div>
                <h3 className='mb-3 text-xl font-bold text-white'>{value.title}</h3>
                <p className='text-white/80'>{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className='bg-white py-20'>
        <div className='container-futuristic'>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className='mb-16 text-center'
          >
            <h2 className='text-primary mb-6 text-4xl font-bold md:text-5xl'>
              Nossa <span className='text-gradient'>Equipe</span>
            </h2>
            <p className='text-secondary mx-auto max-w-3xl text-xl'>
              Profissionais apaixonados por tecnologia e agronegócio
            </p>
          </motion.div>

          <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className='glass-card p-8 text-center'
              >
                <div className='bg-primary-gradient mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full'>
                  <Users size={40} className='text-white' />
                </div>
                <h3 className='text-primary mb-2 text-2xl font-bold'>{member.name}</h3>
                <p className='text-secondary mb-4 font-semibold'>{member.role}</p>
                <p className='text-secondary'>{member.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className='bg-primary-gradient py-20'>
        <div className='container-futuristic'>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className='mb-16 text-center'
          >
            <h2 className='mb-6 text-4xl font-bold text-white md:text-5xl'>
              Nossos <span className='text-yellow-300'>Números</span>
            </h2>
            <p className='mx-auto max-w-3xl text-xl text-white/90'>
              Resultados que comprovam nossa excelência e impacto no agronegócio
            </p>
          </motion.div>

          <div className='grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6'>
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className='text-center'
              >
                <div className='mb-2 text-4xl font-bold text-white md:text-5xl'>{achievement.number}</div>
                <div className='font-medium text-white/80'>{achievement.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className='bg-white py-20'>
        <div className='container-futuristic'>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className='mb-16 text-center'
          >
            <h2 className='text-primary mb-6 text-4xl font-bold md:text-5xl'>
              Entre em <span className='text-gradient'>Contato</span>
            </h2>
            <p className='text-secondary mx-auto max-w-3xl text-xl'>
              Estamos sempre disponíveis para ajudar e ouvir suas sugestões
            </p>
          </motion.div>

          <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
              className='glass-card p-8 text-center'
            >
              <div className='bg-primary-gradient mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-xl'>
                <Mail size={32} className='text-white' />
              </div>
              <h3 className='text-primary mb-4 text-xl font-bold'>Email</h3>
              <a href='mailto:contato@agroisync.com' className='text-secondary hover:text-primary transition-colors'>
                contato@agroisync.com
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className='glass-card p-8 text-center'
            >
              <div className='bg-primary-gradient mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-xl'>
                <Phone size={32} className='text-white' />
              </div>
              <h3 className='text-primary mb-4 text-xl font-bold'>Telefone</h3>
              <a
                href='https://wa.me/5566992362830'
                target='_blank'
                rel='noopener noreferrer'
                className='text-secondary hover:text-primary transition-colors'
              >
                (66) 99236-2830
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
              className='glass-card p-8 text-center'
            >
              <div className='bg-primary-gradient mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-xl'>
                <MapPin size={32} className='text-white' />
              </div>
              <h3 className='text-primary mb-4 text-xl font-bold'>Localização</h3>
              <p className='text-secondary'>Sinop - MT, Brasil</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='bg-primary-gradient py-20'>
        <div className='container-futuristic text-center'>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className='mb-6 text-4xl font-bold text-white md:text-5xl'>
              Pronto para o <span className='text-yellow-300'>Futuro</span>?
            </h2>
            <p className='mx-auto mb-8 max-w-2xl text-xl text-white/90'>
              Junte-se a milhares de profissionais do agronegócio que já descobriram o poder da tecnologia AgroSync
            </p>
            <div className='flex flex-col justify-center gap-4 sm:flex-row'>
              <motion.a
                href='/cadastro'
                className='text-primary flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 text-lg font-semibold transition-colors hover:bg-white/90'
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Começar Gratuitamente
                <ArrowRight size={20} />
              </motion.a>
              <motion.a
                href='/contato'
                className='hover:text-primary rounded-xl border-2 border-white px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-white'
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Falar com Especialista
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default About
