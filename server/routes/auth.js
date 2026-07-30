const express = require('express');
const auth = require('../auth');

const router = express.Router();

const MAX_LOGIN_ATTEMPTS = 5;
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000;
const loginAttempts = new Map();

function isRateLimited(ip) {
  const record = loginAttempts.get(ip);
  if (!record) return false;
  if (Date.now() - record.firstAttemptAt > ATTEMPT_WINDOW_MS) {
    loginAttempts.delete(ip);
    return false;
  }
  return record.count >= MAX_LOGIN_ATTEMPTS;
}

function recordFailedAttempt(ip) {
  const record = loginAttempts.get(ip);
  if (!record || Date.now() - record.firstAttemptAt > ATTEMPT_WINDOW_MS) {
    loginAttempts.set(ip, { count: 1, firstAttemptAt: Date.now() });
  } else {
    record.count += 1;
  }
}

function clearAttempts(ip) {
  loginAttempts.delete(ip);
}

function cookieFlags(req) {
  const secure = req.protocol === 'https';
  return `Path=/; HttpOnly; SameSite=Lax${secure ? '; Secure' : ''}`;
}

router.post('/login', (req, res) => {
  const ip = req.ip;
  if (isRateLimited(ip)) {
    return res.status(429).json({
      error: 'Слишком много попыток входа, попробуйте позже',
      code: 'RATE_LIMITED',
    });
  }

  const { password } = req.body || {};
  if (!auth.verifyPassword(password, process.env.AUTH_PASSWORD_HASH)) {
    recordFailedAttempt(ip);
    return res.status(401).json({ error: 'Неверный пароль', code: 'INVALID_PASSWORD' });
  }

  clearAttempts(ip);
  const maxAgeSec = Math.floor(auth.SESSION_TTL_MS / 1000);
  res.setHeader(
    'Set-Cookie',
    `${auth.COOKIE_NAME}=${auth.createSessionValue()}; Max-Age=${maxAgeSec}; ${cookieFlags(req)}`,
  );
  res.json({ ok: true });
});

router.post('/logout', (req, res) => {
  const cookies = auth.parseCookies(req.headers.cookie);
  auth.revokeSession(cookies[auth.COOKIE_NAME]);
  res.setHeader('Set-Cookie', `${auth.COOKIE_NAME}=; Max-Age=0; ${cookieFlags(req)}`);
  res.status(204).end();
});

router.get('/session', (req, res) => {
  const cookies = auth.parseCookies(req.headers.cookie);
  res.json({ authenticated: auth.isSessionValid(cookies[auth.COOKIE_NAME]) });
});

module.exports = router;
