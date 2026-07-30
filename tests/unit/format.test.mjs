import { test } from 'node:test';
import assert from 'node:assert/strict';
import { convertGlucose, convertToMgdl } from '../../client/src/lib/format.js';

test('mg/dL -> mmol/L -> mg/dL round-trips within rounding tolerance', () => {
  for (let mgdl = 40; mgdl <= 400; mgdl += 1) {
    const mmol = convertGlucose(mgdl, 'mmol');
    const backToMgdl = convertToMgdl(mmol, 'mmol');
    assert.ok(
      Math.abs(backToMgdl - mgdl) <= 2,
      `round-trip drifted too far for ${mgdl} mg/dL: got ${backToMgdl} mg/dL (via ${mmol} mmol/L)`,
    );
  }
});

test('mg/dL unit is a no-op in both directions', () => {
  assert.equal(convertGlucose(120, 'mgdl'), 120);
  assert.equal(convertToMgdl(120, 'mgdl'), 120);
});

test('known reference points convert correctly', () => {
  assert.equal(convertGlucose(180, 'mmol'), 10);
  assert.equal(convertToMgdl(10, 'mmol'), 180);
});
