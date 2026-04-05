import { Controller, useFormContext } from 'react-hook-form'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Radio from '@mui/material/Radio'
import FormHelperText from '@mui/material/FormHelperText'

interface RadioYesNoFieldProps {
  name: string
  label: string
}

export default function RadioYesNoField({ name, label }: RadioYesNoFieldProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  return (
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
          {errors[name] && <FormHelperText>{errors[name].message as string}</FormHelperText>}
        </FormControl>
      )}
    />
  )
}
