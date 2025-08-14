'use client';

import { Toaster } from 'react-hot-toast';
import { ReactNode } from 'react';
import { Web3Provider } from '../contexts/Web3Context';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <Web3Provider>
      {children}
      <Toaster
        position='top-right'
        toastOptions={{
          duration: 4000,
          style: {
            background: '#000000',
            color: '#ffffff',
            border: '1px solid #00FF7F',
          },
        }}
      />
    </Web3Provider>
  );
}
