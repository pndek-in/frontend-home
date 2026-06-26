import type { Config } from "tailwindcss"

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      // Bridge JLDS design tokens (injected into app/styles/tailwind.css) to
      // Tailwind utilities. Each token's value swaps under [data-theme="dark"],
      // so these utilities are theme-aware WITHOUT a `dark:` variant.
      colors: {
        app: "var(--bg-app)",
        subtle: "var(--bg-subtle)",
        surface: {
          DEFAULT: "var(--surface-card)",
          raised: "var(--surface-raised)",
          sunken: "var(--surface-sunken)",
          overlay: "var(--surface-overlay)",
          hover: "var(--surface-hover)"
        },
        fg: {
          DEFAULT: "var(--text-primary)",
          muted: "var(--text-secondary)",
          subtle: "var(--text-tertiary)",
          inverse: "var(--text-inverse)",
          onbrand: "var(--text-on-brand)"
        },
        line: {
          DEFAULT: "var(--border-default)",
          subtle: "var(--border-subtle)",
          strong: "var(--border-strong)"
        },
        brand: {
          DEFAULT: "var(--accent)",
          hover: "var(--accent-hover)",
          subtle: "var(--accent-subtle)",
          text: "var(--text-brand)"
        },
        success: "var(--success)",
        warning: "var(--warning)",
        danger: "var(--danger)",
        info: "var(--info)"
      },
      fontFamily: {
        sans: ["Geist", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["Geist Mono", "ui-monospace", "monospace"]
      },
      borderRadius: {
        card: "var(--radius-card)",
        control: "var(--radius-control)"
      },
      boxShadow: {
        token: "var(--shadow-md)",
        "token-lg": "var(--shadow-lg)",
        "token-xl": "var(--shadow-xl)"
      }
    }
  },
  variants: {
    backgroundColor: ({ after }: any) => after(["disabled"])
  },
  plugins: []
} satisfies Config
