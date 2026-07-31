export async function login(password) {
  const res = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(body.error || 'Ошибка входа');
    err.code = body.code;
    throw err;
  }
  return body;
}

export async function logout() {
  await fetch('/api/logout', { method: 'POST' });
}

export async function fetchSession() {
  const res = await fetch('/api/session');
  const body = await res.json().catch(() => ({ authenticated: false }));
  return Boolean(body.authenticated);
}
