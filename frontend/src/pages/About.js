import React from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Users, 
  Target, 
  Award, 
  TrendingUp,
  Shield,
  Zap,
  Globe,
  ArrowRight
} from 'lucide-react';

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
  ];

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
  ];

  const achievements = [
    { number: '10K+', label: 'Usuários Ativos' },
    { number: 'R$ 50M+', label: 'Volume Transacionado' },
    { number: '99.9%', label: 'Uptime Garantido' },
    { number: '24/7', label: 'Suporte Premium' },
    { number: '15+', label: 'Países Conectados' },
    { number: '100+', label: 'Parceiros Estratégicos' }
  ];

  return (
    <div className="min-h-screen bg-primary">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container-futuristic">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Sobre o <span className="text-yellow-300">AgroSync</span>
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
              A plataforma mais avançada e futurista do mundo para conectar produtores, 
              compradores e transportadores do agronegócio. Tecnologia de ponta, 
              segurança máxima e performance extrema.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-secondary">
        <div className="container-futuristic">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="glass-card p-8"
            >
              <div className="w-16 h-16 bg-primary-gradient rounded-xl mb-6 flex items-center justify-center">
                <Target size={32} className="text-white" />
              </div>
              <h2 className="text-3xl font-bold text-primary mb-4">Nossa Missão</h2>
              <p className="text-secondary leading-relaxed">
                Revolucionar o agronegócio através da tecnologia, conectando todos os 
                elos da cadeia produtiva em uma plataforma única, segura e eficiente. 
                Democratizar o acesso às melhores oportunidades do mercado agrícola.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="glass-card p-8"
            >
              <div className="w-16 h-16 bg-primary-gradient rounded-xl mb-6 flex items-center justify-center">
                <Award size={32} className="text-white" />
              </div>
              <h2 className="text-3xl font-bold text-primary mb-4">Nossa Visão</h2>
              <p className="text-secondary leading-relaxed">
                Ser a plataforma global de referência no agronegócio, reconhecida 
                pela inovação, confiabilidade e impacto positivo na vida dos 
                produtores rurais e toda a cadeia agrícola mundial.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-primary">
        <div className="container-futuristic">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Nossos <span className="text-yellow-300">Valores</span>
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Os princípios que guiam nossa missão de transformar o agronegócio
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass-card p-6 text-center hover:scale-105 transition-transform"
              >
                <div className="w-16 h-16 bg-primary-gradient rounded-xl mx-auto mb-4 flex items-center justify-center">
                  <value.icon size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {value.title}
                </h3>
                <p className="text-white/80">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-secondary">
        <div className="container-futuristic">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              Nossa <span className="text-gradient">Equipe</span>
            </h2>
            <p className="text-xl text-secondary max-w-3xl mx-auto">
              Profissionais apaixonados por tecnologia e agronegócio
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass-card p-8 text-center"
              >
                <div className="w-24 h-24 bg-primary-gradient rounded-full mx-auto mb-6 flex items-center justify-center">
                  <Users size={40} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-primary mb-2">
                  {member.name}
                </h3>
                <p className="text-secondary font-semibold mb-4">
                  {member.role}
                </p>
                <p className="text-secondary">
                  {member.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-20 bg-primary-gradient">
        <div className="container-futuristic">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Nossos <span className="text-yellow-300">Números</span>
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Resultados que comprovam nossa excelência e impacto no agronegócio
            </p>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {achievement.number}
                </div>
                <div className="text-white/80 font-medium">
                  {achievement.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-20 bg-secondary">
        <div className="container-futuristic">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              Entre em <span className="text-gradient">Contato</span>
            </h2>
            <p className="text-xl text-secondary max-w-3xl mx-auto">
              Estamos sempre disponíveis para ajudar e ouvir suas sugestões
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
              className="glass-card p-8 text-center"
            >
              <div className="w-16 h-16 bg-primary-gradient rounded-xl mx-auto mb-6 flex items-center justify-center">
                <Mail size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-4">Email</h3>
              <a 
                href="mailto:contato@agroisync.com"
                className="text-secondary hover:text-primary transition-colors"
              >
                contato@agroisync.com
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="glass-card p-8 text-center"
            >
              <div className="w-16 h-16 bg-primary-gradient rounded-xl mx-auto mb-6 flex items-center justify-center">
                <Phone size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-4">Telefone</h3>
              <a 
                href="https://wa.me/5566992362830"
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary hover:text-primary transition-colors"
              >
                (66) 99236-2830
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
              className="glass-card p-8 text-center"
            >
              <div className="w-16 h-16 bg-primary-gradient rounded-xl mx-auto mb-6 flex items-center justify-center">
                <MapPin size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-4">Localização</h3>
              <p className="text-secondary">
                Sinop - MT, Brasil
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-gradient">
        <div className="container-futuristic text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Pronto para o <span className="text-yellow-300">Futuro</span>?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Junte-se a milhares de profissionais do agronegócio que já descobriram 
              o poder da tecnologia AgroSync
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="/cadastro"
                className="bg-white text-primary px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/90 transition-colors flex items-center justify-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Começar Gratuitamente
                <ArrowRight size={20} />
              </motion.a>
              <motion.a
                href="/contato"
                className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-primary transition-colors"
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
  );
};

export default About;
