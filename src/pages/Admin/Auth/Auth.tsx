import React from "react";
import { Box, Container, Paper, Typography } from "@mui/material";
import chmsuLogo from "@assets/chmsu.jpg";
import "@assets/style.css";
import { GoogleLogin } from "@react-oauth/google";
import axiosInstance from "@api/index";
import { useNavigate } from "react-router";
import { useCookies } from "react-cookie";
import CustomCircularProgress from "@components/CustomCircularProgress";

const Auth: React.FC = () => {
    const [cookie, setCookie] = useCookies(['token']);
    const navigate = useNavigate()
    const [loading, setLoading] = React.useState<boolean>(false);
    const login = async (credentialsResponse: any) => {
        setLoading(true)
        try {
            const formData = new FormData()
            formData.append('token', credentialsResponse.credential)
            const { data, status } = await axiosInstance.post('/admin/login', formData)
            if (data.isUserExist) {
                setCookie('token', data.token, { 
                    path: '/',
                    expires: new Date(Date.now() + 24 * 60 * 60 * 1000) // 1 day
                })
                navigate('/admin/main')
                console.log(status)
            }
            setLoading(false)
        } catch (error: any) {
            if(error.response) {
                alert("User doesn't recognized by the system. Please contact ICT-MIS")
                console.error('Error Response: logging in:', error.response);
            } else if(error.request) {
                alert("Unable to connect to the server. Please contact ICT-MIS")
                console.error('Error Request logging in:', error.request);
            } else {
                alert("Something went wrong. Please contact ICT-MIS")
                console.error('Error logging in:', error);
            }
            setLoading(false)
        }
    }
    React.useEffect(() => {
        if(cookie.token) navigate('/admin/main')
    }, [cookie])
    return (
        <React.Suspense fallback={<CustomCircularProgress />}>
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
        </React.Suspense>
    );
};

export default Auth;    