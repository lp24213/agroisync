/**
 * Script de Inicialização do MongoDB para Docker
 * Cria usuários e configurações iniciais
 */

print('🚀 Iniciando configuração do MongoDB...');

// Conectar ao banco admin
db = db.getSiblingDB('admin');

// Criar usuário administrador se não existir
if (!db.getUser('admin')) {
  print('👤 Criando usuário administrador...');
  db.createUser({
    user: 'admin',
    pwd: 'agrosync123',
    roles: [
      { role: 'userAdminAnyDatabase', db: 'admin' },
      { role: 'readWriteAnyDatabase', db: 'admin' },
      { role: 'dbAdminAnyDatabase', db: 'admin' }
    ]
  });
  print('✅ Usuário administrador criado');
} else {
  print('✅ Usuário administrador já existe');
}

// Criar banco de dados AgroSync
db = db.getSiblingDB('agrosync');

// Criar usuário específico para o banco AgroSync
if (!db.getUser('agrosync_user')) {
  print('👤 Criando usuário do AgroSync...');
  db.createUser({
    user: 'agrosync_user',
    pwd: 'agrosync_user_pass',
    roles: [
      { role: 'readWrite', db: 'agrosync' },
      { role: 'dbAdmin', db: 'agrosync' }
    ]
  });
  print('✅ Usuário do AgroSync criado');
} else {
  print('✅ Usuário do AgroSync já existe');
}

// Criar coleções iniciais
print('📊 Criando coleções iniciais...');

// Coleção de usuários
if (!db.users) {
  db.createCollection('users');
  print('✅ Coleção users criada');
}

// Coleção de pagamentos
if (!db.payments) {
  db.createCollection('payments');
  print('✅ Coleção payments criada');
}

// Coleção de conversas
if (!db.conversations) {
  db.createCollection('conversations');
  print('✅ Coleção conversations criada');
}

// Coleção de mensagens
if (!db.messages) {
  db.createCollection('messages');
  print('✅ Coleção messages criada');
}

// Coleção de produtos
if (!db.products) {
  db.createCollection('products');
  print('✅ Coleção products criada');
}

// Coleção de fretes
if (!db.freights) {
  db.createCollection('freights');
  print('✅ Coleção freights criada');
}

// Coleção de controle de migrações
if (!db.migrations) {
  db.createCollection('migrations');
  print('✅ Coleção migrations criada');
}

// Criar índices básicos
print('🔍 Criando índices básicos...');

// Índices para usuários
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "document": 1 }, { unique: true });
db.users.createIndex({ "isPaid": 1 });
db.users.createIndex({ "planActive": 1 });
db.users.createIndex({ "isAdmin": 1 });
db.users.createIndex({ "userType": 1 });
print('✅ Índices de usuários criados');

// Índices para pagamentos
db.payments.createIndex({ "userId": 1, "createdAt": -1 });
db.payments.createIndex({ "status": 1, "createdAt": -1 });
db.payments.createIndex({ "planId": 1, "status": 1 });
db.payments.createIndex({ "paymentMethod": 1, "status": 1 });
print('✅ Índices de pagamentos criados');

// Índices para conversas
db.conversations.createIndex({ "participants": 1 });
db.conversations.createIndex({ "type": 1, "status": 1 });
db.conversations.createIndex({ "product": 1 });
db.conversations.createIndex({ "freight": 1 });
db.conversations.createIndex({ "lastMessageAt": -1 });
print('✅ Índices de conversas criados');

// Índices para mensagens
db.messages.createIndex({ "conversationId": 1, "createdAt": 1 });
db.messages.createIndex({ "senderId": 1, "createdAt": -1 });
db.messages.createIndex({ "type": 1 });
print('✅ Índices de mensagens criados');

// Índices para produtos
db.products.createIndex({ "seller": 1 });
db.products.createIndex({ "category": 1 });
db.products.createIndex({ "city": 1 });
db.products.createIndex({ "price": 1 });
db.products.createIndex({ "isActive": 1 });
db.products.createIndex({ "tags": 1 });
print('✅ Índices de produtos criados');

// Índices para fretes
db.freights.createIndex({ "advertiser": 1 });
db.freights.createIndex({ "origin": 1 });
db.freights.createIndex({ "destination": 1 });
db.freights.createIndex({ "value": 1 });
db.freights.createIndex({ "isActive": 1 });
db.freights.createIndex({ "tags": 1 });
print('✅ Índices de fretes criados');

// Índices para migrações
db.migrations.createIndex({ "version": 1 }, { unique: true });
db.migrations.createIndex({ "executedAt": 1 });
print('✅ Índices de migrações criados');

// Inserir dados iniciais de configuração
print('⚙️ Inserindo configurações iniciais...');

// Configurações do sistema
if (!db.system_configs) {
  db.createCollection('system_configs');
  
  db.system_configs.insertMany([
    {
      key: 'app_version',
      value: '1.0.0',
      description: 'Versão atual da aplicação',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      key: 'maintenance_mode',
      value: false,
      description: 'Modo de manutenção ativo',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      key: 'max_file_size',
      value: 10485760, // 10MB
      description: 'Tamanho máximo de arquivo em bytes',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      key: 'allowed_file_types',
      value: [
        'image/*',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ],
      description: 'Tipos de arquivo permitidos',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      key: 'rate_limit_window',
      value: 900000, // 15 minutos
      description: 'Janela de tempo para rate limiting em ms',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      key: 'rate_limit_max_requests',
      value: 100,
      description: 'Máximo de requisições por janela de tempo',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);
  
  print('✅ Configurações do sistema inseridas');
} else {
  print('✅ Configurações do sistema já existem');
}

// Configurações de planos
if (!db.plan_configs) {
  db.createCollection('plan_configs');
  
  db.plan_configs.insertMany([
    {
      planId: 'loja-basic',
      name: 'Loja Básico',
      description: 'Plano básico para loja',
      price: 49.90,
      currency: 'BRL',
      duration: 30, // dias
      features: [
        'Anúncio de até 10 produtos',
        'Acesso básico à mensageria',
        'Suporte por email'
      ],
      limits: {
        maxProducts: 10,
        maxConversations: 5,
        maxFileSize: 5 * 1024 * 1024, // 5MB
        canUseMessaging: true,
        canAccessPrivateData: false
      },
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      planId: 'loja-pro',
      name: 'Loja Profissional',
      description: 'Plano profissional para loja',
      price: 99.90,
      currency: 'BRL',
      duration: 30, // dias
      features: [
        'Anúncio de produtos ilimitados',
        'Acesso completo à mensageria',
        'Acesso a dados privados',
        'Suporte prioritário',
        'Analytics avançados'
      ],
      limits: {
        maxProducts: -1, // ilimitado
        maxConversations: -1, // ilimitado
        maxFileSize: 10 * 1024 * 1024, // 10MB
        canUseMessaging: true,
        canAccessPrivateData: true
      },
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      planId: 'agroconecta-basic',
      name: 'AgroConecta Básico',
      description: 'Plano básico para fretes',
      price: 39.90,
      currency: 'BRL',
      duration: 30, // dias
      features: [
        'Anúncio de até 5 fretes',
        'Acesso básico à mensageria',
        'Suporte por email'
      ],
      limits: {
        maxFreights: 5,
        maxConversations: 3,
        maxFileSize: 5 * 1024 * 1024, // 5MB
        canUseMessaging: true,
        canAccessPrivateData: false
      },
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      planId: 'agroconecta-pro',
      name: 'AgroConecta Profissional',
      description: 'Plano profissional para fretes',
      price: 79.90,
      currency: 'BRL',
      duration: 30, // dias
      features: [
        'Anúncio de fretes ilimitados',
        'Acesso completo à mensageria',
        'Acesso a dados privados',
        'Suporte prioritário',
        'Rastreamento em tempo real'
      ],
      limits: {
        maxFreights: -1, // ilimitado
        maxConversations: -1, // ilimitado
        maxFileSize: 10 * 1024 * 1024, // 10MB
        canUseMessaging: true,
        canAccessPrivateData: true
      },
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);
  
  print('✅ Configurações de planos inseridas');
} else {
  print('✅ Configurações de planos já existem');
}

print('🎉 Configuração do MongoDB concluída com sucesso!');
print('📊 Banco de dados AgroSync está pronto para uso');
print('🔐 Usuários criados:');
print('   - admin (senha: agrosync123)');
print('   - agrosync_user (senha: agrosync_user_pass)');
print('🌐 Acesse MongoDB Express em: http://localhost:8081');
print('🔴 Acesse Redis Commander em: http://localhost:8082');
