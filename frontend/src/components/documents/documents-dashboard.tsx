'use client';

import { motion } from 'framer-motion';
import { FileText, Upload, Download, Eye, Lock, Shield, CheckCircle } from 'lucide-react';

export function DocumentsDashboard() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-600 bg-clip-text text-transparent mb-4">
            Documentos Digitais
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Gestão segura e inteligente de documentos agrícolas. 
            Upload, assinatura digital e armazenamento em blockchain.
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
            <FileText className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
            <div className="text-3xl font-bold text-white">15.7K</div>
            <div className="text-gray-400">Documentos</div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
            <Upload className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <div className="text-3xl font-bold text-white">2.4K</div>
            <div className="text-gray-400">Uploads Hoje</div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
            <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <div className="text-3xl font-bold text-white">98.9%</div>
            <div className="text-gray-400">Assinados</div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
            <Shield className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <div className="text-3xl font-bold text-white">100%</div>
            <div className="text-gray-400">Seguros</div>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Left Column */}
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h3 className="text-2xl font-bold text-white mb-4">Tipos de Documentos</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-gray-300">Contratos</span>
                  <span className="text-emerald-400 font-bold">45.2%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-gray-300">Notas Fiscais</span>
                  <span className="text-blue-400 font-bold">28.7%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-gray-300">Certificados</span>
                  <span className="text-purple-400 font-bold">15.3%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-gray-300">Outros</span>
                  <span className="text-cyan-400 font-bold">10.8%</span>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h3 className="text-2xl font-bold text-white mb-4">Status de Assinatura</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">Assinados</span>
                  <span className="text-green-400 font-medium">15,521</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Eye className="w-5 h-5 text-yellow-400" />
                  <span className="text-gray-300">Pendentes</span>
                  <span className="text-yellow-400 font-medium">89</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Lock className="w-5 h-5 text-red-400" />
                  <span className="text-gray-300">Bloqueados</span>
                  <span className="text-red-400 font-medium">12</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h3 className="text-2xl font-bold text-white mb-4">Armazenamento</h3>
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-emerald-400/10 to-teal-600/10 border border-emerald-400/30 rounded-xl">
                  <h4 className="text-lg font-semibold text-white">IPFS Blockchain</h4>
                  <div className="text-2xl font-bold text-emerald-400">2.4 TB</div>
                  <p className="text-gray-400">Armazenamento descentralizado</p>
                </div>
                <div className="p-4 bg-gradient-to-r from-blue-400/10 to-cyan-600/10 border border-blue-400/30 rounded-xl">
                  <h4 className="text-lg font-semibold text-white">AWS S3</h4>
                  <div className="text-2xl font-bold text-blue-400">1.8 TB</div>
                  <p className="text-gray-400">Backup redundante</p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h3 className="text-2xl font-bold text-white mb-4">Segurança</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-white/5 rounded-lg">
                  <div className="text-sm text-gray-400">Criptografia</div>
                  <div className="text-lg font-bold text-green-400">AES-256</div>
                </div>
                <div className="text-center p-3 bg-white/5 rounded-lg">
                  <div className="text-sm text-gray-400">Hash</div>
                  <div className="text-lg font-bold text-blue-400">SHA-512</div>
                </div>
                <div className="text-center p-3 bg-white/5 rounded-lg">
                  <div className="text-sm text-gray-400">Assinatura</div>
                  <div className="text-lg font-bold text-purple-400">RSA-4096</div>
                </div>
                <div className="text-center p-3 bg-white/5 rounded-lg">
                  <div className="text-sm text-gray-400">Compliance</div>
                  <div className="text-lg font-bold text-cyan-400">LGPD</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
        >
          <div className="text-center">
            <Upload className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">Upload de Documentos</h3>
            <p className="text-gray-400 max-w-md mx-auto mb-6">
              Arraste e solte seus documentos ou clique para selecionar. 
              Suportamos PDF, DOC, DOCX e imagens.
            </p>
            <div className="border-2 border-dashed border-emerald-400/30 rounded-xl p-8 hover:border-emerald-400/50 transition-colors duration-300">
              <div className="text-emerald-400 text-lg font-medium">
                Clique aqui ou arraste arquivos
              </div>
              <div className="text-gray-500 text-sm mt-2">
                Máximo 50MB por arquivo
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
