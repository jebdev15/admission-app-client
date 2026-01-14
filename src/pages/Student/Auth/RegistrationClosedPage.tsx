/**
 * RegistrationClosedPage Component
 * Displays informative pages when registration is unavailable
 */

import React from 'react';
import {
    Box,
    Paper,
    Typography,
    Button,
    useTheme,
    alpha,
} from '@mui/material';
import {
    AccessTime,
    EventBusy,
    HourglassEmpty,
    Block,
    Celebration,
    CalendarMonth,
    Info,
} from '@mui/icons-material';

export type ClosureReason = 
    | 'outside_business_hours'
    | 'slots_full'
    | 'holiday_break'
    | 'registration_closed';

interface RegistrationClosedPageProps {
    reason: ClosureReason;
    holidayMessage?: string;
    slotFullMessage?: string;
    businessHoursStart?: number;
    businessHoursEnd?: number;
}

const RegistrationClosedPage: React.FC<RegistrationClosedPageProps> = ({
    reason,
    holidayMessage = '',
    slotFullMessage = '',
    businessHoursStart = 8,
    businessHoursEnd = 17,
}) => {
    const theme = useTheme();

    const formatTime = (hour: number): string => {
        const period = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
        return `${displayHour}:00 ${period}`;
    };

    const getConfig = () => {
        switch (reason) {
            case 'outside_business_hours':
                return {
                    icon: <AccessTime sx={{ fontSize: 80, color: 'warning.main' }} />,
                    title: 'Registration Temporarily Closed',
                    subtitle: 'Outside Business Hours',
                    color: theme.palette.warning.main,
                    bgGradient: `linear-gradient(135deg, ${alpha(theme.palette.warning.light, 0.1)} 0%, ${alpha(theme.palette.warning.main, 0.05)} 100%)`,
                    content: (
                        <>
                            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                                The Admission Portal is currently closed. Our registration hours are:
                            </Typography>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 2,
                                    p: 2,
                                    borderRadius: 2,
                                    bgcolor: alpha(theme.palette.warning.main, 0.1),
                                    mb: 2,
                                }}
                            >
                                <CalendarMonth color="warning" />
                                <Typography variant="h6" color="warning.dark" fontWeight="bold">
                                    {formatTime(businessHoursStart)} - {formatTime(businessHoursEnd)}
                                </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                                Monday to Friday (Philippine Standard Time)
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                Please come back during our operating hours to complete your registration.
                            </Typography>
                        </>
                    ),
                };

            case 'slots_full':
                return {
                    icon: <HourglassEmpty sx={{ fontSize: 80, color: 'info.main' }} />,
                    title: 'Slots are Full for Today',
                    subtitle: 'Please Try Again Tomorrow',
                    color: theme.palette.info.main,
                    bgGradient: `linear-gradient(135deg, ${alpha(theme.palette.info.light, 0.1)} 0%, ${alpha(theme.palette.info.main, 0.05)} 100%)`,
                    content: (
                        <>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 1,
                                    p: 2,
                                    borderRadius: 2,
                                    bgcolor: alpha(theme.palette.info.main, 0.1),
                                    mb: 2,
                                }}
                            >
                                <Info color="info" />
                                <Typography variant="body1" color="info.dark">
                                    {slotFullMessage || "We're sorry to inform you that the daily reservation limit has been reached."}
                                </Typography>
                            </Box>
                            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                                Registration will reopen at:
                            </Typography>
                            <Typography variant="h5" color="info.main" fontWeight="bold" sx={{ mb: 2 }}>
                                {formatTime(businessHoursStart)} Tomorrow
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Thank you for your patience and understanding.
                            </Typography>
                        </>
                    ),
                };

            case 'holiday_break':
                return {
                    icon: <Celebration sx={{ fontSize: 80, color: 'secondary.main' }} />,
                    title: 'Holiday Advisory',
                    subtitle: 'Admission Portal Temporarily Closed',
                    color: theme.palette.secondary.main,
                    bgGradient: `linear-gradient(135deg, ${alpha(theme.palette.secondary.light, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
                    content: (
                        <>
                            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                                Dear Users,
                            </Typography>
                            <Box
                                sx={{
                                    p: 2,
                                    borderRadius: 2,
                                    bgcolor: alpha(theme.palette.secondary.main, 0.1),
                                    mb: 2,
                                    borderLeft: `4px solid ${theme.palette.secondary.main}`,
                                }}
                            >
                                <Typography variant="body1" color="text.primary">
                                    {holidayMessage || 'The Admission Portal is temporarily closed for the holiday season.'}
                                </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                                Thank you for your understanding. We wish you a wonderful holiday!
                            </Typography>
                        </>
                    ),
                };

            case 'registration_closed':
                return {
                    icon: <EventBusy sx={{ fontSize: 80, color: 'error.main' }} />,
                    title: 'Registration Closed',
                    subtitle: 'Admission Period Has Ended',
                    color: theme.palette.error.main,
                    bgGradient: `linear-gradient(135deg, ${alpha(theme.palette.error.light, 0.1)} 0%, ${alpha(theme.palette.error.main, 0.05)} 100%)`,
                    content: (
                        <>
                            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                                The Admission Portal is officially closed for this academic year.
                            </Typography>
                            <Box
                                sx={{
                                    p: 2,
                                    borderRadius: 2,
                                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                                    mb: 2,
                                }}
                            >
                                <Typography variant="body2" color="text.secondary">
                                    For further updates and information, please visit the official CHMSU Facebook page:
                                </Typography>
                                <Button
                                    variant="text"
                                    color="primary"
                                    href="https://www.facebook.com/registration-closed"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{ mt: 1, textTransform: 'none' }}
                                >
                                    CHMSU Official Page
                                </Button>
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                                Thank you for your interest in Carlos Hilado Memorial State University.
                            </Typography>
                        </>
                    ),
                };

            default:
                return {
                    icon: <Block sx={{ fontSize: 80, color: 'grey.500' }} />,
                    title: 'Registration Unavailable',
                    subtitle: 'Please Try Again Later',
                    color: theme.palette.grey[500],
                    bgGradient: `linear-gradient(135deg, ${alpha(theme.palette.grey[300], 0.1)} 0%, ${alpha(theme.palette.grey[500], 0.05)} 100%)`,
                    content: (
                        <Typography variant="body1" color="text.secondary">
                            Registration is currently unavailable. Please try again later.
                        </Typography>
                    ),
                };
        }
    };

    const config = getConfig();

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: { xs: 2, sm: 4 },
                minHeight: '60vh',
            }}
        >
            <Paper
                elevation={0}
                sx={{
                    width: { xs: '100%', sm: '500px', md: '600px' },
                    maxWidth: '700px',
                    borderRadius: { xs: 2, sm: 3 },
                    overflow: 'hidden',
                    border: `1px solid ${alpha(config.color, 0.2)}`,
                }}
            >
                {/* Header with gradient */}
                <Box
                    sx={{
                        background: config.bgGradient,
                        p: { xs: 3, sm: 4 },
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        borderBottom: `1px solid ${alpha(config.color, 0.1)}`,
                    }}
                >
                    <Box
                        sx={{
                            p: 2,
                            borderRadius: '50%',
                            bgcolor: 'background.paper',
                            boxShadow: `0 4px 20px ${alpha(config.color, 0.2)}`,
                            mb: 2,
                        }}
                    >
                        {config.icon}
                    </Box>
                    <Typography
                        variant="h5"
                        fontWeight="bold"
                        color="text.primary"
                        textAlign="center"
                        sx={{ mb: 0.5 }}
                    >
                        {config.title}
                    </Typography>
                    <Typography
                        variant="subtitle1"
                        color="text.secondary"
                        textAlign="center"
                    >
                        {config.subtitle}
                    </Typography>
                </Box>

                {/* Content */}
                <Box
                    sx={{
                        p: { xs: 3, sm: 4 },
                        textAlign: 'center',
                    }}
                >
                    {config.content}
                </Box>

                {/* Footer */}
                <Box
                    sx={{
                        p: 2,
                        bgcolor: alpha(theme.palette.grey[500], 0.05),
                        borderTop: `1px solid ${alpha(theme.palette.grey[500], 0.1)}`,
                        textAlign: 'center',
                    }}
                >
                    <Typography variant="caption" color="text.secondary">
                        CHMSU Admission Portal • Academic Year 2026-2027
                    </Typography>
                </Box>
            </Paper>

            {/* Refresh hint for time-based closures */}
            {(reason === 'outside_business_hours' || reason === 'slots_full') && (
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => window.location.reload()}
                    sx={{ mt: 3, borderRadius: 2, textTransform: 'none' }}
                >
                    Refresh Page
                </Button>
            )}
        </Box>
    );
};

export default RegistrationClosedPage;
