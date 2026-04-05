export const SENIOR_AGE_THRESHOLD = 65
export const BASE_PREMIUMS = {
  basic: 50,
  standard: 100,
  premium: 200,
} as const
export const MULTIPLIERS = {
  senior: 1.5,
  conditions: 1.3,
  tobacco: 1.2,
  spouse: 1.4,
  none: 1.0,
} as const
export type CoverageTier = keyof typeof BASE_PREMIUMS
export interface PremiumInput {
  age: number
  coverageTier: CoverageTier
  hasPreExistingConditions: boolean
  usesTobacco: boolean
  includesSpouse: boolean
}
export interface PremiumResult {
  monthlyPremium: number
  basePremium: number
  appliedMultipliers: {
    age: number
    conditions: number
    tobacco: number
    spouse: number
  }
}
export function calculatePremium(data: PremiumInput): PremiumResult {
  const { age, coverageTier, hasPreExistingConditions, usesTobacco, includesSpouse } = data
  if (age < 0) {
    throw new RangeError(`Age must be a non-negative number, received: ${String(age)}`)
  }
  if (!(coverageTier in BASE_PREMIUMS)) {
    throw new TypeError(`Unknown coverage tier: "${coverageTier}"`)
  }
  const basePremium = BASE_PREMIUMS[coverageTier]
  const ageMultiplier = age > SENIOR_AGE_THRESHOLD ? MULTIPLIERS.senior : MULTIPLIERS.none
  const conditionsMultiplier = hasPreExistingConditions ? MULTIPLIERS.conditions : MULTIPLIERS.none
  const tobaccoMultiplier = usesTobacco ? MULTIPLIERS.tobacco : MULTIPLIERS.none
  const spouseMultiplier = includesSpouse ? MULTIPLIERS.spouse : MULTIPLIERS.none
  const raw =
    basePremium * ageMultiplier * conditionsMultiplier * tobaccoMultiplier * spouseMultiplier
  const monthlyPremium = Math.round(raw * 100) / 100
  return {
    monthlyPremium,
    basePremium,
    appliedMultipliers: {
      age: ageMultiplier,
      conditions: conditionsMultiplier,
      tobacco: tobaccoMultiplier,
      spouse: spouseMultiplier,
    },
  }
}
