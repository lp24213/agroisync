'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';

export function Contact() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    alert('Mensagem enviada com sucesso!');
  };

  return (
    <section id="contact" className="py-20 bg-agro-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Entre em Contato
          </h2>
          <p className="text-xl text-gray-400">
            Tem alguma dúvida? Estamos aqui para ajudar!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card>
            <h3 className="text-2xl font-bold text-white mb-6">Envie uma Mensagem</h3>
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
              
              <Button type="submit" variant="primary" className="w-full">
                Enviar Mensagem
              </Button>
            </form>
          </Card>

          {/* Contact Info */}
          <div className="space-y-8">
            <Card>
              <h3 className="text-2xl font-bold text-white mb-6">Informações de Contato</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="text-2xl mr-4">📧</div>
                  <div>
                    <p className="text-white font-semibold">Email</p>
                    <p className="text-gray-400">contato@agrotm.com</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="text-2xl mr-4">🌐</div>
                  <div>
                    <p className="text-white font-semibold">Website</p>
                    <p className="text-gray-400">www.agrotm.com</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="text-2xl mr-4">📱</div>
                  <div>
                    <p className="text-white font-semibold">Telefone</p>
                    <p className="text-gray-400">+55 (11) 99999-9999</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-2xl font-bold text-white mb-6">Redes Sociais</h3>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="justify-start">
                  <span className="mr-2">🐦</span>
                  Twitter
                </Button>
                <Button variant="outline" className="justify-start">
                  <span className="mr-2">💬</span>
                  Discord
                </Button>
                <Button variant="outline" className="justify-start">
                  <span className="mr-2">📘</span>
                  Telegram
                </Button>
                <Button variant="outline" className="justify-start">
                  <span className="mr-2">📷</span>
                  Instagram
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
} 