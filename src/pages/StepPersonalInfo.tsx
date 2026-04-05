import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import TextField from '@mui/material/TextField'
import { useNavigate } from 'react-router-dom'
import { Controller } from 'react-hook-form'
import { useQuoteContext } from '../context/QuoteContext'
import { ROUTES } from '../utils/routes'
import { usePersonalInfoForm } from '../hooks'
import { StepNavigation } from '../components/common'
import type { PersonalInfoStep } from '../types/quote.types'

export default function StepPersonalInfo() {
  const navigate = useNavigate()
  const { state, dispatch } = useQuoteContext()

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = usePersonalInfoForm(state.personalInfo ?? undefined)

  const onSubmit = (data: PersonalInfoStep) => {
    dispatch({ type: 'SET_PERSONAL_INFO', payload: data })
    void navigate(ROUTES.COVERAGE)
  }

  return (
    <Card sx={{ overflow: 'hidden' }}>
      <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
          <Typography color="primary.dark" variant="h2" component="h1">
            Personal Information
          </Typography>
          <Chip label="Step 1 of 3" size="small" color="primary" sx={{ fontWeight: 700 }} />
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          We need a few details to generate your personalised quote. All information is kept
          strictly confidential.
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <Box component="form" onSubmit={(e) => void handleSubmit(onSubmit)(e)} noValidate>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 2.5,
              mb: 4,
            }}
          >
            <Controller
              name="firstName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="First Name"
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message}
                  fullWidth
                />
              )}
            />

            <Controller
              name="lastName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Last Name"
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message}
                  fullWidth
                />
              )}
            />

            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="email"
                  label="Email Address"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  fullWidth
                  sx={{ gridColumn: { sm: 'span 2' } }}
                />
              )}
            />

            <Controller
              name="age"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="number"
                  label="Age"
                  slotProps={{ htmlInput: { min: 0 } }}
                  error={!!errors.age}
                  helperText={errors.age?.message}
                  fullWidth
                />
              )}
            />

            <Controller
              name="zipCode"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="ZIP Code"
                  placeholder="12345"
                  error={!!errors.zipCode}
                  helperText={errors.zipCode?.message}
                  fullWidth
                />
              )}
            />
          </Box>

          <StepNavigation isSubmitting={isSubmitting} />
        </Box>
      </CardContent>
    </Card>
  )
}
