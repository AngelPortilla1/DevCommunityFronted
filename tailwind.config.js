// tailwind.config.js — DevCommunity "Retrofuturismo Hacker" Design System
export default {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        // Backgrounds
        'bg-base':        '#0A0A0F',
        'bg-surface':     '#0F0F1A',
        'bg-elevated':    '#14141F',
        'bg-card':        '#1A1A2E',

        // Titanium Metal
        'metal': {
          darkest:  '#3A4A5A',
          dark:     '#556677',
          mid:      '#8899AA',
          light:    '#AAB8C8',
          bright:   '#C0C8D8',
          platinum: '#D0D8E8',
          shine:    '#E8EEF4',
        },

        // Semantic
        'text-primary':   '#E8E8F0',
        'text-secondary': '#8899AA',
        'text-muted':     '#4A4A6A',
      },

      fontFamily: {
        display: ['Space Grotesk', 'system-ui', 'sans-serif'],
        body:    ['Inter', 'system-ui', 'sans-serif'],
        mono:    ['JetBrains Mono', 'Fira Code', 'monospace'],
      },

      boxShadow: {
        'metal':        '0 0 20px rgba(136,153,170,0.15), 0 4px 12px rgba(0,0,0,0.5)',
        'metal-strong': '0 0 30px rgba(192,200,216,0.25), 0 8px 24px rgba(0,0,0,0.6)',
        'card':         '0 4px 24px rgba(0,0,0,0.5), inset 0 1px 0 rgba(192,200,216,0.06)',
        'inset-metal':  'inset 0 1px 0 rgba(192,200,216,0.08)',
      },

      backgroundImage: {
        'gradient-metal':       'linear-gradient(135deg, #C0C8D8 0%, #8899AA 40%, #556677 100%)',
        'gradient-metal-bright':'linear-gradient(135deg, #E8EEF4 0%, #C0C8D8 50%, #8899AA 100%)',
        'gradient-surface':     'linear-gradient(135deg, #1A1A2E 0%, #0F0F1A 100%)',
        'gradient-text-metal':  'linear-gradient(135deg, #D0D8E8 0%, #8899AA 100%)',
      },

      borderColor: {
        'metal-subtle':  'rgba(136, 153, 170, 0.12)',
        'metal-default': 'rgba(136, 153, 170, 0.20)',
        'metal-strong':  'rgba(136, 153, 170, 0.35)',
        'metal-active':  'rgba(192, 200, 216, 0.60)',
      },

      animation: {
        'fade-in-up':   'fade-in-up 0.5s cubic-bezier(0.16,1,0.3,1) both',
        'fade-in':      'fade-in 0.3s ease both',
        'scale-in':     'scale-in 0.4s cubic-bezier(0.16,1,0.3,1) both',
        'glow-pulse':   'glow-pulse 3s ease-in-out infinite alternate',
        'drift':        'drift 12s ease-in-out infinite alternate',
        'cursor-blink': 'cursor-blink 1.1s step-end infinite',
      },

      borderRadius: {
        'sm':  '6px',
        'md':  '10px',
        'lg':  '14px',
        'xl':  '20px',
        '2xl': '28px',
      },
    },
  },
  plugins: [],
}
