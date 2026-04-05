import type { PersonalInfoStep, CoverageStep } from '../types/quote.types'
import type { QuoteState } from '../context/QuoteContext'

export const STORAGE_KEY = 'clara_quote_draft'

export interface PersistedQuoteState {
  personalInfo: PersonalInfoStep | null
  coverage: CoverageStep | null
}

export function readFromStorage(): Partial<PersistedQuoteState> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return {}
    }
    return JSON.parse(raw) as Partial<PersistedQuoteState>
  } catch {
    return {}
  }
}

export function writeToStorage(state: QuoteState): void {
  try {
    const persisted: PersistedQuoteState = {
      personalInfo: state.personalInfo,
      coverage: state.coverage,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted))
  } catch {
    // ignore
  }
}

export function clearStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}
