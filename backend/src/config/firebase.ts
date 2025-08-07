import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

// Firebase Admin SDK Configuration
let adminApp = null;
let adminAuth = null;
let adminDb = null;
let adminStorage = null;

// Check if Firebase Admin is already initialized
if (!getApps().length) {
  try {
    // Service account configuration
    const serviceAccount = {
      type: process.env.FIREBASE_ADMIN_TYPE || 'service_account',
      project_id: process.env.FIREBASE_ADMIN_PROJECT_ID || 'agrotmsol-95542',
      private_key_id: process.env.FIREBASE_ADMIN_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_ADMIN_CLIENT_ID,
      auth_uri: process.env.FIREBASE_ADMIN_AUTH_URI || 'https://accounts.google.com/o/oauth2/auth',
      token_uri: process.env.FIREBASE_ADMIN_TOKEN_URI || 'https://oauth2.googleapis.com/token',
      auth_provider_x509_cert_url: process.env.FIREBASE_ADMIN_AUTH_PROVIDER_X509_CERT_URL || 'https://www.googleapis.com/oauth2/v1/certs',
      client_x509_cert_url: process.env.FIREBASE_ADMIN_CLIENT_X509_CERT_URL,
    };

    // Check if we have valid admin credentials
    const hasValidAdminConfig = serviceAccount.project_id && 
                               serviceAccount.private_key && 
                               serviceAccount.client_email;

    if (hasValidAdminConfig) {
      adminApp = initializeApp({
        credential: cert(serviceAccount as any),
        databaseURL: process.env.FIREBASE_DATABASE_URL || `https://agrotmsol-95542-default-rtdb.asia-southeast1.firebasedatabase.app`,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET || `agrotmsol-95542.firebasestorage.app`
      });

      // Initialize admin services
      adminAuth = getAuth(adminApp);
      adminDb = getFirestore(adminApp);
      adminStorage = getStorage(adminApp);

      console.log('✅ Firebase Admin SDK initialized successfully');
    } else {
      console.warn('⚠️ Firebase Admin SDK: Credentials not configured. Using default configuration.');
      
      // Alternative configuration for development
      adminApp = initializeApp({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID || 'agrotmsol-95542',
        databaseURL: process.env.FIREBASE_DATABASE_URL || 'https://agrotmsol-95542-default-rtdb.asia-southeast1.firebasedatabase.app'
      });

      adminAuth = getAuth(adminApp);
      adminDb = getFirestore(adminApp);
      adminStorage = getStorage(adminApp);
    }
  } catch (error) {
    console.error('❌ Error initializing Firebase Admin SDK:', error);
  }
} else {
  // Use existing instance
  adminApp = getApps()[0];
  adminAuth = getAuth(adminApp);
  adminDb = getFirestore(adminApp);
  adminStorage = getStorage(adminApp);
}

// Firebase Admin SDK utility functions
export const firebaseAdmin = {
  // Authentication
  auth: adminAuth,
  
  // Firestore
  db: adminDb,
  
  // Storage
  storage: adminStorage,
  
  // User management functions
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
      console.error('Error creating user:', error);
      throw error;
    }
  },

  async getUser(uid: string) {
    try {
      const userRecord = await adminAuth?.getUser(uid);
      return userRecord;
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  },

  async updateUser(uid: string, updates: any) {
    try {
      const userRecord = await adminAuth?.updateUser(uid, updates);
      return userRecord;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  async deleteUser(uid: string) {
    try {
      await adminAuth?.deleteUser(uid);
      return { success: true };
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  async listUsers(maxResults?: number) {
    try {
      const listUsersResult = await adminAuth?.listUsers(maxResults || 1000);
      return listUsersResult.users;
    } catch (error) {
      console.error('Error listing users:', error);
      throw error;
    }
  },

  async createCustomToken(uid: string, additionalClaims?: object) {
    try {
      const customToken = await adminAuth?.createCustomToken(uid, additionalClaims);
      return customToken;
    } catch (error) {
      console.error('Error creating custom token:', error);
      throw error;
    }
  },

  async verifyIdToken(idToken: string) {
    try {
      const decodedToken = await adminAuth?.verifyIdToken(idToken);
      return decodedToken;
    } catch (error) {
      console.error('Error verifying ID token:', error);
      throw error;
    }
  },

  // Firestore functions
  async addDocument(collection: string, data: any) {
    try {
      const docRef = await adminDb?.collection(collection).add({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return docRef;
    } catch (error) {
      console.error('Error adding document:', error);
      throw error;
    }
  },

  async getDocument(collection: string, docId: string) {
    try {
      const doc = await adminDb?.collection(collection).doc(docId).get();
      return doc?.exists ? { id: doc.id, ...doc.data() } : null;
    } catch (error) {
      console.error('Error getting document:', error);
      throw error;
    }
  },

  async updateDocument(collection: string, docId: string, data: any) {
    try {
      await adminDb?.collection(collection).doc(docId).update({
        ...data,
        updatedAt: new Date()
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating document:', error);
      throw error;
    }
  },

  async deleteDocument(collection: string, docId: string) {
    try {
      await adminDb?.collection(collection).doc(docId).delete();
      return { success: true };
    } catch (error) {
      console.error('Error deleting document:', error);
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
      console.error('Error querying documents:', error);
      throw error;
    }
  }
};

export { adminApp, adminAuth, adminDb, adminStorage };
export default firebaseAdmin;
