// Middleware para Cloudflare Pages - Atualizado com nova URL do backend
export const onRequest = async ({ request, next }) => {
  const url = new URL(request.url);

  // Allowlist de origens confiáveis
  const allowedOrigins = new Set([
    "https://agroisync.com",
    "https://www.agroisync.com",
    "https://agroisync.pages.dev",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
  ]);
  const requestOrigin = request.headers.get("origin");
  let corsOrigin = "https://agroisync.com";
  if (allowedOrigins.has(requestOrigin)) {
    corsOrigin = requestOrigin;
  }

  // Proxy: encaminhar /api/* para o worker do backend (domínio correto)
  if (url.pathname.startsWith("/api/")) {
    const target = `https://agroisync-api.contato-00d.workers.dev${url.pathname}${url.search}`;
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
    resp.headers.set("Access-Control-Allow-Origin", corsOrigin);
    resp.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS",
    );
    resp.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization",
    );
    resp.headers.set("Vary", "Origin");
    return resp;
  }

  // Demais rotas seguem para o frontend com fallback SPA
  const response = await next();

  // Se 404 em rota que parece ser de SPA (sem extensão), servir index.html
  const pathLooksLikeSpaRoute = !/\.[a-zA-Z0-9]{1,8}$/.test(url.pathname);
  const acceptsHtml = (request.headers.get("accept") || "").includes(
    "text/html",
  );

  if (response.status === 404 && pathLooksLikeSpaRoute && acceptsHtml) {
    // Reescrever a requisição para /index.html, evitando 301/302
    const indexRequest = new Request(
      new URL("/index.html", request.url),
      request,
    );
    const htmlResponse = await next(indexRequest);
    htmlResponse.headers.set("Access-Control-Allow-Origin", corsOrigin);
    htmlResponse.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS",
    );
    htmlResponse.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization",
    );
    htmlResponse.headers.set("Vary", "Origin");
    return htmlResponse;
  }

  response.headers.set("Access-Control-Allow-Origin", corsOrigin);
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization",
  );
  response.headers.set("Vary", "Origin");
  return response;
};
