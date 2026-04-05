export const ROUTES = {
  ROOT: '/',
  PERSONAL_INFO: '/quote/personal-info',
  COVERAGE: '/quote/coverage',
  SUMMARY: '/quote/summary',
} as const
export type RouteKey = keyof typeof ROUTES
export type RoutePath = (typeof ROUTES)[RouteKey]
export const STEP_ROUTES: ReadonlyArray<{
  path: string
  label: string
  description: string
}> = [
  {
    path: ROUTES.PERSONAL_INFO,
    label: 'Personal Info',
    description: 'Tell us about yourself',
  },
  {
    path: ROUTES.COVERAGE,
    label: 'Coverage',
    description: 'Choose your plan',
  },
  {
    path: ROUTES.SUMMARY,
    label: 'Review',
    description: 'Confirm & submit',
  },
] as const
