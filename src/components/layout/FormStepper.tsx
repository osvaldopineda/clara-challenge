/**
 * @file src/components/layout/FormStepper.tsx
 * @description MUI Stepper that visualises the 3-step quote wizard progress.
 *
 * Phase 4 will connect `activeStep` to React Router + Context.
 * For now it is received as a prop, defaulting to 0 (Step 1 active).
 *
 * Step definitions are co-located here so the stepper is self-contained;
 * they will be centralised in a shared constant once routing is added.
 */

import Box from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

// ─── Step Definitions ─────────────────────────────────────────────────────────

interface StepDefinition {
  label: string
  description: string
}

const QUOTE_STEPS: StepDefinition[] = [
  {
    label: 'Personal Info',
    description: 'Tell us about yourself',
  },
  {
    label: 'Coverage',
    description: 'Choose your plan',
  },
  {
    label: 'Review',
    description: 'Confirm & submit',
  },
]

// ─── Component ────────────────────────────────────────────────────────────────

interface FormStepperProps {
  /**
   * Zero-indexed active step (0 = Personal Info, 1 = Coverage, 2 = Review).
   * Defaults to 0 — will be driven by context in Phase 4.
   */
  activeStep?: number
}

export default function FormStepper({ activeStep = 0 }: FormStepperProps) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Box
      sx={{
        width: '100%',
        py: { xs: 2.5, sm: 3.5 },
        px: { xs: 2, sm: 4 },
        backgroundColor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      {/* Step counter label for mobile */}
      {isMobile && (
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            textAlign: 'center',
            mb: 1.5,
            color: 'text.secondary',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}
        >
          Step {activeStep + 1} of {QUOTE_STEPS.length} &mdash;{' '}
          {QUOTE_STEPS[activeStep]?.label}
        </Typography>
      )}

      <Stepper
        activeStep={activeStep}
        alternativeLabel={!isMobile}
        sx={{
          '& .MuiStepConnector-line': {
            borderTopWidth: 2,
          },
        }}
      >
        {QUOTE_STEPS.map((step, index) => (
          <Step key={step.label} completed={index < activeStep}>
            <StepLabel
              optional={
                !isMobile && (
                  <Typography
                    variant="caption"
                    sx={{ color: 'text.secondary', display: 'block', textAlign: 'center' }}
                  >
                    {step.description}
                  </Typography>
                )
              }
            >
              {step.label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  )
}
