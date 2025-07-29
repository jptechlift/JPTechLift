import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { productSlugMap } from './src/constants/productSlugMap';

function generateSitemap() {
  const hostname = 'https://thangmaysaigonjptechlift.com';
  const staticRoutes = [
    '',
    'gioi-thieu',
    'gioi-thieu/ban-lanh-dao',
    'gioi-thieu/nguyen-tac',
    'gioi-thieu/quy-trinh-du-an',
    'tin-tuc-thang-may',
    'blog-thang-may',
    'lien-he',
    'dich-vu-thang-may',
    'dich-vu-thang-may/lap-dat-thang-may',
    'dich-vu-thang-may/tu-van-thiet-ke',
    'dich-vu-thang-may/huong-dan-van-hanh',
    'dich-vu-thang-may/bao-tri-thang-may',
    'dich-vu-thang-may/cai-tao-sua-chua',
  ];

  const productRoutes = Object.values(productSlugMap).map(
    (slug) => `/san-pham/${slug}`
  );

  const urls = [
    ...staticRoutes.map((r) => `/${r}`),
    ...productRoutes,
  ];

  const today = new Date().toISOString().split('T')[0];

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  for (const url of urls) {
    xml += `  <url>\n`;
    xml += `    <loc>${hostname}${url}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += '    <priority>0.8</priority>\n';
    xml += '  </url>\n';
  }
  xml += '</urlset>';

  const outPath = path.resolve('dist', 'sitemap.xml');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, xml);
  console.log('✅ sitemap.xml generated');
}

function sitemapPlugin() {
  return {
    name: 'sitemap-plugin',
    closeBundle: generateSitemap,
  } as const;
}

export default defineConfig({
  plugins: [react(), sitemapPlugin()],
});