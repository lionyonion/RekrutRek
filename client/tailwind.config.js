/** @type {import('tailwindcss').Config} */
export default {
  // Scan semua file React agar class yang dipakai tidak terpotong saat build
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],

  theme: {
    // Mobile-First: extend breakpoint default Tailwind
    // xs: 375px  → HP kecil (target utama Rekrutrek)
    // sm: 640px  → HP besar / tablet portrait
    // md: 768px  → tablet landscape
    // lg: 1024px → laptop
    screens: {
      xs: '375px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
    },

    extend: {
      // Warna brand Rekrutrek
      colors: {
        primary: {
          50:  '#E1F5EE',
          100: '#9FE1CB',
          200: '#5DCAA5',
          400: '#1D9E75',  // ← warna utama
          600: '#0F6E56',
          800: '#085041',
          900: '#04342C',
        },
        accent: {
          400: '#EF9F27',  // amber untuk highlight
          600: '#BA7517',
        },
        neutral: {
          50:  '#F8FAFB',
          100: '#F1F3F5',
          200: '#E5E7EB',
          500: '#6B7280',
          700: '#374151',
          900: '#111827',
        },
      },

      // Font family
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },

      // Border radius konsisten
      borderRadius: {
        DEFAULT: '0.5rem',
        lg:      '0.75rem',
        xl:      '1rem',
        '2xl':   '1.25rem',
      },

      // Animasi untuk loading state AI
      animation: {
        'pulse-slow': 'pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow':  'spin 3s linear infinite',
      },

      // Tinggi peta Leaflet responsif
      height: {
        map:    '16rem',   // mobile
        'map-md': '22rem', // tablet+
      },
    },
  },

  plugins: [],
}
