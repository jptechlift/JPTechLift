const fs = require('fs');
const path = require('path');
const productSlugs = require('../product-slugs.json');

const routes = [
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
  'dich-vu-thang-may/vat-tu-phu-kien',
  ...productSlugs.map(slug => `san-pham/${slug}`)
];

const redirectHtml = (url) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Redirecting...</title>
  <script>
    sessionStorage.setItem('redirectPath', '/${url}');
    location.replace('/index.html');
  </script>
</head>
<body>Redirecting...</body>
</html>`;

routes.forEach((r) => {
  const filePath = path.join(__dirname, '..', 'dist', `${r}.html`);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, redirectHtml(r));
  console.log('Generated', filePath);
});
