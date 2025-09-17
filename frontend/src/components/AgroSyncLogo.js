import React from 'react';

const AgroSyncLogo = ({ className = "", variant = "default", size = "medium" }) => {
  const getLogoSize = () => {
    switch (size) {
      case "small": return "w-6 h-6";
      case "large": return "w-10 h-10";
      default: return "w-8 h-8";
    }
  };

  const getTextSize = () => {
    switch (size) {
      case "small": return "text-lg";
      case "large": return "text-2xl";
      default: return "text-xl";
    }
  };

  if (variant === "text") {
    return (
      <div className={`flex items-center space-x-3 ${className}`}>
        <img 
          src="/assets/LOGOTIPO-EM-BRANCO.png" 
          alt="AGROISYNC" 
          className={`${getLogoSize()} object-contain`}
          onError={(e) => {
            console.log('Erro ao carregar logo:', e.target.src);
            e.target.style.display = 'none';
          }}
        />
        <span className={`font-semibold text-gray-800 dark:text-gray-200 ${getTextSize()}`}>
          AGROISYNC
        </span>
      </div>
    );
  }

  if (variant === "full") {
    return (
      <div className={`flex items-center space-x-4 ${className}`}>
        <img 
          src="/assets/LOGOTIPO-EM-BRANCO.png" 
          alt="AGROISYNC" 
          className={`${size === "small" ? "w-8 h-8" : size === "large" ? "w-12 h-12" : "w-10 h-10"} object-contain`}
        />
        <div className="flex flex-col">
          <span className={`font-semibold text-gray-800 dark:text-gray-200 ${size === "small" ? "text-xl" : size === "large" ? "text-3xl" : "text-2xl"}`}>
            AGROISYNC
          </span>
          <span className={`text-gray-600 dark:text-gray-400 ${size === "small" ? "text-xs" : size === "large" ? "text-sm" : "text-xs"} -mt-1`}>
            Agronegócio Inteligente
          </span>
        </div>
      </div>
    );
  }

  return (
    <img 
      src="/assets/LOGOTIPO-EM-BRANCO.png" 
      alt="AGROISYNC" 
      className={`${getLogoSize()} object-contain ${className}`}
    />
  );
};

export default AgroSyncLogo;