// Monochrome Design System
export const theme = {
    colors: {
        // Core blacks and grays
        black: '#000000',
        darkest: '#0a0a0a',
        darker: '#141414',
        dark: '#1a1a1a',
        mediumDark: '#242424',
        medium: '#333333',
        mediumLight: '#4a4a4a',
        light: '#666666',
        lighter: '#999999',
        lightest: '#cccccc',
        white: '#ffffff',

        // Functional colors
        background: '#000000',
        surface: '#0a0a0a',
        surfaceHover: '#141414',
        border: '#242424',
        text: '#ffffff',
        textSecondary: '#999999',
        textTertiary: '#666666',

        // Status (monochrome variations)
        success: '#ffffff',
        error: '#ffffff',
        warning: '#ffffff',
        info: '#ffffff',
    },

    fonts: {
        primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        mono: "'JetBrains Mono', 'Courier New', monospace",
    },

    fontSizes: {
        xs: '0.75rem',    // 12px
        sm: '0.875rem',   // 14px
        base: '1rem',     // 16px
        lg: '1.125rem',   // 18px
        xl: '1.25rem',    // 20px
        '2xl': '1.5rem',  // 24px
        '3xl': '1.875rem',// 30px
        '4xl': '2.25rem', // 36px
        '5xl': '3rem',    // 48px
        '6xl': '3.75rem', // 60px
    },

    spacing: {
        xs: '0.25rem',  // 4px
        sm: '0.5rem',   // 8px
        md: '1rem',     // 16px
        lg: '1.5rem',   // 24px
        xl: '2rem',     // 32px
        '2xl': '3rem',  // 48px
        '3xl': '4rem',  // 64px
        '4xl': '6rem',  // 96px
    },

    borderRadius: {
        none: '0',
        sm: '0.125rem',   // 2px
        base: '0.25rem',  // 4px
        md: '0.375rem',   // 6px
        lg: '0.5rem',     // 8px
        xl: '0.75rem',    // 12px
        '2xl': '1rem',    // 16px
        full: '9999px',
    },

    shadows: {
        sm: '0 1px 2px 0 rgba(255, 255, 255, 0.05)',
        base: '0 1px 3px 0 rgba(255, 255, 255, 0.1)',
        md: '0 4px 6px -1px rgba(255, 255, 255, 0.1)',
        lg: '0 10px 15px -3px rgba(255, 255, 255, 0.1)',
        xl: '0 20px 25px -5px rgba(255, 255, 255, 0.1)',
    },

    transitions: {
        fast: '150ms ease-in-out',
        base: '200ms ease-in-out',
        slow: '300ms ease-in-out',
    },

    breakpoints: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
    },
};

export type Theme = typeof theme;
