import { Box, Typography, Button } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const ErrorPage: React.FC = () => {
    const navigate = useNavigate()
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Typography variant="h1" color="initial" sx={{ fontWeight: 'bold' }}>Server is busy</Typography>
            <Typography variant="h5" color="initial">The system is currently processing volume of requests.</Typography>
            <Button variant="text" color="primary" onClick={() => navigate('/')}>
                Click here to go back to Home
            </Button>
        </Box>
    )
}

export default ErrorPage