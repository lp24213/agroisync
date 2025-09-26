import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const createAdminUser = async () => {
  try {
    // Conectar ao MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/agroisync');
    console.log('Conectado ao MongoDB');

    // Verificar se já existe um admin
    const existingAdmin = await User.findOne({ isAdmin: true });
    if (existingAdmin) {
      console.log('Usuário administrador já existe:', existingAdmin.email);
      return;
    }

    // Criar senha hash
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash('admin123456', saltRounds);

    // Criar usuário admin
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
    console.log('Usuário administrador criado com sucesso!');
    console.log('Email: admin@agroisync.com');
    console.log('Senha: admin123456');
    console.log('IMPORTANTE: Altere a senha após o primeiro login!');

  } catch (error) {
    console.error('Erro ao criar usuário admin:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Desconectado do MongoDB');
  }
};

// Executar se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  createAdminUser();
}

export default createAdminUser;