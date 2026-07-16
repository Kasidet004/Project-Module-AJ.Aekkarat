/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Core surfaces — deep graphite, not pure black
        base: {
          950: '#0A0E14',
          900: '#0F1420',
          800: '#151B2B',
          700: '#1D2438',
          600: '#2A3350',
        },
        // Signature accent — circuit cyan
        circuit: {
          400: '#5EEAD4',
          500: '#22D3C7',
          600: '#0EA5A0',
        },
        // Secondary accent — voltage violet
        volt: {
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
        },
        // Status
        danger: '#FB7185',
        warn: '#FBBF24',
        ok: '#34D399',
      },
      fontFamily: {
        display: ['"Chakra Petch"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 20px rgba(34, 211, 199, 0.35)',
        'glow-violet': '0 0 20px rgba(139, 92, 246, 0.35)',
      },
      backgroundImage: {
        'circuit-grid':
          'linear-gradient(rgba(34,211,199,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,199,0.06) 1px, transparent 1px)',
      },
      backgroundSize: {
        grid: '32px 32px',
      },
    },
  },
  plugins: [],
}
