import { Amplify } from 'aws-amplify';
import awsExports from '../aws-exports';

// Configuração do AWS Amplify
export function configureAmplify() {
  try {
    Amplify.configure(awsExports);
    console.log('AWS Amplify configurado com sucesso');
  } catch (error) {
    console.warn('Erro ao configurar AWS Amplify:', error);
    // Não falha o build se houver erro na configuração
  }
}

// Configuração automática se estiver no cliente
if (typeof window !== 'undefined') {
  configureAmplify();
}

export default configureAmplify;
