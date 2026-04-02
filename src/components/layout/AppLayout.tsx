/**
 * @file src/components/layout/AppLayout.tsx
 * @description Root layout shell for the Clara Quote Calculator.
 *
 * Structure:
 *   ┌─────────────────────────────────────────┐
 *   │  AppBar  (Clara Onboarding header)       │
 *   ├─────────────────────────────────────────┤
 *   │  FormStepper  (3-step progress bar)      │
 *   ├─────────────────────────────────────────┤
 *   │  <main>                                  │
 *   │    <Container maxWidth="md">             │
 *   │      {children}   ← page content        │
 *   │    </Container>                          │
 *   │  </main>                                 │
 *   └─────────────────────────────────────────┘
 *
 * The layout no longer needs an activeStep prop — FormStepper now derives
 * the active step from useLocation (React Router) directly.
 */

import type { ReactNode } from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import Chip from '@mui/material/Chip'
import FormStepper from './FormStepper'

// ─── Clara Logo Mark ──────────────────────────────────────────────────────────

function ClaraLogo() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.25,
        textDecoration: 'none',
      }}
      component="span"
    >
      {/* Geometric shield icon — inline SVG, no external dep */}
      <Box
        component="svg"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        sx={{ width: 32, height: 32, flexShrink: 0 }}
        aria-hidden="true"
      >
        <path
          d="M16 2L4 7V16C4 22.627 9.373 28 16 30C22.627 28 28 22.627 28 16V7L16 2Z"
          fill="white"
          fillOpacity="0.15"
          stroke="white"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M12 16.5L14.5 19L20 13"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Box>

      <Typography
        variant="h6"
        component="span"
        sx={{
          fontWeight: 700,
          color: 'white',
          letterSpacing: '-0.01em',
          lineHeight: 1,
        }}
      >
        Clara
      </Typography>
    </Box>
  )
}

// ─── Component Props ──────────────────────────────────────────────────────────

interface AppLayoutProps {
  children: ReactNode
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: 'background.default',
      }}
    >
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, #112447 0%, #1B3A6B 60%, #2A5298 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <Toolbar
          sx={{
            minHeight: { xs: 56, sm: 64 },
            px: { xs: 2, sm: 3, md: 4 },
            justifyContent: 'space-between',
          }}
        >
          {/* Brand */}
          <ClaraLogo />

          {/* Right-side badge */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Tooltip title="Your quote is private and encrypted" arrow placement="bottom">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, cursor: 'default' }}>
                <Box
                  component="svg"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  sx={{ width: 16, height: 16, opacity: 0.75 }}
                  aria-hidden="true"
                >
                  <path
                    d="M10 1L3 4.5V10C3 14.1 6.1 17.9 10 19C13.9 17.9 17 14.1 17 10V4.5L10 1Z"
                    stroke="rgba(255,255,255,0.75)"
                    strokeWidth="1.4"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M7.5 10.5L9 12L12.5 8.5"
                    stroke="rgba(255,255,255,0.75)"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: 'rgba(255,255,255,0.7)',
                    fontWeight: 500,
                    display: { xs: 'none', sm: 'block' },
                  }}
                >
                  Secure Quote
                </Typography>
              </Box>
            </Tooltip>

            <Chip
              label="No commitment"
              size="small"
              sx={{
                backgroundColor: 'rgba(255,255,255,0.12)',
                color: 'rgba(255,255,255,0.85)',
                fontWeight: 600,
                fontSize: '0.7rem',
                height: 24,
                border: '1px solid rgba(255,255,255,0.2)',
                display: { xs: 'none', md: 'flex' },
              }}
            />
          </Box>
        </Toolbar>
      </AppBar>

      {/* ── Step Progress ───────────────────────────────────────────────────── */}
      <FormStepper />

      {/* ── Main Content ────────────────────────────────────────────────────── */}
      <Box
        component="main"
        sx={{
          flex: 1,
          py: { xs: 3, sm: 5 },
          px: { xs: 2, sm: 3 },
        }}
      >
        <Container
          maxWidth="md"
          sx={{
            // Vertical centering feel — nudge content up slightly
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
          }}
        >
          {children}
        </Container>
      </Box>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <Box
        component="footer"
        sx={{
          py: 2.5,
          px: 3,
          borderTop: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.paper',
          textAlign: 'center',
        }}
      >
        <Typography variant="caption" color="text.secondary">
          © {new Date().getFullYear()} Clara Insurance · All rights reserved ·{' '}
          <Box
            component="a"
            href="#"
            sx={{
              color: 'primary.main',
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            Privacy Policy
          </Box>
        </Typography>
      </Box>
    </Box>
  )
}
