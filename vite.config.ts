// scripts/generate-sitemap.ts
import fs from "fs";
import path from "path";
import { productSlugMap } from "../JPTechLift_Project/src/constants/productSlugMap"; // ✅ dùng import

const hostname = "https://thangmaysaigonjptechlift.com";

const staticRoutes = [
  "/",
  "/gioi-thieu",
  "/gioi-thieu/ban-lanh-dao",
  "/gioi-thieu/nguyen-tac",
  "/gioi-thieu/quy-trinh-du-an",
  "/tin-tuc-thang-may",
  "/blog-thang-may",
  "/lien-he",
  "/dich-vu-thang-may",
  "/dich-vu-thang-may/lap-dat-thang-may",
  "/dich-vu-thang-may/tu-van-thiet-ke",
  "/dich-vu-thang-may/bao-tri-thang-may",
  "/dich-vu-thang-may/huong-dan-van-hanh",
  "/dich-vu-thang-may/cai-tao-sua-chua",
];

const productRoutes = Object.values(productSlugMap).map(
  (slug) => `/san-pham/${slug}`
);

const allRoutes = [...staticRoutes, ...productRoutes];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes
  .map(
    (route) => `
  <url>
    <loc>${hostname}${route}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`
  )
  .join("")}
</urlset>`;

fs.writeFileSync(path.resolve("dist", "sitemap.xml"), sitemap);
console.log("✅ sitemap.xml generated");
