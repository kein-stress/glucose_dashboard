process.env.SESSION_SECRET = 'unit-test-session-secret';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const auth = require('../../server/auth');

test('verifyPassword accepts the correct password and rejects a wrong one', () => {
  const stored = auth.hashPassword('correct horse battery staple');
  assert.equal(auth.verifyPassword('correct horse battery staple', stored), true);
  assert.equal(auth.verifyPassword('wrong password', stored), false);
});

test('verifyPassword rejects malformed or missing stored hashes', () => {
  assert.equal(auth.verifyPassword('anything', ''), false);
  assert.equal(auth.verifyPassword('anything', undefined), false);
  assert.equal(auth.verifyPassword('anything', 'not-a-valid-hash'), false);
  assert.equal(auth.verifyPassword('', auth.hashPassword('x')), false);
});

test('a freshly created session is valid', () => {
  const session = auth.createSessionValue();
  assert.equal(auth.isSessionValid(session), true);
});

test('a tampered session signature is rejected', () => {
  const session = auth.createSessionValue();
  const [value] = session.split('.');
  assert.equal(auth.isSessionValid(`${value}.tampered`), false);
});

test('an expired session is rejected', (t) => {
  t.mock.timers.enable({ apis: ['Date'] });
  const session = auth.createSessionValue();
  assert.equal(auth.isSessionValid(session), true);

  t.mock.timers.tick(auth.SESSION_TTL_MS + 1);
  assert.equal(auth.isSessionValid(session), false);
});

test('a revoked session is rejected immediately', () => {
  const session = auth.createSessionValue();
  assert.equal(auth.isSessionValid(session), true);

  auth.revokeSession(session);
  assert.equal(auth.isSessionValid(session), false);
});

test('parseCookies reads name=value pairs from a Cookie header', () => {
  assert.deepEqual(auth.parseCookies('session=abc; locale=ru'), { session: 'abc', locale: 'ru' });
  assert.deepEqual(auth.parseCookies(undefined), {});
});
