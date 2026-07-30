delete process.env.NIGHTSCOUT_URL;

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { getEntriesInRange } = require('../../server/nightscout');

test('throws when NIGHTSCOUT_URL is not configured', async () => {
  await assert.rejects(() => getEntriesInRange(0, 1000), /NIGHTSCOUT_URL/);
});
