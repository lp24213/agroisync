'use client';

import React from 'react';
import { Alert } from '../ui/Alert';
import { Button } from '../ui/Button';
import { AlertVariant } from '../../types/web3';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  variant?: AlertVariant;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
}

interface ModalConfig {
  variant: AlertVariant;
  buttonVariant: 'default' | 'destructive' | 'outline';
  icon: string;
}

const getModalConfig = (variant: AlertVariant): ModalConfig => {
  switch (variant) {
    case 'danger':
      return {
        variant: 'error',
        buttonVariant: 'destructive',
        icon: '⚠️'
      };
    case 'warning':
      return {
        variant: 'warning',
        buttonVariant: 'outline',
        icon: '⚠️'
      };
    case 'info':
      return {
        variant: 'info',
        buttonVariant: 'outline',
        icon: 'ℹ️'
      };
    case 'success':
      return {
        variant: 'success',
        buttonVariant: 'default',
        icon: '✅'
      };
    default:
      return {
        variant: 'info',
        buttonVariant: 'outline',
        icon: 'ℹ️'
      };
  }
};

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  variant = 'info',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  loading = false
}) => {
  if (!isOpen) return null;

  const config = getModalConfig(variant);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 text-2xl">
            {config.icon}
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {title}
            </h3>
            
            <Alert variant={config.variant}>
              <p className="text-sm text-gray-600">
                {message}
              </p>
            </Alert>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </Button>
          
          <Button
            variant={config.buttonVariant}
            onClick={onConfirm}
            loading={loading}
            disabled={loading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal; 