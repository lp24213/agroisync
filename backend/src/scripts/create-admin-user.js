import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import dotenv from 'dotenv';

import logger from '../utils/logger.js';
dotenv.config();

const createAdminUser = async () => {
  try {
    // Conectar ao MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/agroisync');
    if (process.env.NODE_ENV !== 'production') {
      logger.info('Conectado ao MongoDB');
    }
    // Verificar se jÃ¡ existe um admin
    const existingAdmin = await User.findOne({ isAdmin: true });
    if (existingAdmin) {
      if (process.env.NODE_ENV !== 'production') {
        logger.info('UsuÃ¡rio administrador jÃ¡ existe:', existingAdmin.email);
      }
      return;
    }

    // Criar senha hash
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash('admin123456', saltRounds);

    // Criar usuÃ¡rio admin
    const adminUser = new User({
      name: 'Administrador do Sistema',
      email: 'admin@agroisync.com',
      password: hashedPassword,
      phone: '+5511999999999',
      isAdmin: true,
      adminPermissions: ['*'], // Super admin
      adminRole: 'super_admin',
      isEmailVerified: true,
      isPhoneVerified: true,
      isActive: true,
      plan: 'enterprise',
      businessType: 'all',
      lgpdConsent: true,
      lgpdConsentDate: Math.floor(Date.now() / 1000),
      dataProcessingConsent: true,
      marketingConsent: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await adminUser.save();
    if (process.env.NODE_ENV !== 'production') {
      logger.info('UsuÃ¡rio administrador criado com sucesso!');
    }
    if (process.env.NODE_ENV !== 'production') {
      logger.info('Email: admin@agroisync.com');
    }
    if (process.env.NODE_ENV !== 'production') {
      logger.info('Senha: admin123456');
    }
    if (process.env.NODE_ENV !== 'production') {
      logger.info('IMPORTANTE: Altere a senha apÃ³s o primeiro login!');
    }
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      logger.error('Erro ao criar usuÃ¡rio admin:', error);
    }
  } finally {
    await mongoose.disconnect();
    if (process.env.NODE_ENV !== 'production') {
      logger.info('Desconectado do MongoDB');
    }
  }
};

// Executar se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  createAdminUser();
}

export default createAdminUser;
