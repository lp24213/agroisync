'use client';

import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  loading?: boolean;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'warning',
  loading = false
}: ConfirmationModalProps) {
  const handleConfirm = () => {
    onConfirm();
  };

  const getVariantConfig = () => {
    switch (variant) {
      case 'danger':
        return {
          icon: '⚠️',
          color: 'text-red-400',
          bgColor: 'bg-red-500/20',
          buttonVariant: 'secondary' as const
        };
      case 'warning':
        return {
          icon: '⚠️',
          color: 'text-yellow-400',
          bgColor: 'bg-yellow-500/20',
          buttonVariant: 'secondary' as const
        };
      case 'info':
        return {
          icon: 'ℹ️',
          color: 'text-blue-400',
          bgColor: 'bg-blue-500/20',
          buttonVariant: 'primary' as const
        };
      default:
        return {
          icon: '⚠️',
          color: 'text-yellow-400',
          bgColor: 'bg-yellow-500/20',
          buttonVariant: 'secondary' as const
        };
    }
  };

  const config = getVariantConfig();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-6">
        <div className="text-center">
          <div className={`w-16 h-16 ${config.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
            <span className="text-2xl">{config.icon}</span>
          </div>
          <p className="text-gray-400">{message}</p>
        </div>

        <Alert variant={variant}>
          <p className="text-sm">
            Esta ação não pode ser desfeita. Certifique-se de que deseja continuar.
          </p>
        </Alert>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="flex-1"
          >
            {cancelText}
          </Button>
          <Button
            variant={config.buttonVariant}
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1"
          >
            {loading ? 'Processando...' : confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
} 