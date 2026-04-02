/**
 * @file src/main.tsx
 * @description Application entry point.
 *
 * Provider stack (outer → inner):
 *   StrictMode            — Catches unsafe lifecycle patterns in dev
 *   ThemeProvider         — Injects Clara's custom MUI theme
 *   CssBaseline           — Normalises browser defaults
 *   QuoteProvider         — Global quote state + localStorage persistence
 *   App                   — BrowserRouter + route tree
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import claraTheme from './theme'
import { QuoteProvider } from './context'
import App from './App'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('[main.tsx] Cannot find #root element — check index.html.')
}

createRoot(rootElement).render(
  <StrictMode>
    <ThemeProvider theme={claraTheme}>
      <CssBaseline />
      <QuoteProvider>
        <App />
      </QuoteProvider>
    </ThemeProvider>
  </StrictMode>,
)
