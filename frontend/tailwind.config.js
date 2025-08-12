import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        delvona: ['Delvona', 'sans-serif'],
        inter: ["Inter", ...defaultTheme.fontFamily.sans],
        nunito: ['"Nunito Sans"', ...defaultTheme.fontFamily.sans],
        noto: ['"Noto Serif"', ...defaultTheme.fontFamily.serif],
      },
      backgroundImage: {
        "texture-pattern":
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%23041e41' fill-opacity='0.02' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E\")",
      },
      colors: {
        "texture-bg": "#f3f2f0",
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
    },
  },
  plugins: [],
};
