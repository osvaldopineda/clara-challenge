/**
 * @file src/App.tsx
 * @description Root component.
 *
 * Phase 3: renders the AppLayout shell with a placeholder card so we
 * can visually verify the theme, header, stepper, and responsive layout
 * before Phase 4 introduces React Router and the real wizard pages.
 *
 * Phase 4 will replace this file's body with a <RouterProvider> or
 * <BrowserRouter> containing the route tree.
 */

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import AppLayout from './components/layout/AppLayout'

// ─── Palette Preview ──────────────────────────────────────────────────────────

function ThemePreviewCard() {
  return (
    <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
      {/* Gradient Band */}
      <Box
        sx={{
          height: 8,
          background: 'linear-gradient(90deg, #1B3A6B 0%, #0097A7 100%)',
        }}
      />

      <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
        {/* Heading */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
          <Typography variant="h2" component="h1" color="primary.main">
            Get Your Insurance Quote
          </Typography>
          <Chip
            label="Phase 3"
            size="small"
            color="secondary"
            sx={{ fontWeight: 700, fontSize: '0.7rem' }}
          />
        </Box>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Complete the three steps below to receive your personalised monthly premium estimate. 
          This takes less than 2 minutes.
        </Typography>

        <Divider sx={{ mb: 3 }} />

        {/* Feature row */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
            gap: 2,
            mb: 4,
          }}
        >
          {[
            { icon: '🔒', label: 'Secure & Private', desc: 'Your data is encrypted end-to-end' },
            { icon: '⚡', label: 'Instant Quote', desc: 'Results calculated in real time' },
            { icon: '📋', label: 'No Commitment', desc: 'Get a quote without signing up' },
          ].map(({ icon, label, desc }) => (
            <Box
              key={label}
              sx={{
                p: 2,
                borderRadius: 2,
                backgroundColor: 'background.default',
                border: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                flexDirection: 'column',
                gap: 0.5,
              }}
            >
              <Typography fontSize="1.5rem" lineHeight={1}>
                {icon}
              </Typography>
              <Typography variant="subtitle2" color="text.primary" fontWeight={600}>
                {label}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {desc}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* CTA */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            id="btn-start-quote"
            variant="contained"
            color="primary"
            size="large"
            sx={{ flex: { xs: '1 1 100%', sm: '0 0 auto' } }}
          >
            Start Your Quote →
          </Button>
          <Button
            id="btn-learn-more"
            variant="outlined"
            color="primary"
            size="large"
            sx={{ flex: { xs: '1 1 100%', sm: '0 0 auto' } }}
          >
            Learn About Plans
          </Button>
        </Box>

        <Typography
          variant="caption"
          sx={{ display: 'block', mt: 2, color: 'text.secondary' }}
        >
          ⚠️ <strong>Phase 3 placeholder</strong> — router + form steps added in Phase 4.
        </Typography>
      </CardContent>
    </Card>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <AppLayout activeStep={0}>
      <ThemePreviewCard />
    </AppLayout>
  )
}
