import { useMemo } from 'react'
import { calculatePremium, type CoverageTier } from '../utils/premiumCalculator'

export function useLivePremium(
  age: number,
  formValues: {
    coverageType?: string
    hasPreExisting?: string
    preExistingConditions?: string[]
    usesTobacco?: string
    includesSpouse?: string
  }
) {
  return useMemo(() => {
    if (!formValues.coverageType || !['basic', 'standard', 'premium'].includes(formValues.coverageType)) {
      return null
    }

    const hasPreEx = formValues.hasPreExisting === 'true' && (formValues.preExistingConditions?.length || 0) > 0

    return calculatePremium({
      age,
      coverageTier: formValues.coverageType as CoverageTier,
      hasPreExistingConditions: hasPreEx,
      usesTobacco: formValues.usesTobacco === 'true',
      includesSpouse: formValues.includesSpouse === 'true',
    })
  }, [formValues, age])
}
