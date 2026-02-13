const crypto = require('crypto');

async function hashPassword(password) {
  const salt = 'agroisync-salt-2024';
  const data = salt + password;
  const hash = crypto.createHash('sha256').update(data).digest('base64');
  return hash;
}

async function main() {
  const password = process.argv[2] || 'Th@ys1522';
  const hash = await hashPassword(password);
  console.log('Password:', password);
  console.log('Hash:', hash);
}

main();

