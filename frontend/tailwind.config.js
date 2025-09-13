import defaultTheme from "tailwindcss/defaultTheme";
import typography from "@tailwindcss/typography"; // <-- THÊM: Import plugin

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        delvona: ["Delvona", "sans-serif"],
        inter: ["Inter", ...defaultTheme.fontFamily.sans],
        nunito: ['"Nunito Sans"', ...defaultTheme.fontFamily.sans],
        noto: ['"Noto Serif"', ...defaultTheme.fontFamily.serif],
      },
      backgroundImage: {
        "texture-pattern":
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%23041e41' fill-opacity='0.02' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E\")",
      },
      colors: {
        primary: "var(--color-primary)",
        accent: "var(--color-accent)",
        warning: "var(--color-warning)",
        gray: "var(--color-gray)",
        "gray-light": "var(--color-gray-light)",
        "texture-bg": "#f3f2f0",
      },
      spacing: {
        xs: "var(--space-xs)",
        sm: "var(--space-sm)",
        md: "var(--space-md)",
        lg: "var(--space-lg)",
        xl: "var(--space-xl)",
      },
      keyframes: {
        wiggle: {
          "0%, 100%": { transform: "translateX(0)" },
          "50%": { transform: "translateX(4px)" },
        },
        moveLeft: {
          "0%, 100%": { transform: "translateX(0)" },
          "50%": { transform: "translateX(-6px)" },
        },
        moveRight: {
          "0%, 100%": { transform: "translateX(0)" },
          "50%": { transform: "translateX(6px)" },
        },
      },
      animation: {
        wiggle: "wiggle 1s ease-in-out infinite",
        moveLeft: "moveLeft 3s ease-in-out infinite",
        moveRight: "moveRight 3s ease-in-out infinite",
      },

      // --- PHẦN BỔ SUNG: TÙY CHỈNH GIAO DIỆN CHO PLUGIN TYPOGRAPHY ---
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            // Map các màu của prose với biến màu CSS bạn đã định nghĩa
            '--tw-prose-body': 'var(--color-gray)',
            '--tw-prose-headings': 'var(--color-primary)',
            '--tw-prose-lead': 'var(--color-gray)',
            '--tw-prose-links': 'var(--color-accent)',
            '--tw-prose-bold': 'var(--color-primary)',
            '--tw-prose-counters': 'var(--color-primary)',
            '--tw-prose-bullets': 'var(--color-primary)',
            '--tw-prose-hr': 'var(--color-gray-light)',
            '--tw-prose-quotes': 'var(--color-primary)',
            '--tw-prose-quote-borders': 'var(--color-gray-light)',
            '--tw-prose-captions': 'var(--color-gray)',
            
            // Tùy chỉnh font chữ cho nội dung bài viết
            fontFamily: theme("fontFamily.noto"), // Dùng font serif "Noto Serif" cho nội dung chính

            // Tùy chỉnh riêng cho các tiêu đề
            'h1, h2, h3, h4, h5, h6': {
              fontFamily: theme("fontFamily.inter"), // Dùng font sans-serif "Inter" cho tiêu đề
              fontWeight: '700',
            },

            // Tùy chỉnh các đường link
            a: {
              textDecoration: 'none',
              fontWeight: '600',
              transition: 'color 0.2s ease-in-out',
            },
            'a:hover': {
              color: 'var(--color-primary)',
            },
          },
        },
      }),
      // --- KẾT THÚC PHẦN BỔ SUNG ---
    },
  },

  // --- THÊM: KÍCH HOẠT PLUGIN ---
  plugins: [typography],
};