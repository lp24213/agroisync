import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Smartphone, Mail, QrCode, Key, 
  CheckCircle, RefreshCw, Download, Copy
} from 'lucide-react';
import authService from '../services/authService';

const TwoFactorSetup = ({ userId, onComplete, onCancel }) => {
  const [step, setStep] = useState('setup'); // setup, verify, backup, complete
  const [method, setMethod] = useState('2FA_APP'); // 2FA_APP, SMS, EMAIL
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [secret, setSecret] = useState('');
  const [backupCodes, setBackupCodes] = useState([]);
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const initialize2FA = useCallback(async () => {
    setLoading(true);
    try {
      const result = await authService.setup2FA(userId);
      if (result.success) {
        setQrCodeUrl(result.qrCodeUrl);
        setSecret(result.secret);
        setBackupCodes(result.backupCodes);
      }
    } catch (error) {
      setError('Erro ao configurar 2FA');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (step === 'setup') {
      initialize2FA();
    }
  }, [step, initialize2FA]);

  const handleMethodChange = (newMethod) => {
    setMethod(newMethod);
    setVerificationCode('');
    setError('');
  };

  const handleVerifyCode = async () => {
    if (!verificationCode.trim()) {
      setError('Digite o código de verificação');
      return;
    }

    // setLoading(true);
    setError('');

    try {
      let result;
      
      if (method === '2FA_APP') {
        result = await authService.verify2FACode(userId, verificationCode);
      } else if (method === 'SMS') {
        result = await authService.verifyOTP(userId, verificationCode, 'SMS');
      } else if (method === 'EMAIL') {
        result = await authService.verifyOTP(userId, verificationCode, 'EMAIL');
      }

      if (result.success) {
        setSuccess('Código verificado com sucesso!');
        setTimeout(() => {
          setStep('backup');
        }, 1500);
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Erro ao verificar código');
    } finally {
      // setLoading(false);
    }
  };

  const handleComplete = () => {
    if (onComplete) {
      onComplete({
        method,
        secret,
        backupCodes
      });
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setSuccess('Copiado para a área de transferência!');
    setTimeout(() => setSuccess(''), 2000);
  };

  const downloadBackupCodes = () => {
    const content = `Códigos de Backup AgroSync\n\n${backupCodes.join('\n')}\n\nGuarde estes códigos em local seguro.`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'agrosync-backup-codes.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderSetupStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <Shield className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Configurar Autenticação em Duas Etapas</h2>
        <p className="text-gray-600">Escolha um método de verificação para sua conta</p>
      </div>

      {/* Seleção de Método */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => handleMethodChange('2FA_APP')}
          className={`p-4 border-2 rounded-lg text-center transition-all duration-200 ${
            method === '2FA_APP'
              ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <Smartphone className="w-8 h-8 mx-auto mb-2" />
          <div className="font-medium">App 2FA</div>
          <div className="text-sm text-gray-500">Google Authenticator</div>
        </button>

        <button
          onClick={() => handleMethodChange('SMS')}
          className={`p-4 border-2 rounded-lg text-center transition-all duration-200 ${
            method === 'SMS'
              ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <Smartphone className="w-8 h-8 mx-auto mb-2" />
          <div className="font-medium">SMS</div>
          <div className="text-sm text-gray-500">Código via celular</div>
        </button>

        <button
          onClick={() => handleMethodChange('EMAIL')}
          className={`p-4 border-2 rounded-lg text-center transition-all duration-200 ${
            method === 'EMAIL'
              ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <Mail className="w-8 h-8 mx-auto mb-2" />
          <div className="font-medium">E-mail</div>
          <div className="text-sm text-gray-500">Código via e-mail</div>
        </button>
      </div>

      {/* Configuração do Método Selecionado */}
      {method === '2FA_APP' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-gray-50 p-6 rounded-lg"
        >
          <h3 className="font-semibold text-gray-900 mb-4">Configurar App 2FA</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* QR Code */}
            <div className="text-center">
              <div className="bg-white p-4 rounded-lg inline-block">
                {qrCodeUrl ? (
                  <img src={qrCodeUrl} alt="QR Code 2FA" className="w-48 h-48" />
                ) : (
                  <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                    <QrCode className="w-16 h-16 text-gray-400" />
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-2">Escaneie com seu app 2FA</p>
            </div>

            {/* Chave Secreta */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Chave Secreta</h4>
              <div className="flex items-center space-x-2 mb-2">
                <code className="bg-white px-3 py-2 rounded border text-sm font-mono flex-1">
                  {secret}
                </code>
                <button
                  onClick={() => copyToClipboard(secret)}
                  className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                  title="Copiar"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-gray-500">
                Use esta chave se não conseguir escanear o QR Code
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Como configurar:</h4>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Baixe o Google Authenticator ou Authy</li>
              <li>Escaneie o QR Code ou digite a chave secreta</li>
              <li>Digite o código de 6 dígitos gerado</li>
            </ol>
          </div>
        </motion.div>
      )}

      {method === 'SMS' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-gray-50 p-6 rounded-lg"
        >
          <h3 className="font-semibold text-gray-900 mb-4">Configurar 2FA via SMS</h3>
          <p className="text-gray-600 mb-4">
            Um código será enviado para seu número de celular cadastrado.
          </p>
          <button
            onClick={() => setStep('verify')}
            className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Continuar
          </button>
        </motion.div>
      )}

      {method === 'EMAIL' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-gray-50 p-6 rounded-lg"
        >
          <h3 className="font-semibold text-gray-900 mb-4">Configurar 2FA via E-mail</h3>
          <p className="text-gray-600 mb-4">
            Um código será enviado para seu e-mail cadastrado.
          </p>
          <button
            onClick={() => setStep('verify')}
            className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Continuar
          </button>
        </motion.div>
      )}

      {/* Botões de Ação */}
      <div className="flex justify-end space-x-3">
        <button
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
        {method === '2FA_APP' && (
          <button
            onClick={() => setStep('verify')}
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Continuar
          </button>
        )}
      </div>
    </motion.div>
  );

  const renderVerifyStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <Key className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Verificar Código</h2>
        <p className="text-gray-600">
          Digite o código de 6 dígitos do seu {method === '2FA_APP' ? 'app 2FA' : method === 'SMS' ? 'SMS' : 'e-mail'}
        </p>
      </div>

      {/* Input do Código */}
      <div className="max-w-xs mx-auto">
        <input
          type="text"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
          placeholder="000000"
          className="w-full text-center text-2xl font-mono tracking-widest px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          maxLength={6}
        />
      </div>

      {/* Mensagens */}
      {error && (
        <div className="text-center text-red-600 bg-red-50 p-3 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="text-center text-emerald-600 bg-emerald-50 p-3 rounded-lg">
          {success}
        </div>
      )}

      {/* Botões de Ação */}
      <div className="flex justify-center space-x-3">
        <button
          onClick={() => setStep('setup')}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Voltar
        </button>
        <button
          onClick={handleVerifyCode}
          disabled={loading || !verificationCode.trim()}
          className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            'Verificar'
          )}
        </button>
      </div>
    </motion.div>
  );

  const renderBackupStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <CheckCircle className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Códigos de Backup</h2>
        <p className="text-gray-600">
          Guarde estes códigos em local seguro. Eles podem ser usados para acessar sua conta se perder o acesso ao 2FA.
        </p>
      </div>

      {/* Códigos de Backup */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
          {backupCodes.map((code, index) => (
            <div
              key={index}
              className="bg-white p-3 rounded border text-center font-mono text-sm"
            >
              {code}
            </div>
          ))}
        </div>

        <div className="flex justify-center space-x-3">
          <button
            onClick={downloadBackupCodes}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Baixar</span>
          </button>
          <button
            onClick={() => copyToClipboard(backupCodes.join('\n'))}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Copy className="w-4 h-4" />
            <span>Copiar</span>
          </button>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-medium text-yellow-900 mb-2">⚠️ Importante</h4>
        <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
          <li>Guarde estes códigos em local seguro</li>
          <li>Não compartilhe com ninguém</li>
          <li>Use apenas em caso de emergência</li>
        </ul>
      </div>

      {/* Botões de Ação */}
      <div className="flex justify-center">
        <button
          onClick={handleComplete}
          className="px-8 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          Finalizar Configuração
        </button>
      </div>
    </motion.div>
  );

  const renderCompleteStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center space-y-6"
    >
      <CheckCircle className="w-20 h-20 text-emerald-600 mx-auto" />
      <h2 className="text-2xl font-bold text-gray-900">2FA Configurado com Sucesso!</h2>
      <p className="text-gray-600">
        Sua conta agora está protegida com autenticação em duas etapas.
      </p>
      
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
        <h4 className="font-medium text-emerald-900 mb-2">Próximos passos:</h4>
        <ul className="text-sm text-emerald-800 space-y-1 list-disc list-inside">
          <li>Teste o login com 2FA</li>
          <li>Guarde os códigos de backup</li>
          <li>Configure em outros dispositivos se necessário</li>
        </ul>
      </div>

      <button
        onClick={onComplete}
        className="px-8 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
      >
        Continuar
      </button>
    </motion.div>
  );

  if (loading && step === 'setup') {
    return (
      <div className="text-center py-12">
        <RefreshCw className="w-12 h-12 text-emerald-600 animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Configurando 2FA...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {step === 'setup' && renderSetupStep()}
        {step === 'verify' && renderVerifyStep()}
        {step === 'backup' && renderBackupStep()}
        {step === 'complete' && renderCompleteStep()}
      </AnimatePresence>
    </div>
  );
};

export default TwoFactorSetup;
