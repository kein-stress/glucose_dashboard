const crypto = require('node:crypto');

const NIGHTSCOUT_URL = (process.env.NIGHTSCOUT_URL || '').replace(/\/+$/, '');
const API_SECRET = process.env.NIGHTSCOUT_API_SECRET || '';
const DEVICE_FILTER = process.env.NIGHTSCOUT_DEVICE || '';

function authHeaders() {
  if (!API_SECRET) return {};
  return { 'api-secret': crypto.createHash('sha1').update(API_SECRET).digest('hex') };
}

// Возвращает записи глюкозы (sgv) в интервале [fromMs, toMs], отсортированные по времени по возрастанию.
async function getEntriesInRange(fromMs, toMs) {
  if (!NIGHTSCOUT_URL) {
    throw new Error('NIGHTSCOUT_URL не задан в .env');
  }

  const params = new URLSearchParams({
    'find[date][$gte]': String(fromMs),
    'find[date][$lte]': String(toMs),
    count: '10000',
  });

  const res = await fetch(`${NIGHTSCOUT_URL}/api/v1/entries.json?${params}`, {
    headers: authHeaders(),
    signal: AbortSignal.timeout(10_000),
  });

  if (!res.ok) {
    throw new Error(`Nightscout ответил ${res.status}: ${await res.text()}`);
  }

  const entries = await res.json();

  return entries
    .filter((e) => e.type === 'sgv' && typeof e.sgv === 'number')
    .filter((e) => !DEVICE_FILTER || e.device === DEVICE_FILTER)
    .map((e) => ({ date: e.date, sgv: e.sgv, direction: e.direction }))
    .sort((a, b) => a.date - b.date);
}

module.exports = { getEntriesInRange };
