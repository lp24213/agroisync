import { Router } from 'itty-router';
import { verifyToken } from '../middleware/auth.js';
import {
  createEmailAccount,
  listEmailAccounts,
  getInbox,
  getMessage,
  sendEmail,
  markAsRead,
  deleteMessage,
  deleteEmailAccount
} from '../handlers/emailCorporate.js';

const router = Router({ base: '/api/email' });

// Todas as rotas requerem autenticação
router.all('*', verifyToken);

// Rotas de contas de email
router.post('/accounts', createEmailAccount);
router.get('/accounts', listEmailAccounts);
router.delete('/accounts/:id', deleteEmailAccount);

// Rotas de mensagens
router.get('/inbox', getInbox);
router.get('/message', getMessage); // query params: accountId, uid, folder
router.post('/send', sendEmail);
router.post('/read', markAsRead);
router.delete('/message/:uid', deleteMessage);

// Handler 404
router.all('*', () => {
  return new Response(JSON.stringify({ error: 'Rota de email não encontrada' }), {
    status: 404,
    headers: { 'Content-Type': 'application/json' }
  });
});

export default router;

