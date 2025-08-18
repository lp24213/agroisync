import express from 'express';
import { firebaseAdmin } from '../config/firebase';
// Removed unused import

const router = express.Router();

// Middleware to verify Firebase token
const verifyFirebaseToken = async (req: any, res: any, next: any) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await firebaseAdmin.verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// User management routes
router.get('/users', verifyFirebaseToken, async (req, res) => {
  try {
    const users = await firebaseAdmin.listUsers(100);
    res.json({ users });
  } catch (error) {
    console.error('Error listing users:', error);
    res.status(500).json({ error: 'Failed to list users' });
  }
});

router.post('/users', verifyFirebaseToken, async (req, res) => {
  try {
    const { email, password, displayName, photoURL } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const userRecord = await firebaseAdmin.createUser({
      email,
      password,
      displayName,
      photoURL
    });

    return res.status(201).json({ user: userRecord });
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({ error: 'Failed to create user' });
  }
});

router.get('/users/:uid', verifyFirebaseToken, async (req, res) => {
  try {
    const { uid } = req.params;
    const userRecord = await firebaseAdmin.getUser(uid);
    return res.json({ user: userRecord });
  } catch (error) {
    console.error('Error getting user:', error);
    return res.status(500).json({ error: 'Failed to get user' });
  }
});

router.put('/users/:uid', verifyFirebaseToken, async (req, res) => {
  try {
    const { uid } = req.params;
    const updates = req.body;
    
    const userRecord = await firebaseAdmin.updateUser(uid, updates);
    res.json({ user: userRecord });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

router.delete('/users/:uid', verifyFirebaseToken, async (req, res) => {
  try {
    const { uid } = req.params;
    await firebaseAdmin.deleteUser(uid);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Firestore routes
router.post('/documents/:collection', verifyFirebaseToken, async (req, res) => {
  try {
    const { collection } = req.params;
    const data = req.body;
    
    const docRef = await firebaseAdmin.addDocument(collection, data);
    res.status(201).json({ id: docRef.id });
  } catch (error) {
    console.error('Error adding document:', error);
    res.status(500).json({ error: 'Failed to add document' });
  }
});

router.get('/documents/:collection/:docId', verifyFirebaseToken, async (req, res) => {
  try {
    const { collection, docId } = req.params;
    const document = await firebaseAdmin.getDocument(collection, docId);
    
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }
    
    res.json({ document });
  } catch (error) {
    console.error('Error getting document:', error);
    res.status(500).json({ error: 'Failed to get document' });
  }
});

router.put('/documents/:collection/:docId', verifyFirebaseToken, async (req, res) => {
  try {
    const { collection, docId } = req.params;
    const data = req.body;
    
    await firebaseAdmin.updateDocument(collection, docId, data);
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating document:', error);
    res.status(500).json({ error: 'Failed to update document' });
  }
});

router.delete('/documents/:collection/:docId', verifyFirebaseToken, async (req, res) => {
  try {
    const { collection, docId } = req.params;
    await firebaseAdmin.deleteDocument(collection, docId);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({ error: 'Failed to delete document' });
  }
});

router.get('/documents/:collection', verifyFirebaseToken, async (req, res) => {
  try {
    const { collection } = req.params;
    const { field, operator, value } = req.query;
    
    let whereClauses: Array<[string, any, any]> = [];
    
    if (field && operator && value) {
      whereClauses.push([field as string, operator as any, value as any]);
    }
    
    const documents = await firebaseAdmin.queryDocuments(collection, whereClauses);
    res.json({ documents });
  } catch (error) {
    console.error('Error querying documents:', error);
    res.status(500).json({ error: 'Failed to query documents' });
  }
});

// Custom token generation
router.post('/tokens/custom', verifyFirebaseToken, async (req, res) => {
  try {
    const { uid, additionalClaims } = req.body;
    
    if (!uid) {
      return res.status(400).json({ error: 'UID is required' });
    }
    
    const customToken = await firebaseAdmin.createCustomToken(uid, additionalClaims);
    res.json({ token: customToken });
  } catch (error) {
    console.error('Error creating custom token:', error);
    res.status(500).json({ error: 'Failed to create custom token' });
  }
});

// Health check for Firebase
router.get('/health', async (req, res) => {
  try {
    // Test Firebase connection
    const users = await firebaseAdmin.listUsers(1);
    res.json({ 
      status: 'healthy', 
      firebase: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Firebase health check failed:', error);
    res.status(500).json({ 
      status: 'unhealthy', 
      firebase: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

export default router;
