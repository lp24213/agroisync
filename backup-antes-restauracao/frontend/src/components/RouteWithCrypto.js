/**
 * AGROISYNC - Route With Crypto Hash Helper
 *
 * Este componente simplifica a criação de rotas que aceitam cryptoHash opcional.
 *
 * IMPORTANTE: Este é um helper OPCIONAL para novos componentes.
 * O código existente no App.js CONTINUA FUNCIONANDO normalmente.
 * Use este componente apenas para simplificar novas rotas.
 *
 * ANTES (no App.js):
 * <Route path="/marketplace" element={<AgroisyncMarketplace />} />
 * <Route path="/marketplace/:cryptoHash" element={<AgroisyncMarketplace />} />
 *
 * DEPOIS (usando este helper):
 * <RouteWithCrypto path="/marketplace" element={<AgroisyncMarketplace />} />
 *
 * Isso cria automaticamente AMBAS as rotas, mantendo compatibilidade total.
 */

import React from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

/**
 * Componente que cria rotas com e sem cryptoHash automaticamente
 *
 * @param {string} path - Caminho da rota (sem :cryptoHash)
 * @param {ReactElement} element - Componente a ser renderizado
 * @param {object} props - Outras props do Route
 */
const RouteWithCrypto = ({ path, element, ...props }) => {
  // Criar duas rotas: uma sem cryptoHash e outra com
  return (
    <>
      {/* Rota principal sem cryptoHash */}
      <Route path={path} element={element} {...props} />

      {/* Rota com cryptoHash opcional */}
      <Route path={`${path}/:cryptoHash`} element={element} {...props} />
    </>
  );
};

/**
 * Variante para rotas protegidas
 * Automaticamente envolve o elemento com ProtectedRoute
 *
 * @param {string} path - Caminho da rota
 * @param {ReactElement} element - Componente a ser renderizado
 * @param {object} props - Outras props do Route
 */
export const ProtectedRouteWithCrypto = ({ path, element, ...props }) => {
  return (
    <>
      <Route path={path} element={<ProtectedRoute>{element}</ProtectedRoute>} {...props} />
      <Route path={`${path}/:cryptoHash`} element={<ProtectedRoute>{element}</ProtectedRoute>} {...props} />
    </>
  );
};

/**
 * Helper para agrupar múltiplas rotas com cryptoHash
 *
 * Exemplo de uso:
 * <RouteGroup routes={[
 *   { path: '/marketplace', element: <Marketplace /> },
 *   { path: '/loja', element: <Loja /> },
 *   { path: '/about', element: <About /> }
 * ]} />
 */
export const RouteGroup = ({ routes }) => {
  return (
    <>
      {routes.map((route, index) => (
        <RouteWithCrypto key={index} {...route} />
      ))}
    </>
  );
};

/**
 * Helper para rotas protegidas em grupo
 */
export const ProtectedRouteGroup = ({ routes }) => {
  return (
    <>
      {routes.map((route, index) => (
        <ProtectedRouteWithCrypto key={index} {...route} />
      ))}
    </>
  );
};

/**
 * Hook para acessar o cryptoHash da URL
 * Útil para componentes que precisam do valor do cryptoHash
 *
 * Exemplo:
 * const { cryptoHash, hasCryptoHash } = useCryptoHash();
 */
export const useCryptoHash = () => {
  const { useParams } = require('react-router-dom');
  const params = useParams();

  return {
    cryptoHash: params.cryptoHash || null,
    hasCryptoHash: !!params.cryptoHash
  };
};

/**
 * Helper para criar link com cryptoHash preservado
 *
 * @param {string} to - Caminho do link
 * @param {string} cryptoHash - Hash opcional
 */
export const createCryptoLink = (to, cryptoHash = null) => {
  if (cryptoHash) {
    return `${to}/${cryptoHash}`;
  }
  return to;
};

export default RouteWithCrypto;
