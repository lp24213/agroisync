import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

// Configuração do Firebase Admin SDK
let adminApp = null;
let adminAuth = null;
let adminDb = null;
let adminStorage = null;

// Verificar se já existe uma instância do admin
if (!getApps().length) {
  try {
    // Configuração para desenvolvimento (usando variáveis de ambiente)
    const serviceAccount = {
      type: process.env.FIREBASE_ADMIN_TYPE || 'service_account',
      project_id: process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'agrotmsol-95542',
      private_key_id: process.env.FIREBASE_ADMIN_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_ADMIN_CLIENT_ID,
      auth_uri: process.env.FIREBASE_ADMIN_AUTH_URI || 'https://accounts.google.com/o/oauth2/auth',
      token_uri: process.env.FIREBASE_ADMIN_TOKEN_URI || 'https://oauth2.googleapis.com/token',
      auth_provider_x509_cert_url: process.env.FIREBASE_ADMIN_AUTH_PROVIDER_X509_CERT_URL || 'https://www.googleapis.com/oauth2/v1/certs',
      client_x509_cert_url: process.env.FIREBASE_ADMIN_CLIENT_X509_CERT_URL,
    };

    // Verificar se temos as credenciais necessárias
    const hasValidAdminConfig = serviceAccount.project_id && 
                               serviceAccount.private_key && 
                               serviceAccount.client_email;

    if (hasValidAdminConfig) {
      adminApp = initializeApp({
        credential: cert(serviceAccount as any),
        databaseURL: process.env.FIREBASE_DATABASE_URL || `https://agrotmsol-95542-default-rtdb.asia-southeast1.firebasedatabase.app`,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET || `agrotmsol-95542.firebasestorage.app`
      });

      // Inicializar serviços do admin
      adminAuth = getAuth(adminApp);
      adminDb = getFirestore(adminApp);
      adminStorage = getStorage(adminApp);

      console.log('Firebase Admin SDK inicializado com sucesso');
    } else {
      console.warn('Firebase Admin SDK: Credenciais não configuradas. Usando configuração padrão.');
      
      // Configuração alternativa para desenvolvimento
      adminApp = initializeApp({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'agrotmsol-95542',
        databaseURL: process.env.FIREBASE_DATABASE_URL || 'https://agrotmsol-95542-default-rtdb.asia-southeast1.firebasedatabase.app'
      });

      adminAuth = getAuth(adminApp);
      adminDb = getFirestore(adminApp);
      adminStorage = getStorage(adminApp);
    }
  } catch (error) {
    console.error('Erro ao inicializar Firebase Admin SDK:', error);
  }
} else {
  // Usar instância existente
  adminApp = getApps()[0];
  adminAuth = getAuth(adminApp);
  adminDb = getFirestore(adminApp);
  adminStorage = getStorage(adminApp);
}

// Funções utilitárias do Admin SDK
export const adminSDK = {
  // Autenticação
  auth: adminAuth,
  
  // Firestore
  db: adminDb,
  
  // Storage
  storage: adminStorage,
  
  // Funções de autenticação
  async createUser(userData: {
    email: string;
    password?: string;
    displayName?: string;
    photoURL?: string;
  }) {
    try {
      const userRecord = await adminAuth?.createUser({
        email: userData.email,
        password: userData.password,
        displayName: userData.displayName,
        photoURL: userData.photoURL,
      });
      return userRecord;
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      throw error;
    }
  },

  async getUser(uid: string) {
    try {
      const userRecord = await adminAuth?.getUser(uid);
      return userRecord;
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      throw error;
    }
  },

  async updateUser(uid: string, updates: any) {
    try {
      const userRecord = await adminAuth?.updateUser(uid, updates);
      return userRecord;
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw error;
    }
  },

  async deleteUser(uid: string) {
    try {
      await adminAuth?.deleteUser(uid);
      return true;
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      throw error;
    }
  },

  async listUsers(maxResults?: number) {
    try {
      const listUsersResult = await adminAuth?.listUsers(maxResults);
      return listUsersResult;
    } catch (error) {
      console.error('Erro ao listar usuários:', error);
      throw error;
    }
  },

  async createCustomToken(uid: string, additionalClaims?: object) {
    try {
      const customToken = await adminAuth?.createCustomToken(uid, additionalClaims);
      return customToken;
    } catch (error) {
      console.error('Erro ao criar token customizado:', error);
      throw error;
    }
  },

  async verifyIdToken(idToken: string) {
    try {
      const decodedToken = await adminAuth?.verifyIdToken(idToken);
      return decodedToken;
    } catch (error) {
      console.error('Erro ao verificar token:', error);
      throw error;
    }
  },

  // Funções do Firestore
  async addDocument(collection: string, data: any) {
    try {
      const docRef = await adminDb?.collection(collection).add({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return docRef;
    } catch (error) {
      console.error('Erro ao adicionar documento:', error);
      throw error;
    }
  },

  async getDocument(collection: string, docId: string) {
    try {
      const doc = await adminDb?.collection(collection).doc(docId).get();
      return doc?.exists ? { id: doc.id, ...doc.data() } : null;
    } catch (error) {
      console.error('Erro ao buscar documento:', error);
      throw error;
    }
  },

  async updateDocument(collection: string, docId: string, data: any) {
    try {
      await adminDb?.collection(collection).doc(docId).update({
        ...data,
        updatedAt: new Date()
      });
      return true;
    } catch (error) {
      console.error('Erro ao atualizar documento:', error);
      throw error;
    }
  },

  async deleteDocument(collection: string, docId: string) {
    try {
      await adminDb?.collection(collection).doc(docId).delete();
      return true;
    } catch (error) {
      console.error('Erro ao deletar documento:', error);
      throw error;
    }
  },

  async queryDocuments(collection: string, whereClauses: Array<[string, any, any]>) {
    try {
      let query = adminDb?.collection(collection);
      
      whereClauses.forEach(([field, operator, value]) => {
        query = query?.where(field, operator, value);
      });

      const snapshot = await query?.get();
      const documents: any[] = [];
      
      snapshot?.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });

      return documents;
    } catch (error) {
      console.error('Erro ao consultar documentos:', error);
      throw error;
    }
  }
};

export { adminApp, adminAuth, adminDb, adminStorage };
export default adminSDK;
