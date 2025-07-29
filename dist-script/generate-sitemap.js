"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var domain = process.env.VITE_SITE_URL || 'https://thangmaysaigonjptechlift.com';
var today = new Date().toISOString().split('T')[0];
var staticRoutes = [
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
var productSlugs = [
    'thang-may-gia-dinh',
    'thang-tai-thuc-pham',
    'thang-may-tai-hang',
    'thang-may-hanh-khach',
    'thang-may-benh-vien',
    'thang-truot-thang-cuon',
    'thang-may-quan-sat',
];
var urls = __spreadArray(__spreadArray([], staticRoutes.map(function (r) { return "/".concat(r); }), true), productSlugs.map(function (slug) { return "/san-pham/".concat(slug); }), true);
var xml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n";
xml += "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n";
urls.forEach(function (url) {
    xml += "  <url>\n";
    xml += "    <loc>".concat(domain).concat(url, "</loc>\n");
    xml += "    <lastmod>".concat(today, "</lastmod>\n");
    xml += "    <priority>0.8</priority>\n";
    xml += "  </url>\n";
});
xml += "</urlset>";
fs_1.default.writeFileSync('public/sitemap.xml', xml);
console.log('✅ sitemap.xml generated');
