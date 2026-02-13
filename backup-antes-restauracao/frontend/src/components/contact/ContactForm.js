import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { Send, Paperclip, Loader, User, CheckCircle, Mail, Phone, FileText, AlertCircle } from 'lucide-react';
import contactService from '../../services/contactService';

const ContactForm = ({ onSuccess, onError }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    subject: '',
    message: '',
    type: 'general',
    priority: 'normal'
  });
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpar erro do campo quando usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleFileUpload = e => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
      const maxSize = 10 * 1024 * 1024; // 10MB
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain'];

      if (file.size > maxSize) {
        alert(`Arquivo ${file.name} é muito grande. Máximo 10MB.`);
        return false;
      }

      if (!allowedTypes.includes(file.type)) {
        alert(`Tipo de arquivo ${file.name} não é permitido.`);
        return false;
      }

      return true;
    });

    setAttachments(prev => [...prev, ...validFiles]);
  };

  const removeAttachment = index => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      // Validar dados
      const validation = contactService.validateContactData(formData);
      if (!validation.isValid) {
        setErrors(validation.errors);
        setLoading(false);
        return;
      }

      // Upload de arquivos se houver
      const uploadedFiles = [];
      for (const file of attachments) {
        try {
          const uploadResult = await contactService.uploadAttachment(file);
          uploadedFiles.push(uploadResult);
        } catch (error) {
          console.error('Erro ao fazer upload do arquivo:', error);
        }
      }

      // Enviar mensagem
      const result = await contactService.sendContactMessage({
        ...formData,
        attachments: uploadedFiles
      });

      setSuccess(true);
      onSuccess && onSuccess(result);

      // Reset form
      setFormData({
        name: user?.name || '',
        email: user?.email || '',
        phone: '',
        subject: '',
        message: '',
        type: 'general',
        priority: 'normal'
      });
      setAttachments([]);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      setErrors({ submit: error.message || 'Erro ao enviar mensagem' });
      onError && onError(error);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div
        className='py-12 text-center'
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className='mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900'>
          <CheckCircle className='h-8 w-8 text-green-600 dark:text-green-400' />
        </div>
        <h3 className='mb-2 text-xl font-semibold text-slate-800 dark:text-slate-200'>
          {t('contact.success', 'Mensagem Enviada!')}
        </h3>
        <p className='mb-6 text-slate-600 dark:text-slate-400'>
          {t('contact.successDescription', 'Sua mensagem foi enviada com sucesso. Entraremos em contato em breve.')}
        </p>
        <button
          onClick={() => setSuccess(false)}
          className='rounded-lg bg-emerald-600 px-6 py-3 text-white transition-colors hover:bg-emerald-700'
        >
          {t('contact.sendAnother', 'Enviar Outra Mensagem')}
        </button>
      </motion.div>
    );
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className='space-y-6'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Informações Pessoais */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        <div>
          <label className='mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300'>
            {t('contact.name', 'Nome')} *
          </label>
          <div className='relative'>
            <User className='absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-slate-400' />
            <input
              type='text'
              name='name'
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full rounded-lg border py-3 pl-10 pr-4 focus:border-transparent focus:ring-2 focus:ring-emerald-500 dark:bg-slate-700 dark:text-white ${
                errors.name ? 'border-red-300 dark:border-red-600' : 'border-slate-300 dark:border-slate-600'
              }`}
              placeholder={t('contact.namePlaceholder', 'Seu nome completo')}
            />
          </div>
          {errors.name && <p className='mt-1 text-sm text-red-600 dark:text-red-400'>{errors.name}</p>}
        </div>

        <div>
          <label className='mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300'>
            {t('contact.email', 'Email')} *
          </label>
          <div className='relative'>
            <Mail className='absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-slate-400' />
            <input
              type='email'
              name='email'
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full rounded-lg border py-3 pl-10 pr-4 focus:border-transparent focus:ring-2 focus:ring-emerald-500 dark:bg-slate-700 dark:text-white ${
                errors.email ? 'border-red-300 dark:border-red-600' : 'border-slate-300 dark:border-slate-600'
              }`}
              placeholder={t('contact.emailPlaceholder', 'seu@email.com')}
            />
          </div>
          {errors.email && <p className='mt-1 text-sm text-red-600 dark:text-red-400'>{errors.email}</p>}
        </div>
      </div>

      <div>
        <label className='mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300'>
          {t('contact.phone', 'Telefone')}
        </label>
        <div className='relative'>
          <Phone className='absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-slate-400' />
          <input
            type='tel'
            name='phone'
            value={formData.phone}
            onChange={handleInputChange}
            className={`w-full rounded-lg border py-3 pl-10 pr-4 focus:border-transparent focus:ring-2 focus:ring-emerald-500 dark:bg-slate-700 dark:text-white ${
              errors.phone ? 'border-red-300 dark:border-red-600' : 'border-slate-300 dark:border-slate-600'
            }`}
            placeholder={t('contact.phonePlaceholder', '(11) 99999-9999')}
          />
        </div>
        {errors.phone && <p className='mt-1 text-sm text-red-600 dark:text-red-400'>{errors.phone}</p>}
      </div>

      {/* Tipo e Prioridade */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        <div>
          <label className='mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300'>
            {t('contact.type', 'Tipo de Contato')}
          </label>
          <select
            name='type'
            value={formData.type}
            onChange={handleInputChange}
            className='w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-emerald-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white'
          >
            <option value='general'>{t('contact.typeGeneral', 'Geral')}</option>
            <option value='support'>{t('contact.typeSupport', 'Suporte')}</option>
            <option value='sales'>{t('contact.typeSales', 'Vendas')}</option>
            <option value='partnership'>{t('contact.typePartnership', 'Parceria')}</option>
          </select>
        </div>

        <div>
          <label className='mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300'>
            {t('contact.priority', 'Prioridade')}
          </label>
          <select
            name='priority'
            value={formData.priority}
            onChange={handleInputChange}
            className='w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-emerald-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white'
          >
            <option value='low'>{t('contact.priorityLow', 'Baixa')}</option>
            <option value='normal'>{t('contact.priorityNormal', 'Normal')}</option>
            <option value='high'>{t('contact.priorityHigh', 'Alta')}</option>
            <option value='urgent'>{t('contact.priorityUrgent', 'Urgente')}</option>
          </select>
        </div>
      </div>

      {/* Assunto */}
      <div>
        <label className='mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300'>
          {t('contact.subject', 'Assunto')} *
        </label>
        <input
          type='text'
          name='subject'
          value={formData.subject}
          onChange={handleInputChange}
          className={`w-full rounded-lg border px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-emerald-500 dark:bg-slate-700 dark:text-white ${
            errors.subject ? 'border-red-300 dark:border-red-600' : 'border-slate-300 dark:border-slate-600'
          }`}
          placeholder={t('contact.subjectPlaceholder', 'Resumo da sua mensagem')}
        />
        {errors.subject && <p className='mt-1 text-sm text-red-600 dark:text-red-400'>{errors.subject}</p>}
      </div>

      {/* Mensagem */}
      <div>
        <label className='mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300'>
          {t('contact.message', 'Mensagem')} *
        </label>
        <textarea
          name='message'
          value={formData.message}
          onChange={handleInputChange}
          rows='6'
          className={`w-full resize-none rounded-lg border px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-emerald-500 dark:bg-slate-700 dark:text-white ${
            errors.message ? 'border-red-300 dark:border-red-600' : 'border-slate-300 dark:border-slate-600'
          }`}
          placeholder={t('contact.messagePlaceholder', 'Descreva sua mensagem em detalhes...')}
        />
        {errors.message && <p className='mt-1 text-sm text-red-600 dark:text-red-400'>{errors.message}</p>}
      </div>

      {/* Anexos */}
      <div>
        <label className='mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300'>
          {t('contact.attachments', 'Anexos')}
        </label>
        <div className='rounded-lg border-2 border-dashed border-slate-300 p-6 text-center dark:border-slate-600'>
          <input
            type='file'
            multiple
            onChange={handleFileUpload}
            className='hidden'
            id='file-upload'
            accept='image/*,.pdf,.txt'
          />
          <label htmlFor='file-upload' className='flex cursor-pointer flex-col items-center gap-2'>
            <Paperclip className='h-8 w-8 text-slate-400' />
            <span className='text-slate-600 dark:text-slate-400'>
              {t('contact.uploadFiles', 'Clique para anexar arquivos')}
            </span>
            <span className='text-sm text-slate-500 dark:text-slate-500'>
              {t('contact.uploadLimit', 'Máximo 10MB por arquivo')}
            </span>
          </label>
        </div>

        {attachments.length > 0 && (
          <div className='mt-4 space-y-2'>
            {attachments.map((file, index) => (
              <div
                key={index}
                className='flex items-center justify-between rounded-lg bg-slate-50 p-3 dark:bg-slate-700'
              >
                <div className='flex items-center gap-3'>
                  <FileText className='h-5 w-5 text-slate-400' />
                  <span className='text-sm text-slate-700 dark:text-slate-300'>{file.name}</span>
                  <span className='text-xs text-slate-500 dark:text-slate-500'>
                    ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
                <button
                  type='button'
                  onClick={() => removeAttachment(index)}
                  className='text-red-500 transition-colors hover:text-red-600'
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Erro de envio */}
      {errors.submit && (
        <div className='rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20'>
          <div className='flex items-center gap-2'>
            <AlertCircle className='h-5 w-5 text-red-600 dark:text-red-400' />
            <p className='text-red-600 dark:text-red-400'>{errors.submit}</p>
          </div>
        </div>
      )}

      {/* Botão de envio */}
      <button
        type='submit'
        disabled={loading}
        className='flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50'
      >
        {loading ? <Loader className='h-5 w-5 animate-spin' /> : <Send className='h-5 w-5' />}
        {loading ? t('contact.sending', 'Enviando...') : t('contact.send', 'Enviar Mensagem')}
      </button>
    </motion.form>
  );
};

export default ContactForm;
