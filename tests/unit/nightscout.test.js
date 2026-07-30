process.env.NIGHTSCOUT_URL = 'http://ns.test';
process.env.NIGHTSCOUT_API_SECRET = '';
process.env.NIGHTSCOUT_DEVICE = '';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { getEntriesInRange } = require('../../server/nightscout');

test('filters out non-sgv entries and sorts ascending by date', async (t) => {
  t.mock.method(global, 'fetch', async () =>
    new Response(
      JSON.stringify([
        { type: 'sgv', sgv: 120, date: 200, direction: 'Flat' },
        { type: 'mbg', sgv: 110, date: 150 },
        { type: 'sgv', sgv: 100, date: 100, direction: 'FortyFiveUp' },
      ]),
      { status: 200 },
    ),
  );

  const entries = await getEntriesInRange(0, 1000);

  assert.deepEqual(entries, [
    { date: 100, sgv: 100, direction: 'FortyFiveUp' },
    { date: 200, sgv: 120, direction: 'Flat' },
  ]);
});

test('throws when Nightscout responds with a non-ok status', async (t) => {
  t.mock.method(global, 'fetch', async () => new Response('boom', { status: 500 }));

  await assert.rejects(() => getEntriesInRange(0, 1000), /Nightscout ответил 500/);
});
