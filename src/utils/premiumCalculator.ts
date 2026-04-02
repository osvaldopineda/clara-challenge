/**
 * @file src/utils/premiumCalculator.ts
 * @description Pure business logic for computing the estimated monthly insurance premium.
 *
 * Formula (from Clara ONB Frontend Challenge specification):
 *
 *   monthlyPremium = basePremium
 *                  × ageMultiplier
 *                  × conditionsMultiplier
 *                  × tobaccoMultiplier
 *                  × spouseMultiplier
 *
 * All multipliers default to 1.0 when their condition is not met, making
 * the formula fully multiplicative and each factor independent.
 *
 * Source-of-truth example (PDF §"Premium Calculation"):
 *   70-year-old | Standard | pre-existing condition | smoker | spouse coverage
 *   = $100 × 1.5 × 1.3 × 1.2 × 1.4 = $327.60 / month
 *
 * Design Decision — Pure Function:
 *   This logic lives outside React intentionally. A pure function that maps
 *   input → output is trivially unit-testable, reusable across components,
 *   and completely decoupled from rendering concerns.
 */

// ─── Constants ────────────────────────────────────────────────────────────────

/** Threshold age above which the senior multiplier applies (exclusive). */
export const SENIOR_AGE_THRESHOLD = 65

/** Base monthly premium in USD for each coverage tier. */
export const BASE_PREMIUMS = {
  basic: 50,
  standard: 100,
  premium: 200,
} as const

/** Multiplier registry — each factor is either applied (> 1.0) or neutral (1.0). */
export const MULTIPLIERS = {
  /** Applied when applicant age > 65. */
  senior: 1.5,
  /** Applied when applicant has one or more pre-existing conditions. */
  conditions: 1.3,
  /** Applied when applicant uses tobacco products. */
  tobacco: 1.2,
  /** Applied when spouse coverage is requested. */
  spouse: 1.4,
  /** Neutral — no adjustment. */
  none: 1.0,
} as const

// ─── Types ────────────────────────────────────────────────────────────────────

/** The valid coverage tiers accepted by the calculator. */
export type CoverageTier = keyof typeof BASE_PREMIUMS

/**
 * Input data required by {@link calculatePremium}.
 * All boolean flags default to false when the condition is absent.
 */
export interface PremiumInput {
  /**
   * Applicant age in whole years (non-negative integer).
   * Ages above SENIOR_AGE_THRESHOLD trigger the 1.5× senior multiplier.
   */
  age: number

  /** Selected coverage tier. Determines the base monthly premium. */
  coverageTier: CoverageTier

  /**
   * True if the applicant has any pre-existing condition
   * (Diabetes, Heart Disease, Hypertension, Cancer, or Other).
   * Triggers the 1.3× conditions multiplier.
   */
  hasPreExistingConditions: boolean

  /**
   * True if the applicant uses tobacco products.
   * Triggers the 1.2× tobacco multiplier.
   */
  usesTobacco: boolean

  /**
   * True if spouse / domestic-partner coverage is requested.
   * Triggers the 1.4× spouse multiplier.
   */
  includesSpouse: boolean
}

/** The structured output returned by {@link calculatePremium}. */
export interface PremiumResult {
  /** The final monthly premium rounded to 2 decimal places (USD). */
  monthlyPremium: number

  /** The unmodified base premium for the selected tier (USD). */
  basePremium: number

  /** Snapshot of all multipliers applied during calculation. */
  appliedMultipliers: {
    age: number
    conditions: number
    tobacco: number
    spouse: number
  }
}

// ─── Pure Calculation Function ────────────────────────────────────────────────

/**
 * Calculates the estimated monthly insurance premium from the given inputs.
 *
 * @param data - The applicant's coverage and health data.
 * @returns A {@link PremiumResult} containing the rounded monthly premium and
 *          a breakdown of every multiplier that was applied.
 *
 * @throws {RangeError} If `age` is negative.
 * @throws {TypeError}  If `coverageTier` is not a recognised tier.
 *
 * @example
 * // PDF reference example — must equal $327.60
 * calculatePremium({
 *   age: 70,
 *   coverageTier: 'standard',
 *   hasPreExistingConditions: true,
 *   usesTobacco: true,
 *   includesSpouse: true,
 * })
 * // → { monthlyPremium: 327.60, basePremium: 100, appliedMultipliers: { age: 1.5, conditions: 1.3, tobacco: 1.2, spouse: 1.4 } }
 */
export function calculatePremium(data: PremiumInput): PremiumResult {
  const { age, coverageTier, hasPreExistingConditions, usesTobacco, includesSpouse } = data

  // ── Input Guards ────────────────────────────────────────────────────────────
  if (age < 0) {
    throw new RangeError(`Age must be a non-negative number, received: ${String(age)}`)
  }

  if (!(coverageTier in BASE_PREMIUMS)) {
    throw new TypeError(`Unknown coverage tier: "${String(coverageTier)}"`)
  }

  // ── Base Premium ────────────────────────────────────────────────────────────
  const basePremium = BASE_PREMIUMS[coverageTier]

  // ── Multiplier Resolution ───────────────────────────────────────────────────
  const ageMultiplier = age > SENIOR_AGE_THRESHOLD ? MULTIPLIERS.senior : MULTIPLIERS.none
  const conditionsMultiplier = hasPreExistingConditions ? MULTIPLIERS.conditions : MULTIPLIERS.none
  const tobaccoMultiplier = usesTobacco ? MULTIPLIERS.tobacco : MULTIPLIERS.none
  const spouseMultiplier = includesSpouse ? MULTIPLIERS.spouse : MULTIPLIERS.none

  // ── Formula ─────────────────────────────────────────────────────────────────
  const raw = basePremium * ageMultiplier * conditionsMultiplier * tobaccoMultiplier * spouseMultiplier

  // ── Rounding ─────────────────────────────────────────────────────────────── 
  // Use Math.round on the third decimal to avoid floating-point drift,
  // e.g. 327.5999999... must round correctly to 327.60.
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
