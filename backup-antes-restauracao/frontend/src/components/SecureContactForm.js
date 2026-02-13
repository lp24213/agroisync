import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Turnstile } from '@marsidev/react-turnstile';
import { handleContactForm } from '../api/contact';

export default function SecureContactForm() {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [token, setToken] = useState("");
  const [status, setStatus] = useState({ loading: false, ok: null, error: "" });

  async function onSubmit(e) {
    e.preventDefault();
    setStatus({ loading: true, ok: null, error: "" });
    
    try {
      await handleContactForm({ ...form, token });
      setStatus({ loading: false, ok: true, error: "" });
      setForm({ name: "", email: "", message: "" });
      setToken("");
    } catch (err) {
      setStatus({ loading: false, ok: false, error: err.message || "Erro" });
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      aria-label="Formulário de contato"
      className="max-w-lg mx-auto space-y-6"
    >
      <div>
        <label 
          htmlFor="name" 
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {t('form.name', 'Nome')}
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          aria-required="true"
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
        />
      </div>
      
      <div>
        <label 
          htmlFor="email" 
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {t('form.email', 'Email')}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          aria-required="true"
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
        />
      </div>
      
      <div>
        <label 
          htmlFor="message" 
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {t('form.message', 'Mensagem')}
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          aria-required="true"
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
        />
      </div>
      
      <div>
        <Turnstile
          siteKey={process.env.REACT_APP_TURNSTILE_SITE_KEY || ""}
          onSuccess={(t) => setToken(t)}
          onError={() => setToken("")}
        />
      </div>
      
      <button 
        type="submit" 
        disabled={status.loading || !token}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status.loading
          ? t("contato.sending", "Enviando...")
          : t("contato.submit", "Enviar")}
      </button>
      
      {status.ok && (
        <p role="status" className="text-green-600 text-sm">
          {t("contato.success", "Mensagem enviada com sucesso.")}
        </p>
      )}
      
      {status.ok === false && (
        <p role="alert" className="text-red-600 text-sm">
          {status.error}
        </p>
      )}
    </form>
  );
}
