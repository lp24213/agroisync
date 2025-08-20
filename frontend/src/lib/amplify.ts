/**
 * AWS Amplify Configuration - AGROISYNC
 * Configuração completa do Amplify para autenticação, API, Storage e Funções Lambda
 */

import { Amplify } from 'aws-amplify';
import { Auth } from 'aws-amplify';
import { Storage } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';

// Importar configuração do Amplify
import awsconfig from '../aws-exports';

// Configurar Amplify
Amplify.configure(awsconfig);

// Cliente GraphQL
export const client = generateClient();

// Exportar configuração
export { awsconfig };
export default Amplify;

// Objeto Auth estendido
export const AuthExtended = {
  ...Auth,
  getUserAttributes: async () => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      return user.attributes;
    } catch (error) {
      console.error('Erro ao obter atributos do usuário:', error);
      return null;
    }
  },
  signInWithRedirect: async (provider: string) => {
    try {
      await Auth.federatedSignIn({ provider });
    } catch (error) {
      console.error('Erro no login social:', error);
      throw error;
    }
  },
  signOutRedirect: async () => {
    try {
      await Auth.signOut({ global: true });
    } catch (error) {
      console.error('Erro no logout:', error);
      throw error;
    }
  }
};

// Objeto Storage estendido
export const StorageExtended = {
  upload: async (key: string, file: File, options?: any) => {
    try {
      return await Storage.put(key, file, {
        accessLevel: 'private',
        ...options
      });
    } catch (error) {
      console.error('Erro no upload:', error);
      throw error;
    }
  },
  download: async (key: string, options?: any) => {
    try {
      return await Storage.get(key, {
        accessLevel: 'private',
        ...options
      });
    } catch (error) {
      console.error('Erro no download:', error);
      throw error;
    }
  },
  getUrl: async (key: string, options?: any) => {
    try {
      return await Storage.get(key, {
        accessLevel: 'private',
        expiresIn: 3600, // 1 hora
        ...options
      });
    } catch (error) {
      console.error('Erro ao obter URL:', error);
      throw error;
    }
  },
  remove: async (key: string, options?: any) => {
    try {
      return await Storage.remove(key, {
        accessLevel: 'private',
        ...options
      });
    } catch (error) {
      console.error('Erro ao remover arquivo:', error);
      throw error;
    }
  }
};

// Funções Lambda
export const Lambda = {
  admin: {
    invoke: async (action: string, data?: any) => {
      try {
        const response = await fetch('/api/lambda/admin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${(await Auth.currentSession()).getAccessToken().getJwtToken()}`
          },
          body: JSON.stringify({ action, data })
        });
        return await response.json();
      } catch (error) {
        console.error('Erro na função admin:', error);
        throw error;
      }
    }
  },
  staking: {
    invoke: async (action: string, data?: any) => {
      try {
        const response = await fetch('/api/lambda/staking', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${(await Auth.currentSession()).getAccessToken().getJwtToken()}`
          },
          body: JSON.stringify({ action, data })
        });
        return await response.json();
      } catch (error) {
        console.error('Erro na função staking:', error);
        throw error;
      }
    }
  },
  nft: {
    invoke: async (action: string, data?: any) => {
      try {
        const response = await fetch('/api/lambda/nft', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${(await Auth.currentSession()).getAccessToken().getJwtToken()}`
          },
          body: JSON.stringify({ action, data })
        });
        return await response.json();
      } catch (error) {
        console.error('Erro na função NFT:', error);
        throw error;
      }
    }
  }
};

// Utilitários
export const Utils = {
  isAdmin: async () => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      const groups = user.signInUserSession.accessToken.payload['cognito:groups'] || [];
      return groups.includes('admin');
    } catch (error) {
      return false;
    }
  },
  isAuthenticated: async () => {
    try {
      await Auth.currentAuthenticatedUser();
      return true;
    } catch (error) {
      return false;
    }
  },
  formatError: (error: any) => {
    if (error.message) {
      return error.message;
    }
    if (error.errors && error.errors.length > 0) {
      return error.errors[0].message;
    }
    return 'Erro desconhecido';
  }
};
