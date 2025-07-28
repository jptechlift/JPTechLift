import fs from "fs";
import path from "path";
import { productSlugMap } from "./src/constants/productSlugMap";

const hostname = "https://thangmaysaigonjptechlift.com";

const staticRoutes = [ /* ... */ ];
const productRoutes = Object.values(productSlugMap).map(
  (slug) => `/san-pham/${slug}`
);

const allRoutes = [...staticRoutes, ...productRoutes];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes.map(route => `
  <url>
    <loc>${hostname}${route}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`).join("")}
</urlset>`;

const distPath = path.resolve("dist");
if (!fs.existsSync(distPath)) fs.mkdirSync(distPath, { recursive: true });

fs.writeFileSync(path.join(distPath, "sitemap.xml"), sitemap);
console.log("✅ sitemap.xml generated");
