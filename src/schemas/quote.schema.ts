import * as yup from 'yup'
import { CoverageType } from '../types/quote.types'

export const personalInfoSchema = yup
  .object({
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    email: yup.string().email('Invalid email address').required('Email is required'),
    age: yup
      .number()
      .transform((value: number) => (Number.isNaN(value) ? undefined : value))
      .positive('Age must be a positive number')
      .integer('Age must be a whole number')
      .min(18, 'You must be at least 18 years old to request a quote.')
      .required('Age is required'),
    zipCode: yup
      .string()
      .matches(/^\d{5}(-\d{4})?$/, 'Must be a valid ZIP code (e.g., 12345)')
      .required('ZIP code is required'),
  })
  .required()

export const coverageSchema = yup.object().shape({
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
  includesSpouse: yup.string().required('Please answer this question'),
})

export type CoverageFormValues = {
  coverageType: string
  hasPreExisting?: string
  preExistingConditions?: string[]
  takesPrescriptionMedication?: string
  usesTobacco?: string
  includesSpouse?: string
}
