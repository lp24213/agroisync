import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import hcaptcha from 'hcaptcha';
import fs from 'fs';
import path from 'path';

const USERS_FILE = path.resolve(process.cwd(), 'data', 'users.json');
const LOGS_FILE = path.resolve(process.cwd(), 'data', 'login_logs.json');
const HCAPTCHA_SECRET = process.env.HCAPTCHA_SECRET || '';

function saveUser(user: any) {
  let users = [];
  if (fs.existsSync(USERS_FILE)) {
    users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
  }
  users.push(user);
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

function logEvent(event: any) {
  let logs = [];
  if (fs.existsSync(LOGS_FILE)) {
    logs = JSON.parse(fs.readFileSync(LOGS_FILE, 'utf8'));
  }
  logs.push(event);
  fs.writeFileSync(LOGS_FILE, JSON.stringify(logs, null, 2));
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
  const { username, email, password, confirmPassword, captchaToken } = req.body;
  if (!username || !email || !password || !confirmPassword || !captchaToken) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Senhas não coincidem' });
  }
  // Captcha verification
  const captcha = await hcaptcha.verify(HCAPTCHA_SECRET, captchaToken);
  if (!captcha.success) {
    logEvent({ type: 'register-fail-captcha', email, ip: req.socket.remoteAddress, time: Date.now() });
    return res.status(400).json({ message: 'Captcha inválido' });
  }
  // Password validation
  const strong = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/;
  if (!strong.test(password)) {
    return res.status(400).json({ message: 'Senha fraca (mínimo 12 caracteres, maiúscula, minúscula, número, símbolo)' });
  }
  // Hash password
  const hash = await bcrypt.hash(password, 12);
  const user = { id: uuidv4(), username, email, password: hash, createdAt: Date.now(), twoFA: false, webauthn: false };
  saveUser(user);
  logEvent({ type: 'register-success', email, ip: req.socket.remoteAddress, time: Date.now() });
  return res.status(201).json({ success: true });
}
