/**
 * @file src/utils/index.ts
 * @description Barrel export for utility functions and constants.
 */

export {
  calculatePremium,
  BASE_PREMIUMS,
  MULTIPLIERS,
  SENIOR_AGE_THRESHOLD,
} from './premiumCalculator'
export type { PremiumInput, PremiumResult, CoverageTier } from './premiumCalculator'
export { ROUTES, STEP_ROUTES } from './routes'
export type { RouteKey, RoutePath } from './routes'
