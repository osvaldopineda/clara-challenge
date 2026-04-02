/**
 * @file src/main.tsx
 * @description Application entry point.
 *
 * Provider stack (outer → inner):
 *   StrictMode            — Catches unsafe lifecycle patterns in dev
 *   ThemeProvider         — Injects Clara's custom MUI theme
 *   CssBaseline           — Normalises browser defaults (margin, box-sizing, etc.)
 *   App                   — Root component / router
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import claraTheme from './theme'
import App from './App'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('[main.tsx] Cannot find #root element — check index.html.')
}

createRoot(rootElement).render(
  <StrictMode>
    <ThemeProvider theme={claraTheme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>,
)
