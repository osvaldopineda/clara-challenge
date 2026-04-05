import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'
import type { PersonalInfoStep, CoverageStep } from '../types/quote.types'
import { calculatePremium } from '../utils/premiumCalculator'
import type { PremiumResult } from '../utils/premiumCalculator'
const STORAGE_KEY = 'clara_quote_draft'
interface PersistedQuoteState {
  personalInfo: PersonalInfoStep | null
  coverage: CoverageStep | null
}
export interface QuoteState extends PersistedQuoteState {
  premium: PremiumResult | null
}
const INITIAL_STATE: QuoteState = {
  personalInfo: null,
  coverage: null,
  premium: null,
}
export type QuoteAction =
  | { type: 'SET_PERSONAL_INFO'; payload: PersonalInfoStep }
  | { type: 'SET_COVERAGE'; payload: CoverageStep }
  | { type: 'COMPUTE_PREMIUM' }
  | { type: 'RESET' }
function computePremium(state: QuoteState): PremiumResult | null {
  const { personalInfo, coverage } = state
  if (!personalInfo || !coverage) return null
  const { age } = personalInfo
  const hasPreExistingConditions = coverage.preExistingConditions.length > 0
  return calculatePremium({
    age,
    coverageTier: coverage.coverageType,
    hasPreExistingConditions,
    usesTobacco: coverage.usesTobacco,
    includesSpouse: coverage.includesSpouse,
  })
}
function quoteReducer(state: QuoteState, action: QuoteAction): QuoteState {
  switch (action.type) {
    case 'SET_PERSONAL_INFO':
      return { ...state, personalInfo: action.payload, premium: null }
    case 'SET_COVERAGE':
      return { ...state, coverage: action.payload, premium: null }
    case 'COMPUTE_PREMIUM': {
      const premium = computePremium(state)
      return { ...state, premium }
    }
    case 'RESET':
      return INITIAL_STATE
    default:
      return state
  }
}
function readFromStorage(): Partial<PersistedQuoteState> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    return JSON.parse(raw) as Partial<PersistedQuoteState>
  } catch {
    return {}
  }
}
function writeToStorage(state: QuoteState): void {
  try {
    const persisted: PersistedQuoteState = {
      personalInfo: state.personalInfo,
      coverage: state.coverage,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted))
  } catch {}
}
function clearStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {}
}
interface QuoteContextValue {
  state: QuoteState
  dispatch: React.Dispatch<QuoteAction>
  computeAndStorePremium: () => void
  resetQuote: () => void
}
const QuoteContext = createContext<QuoteContextValue | null>(null)
interface QuoteProviderProps {
  children: ReactNode
}
export function QuoteProvider({ children }: QuoteProviderProps) {
  const hydratedInitial: QuoteState = (() => {
    const saved = readFromStorage()
    return {
      ...INITIAL_STATE,
      personalInfo: saved.personalInfo ?? null,
      coverage: saved.coverage ?? null,
    }
  })()
  const [state, dispatch] = useReducer(quoteReducer, hydratedInitial)
  useEffect(() => {
    if (state.personalInfo === null && state.coverage === null) {
      clearStorage()
    } else {
      writeToStorage(state)
    }
  }, [state])
  const computeAndStorePremium = useCallback(() => {
    dispatch({ type: 'COMPUTE_PREMIUM' })
  }, [])
  const resetQuote = useCallback(() => {
    dispatch({ type: 'RESET' })
    clearStorage()
  }, [])
  return (
    <QuoteContext.Provider value={{ state, dispatch, computeAndStorePremium, resetQuote }}>
      {children}
    </QuoteContext.Provider>
  )
}
export function useQuoteContext(): QuoteContextValue {
  const ctx = useContext(QuoteContext)
  if (!ctx) {
    throw new Error('useQuoteContext must be used within a <QuoteProvider>')
  }
  return ctx
}
