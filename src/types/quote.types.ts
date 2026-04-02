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

// ─── Step Data Shapes ─────────────────────────────────────────────────────────

export interface PersonalInfoStep {
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
}

export interface CoverageStep {
  insuranceCategory: InsuranceCategory
  coverageType: CoverageType
  startDate: string
}

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
