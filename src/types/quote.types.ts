export const CoverageType = {
  Basic: 'basic',
  Standard: 'standard',
  Premium: 'premium',
} as const
export type CoverageType = (typeof CoverageType)[keyof typeof CoverageType]
export const InsuranceCategory = {
  Auto: 'auto',
  Home: 'home',
  Life: 'life',
  Health: 'health',
} as const
export type InsuranceCategory = (typeof InsuranceCategory)[keyof typeof InsuranceCategory]
export const PreExistingCondition = {
  Diabetes: 'diabetes',
  HeartDisease: 'heart_disease',
  Hypertension: 'hypertension',
  CancerHistory: 'cancer_history',
  Other: 'other',
} as const
export type PreExistingCondition = (typeof PreExistingCondition)[keyof typeof PreExistingCondition]
export interface PersonalInfoStep {
  firstName: string
  lastName: string
  email: string
  age: number
  zipCode: string
}
export interface CoverageStep {
  coverageType: CoverageType
  preExistingConditions: PreExistingCondition[]
  takesPrescriptionMedication: boolean
  usesTobacco: boolean
  includesSpouse: boolean
}
export interface SummaryStep {
  acceptedTerms: boolean
}
export interface QuoteFormData {
  personalInfo: PersonalInfoStep
  coverage: CoverageStep
  summary: SummaryStep
}
export interface QuoteStep {
  id: string
  label: string
  path: string
}
