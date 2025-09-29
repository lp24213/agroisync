import React from 'react';

// Ícone de Soja
export const SoyIcon = ({ className = 'w-6 h-6', color = 'currentColor' }) => (
  <svg className={className} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <path
      d='M12 2C8 2 5 5 5 9C5 11 6 13 7.5 14.5C8.5 15.5 10 16 11.5 16.5C11.7 16.6 11.9 16.7 12 16.8C12.1 16.7 12.3 16.6 12.5 16.5C14 16 15.5 15.5 16.5 14.5C18 13 19 11 19 9C19 5 16 2 12 2Z'
      fill={color}
      stroke={color}
      strokeWidth='1.5'
    />
    <path d='M9 7C9.5 7 10 7.5 10 8C10 8.5 9.5 9 9 9C8.5 9 8 8.5 8 8C8 7.5 8.5 7 9 7Z' fill='white' />
    <path d='M15 7C15.5 7 16 7.5 16 8C16 8.5 15.5 9 15 9C14.5 9 14 8.5 14 8C14 7.5 14.5 7 15 7Z' fill='white' />
    <path
      d='M12 10C12.5 10 13 10.5 13 11C13 11.5 12.5 12 12 12C11.5 12 11 11.5 11 11C11 10.5 11.5 10 12 10Z'
      fill='white'
    />
    <path
      d='M8 18C9 18 10 18.5 11 19C11.3 19.2 11.7 19.2 12 19.2C12.3 19.2 12.7 19.2 13 19C14 18.5 15 18 16 18'
      stroke={color}
      strokeWidth='1.5'
      strokeLinecap='round'
    />
    <path
      d='M6 20C7.5 20 9 20.5 10.5 21C11.2 21.3 12.8 21.3 13.5 21C15 20.5 16.5 20 18 20'
      stroke={color}
      strokeWidth='1.5'
      strokeLinecap='round'
    />
  </svg>
);

// Ícone de Milho
export const CornIcon = ({ className = 'w-6 h-6', color = 'currentColor' }) => (
  <svg className={className} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <path
      d='M12 3C10 3 8.5 4.5 8.5 6.5V17.5C8.5 19.5 10 21 12 21C14 21 15.5 19.5 15.5 17.5V6.5C15.5 4.5 14 3 12 3Z'
      fill={color}
      stroke={color}
      strokeWidth='1.5'
    />
    <path d='M9.5 7H14.5' stroke='white' strokeWidth='1' strokeLinecap='round' />
    <path d='M9.5 9H14.5' stroke='white' strokeWidth='1' strokeLinecap='round' />
    <path d='M9.5 11H14.5' stroke='white' strokeWidth='1' strokeLinecap='round' />
    <path d='M9.5 13H14.5' stroke='white' strokeWidth='1' strokeLinecap='round' />
    <path d='M9.5 15H14.5' stroke='white' strokeWidth='1' strokeLinecap='round' />
    <path d='M9.5 17H14.5' stroke='white' strokeWidth='1' strokeLinecap='round' />
    <circle cx='10.5' cy='7.5' r='0.5' fill='white' />
    <circle cx='13.5' cy='7.5' r='0.5' fill='white' />
    <circle cx='10.5' cy='9.5' r='0.5' fill='white' />
    <circle cx='13.5' cy='9.5' r='0.5' fill='white' />
    <circle cx='10.5' cy='11.5' r='0.5' fill='white' />
    <circle cx='13.5' cy='11.5' r='0.5' fill='white' />
    <circle cx='10.5' cy='13.5' r='0.5' fill='white' />
    <circle cx='13.5' cy='13.5' r='0.5' fill='white' />
    <circle cx='10.5' cy='15.5' r='0.5' fill='white' />
    <circle cx='13.5' cy='15.5' r='0.5' fill='white' />
    <path d='M7 6C7.5 5.5 8 5 8.5 5.5' stroke={color} strokeWidth='1.5' strokeLinecap='round' />
    <path d='M17 6C16.5 5.5 16 5 15.5 5.5' stroke={color} strokeWidth='1.5' strokeLinecap='round' />
  </svg>
);

// Ícone de Café
export const CoffeeIcon = ({ className = 'w-6 h-6', color = 'currentColor' }) => (
  <svg className={className} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <path d='M8 12C8 8 10 6 12 6C14 6 16 8 16 12' stroke={color} strokeWidth='2' strokeLinecap='round' />
    <path
      d='M6 12C6 10 7 9 8 9H16C17 9 18 10 18 12V16C18 18 16 20 14 20H10C8 20 6 18 6 16V12Z'
      fill={color}
      stroke={color}
      strokeWidth='1.5'
    />
    <circle cx='9' cy='7' r='1' fill={color} />
    <circle cx='12' cy='5' r='1' fill={color} />
    <circle cx='15' cy='7' r='1' fill={color} />
    <path d='M18 12H19C20 12 21 13 21 14C21 15 20 16 19 16H18' stroke={color} strokeWidth='1.5' strokeLinecap='round' />
    <path d='M8 15H16' stroke='white' strokeWidth='1' strokeLinecap='round' />
  </svg>
);

// Ícone de Grãos (genérico)
export const GrainIcon = ({ className = 'w-6 h-6', color = 'currentColor' }) => (
  <svg className={className} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <path d='M12 2L15 8L12 14L9 8L12 2Z' fill={color} stroke={color} strokeWidth='1.5' />
    <path d='M12 8L16 10L12 16L8 10L12 8Z' fill={color} stroke={color} strokeWidth='1.5' opacity='0.8' />
    <path d='M12 14L14 18L12 22L10 18L12 14Z' fill={color} stroke={color} strokeWidth='1.5' opacity='0.6' />
    <circle cx='12' cy='8' r='1' fill='white' />
    <circle cx='12' cy='14' r='1' fill='white' />
  </svg>
);

// Ícone de Vegetais
export const VegetableIcon = ({ className = 'w-6 h-6', color = 'currentColor' }) => (
  <svg className={className} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <path d='M12 3L8 7L6 12L8 17L12 21L16 17L18 12L16 7L12 3Z' fill={color} stroke={color} strokeWidth='1.5' />
    <path d='M12 7L10 9L9 12L10 15L12 17L14 15L15 12L14 9L12 7Z' fill='white' />
    <path
      d='M12 3C12 3 10 4 9 6C8 8 9 10 12 10C15 10 16 8 15 6C14 4 12 3 12 3Z'
      fill={color}
      stroke={color}
      strokeWidth='1'
    />
  </svg>
);

// Ícone de Frutas
export const FruitIcon = ({ className = 'w-6 h-6', color = 'currentColor' }) => (
  <svg className={className} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <circle cx='12' cy='13' r='7' fill={color} stroke={color} strokeWidth='1.5' />
    <path
      d='M12 6C12 6 11 5 10 6C9 7 10 8 12 8C14 8 15 7 14 6C13 5 12 6 12 6Z'
      fill={color}
      stroke={color}
      strokeWidth='1'
    />
    <path d='M10 10L8 12' stroke='white' strokeWidth='1' strokeLinecap='round' />
    <path d='M14 10L16 12' stroke='white' strokeWidth='1' strokeLinecap='round' />
    <path d='M10 16L8 14' stroke='white' strokeWidth='1' strokeLinecap='round' />
    <path d='M14 16L16 14' stroke='white' strokeWidth='1' strokeLinecap='round' />
  </svg>
);

// Ícone de Laticínios
export const DairyIcon = ({ className = 'w-6 h-6', color = 'currentColor' }) => (
  <svg className={className} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <path d='M8 4C8 3 9 2 10 2H14C15 2 16 3 16 4V6H8V4Z' fill={color} stroke={color} strokeWidth='1.5' />
    <path
      d='M7 6H17C18 6 19 7 19 8V18C19 20 17 22 15 22H9C7 22 5 20 5 18V8C5 7 6 6 7 6Z'
      fill={color}
      stroke={color}
      strokeWidth='1.5'
    />
    <path d='M8 10H16' stroke='white' strokeWidth='1' strokeLinecap='round' />
    <path d='M8 13H16' stroke='white' strokeWidth='1' strokeLinecap='round' />
    <path d='M8 16H16' stroke='white' strokeWidth='1' strokeLinecap='round' />
    <circle cx='12' cy='19' r='1' fill='white' />
  </svg>
);

// Ícone de Carne
export const MeatIcon = ({ className = 'w-6 h-6', color = 'currentColor' }) => (
  <svg className={className} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <path
      d='M6 8C6 6 8 4 12 4C16 4 18 6 18 8C18 10 16 12 12 12C8 12 6 10 6 8Z'
      fill={color}
      stroke={color}
      strokeWidth='1.5'
    />
    <path d='M8 12C8 14 10 16 12 16C14 16 16 14 16 12' stroke={color} strokeWidth='1.5' strokeLinecap='round' />
    <path d='M10 16C10 18 11 20 12 20C13 20 14 18 14 16' stroke={color} strokeWidth='1.5' strokeLinecap='round' />
    <circle cx='10' cy='8' r='1' fill='white' />
    <circle cx='14' cy='8' r='1' fill='white' />
    <path d='M12 9L12 11' stroke='white' strokeWidth='1' strokeLinecap='round' />
  </svg>
);

// Ícone de Sementes
export const SeedIcon = ({ className = 'w-6 h-6', color = 'currentColor' }) => (
  <svg className={className} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <circle cx='12' cy='12' r='3' fill={color} stroke={color} strokeWidth='1.5' />
    <path
      d='M12 9C12 9 10 7 8 9C6 11 8 13 12 13C16 13 18 11 16 9C14 7 12 9 12 9Z'
      fill={color}
      stroke={color}
      strokeWidth='1'
    />
    <path
      d='M12 15C12 15 10 17 8 15C6 13 8 11 12 11C16 11 18 13 16 15C14 17 12 15 12 15Z'
      fill={color}
      stroke={color}
      strokeWidth='1'
    />
    <path
      d='M9 12C9 12 7 10 9 8C11 6 13 8 13 12C13 16 11 18 9 16C7 14 9 12 9 12Z'
      fill={color}
      stroke={color}
      strokeWidth='1'
    />
    <path
      d='M15 12C15 12 17 10 15 8C13 6 11 8 11 12C11 16 13 18 15 16C17 14 15 12 15 12Z'
      fill={color}
      stroke={color}
      strokeWidth='1'
    />
    <circle cx='12' cy='12' r='1' fill='white' />
  </svg>
);

// Ícones de interface

// Ícone de Estrela
export const StarIcon = ({ className = 'w-5 h-5', color = 'currentColor', filled = false }) => (
  <svg className={className} viewBox='0 0 24 24' fill={filled ? color : 'none'} stroke={color} strokeWidth='2'>
    <polygon points='12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26' />
  </svg>
);

// Ícone de Troféu
export const TrophyIcon = ({ className = 'w-5 h-5', color = 'currentColor' }) => (
  <svg className={className} viewBox='0 0 24 24' fill='none' stroke={color} strokeWidth='2'>
    <path d='M6 9H4.5a2.5 2.5 0 0 1 0-5H6' />
    <path d='M18 9h1.5a2.5 2.5 0 0 0 0-5H18' />
    <path d='M4 22h16' />
    <path d='M10 14.66V17c0 .55.47.98.97 1.21C12.25 18.75 14 20 16 20s3.75-1.25 5.03-1.79c.5-.23.97-.66.97-1.21v-2.34' />
    <path d='M18 2H6v7a6 6 0 0 0 12 0V2Z' fill={color} />
  </svg>
);

// Ícone de Cadeado
export const LockIcon = ({ className = 'w-5 h-5', color = 'currentColor' }) => (
  <svg className={className} viewBox='0 0 24 24' fill='none' stroke={color} strokeWidth='2'>
    <rect x='3' y='11' width='18' height='11' rx='2' ry='2' fill={color} />
    <circle cx='12' cy='16' r='1' fill='white' />
    <path d='M7 11V7a5 5 0 0 1 10 0v4' />
  </svg>
);

// Ícone de Check/Verificado
export const CheckIcon = ({ className = 'w-5 h-5', color = 'currentColor' }) => (
  <svg className={className} viewBox='0 0 24 24' fill='none' stroke={color} strokeWidth='2'>
    <polyline points='20,6 9,17 4,12' />
  </svg>
);

// Ícone de Telefone
export const PhoneIcon = ({ className = 'w-5 h-5', color = 'currentColor' }) => (
  <svg className={className} viewBox='0 0 24 24' fill='none' stroke={color} strokeWidth='2'>
    <path d='M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z' />
  </svg>
);

// Ícone de Salvar
export const SaveIcon = ({ className = 'w-5 h-5', color = 'currentColor' }) => (
  <svg className={className} viewBox='0 0 24 24' fill='none' stroke={color} strokeWidth='2'>
    <path d='M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z' />
    <polyline points='17,21 17,13 7,13 7,21' />
    <polyline points='7,3 7,8 15,8' />
  </svg>
);

// Ícone de Busca
export const SearchIcon = ({ className = 'w-5 h-5', color = 'currentColor' }) => (
  <svg className={className} viewBox='0 0 24 24' fill='none' stroke={color} strokeWidth='2'>
    <circle cx='11' cy='11' r='8' />
    <path d='m21 21-4.35-4.35' />
  </svg>
);

// Ícone de Grid
export const GridIcon = ({ className = 'w-5 h-5', color = 'currentColor' }) => (
  <svg className={className} viewBox='0 0 24 24' fill='none' stroke={color} strokeWidth='2'>
    <rect x='3' y='3' width='7' height='7' fill={color} />
    <rect x='14' y='3' width='7' height='7' fill={color} />
    <rect x='14' y='14' width='7' height='7' fill={color} />
    <rect x='3' y='14' width='7' height='7' fill={color} />
  </svg>
);

// Ícone de Lista
export const ListIcon = ({ className = 'w-5 h-5', color = 'currentColor' }) => (
  <svg className={className} viewBox='0 0 24 24' fill='none' stroke={color} strokeWidth='2'>
    <line x1='8' y1='6' x2='21' y2='6' />
    <line x1='8' y1='12' x2='21' y2='12' />
    <line x1='8' y1='18' x2='21' y2='18' />
    <line x1='3' y1='6' x2='3.01' y2='6' />
    <line x1='3' y1='12' x2='3.01' y2='12' />
    <line x1='3' y1='18' x2='3.01' y2='18' />
  </svg>
);

// Ícone de Ferramentas
export const ToolsIcon = ({ className = 'w-5 h-5', color = 'currentColor' }) => (
  <svg className={className} viewBox='0 0 24 24' fill='none' stroke={color} strokeWidth='2'>
    <path d='M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z' />
  </svg>
);

// Ícone de Caixa/Produto
export const BoxIcon = ({ className = 'w-5 h-5', color = 'currentColor' }) => (
  <svg className={className} viewBox='0 0 24 24' fill='none' stroke={color} strokeWidth='2'>
    <path d='M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z' />
    <polyline points='3.27,6.96 12,12.01 20.73,6.96' />
    <line x1='12' y1='22.08' x2='12' y2='12' />
  </svg>
);

// Ícone de Fábrica
export const FactoryIcon = ({ className = 'w-5 h-5', color = 'currentColor' }) => (
  <svg className={className} viewBox='0 0 24 24' fill='none' stroke={color} strokeWidth='2'>
    <path d='M2 20h20v2H2z' />
    <path d='M4 20V4h3v16' />
    <path d='M7 8h3v12' />
    <path d='M10 12h3v8' />
    <path d='M13 16h3v4' />
    <path d='M16 8h3v12' />
    <rect x='19' y='4' width='3' height='16' fill={color} />
  </svg>
);

// Ícone de Reload/Atualizar
export const ReloadIcon = ({ className = 'w-5 h-5', color = 'currentColor' }) => (
  <svg className={className} viewBox='0 0 24 24' fill='none' stroke={color} strokeWidth='2'>
    <polyline points='23,4 23,10 17,10' />
    <polyline points='1,20 1,14 7,14' />
    <path d='M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15' />
  </svg>
);

// Ícone de Email
export const EmailIcon = ({ className = 'w-5 h-5', color = 'currentColor' }) => (
  <svg className={className} viewBox='0 0 24 24' fill='none' stroke={color} strokeWidth='2'>
    <path d='M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z' />
    <polyline points='22,6 12,13 2,6' />
  </svg>
);

// Ícone de X (fechar)
export const XIcon = ({ className = 'w-5 h-5', color = 'currentColor' }) => (
  <svg className={className} viewBox='0 0 24 24' fill='none' stroke={color} strokeWidth='2'>
    <line x1='18' y1='6' x2='6' y2='18' />
    <line x1='6' y1='6' x2='18' y2='18' />
  </svg>
);

// Ícone Mundial/Global
export const GlobalIcon = ({ className = 'w-5 h-5', color = 'currentColor' }) => (
  <svg className={className} viewBox='0 0 24 24' fill='none' stroke={color} strokeWidth='2'>
    <circle cx='12' cy='12' r='10' />
    <line x1='2' y1='12' x2='22' y2='12' />
    <path d='M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z' />
  </svg>
);

// Ícone de Folha (orgânico)
export const LeafIcon = ({ className = 'w-5 h-5', color = 'currentColor' }) => (
  <svg className={className} viewBox='0 0 24 24' fill='none' stroke={color} strokeWidth='2'>
    <path d='M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z' fill={color} />
    <path d='M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12' />
  </svg>
);

// Ícone de Prancheta/Clipboard
export const ClipboardIcon = ({ className = 'w-5 h-5', color = 'currentColor' }) => (
  <svg className={className} viewBox='0 0 24 24' fill='none' stroke={color} strokeWidth='2'>
    <path d='M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2' />
    <rect x='8' y='2' width='8' height='4' rx='1' ry='1' />
  </svg>
);
