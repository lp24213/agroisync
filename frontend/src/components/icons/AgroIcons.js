import React from 'react';

// Ícone de grãos/cereais
export const GrainsIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 2C8.5 2 6 4.5 6 8c0 1.5.5 2.8 1.3 3.9L12 20l4.7-8.1C17.5 10.8 18 9.5 18 8c0-3.5-2.5-6-6-6z"
      fill="currentColor"
      opacity="0.8"
    />
    <circle cx="9" cy="7" r="1.5" fill="currentColor" />
    <circle cx="15" cy="7" r="1.5" fill="currentColor" />
    <circle cx="12" cy="5" r="1" fill="currentColor" />
  </svg>
);

// Ícone de clima
export const WeatherIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 2C8.5 2 6 4.5 6 8c0 1.5.5 2.8 1.3 3.9L12 20l4.7-8.1C17.5 10.8 18 9.5 18 8c0-3.5-2.5-6-6-6z"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M8 12h8M8 16h6M8 8h4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="12" cy="6" r="2" fill="currentColor" />
  </svg>
);

// Ícone de notícias
export const NewsIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="4" width="18" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
    <path d="M7 8h10M7 12h10M7 16h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <circle cx="17" cy="8" r="1" fill="currentColor" />
  </svg>
);

// Ícone de validação/verificação
export const ValidationIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M9 12l2 2 4-4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
    <path
      d="M12 2a10 10 0 0 1 10 10"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

// Ícone de mercado/bolsa
export const MarketIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="9" cy="19" r="1" fill="currentColor" />
    <circle cx="20" cy="19" r="1" fill="currentColor" />
  </svg>
);

// Ícone de agricultura
export const AgricultureIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 2L2 7l10 5 10-5-10-5z"
      fill="currentColor"
      opacity="0.8"
    />
    <path
      d="M2 17l10 5 10-5M2 12l10 5 10-5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="7" r="1" fill="currentColor" />
    <circle cx="7" cy="12" r="1" fill="currentColor" />
    <circle cx="17" cy="12" r="1" fill="currentColor" />
  </svg>
);

// Ícone de tecnologia/IA
export const TechIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" fill="none" stroke="currentColor" strokeWidth="2" />
    <line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" strokeWidth="2" />
    <line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" strokeWidth="2" />
    <circle cx="8" cy="8" r="1" fill="currentColor" />
    <circle cx="12" cy="8" r="1" fill="currentColor" />
    <circle cx="16" cy="8" r="1" fill="currentColor" />
    <path d="M6 12h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// Ícone de conexão/rede
export const NetworkIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="3" fill="currentColor" />
    <circle cx="12" cy="3" r="2" fill="currentColor" />
    <circle cx="12" cy="21" r="2" fill="currentColor" />
    <circle cx="3" cy="12" r="2" fill="currentColor" />
    <circle cx="21" cy="12" r="2" fill="currentColor" />
    <path d="M12 5v4M12 15v4M5 12h4M15 12h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// Ícone de segurança
export const SecurityIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9 12l2 2 4-4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Ícone de análise/dados
export const AnalyticsIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M3 3v18h18"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="18" cy="8" r="2" fill="currentColor" />
    <circle cx="13" cy="13" r="2" fill="currentColor" />
    <circle cx="10" cy="10" r="2" fill="currentColor" />
    <circle cx="7" cy="14" r="2" fill="currentColor" />
  </svg>
);

// Ícone de sustentabilidade
export const SustainabilityIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 2L2 7l10 5 10-5-10-5z"
      fill="currentColor"
      opacity="0.6"
    />
    <path
      d="M2 17l10 5 10-5M2 12l10 5 10-5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="7" r="1" fill="currentColor" />
    <path
      d="M8 10l4 4 4-4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
