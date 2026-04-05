import { describe, it, expect } from 'vitest'
import {
  calculatePremium,
  BASE_PREMIUMS,
  MULTIPLIERS,
  SENIOR_AGE_THRESHOLD,
} from '../../utils/premiumCalculator'
import type { PremiumInput } from '../../utils/premiumCalculator'
const baseInput: PremiumInput = {
  age: 30,
  coverageTier: 'basic',
  hasPreExistingConditions: false,
  usesTobacco: false,
  includesSpouse: false,
}
describe('PDF canonical example', () => {
  it('produces exactly $327.60 for the reference scenario', () => {
    const result = calculatePremium({
      age: 70,
      coverageTier: 'standard',
      hasPreExistingConditions: true,
      usesTobacco: true,
      includesSpouse: true,
    })
    expect(result.monthlyPremium).toBe(327.6)
    expect(result.basePremium).toBe(BASE_PREMIUMS.standard)
    expect(result.appliedMultipliers.age).toBe(MULTIPLIERS.senior)
    expect(result.appliedMultipliers.conditions).toBe(MULTIPLIERS.conditions)
    expect(result.appliedMultipliers.tobacco).toBe(MULTIPLIERS.tobacco)
    expect(result.appliedMultipliers.spouse).toBe(MULTIPLIERS.spouse)
  })
})
describe('base premiums — no multipliers applied', () => {
  it('returns $50 for basic tier, young applicant, no risk factors', () => {
    const result = calculatePremium({ ...baseInput, coverageTier: 'basic' })
    expect(result.monthlyPremium).toBe(50)
    expect(result.basePremium).toBe(50)
  })
  it('returns $100 for standard tier, young applicant, no risk factors', () => {
    const result = calculatePremium({ ...baseInput, coverageTier: 'standard' })
    expect(result.monthlyPremium).toBe(100)
    expect(result.basePremium).toBe(100)
  })
  it('returns $200 for premium tier, young applicant, no risk factors', () => {
    const result = calculatePremium({ ...baseInput, coverageTier: 'premium' })
    expect(result.monthlyPremium).toBe(200)
    expect(result.basePremium).toBe(200)
  })
})
describe('age multiplier', () => {
  it('does NOT apply the senior multiplier at exactly age 65 (boundary — not > 65)', () => {
    const result = calculatePremium({ ...baseInput, age: SENIOR_AGE_THRESHOLD })
    expect(result.appliedMultipliers.age).toBe(MULTIPLIERS.none)
    expect(result.monthlyPremium).toBe(BASE_PREMIUMS.basic)
  })
  it('applies the 1.5× senior multiplier for age 66 (first senior age)', () => {
    const result = calculatePremium({ ...baseInput, age: 66 })
    expect(result.appliedMultipliers.age).toBe(MULTIPLIERS.senior)
    expect(result.monthlyPremium).toBe(75)
  })
  it('applies the 1.5× senior multiplier for age 70', () => {
    const result = calculatePremium({ ...baseInput, age: 70 })
    expect(result.appliedMultipliers.age).toBe(MULTIPLIERS.senior)
    expect(result.monthlyPremium).toBe(75)
  })
  it('does NOT apply the senior multiplier for age 0', () => {
    const result = calculatePremium({ ...baseInput, age: 0 })
    expect(result.appliedMultipliers.age).toBe(MULTIPLIERS.none)
    expect(result.monthlyPremium).toBe(BASE_PREMIUMS.basic)
  })
})
describe('pre-existing conditions multiplier', () => {
  it('does NOT apply when hasPreExistingConditions is false', () => {
    const result = calculatePremium({ ...baseInput, hasPreExistingConditions: false })
    expect(result.appliedMultipliers.conditions).toBe(MULTIPLIERS.none)
  })
  it('applies the 1.3× multiplier when hasPreExistingConditions is true', () => {
    const result = calculatePremium({ ...baseInput, hasPreExistingConditions: true })
    expect(result.appliedMultipliers.conditions).toBe(MULTIPLIERS.conditions)
    expect(result.monthlyPremium).toBe(65)
  })
})
describe('tobacco use multiplier', () => {
  it('does NOT apply when usesTobacco is false', () => {
    const result = calculatePremium({ ...baseInput, usesTobacco: false })
    expect(result.appliedMultipliers.tobacco).toBe(MULTIPLIERS.none)
  })
  it('applies the 1.2× multiplier when usesTobacco is true', () => {
    const result = calculatePremium({ ...baseInput, usesTobacco: true })
    expect(result.appliedMultipliers.tobacco).toBe(MULTIPLIERS.tobacco)
    expect(result.monthlyPremium).toBe(60)
  })
})
describe('spouse coverage multiplier', () => {
  it('does NOT apply when includesSpouse is false', () => {
    const result = calculatePremium({ ...baseInput, includesSpouse: false })
    expect(result.appliedMultipliers.spouse).toBe(MULTIPLIERS.none)
  })
  it('applies the 1.4× multiplier when includesSpouse is true', () => {
    const result = calculatePremium({ ...baseInput, includesSpouse: true })
    expect(result.appliedMultipliers.spouse).toBe(MULTIPLIERS.spouse)
    expect(result.monthlyPremium).toBe(70)
  })
})
describe('combined multipliers', () => {
  it('compounds senior + conditions correctly (basic tier)', () => {
    const result = calculatePremium({
      ...baseInput,
      age: 70,
      hasPreExistingConditions: true,
    })
    expect(result.monthlyPremium).toBe(97.5)
  })
  it('compounds senior + tobacco correctly (standard tier)', () => {
    const result = calculatePremium({
      ...baseInput,
      coverageTier: 'standard',
      age: 70,
      usesTobacco: true,
    })
    expect(result.monthlyPremium).toBe(180)
  })
  it('compounds senior + spouse correctly (premium tier)', () => {
    const result = calculatePremium({
      ...baseInput,
      coverageTier: 'premium',
      age: 70,
      includesSpouse: true,
    })
    expect(result.monthlyPremium).toBe(420)
  })
  it('compounds conditions + tobacco + spouse (no senior) correctly', () => {
    const result = calculatePremium({
      ...baseInput,
      coverageTier: 'standard',
      age: 40,
      hasPreExistingConditions: true,
      usesTobacco: true,
      includesSpouse: true,
    })
    expect(result.monthlyPremium).toBe(218.4)
  })
  it('applies ALL four multipliers on basic tier correctly', () => {
    const result = calculatePremium({
      age: 70,
      coverageTier: 'basic',
      hasPreExistingConditions: true,
      usesTobacco: true,
      includesSpouse: true,
    })
    expect(result.monthlyPremium).toBe(163.8)
  })
  it('applies ALL four multipliers on premium tier correctly', () => {
    const result = calculatePremium({
      age: 70,
      coverageTier: 'premium',
      hasPreExistingConditions: true,
      usesTobacco: true,
      includesSpouse: true,
    })
    expect(result.monthlyPremium).toBe(655.2)
  })
})
describe('age boundary conditions', () => {
  const adjacentAges = [
    { age: 64, expectSenior: false },
    { age: 65, expectSenior: false },
    { age: 66, expectSenior: true },
    { age: 100, expectSenior: true },
  ]
  adjacentAges.forEach(({ age, expectSenior }) => {
    it(`age ${String(age)} → senior multiplier = ${String(expectSenior)}`, () => {
      const result = calculatePremium({ ...baseInput, age })
      const expectedMultiplier = expectSenior ? MULTIPLIERS.senior : MULTIPLIERS.none
      expect(result.appliedMultipliers.age).toBe(expectedMultiplier)
    })
  })
})
describe('floating-point precision', () => {
  it('always returns a value with at most 2 decimal places', () => {
    const inputs: PremiumInput[] = [
      {
        age: 70,
        coverageTier: 'standard',
        hasPreExistingConditions: true,
        usesTobacco: true,
        includesSpouse: true,
      },
      {
        age: 30,
        coverageTier: 'basic',
        hasPreExistingConditions: true,
        usesTobacco: false,
        includesSpouse: false,
      },
      {
        age: 70,
        coverageTier: 'basic',
        hasPreExistingConditions: true,
        usesTobacco: true,
        includesSpouse: true,
      },
    ]
    inputs.forEach((input) => {
      const { monthlyPremium } = calculatePremium(input)
      const decimals = (monthlyPremium.toString().split('.')[1] ?? '').length
      expect(decimals).toBeLessThanOrEqual(2)
    })
  })
  it('returns exactly 327.60 (not 327.5999... or 327.6001...) for the PDF example', () => {
    const { monthlyPremium } = calculatePremium({
      age: 70,
      coverageTier: 'standard',
      hasPreExistingConditions: true,
      usesTobacco: true,
      includesSpouse: true,
    })
    expect(monthlyPremium).toBe(327.6)
    expect(typeof monthlyPremium).toBe('number')
  })
})
describe('result shape', () => {
  it('always returns monthlyPremium, basePremium, and appliedMultipliers', () => {
    const result = calculatePremium(baseInput)
    expect(result).toHaveProperty('monthlyPremium')
    expect(result).toHaveProperty('basePremium')
    expect(result).toHaveProperty('appliedMultipliers')
    expect(result.appliedMultipliers).toHaveProperty('age')
    expect(result.appliedMultipliers).toHaveProperty('conditions')
    expect(result.appliedMultipliers).toHaveProperty('tobacco')
    expect(result.appliedMultipliers).toHaveProperty('spouse')
  })
  it('basePremium in result always matches the BASE_PREMIUMS constant for the tier', () => {
    const tiers = ['basic', 'standard', 'premium'] as const
    tiers.forEach((tier) => {
      const result = calculatePremium({ ...baseInput, coverageTier: tier })
      expect(result.basePremium).toBe(BASE_PREMIUMS[tier])
    })
  })
})
describe('input validation', () => {
  it('throws RangeError for negative age', () => {
    expect(() => calculatePremium({ ...baseInput, age: -1 })).toThrow(RangeError)
  })
  it('throws RangeError for age -100', () => {
    expect(() => calculatePremium({ ...baseInput, age: -100 })).toThrow(/non-negative/)
  })
  it('throws TypeError for an unrecognised coverage tier', () => {
    expect(() =>
      // @ts-expect-error — intentionally passing invalid tier to test runtime guard
      calculatePremium({ ...baseInput, coverageTier: 'ultra' }),
    ).toThrow(TypeError)
  })
})
