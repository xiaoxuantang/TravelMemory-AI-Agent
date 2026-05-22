/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        tm: {
          bg: "var(--color-tm-bg)",
          surface: "var(--color-tm-surface)",
          "surface-soft": "var(--color-tm-surface-soft)",
          primary: "var(--color-tm-primary)",
          "primary-soft": "var(--color-tm-primary-soft)",
          accent: "var(--color-tm-accent)",
          text: "var(--color-tm-text)",
          muted: "var(--color-tm-muted)",
          border: "var(--color-tm-border)",
          danger: "var(--color-tm-danger)"
        }
      },
      borderRadius: {
        "tm-card": "24px",
        "tm-btn": "16px",
        "tm-pill": "999px"
      },
      boxShadow: {
        "tm-card": "0 12px 30px rgba(58, 53, 48, 0.08)",
        "tm-soft": "0 8px 20px rgba(58, 53, 48, 0.06)",
        "tm-floating": "0 16px 40px rgba(58, 53, 48, 0.10)"
      },
      maxWidth: {
        "tm-page": "480px",
        "tm-poster": "340px"
      }
    }
  },
  plugins: []
};

export default config;
