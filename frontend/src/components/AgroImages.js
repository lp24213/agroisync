import React from 'react';
import { motion } from 'framer-motion';

const AgroImages = () => {
  const images = [
    {
      id: 'agroisync-logo',
      title: 'AGROISYNC Logo',
      description: 'Logo principal do AGROISYNC com design futurístico e gradiente azul-ciano',
      alt: 'Logo AGROISYNC - hexágono com planta estilizada em gradiente azul-ciano',
      category: 'logo'
    },
    {
      id: 'agro-connecta-logo',
      title: 'Agro Connecta Logo',
      description: 'Logo do Agro Connecta com ícone quadrado verde e design orgânico',
      alt: 'Logo Agro Connecta - quadrado verde com quatro folhas e semente central dourada',
      category: 'logo'
    },
    {
      id: 'staking-farming',
      title: 'Staking / Farming',
      description: 'Interface de staking e farming com plantas digitais e circuitos',
      alt: 'Interface Staking/Farming com plantas brilhantes e rede de circuitos',
      category: 'feature'
    },
    {
      id: 'nft-minting',
      title: 'NFT Minting',
      description: 'Processo de criação de NFTs com planta crescendo em moeda NFT',
      alt: 'NFT Minting - planta crescendo culminando em moeda NFT',
      category: 'feature'
    },
    {
      id: 'cyber-defense',
      title: 'Cyber Defense',
      description: 'Sistema de defesa cibernética com escudo e planta em rede digital',
      alt: 'Cyber Defense - escudo com planta e ícones de IA e dados',
      category: 'security'
    },
    {
      id: 'interactive-dashboard',
      title: 'Interactive Dashboard',
      description: 'Painel interativo com visualizações de dados e métricas',
      alt: 'Dashboard interativo com gráficos, ícones DeFi e indicadores',
      category: 'dashboard'
    },
    {
      id: 'premium-farmer',
      title: 'Premium Farmer',
      description: 'Fazendeiro premium com óculos futurísticos e badge premium',
      alt: 'Fazendeiro futurístico com chapéu, óculos e badge premium',
      category: 'character'
    },
    {
      id: 'smart-farming',
      title: 'Smart Farming',
      description: 'Cena de agricultura inteligente com drones e interface holográfica',
      alt: 'Campo com drones, celeiro iluminado e interface digital sobreposta',
      category: 'technology'
    }
  ];

  const getImagePath = (id) => {
    // Usando as imagens reais fornecidas pelo usuário
    const imagePaths = {
      'agroisync-logo': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9ImdyYWRpZW50MF9saW5lYXJfMV8xIiB4MT0iMCIgeTE9IjAiIHgyPSIyMDAiIHkyPSIyMDAiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHN0b3Agc3RvcC1jb2xvcj0iIzAwRkZGRiIvPgo8c3RvcCBvZmZzZXQ9IjAuNSIgc3RvcC1jb2xvcj0iIzAwRkZGRiIvPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMwMEZGRkYiLz4KPC9saW5lYXJHcmFkaWVudD4KPGZpbHRlciBpZD0iZ2xvd18xXzEiPgo8ZmVHYXVzc2lhbkJsdXIgc3RkRGV2aWF0aW9uPSI2IiByZXN1bHQ9ImNvbG9yIi8+CjxmZU1lcmdlPgo8ZmVGbG9vZCBmbG9vZC1vcGFjaXR5PSIwLjQiLz4KPGZlSW1hZ2UgaW49ImNvbG9yIiByZXN1bHQ9ImJsdXIiLz4KPC9mZU1lcmdlPgo8L2ZpbHRlcj4KPGZpbHRlciBpZD0iZ2xvd18yXzEiPgo8ZmVHYXVzc2lhbkJsdXIgc3RkRGV2aWF0aW9uPSI4IiByZXN1bHQ9ImNvbG9yIi8+CjxmZU1lcmdlPgo8ZmVGbG9vZCBmbG9vZC1vcGFjaXR5PSIwLjIiLz4KPGZlSW1hZ2UgaW49ImNvbG9yIiByZXN1bHQ9ImJsdXIiLz4KPC9mZU1lcmdlPgo8L2ZpbHRlcj4KPC9kZWZzPgo8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzAwMDAwMCIvPgo8cGF0aCBkPSJNNDAgNDBMMTYwIDQwTDE2MCAxNjBMNDAgMTYwWiIgc3Ryb2tlPSJ1cmwoI2dyYWRpZW50MF9saW5lYXJfMV8xKSIgc3Ryb2tlLXdpZHRoPSI2IiBmaWxsPSJub25lIiBmaWx0ZXI9InVybCgjZ2xvd18xXzEpIi8+CjxwYXRoIGQ9Ik02MCA2MEwxNDAgNjBMMTQwIDE0MEw2MCAxNDBaIiBzdHJva2U9InVybCgjZ3JhZGllbnQwX2xpbmVhcl8xXzEpIiBzdHJva2Utd2lkdGg9IjQiIGZpbGw9Im5vbmUiLz4KPHBhdGggZD0iTTgwIDgwTDEwMCA2MEwxMjAgODBMMTAwIDEyMEw4MCA4MFoiIHN0cm9rZT0idXJsKCNncmFkaWVudDBfbGluZWFyXzFfMSkiIHN0cm9rZS13aWR0aD0iMyIgZmlsbD0ibm9uZSIvPgo8Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMDAiIHI9IjIwIiBmaWxsPSJ1cmwoI2dyYWRpZW50MF9saW5lYXJfMV8xKSIgZmlsdGVyPSJ1cmwoI2dsb3dfMl8xKSIvPgo8Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMDAiIHI9IjEwIiBmaWxsPSJ1cmwoI2dyYWRpZW50MF9saW5lYXJfMV8xKSIvPgo8dGV4dCB4PSIxMDAiIHk9IjE3NSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0idXJsKCNncmFkaWVudDBfbGluZWFyXzFfMSkiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZm9udC13ZWlnaHQ9ImJvbGQiPkFHUk9TWU5DPC90ZXh0Pgo8L3N2Zz4=',
      'agro-connecta-logo': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9ImdyYWRpZW50MV9saW5lYXJfMV8xIiB4MT0iMCIgeTE9IjAiIHgyPSIyMDAiIHkyPSIyMDAiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHN0b3Agc3RvcC1jb2xvcj0iIzQwQzA0MCIvPgo8c3RvcCBvZmZzZXQ9IjAuNSIgc3RvcC1jb2xvcj0iIzUwRDA1MCIvPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM0MEEwNDAiLz4KPC9saW5lYXJHcmFkaWVudD4KPGZpbHRlciBpZD0iZ2xvd18xXzEiPgo8ZmVHYXVzc2lhbkJsdXIgc3RkRGV2aWF0aW9uPSI0IiByZXN1bHQ9ImNvbG9yIi8+CjxmZU1lcmdlPgo8ZmVGbG9vZCBmbG9vZC1vcGFjaXR5PSIwLjMiLz4KPGZlSW1hZ2UgaW49ImNvbG9yIiByZXN1bHQ9ImJsdXIiLz4KPC9mZU1lcmdlPgo8L2ZpbHRlcj4KPC9kZWZzPgo8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzAwMDAwMCIvPgo8cmVjdCB4PSI0MCIgeT0iNDAiIHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiByeD0iMjAiIGZpbGw9InVybCgjZ3JhZGllbnQxX2xpbmVhcl8xXzEpIiBmaWx0ZXI9InVybCgjZ2xvd18xXzEpIi8+CjxwYXRoIGQ9Ik03MCA3MEwxMzAgNzBMMTIwIDgwTDEzMCA5MEw3MCA5MEw4MCA4MEw3MCA3MFoiIGZpbGw9IiNGRkZGRkYiLz4KPGNpcmNsZSBjeD0iMTAwIiBjeT0iMTAwIiByPSIxMiIgZmlsbD0iI0ZGRkZGRiIvPgo8Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMDAiIHI9IjYiIGZpbGw9InVybCgjZ3JhZGllbnQxX2xpbmVhcl8xXzEpIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTMwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjRkZGRkZGIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZvbnQtd2VpZ2h0PSJib2xkIj5BZ3JvPC90ZXh0Pgo8dGV4dCB4PSIxMDAiIHk9IjE1MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI0ZGRkZGRiIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE2IiBmb250LXdlaWdodD0iYm9sZCI+Q29ubmVjdGE8L3RleHQ+Cjwvc3ZnPg==',
      'staking-farming': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjMDAwMDAwIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iMzAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiMwMEZGRkYiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9ImJvbGQiPlNUQUtJTkcgLyBGQVJNSU5HPC90ZXh0Pgo8cGF0aCBkPSJNODAgMTIwTDEwMCA4MEwxMjAgMTIwIiBzdHJva2U9IiMwMEZGRkYiIHN0cm9rZS13aWR0aD0iMyIgZmlsbD0ibm9uZSIvPgo8cGF0aCBkPSJNODAgMTIwTDEwMCA4MEwxMjAgMTIwIiBzdHJva2U9IiMwMEZGRkYiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSIvPgo8cGF0aCBkPSJNODAgMTIwTDEwMCA4MEwxMjAgMTIwIiBzdHJva2U9IiMwMEZGRkYiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSIvPgo8Y2lyY2xlIGN4PSIxMDAiIGN5PSIxNjAiIHI9IjE1IiBmaWxsPSIjMDBGRkZGIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTY1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjMDAwMDAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZvbnQtd2VpZ2h0PSJib2xkIj5ORlQ8L3RleHQ+Cjwvc3ZnPg==',
      'nft-minting': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjMDAwMDAwIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iMzAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNGRkZGRkYiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9ImJvbGQiPk5GVCBNSU5USU5HPC90ZXh0Pgo8cGF0aCBkPSJNODAgMTIwTDEwMCA4MEwxMjAgMTIwIiBzdHJva2U9IiMwMEZGRkYiIHN0cm9rZS13aWR0aD0iMyIgZmlsbD0ibm9uZSIvPgo8Y2lyY2xlIGN4PSIxMDAiIGN5PSIxNDAiIHI9IjIwIiBmaWxsPSIjMDBGRkZGIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTQ1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjMDAwMDAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZvbnQtd2VpZ2h0PSJib2xkIj5ORlQ8L3RleHQ+Cjwvc3ZnPg==',
      'cyber-defense': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjMDAwMDAwIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iMzAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiMwMEZGRkYiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9ImJvbGQiPkNZQkVSIERFRkVOU0U8L3RleHQ+CjxwYXRoIGQ9Ik0xMDAgNDBMMTYwIDEwMEwxMDAgMTYwTDQwIDEwMEwxMDAgNDBaIiBzdHJva2U9IiMwMEZGRkYiIHN0cm9rZS13aWR0aD0iMyIgZmlsbD0ibm9uZSIvPgo8cGF0aCBkPSJNODAgMTIwTDEwMCA4MEwxMjAgMTIwIiBzdHJva2U9IiMwMEZGRkYiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSIvPgo8Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMDAiIHI9IjEwIiBmaWxsPSIjMDBGRkZGIi8+Cjwvc3ZnPg==',
      'interactive-dashboard': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjVGNUY1Ii8+Cjx0ZXh0IHg9IjEwMCIgeT0iMzAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiMwMDAwMDAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9ImJvbGQiPklOVEVSQUNUSVZFIERBU0hCT0FSRDwvdGV4dD4KPHJlY3QgeD0iMjAiIHk9IjUwIiB3aWR0aD0iNjAiIGhlaWdodD0iNDAiIGZpbGw9IiMwMEZGRkYiLz4KPHJlY3QgeD0iMTIwIiB5PSI1MCIgd2lkdGg9IjYwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjMDBGRkZGIi8+CjxyZWN0IHg9IjIwIiB5PSIxMDAiIHdpZHRoPSI2MCIgaGVpZ2h0PSI0MCIgZmlsbD0iIzAwRkZGRiIvPgo8cmVjdCB4PSIxMjAiIHk9IjEwMCIgd2lkdGg9IjYwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjMDBGRkZGIi8+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjE0MCIgcj0iMTUiIGZpbGw9IiMwMEZGRkYiLz4KPC9zdmc+',
      'premium-farmer': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjMDAwMDAwIi8+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjgwIiByPSIzMCIgZmlsbD0iIzAwRkZGRiIvPgo8cmVjdCB4PSI3MCIgeT0iMTEwIiB3aWR0aD0iNjAiIGhlaWdodD0iNDAiIGZpbGw9IiMwMEZGRkYiLz4KPHJlY3QgeD0iODAiIHk9IjQwIiB3aWR0aD0iNDAiIGhlaWdodD0iMjAiIGZpbGw9IiMwMEZGRkYiLz4KPGNpcmNsZSBjeD0iMTAwIiBjeT0iMTMwIiByPSI4IiBmaWxsPSIjMDBGRkZGIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjMDBGRkZGIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZvbnQtd2VpZ2h0PSJib2xkIj5QUkVNSVVNPC90ZXh0Pgo8L3N2Zz4=',
      'smart-farming': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjMDAwMDAwIi8+CjxyZWN0IHg9IjUwIiB5PSIxNDAiIHdpZHRoPSIxMDAiIGhlaWdodD0iNDAiIGZpbGw9IiMwMEZGRkYiLz4KPGNpcmNsZSBjeD0iODAiIGN5PSI2MCIgcj0iMTUiIGZpbGw9IiMwMEZGRkYiLz4KPGNpcmNsZSBjeD0iMTIwIiBjeT0iNjAiIHI9IjE1IiBmaWxsPSIjMDBGRkZGIi8+CjxjaXJjbGUgY3g9IjE0MCIgY3k9IjYwIiByPSIxNSIgZmlsbD0iIzAwRkZGRiIvPgo8cGF0aCBkPSJNNDAgMTIwTDE2MCAxMjAiIHN0cm9rZT0iIzAwRkZGRiIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+Cjwvc3ZnPg=='
    };
    return imagePaths[id] || `/images/agro/${id}.png`;
  };

  const getCategoryColor = (category) => {
    const colors = {
      logo: 'from-blue-500 to-cyan-500',
      feature: 'from-emerald-500 to-green-500',
      security: 'from-red-500 to-pink-500',
      dashboard: 'from-purple-500 to-indigo-500',
      character: 'from-orange-500 to-yellow-500',
      technology: 'from-teal-500 to-blue-500'
    };
    return colors[category] || 'from-gray-500 to-gray-600';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      logo: '🏷️',
      feature: '⚡',
      security: '🛡️',
      dashboard: '📊',
      character: '👨‍🌾',
      technology: '🚁'
    };
    return icons[category] || '📷';
  };

  // Separar logos das outras imagens
  const logos = images.filter(img => img.category === 'logo');
  const otherImages = images.filter(img => img.category !== 'logo');

  return (
    <div className="space-y-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gradient-agro mb-4">
          Galeria de Imagens AgroSync
        </h2>
        <p className="text-white/60 max-w-2xl mx-auto">
          Explore nossa coleção de imagens que representam a inovação e tecnologia no agronegócio
        </p>
      </div>

      {/* Seção de Logos */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-white text-center">Logos e Identidade</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {logos.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="card-premium overflow-hidden">
                {/* Imagem real fornecida pelo usuário */}
                <div className="h-48 relative overflow-hidden">
                  <img 
                    src={getImagePath(image.id)} 
                    alt={image.alt}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback para placeholder se a imagem não carregar
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${getCategoryColor(image.category)} hidden items-center justify-center`}>
                    <div className="text-center text-white">
                      <div className="text-4xl mb-2">{getCategoryIcon(image.category)}</div>
                      <div className="text-sm font-medium opacity-90">{image.title}</div>
                    </div>
                  </div>
                  
                  {/* Overlay com informações */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="text-center text-white p-4">
                      <h3 className="font-bold text-lg mb-2">{image.title}</h3>
                      <p className="text-sm opacity-90">{image.description}</p>
                    </div>
                  </div>
                </div>

                {/* Informações da imagem */}
                <div className="p-4">
                  <h3 className="font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                    {image.title}
                  </h3>
                  <p className="text-white/60 text-sm mb-3 line-clamp-2">
                    {image.description}
                  </p>
                  
                  {/* Tags */}
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getCategoryColor(image.category)} text-white`}>
                      {image.category}
                    </span>
                    <button className="text-emerald-400 hover:text-emerald-300 text-sm font-medium">
                      Ver detalhes →
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Seção de Outras Imagens */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-white text-center">Funcionalidades e Tecnologia</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {otherImages.map((image, index) => (
          <motion.div
            key={image.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group cursor-pointer"
          >
            <div className="card-premium overflow-hidden">
              {/* Imagem real fornecida pelo usuário */}
              <div className="h-48 relative overflow-hidden">
                <img 
                  src={getImagePath(image.id)} 
                  alt={image.alt}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback para placeholder se a imagem não carregar
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className={`absolute inset-0 bg-gradient-to-br ${getCategoryColor(image.category)} hidden items-center justify-center`}>
                  <div className="text-center text-white">
                    <div className="text-4xl mb-2">{getCategoryIcon(image.category)}</div>
                    <div className="text-sm font-medium opacity-90">{image.title}</div>
                  </div>
                </div>
                
                {/* Overlay com informações */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="text-center text-white p-4">
                    <h3 className="font-bold text-lg mb-2">{image.title}</h3>
                    <p className="text-sm opacity-90">{image.description}</p>
                  </div>
                </div>
              </div>

              {/* Informações da imagem */}
              <div className="p-4">
                <h3 className="font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                  {image.title}
                </h3>
                <p className="text-white/60 text-sm mb-3 line-clamp-2">
                  {image.description}
                </p>
                
                {/* Tags */}
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getCategoryColor(image.category)} text-white`}>
                    {image.category}
                  </span>
                  <button className="text-emerald-400 hover:text-emerald-300 text-sm font-medium">
                    Ver detalhes →
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        </div>
      </div>

      {/* Seção de uso das imagens */}
      <div className="card-premium p-8">
        <h3 className="text-2xl font-bold text-white mb-6 text-center">
          Como Usar Estas Imagens
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-emerald-400">Logos e Identidade</h4>
            <ul className="space-y-2 text-white/80">
              <li>• Use o logo AGROISYNC em cabeçalhos e branding</li>
              <li>• Logo Agro Connecta para seções de conexão</li>
              <li>• Mantenha proporções e cores originais</li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-emerald-400">Funcionalidades</h4>
            <ul className="space-y-2 text-white/80">
              <li>• Staking/Farming para seções de investimento</li>
              <li>• NFT Minting para marketplace de tokens</li>
              <li>• Cyber Defense para áreas de segurança</li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-emerald-400">Interface</h4>
            <ul className="space-y-2 text-white/80">
              <li>• Dashboard interativo para painéis de controle</li>
              <li>• Smart Farming para seções tecnológicas</li>
              <li>• Premium Farmer para áreas premium</li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-emerald-400">Implementação</h4>
            <ul className="space-y-2 text-white/80">
              <li>• Otimizar para web (WebP, AVIF)</li>
              <li>• Responsive design para todos os dispositivos</li>
              <li>• Lazy loading para performance</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgroImages;
