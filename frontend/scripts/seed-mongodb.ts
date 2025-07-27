const { connectToDatabase } = require('../lib/mongodb');

async function seed() {
  const { db } = await connectToDatabase();
  await db.collection('users').insertMany([
    { name: 'Alice', email: 'alice@agrotm.com', role: 'admin' },
    { name: 'Bob', email: 'bob@agrotm.com', role: 'user' },
  ]);
  console.log('Seed realizado com sucesso!');
  process.exit(0);
}

seed().catch(e => { console.error(e); process.exit(1); });
