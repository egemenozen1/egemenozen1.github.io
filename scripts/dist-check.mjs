// Default to the real Astro build output; shared static HTML checker.
process.argv[2]='dist';
await import('./site-html-check.mjs');
