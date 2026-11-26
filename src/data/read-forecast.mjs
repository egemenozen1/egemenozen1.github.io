export function readForecast(csv, baseline, metrics) {
  const [header, ...rows] = csv.trim().split(/\r?\n/).map((line) => line.split(','));
  const columns = ['horizon_hour', 'mae', 'evaluated_forecast_points', 'p10_p90_coverage']
    .map((name) => header.indexOf(name));
  if (columns.includes(-1) || rows.length !== 24 || baseline.length !== rows.length) {
    throw new Error('Expected 24 forecast horizons with MAE, counts and interval coverage.');
  }

  const data = rows.map((row, index) => {
    const values = columns.map((column) => row[column]?.trim());
    const [h, tft, count, cov] = values.map(Number);
    const reference = baseline[index];
    if (row.length !== header.length || values.some((value) => !value) ||
        h !== index + 1 || reference?.horizon !== h ||
        !Number.isInteger(count) || count <= 0 || reference.count !== count ||
        !Number.isFinite(tft) || tft < 0 || !Number.isFinite(reference.mae) || reference.mae < 0 ||
        !Number.isFinite(cov) || cov < 0 || cov > 1) {
      throw new Error(`Invalid forecast or persistence data at horizon ${index + 1}.`);
    }
    return { h, tft, per: reference.mae, cov, count };
  });

  const count = data.reduce((sum, row) => sum + row.count, 0);
  const mean = (key) => data.reduce((sum, row) => sum + row[key] * row.count, 0) / count;
  const matches = (value, expected) => Number.isFinite(expected) && Math.abs(value - expected) < 1e-9;
  if (count !== metrics.tft.evaluated_forecast_points || count !== metrics.persistence_baseline.evaluated_forecast_points ||
      !matches(mean('tft'), metrics.tft.mae) || !matches(mean('per'), metrics.persistence_baseline.mae) ||
      !matches(mean('cov'), metrics.tft.p10_p90_coverage)) {
    throw new Error('Forecast horizons do not reconcile with the committed aggregate metrics.');
  }

  const wins = data.filter((row) => row.per < row.tft).map((row) => row.h);
  const ranges = [];
  for (const hour of wins) {
    const last = ranges.at(-1);
    if (last && last.end + 1 === hour) last.end = hour;
    else ranges.push({ start: hour, end: hour });
  }
  const winningHours = new Intl.ListFormat('en', { type: 'conjunction' }).format(
    ranges.map(({ start, end }) => start === end ? `${start} h` : `${start}–${end} h`),
  );
  return { data, persistenceResult: winningHours ? `Persistence wins at ${winningHours}` : 'Persistence has no lower-error horizons' };
}
