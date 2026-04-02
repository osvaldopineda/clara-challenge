/**
 * @file src/pages/StepSummary.tsx
 * @description Step 3 — Review & Confirmation.
 *
 * Calls computeAndStorePremium() on mount so the premium is always fresh.
 * Renders a complete read-only summary, submits to a mock API, and handles
 * success/error states via an accessible Snackbar.
 */

import { useEffect, useState, useRef } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Alert from '@mui/material/Alert'
import Divider from '@mui/material/Divider'
import CircularProgress from '@mui/material/CircularProgress'
import Paper from '@mui/material/Paper'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Snackbar from '@mui/material/Snackbar'
import Grid from '@mui/material/Grid'
import CheckIcon from '@mui/icons-material/Check'
import { useNavigate, Navigate } from 'react-router-dom'
import { useQuoteContext } from '../context'
import { ROUTES } from '../utils'
import { submitQuote } from '../services'

export default function StepSummary() {
  const navigate = useNavigate()
  const { state, computeAndStorePremium, resetQuote } = useQuoteContext()
  const errorRef = useRef<HTMLDivElement>(null)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [snackbar, setSnackbar] = useState<{
    open: boolean
    message: string
    severity: 'success' | 'error'
  }>({
    open: false,
    message: '',
    severity: 'success',
  })

  useEffect(() => {
    if (state.personalInfo && state.coverage) {
      computeAndStorePremium()
    }
  }, [state.personalInfo, state.coverage, computeAndStorePremium])

  if (!state.personalInfo || !state.coverage) {
    return <Navigate to={ROUTES.PERSONAL_INFO} replace />
  }

  const handleStartOver = () => {
    resetQuote()
    void navigate(ROUTES.PERSONAL_INFO)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setSnackbar({ ...snackbar, open: false })

    try {
      const response = await submitQuote(state)
      setSnackbar({ open: true, message: response.message, severity: 'success' })
    } catch (error) {
      const err = error as Error
      setSnackbar({ open: true, message: err.message, severity: 'error' })
      setTimeout(() => {
        errorRef.current?.focus()
      }, 0)
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatYesNo = (val: boolean) => (val ? 'Yes' : 'No')

  return (
    <>
      <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <Box sx={{ height: 6, backgroundColor: 'primary.main' }} />

        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <Typography variant="h2" component="h1" color="primary.main" id="summary-heading">
              Review Your Quote
            </Typography>
            <Chip label="Step 3 of 3" size="small" color="secondary" sx={{ fontWeight: 700 }} />
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Please review your information below before submitting.
          </Typography>

          <Divider sx={{ mb: 3 }} />

          {/* Premium Overview Component */}
          {state.premium && (
            <Alert
              icon={false}
              severity="success"
              aria-live="polite"
              sx={{
                mb: 4,
                borderRadius: 2,
                px: 3,
                py: 2,
                '& .MuiAlert-message': { width: '100%' },
              }}
            >
              <Typography variant="subtitle1" fontWeight={700} color="success.dark">
                Estimated Monthly Premium
              </Typography>
              <Typography variant="h3" color="primary.main" fontWeight={800} sx={{ mt: 0.5 }}>
                ${state.premium.monthlyPremium.toFixed(2)}
                <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                  / month
                </Typography>
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 0.5, display: 'block' }}
              >
                Base: ${state.premium.basePremium.toFixed(2)} · Multipliers:{' '}
                {Object.entries(state.premium.appliedMultipliers)
                  .filter(([, v]) => v > 1)
                  .map(([name, value]) => `${name} (×${String(value)})`)
                  .join(', ') || 'None applied'}
              </Typography>
            </Alert>
          )}

          {/* Detailed Read-Only Data Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }} aria-labelledby="summary-heading">
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper variant="outlined" sx={{ borderRadius: 2, height: '100%' }}>
                <Box
                  sx={{
                    bgcolor: 'rgba(27, 58, 107, 0.04)',
                    px: 2,
                    py: 1.5,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Typography variant="subtitle2" color="primary.main" fontWeight={700}>
                    Personal Information
                  </Typography>
                </Box>
                <List dense disablePadding>
                  <ListItem divider>
                    <ListItemText
                      primary="Name"
                      secondary={`${state.personalInfo.firstName} ${state.personalInfo.lastName}`}
                    />
                  </ListItem>
                  <ListItem divider>
                    <ListItemText primary="Email Address" secondary={state.personalInfo.email} />
                  </ListItem>
                  <ListItem divider>
                    <ListItemText primary="Age" secondary={`${state.personalInfo.age} years`} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="ZIP Code" secondary={state.personalInfo.zipCode} />
                  </ListItem>
                </List>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Paper variant="outlined" sx={{ borderRadius: 2, height: '100%' }}>
                <Box
                  sx={{
                    bgcolor: 'rgba(27, 58, 107, 0.04)',
                    px: 2,
                    py: 1.5,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Typography variant="subtitle2" color="primary.main" fontWeight={700}>
                    Coverage Details
                  </Typography>
                </Box>
                <List dense disablePadding>
                  <ListItem divider>
                    <ListItemText
                      primary="Selected Tier"
                      secondary={
                        state.coverage.coverageType.charAt(0).toUpperCase() +
                        state.coverage.coverageType.slice(1)
                      }
                    />
                  </ListItem>
                  <ListItem divider>
                    <ListItemText
                      primary="Pre-existing Conditions"
                      secondary={
                        state.coverage.preExistingConditions.length > 0
                          ? state.coverage.preExistingConditions.join(', ')
                          : 'None'
                      }
                    />
                  </ListItem>
                  <ListItem divider>
                    <ListItemText
                      primary="Takes Prescription Meds"
                      secondary={formatYesNo(state.coverage.takesPrescriptionMedication)}
                    />
                  </ListItem>
                  <ListItem divider>
                    <ListItemText
                      primary="Uses Tobacco"
                      secondary={formatYesNo(state.coverage.usesTobacco)}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Includes Spouse"
                      secondary={formatYesNo(state.coverage.includesSpouse)}
                    />
                  </ListItem>
                </List>
              </Paper>
            </Grid>
          </Grid>

          {/* Action Footer */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            <Button
              id="btn-step3-back"
              variant="outlined"
              size="large"
              onClick={() => {
                void navigate(ROUTES.COVERAGE)
              }}
              disabled={isSubmitting}
              aria-label="Go back to coverage selection"
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
                disabled={isSubmitting}
                aria-label="Start quote over and clear data"
              >
                Start Over
              </Button>

              <Button
                id="btn-step3-submit"
                variant="contained"
                color="primary"
                size="large"
                onClick={handleSubmit}
                disabled={isSubmitting}
                aria-label={
                  isSubmitting ? 'Submitting your quote, please wait' : 'Submit your final quote'
                }
                sx={{ minWidth: 160 }}
                startIcon={isSubmitting ? undefined : <CheckIcon />}
              >
                {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Submit Quote'}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Accessible Feedback Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => {
          setSnackbar({ ...snackbar, open: false })
        }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => {
            setSnackbar({ ...snackbar, open: false })
          }}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%', borderRadius: 2 }}
          ref={errorRef}
          tabIndex={-1}
          action={
            snackbar.severity === 'error' && (
              <Button
                color="inherit"
                size="small"
                onClick={handleSubmit}
                aria-label="Retry submitting quote"
              >
                RETRY
              </Button>
            )
          }
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  )
}
