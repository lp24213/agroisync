// Middleware para Cloudflare Pages - Atualizado com nova URL do backend
export const onRequest = async ({ request, next }) => {
  const url = new URL(request.url);

  // Proxy: encaminhar /api/* para o worker do backend
  if (url.pathname.startsWith("/api/")) {
    const target = `https://agroisync-backend.contato-00d.workers.dev${url.pathname}${url.search}`;
    const proxied = await fetch(target, {
      method: request.method,
      headers: request.headers,
      body:
        request.method === "GET" || request.method === "HEAD"
          ? undefined
          : await request.clone().arrayBuffer(),
    });

    // Clonar resposta e anexar CORS
    const resp = new Response(proxied.body, {
      status: proxied.status,
      statusText: proxied.statusText,
      headers: proxied.headers,
    });
    resp.headers.set("Access-Control-Allow-Origin", "*");
    resp.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS",
    );
    resp.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization",
    );
    return resp;
  }

  // Demais rotas seguem para o frontend
  const response = await next();
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization",
  );
  return response;
};
