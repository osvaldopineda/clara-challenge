/**
 * @file src/pages/StepPersonalInfo.tsx
 * @description Step 1 — Personal Information.
 *
 * Phase 5 will replace the placeholder with the full RHF + Yup form.
 * The page already consumes QuoteContext so the wiring is ready.
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

export default function StepPersonalInfo() {
  const navigate = useNavigate()
  const { state } = useQuoteContext()

  return (
    <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
      {/* Colour band */}
      <Box sx={{ height: 6, background: 'linear-gradient(90deg, #1B3A6B 0%, #2A5298 100%)' }} />

      <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
          <Typography variant="h2" component="h1" color="primary.main">
            Personal Information
          </Typography>
          <Chip label="Step 1 of 3" size="small" color="primary" sx={{ fontWeight: 700 }} />
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          We need a few details to generate your personalised quote. All information is
          kept strictly confidential.
        </Typography>

        <Divider sx={{ mb: 3 }} />

        {/* Fields placeholder */}
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
            🏗️ <strong>Form fields arriving in Phase 5</strong>
            <br />
            First Name · Last Name · Date of Birth · Email · ZIP Code
          </Typography>

          {/* Show persisted data hint if available */}
          {state.personalInfo && (
            <Typography variant="caption" sx={{ mt: 1, display: 'block', color: 'success.main' }}>
              ✓ Draft saved:{' '}
              {state.personalInfo.firstName} {state.personalInfo.lastName}
            </Typography>
          )}
        </Box>

        {/* Navigation */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            id="btn-step1-next"
            variant="contained"
            size="large"
            onClick={() => { void navigate(ROUTES.COVERAGE) }}
          >
            Next: Coverage →
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
}
