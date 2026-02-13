// Patch para garantir que HelmetProvider está disponível
import React from 'react';
import { HelmetProvider } from 'react-helmet-async';

export function withHelmetProvider(Component) {
  return function HelmetProviderWrapper(props) {
    return (
      <HelmetProvider>
        <Component {...props} />
      </HelmetProvider>
    );
  };
}
