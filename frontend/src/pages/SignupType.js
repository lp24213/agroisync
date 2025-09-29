import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Truck, Store, Package, User, ArrowRight } from 'lucide-react';

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

  const cardVariants = {
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 }
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
                  fontSize: '2.5rem',
                  fontWeight: '700',
                  color: 'var(--text-primary)',
                  marginBottom: '1rem',
                  background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Seja um Pequeno Produtor ou Comerciante
              </h1>
              <p
                style={{
                  fontSize: '1.2rem',
                  color: 'var(--text-secondary)',
                  maxWidth: '600px',
                  margin: '0 auto',
                  textAlign: 'center',
                  lineHeight: '1.6'
                }}
              >
                Conecte-se com compradores e expanda seu negócio no agronegócio brasileiro
              </p>
            </motion.div>

            {/* Cards de Opções */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2rem',
                marginBottom: '3rem'
              }}
            >
              {/* Frete */}
              <motion.div variants={itemVariants} whileHover='hover'>
                <Link to='/signup/freight' style={{ textDecoration: 'none' }}>
                  <div
                    style={{
                      background: 'var(--card-bg)',
                      borderRadius: '20px',
                      padding: '3rem 2rem',
                      boxShadow: 'var(--shadow-lg)',
                      border: '2px solid transparent',
                      backgroundImage:
                        'linear-gradient(var(--card-bg), var(--card-bg)), linear-gradient(135deg, var(--primary), var(--secondary))',
                      backgroundOrigin: 'border-box',
                      backgroundClip: 'content-box, border-box',
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
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '1.5rem'
                      }}
                    >
                      <Truck size={40} color='white' />
                    </div>

                    <h3
                      style={{
                        fontSize: '1.5rem',
                        fontWeight: '600',
                        color: 'var(--text-primary)',
                        marginBottom: '1rem'
                      }}
                    >
                      Transportador/Frete
                    </h3>

                    <p
                      style={{
                        color: 'var(--text-secondary)',
                        lineHeight: '1.6',
                        marginBottom: '2rem',
                        flex: 1
                      }}
                    >
                      Para empresas e profissionais que oferecem serviços de transporte de cargas e mercadorias.
                    </p>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        color: 'var(--primary)',
                        fontWeight: '600',
                        fontSize: '1.1rem'
                      }}
                    >
                      Cadastrar-se
                      <ArrowRight size={20} style={{ marginLeft: '0.5rem' }} />
                    </div>
                  </div>
                </Link>
              </motion.div>

              {/* Loja */}
              <motion.div variants={itemVariants} whileHover='hover'>
                <Link to='/store-plans' style={{ textDecoration: 'none' }}>
                  <div
                    style={{
                      background: 'var(--card-bg)',
                      borderRadius: '20px',
                      padding: '3rem 2rem',
                      boxShadow: 'var(--shadow-lg)',
                      border: '2px solid transparent',
                      backgroundImage:
                        'linear-gradient(var(--card-bg), var(--card-bg)), linear-gradient(135deg, var(--primary), var(--secondary))',
                      backgroundOrigin: 'border-box',
                      backgroundClip: 'content-box, border-box',
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
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '1.5rem'
                      }}
                    >
                      <Store size={40} color='white' />
                    </div>

                    <h3
                      style={{
                        fontSize: '1.5rem',
                        fontWeight: '600',
                        color: 'var(--text-primary)',
                        marginBottom: '1rem'
                      }}
                    >
                      Loja/Produtor
                    </h3>

                    <p
                      style={{
                        color: 'var(--text-secondary)',
                        lineHeight: '1.6',
                        marginBottom: '2rem',
                        flex: 1
                      }}
                    >
                      Para produtores, lojas e empresas que vendem produtos agrícolas e mercadorias.
                    </p>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        color: 'var(--primary)',
                        fontWeight: '600',
                        fontSize: '1.1rem'
                      }}
                    >
                      Cadastrar-se
                      <ArrowRight size={20} style={{ marginLeft: '0.5rem' }} />
                    </div>
                  </div>
                </Link>
              </motion.div>

              {/* Produto */}
              <motion.div variants={itemVariants} whileHover='hover'>
                <Link to='/signup/product' style={{ textDecoration: 'none' }}>
                  <div
                    style={{
                      background: 'var(--card-bg)',
                      borderRadius: '20px',
                      padding: '3rem 2rem',
                      boxShadow: 'var(--shadow-lg)',
                      border: '2px solid transparent',
                      backgroundImage:
                        'linear-gradient(var(--card-bg), var(--card-bg)), linear-gradient(135deg, var(--primary), var(--secondary))',
                      backgroundOrigin: 'border-box',
                      backgroundClip: 'content-box, border-box',
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
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '1.5rem'
                      }}
                    >
                      <Package size={40} color='white' />
                    </div>

                    <h3
                      style={{
                        fontSize: '1.5rem',
                        fontWeight: '600',
                        color: 'var(--text-primary)',
                        marginBottom: '1rem'
                      }}
                    >
                      Produto
                    </h3>

                    <p
                      style={{
                        color: 'var(--text-secondary)',
                        lineHeight: '1.6',
                        marginBottom: '2rem',
                        flex: 1
                      }}
                    >
                      Para produtores que querem cadastrar e vender produtos agrícolas específicos.
                    </p>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        color: 'var(--primary)',
                        fontWeight: '600',
                        fontSize: '1.1rem'
                      }}
                    >
                      Cadastrar-se
                      <ArrowRight size={20} style={{ marginLeft: '0.5rem' }} />
                    </div>
                  </div>
                </Link>
              </motion.div>

              {/* Usuário Geral */}
              <motion.div variants={itemVariants} whileHover='hover'>
                <Link to='/signup/general' style={{ textDecoration: 'none' }}>
                  <div
                    style={{
                      background: 'var(--card-bg)',
                      borderRadius: '20px',
                      padding: '3rem 2rem',
                      boxShadow: 'var(--shadow-lg)',
                      border: '2px solid transparent',
                      backgroundImage:
                        'linear-gradient(var(--card-bg), var(--card-bg)), linear-gradient(135deg, var(--primary), var(--secondary))',
                      backgroundOrigin: 'border-box',
                      backgroundClip: 'content-box, border-box',
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
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '1.5rem'
                      }}
                    >
                      <User size={40} color='white' />
                    </div>

                    <h3
                      style={{
                        fontSize: '1.5rem',
                        fontWeight: '600',
                        color: 'var(--text-primary)',
                        marginBottom: '1rem'
                      }}
                    >
                      Usuário Geral
                    </h3>

                    <p
                      style={{
                        color: 'var(--text-secondary)',
                        lineHeight: '1.6',
                        marginBottom: '2rem',
                        flex: 1
                      }}
                    >
                      Para usuários que querem apenas navegar e usar funcionalidades básicas da plataforma.
                    </p>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        color: 'var(--primary)',
                        fontWeight: '600',
                        fontSize: '1.1rem'
                      }}
                    >
                      Cadastrar-se
                      <ArrowRight size={20} style={{ marginLeft: '0.5rem' }} />
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
