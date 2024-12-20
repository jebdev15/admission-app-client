import React from 'react'
import { Box, Typography } from '@mui/material'
import "../../../assets/style.css"

const Auth:React.FC = () => {
  return (
    <Box
            sx={{
                width: "inherit",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <Typography variant="h4" fontWeight={400} textAlign={{ xs: "center", md: "left" }} sx={{ mb: 1 }}>
                Sign In
            </Typography>
            <Typography variant="body1" fontWeight={400} textAlign={{ xs: "center", md: "left" }} sx={{ mb: 2 }}>
                Use your CHMSU Google Account
            </Typography>
            <Box
                sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                }}
                className="loginForm"
            >
                {/* {
                    loading
                        ? <Typography>Signing you in...</Typography>
                        : <GoogleLogin className="googleLoginBtn" onSuccess={login} />
                } */}
            </Box>
        </Box>
  )
}

export default Auth