// Configuração robusta do AWS Amplify
// Evita erros durante o build e deploy

let isConfigured = false;

export function configureAmplify() {
  // Evita configuração duplicada
  if (isConfigured) {
    return;
  }

  try {
    // Verifica se estamos no ambiente correto
    if (typeof window !== 'undefined') {
      // Importação dinâmica para evitar problemas de SSR
      import('aws-amplify').then(({ Amplify }) => {
        import('../aws-exports').then((awsExports) => {
          try {
            Amplify.configure(awsExports.default || awsExports);
            console.log('AWS Amplify configurado com sucesso');
            isConfigured = true;
          } catch (error) {
            console.warn('Erro ao configurar AWS Amplify:', error);
          }
        }).catch((error) => {
          console.warn('Erro ao importar aws-exports:', error);
        });
      }).catch((error) => {
        console.warn('Erro ao importar aws-amplify:', error);
      });
    }
  } catch (error) {
    console.warn('Erro na configuração do Amplify:', error);
    // Não falha o build se houver erro na configuração
  }
}

// Configuração automática se estiver no cliente
if (typeof window !== 'undefined') {
  // Aguarda o DOM estar pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', configureAmplify);
  } else {
    configureAmplify();
  }
}

export default configureAmplify;
