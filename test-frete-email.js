// TESTE: CRIAR FRETE E VERIFICAR EMAIL DE RASTREIO
const SITE_URL = 'https://agroisync.com';
const EMAIL = 'luispaulo-de-oliveira@hotmail.com';
const PASSWORD = 'Th@ys1522';

async function log(type, msg) {
  const colors = {
    success: '\x1b[32m✅',
    error: '\x1b[31m❌',
    warning: '\x1b[33m⚠️',
    info: '\x1b[36mℹ️'
  };
  console.log(`${colors[type] || colors.info} ${msg}\x1b[0m`);
}

async function test() {
  console.log('\n═══════════════════════════════════════════════════════');
  console.log('  🚛 TESTE: CRIAÇÃO DE FRETE + EMAIL RASTREIO');
  console.log('═══════════════════════════════════════════════════════\n');
  
  // 1. LOGIN
  log('info', '1️⃣ Fazendo login...');
  const loginResponse = await fetch(`${SITE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD })
  });
  
  const loginData = await loginResponse.json();
  if (!loginData.success || !loginData.data?.token) {
    log('error', 'Login falhou');
    return;
  }
  
  const token = loginData.data.token;
  log('success', `Login OK - Token: ${token.substring(0, 30)}...`);
  
  // 2. VERIFICAR LIMITES
  log('info', '\n2️⃣ Verificando limites...');
  const limitsResponse = await fetch(`${SITE_URL}/api/user/limits`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  const limitsData = await limitsResponse.json();
  if (!limitsData.success) {
    log('error', 'Falha ao obter limites');
    return;
  }
  
  log('info', `  Fretes: ${limitsData.data.current.freights}/${limitsData.data.limits.freights}`);
  log('info', `  Pode adicionar? ${limitsData.data.canAddFreight ? 'SIM' : 'NÃO'}`);
  
  if (!limitsData.data.canAddFreight) {
    log('warning', 'LIMITE ATINGIDO! Não pode criar mais fretes.');
    log('info', '  Isso está CORRETO se o usuário já atingiu 20 fretes.');
    return;
  }
  
  // 3. CRIAR FRETE
  log('info', '\n3️⃣ Criando novo frete...');
  const freightData = {
    origin: 'Sinop, MT',
    destination: 'São Paulo, SP',
    cargo_type: 'graos',
    cargo_description: 'Soja em grãos',
    weight: 30000,
    vehicle_type: 'carreta',
    licensePlate: 'ABC-1234',
    vehicleModel: 'Scania R450',
    price: 8500.00,
    description: 'Frete de teste para verificar email de rastreio',
    pickup_date: new Date(Date.now() + 86400000).toISOString(),
    contact_name: 'Luis Paulo',
    contact_phone: '(11) 99999-9999'
  };
  
  const freightResponse = await fetch(`${SITE_URL}/api/freights`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(freightData)
  });
  
  const freightResult = await freightResponse.json();
  
  if (freightResponse.status === 403) {
    log('success', '✅ LIMITE FUNCIONANDO! API retornou 403');
    log('info', `  Mensagem: ${freightResult.error}`);
    return;
  }
  
  if (!freightResult.success) {
    log('error', `Falha ao criar frete: ${freightResult.error}`);
    log('info', 'Detalhes:', JSON.stringify(freightResult, null, 2));
    return;
  }
  
  log('success', 'Frete criado com sucesso!');
  log('info', `  ID: ${freightResult.data.id || freightResult.data.freightId}`);
  
  // 4. AGUARDAR EMAIL
  log('info', '\n4️⃣ Aguardando envio de email...');
  log('info', '  (aguardando 3 segundos para processamento)');
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // 5. VERIFICAR SE FRETE TEM TRACKING CODE
  const freightId = freightResult.data.id || freightResult.data.freightId;
  log('info', '\n5️⃣ Verificando código de rastreio...');
  
  try {
    const trackingResponse = await fetch(`${SITE_URL}/api/freight/${freightId}`);
    const trackingData = await trackingResponse.json();
    
    if (trackingData.success && trackingData.data) {
      log('success', 'Frete encontrado na API');
      if (trackingData.data.tracking_code) {
        log('success', `Código de rastreio: ${trackingData.data.tracking_code}`);
      } else {
        log('warning', 'Frete não tem código de rastreio');
      }
    }
  } catch (error) {
    log('warning', 'Não foi possível verificar rastreio via API');
  }
  
  // 6. INSTRUÇÕES PARA VERIFICAR EMAIL
  console.log('\n═══════════════════════════════════════════════════════');
  console.log('  📧 VERIFICAÇÃO DE EMAIL');
  console.log('═══════════════════════════════════════════════════════\n');
  
  log('info', '✉️  VERIFICAR MANUALMENTE:');
  log('info', `  1. Abrir email: ${EMAIL}`);
  log('info', '  2. Procurar email de: noreply@agroisync.com');
  log('info', '  3. Assunto: "Rastreamento de Frete" ou similar');
  log('info', `  4. Verificar se contém ID do frete: ${freightId}`);
  log('info', '  5. Verificar se tem link de rastreamento\n');
  
  if (freightId) {
    log('info', `🔗 Link de rastreio esperado:`);
    log('info', `   ${SITE_URL}/rastreio/${freightId}\n`);
  }
  
  console.log('═══════════════════════════════════════════════════════\n');
}

test().catch(error => {
  console.error('❌ Erro:', error.message);
});

