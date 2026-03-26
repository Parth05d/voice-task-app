/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "on-tertiary-fixed-variant": "#713700",
        "on-primary": "#2000a4",
        "surface-tint": "#c4c0ff",
        "on-secondary-fixed-variant": "#00513f",
        "on-background": "#e4e1e9",
        "tertiary-fixed-dim": "#ffb785",
        "inverse-primary": "#4f44e2",
        "secondary-fixed": "#55fcd0",
        "error": "#ffb4ab",
        "tertiary-container": "#db761f",
        "on-primary-fixed": "#100069",
        "inverse-on-surface": "#303036",
        "surface-bright": "#39383e",
        "outline-variant": "#464555",
        "surface-dim": "#131318",
        "surface-container": "#1f1f25",
        "inverse-surface": "#e4e1e9",
        "on-secondary": "#00382b",
        "surface-container-high": "#2a292f",
        "on-tertiary": "#502500",
        "surface-variant": "#35343a",
        "on-error-container": "#ffdad6",
        "on-primary-fixed-variant": "#3622ca",
        "on-secondary-fixed": "#002118",
        "secondary-fixed-dim": "#28dfb5",
        "on-secondary-container": "#005441",
        "error-container": "#93000a",
        "primary-fixed": "#e3dfff",
        "on-tertiary-container": "#461f00",
        "on-surface": "#e4e1e9",
        "tertiary-fixed": "#ffdcc6",
        "outline": "#918fa1",
        "primary": "#c4c0ff",
        "secondary-container": "#00d1a7",
        "primary-container": "#8781ff",
        "primary-fixed-dim": "#c4c0ff",
        "background": "#131318",
        "surface": "#131318",
        "on-primary-container": "#1b0091",
        "surface-container-highest": "#35343a",
        "surface-container-low": "#1b1b20",
        "on-error": "#690005",
        "secondary": "#41eec2",
        "surface-container-lowest": "#0e0e13",
        "on-tertiary-fixed": "#301400",
        "on-surface-variant": "#c7c4d8",
        "tertiary": "#ffb785"
      },
      fontFamily: {
        "headline": ["Space Grotesk", "sans-serif"],
        "body": ["Manrope", "sans-serif"],
        "label": ["Space Grotesk", "sans-serif"],
        "mono": ["JetBrains Mono", "monospace"]
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
      animation: {
        'waveform': 'waveform 1.5s ease-in-out infinite',
      },
      keyframes: {
        waveform: {
          '0%, 100%': { height: '10px' },
          '50%': { height: '24px' },
        }
      }
    },
  },
  plugins: [],
}
