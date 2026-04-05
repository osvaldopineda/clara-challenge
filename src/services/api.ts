import type { QuoteState } from '../context/QuoteContext'
export async function submitQuote(
  _data: QuoteState,
): Promise<{ success: boolean; message: string }> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.5) {
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
