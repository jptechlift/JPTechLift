import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import sitemap from "vite-plugin-sitemap";
import { productSlugMap } from "./src/constants/productSlugMap";

// https://vite.dev/config/
const staticRoutes = [
  "/",
  "/gioi-thieu/quy-trinh-du-an",
  "/gioi-thieu/nguyen-tac",
  "/gioi-thieu/ban-lanh-dao",
  "/tin-tuc-thang-may",
  "/gioi-thieu",
  "/blog-thang-may",
  "/lien-he",
  "/dich-vu-thang-may",
  "/dich-vu-thang-may/lap-dat-thang-may",
  "/dich-vu-thang-may/tu-van-thiet-ke",
  "/dich-vu-thang-may/huong-dan-van-hanh",
  "/dich-vu-thang-may/bao-tri-thang-may",
  "/dich-vu-thang-may/cai-tao-sua-chua",
];

const productRoutes = Object.values(productSlugMap).map(
  (slug) => `/san-pham/${slug}`
);

export default defineConfig({
  plugins: [
    react(),
    sitemap({
      hostname: "https://thangmaysaigonjptechlift.com",
    }),
  ],

  server: {
    host: true,
  },
  base: "/",
});
