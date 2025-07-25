import { Box, Typography, Button, Paper } from '@mui/material'
import React from 'react'
import { useNavigate, useRouteError } from 'react-router-dom'
const Header = React.lazy(() => import('./Student/Header'))
const ErrorPage: React.FC = () => {
    const navigate = useNavigate()
    const error = useRouteError() as { status: number }; // Capture the route-level error

    // Extract status code from the error
    const statusCode = error.status || 500;
    let errorMessage: string | JSX.Element = 'Something went wrong';
    switch(statusCode) {
         case 403:
            errorMessage = (<>
                <Typography variant="h3" color="textSecondary" sx={{ fontWeight: 'bold', mb: 3, textWrap: 'balance' }}>Link has been expired.</Typography>
                <Typography variant="body1" color="warning" sx={{ mb: 3 }}>The link you're trying to access has expired and can no longer be used to continue the admission process.</Typography>
                <Typography variant="body1" color="textSecondary" sx={{ fontWeight: 'bold'}}>Please register again using a different email.</Typography>
            </>)
            break;
        case 404:
            errorMessage = (<>
                <Typography variant="h3" color="warning" sx={{ fontWeight: 'normal', mb: 3 }}>No email associated with this link.</Typography>
                <Typography variant="body1" color="textSecondary" sx={{ fontWeight: 'normal', mb: 0 }}>This may happen if:</Typography>
                <Box component="ul" sx={{ listStyleType: 'disc', pl: 4 }}>
                    <Typography component="li" variant="body1" color="warning" sx={{ mb: 1 }}>The email associated with this link does not exist in our system.</Typography>
                    <Typography component="li" variant="body1" color="warning">The link is no longer valid.</Typography>
                </Box>
                <Typography variant="body1" color="textSecondary" sx={{ fontWeight: 'bold' }}>Please make sure to use the link sent to your email for a smooth admission process.</Typography>
            </>)
            break;
        case 500:
            errorMessage = (<>
                <Typography variant="body1" color="error" sx={{ fontWeight: 'normal' , mb: 3}}>We encountered an unexpected issue while processing your request. Please try again later.</Typography>
                <Typography variant="body1" color="textSecondary" sx={{ fontWeight: 'bold', mb: 3 }}>If the problem persists, please contact <Typography component="span" color='primary' sx={{fontWeight: 'bold'}}>CHMSU ICT-MIS Support</Typography> via <Typography component="span" color='primary' sx={{fontWeight: 'bold'}}>Messenger</Typography> for assistance.</Typography>
                <Typography variant="body1" color="textSecondary">We apologize for the inconvenience and appreciate your patience.</Typography>
            </>);
            break;
        default:
            errorMessage = 'Server is busy. The system is currently processing volume of requests. Please try again later';
            break;
    }
    return (
        <Box
                sx={{ 
              display: 'flex',
              flexDirection: 'column',
              // jusstifyContent: 'center',
              width: '100%',
              height: 'auto',
              minHeight: '100dvh',
              backgroundColor: '#e0e0e0'
            }}
            >
            <Header />
                <Box
                sx={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    padding: {xs: 0, sm: 2},
                    gap: 1,
                    flexGrow: 1
                }}
            >
                    <Paper sx={{ width: "100%", maxWidth: "1000px", borderRadius: {xs: 0, sm:2}, flexGrow: {xs: 1, sm: 0}}}>
                    <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                padding: {xs: 2, sm: 4},
                                width: '100%',
                            }}>
                        <Typography variant="h6" color="error" sx={{ fontWeight: 'bold' }}>
                            {errorMessage}
                        </Typography>
                        <Button variant="contained" color="primary" sx={{pt: 1, mt: 3, color: '#fff' }} onClick={() => navigate('/')}>
                            Back to Home
                        </Button>
                    </Box>
                    </Paper>
                </Box>
        </Box>
    )
}

export default ErrorPage