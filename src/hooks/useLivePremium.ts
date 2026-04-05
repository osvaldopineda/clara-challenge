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
  },
) {
  const { coverageType, hasPreExisting, preExistingConditions, usesTobacco, includesSpouse } =
    formValues

  return useMemo(() => {
    if (!coverageType || !['basic', 'standard', 'premium'].includes(coverageType)) {
      return null
    }

    const hasPreEx = hasPreExisting === 'true' && (preExistingConditions?.length || 0) > 0

    return calculatePremium({
      age,
      coverageTier: coverageType as CoverageTier,
      hasPreExistingConditions: hasPreEx,
      usesTobacco: usesTobacco === 'true',
      includesSpouse: includesSpouse === 'true',
    })
  }, [
    age,
    coverageType,
    hasPreExisting,
    preExistingConditions?.length,
    usesTobacco,
    includesSpouse,
  ])
}
