/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        // Preserved from old config to avoid breaking existing pages
        dark: "#1F2937",
        light: "#F3F4F6",

        // Brand colors - kept your primary/secondary but added shades
        primary: {
          DEFAULT: "#4F46E5",
          light: "#6366F1",
          dark: "#4338CA",
        },
        secondary: {
          DEFAULT: "#10B981",
          light: "#34D399",
          dark: "#059669",
        },
        // Proper dark UI background scale
        surface: {
          950: "#0A0E1A",  // page background
          900: "#0F1420",  // section background
          800: "#141A2E",  // card background
          700: "#1A2138",  // elevated card / hover
          600: "#232B45",  // borders on dark
        },
        // Muted text scale for hierarchy
        muted: {
          400: "#94A3B8",
          500: "#64748B",
          600: "#475569",
        }
      },
      boxShadow: {
        'glow-primary': '0 8px 24px -4px rgba(79, 70, 229, 0.35)',
        'glow-secondary': '0 8px 24px -4px rgba(16, 185, 129, 0.35)',
        'card': '0 4px 20px rgba(0, 0, 0, 0.25)',
        'card-hover': '0 8px 30px rgba(0, 0, 0, 0.35)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(circle, var(--tw-gradient-stops))',
        'hero-glow': 'radial-gradient(ellipse at top right, rgba(79,70,229,0.15), transparent 50%)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.25rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out both',
        'slide-up': 'slideUp 0.4s ease-out both',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
