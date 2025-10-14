export async function onRequest(context) {
  const { env } = context;
  
  try {
    const db = env.DB;
    const results = {};

    // Test basic connection
    results.connection = await db.prepare('SELECT 1 as test').first();

    // Test tables
    results.tables = await db.prepare(`
      SELECT name FROM sqlite_master 
      WHERE type='table'
    `).all();

    // Test users table
    results.users = await db.prepare(`
      SELECT COUNT(*) as count 
      FROM users
    `).first();

    // Test recovery_codes table
    results.recovery = await db.prepare(`
      SELECT COUNT(*) as count 
      FROM recovery_codes
    `).first();

    return Response.json({
      success: true,
      results
    });
  } catch (error) {
    console.error('Database Error:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}