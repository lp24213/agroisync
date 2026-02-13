// Test minimal worker
export default {
  async fetch(request, env) {
    return new Response('OK - Worker is responding', { status: 200 });
  }
};
