/**
 * @file src/pages/StepCoverage.tsx
 * @description Step 2 — Coverage Selection.
 *
 * Implements RHF with Yup validation, conditional additional questions for
 * seniors (age > 65), nested conditions (Pre-existing multiselect), and
 * real-time premium calculation.
 */

import { useMemo } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import FormHelperText from '@mui/material/FormHelperText'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Checkbox from '@mui/material/Checkbox'
import ListItemText from '@mui/material/ListItemText'
import InputLabel from '@mui/material/InputLabel'
import OutlinedInput from '@mui/material/OutlinedInput'
import { useNavigate, Navigate } from 'react-router-dom'
import { useForm, Controller, useWatch } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useQuoteContext } from '../context'
import { ROUTES, calculatePremium, SENIOR_AGE_THRESHOLD } from '../utils'
import { CoverageType, PreExistingCondition, type CoverageStep } from '../types'


const schema = yup.object().shape({
  coverageType: yup
    .string()
    .oneOf(Object.values(CoverageType))
    .required('Please select a coverage type'),

  hasPreExisting: yup.string().when('$isSenior', {
    is: true,
    then: (s) => s.required('Please answer this question'),
  }),
  preExistingConditions: yup
    .array()
    .of(yup.string())
    .when('hasPreExisting', {
      is: 'true',
      then: (s) =>
        s
          .min(1, 'Please select at least one condition')
          .required('Please select at least one condition'),
    }),
  takesPrescriptionMedication: yup.string().when('$isSenior', {
    is: true,
    then: (s) => s.required('Please answer this question'),
  }),
  usesTobacco: yup.string().when('$isSenior', {
    is: true,
    then: (s) => s.required('Please answer this question'),
  }),
  includesSpouse: yup.string().when('$isSenior', {
    is: true,
    then: (s) => s.required('Please answer this question'),
  }),
})

type CoverageFormValues = {
  coverageType: string
  hasPreExisting?: string
  preExistingConditions?: string[]
  takesPrescriptionMedication?: string
  usesTobacco?: string
  includesSpouse?: string
}


export default function StepCoverage() {
  const navigate = useNavigate()
  const { state, dispatch } = useQuoteContext()

  const isDataMissing = !state.personalInfo

  const age = state.personalInfo?.age ?? 30
  const isSenior = age > SENIOR_AGE_THRESHOLD


  const defaultValues: CoverageFormValues = {
    coverageType: state.coverage?.coverageType || '',
    hasPreExisting: state.coverage
      ? state.coverage.preExistingConditions.length > 0
        ? 'true'
        : 'false'
      : '',
    preExistingConditions: state.coverage?.preExistingConditions || [],
    takesPrescriptionMedication: state.coverage
      ? state.coverage.takesPrescriptionMedication
        ? 'true'
        : 'false'
      : '',
    usesTobacco: state.coverage ? (state.coverage.usesTobacco ? 'true' : 'false') : '',
    includesSpouse: state.coverage ? (state.coverage.includesSpouse ? 'true' : 'false') : '',
  }

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CoverageFormValues>({
    resolver: yupResolver(schema) as any,
    defaultValues,
    context: { isSenior },
  })


  const formValues = useWatch({ control })

  const livePremium = useMemo(() => {
    if (
      !formValues.coverageType ||
      !Object.values(CoverageType).includes(formValues.coverageType as CoverageType)
    ) {
      return null
    }

    const hasPreEx =
      formValues.hasPreExisting === 'true' && (formValues.preExistingConditions?.length || 0) > 0

    return calculatePremium({
      age,
      coverageTier: formValues.coverageType as CoverageType,
      hasPreExistingConditions: hasPreEx,
      usesTobacco: formValues.usesTobacco === 'true',
      includesSpouse: formValues.includesSpouse === 'true',
    })
  }, [formValues, age])


  const onSubmit = (data: CoverageFormValues) => {
    const coveragePayload: CoverageStep = {
      coverageType: data.coverageType as CoverageType,
      preExistingConditions:
        isSenior && data.hasPreExisting === 'true'
          ? (data.preExistingConditions as PreExistingCondition[])
          : [],
      takesPrescriptionMedication: isSenior && data.takesPrescriptionMedication === 'true',
      usesTobacco: isSenior && data.usesTobacco === 'true',
      includesSpouse: isSenior && data.includesSpouse === 'true',
    }

    dispatch({ type: 'SET_COVERAGE', payload: coveragePayload })

    dispatch({ type: 'COMPUTE_PREMIUM' })

    void navigate(ROUTES.SUMMARY)
  }

  if (isDataMissing) {
    return <Navigate to={ROUTES.PERSONAL_INFO} replace />
  }


  const conditionOptions = [
    { value: PreExistingCondition.Diabetes, label: 'Diabetes' },
    { value: PreExistingCondition.HeartDisease, label: 'Heart Disease' },
    { value: PreExistingCondition.Hypertension, label: 'Hypertension' },
    { value: PreExistingCondition.CancerHistory, label: 'Cancer (history)' },
    { value: PreExistingCondition.Other, label: 'Other' },
  ]

  const renderRadioYesNo = (name: keyof CoverageFormValues, label: string) => (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FormControl error={!!errors[name]} component="fieldset" fullWidth sx={{ mb: 2 }}>
          <FormLabel component="legend" sx={{ color: 'text.primary', mb: 1 }}>
            {label}
          </FormLabel>
          <RadioGroup row {...field}>
            <FormControlLabel value="true" control={<Radio color="primary" />} label="Yes" />
            <FormControlLabel value="false" control={<Radio color="primary" />} label="No" />
          </RadioGroup>
          {errors[name] && <FormHelperText>{errors[name]?.message}</FormHelperText>}
        </FormControl>
      )}
    />
  )

  return (
    <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
      <Box sx={{ height: 6, backgroundColor: 'primary.main' }} />

      <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            mb: 1,
            gap: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography variant="h2" component="h1" color="primary.main">
              Coverage Selection
            </Typography>
            <Chip label="Step 2 of 3" size="small" color="primary" sx={{ fontWeight: 700 }} />
          </Box>

          {/* Live Premium Badge */}
          {livePremium && (
            <Chip
              label={`Estimated Premium: $${livePremium.monthlyPremium.toFixed(2)} / mo`}
              color="secondary"
              variant="outlined"
              sx={{ fontWeight: 'bold', fontSize: '1rem', p: 1 }}
            />
          )}
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Choose the coverage tier that best fits your needs.
          {isSenior &&
            ' Since you are over 65, we need to ask a few additional health questions to refine your estimate.'}
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* 1. Coverage Tier */}
          <Controller
            name="coverageType"
            control={control}
            render={({ field }) => (
              <FormControl
                error={!!errors.coverageType}
                component="fieldset"
                fullWidth
                sx={{ mb: 4 }}
              >
                <FormLabel
                  component="legend"
                  sx={{ color: 'text.primary', fontWeight: 600, mb: 2 }}
                >
                  Selected Coverage Tier
                </FormLabel>
                <RadioGroup
                  {...field}
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' },
                    gap: 2,
                  }}
                >
                  {[
                    { value: CoverageType.Basic, label: 'Basic', desc: '$50 base / mo' },
                    { value: CoverageType.Standard, label: 'Standard', desc: '$100 base / mo' },
                    { value: CoverageType.Premium, label: 'Premium', desc: '$200 base / mo' },
                  ].map((tier) => (
                    <Card
                      key={tier.value}
                      variant="outlined"
                      sx={{
                        borderColor: field.value === tier.value ? 'primary.main' : 'divider',
                        backgroundColor:
                          field.value === tier.value ? 'rgba(27, 58, 107, 0.04)' : 'transparent',
                      }}
                    >
                      <CardContent sx={{ p: '16px !important', textAlign: 'center' }}>
                        <FormControlLabel
                          value={tier.value}
                          control={<Radio color="primary" />}
                          label={<Typography fontWeight={600}>{tier.label}</Typography>}
                          sx={{ m: 0 }}
                        />
                        <Typography variant="body2" color="text.secondary" mt={1}>
                          {tier.desc}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </RadioGroup>
                {errors.coverageType && (
                  <FormHelperText sx={{ mt: 2 }}>{errors.coverageType.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />

          {/* 2. Additional Questions (Senior Only) */}
          {isSenior && (
            <Box
              sx={{
                p: 3,
                pt: 4,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                backgroundColor: 'background.default',
                mb: 4,
              }}
            >
              <Typography variant="h4" color="primary.main" mb={1}>
                Additional Health Details
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Please answer the following questions to help us calculate the most accurate rate.
              </Typography>

              {renderRadioYesNo(
                'hasPreExisting',
                'Do you have any pre-existing medical conditions?',
              )}

              {formValues.hasPreExisting === 'true' && (
                <Controller
                  name="preExistingConditions"
                  control={control}
                  render={({ field }) => (
                    <FormControl
                      error={!!errors.preExistingConditions}
                      fullWidth
                      sx={{ mb: 3, mt: -1, ml: { sm: 2 }, width: { sm: 'calc(100% - 16px)' } }}
                    >
                      <InputLabel id="conditions-label">Select Conditions</InputLabel>
                      <Select
                        labelId="conditions-label"
                        multiple
                        {...field}
                        value={field.value || []}
                        input={<OutlinedInput label="Select Conditions" />}
                        renderValue={(selected) =>
                          selected
                            .map((val) => conditionOptions.find((o) => o.value === val)?.label)
                            .join(', ')
                        }
                      >
                        {conditionOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            <Checkbox checked={(field.value || []).includes(option.value)} />
                            <ListItemText primary={option.label} />
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.preExistingConditions && (
                        <FormHelperText>{errors.preExistingConditions.message}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              )}

              {renderRadioYesNo(
                'takesPrescriptionMedication',
                'Do you currently take any prescription medications?',
              )}
              {renderRadioYesNo('usesTobacco', 'Do you use any tobacco products?')}
              {renderRadioYesNo(
                'includesSpouse',
                'Would you like to include your spouse / domestic partner in this coverage?',
              )}
            </Box>
          )}

          {/* Navigation */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              id="btn-step2-back"
              variant="outlined"
              size="large"
              onClick={() => {
                void navigate(ROUTES.PERSONAL_INFO)
              }}
            >
              ← Back
            </Button>
            <Button type="submit" id="btn-step2-next" variant="contained" size="large">
              Next: Review →
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}
