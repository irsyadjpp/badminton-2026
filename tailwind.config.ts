
import type {Config} from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ['"Geist Sans"', 'sans-serif'],
        headline: ['Montserrat', 'sans-serif'],
        code: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      borderRadius: {
        lg: '1.5rem', // 24px
        md: '1rem', // 16px
        sm: '0.75rem', // 12px
        full: '9999px',
        '4xl': '2.5rem',
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'spring-stiff': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      backgroundImage: {
        noise: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E\")",
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'fade-in-down': {
          '0%': {
            opacity: '0',
            transform: 'translateY(-20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'fade-in-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'zoom-slow': {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'shuttle-fly': {
          '0%': { transform: 'translate(-100%, 100%) rotate(45deg)', opacity: '0' },
          '100%': { transform: 'translate(0, 0) rotate(0deg)', opacity: '1' },
        },
        'hover-tada': {
            '0%': { transform: 'scale(1)' },
            '10%, 20%': { transform: 'scale(0.9) rotate(-3deg)' },
            '30%, 50%, 70%, 90%': { transform: 'scale(1.1) rotate(3deg)' },
            '40%, 60%, 80%': { transform: 'scale(1.1) rotate(-3deg)' },
            '100%': { transform: 'scale(1) rotate(0)' },
        },
        'rally-lob': {
          '0%': { 
            transform: 'translate(-10vw, 10vh) rotate(-45deg)', 
            opacity: '0',
            animationTimingFunction: 'ease-out'
          },
          '10%': { opacity: '1' },
          '50%': { 
            transform: 'translate(40vw, -15vh) rotate(45deg)', // Titik tertinggi (Apex)
            animationTimingFunction: 'ease-in'
          },
          '100%': { 
            transform: 'translate(90vw, 20vh) rotate(135deg)', 
            opacity: '0' 
          },
        },
        'rally-smash': {
          '0%': { 
            transform: 'translate(80vw, -20vh) rotate(-135deg)', 
            opacity: '0',
            animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' // Start cepat
          },
          '10%': { opacity: '1' },
          '100%': { 
            transform: 'translate(-20vw, 50vh) rotate(-45deg)', 
            opacity: '0' 
          },
        },
        'shake-impact': {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translate(-2px, 1px)' },
          '20%, 40%, 60%, 80%': { transform: 'translate(2px, -1px)' },
        },
        flash: { '0%': { transform: 'scale(0)', opacity: '0' }, '50%': { transform: 'scale(1.5)', opacity: '1' }, '100%': { transform: 'scale(0)', opacity: '0' } },
        marquee: {
            '0%': { transform: 'translateX(100%)' },
            '100%': { transform: 'translateX(-100%)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in-down': 'fade-in-down 0.6s ease-out forwards',
        'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
        'zoom-slow': 'zoom-slow 20s infinite alternate',
        float: 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shuttle-fly': 'shuttle-fly 1.5s ease-out forwards',
        'fade-in': 'fade-in 0.3s ease-in-out',
        'hover-tada': 'hover-tada 1s ease-in-out',
        'rally-lob': 'rally-lob 4s infinite', // Durasi servis 4 detik
        'rally-smash': 'rally-smash 3s infinite', // Durasi smash 3 detik (lebih cepat visualnya)
        'shake-impact': 'shake-impact 0.5s ease-in-out',
        'flash': 'flash 0.2s ease-out forwards',
        'marquee': 'marquee 25s linear infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
