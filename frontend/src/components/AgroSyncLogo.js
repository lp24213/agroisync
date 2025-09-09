import React from 'react';

const AgroSyncLogo = ({ className = "", variant = "default", size = "medium" }) => {
  if (variant === "text") {
    return (
      <div className={`flex items-center space-x-3 ${className}`}>
        <AgroSyncIcon className={size === "small" ? "w-6 h-6" : size === "large" ? "w-10 h-10" : "w-8 h-8"} />
        <span className={`font-semibold text-gray-800 dark:text-gray-200 ${size === "small" ? "text-lg" : size === "large" ? "text-2xl" : "text-xl"}`}>
          Agroisync
        </span>
      </div>
    );
  }

  if (variant === "full") {
    return (
      <div className={`flex items-center space-x-4 ${className}`}>
        <AgroSyncIcon className={size === "small" ? "w-8 h-8" : size === "large" ? "w-12 h-12" : "w-10 h-10"} />
        <div className="flex flex-col">
          <span className={`font-semibold text-gray-800 dark:text-gray-200 ${size === "small" ? "text-xl" : size === "large" ? "text-3xl" : "text-2xl"}`}>
            Agroisync
          </span>
          <span className={`text-gray-600 dark:text-gray-400 ${size === "small" ? "text-xs" : size === "large" ? "text-sm" : "text-xs"} -mt-1`}>
            Agronegócio Inteligente
          </span>
        </div>
      </div>
    );
  }

  return <AgroSyncIcon className={className} />;
};

const AgroSyncIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Ícone de folha verde - baseado na logo da imagem */}
    <path
      d="M12 2C8 6 6 10 6 14C6 18 8 20 12 20C16 20 18 18 18 14C18 10 16 6 12 2Z"
      fill="#4A6737"
    />
    <path
      d="M12 4C10 7 9 10 9 13C9 16 10 18 12 18C14 18 15 16 15 13C15 10 14 7 12 4Z"
      fill="#5A7A47"
    />
    <path
      d="M12 6C11 8 10.5 10 10.5 12C10.5 14 11 15 12 15C13 15 13.5 14 13.5 12C13.5 10 13 8 12 6Z"
      fill="#6A8A57"
    />
  </svg>
);

export default AgroSyncLogo;