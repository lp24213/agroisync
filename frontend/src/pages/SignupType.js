import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Store, User, ArrowRight, Bitcoin } from 'lucide-react';

const SignupType = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <>
      <section
        style={{
          minHeight: '100vh',
          background: 'var(--bg-gradient)',
          display: 'flex',
          alignItems: 'center',
          padding: '2rem 1rem'
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            width: '100%',
            margin: '0 auto'
          }}
        >
          <motion.div variants={containerVariants} initial='hidden' animate='visible' style={{ textAlign: 'center' }}>
            {/* Header */}
            <motion.div variants={itemVariants} style={{ marginBottom: '3rem' }}>
              <h1
                style={{
                  fontSize: 'clamp(2rem, 4vw, 2.5rem)',
                  fontWeight: '700',
                  color: 'var(--text-primary)',
                  marginBottom: '1rem',
                  background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                🚀 Cadastre-se na Agroisync
              </h1>
              <p
                style={{
                  fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
                  color: 'var(--text-secondary)',
                  maxWidth: '700px',
                  margin: '0 auto',
                  textAlign: 'center',
                  lineHeight: '1.6'
                }}
              >
                Escolha o tipo de conta ideal para você e comece a vender, comprar e negociar no maior marketplace do agronegócio!
              </p>
            </motion.div>

            {/* Cards de Opções - APENAS 3 TIPOS */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
                gap: 'clamp(1.5rem, 3vw, 2rem)',
                marginBottom: '3rem',
                maxWidth: '1000px',
                margin: '0 auto 3rem'
              }}
            >
              {/* Usuário Geral - PODE LANÇAR FRETE E PRODUTO */}
              <motion.div variants={itemVariants} whileHover={{ scale: 1.05, y: -10 }}>
                <Link to='/signup/general' style={{ textDecoration: 'none' }}>
                  <div
                    style={{
                      background: 'var(--card-bg)',
                      borderRadius: '20px',
                      padding: 'clamp(2rem, 4vw, 3rem) clamp(1.5rem, 3vw, 2rem)',
                      boxShadow: '0 10px 30px rgba(42, 127, 79, 0.15)',
                      border: '3px solid rgba(42, 127, 79, 0.3)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center'
                    }}
                  >
                    <div
                      style={{
                        width: '90px',
                        height: '90px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '1.5rem',
                        boxShadow: '0 8px 20px rgba(16, 185, 129, 0.4)'
                      }}
                    >
                      <User size={45} color='white' strokeWidth={2.5} />
                    </div>

                    <h3
                      style={{
                        fontSize: 'clamp(1.3rem, 3vw, 1.6rem)',
                        fontWeight: '700',
                        color: 'var(--accent)',
                        marginBottom: '1rem'
                      }}
                    >
                      👤 Usuário Geral
                    </h3>

                    <p
                      style={{
                        color: 'var(--muted)',
                        lineHeight: '1.6',
                        marginBottom: '1.5rem',
                        flex: 1,
                        fontSize: 'clamp(0.95rem, 2vw, 1.05rem)'
                      }}
                    >
                      <strong style={{ color: 'var(--accent)' }}>✅ Pode lançar FRETES e PRODUTOS!</strong><br/><br/>
                      Ideal para produtores, transportadores e usuários que querem usar todas as funcionalidades da plataforma.
                    </p>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        color: 'var(--accent)',
                        fontWeight: '700',
                        fontSize: 'clamp(1rem, 2.5vw, 1.15rem)',
                        gap: '0.5rem'
                      }}
                    >
                      Cadastrar-se
                      <ArrowRight size={22} />
                    </div>
                  </div>
                </Link>
              </motion.div>

              {/* Loja */}
              <motion.div variants={itemVariants} whileHover={{ scale: 1.05, y: -10 }}>
                <Link to='/signup/store' style={{ textDecoration: 'none' }}>
                  <div
                    style={{
                      background: 'var(--card-bg)',
                      borderRadius: '20px',
                      padding: 'clamp(2rem, 4vw, 3rem) clamp(1.5rem, 3vw, 2rem)',
                      boxShadow: '0 10px 30px rgba(147, 51, 234, 0.15)',
                      border: '3px solid rgba(147, 51, 234, 0.3)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center'
                    }}
                  >
                    <div
                      style={{
                        width: '90px',
                        height: '90px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #9333ea 0%, #7e22ce 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '1.5rem',
                        boxShadow: '0 8px 20px rgba(147, 51, 234, 0.4)'
                      }}
                    >
                      <Store size={45} color='white' strokeWidth={2.5} />
                    </div>

                    <h3
                      style={{
                        fontSize: 'clamp(1.3rem, 3vw, 1.6rem)',
                        fontWeight: '700',
                        color: '#9333ea',
                        marginBottom: '1rem'
                      }}
                    >
                      🏪 Loja Virtual
                    </h3>

                    <p
                      style={{
                        color: 'var(--muted)',
                        lineHeight: '1.6',
                        marginBottom: '1.5rem',
                        flex: 1,
                        fontSize: 'clamp(0.95rem, 2vw, 1.05rem)'
                      }}
                    >
                      <strong style={{ color: '#9333ea' }}>🛒 Loja Completa!</strong><br/><br/>
                      Para lojas, cooperativas e grandes produtores que querem uma loja virtual profissional com gestão completa.
                    </p>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        color: '#9333ea',
                        fontWeight: '700',
                        fontSize: 'clamp(1rem, 2.5vw, 1.15rem)',
                        gap: '0.5rem'
                      }}
                    >
                      Cadastrar-se
                      <ArrowRight size={22} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            </div>

            {/* Link para Login */}
            <motion.div variants={itemVariants}>
              <p
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '1.1rem'
                }}
              >
                Já tem uma conta?{' '}
                <Link
                  to='/login'
                  style={{
                    color: 'var(--primary)',
                    textDecoration: 'none',
                    fontWeight: '600'
                  }}
                >
                  Faça login aqui
                </Link>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default SignupType;
