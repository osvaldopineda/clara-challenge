/**
 * @file src/App.tsx
 * @description Root routing component.
 *
 * Route tree:
 *
 *   /                       → redirect to /quote/personal-info
 *   /quote/personal-info    → StepPersonalInfo  (inside AppLayout)
 *   /quote/coverage         → StepCoverage      (inside AppLayout)
 *   /quote/summary          → StepSummary       (inside AppLayout)
 *   *                       → redirect to /quote/personal-info
 *
 * AppLayout is the shared shell — it renders the AppBar, FormStepper,
 * and a centered Container. The <Outlet /> renders the active step page.
 */

import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import { StepPersonalInfo, StepCoverage, StepSummary } from './pages'
import { ROUTES } from './utils/routes'

function QuoteLayout() {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.ROOT} element={<Navigate to={ROUTES.PERSONAL_INFO} replace />} />

        <Route element={<QuoteLayout />}>
          <Route path={ROUTES.PERSONAL_INFO} element={<StepPersonalInfo />} />
          <Route path={ROUTES.COVERAGE} element={<StepCoverage />} />
          <Route path={ROUTES.SUMMARY} element={<StepSummary />} />
        </Route>

        <Route path="*" element={<Navigate to={ROUTES.PERSONAL_INFO} replace />} />
      </Routes>
    </BrowserRouter>
  )
}
