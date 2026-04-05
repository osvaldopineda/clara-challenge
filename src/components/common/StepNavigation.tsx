import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CheckIcon from '@mui/icons-material/Check'
import CircularProgress from '@mui/material/CircularProgress'

interface StepNavigationProps {
  onBack?: () => void
  onNext?: () => void
  isSubmitting?: boolean
  isLastStep?: boolean
  showReset?: boolean
  onReset?: () => void
}

export default function StepNavigation({
  onBack,
  onNext,
  isSubmitting = false,
  isLastStep = false,
  showReset = false,
  onReset,
}: StepNavigationProps) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, flexWrap: 'wrap', gap: 2 }}>
      {onBack ? (
        <Button
          variant="outlined"
          size="large"
          startIcon={<ArrowBackIcon />}
          onClick={onBack}
          disabled={isSubmitting}
        >
          Back
        </Button>
      ) : (
        <Box /> // flex spacer layout
      )}

      <Box sx={{ display: 'flex', gap: 2 }}>
        {showReset && onReset && (
          <Button
            variant="outlined"
            color="error"
            size="large"
            onClick={onReset}
            disabled={isSubmitting}
          >
            Start Over
          </Button>
        )}

        <Button
          type={onNext ? 'button' : 'submit'}
          onClick={onNext}
          variant="contained"
          color="primary"
          size="large"
          disabled={isSubmitting}
          endIcon={isSubmitting ? undefined : isLastStep ? <CheckIcon /> : <ArrowForwardIcon />}
          sx={{ minWidth: isLastStep ? 160 : 'auto' }}
        >
          {isSubmitting ? (
            <CircularProgress size={24} color="inherit" />
          ) : isLastStep ? (
            'Submit Quote'
          ) : (
            'Next Step'
          )}
        </Button>
      </Box>
    </Box>
  )
}
