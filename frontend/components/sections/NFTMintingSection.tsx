'use client';

import { motion } from "framer-motion";
import { Image, Palette, Zap } from "lucide-react";

export function NFTMintingSection() {
  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            NFT Minting
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Crie e negocie NFTs agrícolas únicos
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-800 p-8 rounded-lg border border-gray-700 text-center"
          >
            <div className="bg-green-500/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Image className="text-green-400" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Criar NFT</h3>
            <p className="text-gray-400 mb-6">Mint seus próprios NFTs agrícolas</p>
            <div className="text-3xl font-bold text-green-400 mb-2">0.1 SOL</div>
            <p className="text-gray-400">Custo de Mint</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800 p-8 rounded-lg border border-gray-700 text-center"
          >
            <div className="bg-blue-500/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Palette className="text-blue-400" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Coleções Únicas</h3>
            <p className="text-gray-400 mb-6">NFTs raros e colecionáveis</p>
            <div className="text-3xl font-bold text-blue-400 mb-2">10K+</div>
            <p className="text-gray-400">NFTs Criados</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-800 p-8 rounded-lg border border-gray-700 text-center"
          >
            <div className="bg-purple-500/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Zap className="text-purple-400" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Marketplace</h3>
            <p className="text-gray-400 mb-6">Compre e venda NFTs</p>
            <div className="text-3xl font-bold text-purple-400 mb-2">2.5%</div>
            <p className="text-gray-400">Taxa de Marketplace</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 