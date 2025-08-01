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
    <SEO
      title="JP TechLift - Example"
      description="Mô tả trang"
      path="/example"
    />
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