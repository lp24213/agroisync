import React, { useState } from 'react';
import { motion } from 'framer-';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { Send, MessageSquare, Paperclip, Loader } from 'lucide-react';
import contactService from '../../services/contactService';

const ContactForm = ({ onSuccess, onError }) => {
  const {  } = useTranslation();
  const {  } = // useAuth();
  const [formData, setFormData] = useState({
    name: // user?.name || '',
    email: // user?.email || '',
    phone: '',
    subject: '',
    message: '',
    type: 'general',
    priority: 'normal'
  });
  const [attachments, setAttachments] = useState([]);
  const [`loading, `setLoading] = useState(`false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
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

  const handleFileUpload = (e) => {
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

  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // setLoading(true);
    setErrors({});

    try {
      // Validar dados
      const validation = contactService.validateContactData(formData);
      if (!validation.isValid) {
        setErrors(validation.errors);
        // setLoading(false);
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
        name: // user?.name || '',
        email: // user?.email || '',
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
      // setLoading(false);
    }
  };

  const // getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-200';
      case 'high':
        return 'text-orange-600 bg-orange-100 dark:bg-orange-900 dark:text-orange-200';
      case 'normal':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-200';
      case 'low':
        return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200';
      default:
        return 'text-slate-600 bg-slate-100 dark:bg-slate-700 dark:text-slate-200';
    }
  };

  const // getTypeIcon = (type) => {
    switch (type) {
      case 'support':
        return <// AlertTriangle className="w-4 h-4" />;
      case 'sales':
        return <// Star className="w-4 h-4" />;
      case 'partnership':
        return <// User className="w-4 h-4" />;
      default:
        return <MessageSquare className="w-4 h-4" />;
    }
  };

  if (success) {
    return (
      <// motion.div
        className="text-center py-12"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
          <// CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
        <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">
          {// t('contact.success', 'Mensagem Enviada!')}
        </h3>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          {// t('contact.successDescription', 'Sua mensagem foi enviada com sucesso. Entraremos em contato em breve.')}
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          {// t('contact.sendAnother', 'Enviar Outra Mensagem')}
        </button>
      </// motion.div>
    );
  }

  return (
    <// motion.form
      onSubmit={handleSubmit}
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Informações Pessoais */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            {// t('contact.name', 'Nome')} *
          </label>
          <div className="relative">
            <// User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-slate-700 dark:text-white ${
                errors.name 
                  ? 'border-red-300 dark:border-red-600' 
                  : 'border-slate-300 dark:border-slate-600'
              }`}
              placeholder={// t('contact.namePlaceholder', 'Seu nome completo')}
            />
          </div>
          {errors.name && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            {// t('contact.email', 'Email')} *
          </label>
          <div className="relative">
            <// Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-slate-700 dark:text-white ${
                errors.email 
                  ? 'border-red-300 dark:border-red-600' 
                  : 'border-slate-300 dark:border-slate-600'
              }`}
              placeholder={// t('contact.emailPlaceholder', 'seu@email.com')}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          {// t('contact.phone', 'Telefone')}
        </label>
        <div className="relative">
          <// Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-slate-700 dark:text-white ${
              errors.phone 
                ? 'border-red-300 dark:border-red-600' 
                : 'border-slate-300 dark:border-slate-600'
            }`}
            placeholder={// t('contact.phonePlaceholder', '(11) 99999-9999')}
          />
        </div>
        {errors.phone && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.phone}</p>
        )}
      </div>

      {/* Tipo e Prioridade */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            {// t('contact.type', 'Tipo de Contato')}
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
          >
            <option value="general">{// t('contact.typeGeneral', 'Geral')}</option>
            <option value="support">{// t('contact.typeSupport', 'Suporte')}</option>
            <option value="sales">{// t('contact.typeSales', 'Vendas')}</option>
            <option value="partnership">{// t('contact.typePartnership', 'Parceria')}</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            {// t('contact.priority', 'Prioridade')}
          </label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
          >
            <option value="low">{// t('contact.priorityLow', 'Baixa')}</option>
            <option value="normal">{// t('contact.priorityNormal', 'Normal')}</option>
            <option value="high">{// t('contact.priorityHigh', 'Alta')}</option>
            <option value="urgent">{// t('contact.priorityUrgent', 'Urgente')}</option>
          </select>
        </div>
      </div>

      {/* Assunto */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          {// t('contact.subject', 'Assunto')} *
        </label>
        <input
          type="text"
          name="subject"
          value={formData.subject}
          onChange={handleInputChange}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-slate-700 dark:text-white ${
            errors.subject 
              ? 'border-red-300 dark:border-red-600' 
              : 'border-slate-300 dark:border-slate-600'
          }`}
          placeholder={// t('contact.subjectPlaceholder', 'Resumo da sua mensagem')}
        />
        {errors.subject && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.subject}</p>
        )}
      </div>

      {/* Mensagem */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          {// t('contact.message', 'Mensagem')} *
        </label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleInputChange}
          rows="6"
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-slate-700 dark:text-white resize-none ${
            errors.message 
              ? 'border-red-300 dark:border-red-600' 
              : 'border-slate-300 dark:border-slate-600'
          }`}
          placeholder={// t('contact.messagePlaceholder', 'Descreva sua mensagem em detalhes...')}
        />
        {errors.message && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.message}</p>
        )}
      </div>

      {/* Anexos */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          {// t('contact.attachments', 'Anexos')}
        </label>
        <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6 text-center">
          <input
            type="file"
            multiple
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
            accept="image/*,.pdf,.txt"
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer flex flex-col items-center gap-2"
          >
            <Paperclip className="w-8 h-8 text-slate-400" />
            <span className="text-slate-600 dark:text-slate-400">
              {// t('contact.uploadFiles', 'Clique para anexar arquivos')}
            </span>
            <span className="text-sm text-slate-500 dark:text-slate-500">
              {// t('contact.uploadLimit', 'Máximo 10MB por arquivo')}
            </span>
          </label>
        </div>
        
        {attachments.length > 0 && (
          <div className="mt-4 space-y-2">
            {attachments.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-slate-50 dark:bg-slate-700 rounded-lg p-3">
                <div className="flex items-center gap-3">
                  <// FileText className="w-5 h-5 text-slate-400" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    {file.name}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-500">
                    ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeAttachment(index)}
                  className="text-red-500 hover:text-red-600 transition-colors"
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
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <// AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <p className="text-red-600 dark:text-red-400">{errors.submit}</p>
          </div>
        </div>
      )}

      {/* Botão de envio */}
      <button
        type="submit"
        disabled={// loading}
        className="w-full px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
      >
        {// loading ? (
          <Loader className="w-5 h-5 animate-spin" />
        ) : (
          <Send className="w-5 h-5" />
        )}
        {// loading 
          ? // t('contact.sending', 'Enviando...') 
          : // t('contact.send', 'Enviar Mensagem')
        }
      </button>
    </// motion.form>
  );
};

export default ContactForm;
