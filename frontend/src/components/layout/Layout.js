import React from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import Chatbot from '../Chatbot';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background futurista */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-neutral-900 to-black"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,212,255,0.1),transparent_50%)]"></div>
      
      {/* Grid futurista */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(0,212,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,212,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>
      </div>
      
      {/* Conteúdo */}
      <div className="relative z-10">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <Chatbot />
      </div>
    </div>
  );
};

export default Layout;
