const crypto = require('node:crypto');

const SCRYPT_KEYLEN = 64;
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const COOKIE_NAME = 'session';

const SESSION_SECRET = process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex');
if (!process.env.SESSION_SECRET) {
  console.warn(
    'SESSION_SECRET не задан — используется случайный секрет, все сессии сбросятся при перезапуске сервера. ' +
      'Задайте SESSION_SECRET в .env (см. .env.example).',
  );
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, SCRYPT_KEYLEN).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, storedHash) {
  if (!storedHash || !password) return false;
  const [salt, hashHex] = storedHash.split(':');
  if (!salt || !hashHex) return false;

  const hash = crypto.scryptSync(password, salt, SCRYPT_KEYLEN);
  const stored = Buffer.from(hashHex, 'hex');
  return hash.length === stored.length && crypto.timingSafeEqual(hash, stored);
}

function sign(value) {
  const sig = crypto.createHmac('sha256', SESSION_SECRET).update(value).digest('hex');
  return `${value}.${sig}`;
}

function unsign(signedValue) {
  const idx = signedValue.lastIndexOf('.');
  if (idx === -1) return null;

  const value = signedValue.slice(0, idx);
  const sig = signedValue.slice(idx + 1);
  const expectedSig = crypto.createHmac('sha256', SESSION_SECRET).update(value).digest('hex');

  const sigBuf = Buffer.from(sig, 'hex');
  const expectedBuf = Buffer.from(expectedSig, 'hex');
  if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
    return null;
  }
  return value;
}

function createSessionValue() {
  const expiresAt = Date.now() + SESSION_TTL_MS;
  return sign(String(expiresAt));
}

// In-memory only: fine for a single-process personal deployment. Revoked
// tokens are pruned on every call so this can't grow past "currently
// valid-but-logged-out" sessions.
const revokedSessions = new Set();

function revokeSession(signedValue) {
  if (!signedValue) return;
  for (const token of revokedSessions) {
    if (!isSessionValid(token, { skipRevocationCheck: true })) {
      revokedSessions.delete(token);
    }
  }
  revokedSessions.add(signedValue);
}

function isSessionValid(signedValue, { skipRevocationCheck = false } = {}) {
  if (!signedValue) return false;
  if (!skipRevocationCheck && revokedSessions.has(signedValue)) return false;

  const value = unsign(signedValue);
  if (value === null) return false;

  const expiresAt = Number(value);
  return Number.isFinite(expiresAt) && Date.now() < expiresAt;
}

function parseCookies(header) {
  const cookies = {};
  if (!header) return cookies;

  for (const part of header.split(';')) {
    const idx = part.indexOf('=');
    if (idx === -1) continue;
    const key = part.slice(0, idx).trim();
    const value = part.slice(idx + 1).trim();
    if (key) cookies[key] = decodeURIComponent(value);
  }
  return cookies;
}

function requireAuth(req, res, next) {
  const cookies = parseCookies(req.headers.cookie);
  if (!isSessionValid(cookies[COOKIE_NAME])) {
    return res.status(401).json({ error: 'Требуется авторизация', code: 'UNAUTHORIZED' });
  }
  next();
}

module.exports = {
  hashPassword,
  verifyPassword,
  createSessionValue,
  isSessionValid,
  revokeSession,
  parseCookies,
  requireAuth,
  COOKIE_NAME,
  SESSION_TTL_MS,
};
