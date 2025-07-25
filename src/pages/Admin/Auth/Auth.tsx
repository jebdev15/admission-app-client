import React from "react";
import { Box, Container, Paper, Typography } from "@mui/material";
import chmsuLogo from "../../../assets/chmsu-small.jpg";
import "../../../assets/style.css";
import { GoogleLogin } from "@react-oauth/google";
import axiosInstance from "../../../api";

const Auth: React.FC = () => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const login = async (credentialsResponse: any) => {
    // setLoading(true)
    console.log(credentialsResponse)
    const formData = new FormData()
    formData.append('token', credentialsResponse.credential)
    const { data, status } = await axiosInstance.post('/admin/login', formData)
    console.log(data, status)
  }
  return (
    <Box sx={{ display: "flex", flexGrow: 1, alignItems: "center" }}>
      <Container maxWidth="lg" fixed sx={{ height: "inherit" }}>
        <Box
          sx={{
            height: "inherit",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Paper
            className="signin_page"
            sx={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", py: { xs: 3, sm: 5 }, px: { xs: 4, sm: 6 }, gap: { sm: 3, md: 6 } }}
            elevation={8}
          >
            <Box className="signinMsg">
              <img className="chmsuLogo" src={chmsuLogo} alt="logo" />
              <Typography variant="h5" fontWeight={700} color="primary">
                Carlos Hilado<span>Memorial State University</span>
              </Typography>
              <Typography variant="body1" color="primary">
                Admission Portal
              </Typography>
            </Box>
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
                {
                  loading
                    ? <Typography>Signing you in...</Typography>
                    : <GoogleLogin
                      // className="googleLoginBtn" 
                      onSuccess={login}
                      onError={() => {
                        console.log('Login Failed');
                      }}
                    />
                }
              </Box>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default Auth;    