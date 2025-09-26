export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Debug endpoint
    if (url.pathname === '/api/debug') {
      return new Response(
        JSON.stringify({
          env: {
            INFOBIP_API_KEY: env.INFOBIP_API_KEY ? 'SET' : 'NOT SET',
            INFOBIP_SMS_HOST: env.INFOBIP_SMS_HOST || 'NOT SET',
            INFOBIP_WHATSAPP_HOST: env.INFOBIP_WHATSAPP_HOST || 'NOT SET',
            INFOBIP_EMAIL_HOST: env.INFOBIP_EMAIL_HOST || 'NOT SET',
            API_KEY_LENGTH: env.INFOBIP_API_KEY ? env.INFOBIP_API_KEY.length : 0
          }
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    return new Response('OK', { headers: corsHeaders });
  }
};
