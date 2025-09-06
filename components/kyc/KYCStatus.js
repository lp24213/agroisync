import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle,
  FileText,
  Shield,
  TrendingUp,
  Users
} from 'lucide-react'

const KYCStatus = ({ userId, role }) => {
  const { t } = useTranslation()
  const [kycData, setKycData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchKYCStatus()
  }, [userId])

  const fetchKYCStatus = async () => {
    try {
      const response = await fetch('/api/kyc/status', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      const data = await response.json()
      if (data.success) {
        setKycData(data)
      }
    } catch (error) {
      console.error('Error fetching KYC status:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-6 h-6 text-green-500" />
      case 'rejected':
        return <XCircle className="w-6 h-6 text-red-500" />
      case 'pending_review':
        return <Clock className="w-6 h-6 text-yellow-500" />
      case 'incomplete':
        return <AlertCircle className="w-6 h-6 text-gray-500" />
      default:
        return <AlertCircle className="w-6 h-6 text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'pending_review':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'incomplete':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusMessage = (status) => {
    switch (status) {
      case 'approved':
        return t('kyc.statusMessages.approved', 'Seus documentos foram aprovados! Você pode usar todas as funcionalidades da plataforma.')
      case 'rejected':
        return t('kyc.statusMessages.rejected', 'Seus documentos foram rejeitados. Por favor, envie novos documentos.')
      case 'pending_review':
        return t('kyc.statusMessages.pending', 'Seus documentos estão sendo analisados. Aguarde a aprovação.')
      case 'incomplete':
        return t('kyc.statusMessages.incomplete', 'Você precisa enviar todos os documentos obrigatórios.')
      default:
        return t('kyc.statusMessages.unknown', 'Status desconhecido.')
    }
  }

  const getDocumentTypeName = (type) => {
    const names = {
      id: t('kyc.documentTypes.id', 'Documento de Identidade'),
      address: t('kyc.documentTypes.address', 'Comprovante de Endereço'),
      license: t('kyc.documentTypes.license', 'Carteira de Habilitação'),
      vehicle: t('kyc.documentTypes.vehicle', 'Documento do Veículo'),
      business: t('kyc.documentTypes.business', 'Documento da Empresa')
    }
    return names[type] || type
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!kycData) {
    return (
      <div className="text-center p-8">
        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">
          {t('kyc.errorLoading', 'Erro ao carregar status do KYC')}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Overall Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-6 rounded-lg border-2 ${getStatusColor(kycData.kycStatus)}`}
      >
        <div className="flex items-center space-x-3">
          {getStatusIcon(kycData.kycStatus)}
          <div>
            <h3 className="text-lg font-semibold">
              {t('kyc.overallStatus', 'Status Geral do KYC')}
            </h3>
            <p className="text-sm opacity-90">
              {getStatusMessage(kycData.kycStatus)}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Progress Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white p-6 rounded-lg shadow-sm border"
      >
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-gray-900">
            {t('kyc.progress', 'Progresso')}
          </h4>
          <span className="text-sm text-gray-600">
            {kycData.progress.completed}/{kycData.progress.total} {t('kyc.documents', 'documentos')}
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${kycData.progress.percentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full"
          />
        </div>
        
        <p className="text-sm text-gray-600 mt-2">
          {kycData.progress.percentage}% {t('kyc.complete', 'completo')}
        </p>
      </motion.div>

      {/* Requirements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white p-6 rounded-lg shadow-sm border"
      >
        <h4 className="font-medium text-gray-900 mb-4">
          {t('kyc.requirements', 'Documentos Obrigatórios')}
        </h4>
        
        <div className="space-y-3">
          {kycData.requirements.map((requirement, index) => {
            const document = kycData.documents.find(doc => doc.documentType === requirement.type)
            const isCompleted = document && document.status === 'approved'
            
            return (
              <motion.div
                key={requirement.type}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className={`flex items-center space-x-3 p-3 rounded-lg ${
                  isCompleted ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <Clock className="w-5 h-5 text-gray-400" />
                )}
                <div className="flex-1">
                  <p className={`font-medium ${isCompleted ? 'text-green-900' : 'text-gray-900'}`}>
                    {requirement.name}
                  </p>
                  {document && (
                    <p className="text-sm text-gray-600">
                      {t('kyc.uploadedOn', 'Enviado em')}: {new Date(document.uploadedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
                {document && (
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    document.status === 'approved' ? 'bg-green-100 text-green-800' :
                    document.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {t(`kyc.status.${document.status}`, document.status)}
                  </span>
                )}
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
          <Shield className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">
            {kycData.documents.filter(doc => doc.status === 'approved').length}
          </p>
          <p className="text-sm text-gray-600">
            {t('kyc.approvedDocuments', 'Documentos Aprovados')}
          </p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
          <Clock className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">
            {kycData.documents.filter(doc => doc.status === 'pending_review').length}
          </p>
          <p className="text-sm text-gray-600">
            {t('kyc.pendingDocuments', 'Documentos Pendentes')}
          </p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
          <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">
            {kycData.progress.percentage}%
          </p>
          <p className="text-sm text-gray-600">
            {t('kyc.completionRate', 'Taxa de Conclusão')}
          </p>
        </div>
      </motion.div>

      {/* Recent Documents */}
      {kycData.documents.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white p-6 rounded-lg shadow-sm border"
        >
          <h4 className="font-medium text-gray-900 mb-4">
            {t('kyc.recentDocuments', 'Documentos Recentes')}
          </h4>
          
          <div className="space-y-3">
            {kycData.documents.slice(0, 3).map((document, index) => (
              <motion.div
                key={document._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
              >
                <FileText className="w-5 h-5 text-gray-500" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    {getDocumentTypeName(document.documentType)}
                  </p>
                  <p className="text-sm text-gray-600">
                    {new Date(document.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
                {getStatusIcon(document.status)}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default KYCStatus
