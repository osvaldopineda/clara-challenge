import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import LinearProgress from '@mui/material/LinearProgress'
import AppLayout from './components/layout/AppLayout'
import { ROUTES } from './utils/routes'

const StepPersonalInfo = lazy(() => import('./pages/StepPersonalInfo'))
const StepCoverage = lazy(() => import('./pages/StepCoverage'))
const StepSummary = lazy(() => import('./pages/StepSummary'))
const StepSuccess = lazy(() => import('./pages/StepSuccess'))
function QuoteLayout() {
  return (
    <AppLayout>
      <Suspense fallback={<LinearProgress color="primary" />}>
        <Outlet />
      </Suspense>
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
          <Route path={ROUTES.SUCCESS} element={<StepSuccess />} />
        </Route>
        <Route path="*" element={<Navigate to={ROUTES.PERSONAL_INFO} replace />} />
      </Routes>
    </BrowserRouter>
  )
}
