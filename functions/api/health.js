export async function onRequest(context) {
  const { request, env } = context;
  
  try {
    // Rota de healthcheck para testar as conexões
    if (request.url.includes('/api/health')) {
      const db = env.DB;
      const resend = new Resend(env.RESEND_API_KEY);

      // Testar D1
      const dbResult = await db.prepare('SELECT 1 as test').first();
      
      // Testar Resend
      const resendResult = await resend.emails.get('test')
        .catch(err => err.statusCode === 404 ? { success: true } : { error: err });

      // Testar Turnstile
      const turnstileResult = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secret: env.CF_TURNSTILE_SECRET_KEY,
          response: 'test'
        })
      }).then(r => r.json());

      return Response.json({
        status: 'operational',
        database: dbResult ? 'connected' : 'error',
        email: resendResult.error ? 'error' : 'connected',
        turnstile: turnstileResult.success === false ? 'configured' : 'error'
      });
    }

    return new Response('Not Found', { status: 404 });
  } catch (error) {
    console.error('Error:', error);
    return Response.json({
      status: 'error',
      message: error.message
    }, { status: 500 });
  }
}