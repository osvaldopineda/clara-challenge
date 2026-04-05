/* eslint-disable react-refresh/only-export-components */
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
import {
  readFromStorage,
  writeToStorage,
  clearStorage,
  type PersistedQuoteState,
} from '../utils/storage'
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
  if (!personalInfo || !coverage) {
    return null
  }
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
function initQuoteState(initial: QuoteState): QuoteState {
  const saved = readFromStorage()
  return {
    ...initial,
    personalInfo: saved.personalInfo ?? null,
    coverage: saved.coverage ?? null,
  }
}

export function QuoteProvider({ children }: QuoteProviderProps) {
  const [state, dispatch] = useReducer(quoteReducer, INITIAL_STATE, initQuoteState)
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
