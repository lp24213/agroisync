import React from 'react';

const IntroVideo: React.FC = () => (
  <div className="w-full aspect-video bg-black flex items-center justify-center rounded-xl overflow-hidden">
    <video controls autoPlay loop muted className="w-full h-full object-cover">
      <source src="/intro.mp4" type="video/mp4" />
      Seu navegador não suporta vídeo HTML5.
    </video>
  </div>
);

export default IntroVideo; 