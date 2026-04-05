import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
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
import { FormProvider, Controller, useWatch } from 'react-hook-form'
import { useQuoteContext } from '../context/QuoteContext'
import { ROUTES } from '../utils/routes'
import { CoverageType, PreExistingCondition, type CoverageStep } from '../types/quote.types'
import { SENIOR_AGE_THRESHOLD } from '../utils/premiumCalculator'
import { useCoverageForm, useLivePremium, type CoverageFormValues } from '../hooks'
import { StepNavigation } from '../components/common'
import { RadioYesNoField } from '../components/forms'

export default function StepCoverage() {
  const navigate = useNavigate()
  const { state, dispatch } = useQuoteContext()

  const age = state.personalInfo?.age || 0
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

  const methods = useCoverageForm(defaultValues, isSenior)
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods

  const formValues = useWatch({ control })
  const livePremium = useLivePremium(age, formValues)

  if (!state.personalInfo) {
    return <Navigate to={ROUTES.PERSONAL_INFO} replace />
  }

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

  const conditionOptions = [
    { value: PreExistingCondition.Diabetes, label: 'Diabetes' },
    { value: PreExistingCondition.HeartDisease, label: 'Heart Disease' },
    { value: PreExistingCondition.Hypertension, label: 'Hypertension' },
    { value: PreExistingCondition.CancerHistory, label: 'Cancer (history)' },
    { value: PreExistingCondition.Other, label: 'Other' },
  ]

  return (
    <Card sx={{ overflow: 'hidden' }}>
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
            <Typography variant="h2" component="h1">
              Coverage Selection
            </Typography>
            <Chip label="Step 2 of 3" size="small" color="primary" sx={{ fontWeight: 700 }} />
          </Box>

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

        <FormProvider {...methods}>
          <Box component="form" onSubmit={(e) => void handleSubmit(onSubmit)(e)} noValidate>
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
                    <FormHelperText sx={{ mt: 2 }}>
                      {errors.coverageType.message as string}
                    </FormHelperText>
                  )}
                </FormControl>
              )}
            />

            {isSenior && (
              <Box
                sx={{
                  p: 3,
                  pt: 4,
                  borderRadius: 1,
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

                <RadioYesNoField
                  name="hasPreExisting"
                  label="Do you have any pre-existing medical conditions?"
                />

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
                          <FormHelperText>
                            {errors.preExistingConditions.message as string}
                          </FormHelperText>
                        )}
                      </FormControl>
                    )}
                  />
                )}

                <RadioYesNoField
                  name="takesPrescriptionMedication"
                  label="Do you currently take any prescription medications?"
                />
                <RadioYesNoField name="usesTobacco" label="Do you use any tobacco products?" />
                <RadioYesNoField
                  name="includesSpouse"
                  label="Would you like to include your spouse / domestic partner in this coverage?"
                />
              </Box>
            )}

            <StepNavigation
              onBack={() => {
                void navigate(ROUTES.PERSONAL_INFO)
              }}
              isSubmitting={isSubmitting}
            />
          </Box>
        </FormProvider>
      </CardContent>
    </Card>
  )
}
