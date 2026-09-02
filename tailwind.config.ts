import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        obsidian: {
          950: '#070A10',
          900: '#0C111C',
          850: '#111827',
          800: '#172033',
          700: '#222E46',
          600: '#334155',
        },
        clinic: {
          gold: '#E5A93B',
          rose: '#E2847A',
          emerald: '#10B981',
          violet: '#8B5CF6',
          teal: '#14B8A6',
          sky: '#38BDF8',
        }
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'wave-bar': 'wave 1.2s ease-in-out infinite alternate',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        wave: {
          '0%': { height: '10%' },
          '100%': { height: '100%' },
        }
      }
    },
  },
  plugins: [],
};
export default config;
