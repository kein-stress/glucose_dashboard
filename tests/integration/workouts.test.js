process.env.DB_PATH = ':memory:';

const { test, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const db = require('../../server/db');
const app = require('../../server/app');
const nightscout = require('../../server/nightscout');

beforeEach(() => {
  db.exec('DELETE FROM workouts');
});

async function withServer(fn) {
  const server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    await fn(base);
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
  await withServer(async (base) => {
    const res = await fetch(`${base}/api/workouts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validWorkoutPayload({ category: 'yoga' })),
    });

    assert.equal(res.status, 400);
  });
});

test('POST /api/workouts rejects end_time before start_time', async () => {
  await withServer(async (base) => {
    const res = await fetch(`${base}/api/workouts`, {
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
  await withServer(async (base) => {
    const created = await fetch(`${base}/api/workouts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validWorkoutPayload()),
    }).then((r) => r.json());

    assert.equal(created.category, 'cardio');
    assert.deepEqual(created.tags, ['run']);

    const fetched = await fetch(`${base}/api/workouts/${created.id}`).then((r) => r.json());
    assert.equal(fetched.id, created.id);
  });
});

test('GET /api/workouts/:id returns 404 for an unknown id', async () => {
  await withServer(async (base) => {
    const res = await fetch(`${base}/api/workouts/999999`);
    assert.equal(res.status, 404);
  });
});

test('GET /api/workouts/:id/glucose merges nightscout entries around the workout window', async (t) => {
  await withServer(async (base) => {
    const created = await fetch(`${base}/api/workouts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validWorkoutPayload()),
    }).then((r) => r.json());

    t.mock.method(nightscout, 'getEntriesInRange', async () => [{ date: 1, sgv: 100, direction: 'Flat' }]);

    const res = await fetch(`${base}/api/workouts/${created.id}/glucose?window=1`);
    const body = await res.json();

    assert.equal(res.status, 200);
    assert.equal(body.window_hours, 1);
    assert.equal(body.entries.length, 1);
    assert.equal(body.entries[0].sgv, 100);
  });
});
