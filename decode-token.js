// DECODIFICAR TOKEN JWT
const token = process.argv[2];

if (!token) {
  console.log('❌ Uso: node decode-token.js <TOKEN>');
  process.exit(1);
}

const [headerB64, payloadB64, signatureB64] = token.split('.');

console.log('\n📦 TOKEN DECODIFICADO:\n');
console.log('='.repeat(60));

try {
  const header = JSON.parse(Buffer.from(headerB64, 'base64').toString());
  console.log('\n🔹 HEADER:');
  console.log(JSON.stringify(header, null, 2));
} catch (e) {
  console.log('❌ Erro ao decodificar header:', e.message);
}

try {
  const payload = JSON.parse(Buffer.from(payloadB64, 'base64').toString());
  console.log('\n🔹 PAYLOAD:');
  console.log(JSON.stringify(payload, null, 2));
  
  if (payload.exp) {
    const expDate = new Date(payload.exp);
    const now = new Date();
    console.log('\n⏰ EXPIRAÇÃO:');
    console.log('  Expira em:', expDate.toLocaleString('pt-BR'));
    console.log('  Agora:', now.toLocaleString('pt-BR'));
    console.log('  Válido:', expDate > now ? '✅ SIM' : '❌ EXPIRADO');
  }
} catch (e) {
  console.log('❌ Erro ao decodificar payload:', e.message);
}

console.log('\n🔹 SIGNATURE (Base64):');
console.log(signatureB64.substring(0, 50) + '...');
console.log('\n' + '='.repeat(60) + '\n');

