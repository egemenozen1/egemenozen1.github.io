import { defineConfig } from 'astro/config';
export default defineConfig({
  site: 'https://egemenozen1.github.io',
  // This is the account's root GitHub Pages site, so it has no repository-name base path.
  output: 'static',
  trailingSlash: 'always',
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
  markdown: { syntaxHighlight: false },
  security: {
    csp: {
      directives: ["default-src 'self'", "img-src 'self' data:", "object-src 'none'", "base-uri 'none'", "form-action 'none'"],
      styleDirective: { resources: [{ resource: "'self'", kind: 'element' }, { resource: "'unsafe-inline'", kind: 'attribute' }] },
    },
  },
});
