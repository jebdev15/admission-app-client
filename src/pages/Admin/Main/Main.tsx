import React from "react";
import {
    Box,
    Paper,
} from "@mui/material";
import "../../Student/header.css";
import CustomCircularProgress from "../../../components/CustomCircularProgress";
import ApplicantsData from "../Main/Data";
import Header from "./Header";
const Dashboard: React.FC = () => {
    return (
        <React.Suspense fallback={<CustomCircularProgress />}>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100dvh",
                    alignItems: "stretch",
                }}
            >
                <Header />
                <Box
                    sx={{
                        paddingX: {xs: 1, md: 2, lg: 5},
                        paddingTop: 10,
                        backgroundColor: "#e0e0e0",
                        // flexGrow: 1,
                        display: "flex",
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                    }}
                >
                    <Paper 
                        sx={{ 
                            width: "100%", 
                            height: '100%',
                            display: "flex", 
                            justifyContent: "center", 
                            alignItems: "center" 
                        }}
                    >
                        <ApplicantsData />
                    </Paper>
                </Box>
            </Box>
        </React.Suspense>
    );
}

export default React.memo(Dashboard);