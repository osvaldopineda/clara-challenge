import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import { StepPersonalInfo, StepCoverage, StepSummary, StepSuccess } from './pages'
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
          <Route path={ROUTES.SUCCESS} element={<StepSuccess />} />
        </Route>  
        <Route path="*" element={<Navigate to={ROUTES.PERSONAL_INFO} replace />} />
      </Routes>
    </BrowserRouter>
  )
}
