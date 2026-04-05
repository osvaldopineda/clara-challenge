import Alert from '@mui/material/Alert'
import Typography from '@mui/material/Typography'

interface PremiumDisplayProps {
  monthlyPremium: number
  basePremium: number
  appliedMultipliers?: Record<string, number>
}

export default function PremiumDisplay({
  monthlyPremium,
  basePremium,
  appliedMultipliers = {},
}: PremiumDisplayProps) {
  return (
    <Alert
      icon={false}
      severity="success"
      aria-live="polite"
      sx={{
        mb: 4,
        borderRadius: 1,
        px: 3,
        py: 2,
        '& .MuiAlert-message': { width: '100%' },
      }}
    >
      <Typography variant="subtitle1" fontWeight={700} color="success.dark">
        Estimated Monthly Premium
      </Typography>
      <Typography variant="h3" color="primary.main" fontWeight={800} sx={{ mt: 0.5 }}>
        ${monthlyPremium.toFixed(2)}
        <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 1 }}>
          / month
        </Typography>
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
        Base: ${basePremium.toFixed(2)} · Multipliers:{' '}
        {Object.entries(appliedMultipliers)
          .filter(([, v]) => v > 1)
          .map(([name, value]) => `${name}: ${String(value)}x`)
          .join(', ') || 'None applied'}
      </Typography>
    </Alert>
  )
}
