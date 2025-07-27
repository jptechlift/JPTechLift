const fs = require("fs");
const path = require("path");

// ✅ Chỉ khai báo productSlugs một lần
const productSlugs = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../product-slugs.json"), "utf-8")
);

const domain = "https://thangmaysaigonjptechlift.com";
const today = new Date().toISOString().split("T")[0];

const staticRoutes = [
  "",
  "gioi-thieu",
  "gioi-thieu/ban-lanh-dao",
  "gioi-thieu/nguyen-tac",
  "gioi-thieu/quy-trinh-du-an",
  "tin-tuc-thang-may",
  "blog-thang-may",
  "lien-he",
  "dich-vu-thang-may",
  "dich-vu-thang-may/lap-dat-thang-may",
  "dich-vu-thang-may/tu-van-thiet-ke",
  "dich-vu-thang-may/huong-dan-van-hanh",
  "dich-vu-thang-may/bao-tri-thang-may",
  "dich-vu-thang-may/cai-tao-sua-chua",
];

const urls = [
  ...staticRoutes.map((r) => `/${r}`),
  ...productSlugs.map((slug) => `/san-pham/${slug}`),
];

let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

urls.forEach((url) => {
  xml += `  <url>\n`;
  xml += `    <loc>${domain}${url}</loc>\n`;
  xml += `    <lastmod>${today}</lastmod>\n`;
  xml += `    <priority>0.8</priority>\n`;
  xml += `  </url>\n`;
});

xml += `</urlset>`;

fs.writeFileSync("public/sitemap.xml", xml);
console.log("✅ sitemap.xml generated.");
