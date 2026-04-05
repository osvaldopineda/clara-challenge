import { createTheme } from '@mui/material/styles'
import type { ThemeOptions } from '@mui/material/styles'

const BRAND_ACTION = '#011d5fff'
const BRAND_ACTION_HOVER = '#022880ff'
const BRAND_DARK = '#0F172A'
const BRAND_SUCCESS = '#10B981'
const SURFACE_BG = '#F8FAFC'
const PAPER_BG = '#FFFFFF'
const TEXT_MAIN = '#0F172A'
const TEXT_MUTED = '#64748B'
const BORDER_COLOR = '#E2E8F0'

const themeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: BRAND_ACTION,
      dark: BRAND_DARK,
      light: BRAND_ACTION_HOVER,
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: BRAND_SUCCESS,
      contrastText: '#FFFFFF',
    },
    background: {
      default: SURFACE_BG,
      paper: PAPER_BG,
    },
    text: {
      primary: TEXT_MAIN,
      secondary: TEXT_MUTED,
    },
    divider: BORDER_COLOR,
    error: {
      main: '#DC2626',
    },
    success: {
      main: BRAND_SUCCESS,
    },
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
    h1: { fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.2 },
    h2: { fontSize: '1.5rem', fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.3 },
    h3: { fontSize: '1.25rem', fontWeight: 600, letterSpacing: '-0.015em' },
    h4: { fontSize: '1.125rem', fontWeight: 600 },
    h5: { fontSize: '1rem', fontWeight: 600 },
    h6: { fontSize: '0.875rem', fontWeight: 600 },
    subtitle1: { fontSize: '1rem', fontWeight: 500, lineHeight: 1.5 },
    subtitle2: { fontSize: '0.875rem', fontWeight: 500, color: TEXT_MUTED },
    body1: { fontSize: '1rem', lineHeight: 1.6 },
    body2: { fontSize: '0.875rem', lineHeight: 1.57 },
    button: { textTransform: 'none', fontWeight: 600, letterSpacing: '0.01em' },
    caption: { fontSize: '0.75rem', color: TEXT_MUTED },
  },
  shape: {
    borderRadius: 4,
  },
  shadows: [
    'none',
    '0px 1px 2px rgba(0,0,0,0.06)',
    '0px 1px 3px rgba(0,0,0,0.08)',
    '0px 2px 4px rgba(0,0,0,0.08)',
    '0px 2px 6px rgba(0,0,0,0.10)',
    '0px 2px 8px rgba(0,0,0,0.10)',
    ...Array<string>(19).fill('0px 2px 8px rgba(0,0,0,0.10)'),
  ] as ThemeOptions['shadows'],
  components: {
    MuiCssBaseline: {
      styleOverrides: `

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
          transition: 'background-color 0.15s ease, border-color 0.15s ease',
        },
        containedPrimary: {
          '&:hover': {
            backgroundColor: BRAND_ACTION_HOVER,
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
          border: `1px solid ${BORDER_COLOR}`,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          border: `1px solid ${BORDER_COLOR}`,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        fullWidth: true,
        size: 'medium',
        color: 'primary',
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          backgroundColor: PAPER_BG,
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: BRAND_ACTION_HOVER,
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderWidth: 2,
            borderColor: BRAND_ACTION,
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
            color: BRAND_ACTION,
          },
          '&.Mui-completed': {
            color: BRAND_SUCCESS,
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
          color: TEXT_MUTED,
          '&.Mui-active': {
            fontWeight: 700,
            color: BRAND_ACTION,
          },
          '&.Mui-completed': {
            color: BRAND_SUCCESS,
          },
        },
      },
    },
    MuiStepConnector: {
      styleOverrides: {
        line: {
          borderTopWidth: 2,
          borderColor: BORDER_COLOR,
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
          backgroundColor: BORDER_COLOR,
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
