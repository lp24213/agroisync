import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';

// Carregar variáveis de ambiente
dotenv.config();

// Configuração do MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/agroisync';

// Dados do usuário admin fixo
const ADMIN_USER = {
  name: 'Luis Paulo de Oliveira',
  email: 'luispaulodeoliveira@agrotm.com.br',
  password: 'Th@ys15221008',
  userType: 'admin',
  isAdmin: true,
  isActive: true,
  isVerified: true,
  company: {
    name: 'AGROTM',
    cnpj: '00.000.000/0001-00'
  },
  subscriptions: {
    store: {
      plan: 'enterprise',
      status: 'active',
      startDate: new Date(),
      endDate: new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000), // 100 anos
      maxAds: 999999,
      currentAds: 0
    },
    freight: {
      plan: 'enterprise',
      status: 'active',
      startDate: new Date(),
      endDate: new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000), // 100 anos
      maxFreights: 999999,
      currentFreights: 0
    }
  }
};

async function createAdminUser() {
  try {
    // Conectar ao MongoDB
    console.log('🔌 Conectando ao MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Conectado ao MongoDB com sucesso!');

    // Verificar se o usuário admin já existe
    const existingAdmin = await User.findOne({ email: ADMIN_USER.email });

    if (existingAdmin) {
      console.log('⚠️  Usuário admin já existe!');

      // Atualizar para garantir que tem todas as permissões
      if (!existingAdmin.isAdmin) {
        existingAdmin.isAdmin = true;
        existingAdmin.userType = 'admin';
        existingAdmin.isActive = true;
        existingAdmin.isVerified = true;

        // Atualizar senha se necessário
        const isPasswordValid = await bcrypt.compare(ADMIN_USER.password, existingAdmin.password);
        if (!isPasswordValid) {
          const saltRounds = 12;
          existingAdmin.password = await bcrypt.hash(ADMIN_USER.password, saltRounds);
        }

        await existingAdmin.save();
        console.log('✅ Usuário admin atualizado com sucesso!');
      } else {
        console.log('✅ Usuário admin já está configurado corretamente!');
      }

      console.log('📋 Dados do usuário admin:');
      console.log(`   Nome: ${existingAdmin.name}`);
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   Admin: ${existingAdmin.isAdmin}`);
      console.log(`   Ativo: ${existingAdmin.isActive}`);
      console.log(`   Verificado: ${existingAdmin.isVerified}`);
    } else {
      console.log('👤 Criando usuário admin...');

      // Criptografar senha
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(ADMIN_USER.password, saltRounds);

      // Criar usuário admin
      const adminUser = new User({
        ...ADMIN_USER,
        password: hashedPassword
      });

      await adminUser.save();

      console.log('✅ Usuário admin criado com sucesso!');
      console.log('📋 Dados do usuário admin:');
      console.log(`   Nome: ${adminUser.name}`);
      console.log(`   Email: ${adminUser.email}`);
      console.log(`   Admin: ${adminUser.isAdmin}`);
      console.log(`   Ativo: ${adminUser.isActive}`);
      console.log(`   Verificado: ${adminUser.isVerified}`);
    }

    console.log('\n🔐 Credenciais de acesso:');
    console.log(`   Email: ${ADMIN_USER.email}`);
    console.log(`   Senha: ${ADMIN_USER.password}`);
    console.log('\n⚠️  IMPORTANTE: Guarde essas credenciais em local seguro!');
  } catch (error) {
    console.error('❌ Erro ao criar usuário admin:', error);
    process.exit(1);
  } finally {
    // Fechar conexão
    await mongoose.connection.close();
    console.log('🔌 Conexão com MongoDB fechada.');
    process.exit(0);
  }
}

// Executar script
createAdminUser();
