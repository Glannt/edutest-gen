import { heroui } from '@heroui/theme';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/layouts/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  darkMode: 'class',
  plugins: [
    heroui({
      layout: {
        // Slightly rounded corners for educational UI
        radius: {
          small: '4px',
          medium: '8px',
          large: '12px',
        },
        // Comfortable spacing for reading
        fontSize: {
          tiny: '0.75rem', // 12px
          small: '0.875rem', // 14px
          medium: '1rem', // 16px
          large: '1.125rem', // 18px
        },
        lineHeight: {
          tiny: '1.25rem', // 20px
          small: '1.5rem', // 24px
          medium: '1.75rem', // 28px
          large: '2rem', // 32px
        },
        // Subtle borders for content separation
        borderWidth: {
          small: '1px',
          medium: '2px',
          large: '3px',
        },
        // Reduced opacity for better focus
        disabledOpacity: 0.5,
        dividerWeight: '1px',
      },
      themes: {
        light: {
          colors: {
            // Base colors
            background: {
              DEFAULT: '#FFFFFF',
            },
            foreground: {
              DEFAULT: '#11181C',
              50: '#f8fafc',
              100: '#f1f5f9',
              200: '#e2e8f0',
              300: '#cbd5e1',
              400: '#94a3b8',
              500: '#64748b',
              600: '#475569',
              700: '#334155',
              800: '#1e293b',
              900: '#0f172a',
            },
            // Content areas
            content1: {
              DEFAULT: '#FFFFFF',
              foreground: '#11181C',
            },
            content2: {
              DEFAULT: '#f8fafc',
              foreground: '#1e293b',
            },
            content3: {
              DEFAULT: '#f1f5f9',
              foreground: '#334155',
            },
            content4: {
              DEFAULT: '#e2e8f0',
              foreground: '#475569',
            },
            // Utility colors
            divider: {
              DEFAULT: 'rgba(17, 17, 17, 0.15)',
            },
            focus: {
              DEFAULT: '#1e40af',
            },
            overlay: {
              DEFAULT: '#000000',
            },
            // Semantic colors - Educational blue theme
            primary: {
              50: '#eff6ff',
              100: '#dbeafe',
              200: '#bfdbfe',
              300: '#93c5fd',
              400: '#60a5fa',
              500: '#3b82f6',
              600: '#2563eb',
              700: '#1d4ed8',
              800: '#1e40af',
              900: '#1e3a8a',
              DEFAULT: '#2563eb',
              foreground: '#ffffff',
            },
            secondary: {
              50: '#f5f3ff',
              100: '#ede9fe',
              200: '#ddd6fe',
              300: '#c4b5fd',
              400: '#a78bfa',
              500: '#8b5cf6',
              600: '#7c3aed',
              700: '#6d28d9',
              800: '#5b21b6',
              900: '#4c1d95',
              DEFAULT: '#7c3aed',
              foreground: '#ffffff',
            },
            success: {
              50: '#ecfdf5',
              100: '#d1fae5',
              200: '#a7f3d0',
              300: '#6ee7b7',
              400: '#34d399',
              500: '#10b981',
              600: '#059669',
              700: '#047857',
              800: '#065f46',
              900: '#064e3b',
              DEFAULT: '#10b981',
              foreground: '#ffffff',
            },
            warning: {
              50: '#fffbeb',
              100: '#fef3c7',
              200: '#fde68a',
              300: '#fcd34d',
              400: '#fbbf24',
              500: '#f59e0b',
              600: '#d97706',
              700: '#b45309',
              800: '#92400e',
              900: '#78350f',
              DEFAULT: '#f59e0b',
              foreground: '#000000',
            },
            danger: {
              50: '#fef2f2',
              100: '#fee2e2',
              200: '#fecaca',
              300: '#fca5a5',
              400: '#f87171',
              500: '#ef4444',
              600: '#dc2626',
              700: '#b91c1c',
              800: '#991b1b',
              900: '#7f1d1d',
              DEFAULT: '#dc2626',
              foreground: '#ffffff',
            },
            default: {
              50: '#f8fafc',
              100: '#f1f5f9',
              200: '#e2e8f0',
              300: '#cbd5e1',
              400: '#94a3b8',
              500: '#64748b',
              600: '#475569',
              700: '#334155',
              800: '#1e293b',
              900: '#0f172a',
              DEFAULT: '#cbd5e1',
              foreground: '#1e293b',
            },
          },
        },
        dark: {
          colors: {
            // Base colors - Dark mode
            background: {
              DEFAULT: '#0f172a', // Dark blue background for better eye comfort
            },
            foreground: {
              DEFAULT: '#ECEDEE',
              50: '#0f172a',
              100: '#1e293b',
              200: '#334155',
              300: '#475569',
              400: '#64748b',
              500: '#94a3b8',
              600: '#cbd5e1',
              700: '#e2e8f0',
              800: '#f1f5f9',
              900: '#f8fafc',
            },
            // Content areas - Dark mode
            content1: {
              DEFAULT: '#1e293b',
              foreground: '#f8fafc',
            },
            content2: {
              DEFAULT: '#334155',
              foreground: '#f1f5f9',
            },
            content3: {
              DEFAULT: '#475569',
              foreground: '#e2e8f0',
            },
            content4: {
              DEFAULT: '#64748b',
              foreground: '#cbd5e1',
            },
            // Utility colors - Dark mode
            divider: {
              DEFAULT: 'rgba(236, 237, 238, 0.15)',
            },
            focus: {
              DEFAULT: '#60a5fa',
            },
            overlay: {
              DEFAULT: '#000000',
            },
            // Semantic colors - Dark mode
            primary: {
              50: '#1e3a8a',
              100: '#1e40af',
              200: '#1d4ed8',
              300: '#2563eb',
              400: '#3b82f6',
              500: '#60a5fa',
              600: '#93c5fd',
              700: '#bfdbfe',
              800: '#dbeafe',
              900: '#eff6ff',
              DEFAULT: '#3b82f6',
              foreground: '#000000',
            },
            secondary: {
              50: '#4c1d95',
              100: '#5b21b6',
              200: '#6d28d9',
              300: '#7c3aed',
              400: '#8b5cf6',
              500: '#a78bfa',
              600: '#c4b5fd',
              700: '#ddd6fe',
              800: '#ede9fe',
              900: '#f5f3ff',
              DEFAULT: '#8b5cf6',
              foreground: '#000000',
            },
            success: {
              50: '#064e3b',
              100: '#065f46',
              200: '#047857',
              300: '#059669',
              400: '#10b981',
              500: '#34d399',
              600: '#6ee7b7',
              700: '#a7f3d0',
              800: '#d1fae5',
              900: '#ecfdf5',
              DEFAULT: '#10b981',
              foreground: '#000000',
            },
            warning: {
              50: '#78350f',
              100: '#92400e',
              200: '#b45309',
              300: '#d97706',
              400: '#f59e0b',
              500: '#fbbf24',
              600: '#fcd34d',
              700: '#fde68a',
              800: '#fef3c7',
              900: '#fffbeb',
              DEFAULT: '#fbbf24',
              foreground: '#000000',
            },
            danger: {
              50: '#7f1d1d',
              100: '#991b1b',
              200: '#b91c1c',
              300: '#dc2626',
              400: '#ef4444',
              500: '#f87171',
              600: '#fca5a5',
              700: '#fecaca',
              800: '#fee2e2',
              900: '#fef2f2',
              DEFAULT: '#ef4444',
              foreground: '#000000',
            },
            default: {
              50: '#0f172a',
              100: '#1e293b',
              200: '#334155',
              300: '#475569',
              400: '#64748b',
              500: '#94a3b8',
              600: '#cbd5e1',
              700: '#e2e8f0',
              800: '#f1f5f9',
              900: '#f8fafc',
              DEFAULT: '#475569',
              foreground: '#f1f5f9',
            },
          },
        },
      },
    }),
  ],
};
