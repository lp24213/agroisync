'use client';

import { motion } from "framer-motion";
import { Mail, MessageCircle, Phone } from "lucide-react";

export function Contact() {
  return (
    <section className="py-20 bg-[#000000]">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="font-orbitron text-4xl md:text-5xl text-[#00F0FF] mb-4 animate-fadeIn">
            Contato & Suporte
          </h2>
          <p className="text-lg md:text-xl text-[#cccccc] max-w-2xl mx-auto">
            Suporte 24/7 com resposta imediata para todas as suas necessidades
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(0, 240, 255, 0.8)" }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="bg-black/70 border border-[#00F0FF] p-8 rounded-2xl text-center hover:shadow-neon transition-all duration-300"
          >
            <div className="bg-[#00F0FF]/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Mail className="text-[#00F0FF]" size={32} />
            </div>
            <h3 className="text-2xl font-orbitron font-bold text-[#00F0FF] mb-4">E-mail</h3>
            <p className="text-[#cccccc] mb-6">contato@agrotm.com.br</p>
            <p className="text-[#cccccc]">Suporte 24/7</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(0, 240, 255, 0.8)" }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="bg-black/70 border border-[#00F0FF] p-8 rounded-2xl text-center hover:shadow-neon transition-all duration-300"
          >
            <div className="bg-[#00F0FF]/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <MessageCircle className="text-[#00F0FF]" size={32} />
            </div>
            <h3 className="text-2xl font-orbitron font-bold text-[#00F0FF] mb-4">Chat</h3>
            <p className="text-[#cccccc] mb-6">Chat ao vivo</p>
            <p className="text-[#cccccc]">Resposta instantânea</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(0, 240, 255, 0.8)" }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="bg-black/70 border border-[#00F0FF] p-8 rounded-2xl text-center hover:shadow-neon transition-all duration-300"
          >
            <div className="bg-[#00F0FF]/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Phone className="text-[#00F0FF]" size={32} />
            </div>
            <h3 className="text-2xl font-orbitron font-bold text-[#00F0FF] mb-4">Telefone</h3>
            <p className="text-[#cccccc] mb-6">+55 (66) 99236-2830</p>
            <p className="text-[#cccccc]">Atendimento: Seg a Sex, 08h às 18h</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}