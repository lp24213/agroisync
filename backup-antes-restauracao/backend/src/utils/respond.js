// Pequeno helper para criar respostas JSON consistente com Workers/Response
export function json(body, init = {}) {
  const headers = Object.assign({ 'Content-Type': 'application/json' }, init.headers || {});
  const opts = Object.assign({}, init, { headers });
  return new Response(JSON.stringify(body), opts);
}

export function error(status, message) {
  return json({ error: message }, { status });
}

export function status(code, message = '') {
  if (message) return new Response(message, { status: code });
  return new Response(null, { status: code });
}
