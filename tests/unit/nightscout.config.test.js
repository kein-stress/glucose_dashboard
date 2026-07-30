process.env.NIGHTSCOUT_URL = 'http://ns.test';
process.env.NIGHTSCOUT_API_SECRET = 'secret123';
process.env.NIGHTSCOUT_DEVICE = 'xDrip-foo';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const { getEntriesInRange } = require('../../server/nightscout');

test('sends a hashed api-secret header when NIGHTSCOUT_API_SECRET is set', async (t) => {
  let capturedHeaders;
  t.mock.method(global, 'fetch', async (_url, opts) => {
    capturedHeaders = opts.headers;
    return new Response('[]', { status: 200 });
  });

  await getEntriesInRange(0, 1000);

  const expected = crypto.createHash('sha1').update('secret123').digest('hex');
  assert.equal(capturedHeaders['api-secret'], expected);
});

test('filters entries down to the configured device', async (t) => {
  t.mock.method(
    global,
    'fetch',
    async () =>
      new Response(
        JSON.stringify([
          { type: 'sgv', sgv: 100, date: 1, direction: 'Flat', device: 'xDrip-foo' },
          { type: 'sgv', sgv: 90, date: 2, direction: 'Flat', device: 'other-device' },
        ]),
        { status: 200 },
      ),
  );

  const entries = await getEntriesInRange(0, 1000);

  assert.equal(entries.length, 1);
  assert.equal(entries[0].sgv, 100);
});
