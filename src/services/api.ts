import type { QuoteState } from '../context/QuoteContext'
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
