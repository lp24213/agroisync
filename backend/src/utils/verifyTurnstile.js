import fetch from 'node-fetch';

export async function verifyTurnstile(token, remoteip = null) {
  try {
    const secret = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY;
    if (!secret) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('CLOUDFLARE_TURNSTILE_SECRET_KEY não configurado, pulando verificação');
      }
      return { success: true }; // Em desenvolvimento, sempre retorna true
    }

    const formData = new URLSearchParams();
    formData.append('secret', secret);
    formData.append('response', token);
    if (remoteip) {
      formData.append('remoteip', remoteip);
    }

    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData
    });

    const result = await response.json();
    
    if (process.env.NODE_ENV !== 'production') {
      console.log('Turnstile verification result:', result);
    }

    return result;
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Erro ao verificar token Turnstile:', error);
    }
    return { success: false, error: error.message };
  }
}
