/**
 * @file src/pages/StepCoverage.tsx
 * @description Step 2 — Coverage Selection (+ conditional health questions for age > 65).
 *
 * Phase 5 will replace the placeholder with the full RHF + Yup form.
 * Note: Additional health questions (pre-existing conditions, tobacco, spouse)
 * are rendered INSIDE this step — not on a separate page.
 */

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import { useNavigate } from 'react-router-dom'
import { useQuoteContext } from '../context/QuoteContext'
import { ROUTES } from '../utils/routes'

export default function StepCoverage() {
  const navigate = useNavigate()
  const { state } = useQuoteContext()

  return (
    <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
      {/* Colour band */}
      <Box sx={{ height: 6, background: 'linear-gradient(90deg, #1B3A6B 40%, #0097A7 100%)' }} />

      <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
          <Typography variant="h2" component="h1" color="primary.main">
            Coverage Selection
          </Typography>
          <Chip label="Step 2 of 3" size="small" color="primary" sx={{ fontWeight: 700 }} />
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Choose the coverage tier that best fits your needs. If you are over 65, we'll ask
          a few additional health questions to refine your estimate.
        </Typography>

        <Divider sx={{ mb: 3 }} />

        {/* Coverage tiers placeholder */}
        <Box
          sx={{
            p: 3,
            borderRadius: 2,
            border: '2px dashed',
            borderColor: 'divider',
            backgroundColor: 'background.default',
            textAlign: 'center',
            mb: 3,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            🏗️ <strong>Coverage tier cards arriving in Phase 5</strong>
            <br />
            Basic ($50/mo) · Standard ($100/mo) · Premium ($200/mo)
          </Typography>

          {state.coverage && (
            <Typography variant="caption" sx={{ mt: 1, display: 'block', color: 'success.main' }}>
              ✓ Draft saved: {state.coverage.coverageType} tier
            </Typography>
          )}
        </Box>

        {/* Additional questions placeholder */}
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
            🏗️ <strong>Conditional health questions arriving in Phase 5</strong>
            <br />
            Shown only when applicant age {'>'} 65 · Pre-existing conditions · Tobacco · Spouse
          </Typography>
        </Box>

        {/* Navigation */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            id="btn-step2-back"
            variant="outlined"
            size="large"
            onClick={() => { void navigate(ROUTES.PERSONAL_INFO) }}
          >
            ← Back
          </Button>
          <Button
            id="btn-step2-next"
            variant="contained"
            size="large"
            onClick={() => { void navigate(ROUTES.SUMMARY) }}
          >
            Next: Review →
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
}
