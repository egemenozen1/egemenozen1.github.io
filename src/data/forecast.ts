import csv from './metrics_by_horizon.csv?raw';
import baseline from './baseline.json';
import metrics from './metrics.json';
import { readForecast } from './read-forecast.mjs';

export const forecast = readForecast(csv, baseline, metrics);
