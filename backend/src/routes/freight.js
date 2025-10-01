// Placeholder para rotas de frete
export function handleFreightRoutes(request, env, url) {
  return new Response(
    JSON.stringify({
      success: true,
      message: 'Freight routes - Em desenvolvimento',
      path: url.pathname
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    }
  );
}
