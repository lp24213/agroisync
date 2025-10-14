// Safe guard: check for D1 binding presence
export default async function handler(req, res) {
  if (typeof DB === 'undefined' || DB === null) {
    console.error('D1 binding DB not found. Check wrangler.toml [[d1_databases]] binding name and worker bindings.')
    return new Response(JSON.stringify({ ok: false, error: 'database_not_configured' }), { status: 500 })
  }
  try {
    const result = await DB.prepare('SELECT 1').all()
    return new Response(JSON.stringify({ ok: true, result }), { status: 200 })
  } catch (err) {
    console.error('D1 query failed:', err)
    return new Response(JSON.stringify({ ok: false, error: 'db_query_failed' }), { status: 500 })
  }
}
