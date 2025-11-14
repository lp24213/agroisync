import React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0
    };
  }

  static getDerivedStateFromError(error) {
    // Atualizar state para renderizar UI de fallback
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log do erro para serviço de monitoramento (Sentry, LogRocket, etc)
    console.error('ErrorBoundary capturou erro:', error, errorInfo);

    this.setState({
      error,
      errorInfo,
      errorCount: this.state.errorCount + 1
    });

    // Enviar para serviço de logging (descomentar quando configurar)
    // if (window.Sentry) {
    //   window.Sentry.captureException(error, { extra: errorInfo });
    // }
  }

  handleReset() {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  }

  handleReload() {
    window.location.reload();
  }

  handleGoHome() {
    window.location.href = '/';
  }

  render() {
    if (this.state.hasError) {
      // UI de erro customizada
      return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-2xl">
            {/* Ícone de Erro */}
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-red-100 p-6">
                <AlertCircle className="h-16 w-16 text-red-600" />
              </div>
            </div>

            {/* Título */}
            <h1 className="mb-4 text-center text-3xl font-bold text-gray-900">
              Oops! Algo deu errado
            </h1>

            {/* Descrição */}
            <p className="mb-6 text-center text-gray-600">
              Encontramos um erro inesperado. Não se preocupe, sua informação está segura.
              Nossa equipe foi notificada automaticamente.
            </p>

            {/* Informações do Erro */}
            {this.state.error && (
              <div className="mb-6 rounded-lg bg-red-50 p-4">
                <h3 className="mb-2 font-semibold text-red-900">Detalhes técnicos:</h3>
                <pre className="overflow-auto whitespace-pre-wrap text-xs text-red-800">
                  {this.state.error.toString()}
                </pre>
                {this.state.errorInfo?.componentStack && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-sm font-medium text-red-900">
                      Ver componentes afetados
                    </summary>
                    <pre className="mt-2 overflow-auto text-xs text-red-700">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            {/* Estatísticas */}
            {this.state.errorCount > 1 && (
              <div className="mb-6 rounded-lg bg-yellow-50 p-4 text-center">
                <p className="text-sm text-yellow-800">
                  ⚠️ Este erro ocorreu {this.state.errorCount} vez(es). 
                  Considere recarregar a página.
                </p>
              </div>
            )}

            {/* Botões de Ação */}
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              {/* Tentar Novamente */}
              <button
                onClick={this.handleReset}
                className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
              >
                <RefreshCw className="h-5 w-5" />
                Tentar Novamente
              </button>

              {/* Recarregar Página */}
              <button
                onClick={this.handleReload}
                className="flex items-center justify-center gap-2 rounded-lg bg-gray-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-gray-700"
              >
                <RefreshCw className="h-5 w-5" />
                Recarregar Página
              </button>

              {/* Ir para Home */}
              <button
                onClick={this.handleGoHome}
                className="flex items-center justify-center gap-2 rounded-lg border-2 border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
              >
                <Home className="h-5 w-5" />
                Ir para Início
              </button>
            </div>

            {/* Informações de Suporte */}
            <div className="mt-8 border-t border-gray-200 pt-6 text-center">
              <p className="mb-2 text-sm text-gray-600">
                Precisa de ajuda? Entre em contato com nosso suporte:
              </p>
              <div className="flex flex-col gap-2 text-sm">
                <a
                  href="mailto:suporte@agroisync.com"
                  className="text-blue-600 hover:underline"
                >
                  📧 suporte@agroisync.com
                </a>
                <a
                  href="https://wa.me/5565999999999"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 hover:underline"
                >
                  💬 WhatsApp Suporte
                </a>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Renderizar children normalmente se não houver erro
    return this.props.children;
  }
}

export default ErrorBoundary;
