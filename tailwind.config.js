/** @type {import('tailwindcss').Config} */
module.exports = {
  // 既然我们完全用 CSS 变量控制了主题，原生的 dark 模式其实不需要了，但保留 class 以防万一
  darkMode: "class",
  content: ["./docs/.vitepress/**/*.{js,ts,vue}", "./docs/**/*.md"],
  theme: {
    extend: {
      colors: {
        // 1. 品牌色 (bg-brand, text-brand)
        brand: {
          DEFAULT: "var(--color-brand)",
          light: "var(--color-brand-light)",
          dark: "var(--color-brand-dark)",
        },
        // 2. 语义化背景色 (bg-base, bg-card, bg-alt)
        base: "var(--color-bg-base)",
        card: "var(--color-bg-card)",
        alt: "var(--color-bg-alt)",
      },
      textColor: {
        // 3. 语义化文字色 (text-main, text-muted)
        main: "var(--color-text-main)",
        muted: "var(--color-text-muted)",
      },
      borderColor: {
        // 4. 语义化边框色 (border-color)
        color: "var(--color-border)",
      },
      boxShadow: {
        // 5. 语义化阴影 (shadow-card, shadow-brand)
        card: "var(--shadow-card)",
        brand: "var(--shadow-brand)",
      },
      fontFamily: {
        sans: ['"Inter"', '"Noto Sans SC"', "sans-serif"],
      },
    },
  },
};
