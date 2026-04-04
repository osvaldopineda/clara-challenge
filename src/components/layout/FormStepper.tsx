/**
 * @file src/components/layout/FormStepper.tsx
 * @description MUI Stepper that visualises the 3-step quote wizard progress.
 *
 * Phase 4 update: `activeStep` is now derived from the current URL using
 * `useLocation` (react-router-dom) rather than received as a prop.
 * This makes the stepper self-contained and always in sync with the router.
 *
 * Step definitions are imported from the shared STEP_ROUTES constant so
 * the route ↔ step mapping lives in exactly one place.
 */

import Box from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useLocation } from 'react-router-dom'
import { STEP_ROUTES } from '../../utils/routes'

/**
 * Maps the current pathname to a zero-based step index.
 * Returns 0 (first step) for any unrecognised path so the stepper
 * never shows an invalid state during redirect transitions.
 */
function useActiveStep(): number {
  const { pathname } = useLocation()
  const index = STEP_ROUTES.findIndex((s) => s.path === pathname)
  return index >= 0 ? index : 0
}

export default function FormStepper() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const activeStep = useActiveStep()

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
          Step {activeStep + 1} of {STEP_ROUTES.length} &mdash;{' '}
          {STEP_ROUTES[activeStep]?.label}
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
        {STEP_ROUTES.map((step, index) => (
          <Step key={step.path} completed={index < activeStep}>
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
