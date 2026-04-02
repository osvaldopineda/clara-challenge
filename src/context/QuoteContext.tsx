/**
 * @file src/context/QuoteContext.tsx
 * @description Global state management for the multi-step insurance quote wizard.
 *
 * ── Architecture ────────────────────────────────────────────────────────────
 *
 * We use the React Context API (not Redux/Zustand) because:
 *  • The state shape is shallow and bounded — 3 step slices + derived premium.
 *  • There is no need for middleware, time-travel debugging, or selectors.
 *  • Context + useReducer gives us full TypeScript inference with zero deps.
 *
 * ── LocalStorage Persistence ────────────────────────────────────────────────
 *
 * State is persisted to localStorage under the key `clara_quote_draft`.
 * On mount, the Provider attempts to hydrate from localStorage so that
 * a browser refresh does NOT lose the user's partially-completed form.
 *
 * The premium result is NEVER stored — it is always derived on demand from
 * the stored data via `calculatePremium`, keeping the stored blob small and
 * the calculation authoritative.
 *
 * ── Usage ────────────────────────────────────────────────────────────────────
 *
 *   // Reading state
 *   const { state } = useQuoteContext()
 *
 *   // Writing state
 *   const { dispatch } = useQuoteContext()
 *   dispatch({ type: 'SET_PERSONAL_INFO', payload: formData })
 *
 *   // Resetting
 *   dispatch({ type: 'RESET' })
 */

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

// ─── Constants ────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'clara_quote_draft'

// ─── State Shape ──────────────────────────────────────────────────────────────

/**
 * The subset of state persisted to localStorage.
 * Premium is excluded — always recomputed from source data.
 */
interface PersistedQuoteState {
  personalInfo: PersonalInfoStep | null
  coverage: CoverageStep | null
}

/** Full runtime state (includes derived premium, never persisted). */
export interface QuoteState extends PersistedQuoteState {
  /**
   * Calculated premium — derived from personalInfo + coverage whenever
   * both slices are complete. null means the quote hasn't been computed yet.
   */
  premium: PremiumResult | null
}

// ─── Initial State ────────────────────────────────────────────────────────────

const INITIAL_STATE: QuoteState = {
  personalInfo: null,
  coverage: null,
  premium: null,
}

// ─── Actions ──────────────────────────────────────────────────────────────────

export type QuoteAction =
  | { type: 'SET_PERSONAL_INFO'; payload: PersonalInfoStep }
  | { type: 'SET_COVERAGE'; payload: CoverageStep }
  | { type: 'COMPUTE_PREMIUM' }
  | { type: 'RESET' }

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Derives the applicant's age in whole years from an ISO date string.
 * Returns 0 when the date is missing or invalid.
 */
function deriveAge(dateOfBirth: string): number {
  if (!dateOfBirth) return 0
  const dob = new Date(dateOfBirth)
  if (isNaN(dob.getTime())) return 0
  const today = new Date()
  let age = today.getFullYear() - dob.getFullYear()
  const hasHadBirthdayThisYear =
    today.getMonth() > dob.getMonth() ||
    (today.getMonth() === dob.getMonth() && today.getDate() >= dob.getDate())
  if (!hasHadBirthdayThisYear) age -= 1
  return Math.max(0, age)
}

/**
 * Computes the premium from state slices, or returns null if data is incomplete.
 */
function computePremium(state: QuoteState): PremiumResult | null {
  const { personalInfo, coverage } = state
  if (!personalInfo || !coverage) return null

  const age = deriveAge(personalInfo.dateOfBirth)
  const hasPreExistingConditions = coverage.preExistingConditions.length > 0

  return calculatePremium({
    age,
    coverageTier: coverage.coverageType,
    hasPreExistingConditions,
    usesTobacco: coverage.usesTobacco,
    includesSpouse: coverage.includesSpouse,
  })
}

// ─── Reducer ──────────────────────────────────────────────────────────────────

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

// ─── LocalStorage Helpers ─────────────────────────────────────────────────────

function readFromStorage(): Partial<PersistedQuoteState> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    return JSON.parse(raw) as Partial<PersistedQuoteState>
  } catch {
    // Malformed JSON or private browsing mode — start clean
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
  } catch {
    // Storage quota exceeded or security error — fail silently
  }
}

function clearStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Ignore
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface QuoteContextValue {
  /** Current quote wizard state. */
  state: QuoteState
  /** Dispatch an action to update state. */
  dispatch: React.Dispatch<QuoteAction>
  /**
   * Convenience: computes the premium from current state and dispatches
   * COMPUTE_PREMIUM. Call this when entering the Review step.
   */
  computeAndStorePremium: () => void
  /** Resets state and clears localStorage draft. */
  resetQuote: () => void
}

const QuoteContext = createContext<QuoteContextValue | null>(null)

// ─── Provider ─────────────────────────────────────────────────────────────────

interface QuoteProviderProps {
  children: ReactNode
}

export function QuoteProvider({ children }: QuoteProviderProps) {
  // Hydrate initial state from localStorage on first render
  const hydratedInitial: QuoteState = (() => {
    const saved = readFromStorage()
    return {
      ...INITIAL_STATE,
      personalInfo: saved.personalInfo ?? null,
      coverage: saved.coverage ?? null,
    }
  })()

  const [state, dispatch] = useReducer(quoteReducer, hydratedInitial)

  // Sync to localStorage whenever state changes (excluding premium)
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

// ─── Consumer Hook ────────────────────────────────────────────────────────────

/**
 * Access the quote context from any component inside QuoteProvider.
 *
 * @throws {Error} If called outside of QuoteProvider.
 *
 * @example
 * const { state, dispatch } = useQuoteContext()
 * dispatch({ type: 'SET_PERSONAL_INFO', payload: formValues })
 */
export function useQuoteContext(): QuoteContextValue {
  const ctx = useContext(QuoteContext)
  if (!ctx) {
    throw new Error('useQuoteContext must be used within a <QuoteProvider>')
  }
  return ctx
}
