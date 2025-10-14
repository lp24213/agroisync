// @ts-check
import { useState } from 'react';
import { Turnstile } from './Turnstile';

/**
 * Campo de formulário
 */
export function FormField({ label, type = 'text', required, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
        required={required}
        {...props}
      />
    </div>
  );
}

/**
 * Botão de submit
 */
export function SubmitButton({ children, loading }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 ${
        loading
          ? 'opacity-50 cursor-not-allowed'
          : 'hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
      }`}
    >
      {loading ? (
        <span className="flex items-center">
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Processando...
        </span>
      ) : (
        children
      )}
    </button>
  );
}

/**
 * Alerta de erro
 */
export function ErrorAlert({ message, onClose }) {
  return message ? (
    <div className="rounded-md bg-red-50 p-4 mb-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">{message}</h3>
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <button
              type="button"
              className="inline-flex rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              onClick={onClose}
            >
              <span className="sr-only">Fechar</span>
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  ) : null;
}

/**
 * Formulário base com Turnstile
 */
export function Form({ onSubmit, children }) {
  const [turnstileToken, setTurnstileToken] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!turnstileToken) {
      return;
    }

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    await onSubmit(data, turnstileToken);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {children}
      <Turnstile onVerify={setTurnstileToken} />
    </form>
  );
}