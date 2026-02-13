export default {
  async fetch(request, env) {
    try {
      const url = new URL(request.url);
      
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