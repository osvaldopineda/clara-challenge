import { useForm, type Resolver } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { type PersonalInfoStep } from '../types/quote.types'
import {
  personalInfoSchema,
  coverageSchema,
  type CoverageFormValues,
} from '../schemas/quote.schema'

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

export function useCoverageForm(defaultValues: CoverageFormValues, isSenior: boolean) {
  return useForm<CoverageFormValues>({
    resolver: yupResolver(coverageSchema) as Resolver<CoverageFormValues>,
    defaultValues,
    context: { isSenior },
  })
}
