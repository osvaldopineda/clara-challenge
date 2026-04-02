/**
 * @file src/types/quote.types.ts
 * @description Shared domain types for the Insurance Quote Calculator.
 * These types will be expanded in subsequent phases.
 *
 * NOTE: TypeScript enums are intentionally NOT used here.
 * The project enables `erasableSyntaxOnly: true` in tsconfig (TS 5.5+),
 * which disallows constructs that require emit (enum, namespace).
 * We use `as const` object literals + type unions instead — they are
 * type-safe, tree-shakeable, and work seamlessly with verbatimModuleSyntax.
 */

// ─── Value Maps (replaces enum) ───────────────────────────────────────────────

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

/**
 * Complete list of pre-existing conditions as defined in the PDF.
 * The UI renders these as checkboxes inside Step 2 when the applicant is
 * over 65 years of age (conditional additional questions).
 *
 * Full list per PDF: Diabetes, Heart Disease, Hypertension, Cancer (history), Other.
 */
export const PreExistingCondition = {
  Diabetes: 'diabetes',
  HeartDisease: 'heart_disease',
  Hypertension: 'hypertension',
  CancerHistory: 'cancer_history',
  Other: 'other',
} as const

export type PreExistingCondition = (typeof PreExistingCondition)[keyof typeof PreExistingCondition]

// ─── Step Data Shapes ─────────────────────────────────────────────────────────
//
// The quote wizard is exactly 3 steps:
//   Step 1 — Personal Information
//   Step 2 — Coverage Selection  ← Additional health questions are conditionally
//                                   rendered INSIDE this step when age > 65.
//                                   They are NOT a separate Step 3/4.
//   Step 3 — Review & Confirmation

/** Step 1: basic applicant details. */
export interface PersonalInfoStep {
  firstName: string
  lastName: string
  email: string
  /** Applicant's age in years. Must be a positive number. */
  age: number
  zipCode: string
}

/**
 * Step 2: coverage selection + conditional health questions.
 *
 * The fields below `coverageType` are only presented in the UI when
 * the applicant's computed age is > 65, but they are always part of
 * the same step's form data shape.
 */
export interface CoverageStep {
  coverageType: CoverageType

  // ── Conditional additional questions (age > 65) ──────────────────────────
  /** Selected pre-existing conditions from the full PDF list. Empty array = none. */
  preExistingConditions: PreExistingCondition[]
  /** True if the applicant takes prescription medication. */
  takesPrescriptionMedication: boolean
  /** True if the applicant uses tobacco products. */
  usesTobacco: boolean
  /** True if spouse / domestic-partner coverage is requested. */
  includesSpouse: boolean
}

/** Step 3: final review and terms acceptance. */
export interface SummaryStep {
  acceptedTerms: boolean
}

// ─── Aggregated Quote Form Data ───────────────────────────────────────────────

export interface QuoteFormData {
  personalInfo: PersonalInfoStep
  coverage: CoverageStep
  summary: SummaryStep
}

// ─── UI / Navigation ──────────────────────────────────────────────────────────

export interface QuoteStep {
  id: string
  label: string
  path: string
}
