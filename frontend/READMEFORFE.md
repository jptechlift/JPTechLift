JPTechLift Frontend
Ứng dụng React SPA phục vụ giao diện khách hàng, quản trị, blog.

Yêu cầu
Node.js 18+

npm 9+

Thiết lập
git clone <repository-url>
cd JPTechLift/frontend
npm install
cp .env.example .env  # nếu có
Biến môi trường
VITE_API_URL

VITE_SITE_URL

VITE_RECAPTCHA_SITE_KEY

VITE_GOOGLE_CLIENT_ID

Lệnh
npm run dev        # chạy development
npm run build      # build production
npm run preview    # xem build
npm run prerender  # prerender sitemap và redirect
npm test           # eslint + vitest
npm run lint       # eslint
npm run generate-sitemap
Cấu trúc
frontend/
├── index.html
├── src/
│   ├── main.tsx              # entry
│   ├── App.tsx
│   ├── components/
│   ├── pages/
│   ├── routes/
│   ├── services/
│   ├── hooks/
│   ├── utils/
│   └── styles/
├── public/
├── scripts/                  # prerender, sitemap, redirects
├── tailwind.config.js
├── vite.config.ts
└── eslint.config.js
Phụ thuộc chính
React 18

React Router DOM

Axios

React Hook Form

Zod

TailwindCSS

Framer Motion

Swiper

AOS

Lucide React

EmailJS

DomPurify

React Helmet Async

react-intersection-observer

react-markdown

react-responsive

react-google-recaptcha

react-countup

@react-oauth/google

Dev Dependencies
Vite

Vitest

Testing Library (react, user-event, jest-dom)

TypeScript

ESLint với plugin @eslint/js, react-hooks, react-refresh

TailwindCSS CLI

PostCSS

Sass Embedded

tsx

gh-pages

jsdom

Coding style
TypeScript module, ESM

camelCase cho biến và hàm

ESLint cấu hình trong eslint.config.js

Commit theo Conventional Commits