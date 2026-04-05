import { useEffect, useState, useRef } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Alert from '@mui/material/Alert'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Snackbar from '@mui/material/Snackbar'
import Grid from '@mui/material/Grid'
import { useNavigate, Navigate } from 'react-router-dom'
import { useQuoteContext } from '../context/QuoteContext'
import { ROUTES } from '../utils/routes'
import { submitQuote } from '../services/api'
import { StepNavigation, PremiumDisplay } from '../components/common'
import { SENIOR_AGE_THRESHOLD } from '../utils/premiumCalculator'

const CONDITION_LABELS: Record<string, string> = {
  diabetes: 'Diabetes',
  heart_disease: 'Heart Disease',
  hypertension: 'Hypertension',
  cancer_history: 'Cancer History',
  other: 'Other',
}

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

  const isSenior = state.personalInfo.age > SENIOR_AGE_THRESHOLD

  const handleStartOver = () => {
    resetQuote()
    void navigate(ROUTES.PERSONAL_INFO)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setSnackbar({ ...snackbar, open: false })

    try {
      await submitQuote(state)
      void navigate(ROUTES.SUCCESS)
    } catch (error) {
      const err = error as Error
      setSnackbar({ open: true, message: err.message, severity: 'error' })
      setTimeout(() => {
        errorRef.current?.focus()
      }, 0)
      setIsSubmitting(false)
    }
  }

  const formatYesNo = (val: boolean) => (val ? 'Yes' : 'No')

  return (
    <>
      <Card sx={{ overflow: 'hidden' }}>
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <Typography variant="h2" component="h1" id="summary-heading">
              Review Your Quote
            </Typography>
            <Chip label="Step 3 of 3" size="small" color="secondary" sx={{ fontWeight: 700 }} />
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Please review your information below before submitting.
          </Typography>

          <Divider sx={{ mb: 3 }} />

          {state.premium && (
            <PremiumDisplay
              monthlyPremium={state.premium.monthlyPremium}
              basePremium={state.premium.basePremium}
              appliedMultipliers={state.premium.appliedMultipliers}
            />
          )}

          <Grid container spacing={3} sx={{ mb: 4 }} aria-labelledby="summary-heading">
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper variant="outlined" sx={{ borderRadius: 1, height: '100%' }}>
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
                    <ListItemText
                      primary="Age"
                      secondary={`${String(state.personalInfo.age)} ${state.personalInfo.age === 1 ? 'year' : 'years'}`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="ZIP Code" secondary={state.personalInfo.zipCode} />
                  </ListItem>
                </List>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Paper variant="outlined" sx={{ borderRadius: 1, height: '100%' }}>
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
                  {isSenior && (
                    <>
                      <ListItem divider>
                        <ListItemText
                          primary="Pre-existing Conditions"
                          secondary={
                            state.coverage.preExistingConditions.length > 0
                              ? state.coverage.preExistingConditions
                                  .map((c) => CONDITION_LABELS[c] || c)
                                  .join(', ')
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
                    </>
                  )}
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

          <StepNavigation
            onBack={() => {
              void navigate(ROUTES.COVERAGE)
            }}
            onNext={() => void handleSubmit()}
            isSubmitting={isSubmitting}
            isLastStep={true}
            showReset={true}
            onReset={handleStartOver}
          />
        </CardContent>
      </Card>

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
          sx={{ width: '100%', borderRadius: 1 }}
          ref={errorRef}
          tabIndex={-1}
          action={
            snackbar.severity === 'error' && (
              <Button
                color="inherit"
                size="small"
                variant="outlined"
                sx={{ px: 2, py: 0.5, textTransform: 'uppercase', fontWeight: 600 }}
                onClick={() => void handleSubmit()}
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
