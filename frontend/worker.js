export default {
  async fetch(request, env) {
    try {
      const url = new URL(request.url);
      
      // Proxy API requests to backend
      if (url.pathname.startsWith('/api')) {
        const backendUrl = new URL(url.pathname + url.search, 'https://agroisync-backend.contato-00d.workers.dev');
        const backendRequest = new Request(backendUrl, {
          method: request.method,
          headers: request.headers,
          body: request.method !== 'GET' ? request.body : undefined,
          cf: { mirage: false } // Disable Cloudflare Mirage
        });
        return fetch(backendRequest);
      }
      
      // Serve static assets from build directory
      const response = await env.ASSETS.fetch(request);
      
      // If asset not found, serve index.html for SPA routing
      if (!response.ok && response.status === 404) {
        return await env.ASSETS.fetch(`${url.origin}/index.html`);
      }
      
      return response;
    } catch (err) {
      return new Response('Internal Error', { status: 500 });
    }
  },
};