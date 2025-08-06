'use client';

import React from 'react';
import { Toaster as HotToaster } from 'react-hot-toast';

export const Toaster: React.FC = () => {
  return (
    <HotToaster
      position='top-right'
      toastOptions={{
        duration: 4000,
        style: {
          background: '#000000',
          color: '#ffffff',
          border: '1px solid #00F0FF',
        },
        // success: {
        //   duration: 3000,
        //   iconTheme: {
        //     primary: '#00F0FF',
        //     secondary: '#000000',
        //   },
        // },
        // error: {
        //   duration: 5000,
        //   iconTheme: {
        //     primary: '#00F0FF',
        //     secondary: '#000000',
        //   },
        // },
      }}
    />
  );
};
