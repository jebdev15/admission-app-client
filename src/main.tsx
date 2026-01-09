import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { RouterProvider } from 'react-router-dom';
import { router } from '@routes/index'
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles'
import { IndexTheme } from '@theme/index'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { VITE_GOOGLE_CLIENT_ID } from '@constants/index';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CssBaseline />
    <ThemeProvider theme={IndexTheme}>
      <GoogleOAuthProvider clientId={VITE_GOOGLE_CLIENT_ID}>
          <RouterProvider router={router} />
      </GoogleOAuthProvider>
    </ThemeProvider>
  </StrictMode>,
)