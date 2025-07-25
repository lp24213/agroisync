import { useState } from 'react';
import { motion } from 'framer-motion';

const steps = [
  'Conecte sua carteira Web3',
  'Complete o perfil de agricultor',
  'Faça seu primeiro stake',
  'Ganhe seu primeiro NFT',
  'Participe da governança',
];

export default function Onboarding() {
  const [step, setStep] = useState(0);
  return (
    <div className="w-full max-w-lg mx-auto bg-glass p-6 rounded-2xl shadow-xl mt-8 animate-fade-in">
      <h2 className="text-2xl font-bold mb-4 text-neon">Onboarding Gamificado 🚀</h2>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-4"
      >
        <span className="block text-lg mb-2">{steps[step]}</span>
        <progress value={step + 1} max={steps.length} className="w-full h-2 neon-progress" />
      </motion.div>
      <button
        className="neon-btn w-full mt-2"
        onClick={() => setStep((s) => (s + 1) % steps.length)}
      >
        {step + 1 === steps.length ? 'Finalizar 🚀' : 'Próximo'}
      </button>
    </div>
  );
}
