import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { site } from '../config/site';

// A minimal static sitemap. Only pages with public, reviewed content belong here.
export const GET: APIRoute = async () => {
  const projects = await getCollection('projects');
  const paths = ['/', ...projects.map((p) => `/projects/${p.id}/`)];
  const urls = paths.map((path) => `  <url><loc>${new URL(path, site.url).href}</loc></url>`).join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
