/**
 * @file src/pages/StepPersonalInfo.tsx
 * @description Step 1 — Personal Information.
 *
 * Implements RHF with Yup validation for Name, Email, Age, and Zip Code.
 */

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import TextField from '@mui/material/TextField'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useQuoteContext } from '../context/QuoteContext'
import { ROUTES } from '../utils/routes'
import type { PersonalInfoStep } from '../types/quote.types'

const schema = yup
  .object({
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    email: yup
      .string()
      .email('Invalid email address')
      .required('Email is required'),
    age: yup
      .number()
      .transform((value) => (isNaN(value) ? undefined : value))
      .positive('Age must be a positive number')
      .integer('Age must be a whole number')
      .required('Age is required'),
    zipCode: yup
      .string()
      .matches(/^\d{5}(-\d{4})?$/, 'Must be a valid ZIP code (e.g., 12345)')
      .required('ZIP code is required'),
  })
  .required()

export default function StepPersonalInfo() {
  const navigate = useNavigate()
  const { state, dispatch } = useQuoteContext()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PersonalInfoStep>({
    resolver: yupResolver(schema),
    defaultValues: state.personalInfo || {
      firstName: '',
      lastName: '',
      email: '',
      age: '' as unknown as number, // allows placeholder empty state
      zipCode: '',
    },
  })

  const onSubmit = (data: PersonalInfoStep) => {
    dispatch({ type: 'SET_PERSONAL_INFO', payload: data })
    void navigate(ROUTES.COVERAGE)
  }

  return (
    <Card sx={{ overflow: 'hidden' }}>
      <Box sx={{ height: 3, backgroundColor: 'primary.main' }} />

      <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
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

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
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
                  inputProps={{ min: 0 }}
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

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="submit"
              id="btn-step1-next"
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
            >
              Next: Coverage
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}
