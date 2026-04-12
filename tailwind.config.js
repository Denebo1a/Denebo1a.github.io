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
      // 6. 配置 Typography 插件，使其也使用我们的语义化变量
      typography: () => ({
        DEFAULT: {
          css: {
            "--tw-prose-body": "var(--color-text-muted)",
            "--tw-prose-headings": "var(--color-text-main)",
            "--tw-prose-links": "var(--color-brand)",
            "--tw-prose-bold": "var(--color-text-main)",
            "--tw-prose-quotes": "var(--color-brand)",
            "--tw-prose-quote-borders": "var(--color-brand)",
            "--tw-prose-code": "var(--color-brand-dark)",
            "--tw-prose-code-bg": "var(--color-brand-light)",
            "--tw-prose-hr": "var(--color-border)",
            "--tw-prose-th-borders": "var(--color-border)",
            "--tw-prose-td-borders": "var(--color-border)",
            // 解决暗色模式下 a 标签 hover 颜色问题
            a: {
              textDecoration: "none",
              fontWeight: "600",
              transition: "color 0.2s",
              "&:hover": {
                color: "var(--color-brand-dark)",
              },
            },
            "code::before": { content: '""' },
            "code::after": { content: '""' },
            code: {
              color: "var(--tw-prose-code)",
              backgroundColor: "var(--tw-prose-code-bg)",
              padding: "0.2em 0.4em", // 给背景色留出一点呼吸空间
              borderRadius: "0.25rem", // 小圆角
              fontWeight: "600",
            },
            // 建议：去掉 Tailwind 默认给行内代码加的丑陋反引号
            "code::before": { content: '""' },
            "code::after": { content: '""' },
          },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
