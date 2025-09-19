import React from 'react';
import { motion } from 'framer-motion';
import PlansSystem from '../components/PlansSystem';
import { 
  Crown
} from 'lucide-react';

const AgroisyncPlans = () => {

  return (
    <div className="agro-plans-container" data-page="planos">
      {/* Hero Section */}
      <section className="agro-hero-section" style={{
        background: 'linear-gradient(135deg, var(--agro-gradient-primary) 0%, var(--agro-gradient-secondary) 100%)',
        padding: '4rem 0'
      }}>
        <div className="agro-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{ textAlign: 'center' }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{
                width: '120px',
                height: '120px',
                margin: '0 auto 2rem',
                background: 'var(--agro-gradient-accent)',
                borderRadius: 'var(--agro-radius-3xl)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--agro-dark-green)',
                boxShadow: 'var(--agro-shadow-lg)'
              }}
            >
              <Crown size={48} />
            </motion.div>

            <motion.h1
              className="agro-hero-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Planos Premium
            </motion.h1>

            <motion.p
              className="agro-hero-subtitle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Escolha o plano ideal para impulsionar seu negócio no agronegócio
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Sistema de Planos */}
      <section className="agro-section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="agro-container">
          <PlansSystem />
        </div>
      </section>
    </div>
  );
};

export default AgroisyncPlans;