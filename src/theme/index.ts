/**
 * @file src/theme/index.ts
 * @description Clara's custom MUI v6 theme — Enterprise Fintech Standard.
 *
 * Palette rationale:
 *  - Primary  (#1B3A6B) — Deep Navy: conveys trust, stability, and authority
 *    appropriate for an insurance product.
 *  - Secondary (#0097A7) — Teal: accent for active step indicators and
 *    informational chips; maintains WCAG AA contrast on white.
 *  - Background surfaces use a soft grey (#F5F7FA) to lift cards off the
 *    page without introducing heavy visual noise.
 *
 * Typography:
 *  - "Inter" (Google Fonts) — humanist sans-serif designed for screen
 *    legibility; the standard choice for form-heavy, data-dense UIs.
 *
 * Design constraints (Fintech Standard):
 *  - All radii are 4px — sharp corners signal precision and formality.
 *  - Shadows are deliberately minimal (max 2px blur) — no depth theatre.
 *  - Buttons have no lift, transform, or glow on hover — static is trustworthy.
 *  - No gradients in any component override; solid colours only.
 */

import { createTheme } from '@mui/material/styles'
import type { ThemeOptions } from '@mui/material/styles'

const CLARA_NAVY      = '#1B3A6B'
const CLARA_NAVY_LIGHT = '#2A5298'
const CLARA_NAVY_DARK  = '#112447'

const CLARA_TEAL      = '#0097A7'
const CLARA_TEAL_LIGHT = '#26C6DA'
const CLARA_TEAL_DARK  = '#006978'

const SURFACE_BG = '#F5F7FA'
const PAPER_BG   = '#FFFFFF'

const themeOptions: ThemeOptions = {
  palette: {
    mode: 'light',

    primary: {
      main: CLARA_NAVY,
      light: CLARA_NAVY_LIGHT,
      dark: CLARA_NAVY_DARK,
      contrastText: '#FFFFFF',
    },

    secondary: {
      main: CLARA_TEAL,
      light: CLARA_TEAL_LIGHT,
      dark: CLARA_TEAL_DARK,
      contrastText: '#FFFFFF',
    },

    background: {
      default: SURFACE_BG,
      paper: PAPER_BG,
    },

    text: {
      primary: '#1A2138',
      secondary: '#4A5568',
      disabled: '#A0AEC0',
    },

    error: {
      main: '#C62828',
      light: '#EF9A9A',
      dark: '#8E0000',
    },

    success: {
      main: '#2E7D32',
      light: '#A5D6A7',
      dark: '#1B5E20',
    },

    divider: '#E2E8F0',
  },

  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      'sans-serif',
    ].join(','),

    h1: {
      fontSize: '2rem',
      fontWeight: 700,
      letterSpacing: '-0.025em',
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: 600,
      letterSpacing: '-0.02em',
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.25rem',
      fontWeight: 600,
      letterSpacing: '-0.015em',
    },
    h4: {
      fontSize: '1.125rem',
      fontWeight: 600,
    },
    h5: {
      fontSize: '1rem',
      fontWeight: 600,
    },
    h6: {
      fontSize: '0.875rem',
      fontWeight: 600,
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      color: '#4A5568',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.57,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '0.01em',
    },
    caption: {
      fontSize: '0.75rem',
      color: '#4A5568',
    },
  },

  // 4px globally — sharp, precise, institutional
  shape: {
    borderRadius: 4,
  },

  // Flat shadow scale: maximum 2px spread, no heavy depth
  shadows: [
    'none',
    '0px 1px 2px rgba(0,0,0,0.06)',
    '0px 1px 3px rgba(0,0,0,0.08)',
    '0px 2px 4px rgba(0,0,0,0.08)',
    '0px 2px 6px rgba(0,0,0,0.10)',
    '0px 2px 8px rgba(0,0,0,0.10)',
    // MUI requires 25 shadow values — remainder use the same restrained value
    ...Array<string>(19).fill('0px 2px 8px rgba(0,0,0,0.10)'),
  ] as ThemeOptions['shadows'],

  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        *, *::before, *::after {
          box-sizing: border-box;
        }

        body {
          background-color: ${SURFACE_BG};
        }

        #root {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
      `,
    },

    MuiButton: {
      defaultProps: {
        disableElevation: true,
        variant: 'contained',
      },
      styleOverrides: {
        root: {
          borderRadius: 4,
          paddingTop: 10,
          paddingBottom: 10,
          paddingLeft: 24,
          paddingRight: 24,
          fontSize: '0.9375rem',
          // No transform, no glow — interactions are communicated via colour only
          transition: 'background-color 0.15s ease, border-color 0.15s ease',
        },
        containedPrimary: {
          '&:hover': {
            backgroundColor: CLARA_NAVY_LIGHT,
          },
        },
        outlinedPrimary: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
          },
        },
      },
    },

    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid #E2E8F0',
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          border: '1px solid #E2E8F0',
        },
      },
    },

    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        fullWidth: true,
        size: 'medium',
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          backgroundColor: '#FFFFFF',
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: CLARA_NAVY_LIGHT,
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderWidth: 2,
          },
        },
        notchedOutline: {
          borderColor: '#CBD5E0',
        },
      },
    },

    MuiStepIcon: {
      styleOverrides: {
        root: {
          color: '#CBD5E0',
          '&.Mui-active': {
            color: CLARA_NAVY,
            // No glow — active state is communicated solely by colour
          },
          '&.Mui-completed': {
            color: CLARA_TEAL,
          },
        },
        text: {
          fontWeight: 700,
          fontFamily: 'Inter, sans-serif',
        },
      },
    },

    MuiStepLabel: {
      styleOverrides: {
        label: {
          fontSize: '0.8125rem',
          fontWeight: 500,
          '&.Mui-active': {
            fontWeight: 700,
            color: CLARA_NAVY,
          },
          '&.Mui-completed': {
            color: CLARA_TEAL,
          },
        },
      },
    },

    MuiStepConnector: {
      styleOverrides: {
        line: {
          borderTopWidth: 2,
          borderColor: '#E2E8F0',
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          fontWeight: 500,
        },
      },
    },

    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 2,
          height: 4,
          backgroundColor: '#E2E8F0',
        },
        bar: {
          borderRadius: 2,
        },
      },
    },
  },
}

const claraTheme = createTheme(themeOptions)

export default claraTheme
