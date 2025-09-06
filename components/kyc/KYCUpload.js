import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Trash2,
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-hot-toast';

const KYCUpload = ({
  documentType,
  onUpload,
  onRemove,
  existingDocument,
  disabled = false,
}) => {
  const { t } = useTranslation();
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);

  const onDrop = useCallback(
    async acceptedFiles => {
      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];
      setUploading(true);

      try {
        // Create preview for images
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = e => setPreview(e.target.result);
          reader.readAsDataURL(file);
        }

        // Upload file
        const formData = new FormData();
        formData.append('document', file);
        formData.append('documentType', documentType);

        const response = await fetch('/api/kyc/upload', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: formData,
        });

        const result = await response.json();

        if (result.success) {
          toast.success(
            t('kyc.uploadSuccess', 'Documento enviado com sucesso!')
          );
          onUpload(result);
        } else {
          throw new Error(result.error || 'Erro no upload');
        }
      } catch (error) {
        console.error('Upload error:', error);
        toast.error(
          error.message || t('kyc.uploadError', 'Erro ao enviar documento')
        );
      } finally {
        setUploading(false);
      }
    },
    [documentType, onUpload, t]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
      'application/pdf': ['.pdf'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    disabled: disabled || uploading,
  });

  const handleRemove = async () => {
    if (!existingDocument) return;

    try {
      await onRemove(existingDocument._id);
      setPreview(null);
      toast.success(t('kyc.removeSuccess', 'Documento removido com sucesso!'));
    } catch (error) {
      console.error('Remove error:', error);
      toast.error(t('kyc.removeError', 'Erro ao remover documento'));
    }
  };

  const getDocumentIcon = mimeType => {
    if (mimeType?.startsWith('image/')) {
      return <FileText className="w-8 h-8 text-blue-500" />;
    }
    return <FileText className="w-8 h-8 text-red-500" />;
  };

  const getStatusIcon = status => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'pending_review':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = status => {
    switch (status) {
      case 'approved':
        return 'border-green-200 bg-green-50';
      case 'rejected':
        return 'border-red-200 bg-red-50';
      case 'pending_review':
        return 'border-yellow-200 bg-yellow-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getDocumentTypeName = type => {
    const names = {
      id: t('kyc.documentTypes.id', 'Documento de Identidade'),
      address: t('kyc.documentTypes.address', 'Comprovante de Endereço'),
      license: t('kyc.documentTypes.license', 'Carteira de Habilitação'),
      vehicle: t('kyc.documentTypes.vehicle', 'Documento do Veículo'),
      business: t('kyc.documentTypes.business', 'Documento da Empresa'),
    };
    return names[type] || type;
  };

  if (existingDocument) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-4 rounded-lg border-2 ${getStatusColor(existingDocument.status)}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getDocumentIcon(existingDocument.mimeType)}
            <div>
              <h4 className="font-medium text-gray-900">
                {getDocumentTypeName(documentType)}
              </h4>
              <p className="text-sm text-gray-600">
                {existingDocument.originalName}
              </p>
              <div className="flex items-center space-x-2 mt-1">
                {getStatusIcon(existingDocument.status)}
                <span className="text-sm font-medium">
                  {t(
                    `kyc.status.${existingDocument.status}`,
                    existingDocument.status
                  )}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {existingDocument.status === 'approved' && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  window.open(
                    `/api/kyc/document/${existingDocument._id}`,
                    '_blank'
                  )
                }
                className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                title={t('kyc.viewDocument', 'Visualizar documento')}
              >
                <Eye className="w-4 h-4" />
              </motion.button>
            )}

            {!disabled && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRemove}
                className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                title={t('kyc.removeDocument', 'Remover documento')}
              >
                <Trash2 className="w-4 h-4" />
              </motion.button>
            )}
          </div>
        </div>

        {existingDocument.reason && (
          <div className="mt-3 p-3 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>{t('kyc.reason', 'Motivo')}:</strong>{' '}
              {existingDocument.reason}
            </p>
          </div>
        )}

        {existingDocument.validation && (
          <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">
                {t('kyc.validationScore', 'Pontuação de Validação')}:
              </span>
              <span className="ml-2 font-medium">
                {Math.round(existingDocument.validation.score * 100)}%
              </span>
            </div>
            <div>
              <span className="text-gray-600">
                {t('kyc.ocrConfidence', 'Confiança OCR')}:
              </span>
              <span className="ml-2 font-medium">
                {Math.round(existingDocument.ocrConfidence * 100)}%
              </span>
            </div>
          </div>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-all duration-200
          ${
            isDragActive
              ? 'border-blue-400 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }
          ${disabled || uploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />

        <AnimatePresence>
          {uploading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center"
            >
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600">
                {t('kyc.uploading', 'Enviando documento...')}
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center"
            >
              <Upload className="w-12 h-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {getDocumentTypeName(documentType)}
              </h3>
              <p className="text-gray-600 mb-4">
                {isDragActive
                  ? t('kyc.dropFile', 'Solte o arquivo aqui...')
                  : t(
                      'kyc.dragDrop',
                      'Arraste e solte o arquivo aqui, ou clique para selecionar'
                    )}
              </p>
              <p className="text-sm text-gray-500">
                {t(
                  'kyc.supportedFormats',
                  'Formatos suportados: JPG, PNG, PDF (máx. 10MB)'
                )}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {preview && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4"
        >
          <img
            src={preview}
            alt="Preview"
            className="w-full max-w-md mx-auto rounded-lg shadow-lg"
          />
        </motion.div>
      )}
    </motion.div>
  );
};

export default KYCUpload;
