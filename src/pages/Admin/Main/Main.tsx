import React from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid
} from "@mui/material";
import {
    EventNote as EventNoteIcon,
    People as PeopleIcon,
} from "@mui/icons-material";
import "@pages/Student/header.css";
import CustomCircularProgress from "@components/CustomCircularProgress";
import Header from "./Header";
import { useNavigate } from "react-router-dom";

interface DashboardCard {
    title: string;
    description: string;
    icon: React.ReactElement;
    path?: string;
}

const Dashboard: React.FC = () => {
    const navigate = useNavigate();

    const dashboardCards: DashboardCard[] = [
        {
            title: "Entrance Examination Schedules",
            description: "View entrance examination schedules by campus, including available dates, time slots, and the current status of exam slots.",
            icon: <EventNoteIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
            path: "/admin/schedules"
        },
        {
            title: "Student Applicants",
            description: "View all student applicants with detailed information. Access comprehensive student profiles, application status, and examination details in a centralized dashboard.",
            icon: <PeopleIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
            path: "/admin/applicants"
        },
    ];

    const handleCardClick = (path?: string) => {
        if (path) {
            navigate(path);
        }
    };

    return (
        <React.Suspense fallback={<CustomCircularProgress />}>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    minHeight: "100dvh",
                    alignItems: "stretch",
                    backgroundColor: "#e0e0e0",
                }}
            >
                <Header />
                <Box
                    sx={{
                        paddingX: { xs: 2, md: 4, lg: 6 },
                        paddingY: { xs: 4, md: 6 },
                    }}
                >
                    <Typography 
                        variant="h4" 
                        sx={{ 
                            mb: 4, 
                            fontWeight: 600,
                            color: 'primary.dark'
                        }}
                    >
                        Admin Dashboard
                    </Typography>
                    <Grid container spacing={3}>
                        {dashboardCards.map((card, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        transition: 'all 0.3s ease-in-out',
                                        cursor: card.path ? 'pointer' : 'default',
                                        '&:hover': card.path ? {
                                            transform: 'translateY(-8px)',
                                            boxShadow: 6,
                                        } : {},
                                    }}
                                    elevation={3}
                                    onClick={() => handleCardClick(card.path)}
                                >
                                    <CardContent
                                        sx={{
                                            flexGrow: 1,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 2,
                                            p: 3,
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                                            {card.icon}
                                        </Box>
                                        <Typography
                                            variant="h5"
                                            component="h2"
                                            sx={{
                                                fontWeight: 600,
                                                color: 'primary.dark',
                                                textAlign: 'center',
                                                mb: 1,
                                            }}
                                        >
                                            {card.title}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{
                                                textAlign: 'center',
                                                lineHeight: 1.6,
                                            }}
                                        >
                                            {card.description}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Box>
        </React.Suspense>
    );
}

export default React.memo(Dashboard);