import { useLocation } from 'react-router-dom'
import { ROUTES } from '../../utils/routes'
import type { ReactNode } from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import FormStepper from './FormStepper'
function ClaraLogo() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.25,
        textDecoration: 'none',
      }}
      component="span"
    >
      <Box
        component="svg"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        sx={{ width: 32, height: 32, flexShrink: 0 }}
        aria-hidden="true"
      >
        <path
          d="M16 2L4 7V16C4 22.627 9.373 28 16 30C22.627 28 28 22.627 28 16V7L16 2Z"
          fill="white"
          fillOpacity="0.15"
          stroke="white"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M12 16.5L14.5 19L20 13"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Box>
      <Typography
        variant="h6"
        component="span"
        sx={{
          fontWeight: 700,
          color: 'white',
          letterSpacing: '-0.01em',
          lineHeight: 1,
        }}
      >
        Clara
      </Typography>
    </Box>
  )
}
interface AppLayoutProps {
  children: ReactNode
}
export default function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation()
  const isSuccessPage = location.pathname === ROUTES.SUCCESS

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: 'background.default',
      }}
    >
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: 'primary.dark',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <Toolbar
          sx={{
            minHeight: { xs: 56, sm: 64 },
            px: { xs: 2, sm: 3, md: 4 },
            justifyContent: 'space-between',
          }}
        >
          <ClaraLogo />
        </Toolbar>
      </AppBar>
      {!isSuccessPage && <FormStepper />}
      <Box
        component="main"
        sx={{
          flex: 1,
          py: { xs: 3, sm: 5 },
          px: { xs: 2, sm: 3 },
        }}
      >
        <Container
          maxWidth="md"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
          }}
        >
          {children}
        </Container>
      </Box>
    </Box>
  )
}
