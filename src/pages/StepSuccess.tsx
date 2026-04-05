import { useNavigate, Navigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import { useQuoteContext } from '../context/QuoteContext'
import { ROUTES } from '../utils/routes'

export default function StepSuccess() {
  const navigate = useNavigate()
  const { state, resetQuote } = useQuoteContext()

  if (!state.personalInfo) {
    return <Navigate to={ROUTES.PERSONAL_INFO} replace />
  }

  const handleStartOver = () => {
    resetQuote()
    void navigate(ROUTES.PERSONAL_INFO)
  }

  return (
    <Card sx={{ overflow: 'hidden', textAlign: 'center', py: 4 }}>
      <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
        <CheckCircleOutlineIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
        <Typography variant="h2" component="h1" gutterBottom>
          Quote Submitted!
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          An agent will contact you shortly at{' '}
          <Box component="span" fontWeight="bold" color="text.primary">
            {state.personalInfo.email}
          </Box>
          .
        </Typography>
        <Button variant="contained" size="large" onClick={handleStartOver}>
          Start New Quote
        </Button>
      </CardContent>
    </Card>
  )
}
