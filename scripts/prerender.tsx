import fs from 'fs';
import path from 'path';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { HelmetProvider } from 'react-helmet-async';
import type { HelmetServerState } from 'react-helmet-async';


import App from '../src/App';
import productSlugs from '../product-slugs.json';

const template = fs.readFileSync(path.resolve('dist/index.html'), 'utf-8');

const routes = [
  '/',
  '/gioi-thieu',
  '/gioi-thieu/ban-lanh-dao',
  '/gioi-thieu/nguyen-tac',
  '/gioi-thieu/quy-trinh-du-an',
  '/tin-tuc-thang-may',
  '/blog-thang-may',
  '/lien-he',
  '/dich-vu-thang-may',
  '/dich-vu-thang-may/lap-dat-thang-may',
  '/dich-vu-thang-may/tu-van-thiet-ke',
  '/dich-vu-thang-may/huong-dan-van-hanh',
  '/dich-vu-thang-may/bao-tri-thang-may',
  '/dich-vu-thang-may/cai-tao-sua-chua',
  '/dich-vu-thang-may/vat-tu-phu-kien',
  ...productSlugs.map((s) => `/san-pham/${s}`),
];

routes.forEach((url) => {
     const helmetContext: { helmet?: HelmetServerState } = {};
  const app = (
    <HelmetProvider context={helmetContext}>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </HelmetProvider>
  );

  const appHtml = renderToString(app);
  const { helmet } = helmetContext;

  let html = template.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);

  if (helmet) {
    html = html.replace('<title>JP TECHLIFT</title>', `${helmet.title.toString()}${helmet.meta.toString()}${helmet.link.toString()}`);
  }

  const filePath = path.join('dist', url === '/' ? 'index.html' : `${url}/index.html`);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, html, 'utf-8');
  console.log('Generated', filePath);
});
