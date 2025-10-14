// @ts-check

export async function testConnections(env) {
  const results = {
    d1: false,
    resend: false,
    turnstile: false
  };

  // Teste D1
  try {
    await env.DB.prepare('SELECT 1').first();
    results.d1 = true;
  } catch (error) {
    console.error('D1 Error:', error);
  }

  // Teste Resend
  try {
    const resend = new Resend(env.RESEND_API_KEY);
    await resend.emails.get('test').catch(err => {
      if (err.statusCode !== 404) throw err;
    });
    results.resend = true;
  } catch (error) {
    console.error('Resend Error:', error);
  }

  // Teste Turnstile
  try {
    if (env.CF_TURNSTILE_SECRET_KEY) {
      const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secret: env.CF_TURNSTILE_SECRET_KEY,
          response: 'test'
        })
      });
      const result = await response.json();
      results.turnstile = result.success === false && !result.error;
    }
  } catch (error) {
    console.error('Turnstile Error:', error);
  }

  return results;
}

export async function testDB(env) {
  const queries = [
    'SELECT name FROM sqlite_master WHERE type="table"',
    'SELECT COUNT(*) as count FROM users',
    'SELECT COUNT(*) as count FROM recovery_codes',
    'SELECT COUNT(*) as count FROM messages'
  ];

  const results = {};

  for (const query of queries) {
    try {
      const result = await env.DB.prepare(query).all();
      results[query] = result;
    } catch (error) {
      results[query] = { error: error.message };
    }
  }

  return results;
}

export async function testResend(env) {
  try {
    const resend = new Resend(env.RESEND_API_KEY);
    const result = await resend.emails.send({
      from: env.RESEND_FROM_EMAIL,
      to: 'test@agroisync.com',
      subject: 'Test Connection',
      html: '<p>Test email</p>'
    });
    return { success: true, id: result.data?.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
}