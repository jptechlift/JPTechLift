# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
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
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
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
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
## Netlify SPA routing

To ensure React Router works with direct URL entries on Netlify, create a `_redirects` file under `public` containing:

```
/* /index.html 200
```

No additional configuration is required in `vite.config.ts`. After deploying, check Netlify Deploy logs or access a deep link to verify the redirect is active.

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