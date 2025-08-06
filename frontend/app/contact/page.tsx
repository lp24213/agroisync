'use client';

import { Layout } from '../../components/layout/Layout';
import { motion } from 'framer-motion';
import { Mail, Phone, Clock, MessageSquare, MapPin, Send, Shield } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

export default function ContactPage() {
  const { t } = useTranslation('common');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Simular envio para o backend
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Aqui você pode integrar com sua API real
      // const response = await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });

      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      value: 'contato@agrotm.com.br',
      description: 'Envie suas dúvidas e sugestões',
      color: 'text-green-400',
    },
    {
      icon: Phone,
      title: 'Telefone',
      value: '+55 (66) 99236-2830',
      description: 'Suporte 24/7 via telefone',
      color: 'text-blue-400',
    },
    {
      icon: Clock,
      title: 'Horário de Atendimento',
      value: '24/7',
      description: 'Suporte disponível 24 horas',
      color: 'text-purple-400',
    },
    {
      icon: MessageSquare,
      title: 'Chat Online',
      value: 'Disponível',
      description: 'Suporte via chat em tempo real',
      color: 'text-orange-400',
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-green-900 via-black to-green-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Entre em <span className="text-green-400">Contato</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Estamos aqui para ajudar você a revolucionar seu agronegócio
            </p>
          </motion.div>
        </div>
      </section>

      {/* Informações de Contato */}
      <section className="py-20 bg-agro-darker">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Informações de <span className="text-green-400">Contato</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Entre em contato conosco através dos canais abaixo
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card className="text-center p-6 bg-agro-darker/80 border border-green-500/20 hover:border-green-400/40 transition-colors">
                  <info.icon className={`w-12 h-12 mx-auto mb-4 ${info.color}`} />
                  <h3 className="text-xl font-bold text-white mb-2">{info.title}</h3>
                  <p className="text-green-400 font-semibold mb-2">{info.value}</p>
                  <p className="text-gray-400 text-sm">{info.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Formulário de Contato */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold text-white mb-6">
                Envie sua <span className="text-green-400">Mensagem</span>
              </h2>
              <p className="text-lg text-gray-400 mb-8">
                Preencha o formulário abaixo e nossa equipe entrará em contato com você em até 24 horas.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Localização</h3>
                    <p className="text-gray-400">Brasil - Centro de Tecnologia Agro</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Resposta Rápida</h3>
                    <p className="text-gray-400">Resposta em até 24 horas</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <Shield className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Dados Seguros</h3>
                    <p className="text-gray-400">Suas informações estão protegidas</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <Card className="p-8 bg-agro-darker/80 border border-green-500/20">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                        Nome Completo *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400 transition-colors"
                        placeholder="Seu nome completo"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400 transition-colors"
                        placeholder="seu@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                      Assunto *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-400 transition-colors"
                    >
                      <option value="">Selecione um assunto</option>
                      <option value="comercial">Comercial</option>
                      <option value="suporte">Suporte Técnico</option>
                      <option value="parceria">Parceria</option>
                      <option value="investimento">Investimento</option>
                      <option value="outro">Outro</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                      Mensagem *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400 transition-colors resize-none"
                      placeholder="Descreva sua mensagem..."
                    />
                  </div>

                  {submitStatus === 'success' && (
                    <div className="p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
                      <p className="text-green-400">Mensagem enviada com sucesso! Entraremos em contato em breve.</p>
                    </div>
                  )}

                  {submitStatus === 'error' && (
                    <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
                      <p className="text-red-400">Erro ao enviar mensagem. Tente novamente.</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Enviando...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Enviar Mensagem</span>
                      </>
                    )}
                  </button>
                </form>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Rápido */}
      <section className="py-20 bg-agro-darker">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Perguntas <span className="text-green-400">Frequentes</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Respostas rápidas para as dúvidas mais comuns
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                question: 'Como funciona a criptomoeda AGROTM?',
                answer: 'A AGROTM é uma criptomoeda especializada para transações no agronegócio, permitindo pagamentos seguros e transparentes entre produtores e compradores.'
              },
              {
                question: 'Qual o tempo de resposta do suporte?',
                answer: 'Nosso suporte responde em até 24 horas, com atendimento 24/7 via chat e telefone para casos urgentes.'
              },
              {
                question: 'A plataforma é segura?',
                answer: 'Sim, utilizamos tecnologia blockchain e criptografia avançada para garantir a segurança de todas as transações e dados.'
              },
              {
                question: 'Como posso começar a usar a plataforma?',
                answer: 'Basta criar uma conta, completar o processo de verificação e começar a negociar produtos agro de forma segura e transparente.'
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card className="p-6 bg-agro-darker/80 border border-green-500/20">
                  <h3 className="text-lg font-bold text-white mb-3">{faq.question}</h3>
                  <p className="text-gray-400">{faq.answer}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
} 