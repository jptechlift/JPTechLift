# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

## EmailJS Integration

Install the EmailJS SDK and import it when using the contact form:

```bash
npm install emailjs-com
```

```ts
import emailjs from "emailjs-com";
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default tseslint.config([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

## Netlify SPA routing

To ensure React Router works with direct URL entries on Netlify, create a `_redirects` file under `public` containing:

```
/* /index.html 200
```

No additional configuration is required in `vite.config.ts`. After deploying, check Netlify Deploy logs or access a deep link to verify the redirect is active.

## Environment variables

Create a `.env` file in the project root and define `VITE_SITE_URL` with your
production domain. This value is used when generating canonical URLs and the
sitemap.

```env
VITE_SITE_URL=https://thangmaysaigonjptechlift.com
```

## SEO configuration

### Helmet usage

Use the `SEO` component to set meta tags for each page:

```tsx
import SEO from "./components/SEO";

const ExamplePage = () => (
  <>
    <SEO title="JP TechLift - Example" description="Mô tả trang" path="/example" />
    {/* page content */}
  </>
);
```

### sitemap.xml

A minimal sitemap can live under `public/`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://thangmaysaigonjptechlift.com/</loc></url>
  <url><loc>https://thangmaysaigonjptechlift.com/san-pham</loc></url>
  <url><loc>https://thangmaysaigonjptechlift.com/dich-vu-thang-may</loc></url>
</urlset>
```

### robots.txt

Place this file in `public/robots.txt` to allow crawling:

```
User-agent: *
Allow: /
Sitemap: https://thangmaysaigonjptechlift.com/sitemap.xml
```

### Organization Schema

Embed the organization JSON-LD once (usually in `index.html`):

```html
<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "JP TechLift",
    "url": "https://thangmaysaigonjptechlift.com",
    "logo": "https://thangmaysaigonjptechlift.com/Logo-Title.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+84-123456789",
      "contactType": "customer service"
    }
  }
</script>
```

## Build and Deploy

The project now uses a prerender step built with `ReactDOMServer`. Running the
build command generates HTML files for all application routes so that meta tags
are present in the static output.

### Build

```bash
npm run build
```

This executes `vite build` followed by `npm run prerender` which writes the
prerendered pages into the `dist/` folder.

### Deploy

To deploy the generated site to GitHub Pages run:

```bash
npm run deploy
```

The `deploy` script publishes the contents of `dist/` using the `gh-pages`
package.

## SEO Setup with `react-helmet-async`

The project uses [`react-helmet-async`](https://github.com/staylor/react-helmet-async)
to manage document metadata. The provider is registered once in
`src/main.tsx` so that all routes can update the page title and description
during client-side navigation:

```tsx
// src/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>
);
```

`App.tsx` sets up the router with React Router and renders the main pages. Each
page component can include a `<Helmet>` block to define its own metadata. A
simple route configuration looks like:

```tsx
// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/Products/ProductTemplate";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:id" element={<ProductPage />} />
      </Routes>
    </BrowserRouter>
  );
}
```

Inside each page you can use `Helmet` (or the provided `SEO` component) to set
the page title and description:

```tsx
// src/pages/HomePage.tsx
import { Helmet } from "react-helmet-async";

export default function HomePage() {
  return (
    <>
      <Helmet>
        <title>Home - JP TechLift</title>
        <meta
          name="description"
          content="Công ty thang máy JP TechLift cung cấp giải pháp thang máy an toàn, chất lượng tại Việt Nam."
        />
      </Helmet>
      {/* page content */}
    </>
  );
}
```

### Dynamic metadata example

For dynamic routes such as `/product/:id`, metadata can be derived from data
passed as props or loaded from an API. Below is a simplified example using mock
data:

```tsx
// src/pages/Products/ProductTemplate.tsx
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const PRODUCTS = {
  "1": { title: "Thang máy gia đình", description: "Sản phẩm phù hợp cho gia đình." },
  "2": { title: "Thang máy bệnh viện", description: "Thiết kế cho bệnh viện." },
};

export default function ProductTemplatePage() {
  const { id } = useParams();
  const product = PRODUCTS[id ?? "1"];

  return (
    <>
      <Helmet>
        <title>{product.title} - JP TechLift</title>
        <meta name="description" content={product.description} />
      </Helmet>
      {/* product content */}
    </>
  );
}
```

Navigating between pages automatically updates the `<title>` and `<meta>` tags
thanks to `react-helmet-async`, ensuring that crawlers that execute JavaScript
see the correct metadata for each route.

Project Structure:
.sitemap-build/
└── generate-sitemap.js
dist-script/
└── generate-sitemap.js
public/
├── \_redirects
├── 404.html
├── favicon.ico
├── favicon.png
├── og-default.png
├── robots.txt
└── sitemap.xml
scripts/
├── copy404.cjs
├── generate-sitemap.ts
├── generateRedirects.cjs
└── prerender.tsx
src/
├── assets/
├── fonts/
├── Great Studio - Delvona Medium.otf
├── Great Studio - Delvona Regular.otf
└── Great Studio - Delvona Semi Bold.otf
├── images/
├── header/
├── Back_Icon.png
├── Contact_Icon.png
├── Email_Icon.jpg
├── Facebook_2_Icon.png
├── Facebook_Icon_3.png
├── Facebook_Icon.png
├── Flag_Icon.jpg
├── General_Request_Icon.png
├── Instagram_Icon_3.png
├── Instagram_Icon.png
├── Linkedin_2_Icon.png
├── Linkedin_Icon_3.png
├── Linkedin_Icon.png
├── Logo_RemoveBackground.png
├── Logo_White_Removebackground.png
├── Logo_White_Removebackground1.png
├── Phone_Icon.jpg
├── Polygon 1.jpg
├── Search_Icon_2.png
├── Search_Icon.png
├── TikTok_Icon_2.png
├── TikTok_Icon_3.png
├── TikTok_Icon.png
├── X_Icon.png
├── Youtube_Icon_3.png
└── Youtube-Icon.png
├── leaders/
├── AnhKhoa.png
├── desktop.ini
├── LeMinhDa.png
├── MinhKhoi.png
├── Tan.png
├── ThomasEaton.png
└── VuNgocMinhTuyet.png
├── Product/
├── pattern-left.png
├── pattern-right.png
├── product-shadow.png
├── thang-may-benh-vien.png
├── thang-may-gia-dinh.png
├── thang-may-hanh-khach.png
├── thang-may-quan-sat.png
├── thang-may-tai-hang.png
├── thang-tai-thuc-pham.png
└── thang-truot-thang-cuon.png
├── productPage_img/
├── AestheticModal/
├── aes1.png
├── aes2.png
├── aes3.png
├── aes4.png
├── ceiling4Led.png
├── ceiling6Led.png
├── ceilingfullLightLed.png
├── handrailC1.png
├── handrailC2.png
└── handrailFlat.png
├── dumbwaiter/
├── d_blueprint.png
├── d_carousel1.png
├── d_carousel2.png
├── d_carousel3.png
├── d_realGallery1.png
├── d_realGallery2.png
├── d_realGallery3.png
├── d_realGallery4.png
└── hero5.png
├── escalator&moving_walkway/
├── es_blueprint.png
├── es_realGallery1.jpg
├── es_realGallery2.jpg
├── es_realGallery3.png
├── es_realGallery4.jpg
├── es_realGallery5.jpg
├── esc_carousel1.jpg
├── esc_carousel2.jpg
├── esc_carousel3.png
└── hero3.png
├── freight_elevator/
├── freight_blueprint.png
├── freight_carousel1.png
├── freight_carousel2.png
├── freight_carousel3.png
├── freight_realGallery1.png
├── freight_realGallery2.png
├── freight_realGallery3.png
└── hero4.png
├── home_lift/
├── blueprint1.png
├── contentTable_blueprint.png
├── contentTable_installation.png
├── contentTable_realistic.png
├── contentTable_size&price.png
├── gallery_content_table.jpg
├── hero.png
├── home_realGallery1.jpg
├── home_realGallery2.jpg
├── home_realGallery3.jpg
├── home_realGallery5.png
├── home_realGallery6.png
├── home_realGallery7.png
├── homepage_carousel1.png
├── homepage_carousel2.png
├── homepage_carousel3.png
├── install_content_table.jpg
├── install.jpg
├── real1.png
├── real2.png
├── real3.png
├── real4.png
├── size_content_table.jpg
├── size.jpg
└── triangle.svg
├── hospital \_elevator/
├── blueprintOfHospital_Pasenger.png
├── h_realGallery1.png
├── h_realGallery2.png
├── h_realGallery3.png
├── h_realGallery4.png
├── hero6.png
├── hospital_carousel1.png
├── hospital_carousel2.png
└── hospital_carousel3.png
├── panoramic_elevator/
├── hero7.png
├── p_realGallery1.png
├── p_realGallery2.png
├── p_realGallery3.png
├── p_realGallery4.png
├── p_realGallery5.png
├── panoramic_carousel1.png
├── panoramic_carousel2.png
└── panoramic_carousel3.png
└── passenger_elevator/
├── 098b567e05288c76d539.jpg
├── hero1.png
├── passenger_blueprint.png
├── passenger_blueprint.zip
├── passenger_carousel1.png
├── passenger_carousel2.jpg
├── passenger_carousel3.png
├── passenger_realGallery1.png
├── passenger_realGallery2.png
├── passenger_realGallery3.png
├── passenger_realGallery4.jpg
└── passenger_realGallery5.jpg
├── Arrow.png
├── Banner_AboutUs_Img.png
├── banner-blog.jpg
├── Banner-img.png
├── Banner-img1.png
├── Banner-img2.png
├── Banner-Leadership.png
├── Banner-Principle.jpg
├── banner-static.jpg
├── BannerFooter.jpg
├── blog-1.jpg
├── blog.jpg
├── Book-Img.jpg
├── city.jpg
├── commit-banner.jpg
├── commit1.png
├── commit2.png
├── commit3.png
├── commit4.png
├── eb59498d5ad9d3878ac8.jpg
├── favicon.ico
├── favicon.png
├── interior.png
├── lapdat1.png
├── lapdat2.png
├── logo-noname.png
├── Logo.png
├── Message.png
├── news.jpg
├── pattern.png
├── phase1.jpg
├── product1.png
├── product2.png
├── product3.png
├── product4.png
├── product5.png
├── product6.png
├── service1.jpg
├── service2.jpg
├── service3.jpg
├── service4.jpg
├── thangtaihang.png
├── WhatsApp.png
├── WorldMap.png
└── zalo.png
└── react.svg
├── components/
├── AboutUsPage/
├── AboutUsBanner.tsx
├── AboutUsIntro.tsx
├── AboutUsNewsBlogs.tsx
└── AboutUsReasons.tsx
├── Alert/
└── Alert.tsx
├── BlogPage/
└── BlogPageSection.tsx
├── Carousel/
└── Carousel.tsx
├── ContactForm/
└── ContactForm.tsx
├── Footer/
├── DesktopFooter/
└── DesktopFooter.tsx
├── MobileFooter/
└── MobileFooter.tsx
├── Footer.tsx
└── HeroFooter.tsx
├── HomePage/
├── AboutSection.tsx
├── CommitSection.tsx
├── HeaderWithBanner.tsx
├── HeroBanner.tsx
├── ProductSection.tsx
├── ServiceSection.tsx
└── SubBanner.tsx
├── LeaderPage/
├── EngineererSection.tsx
└── LeaderSection.tsx
├── Logo/
└── Logo.tsx
├── Navbar/
├── DesktopMenu/
├── DesktopMenu.tsx
├── MenuBar.tsx
├── ProductServiceDropdown.tsx
└── TopBar.tsx
├── MobileMenu/
└── MobileMenu.tsx
├── AdvancedSearch.tsx
├── FixedButton.tsx
├── Navbar.tsx
└── TitleIntro.tsx
├── NewsPage/
└── ArticleGrid.tsx
├── PrinciplePage/
└── PrincipleSection.tsx
├── ProductPage/
├── AestheticsModal.tsx
├── BlueprintSection.tsx
├── ContentTableSection.tsx
├── DetailSection.tsx
├── DimensionSection.tsx
├── InstallationSection.tsx
├── Introduction.tsx
└── RealGallerySection.tsx
├── SEO/
├── constant.ts
├── EscalatorSeoContent.tsx
├── FoodLiftSeoContent.tsx
├── FreightLiftSeoContent.tsx
├── HomeLiftSeoContent.tsx
├── HomePageSeoContent.tsx
├── HospitalLiftSeoContent.tsx
└── ObservationLiftSeoContent.tsx
├── ServicePage/
├── AccessoriesGallery.tsx
├── AccessoriesPage.tsx
├── BaoTriThangMay.tsx
├── CaiTaoSuaChuaThangMay.tsx
├── ElevatorDesignConsulting.tsx
├── ElevatorInstallationOperation.tsx
├── ServicePageDesktop.tsx
└── ServicePageMobile.tsx
├── StandardPage/
└── InstallProcessSection.tsx
├── ScrollToTop.tsx
└── SEO.tsx
├── constants/
├── globalSeoKeywords.ts
├── productSlugMap.ts
├── searchData.ts
└── VietnamProvinces.ts
├── data/
├── accessoriesData.ts
├── aestheticModalData.ts
├── engineererData.ts
├── heroSlide.ts
├── leaderData.ts
└── productData.ts
├── hooks/
└── useFadeInOnScroll.ts
├── layouts/
└── layout.tsx
├── pages/
├── News/
└── NewsPage.tsx
├── Products/
├── AestheticModal.tsx
└── ProductTemplate.tsx
├── Services/
├── AccessoriesPage.tsx
├── BaoTriThangMay.tsx
├── CaiTaoSuaChuaThangMayPage.tsx
├── HuongDan.tsx
├── LapDatThangMay.tsx
├── ServiceTemplatePage.tsx
└── TuVan.tsx
├── AboutUsPage.tsx
├── BlogPage.tsx
├── ContactPage.tsx
├── HomePage.tsx
├── LeaderPage.tsx
├── NotFound.tsx
├── PrinciplePage.tsx
└── StandardPage.tsx
├── styles/
├── base/
└── \_variables.scss
├── components/
├── common/
└── FadeInSection.tsx
├── Footer/
├── DesktopFooter/
└── desktopFooter.module.scss
└── MobileFooter/
└── mobileFooter.module.scss
└── Navbar/
├── DesktopNavbar/
├── desktopNav.module.scss
└── dropdownMenu.module.scss
├── MobieNavbar/
└── mobileMenu.module.scss
└── searchPanel.module.scss
├── pages/
├── about-us-page/
├── about-us-banner.module.scss
├── about-us-intro.module.scss
├── about-us-news-blogs.module.scss
└── about-us-reasons.module.scss
├── blog-page/
└── blog-page.module.scss
├── contact-form/
└── contact-form.module.scss
├── products-page/
├── productCabin.module.scss
├── productContentTable.module.scss
├── productDrawing.module.scss
├── productGallery.module.scss
├── productIntro.module.scss
├── productProcess.module.scss
├── productSpecs.module.scss
└── realGallerySection.module.scss
├── services-page/
├── accessories.module.scss
├── accessoriesGallery.module.scss
└── service.module.scss
└── headerWithBanner.scss
├── utils/
└── fadeInUp.module.scss
├── fonts.scss
└── index.scss
├── utils/
├── seo.ts
└── splitTitle.ts
├── App.tsx
├── main.tsx
└── vite-env.d.ts
.gitignore
.npmrc
CNAME
codex.json
eslint.config.js
favicon.ico
index.html
package-lock.json
package.json
postcss.config.cjs
product-slugs.json
README.md
tailwind.config.js
tsconfig.app.json
tsconfig.json
tsconfig.node.json
tsconfig.scripts.json
tsconfig.sitemap.json
vercel.json
vite.config.ts
