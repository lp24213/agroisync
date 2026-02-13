import React from 'react';
import { Helmet } from 'react-helmet-async';

const Sistemap = () => {
  return (
    <>
      <Helmet>
        <title>Sistema de Proteção - Agroisync</title>
        <meta name="description" content="Sistema de proteção avançado para garantir a segurança das transações no agronegócio." />
      </Helmet>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Sistema de Proteção</h1>
        <div className="max-w-4xl mx-auto">
          <p className="text-lg mb-6">
            Nosso Sistema de Proteção garante a segurança máxima para todas as transações realizadas na plataforma Agroisync.
            Utilizamos tecnologias avançadas de criptografia e verificação para proteger produtores, compradores e transportadores.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Criptografia SSL</h2>
              <p>Todas as conexões são protegidas por criptografia SSL de 256 bits.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Verificação de Identidade</h2>
              <p>Sistema robusto de verificação para garantir a autenticidade dos usuários.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Monitoramento 24/7</h2>
              <p>Equipe dedicada monitorando todas as atividades para prevenir fraudes.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Backup Seguro</h2>
              <p>Dados criptografados e backups automáticos em locais seguros.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sistemap;