import { connectToDatabase } from '../lib/mongodb';

async function runAdvancedPipeline() {
  const { db } = await connectToDatabase();
  const pipeline = [
    { $match: { status: 'active' } },
    { $group: { _id: '$role', total: { $sum: 1 } } },
    { $sort: { total: -1 } },
  ];
  const result = await db.collection('users').aggregate(pipeline).toArray();
  console.log('Resultado do pipeline:', result);
}

runAdvancedPipeline().catch(console.error);
