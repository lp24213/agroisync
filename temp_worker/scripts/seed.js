#!/usr/bin/env node

/**
 * Script de Seed para AgroSync Backend
 * Popula o banco de dados com dados iniciais para desenvolvimento
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Importar modelos
const User = require('../src/models/User');
const Payment = require('../src/models/Payment');
const Conversation = require('../src/models/Conversation');
const Message = require('../src/models/Message');

// Configurações
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/agrosync';
const SEED_COUNT = {
  users: 50,
  products: 100,
  freights: 75,
  conversations: 30,
  messages: 200
};

// Dados de exemplo
const sampleUsers = [
  {
    name: 'João Silva',
    email: 'joao.silva@agrosync.com',
    password: '123456',
    phone: '(11) 99999-9999',
    documentType: 'CPF',
    document: '123.456.789-00',
    cep: '01310-100',
    address: {
      street: 'Avenida Paulista',
      number: '1000',
      neighborhood: 'Bela Vista',
      city: 'São Paulo',
      state: 'SP'
    },
    userType: 'loja',
    userCategory: 'anunciante',
    isAdmin: false,
    isVerified: true,
    isPaid: true,
    planActive: 'loja-pro',
    planType: 'pro',
    planExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
  },
  {
    name: 'Maria Santos',
    email: 'maria.santos@agrosync.com',
    password: '123456',
    phone: '(11) 88888-8888',
    documentType: 'CNPJ',
    document: '12.345.678/0001-90',
    ie: '123.456.789',
    cep: '20040-007',
    address: {
      street: 'Rua do Ouvidor',
      number: '50',
      neighborhood: 'Centro',
      city: 'Rio de Janeiro',
      state: 'RJ'
    },
    userType: 'agroconecta',
    userCategory: 'freteiro',
    isAdmin: false,
    isVerified: true,
    isPaid: true,
    planActive: 'agroconecta-pro',
    planType: 'pro',
    planExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
  },
  {
    name: 'Admin AgroSync',
    email: 'admin@agrosync.com',
    password: 'admin123',
    phone: '(11) 77777-7777',
    documentType: 'CPF',
    document: '111.222.333-44',
    cep: '01310-100',
    address: {
      street: 'Avenida Paulista',
      number: '1000',
      neighborhood: 'Bela Vista',
      city: 'São Paulo',
      state: 'SP'
    },
    userType: 'both',
    userCategory: 'ambos',
    isAdmin: true,
    isVerified: true,
    isPaid: true,
    planActive: 'loja-pro',
    planType: 'pro',
    planExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
  }
];

const sampleProducts = [
  {
    name: 'Soja Premium',
    category: 'grãos',
    price: 180.5,
    unit: 'saca',
    quantity: 1000,
    city: 'Londrina',
    state: 'PR',
    description: 'Soja de alta qualidade, colhida na safra 2024',
    images: ['soja1.jpg', 'soja2.jpg'],
    seller: null, // Será preenchido dinamicamente
    isActive: true,
    tags: ['soja', 'grãos', 'premium', 'paraná']
  },
  {
    name: 'Milho Verde',
    category: 'grãos',
    price: 85.0,
    unit: 'saca',
    quantity: 500,
    city: 'Goiânia',
    state: 'GO',
    description: 'Milho verde fresco, ideal para consumo',
    images: ['milho1.jpg'],
    seller: null,
    isActive: true,
    tags: ['milho', 'grãos', 'verde', 'goiás']
  },
  {
    name: 'Café Arábica',
    category: 'café',
    price: 450.0,
    unit: 'saca',
    quantity: 200,
    city: 'Poços de Caldas',
    state: 'MG',
    description: 'Café arábica de altitude, torrado e moído',
    images: ['cafe1.jpg', 'cafe2.jpg'],
    seller: null,
    isActive: true,
    tags: ['café', 'arábica', 'torrado', 'minas gerais']
  }
];

const sampleFreights = [
  {
    origin: 'Londrina, PR',
    destination: 'São Paulo, SP',
    value: 2500.0,
    weight: 20000,
    volume: 100,
    truckType: 'truck',
    axles: 6,
    contact: {
      name: 'Carlos Transportes',
      phone: '(11) 66666-6666',
      email: 'carlos@transportes.com'
    },
    cpfCnpj: '12.345.678/0001-90',
    plate: 'ABC-1234',
    description: 'Transporte de soja de Londrina para São Paulo',
    advertiser: null,
    isActive: true,
    tags: ['soja', 'londrina', 'são paulo', 'truck']
  },
  {
    origin: 'Goiânia, GO',
    destination: 'Brasília, DF',
    value: 800.0,
    weight: 5000,
    volume: 25,
    truckType: 'truck',
    axles: 4,
    contact: {
      name: 'Expresso Goiás',
      phone: '(62) 55555-5555',
      email: 'expresso@goias.com'
    },
    cpfCnpj: '98.765.432/0001-10',
    plate: 'XYZ-5678',
    description: 'Transporte de milho de Goiânia para Brasília',
    advertiser: null,
    isActive: true,
    tags: ['milho', 'goiânia', 'brasília', 'truck']
  }
];

// Funções auxiliares
async function hashPassword(password) {
  return await bcrypt.hash(password, 12);
}

async function createUsers() {
  console.log('🌱 Criando usuários...');

  const users = [];

  // Criar usuários de exemplo
  for (const userData of sampleUsers) {
    const hashedPassword = await hashPassword(userData.password);
    const user = new User({
      ...userData,
      password: hashedPassword
    });
    users.push(await user.save());
  }

  // Criar usuários aleatórios
  for (let i = 0; i < SEED_COUNT.users - sampleUsers.length; i++) {
    const user = new User({
      name: `Usuário ${i + 1}`,
      email: `usuario${i + 1}@agrosync.com`,
      password: await hashPassword('123456'),
      phone: `(11) ${String(90000 + i).padStart(5, '0')}-${String(1000 + i).padStart(4, '0')}`,
      documentType: Math.random() > 0.5 ? 'CPF' : 'CNPJ',
      document:
        Math.random() > 0.5
          ? `${String(100 + i).padStart(3, '0')}.${String(200 + i).padStart(3, '0')}.${String(300 + i).padStart(3, '0')}-${String(10 + i).padStart(2, '0')}`
          : `${String(10 + i).padStart(2, '0')}.${String(200 + i).padStart(3, '0')}.${String(300 + i).padStart(3, '0')}/0001-${String(10 + i).padStart(2, '0')}`,
      cep: `${String(10000 + i).padStart(5, '0')}-${String(100 + i).padStart(3, '0')}`,
      address: {
        street: `Rua ${i + 1}`,
        number: String(i + 1),
        neighborhood: 'Centro',
        city: ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Salvador', 'Brasília'][i % 5],
        state: ['SP', 'RJ', 'MG', 'BA', 'DF'][i % 5]
      },
      userType: ['loja', 'agroconecta', 'both'][i % 3],
      userCategory: ['anunciante', 'comprador', 'freteiro', 'ambos'][i % 4],
      isAdmin: false,
      isVerified: Math.random() > 0.3,
      isPaid: Math.random() > 0.4,
      planActive:
        Math.random() > 0.5
          ? ['loja-basic', 'loja-pro', 'agroconecta-basic', 'agroconecta-pro'][i % 4]
          : null,
      planType: Math.random() > 0.5 ? ['basic', 'pro'][i % 2] : null,
      planExpiry:
        Math.random() > 0.5
          ? new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000)
          : null
    });
    users.push(await user.save());
  }

  console.log(`✅ ${users.length} usuários criados`);
  return users;
}

async function createPayments(users) {
  console.log('💰 Criando pagamentos...');

  const payments = [];
  const paidUsers = users.filter(user => user.isPaid);

  for (const user of paidUsers) {
    const payment = new Payment({
      userId: user._id,
      planId: user.planActive,
      planName: user.planActive,
      amount: user.planActive?.includes('pro') ? 99.9 : 49.9,
      currency: 'BRL',
      paymentMethod: Math.random() > 0.5 ? 'stripe' : 'crypto',
      status: 'completed',
      stripe: user.planActive?.includes('pro')
        ? {
            sessionId: `cs_${Math.random().toString(36).substr(2, 9)}`,
            customerId: `cus_${Math.random().toString(36).substr(2, 9)}`,
            subscriptionId: `sub_${Math.random().toString(36).substr(2, 9)}`
          }
        : undefined,
      crypto: user.planActive?.includes('pro')
        ? undefined
        : {
            transactionHash: `0x${Math.random().toString(36).substr(2, 64)}`,
            walletAddress: `0x${Math.random().toString(36).substr(2, 40)}`,
            network: 'ethereum'
          }
    });
    payments.push(await payment.save());
  }

  console.log(`✅ ${payments.length} pagamentos criados`);
  return payments;
}

async function createConversations(users) {
  console.log('💬 Criando conversas...');

  const conversations = [];
  const paidUsers = users.filter(user => user.isPaid);

  for (let i = 0; i < SEED_COUNT.conversations; i++) {
    const user1 = paidUsers[Math.floor(Math.random() * paidUsers.length)];
    const user2 = paidUsers[Math.floor(Math.random() * paidUsers.length)];

    if (user1._id.toString() !== user2._id.toString()) {
      const conversation = new Conversation({
        type: ['product', 'freight', 'general'][i % 3],
        participants: [user1._id, user2._id],
        title: `Conversa ${i + 1}`,
        status: 'active',
        settings: {
          allowFiles: true,
          maxFileSize: 10 * 1024 * 1024,
          allowedFileTypes: ['image/*', 'application/pdf', 'application/msword']
        }
      });
      conversations.push(await conversation.save());
    }
  }

  console.log(`✅ ${conversations.length} conversas criadas`);
  return conversations;
}

async function createMessages(conversations, users) {
  console.log('📝 Criando mensagens...');

  const messages = [];

  for (const conversation of conversations) {
    const messageCount = Math.floor(Math.random() * 10) + 1;

    for (let i = 0; i < messageCount; i++) {
      const sender =
        conversation.participants[Math.floor(Math.random() * conversation.participants.length)];
      const message = new Message({
        conversationId: conversation._id,
        senderId: sender,
        content: `Mensagem ${i + 1} da conversa ${conversation.title}`,
        type: 'text',
        readBy: conversation.participants.map(participant => ({
          userId: participant,
          readAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000)
        }))
      });
      messages.push(await message.save());

      // Atualizar conversa com a mensagem
      conversation.messages.push(message._id);
      conversation.lastMessageAt = message.createdAt;
      await conversation.save();
    }
  }

  console.log(`✅ ${messages.length} mensagens criadas`);
  return messages;
}

// Função principal
async function seed() {
  try {
    console.log('🚀 Iniciando seed do banco de dados...');

    // Conectar ao MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado ao MongoDB');

    // Limpar banco de dados
    console.log('🧹 Limpando banco de dados...');
    await User.deleteMany({});
    await Payment.deleteMany({});
    await Conversation.deleteMany({});
    await Message.deleteMany({});
    console.log('✅ Banco de dados limpo');

    // Criar dados
    const users = await createUsers();
    const payments = await createPayments(users);
    const conversations = await createConversations(users);
    const messages = await createMessages(conversations, users);

    console.log('\n🎉 Seed concluído com sucesso!');
    console.log(`📊 Resumo:`);
    console.log(`   - Usuários: ${users.length}`);
    console.log(`   - Pagamentos: ${payments.length}`);
    console.log(`   - Conversas: ${conversations.length}`);
    console.log(`   - Mensagens: ${messages.length}`);

    // Criar índices
    console.log('\n🔍 Criando índices...');
    await User.createIndexes();
    await Payment.createIndexes();
    await Conversation.createIndexes();
    await Message.createIndexes();
    console.log('✅ Índices criados');
  } catch (error) {
    console.error('❌ Erro durante o seed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Desconectado do MongoDB');
    process.exit(0);
  }
}

// Executar seed se chamado diretamente
if (require.main === module) {
  seed();
}

module.exports = { seed };
