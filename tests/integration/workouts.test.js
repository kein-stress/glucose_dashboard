process.env.DB_PATH = ':memory:';
process.env.SESSION_SECRET = 'test-session-secret';

const { test, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const db = require('../../server/db');
const authLib = require('../../server/auth');

const TEST_PASSWORD = 'test-password';
process.env.AUTH_PASSWORD_HASH = authLib.hashPassword(TEST_PASSWORD);

const app = require('../../server/app');
const nightscout = require('../../server/nightscout');

beforeEach(() => {
  db.exec('DELETE FROM workouts');
});

async function login(base) {
  const res = await fetch(`${base}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: TEST_PASSWORD }),
  });
  assert.equal(res.status, 200);
  return res.headers.get('set-cookie').split(';')[0];
}

async function withServer(fn) {
  const server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    const cookie = await login(base);
    const fetchAuthed = (path, opts = {}) =>
      fetch(`${base}${path}`, { ...opts, headers: { ...opts.headers, Cookie: cookie } });
    await fn(base, fetchAuthed);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

function validWorkoutPayload(overrides = {}) {
  return {
    category: 'cardio',
    start_time: '2026-01-01T10:00:00Z',
    end_time: '2026-01-01T10:30:00Z',
    tags: ['run'],
    ...overrides,
  };
}

test('POST /api/workouts rejects an invalid category', async () => {
  await withServer(async (base, fetchAuthed) => {
    const res = await fetchAuthed('/api/workouts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validWorkoutPayload({ category: 'yoga' })),
    });

    assert.equal(res.status, 400);
  });
});

test('POST /api/workouts rejects end_time before start_time', async () => {
  await withServer(async (base, fetchAuthed) => {
    const res = await fetchAuthed('/api/workouts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(
        validWorkoutPayload({ start_time: '2026-01-01T10:30:00Z', end_time: '2026-01-01T10:00:00Z' }),
      ),
    });

    assert.equal(res.status, 400);
  });
});

test('POST then GET /api/workouts/:id round-trips a workout', async () => {
  await withServer(async (base, fetchAuthed) => {
    const created = await fetchAuthed('/api/workouts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validWorkoutPayload()),
    }).then((r) => r.json());

    assert.equal(created.category, 'cardio');
    assert.deepEqual(created.tags, ['run']);

    const fetched = await fetchAuthed(`/api/workouts/${created.id}`).then((r) => r.json());
    assert.equal(fetched.id, created.id);
  });
});

test('GET /api/workouts/:id returns 404 for an unknown id', async () => {
  await withServer(async (base, fetchAuthed) => {
    const res = await fetchAuthed('/api/workouts/999999');
    assert.equal(res.status, 404);
  });
});

test('DELETE /api/workouts/:id removes the workout', async () => {
  await withServer(async (base, fetchAuthed) => {
    const created = await fetchAuthed('/api/workouts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validWorkoutPayload()),
    }).then((r) => r.json());

    const res = await fetchAuthed(`/api/workouts/${created.id}`, { method: 'DELETE' });
    assert.equal(res.status, 204);

    const fetched = await fetchAuthed(`/api/workouts/${created.id}`);
    assert.equal(fetched.status, 404);
  });
});

test('DELETE /api/workouts/:id returns 404 for an unknown id', async () => {
  await withServer(async (base, fetchAuthed) => {
    const res = await fetchAuthed('/api/workouts/999999', { method: 'DELETE' });
    assert.equal(res.status, 404);
  });
});

test('GET /api/workouts/:id/glucose merges nightscout entries around the workout window', async (t) => {
  await withServer(async (base, fetchAuthed) => {
    const created = await fetchAuthed('/api/workouts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validWorkoutPayload()),
    }).then((r) => r.json());

    t.mock.method(nightscout, 'getEntriesInRange', async () => [{ date: 1, sgv: 100, direction: 'Flat' }]);

    const res = await fetchAuthed(`/api/workouts/${created.id}/glucose?window=1`);
    const body = await res.json();

    assert.equal(res.status, 200);
    assert.equal(body.window_hours, 1);
    assert.equal(body.entries.length, 1);
    assert.equal(body.entries[0].sgv, 100);
  });
});

test('GET /api/workouts is rejected without a session cookie', async () => {
  const server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    const res = await fetch(`${base}/api/workouts`);
    assert.equal(res.status, 401);
    const body = await res.json();
    assert.equal(body.code, 'UNAUTHORIZED');
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('POST /api/login rejects a wrong password', async () => {
  const server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    const res = await fetch(`${base}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: 'wrong-password' }),
    });
    assert.equal(res.status, 401);
    const body = await res.json();
    assert.equal(body.code, 'INVALID_PASSWORD');
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('POST /api/logout clears the session', async () => {
  await withServer(async (base, fetchAuthed) => {
    const logoutRes = await fetchAuthed('/api/logout', { method: 'POST' });
    assert.equal(logoutRes.status, 204);

    const res = await fetchAuthed('/api/workouts');
    assert.equal(res.status, 401);
  });
});

// Runs last: locks out 127.0.0.1 for the rate-limit window, which would break
// any later test that needs to log in from this process.
test('POST /api/login rate-limits repeated wrong passwords', async () => {
  const server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    let lastStatus;
    for (let i = 0; i < 6; i += 1) {
      const res = await fetch(`${base}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: 'wrong-password' }),
      });
      lastStatus = res.status;
    }
    assert.equal(lastStatus, 429);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
