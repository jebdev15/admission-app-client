import { Box, Typography, Button, Paper } from '@mui/material'
import React from 'react'
import { useNavigate, useRouteError, isRouteErrorResponse } from 'react-router-dom'
const Header = React.lazy(() => import('./Student/Header'))
const ErrorPage: React.FC = () => {
    const navigate = useNavigate()
    const error = useRouteError(); // Capture the route-level error

    // Extract status and message
    // const statusCode = isRouteErrorResponse(error) ? error.status : 500;
    // const statusText = isRouteErrorResponse(error) ? error.statusText : 'Internal Server Error';
    const errorMessage = isRouteErrorResponse(error)
    ? error.data?.message || error.statusText
    : error instanceof Error
      ? error.message
      : 'An unexpected error occurred.';
    return (
        <Box
                sx={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    gap: 1,
                }}
            >
            <Header />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Paper sx={{ display: 'flex', flexDirection: 'column', gap: 2, justifyContent: 'center', alignItems: 'center', padding: 2 }}>
                    <Typography variant="h6" color="error" sx={{ fontWeight: 'bold' }}>
                        {errorMessage}
                    </Typography>
                    <Button variant="text" color="primary" onClick={() => navigate('/')}>
                        Click here to go back to Home
                    </Button>
                </Paper>
                </Box>
        </Box>
    )
}

export default ErrorPage