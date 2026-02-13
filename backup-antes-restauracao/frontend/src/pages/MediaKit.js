import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, Share2, Camera, Instagram, Facebook, Copy, 
  Sparkles, Star, Zap, Check, TrendingUp, Globe
} from 'lucide-react';
import AgroisyncLogo from '../components/AgroisyncLogo';

const MediaKit = () => {
  const [selectedTemplate, setSelectedTemplate] = useState('story-hero');
  const [downloading, setDownloading] = useState(false);

  const templates = [
    { 
      id: 'story-hero', 
      label: '🌟 Story Hero', 
      categoria: 'Instagram Story',
      aspecto: '9:16',
      descricao: 'Story impactante com logo Agroisync'
    },
    { 
      id: 'story-features', 
      label: '✨ Story Features', 
      categoria: 'Instagram Story',
      aspecto: '9:16',
      descricao: 'Lista de funcionalidades destacadas'
    },
    { 
      id: 'post-quadrado', 
      label: '📱 Post Quadrado', 
      categoria: 'Instagram Feed',
      aspecto: '1:1',
      descricao: 'Post para feed do Instagram'
    },
    { 
      id: 'post-promo', 
      label: '🎁 Post Promoção', 
      categoria: 'Instagram Feed',
      aspecto: '1:1',
      descricao: 'Destaque para plano gratuito'
    },
    { 
      id: 'banner-web', 
      label: '🌐 Banner Web', 
      categoria: 'Website/Facebook',
      aspecto: '16:9',
      descricao: 'Banner horizontal para web'
    },
    { 
      id: 'banner-minimal', 
      label: '🎯 Banner Minimalista', 
      categoria: 'Website/Facebook',
      aspecto: '16:9',
      descricao: 'Design clean e moderno'
    }
  ];

  const template = templates.find(t => t.id === selectedTemplate) || templates[0];

  const copyText = (text) => {
    navigator.clipboard.writeText(text);
    alert('✅ Texto copiado!');
  };

  const downloadImage = () => {
    setDownloading(true);
    setTimeout(() => {
      window.print();
      setDownloading(false);
    }, 300);
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0f9ff 0%, #f0fdf4 100%)',
      padding: '2rem 1rem'
    }}>
      {/* Header Premium Redesenhado */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          maxWidth: '1800px',
          margin: '0 auto 2rem',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a3a 50%, #1a2e1a 100%)',
          borderRadius: '28px',
          padding: '3rem 3.5rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3)',
          position: 'relative',
          overflow: 'hidden',
          border: '2px solid rgba(34, 197, 94, 0.2)'
        }}
      >
        {/* Decorative Gradient Orbs */}
        <div style={{
          position: 'absolute',
          top: '-50%',
          right: '-10%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(34, 197, 94, 0.2) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(80px)'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-30%',
          left: '-5%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(80px)'
        }} />
        
        <div style={{ position: 'relative', zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '3rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <div style={{ minWidth: '100px' }}>
                <img src='/agroisync-logo.svg' alt='Agroisync' className='h-20 w-auto' loading='eager' style={{ maxWidth: '100px' }} />
              </div>
              <div>
                <h1 style={{ 
                  fontSize: 'clamp(2rem, 4vw, 3.5rem)', 
                  fontWeight: '900',
                  background: 'linear-gradient(135deg, #fff 0%, #22c55e 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  marginBottom: '0.5rem',
                  letterSpacing: '-0.02em'
                }}>
                  MÍDIA KIT AGROISYNC
                </h1>
                <p style={{ 
                  fontSize: '1.2rem', 
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontWeight: '500'
                }}>
                  Material profissional para suas estratégias de marketing
                </p>
              </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={downloadImage}
              disabled={downloading}
              style={{
                padding: '1.1rem 2.5rem',
                background: downloading ? '#94a3b8' : 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '14px',
                fontWeight: '700',
                fontSize: '1.05rem',
                cursor: downloading ? 'wait' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                boxShadow: '0 10px 30px rgba(34, 197, 94, 0.4)'
              }}
            >
              <Download size={20} />
              {downloading ? 'Preparando...' : 'Baixar Imagem'}
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: 'Agroisync - Mídia Kit',
                    text: 'Material de divulgação da Agroisync',
                    url: window.location.href
                  });
                } else {
                  copyText(window.location.href);
                }
              }}
              style={{
                padding: '1.1rem 2.5rem',
                background: 'rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(10px)',
                color: '#fff',
                border: '2px solid rgba(34, 197, 94, 0.4)',
                borderRadius: '14px',
                fontWeight: '700',
                fontSize: '1.05rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                transition: 'all 0.3s ease'
              }}
            >
              <Share2 size={20} />
              Compartilhar
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Template Selector Grid */}
      <div style={{
        maxWidth: '1800px',
        margin: '0 auto 2.5rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '1.25rem'
      }}>
        {templates.map((t, i) => (
          <motion.button
            key={t.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ scale: 1.03, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedTemplate(t.id)}
            style={{
              padding: '1.75rem',
              borderRadius: '18px',
              border: selectedTemplate === t.id ? '3px solid #22c55e' : '2px solid #d1fae5',
              background: selectedTemplate === t.id 
                ? 'linear-gradient(135deg, #065f46 0%, #047857 100%)' 
                : '#fff',
              color: selectedTemplate === t.id ? '#fff' : '#333',
              cursor: 'pointer',
              textAlign: 'left',
              boxShadow: selectedTemplate === t.id 
                ? '0 20px 40px rgba(34, 197, 94, 0.3)' 
                : '0 4px 12px rgba(34, 197, 94, 0.08)',
              transition: 'all 0.3s ease'
            }}
          >
            <div style={{ fontSize: '1.25rem', fontWeight: '900', marginBottom: '0.75rem' }}>
              {t.label}
            </div>
            <div style={{ 
              fontSize: '0.9rem', 
              opacity: 0.8,
              fontWeight: '600',
              marginBottom: '0.5rem'
            }}>
              {t.categoria}
            </div>
            <div style={{ fontSize: '0.85rem', opacity: 0.7 }}>
              {t.descricao}
            </div>
          </motion.button>
        ))}
      </div>

      {/* Preview Area */}
      <div style={{
        maxWidth: '1800px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) 400px',
        gap: '2.5rem',
        alignItems: 'start'
      }}>
        {/* Canvas Principal */}
        <div>
          <div style={{
            background: '#fff',
            borderRadius: '24px',
            padding: '2.5rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ 
              marginBottom: '2rem',
              paddingBottom: '1.5rem',
              borderBottom: '3px solid #f0fdf4',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ fontSize: '1.4rem', fontWeight: '900', color: '#0f172a', marginBottom: '0.5rem' }}>
                  {template.label}
                </div>
                <div style={{ fontSize: '1rem', color: '#64748b', fontWeight: '600' }}>
                  Aspecto: {template.aspecto} • {template.categoria}
                </div>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={selectedTemplate}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                id="media-export"
                style={{
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 30px 60px rgba(0, 0, 0, 0.2)',
                  margin: '0 auto'
                }}
              >
                {/* STORY HERO COM LOGO */}
                {selectedTemplate === 'story-hero' && (
                  <div style={{
                    width: '540px',
                    height: '960px',
                    margin: '0 auto',
                    position: 'relative',
                    backgroundImage: 'url(https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1080&h=1920&fit=crop&q=90)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}>
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.5) 0%, rgba(34, 82, 51, 0.95) 40%, rgba(15, 23, 42, 0.98) 100%)'
                    }} />
                    
                    <div style={{
                      position: 'relative',
                      zIndex: 10,
                      height: '100%',
                      padding: '3.5rem 2.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}>
                      {/* Top Badge */}
                      <div style={{ textAlign: 'center' }}>
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.2, type: 'spring' }}
                          style={{
                            display: 'inline-block',
                            background: 'rgba(34, 197, 94, 0.25)',
                            backdropFilter: 'blur(20px)',
                            border: '2px solid rgba(34, 197, 94, 0.5)',
                            borderRadius: '50px',
                            padding: '0.9rem 2.2rem',
                            marginBottom: '2rem'
                          }}
                        >
                          <span style={{ 
                            fontSize: '1.2rem', 
                            fontWeight: '900', 
                            color: '#22c55e',
                            textTransform: 'uppercase',
                            letterSpacing: '0.15em'
                          }}>
                            🚀 Plataforma Completa
                          </span>
                        </motion.div>
                      </div>

                      {/* Middle - Logo e Título */}
                      <div style={{ textAlign: 'center', marginTop: '-3rem' }}>
                        <motion.div
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.3, type: 'spring', bounce: 0.4 }}
                          style={{ marginBottom: '2rem', filter: 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.4))' }}
                        >
                          <img src='/agroisync-logo.svg' alt='Agroisync' style={{ height: '120px', width: 'auto', margin: '0 auto' }} />
                        </motion.div>
                        
                        <motion.h1
                          initial={{ y: 30, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.5 }}
                          style={{
                            fontSize: '4.5rem',
                            fontWeight: '900',
                            color: '#fff',
                            marginBottom: '1rem',
                            lineHeight: '1',
                            letterSpacing: '-0.03em',
                            textShadow: '0 4px 16px rgba(0, 0, 0, 0.4)'
                          }}
                        >
                          AGROISYNC
                        </motion.h1>
                        
                        <motion.div
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.6 }}
                          style={{
                            fontSize: '2rem',
                            fontWeight: '800',
                            background: 'linear-gradient(135deg, #22c55e 0%, #10b981 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            marginBottom: '2.5rem',
                            letterSpacing: '0.05em'
                          }}
                        >
                          O Futuro do Agronegócio
                        </motion.div>

                        {/* Features Grid */}
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          gap: '1.2rem',
                          marginTop: '2rem'
                        }}>
                          {[
                            { icon: '🌤️', text: 'Clima' },
                            { icon: '🛒', text: 'Produtos' },
                            { icon: '🚚', text: 'Fretes' },
                            { icon: '🤖', text: 'IA' }
                          ].map((item, i) => (
                            <motion.div
                              key={i}
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ delay: 0.7 + i * 0.1, type: 'spring' }}
                              style={{
                                background: 'rgba(255, 255, 255, 0.15)',
                                backdropFilter: 'blur(25px)',
                                borderRadius: '18px',
                                padding: '1.5rem',
                                border: '2px solid rgba(255, 255, 255, 0.3)',
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)'
                              }}
                            >
                              <div style={{ fontSize: '2.8rem', marginBottom: '0.5rem' }}>{item.icon}</div>
                              <div style={{ 
                                fontSize: '1.4rem', 
                                fontWeight: '900', 
                                color: '#fff',
                                textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
                              }}>
                                {item.text}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Bottom - CTA */}
                      <div style={{ textAlign: 'center' }}>
                        <motion.div
                          initial={{ y: 30, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 1.1 }}
                          style={{
                            background: 'rgba(255, 255, 255, 0.15)',
                            backdropFilter: 'blur(30px)',
                            borderRadius: '30px',
                            padding: '2rem 2.5rem',
                            border: '3px solid rgba(34, 197, 94, 0.6)',
                            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
                          }}
                        >
                          <div style={{ 
                            fontSize: '2.8rem', 
                            fontWeight: '900', 
                            color: '#fff', 
                            marginBottom: '0.75rem',
                            textShadow: '0 4px 12px rgba(0, 0, 0, 0.4)'
                          }}>
                            www.agroisync.com
                          </div>
                          <div style={{ 
                            fontSize: '1.5rem', 
                            color: '#22c55e', 
                            fontWeight: '800',
                            textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
                          }}>
                            💰 Comece Grátis • 🤖 IA Inclusa
                          </div>
                        </motion.div>

                        <div style={{ 
                          marginTop: '1.5rem',
                          fontSize: '1.3rem',
                          fontWeight: '700',
                          color: '#22c55e'
                        }}>
                          📱 Siga @agroisync
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STORY FEATURES */}
                {selectedTemplate === 'story-features' && (
                  <div style={{
                    width: '540px',
                    height: '960px',
                    margin: '0 auto',
                    background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #065f46 100%)',
                    padding: '3.5rem 2.5rem',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    {/* Decorative circles */}
                    <div style={{
                      position: 'absolute',
                      top: '10%',
                      right: '-20%',
                      width: '400px',
                      height: '400px',
                      background: 'radial-gradient(circle, rgba(34, 197, 94, 0.2) 0%, transparent 70%)',
                      borderRadius: '50%',
                      filter: 'blur(80px)'
                    }} />
                    <div style={{
                      position: 'absolute',
                      bottom: '20%',
                      left: '-20%',
                      width: '400px',
                      height: '400px',
                      background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
                      borderRadius: '50%',
                      filter: 'blur(80px)'
                    }} />

                    <div style={{ position: 'relative', zIndex: 10 }}>
                      {/* Header com Logo */}
                      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <motion.div
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.2, type: 'spring' }}
                          style={{ marginBottom: '1.5rem' }}
                        >
                          <img src='/agroisync-logo.svg' alt='Agroisync' style={{ height: '100px', width: 'auto', margin: '0 auto' }} />
                        </motion.div>
                        <h1 style={{
                          fontSize: '3.5rem',
                          fontWeight: '900',
                          color: '#fff',
                          marginBottom: '1rem',
                          letterSpacing: '-0.02em'
                        }}>
                          AGROISYNC
                        </h1>
                        <div style={{
                          fontSize: '1.5rem',
                          color: '#22c55e',
                          fontWeight: '800',
                          textTransform: 'uppercase',
                          letterSpacing: '0.1em'
                        }}>
                          Tudo em Uma Plataforma
                        </div>
                      </div>

                      {/* Features List */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
                        {[
                          { icon: '🌤️', title: 'Clima em Tempo Real', desc: 'Previsão de 7 dias + alertas' },
                          { icon: '🛒', title: 'Marketplace Completo', desc: 'Grãos, máquinas, insumos' },
                          { icon: '🚚', title: 'Fretes Inteligentes', desc: 'GPS + IA que otimiza' },
                          { icon: '🏪', title: 'Crie sua Loja', desc: 'Sem comissão' },
                          { icon: '🔑', title: 'API Completa', desc: 'Integração total' },
                          { icon: '🤖', title: 'IA Avançada', desc: 'Em todos os processos' }
                        ].map((feat, i) => (
                          <motion.div
                            key={i}
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.2 + i * 0.08 }}
                            style={{
                              background: 'rgba(255, 255, 255, 0.08)',
                              backdropFilter: 'blur(20px)',
                              borderRadius: '20px',
                              padding: '1.5rem 1.75rem',
                              border: '2px solid rgba(255, 255, 255, 0.15)',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '1.5rem',
                              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
                            }}
                          >
                            <div style={{ fontSize: '2.8rem', flexShrink: 0 }}>{feat.icon}</div>
                            <div style={{ flex: 1 }}>
                              <div style={{ 
                                fontSize: '1.4rem', 
                                fontWeight: '900', 
                                color: '#fff',
                                marginBottom: '0.25rem'
                              }}>
                                {feat.title}
                              </div>
                              <div style={{ 
                                fontSize: '1rem', 
                                color: 'rgba(255, 255, 255, 0.8)',
                                fontWeight: '600'
                              }}>
                                {feat.desc}
                              </div>
                            </div>
                            <Check size={28} color="#22c55e" strokeWidth={3} />
                          </motion.div>
                        ))}
                      </div>

                      {/* CTA Bottom */}
                      <div style={{
                        background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                        borderRadius: '25px',
                        padding: '2rem',
                        textAlign: 'center',
                        boxShadow: '0 20px 40px rgba(34, 197, 94, 0.4)'
                      }}>
                        <div style={{ fontSize: '2.2rem', fontWeight: '900', color: '#0f172a', marginBottom: '0.5rem' }}>
                          agroisync.com
                        </div>
                        <div style={{ fontSize: '1.3rem', fontWeight: '800', color: 'rgba(15, 23, 42, 0.8)' }}>
                          📱 @agroisync
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* POST QUADRADO */}
                {selectedTemplate === 'post-quadrado' && (
                  <div style={{
                    width: '600px',
                    height: '600px',
                    margin: '0 auto',
                    position: 'relative',
                    backgroundImage: 'url(https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1080&h=1080&fit=crop&q=90)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}>
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.92) 0%, rgba(6, 95, 70, 0.88) 100%)'
                    }} />
                    
                    <div style={{
                      position: 'relative',
                      zIndex: 10,
                      height: '100%',
                      padding: '3rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      textAlign: 'center'
                    }}>
                      <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, type: 'spring' }}
                        style={{ marginBottom: '2rem' }}
                      >
                        <img src='/agroisync-logo.svg' alt='Agroisync' style={{ height: '140px', width: 'auto', margin: '0 auto' }} />
                      </motion.div>
                      
                      <h1 style={{
                        fontSize: '4rem',
                        fontWeight: '900',
                        color: '#fff',
                        marginBottom: '1.5rem',
                        lineHeight: '1',
                        textShadow: '0 4px 12px rgba(0, 0, 0, 0.4)'
                      }}>
                        AGROISYNC
                      </h1>
                      
                      <div style={{
                        fontSize: '2rem',
                        fontWeight: '800',
                        color: '#22c55e',
                        marginBottom: '3rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em'
                      }}>
                        Agro + Tecnologia
                      </div>

                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '1rem',
                        width: '100%',
                        marginBottom: '3rem'
                      }}>
                        {['🌤️ Clima', '🛒 Mercado', '🚚 Fretes', '🤖 IA'].map((item, i) => (
                          <div
                            key={i}
                            style={{
                              background: 'rgba(255, 255, 255, 0.12)',
                              backdropFilter: 'blur(15px)',
                              borderRadius: '16px',
                              padding: '1.25rem 1rem',
                              border: '2px solid rgba(255, 255, 255, 0.2)',
                              fontSize: '1.5rem',
                              fontWeight: '900',
                              color: '#fff'
                            }}
                          >
                            {item}
                          </div>
                        ))}
                      </div>

                      <div style={{
                        background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                        borderRadius: '20px',
                        padding: '1.75rem 3rem',
                        boxShadow: '0 15px 40px rgba(34, 197, 94, 0.4)'
                      }}>
                        <div style={{ fontSize: '2.2rem', fontWeight: '900', color: '#0f172a' }}>
                          agroisync.com
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* POST PROMOÇÃO */}
                {selectedTemplate === 'post-promo' && (
                  <div style={{
                    width: '600px',
                    height: '600px',
                    margin: '0 auto',
                    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #065f46 100%)',
                    padding: '3rem',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    {/* Geometric patterns */}
                    <div style={{
                      position: 'absolute',
                      top: '-10%',
                      right: '-10%',
                      width: '300px',
                      height: '300px',
                      background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, transparent 70%)',
                      borderRadius: '50%',
                      filter: 'blur(60px)'
                    }} />
                    <div style={{
                      position: 'absolute',
                      bottom: '-10%',
                      left: '-10%',
                      width: '300px',
                      height: '300px',
                      background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, transparent 70%)',
                      borderRadius: '50%',
                      filter: 'blur(60px)'
                    }} />

                    <div style={{ position: 'relative', zIndex: 10, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      {/* Top */}
                      <div style={{ textAlign: 'center' }}>
                        <div style={{
                          display: 'inline-block',
                          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                          borderRadius: '50px',
                          padding: '0.9rem 2.2rem',
                          marginBottom: '2rem',
                          boxShadow: '0 10px 30px rgba(245, 158, 11, 0.4)'
                        }}>
                          <span style={{ fontSize: '1.3rem', fontWeight: '900', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                            🎁 GRÁTIS
                          </span>
                        </div>
                      </div>

                      {/* Middle */}
                      <div style={{ textAlign: 'center' }}>
                        <motion.div
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.2, type: 'spring' }}
                          style={{ marginBottom: '1.5rem' }}
                        >
                          <img src='/agroisync-logo.svg' alt='Agroisync' style={{ height: '120px', width: 'auto', margin: '0 auto' }} />
                        </motion.div>
                        <h1 style={{
                          fontSize: '4rem',
                          fontWeight: '900',
                          color: '#fff',
                          marginBottom: '1.5rem',
                          lineHeight: '1'
                        }}>
                          AGROISYNC
                        </h1>
                        <div style={{
                          fontSize: '2.3rem',
                          fontWeight: '900',
                          background: 'linear-gradient(135deg, #22c55e 0%, #10b981 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                          marginBottom: '2.5rem',
                          lineHeight: '1.2'
                        }}>
                          Plano Gratuito<br/>Disponível!
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
                          {[
                            '✅ Clima em Tempo Real',
                            '✅ Marketplace Completo',
                            '✅ Fretes Inteligentes',
                            '✅ IA que Ajuda',
                            '💰 0% de Comissão'
                          ].map((item, i) => (
                            <div
                              key={i}
                              style={{
                                background: 'rgba(255, 255, 255, 0.08)',
                                backdropFilter: 'blur(15px)',
                                borderRadius: '15px',
                                padding: '1rem 1.5rem',
                                border: '2px solid rgba(255, 255, 255, 0.15)',
                                fontSize: '1.3rem',
                                fontWeight: '800',
                                color: '#fff',
                                textAlign: 'left'
                              }}
                            >
                              {item}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Bottom */}
                      <div style={{ textAlign: 'center' }}>
                        <div style={{
                          background: 'linear-gradient(135deg, #22c55e 0%, #10b981 100%)',
                          borderRadius: '20px',
                          padding: '1.75rem',
                          marginBottom: '1rem',
                          boxShadow: '0 15px 40px rgba(34, 197, 94, 0.5)'
                        }}>
                          <div style={{ fontSize: '2.3rem', fontWeight: '900', color: '#0f172a', marginBottom: '0.25rem' }}>
                            www.agroisync.com
                          </div>
                          <div style={{ fontSize: '1.2rem', fontWeight: '800', color: 'rgba(15, 23, 42, 0.7)' }}>
                            Cadastre-se Grátis
                          </div>
                        </div>
                        <div style={{ fontSize: '1.2rem', fontWeight: '700', color: 'rgba(255, 255, 255, 0.8)' }}>
                          📱 @agroisync
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* BANNER WEB */}
                {selectedTemplate === 'banner-web' && (
                  <div style={{
                    width: '100%',
                    maxWidth: '960px',
                    aspectRatio: '16/9',
                    margin: '0 auto',
                    position: 'relative',
                    backgroundImage: 'url(https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1920&h=1080&fit=crop&q=90)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: '0'
                  }}>
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(90deg, rgba(15, 23, 42, 0.95) 0%, rgba(6, 95, 70, 0.75) 100%)'
                    }} />
                    
                    <div style={{
                      position: 'relative',
                      zIndex: 10,
                      height: '100%',
                      padding: '3rem 4rem',
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '3rem',
                      alignItems: 'center'
                    }}>
                      {/* Esquerda */}
                      <div>
                        <motion.div
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.2, type: 'spring' }}
                          style={{ marginBottom: '2rem' }}
                        >
                          <img src='/agroisync-logo.svg' alt='Agroisync' style={{ height: '110px', width: 'auto' }} />
                        </motion.div>
                        <h1 style={{
                          fontSize: '4rem',
                          fontWeight: '900',
                          color: '#fff',
                          marginBottom: '1rem',
                          lineHeight: '1',
                          textShadow: '0 4px 12px rgba(0, 0, 0, 0.4)'
                        }}>
                          AGROISYNC
                        </h1>
                        <div style={{ fontSize: '2rem', fontWeight: '800', color: '#22c55e', marginBottom: '2.5rem' }}>
                          A Revolução do Agronegócio
                        </div>
                        <div style={{
                          display: 'inline-block',
                          background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                          borderRadius: '15px',
                          padding: '1.3rem 2.8rem',
                          fontSize: '1.8rem',
                          fontWeight: '900',
                          color: '#0f172a',
                          boxShadow: '0 15px 35px rgba(34, 197, 94, 0.4)'
                        }}>
                          💰 Comece Grátis
                        </div>
                      </div>

                      {/* Direita */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.3rem' }}>
                        {[
                          { icon: '🌤️', text: 'Clima Tempo Real' },
                          { icon: '🛒', text: 'Marketplace' },
                          { icon: '🚚', text: 'Fretes GPS + IA' },
                          { icon: '🔑', text: 'API Completa' }
                        ].map((item, i) => (
                          <div
                            key={i}
                            style={{
                              background: 'rgba(255, 255, 255, 0.1)',
                              backdropFilter: 'blur(20px)',
                              borderRadius: '16px',
                              padding: '1.4rem 2rem',
                              border: '2px solid rgba(255, 255, 255, 0.2)',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '1.5rem',
                              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)'
                            }}
                          >
                            <span style={{ fontSize: '2.5rem' }}>{item.icon}</span>
                            <span style={{ fontSize: '1.6rem', fontWeight: '900', color: '#fff', flex: 1 }}>
                              {item.text}
                            </span>
                            <Check size={32} color="#22c55e" strokeWidth={3} />
                          </div>
                        ))}
                        
                        <div style={{
                          background: 'rgba(255, 255, 255, 0.95)',
                          borderRadius: '16px',
                          padding: '2rem',
                          marginTop: '1rem',
                          textAlign: 'center',
                          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
                        }}>
                          <div style={{ fontSize: '2.2rem', fontWeight: '900', color: '#065f46' }}>
                            www.agroisync.com
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* BANNER MINIMALISTA */}
                {selectedTemplate === 'banner-minimal' && (
                  <div style={{
                    width: '100%',
                    maxWidth: '960px',
                    aspectRatio: '16/9',
                    margin: '0 auto',
                    background: 'linear-gradient(135deg, #f0fdf4 0%, #f0f9ff 100%)',
                    padding: '3rem 4rem',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    {/* Pattern Background */}
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      opacity: 0.03,
                      backgroundImage: 'repeating-linear-gradient(45deg, #065f46 0px, #065f46 2px, transparent 2px, transparent 10px)',
                      zIndex: 1
                    }} />

                    {/* Circles */}
                    <div style={{
                      position: 'absolute',
                      top: '-15%',
                      right: '5%',
                      width: '350px',
                      height: '350px',
                      background: 'linear-gradient(135deg, #22c55e 0%, #10b981 100%)',
                      borderRadius: '50%',
                      opacity: 0.12,
                      zIndex: 1
                    }} />
                    <div style={{
                      position: 'absolute',
                      bottom: '-20%',
                      left: '-5%',
                      width: '400px',
                      height: '400px',
                      background: 'linear-gradient(135deg, #065f46 0%, #022c22 100%)',
                      borderRadius: '50%',
                      opacity: 0.08,
                      zIndex: 1
                    }} />

                    <div style={{ position: 'relative', zIndex: 10, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem', marginBottom: '2.5rem' }}>
                        <motion.div
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.2, type: 'spring' }}
                        >
                          <img src='/agroisync-logo.svg' alt='Agroisync' style={{ height: '120px', width: 'auto' }} />
                        </motion.div>
                        <div>
                          <h1 style={{
                            fontSize: '4.5rem',
                            fontWeight: '900',
                            color: '#065f46',
                            marginBottom: '0.5rem',
                            lineHeight: '0.9',
                            letterSpacing: '-0.03em'
                          }}>
                            AGROISYNC
                          </h1>
                          <div style={{ fontSize: '1.8rem', fontWeight: '700', color: '#64748b' }}>
                            Tecnologia para o Campo
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
                        {[
                          { icon: '🌤️', label: 'Clima' },
                          { icon: '🛒', label: 'Mercado' },
                          { icon: '🚚', label: 'Fretes' },
                          { icon: '🤖', label: 'IA' }
                        ].map((item, i) => (
                          <div
                            key={i}
                            style={{
                              background: '#f8fafc',
                              borderRadius: '16px',
                              padding: '1.75rem 1.2rem',
                              textAlign: 'center',
                              border: '3px solid #d1fae5',
                              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
                            }}
                          >
                            <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>{item.icon}</div>
                            <div style={{ fontSize: '1.3rem', fontWeight: '800', color: '#065f46' }}>
                              {item.label}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                          <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#065f46', marginBottom: '0.75rem' }}>
                            🚀 Comece Agora • 💰 Plano Gratuito
                          </div>
                          <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#22c55e' }}>
                            www.agroisync.com
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* Instruções */}
          <div style={{
            background: '#fff',
            borderRadius: '24px',
            padding: '2rem',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
            border: '2px solid #d1fae5'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <Camera size={28} style={{ color: '#065f46' }} />
              <h3 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#0f172a' }}>
                Como Usar
              </h3>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {[
                'Escolha o template desejado',
                'Clique em "Baixar Imagem"',
                'Ou clique com botão direito > Salvar',
                'Poste nas redes sociais!'
              ].map((texto, i) => (
                <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'start' }}>
                  <div style={{
                    minWidth: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #065f46 0%, #22c55e 100%)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '900',
                    fontSize: '1rem'
                  }}>
                    {i + 1}
                  </div>
                  <div style={{ 
                    fontSize: '1rem', 
                    lineHeight: '1.6', 
                    color: '#475569',
                    fontWeight: '600',
                    paddingTop: '0.35rem'
                  }}>
                    {texto}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Redes Sociais */}
          <div style={{
            background: 'linear-gradient(135deg, #065f46 0%, #022c22 100%)',
            borderRadius: '24px',
            padding: '2rem',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
            color: '#fff'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <Share2 size={28} />
              <h3 style={{ fontSize: '1.5rem', fontWeight: '900' }}>
                Redes Sociais
              </h3>
            </div>
            
            {[
              { rede: 'Instagram', handle: '@agroisync', icon: Instagram, cor: '#E1306C' },
              { rede: 'Facebook', handle: '/agroisync', icon: Facebook, cor: '#1877F2' }
            ].map((social, i) => {
              const Icon = social.icon;
              return (
                <div
                  key={i}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(15px)',
                    borderRadius: '14px',
                    padding: '1.3rem',
                    marginBottom: '1rem',
                    border: '2px solid rgba(255, 255, 255, 0.15)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <Icon size={24} color={social.cor} />
                    <span style={{ fontWeight: '800', fontSize: '1.15rem' }}>{social.rede}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <code style={{ 
                      flex: 1,
                      background: 'rgba(0, 0, 0, 0.2)',
                      padding: '0.5rem 1rem',
                      borderRadius: '8px',
                      color: '#22c55e',
                      fontWeight: '700',
                      fontSize: '1rem'
                    }}>
                      {social.handle}
                    </code>
                    <button
                      onClick={() => copyText(social.handle)}
                      style={{
                        background: 'rgba(255, 255, 255, 0.2)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: '8px',
                        padding: '0.5rem',
                        cursor: 'pointer',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <Copy size={18} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Stats */}
          <div style={{
            background: '#fff',
            borderRadius: '24px',
            padding: '2rem',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
            border: '2px solid #d1fae5'
          }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#0f172a', marginBottom: '1.5rem' }}>
              📊 Plataforma
            </h3>
            
            {[
              { label: 'Funcionalidades', value: '8+', icon: '✨', cor: '#22c55e' },
              { label: 'Com IA', value: '✓', icon: '🤖', cor: '#3b82f6' },
              { label: 'Comissão', value: '0%', icon: '💰', cor: '#f59e0b' }
            ].map((stat, i) => (
              <div
                key={i}
                style={{
                  background: `linear-gradient(135deg, ${stat.cor}15 0%, ${stat.cor}05 100%)`,
                  borderRadius: '14px',
                  padding: '1.3rem',
                  marginBottom: '1rem',
                  border: `2px solid ${stat.cor}30`,
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '2.5rem', fontWeight: '900', color: stat.cor, marginBottom: '0.25rem' }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '1rem', fontWeight: '700', color: '#475569' }}>
                  {stat.icon} {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        maxWidth: '1800px',
        margin: '2.5rem auto 0',
        textAlign: 'center',
        padding: '2rem',
        borderTop: '3px solid #d1fae5'
      }}>
        <div style={{ fontSize: '1.1rem', color: '#064e3b', fontWeight: '700', marginBottom: '0.5rem' }}>
          🌾 Agroisync © 2025 • Mídia Kit Oficial
        </div>
        <div style={{ fontSize: '1rem', color: '#64748b', fontWeight: '500' }}>
          Desenvolvido com 💚 para o Agronegócio Moderno
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body { 
            background: white !important; 
            margin: 0 !important;
            padding: 0 !important;
          }
          
          * {
            box-shadow: none !important;
          }
          
          #media-export {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            max-width: none !important;
            margin: 0 !important;
            border-radius: 0 !important;
          }
          
          /* Hide everything except media export */
          body > div > div:not(:has(#media-export)),
          button,
          h3:not(#media-export h3),
          .sidebar {
            display: none !important;
          }
        }
        
        @page {
          margin: 0;
          size: auto;
        }
      `}</style>
    </div>
  );
};

export default MediaKit;
