'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { motion } from 'framer-motion';

export function Contact() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    alert('Mensagem enviada com sucesso!');
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  return (
    <section id="contact" className="py-20 bg-agro-dark relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="grid-animation"></div>
      </div>
      
      {/* Scanlines Effect */}
      <div className="absolute inset-0 z-1 scanlines opacity-10"></div>
      
      {/* Digital Rain Effect */}
      <div className="absolute inset-0 z-0 opacity-5 digital-rain"></div>
      
      {/* Floating Elements */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          className="absolute top-1/4 left-1/5 w-32 h-32 rounded-full bg-agro-blue/20 blur-xl"
          animate={{ 
            x: [0, 30, 0], 
            y: [0, -30, 0],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 8,
            ease: "easeInOut" 
          }}
        />
        <motion.div 
          className="absolute bottom-1/3 right-1/5 w-40 h-40 rounded-full bg-agro-purple/20 blur-xl"
          animate={{ 
            x: [0, -40, 0], 
            y: [0, 20, 0],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 10,
            ease: "easeInOut" 
          }}
        />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl font-bold text-white mb-4 text-glow relative inline-block">
            <span className="relative z-10">Entre em Contato</span>
            <motion.span 
              className="absolute inset-0 bg-gradient-to-r from-agro-blue via-agro-purple to-agro-green opacity-0 blur-lg"
              animate={{ opacity: [0, 0.5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </h2>
          <p className="text-xl text-gray-400">
            Tem alguma dúvida? Estamos aqui para ajudar!
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Contact Form */}
          <motion.div variants={itemVariants}>
            <Card className="bg-agro-darker/80 border border-agro-blue/20 backdrop-blur-sm overflow-hidden relative group cyberpunk-card">
              {/* Card corner accents */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-agro-blue opacity-70"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-agro-blue opacity-70"></div>
              
              {/* Hover gradient effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-agro-blue/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10 p-6">
                <h3 className="text-2xl font-bold text-white mb-6 text-glow-blue">Envie uma Mensagem</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Nome"
                      placeholder="Seu nome completo"
                      required
                    />
                    <Input
                      label="Email"
                      type="email"
                      placeholder="seu@email.com"
                      required
                    />
                  </div>
                  
                  <Input
                    label="Assunto"
                    placeholder="Como podemos ajudar?"
                    required
                  />
                  
                  <Textarea
                    label="Mensagem"
                    placeholder="Descreva sua dúvida ou solicitação..."
                    rows={5}
                    required
                  />
                  
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      type="submit" 
                      variant="primary" 
                      className="w-full bg-gradient-to-r from-agro-blue to-agro-purple hover:from-agro-purple hover:to-agro-blue relative group overflow-hidden"
                    >
                      <span className="relative z-10">Enviar Mensagem</span>
                      <span className="absolute inset-0 bg-gradient-to-r from-agro-neon to-agro-green opacity-0 group-hover:opacity-30 transition-opacity duration-300"></span>
                    </Button>
                  </motion.div>
                </form>
              </div>
            </Card>
          </motion.div>

          {/* Contact Info */}
          <motion.div className="space-y-8" variants={itemVariants}>
            <Card className="bg-agro-darker/80 border border-agro-green/20 backdrop-blur-sm overflow-hidden relative group cyberpunk-card">
              {/* Card corner accents */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-agro-green opacity-70"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-agro-green opacity-70"></div>
              
              {/* Hover gradient effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-agro-green/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10 p-6">
                <h3 className="text-2xl font-bold text-white mb-6 text-glow-green">Informações de Contato</h3>
                <div className="space-y-6">
                  <motion.div 
                    className="flex items-center p-3 rounded-lg hover:bg-agro-darker/50 transition-colors duration-300 border border-transparent hover:border-agro-green/30"
                    whileHover={{ x: 5 }}
                  >
                    <motion.div 
                      className="text-2xl mr-4 text-glow-green"
                      whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                      transition={{ duration: 0.5 }}
                    >📧</motion.div>
                    <div>
                      <p className="text-white font-semibold">Email</p>
                      <p className="text-gray-400 group-hover:text-agro-green transition-colors duration-300">contato@agrotm.com</p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-center p-3 rounded-lg hover:bg-agro-darker/50 transition-colors duration-300 border border-transparent hover:border-agro-green/30"
                    whileHover={{ x: 5 }}
                  >
                    <motion.div 
                      className="text-2xl mr-4 text-glow-green"
                      whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                      transition={{ duration: 0.5 }}
                    >🌐</motion.div>
                    <div>
                      <p className="text-white font-semibold">Website</p>
                      <p className="text-gray-400 group-hover:text-agro-green transition-colors duration-300">www.agrotm.com</p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-center p-3 rounded-lg hover:bg-agro-darker/50 transition-colors duration-300 border border-transparent hover:border-agro-green/30"
                    whileHover={{ x: 5 }}
                  >
                    <motion.div 
                      className="text-2xl mr-4 text-glow-green"
                      whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                      transition={{ duration: 0.5 }}
                    >📱</motion.div>
                    <div>
                      <p className="text-white font-semibold">Telefone</p>
                      <p className="text-gray-400 group-hover:text-agro-green transition-colors duration-300">+55 (11) 99999-9999</p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </Card>

            <Card className="bg-agro-darker/80 border border-agro-purple/20 backdrop-blur-sm overflow-hidden relative group cyberpunk-card">
              {/* Card corner accents */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-agro-purple opacity-70"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-agro-purple opacity-70"></div>
              
              {/* Hover gradient effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-agro-purple/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10 p-6">
                <h3 className="text-2xl font-bold text-white mb-6 text-glow-purple">Redes Sociais</h3>
                <div className="grid grid-cols-2 gap-4">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      variant="outline" 
                      className="justify-start w-full border-agro-purple/30 hover:border-agro-purple hover:bg-agro-purple/10 group"
                    >
                      <motion.span 
                        className="mr-2 text-glow-purple"
                        whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                        transition={{ duration: 0.5 }}
                      >🐦</motion.span>
                      <span className="group-hover:text-agro-purple transition-colors duration-300">Twitter</span>
                    </Button>
                  </motion.div>
                  
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      variant="outline" 
                      className="justify-start w-full border-agro-purple/30 hover:border-agro-purple hover:bg-agro-purple/10 group"
                    >
                      <motion.span 
                        className="mr-2 text-glow-purple"
                        whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                        transition={{ duration: 0.5 }}
                      >💬</motion.span>
                      <span className="group-hover:text-agro-purple transition-colors duration-300">Discord</span>
                    </Button>
                  </motion.div>
                  
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      variant="outline" 
                      className="justify-start w-full border-agro-purple/30 hover:border-agro-purple hover:bg-agro-purple/10 group"
                    >
                      <motion.span 
                        className="mr-2 text-glow-purple"
                        whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                        transition={{ duration: 0.5 }}
                      >📘</motion.span>
                      <span className="group-hover:text-agro-purple transition-colors duration-300">Telegram</span>
                    </Button>
                  </motion.div>
                  
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      variant="outline" 
                      className="justify-start w-full border-agro-purple/30 hover:border-agro-purple hover:bg-agro-purple/10 group"
                    >
                      <motion.span 
                        className="mr-2 text-glow-purple"
                        whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                        transition={{ duration: 0.5 }}
                      >📷</motion.span>
                      <span className="group-hover:text-agro-purple transition-colors duration-300">Instagram</span>
                    </Button>
                  </motion.div>
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}