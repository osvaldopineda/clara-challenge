/**
 * @file src/pages/StepSummary.tsx
 * @description Step 3 — Review & Confirmation.
 *
 * Calls computeAndStorePremium() on mount so the premium is always fresh
 * when the user lands here. Phase 5 will render the full summary UI.
 */

import { useEffect } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Alert from '@mui/material/Alert'
import Divider from '@mui/material/Divider'
import { useNavigate } from 'react-router-dom'
import { useQuoteContext } from '../context/QuoteContext'
import { ROUTES } from '../utils/routes'

export default function StepSummary() {
  const navigate = useNavigate()
  const { state, computeAndStorePremium, resetQuote } = useQuoteContext()

  // Compute (or recompute) the premium whenever this page is visited
  useEffect(() => {
    computeAndStorePremium()
  }, [computeAndStorePremium])

  const handleStartOver = () => {
    resetQuote()
    void navigate(ROUTES.PERSONAL_INFO)
  }

  return (
    <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
      {/* Colour band */}
      <Box sx={{ height: 6, background: 'linear-gradient(90deg, #1B3A6B 0%, #0097A7 100%)' }} />

      <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
          <Typography variant="h2" component="h1" color="primary.main">
            Review Your Quote
          </Typography>
          <Chip label="Step 3 of 3" size="small" color="secondary" sx={{ fontWeight: 700 }} />
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Please review your information below before submitting.
        </Typography>

        <Divider sx={{ mb: 3 }} />

        {/* Live premium preview */}
        {state.premium ? (
          <Alert
            severity="success"
            sx={{
              mb: 3,
              borderRadius: 2,
              '& .MuiAlert-message': { width: '100%' },
            }}
          >
            <Typography variant="subtitle1" fontWeight={700}>
              Estimated Monthly Premium
            </Typography>
            <Typography variant="h3" color="primary.main" fontWeight={800} sx={{ mt: 0.5 }}>
              ${state.premium.monthlyPremium.toFixed(2)}
              <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                / month
              </Typography>
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
              Base: ${state.premium.basePremium} · Multipliers applied:{' '}
              {Object.entries(state.premium.appliedMultipliers)
                .filter(([, v]) => v > 1)
                .map(([k, v]) => `${k} ×${String(v)}`)
                .join(', ') || 'none'}
            </Typography>
          </Alert>
        ) : (
          <Alert severity="info" sx={{ mb: 3 }}>
            Complete Steps 1 and 2 to see your premium estimate.
          </Alert>
        )}

        {/* Summary placeholder */}
        <Box
          sx={{
            p: 3,
            borderRadius: 2,
            border: '2px dashed',
            borderColor: 'divider',
            backgroundColor: 'background.default',
            textAlign: 'center',
            mb: 4,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            🏗️ <strong>Full summary details arriving in Phase 5</strong>
            <br />
            Applicant info · Coverage breakdown · Multiplier table · Submit button
          </Typography>
        </Box>

        {/* Navigation */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Button
            id="btn-step3-back"
            variant="outlined"
            size="large"
            onClick={() => { void navigate(ROUTES.COVERAGE) }}
          >
            ← Back
          </Button>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              id="btn-step3-restart"
              variant="outlined"
              color="error"
              size="large"
              onClick={handleStartOver}
            >
              Start Over
            </Button>
            <Button
              id="btn-step3-submit"
              variant="contained"
              color="secondary"
              size="large"
            >
              Submit Quote ✓
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}
