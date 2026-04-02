/**
 * @file src/services/api.ts
 * @description Mock API service for the quote submission.
 */

import type { QuoteState } from '../context/QuoteContext'

/**
 * Simulates an API call to submit the final quote.
 *
 * @param data The complete form state.
 * @returns A promise that resolves in 2 seconds, with a 90% success rate.
 */
export async function submitQuote(
  data: QuoteState,
): Promise<{ success: boolean; message: string }> {
  console.debug('Submitting quote with data:', data)
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.1) {
        resolve({
          success: true,
          message: 'Quote submitted successfully. An agent will contact you shortly.',
        })
      } else {
        reject(new Error('Network error. Failed to submit quote.'))
      }
    }, 2000)
  })
}
