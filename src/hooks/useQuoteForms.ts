import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { CoverageType, type PersonalInfoStep } from '../types/quote.types'

export const personalInfoSchema = yup
  .object({
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    email: yup.string().email('Invalid email address').required('Email is required'),
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

export function usePersonalInfoForm(defaultValues?: Partial<PersonalInfoStep>) {
  return useForm<PersonalInfoStep>({
    resolver: yupResolver(personalInfoSchema),
    defaultValues: defaultValues || {
      firstName: '',
      lastName: '',
      email: '',
      age: '' as unknown as number,
      zipCode: '',
    },
  })
}

export const coverageSchema = yup.object().shape({
  coverageType: yup
    .string()
    .oneOf(Object.values(CoverageType))
    .required('Please select a coverage type'),
  hasPreExisting: yup.string().when('$isSenior', {
    is: true,
    then: (s) => s.required('Please answer this question'),
  }),
  preExistingConditions: yup.array().of(yup.string()).when('hasPreExisting', {
    is: 'true',
    then: (s) =>
      s.min(1, 'Please select at least one condition').required('Please select at least one condition'),
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

export type CoverageFormValues = {
  coverageType: string
  hasPreExisting?: string
  preExistingConditions?: string[]
  takesPrescriptionMedication?: string
  usesTobacco?: string
  includesSpouse?: string
}

export function useCoverageForm(defaultValues: CoverageFormValues, isSenior: boolean) {
  return useForm<CoverageFormValues>({
    resolver: yupResolver(coverageSchema) as any,
    defaultValues,
    context: { isSenior },
  })
}
