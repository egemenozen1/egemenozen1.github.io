import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import { test } from 'node:test';
import { readForecast } from '../src/data/read-forecast.mjs';
import { verifyRelease } from './release-check.mjs';

const load = (file) => fs.readFileSync(new URL(`../src/data/${file}`, import.meta.url), 'utf8').replace(/\r\n/g, '\n');
const csv = load('metrics_by_horizon.csv');
const baseline = JSON.parse(load('baseline.json'));
const rawMetrics = load('metrics.json');
const metrics = JSON.parse(rawMetrics);
const provenance = JSON.parse(load('provenance.json'));

test('committed forecast artifacts match provenance and reproduce the winning ranges', () => {
  const sha = (content) => createHash('sha256').update(content).digest('hex');
  assert.equal(sha(csv), provenance.horizonsSha256);
  assert.equal(sha(rawMetrics), provenance.metricsSha256);
  const result = readForecast(csv, baseline, metrics);
  assert.equal(result.data.length, 24);
  assert.equal(result.persistenceResult, 'Persistence wins at 1–3 h and 22–24 h');
});

test('forecast data rejects missing, misaligned or inconsistent measurements', () => {
  assert.throws(() => readForecast(csv.replace(/\n1,/, '\n2,'), baseline, metrics), /at horizon 1/);
  assert.throws(() => readForecast(csv, baseline.slice(1), metrics), /24 forecast horizons/);
  const wrongCounts = baseline.map((row, i) => i ? row : { ...row, count: row.count - 1 });
  assert.throws(() => readForecast(csv, wrongCounts, metrics), /at horizon 1/);
  assert.throws(() => readForecast(csv, baseline, { ...metrics, tft: { ...metrics.tft, mae: 0 } }), /aggregate/);
});

test('release requires the reviewed SHA to match the build commit', () => {
  const approval = { contentReviewed: true, legalReviewed: true, liveLinksVerified: true };
  const commit = 'a'.repeat(40);
  assert.doesNotThrow(() => verifyRelease(approval, commit, commit));
  assert.throws(() => verifyRelease(approval, commit, 'b'.repeat(40)), /exact main commit/);
  assert.throws(() => verifyRelease(approval, commit), /exact main commit/);
  assert.throws(() => verifyRelease(approval, commit, commit.slice(0, 7)), /exact main commit/);
  assert.throws(() => verifyRelease({ ...approval, legalReviewed: false }, commit, commit), /Recorded content/);
});
