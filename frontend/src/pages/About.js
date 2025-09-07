import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-primary via-dark-secondary to-dark-tertiary p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Sobre o AgroSync</h1>
        <p className="text-gray-400 text-lg leading-relaxed">
          O AgroSync é a plataforma de intermediação agrícola mais futurista do mundo, 
          conectando produtores, compradores e transportadores através de tecnologia blockchain e IA.
        </p>
      </div>
    </div>
  );
};

export default About;
