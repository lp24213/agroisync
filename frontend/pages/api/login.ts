import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const USERS_FILE = path.resolve(process.cwd(), 'data', 'users.json');
const LOGS_FILE = path.resolve(process.cwd(), 'data', 'login_logs.json');
const BLOCK_FILE = path.resolve(process.cwd(), 'data', 'blocked.json');
const MAX_ATTEMPTS = 5;
const BLOCK_TIME = 10 * 60 * 1000; // 10 minutos

function getUsers() {
  if (!fs.existsSync(USERS_FILE)) return [];
  return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
}
function logEvent(event: any) {
  let logs = [];
  if (fs.existsSync(LOGS_FILE)) {
    logs = JSON.parse(fs.readFileSync(LOGS_FILE, 'utf8'));
  }
  logs.push(event);
  fs.writeFileSync(LOGS_FILE, JSON.stringify(logs, null, 2));
}
function getBlocks() {
  if (!fs.existsSync(BLOCK_FILE)) return {};
  return JSON.parse(fs.readFileSync(BLOCK_FILE, 'utf8'));
}
function setBlocks(blocks: any) {
  fs.writeFileSync(BLOCK_FILE, JSON.stringify(blocks, null, 2));
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
  const { email, password } = req.body;
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const blocks = getBlocks();
  const key = email + '-' + ip;
  const now = Date.now();
  if (blocks[key] && blocks[key].until > now) {
    logEvent({ type: 'login-blocked', email, ip, time: now });
    return res.status(429).json({ message: 'Muitas tentativas. Tente novamente em alguns minutos.' });
  }
  let users = getUsers();
  const user = users.find((u: any) => u.email === email);
  if (!user) {
    logEvent({ type: 'login-fail', email, ip, time: now, reason: 'user-not-found' });
    return res.status(401).json({ message: 'Credenciais inválidas' });
  }
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    blocks[key] = blocks[key] || { attempts: 0, until: 0 };
    blocks[key].attempts += 1;
    if (blocks[key].attempts >= MAX_ATTEMPTS) {
      blocks[key].until = now + BLOCK_TIME;
      logEvent({ type: 'login-blocked', email, ip, time: now });
    }
    setBlocks(blocks);
    logEvent({ type: 'login-fail', email, ip, time: now, reason: 'wrong-password' });
    return res.status(401).json({ message: 'Credenciais inválidas' });
  }
  // Reset attempts on success
  if (blocks[key]) {
    delete blocks[key];
    setBlocks(blocks);
  }
  logEvent({ type: 'login-success', email, ip, time: now });
  // Gerar token de sessão simples
  res.setHeader('Set-Cookie', `session_token=${uuidv4()}; HttpOnly; Path=/; SameSite=Strict; Secure; Max-Age=86400`);
  return res.status(200).json({ success: true });
}
