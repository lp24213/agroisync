'use client';

import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function ContactPage() {
  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      value: 'contato@agroisync.com',
      description: 'Envie-nos uma mensagem'
    },
    {
      icon: Phone,
      title: 'Telefone',
      value: '+55 (11) 99999-9999',
      description: 'Ligue para nós'
    },
    {
      icon: MapPin,
      title: 'Endereço',
      value: 'São Paulo, SP - Brasil',
      description: 'Nossa localização'
    }
  ];

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Entre em <span className="text-gradient">Contato</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Tem alguma dúvida ou sugestão? Estamos aqui para ajudar! 
            Entre em contato conosco e responderemos o mais rápido possível.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Envie uma Mensagem</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Nome Completo
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400/50 transition-colors duration-200"
                  placeholder="Seu nome completo"
                />
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400/50 transition-colors duration-200"
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Assunto
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400/50 transition-colors duration-200"
                  placeholder="Assunto da mensagem"
                />
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Mensagem
                </label>
                <textarea
                  rows={5}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400/50 transition-colors duration-200 resize-none"
                  placeholder="Digite sua mensagem aqui..."
                />
              </div>

              <motion.button
                className="w-full px-6 py-3 bg-gradient-to-r from-cyan-400 to-blue-600 text-black font-semibold rounded-lg hover:from-cyan-500 hover:to-blue-700 transition-all duration-300 flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Send className="w-5 h-5" />
                Enviar Mensagem
              </motion.button>
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Informações de Contato</h2>
            
            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={info.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                  className="flex items-start space-x-4 p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:border-cyan-400/50 transition-all duration-300"
                  whileHover={{ y: -2 }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <info.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">{info.title}</h3>
                    <p className="text-cyan-400 font-medium mb-1">{info.value}</p>
                    <p className="text-gray-400 text-sm">{info.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Additional Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="p-6 bg-gradient-to-r from-cyan-400/10 to-blue-600/10 border border-cyan-400/30 rounded-2xl"
            >
              <h3 className="text-white font-semibold mb-3">Horário de Atendimento</h3>
              <p className="text-gray-300 text-sm mb-2">
                <strong>Segunda a Sexta:</strong> 8h às 18h
              </p>
              <p className="text-gray-300 text-sm mb-2">
                <strong>Sábado:</strong> 8h às 12h
              </p>
              <p className="text-gray-300 text-sm">
                <strong>Domingo:</strong> Fechado
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="mt-20"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Perguntas Frequentes
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              {
                question: 'Como funciona o sistema de pagamentos?',
                answer: 'Aceitamos cartões de crédito, PIX e criptomoedas através de nossa plataforma segura.'
              },
              {
                question: 'Qual o prazo de entrega?',
                answer: 'O prazo varia de 1 a 5 dias úteis dependendo da sua localização e tipo de produto.'
              },
              {
                question: 'Posso cancelar meu pedido?',
                answer: 'Sim, você pode cancelar até 24h após a confirmação do pedido.'
              },
              {
                question: 'Oferecem suporte técnico?',
                answer: 'Sim, temos uma equipe especializada disponível 24/7 para ajudar.'
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 1.1 + index * 0.1 }}
                className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl"
              >
                <h3 className="text-white font-semibold mb-3">{faq.question}</h3>
                <p className="text-gray-400">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
