/**
 * Schedule Step Component
 * Part of the unified multi-step form
 * Optimized with loading indicators and retry logic
 */

import React from 'react';
import {
    Box,
    Typography,
    Paper,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    CircularProgress,
    Alert,
    LinearProgress,
    Skeleton,
    Chip,
    Button,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Schedule, Refresh, Cached } from '@mui/icons-material';
import { DateCalendar, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import dayjs, { Dayjs } from 'dayjs';
import { useParams } from 'react-router';
import { useUnifiedForm } from '../UnifiedFormContext';
import { SchedulesService, ScheduleData } from '@services/schedulesService';

interface AccumulatorItem {
    date: string;
    schedules: { timeRange: string; slotsRemaining: number }[];
}

const ScheduleStep: React.FC = () => {
    const { uuid } = useParams<{ uuid: string }>();
    const { formData, updateFormData } = useUnifiedForm();
    const [availableSchedules, setAvailableSchedules] = React.useState<ScheduleData[]>([]);
    const [availableTimes, setAvailableTimes] = React.useState<{ timeRange: string; slotsRemaining: number }[]>([]);
    const [selectedDate, setSelectedDate] = React.useState<Dayjs | null>(
        formData.schedule.schedule_date ? dayjs(formData.schedule.schedule_date) : null
    );
    const [loading, setLoading] = React.useState(true);
    const [refreshing, setRefreshing] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [fromCache, setFromCache] = React.useState(false);
    const [campusName, setCampusName] = React.useState<string>('');
    const [retryCount, setRetryCount] = React.useState(0);
    const maxRetries = 3;

    // Format campus name for display
    const formatCampusName = (campus: string) => {
        if (campus === 'Talisay') {
            return 'Talisay (Main) Campus';
        }
        return `${campus} Campus`;
    };

    // Fetch schedules function (reusable for retry)
    const fetchSchedules = React.useCallback(async (isRefresh = false) => {
        try {
            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }
            setError(null);
            
            const { data, fromCache: cached } = await SchedulesService.getSchedules(uuid);
            setFromCache(cached);
            
            if (data?.length > 0) {
                setAvailableSchedules(data);
                // Extract campus name from first schedule
                if (data[0]?.campus) {
                    setCampusName(data[0].campus);
                }
            } else if (data?.length === 0) {
                setError('No available schedules found for your campus.');
            }
            setRetryCount(0);
        } catch (err) {
            console.error('Error fetching schedules:', err);
            
            // Retry logic
            if (retryCount < maxRetries) {
                setRetryCount(prev => prev + 1);
                setTimeout(() => fetchSchedules(isRefresh), 1000 * (retryCount + 1)); // Exponential backoff
            } else {
                setError('Unable to load schedules. Please check your connection and try again.');
            }
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [uuid, retryCount]);

    // Group schedules by date
    const availableDates = React.useMemo(() => {
        return availableSchedules.reduce((acc, schedule) => {
            const formattedDate = dayjs(schedule.schedule_date).format('YYYY-MM-DD');
            const existingDate = acc.find((item) => item.date === formattedDate);

            const scheduleDetails = {
                timeRange: `${schedule.schedule_time_start}-${schedule.schedule_time_end}`,
                slotsRemaining: schedule.slots_remaining,
            };

            if (existingDate) {
                existingDate.schedules.push(scheduleDetails);
            } else if (schedule.slots_remaining > 0) {
                acc.push({
                    date: formattedDate,
                    schedules: [scheduleDetails],
                });
            }

            return acc;
        }, [] as AccumulatorItem[]);
    }, [availableSchedules]);

    const isAvailableDate = (date: Dayjs) =>
        availableDates.some((d) => d.date === date.format('YYYY-MM-DD'));

    const handleDateChange = (date: Dayjs | null) => {
        setSelectedDate(date);
        const selectedDateFormatted = date?.format('YYYY-MM-DD');

        const matchingSchedule = availableDates.find((d) => d.date === selectedDateFormatted);
        if (matchingSchedule && Array.isArray(matchingSchedule.schedules)) {
            setAvailableTimes(matchingSchedule.schedules);
        } else {
            setAvailableTimes([]);
        }

        // Update form data
        updateFormData('schedule', {
            schedule_date: selectedDateFormatted || '',
            schedule_time: '',
        });
    };

    const handleTimeSelect = (timeRange: string) => {
        updateFormData('schedule', {
            schedule_date: selectedDate?.format('YYYY-MM-DD') || '',
            schedule_time: timeRange,
        });
    };

    const handleRefresh = () => {
        fetchSchedules(true);
    };

    // Initial fetch
    const hasFetched = React.useRef(false);
    React.useEffect(() => {
        if (uuid && !hasFetched.current) {
            hasFetched.current = true;
            fetchSchedules();
        }
    }, [uuid, fetchSchedules]);

    // Initialize available times if date was already selected
    React.useEffect(() => {
        if (selectedDate && availableDates.length > 0) {
            const matchingSchedule = availableDates.find(
                (d) => d.date === selectedDate.format('YYYY-MM-DD')
            );
            if (matchingSchedule) {
                setAvailableTimes(matchingSchedule.schedules);
            }
        }
    }, [availableDates, selectedDate]);

    // Loading state with skeleton
    if (loading) {
        return (
            <Box sx={{ width: '100%' }}>
                {/* Progress bar at top */}
                <LinearProgress sx={{ mb: 2 }} />
                
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', py: 4 }}>
                    <CircularProgress size={48} sx={{ mb: 2 }} />
                    <Typography variant="body1" color="textSecondary">
                        Loading available schedules...
                    </Typography>
                    {retryCount > 0 && (
                        <Typography variant="caption" color="textSecondary" sx={{ mt: 1 }}>
                            Retry attempt {retryCount} of {maxRetries}...
                        </Typography>
                    )}
                </Box>
                
                {/* Skeleton for calendar and times */}
                <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid size={{ xs: 12, md: 7 }}>
                        <Skeleton variant="rectangular" height={350} sx={{ borderRadius: 2 }} />
                    </Grid>
                    <Grid size={{ xs: 12, md: 5 }}>
                        <Skeleton variant="rectangular" height={350} sx={{ borderRadius: 2 }} />
                    </Grid>
                </Grid>
            </Box>
        );
    }

    // Error state
    if (error && availableSchedules.length === 0) {
        return (
            <Box sx={{ width: '100%', py: 4 }}>
                <Alert 
                    severity="error" 
                    action={
                        <Button 
                            color="inherit" 
                            size="small" 
                            onClick={() => {
                                setRetryCount(0);
                                hasFetched.current = false;
                                fetchSchedules();
                            }}
                            startIcon={<Refresh />}
                        >
                            Retry
                        </Button>
                    }
                >
                    {error}
                </Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ width: '100%' }}>
            {/* Refresh indicator */}
            {refreshing && <LinearProgress sx={{ position: 'absolute', top: 0, left: 0, right: 0 }} />}
            
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column-reverse', sm: 'row' }, rowGap: 2, alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, columnGap: 1, alignItems: 'center' }}>
                    <Schedule sx={{ color: 'primary.main', fontSize: '3rem' }} />
                    <Typography variant="h6" color="primary">Schedules</Typography>
                    {fromCache && (
                        <Chip 
                            icon={<Cached />} 
                            label="Cached" 
                            size="small" 
                            color="success" 
                            variant="outlined"
                            sx={{ ml: 1 }}
                        />
                    )}
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0, alignItems: { xs: 'center', sm: 'flex-end' } }}>
                    <Typography variant="body1" color='textSecondary' sx={{ fontWeight: 'bold' }}>CHMSU Admission Portal</Typography>
                    <Typography variant="body1" color='textSecondary' sx={{ fontWeight: 'bold' }}>Academic Year 2026 - 2027</Typography>
                    <Button 
                        size="small" 
                        startIcon={refreshing ? <CircularProgress size={14} /> : <Refresh />}
                        onClick={handleRefresh}
                        disabled={refreshing}
                        sx={{ mt: 0.5 }}
                    >
                        {refreshing ? 'Refreshing...' : 'Refresh Schedules'}
                    </Button>
                </Box>
            </Box>
            <Alert sx={{ ml: 'auto', mb: 2 }} severity="info">Choose a test date and time that doesn't conflict with any personal commitments or school activities. Once you click Register, your admission test appointment is final and cannot be rescheduled.</Alert>

            <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 7 }}>
                    <Paper variant="outlined" sx={{ borderRadius: 2, position: 'relative', overflow: 'hidden' }}>
                        {refreshing && <LinearProgress sx={{ position: 'absolute', top: 0, left: 0, right: 0 }} />}
                        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer
                                    components={['DateCalendar']}
                                    sx={{ py: 3, pb: 0, px: 2, '.MuiTypography-root': { textAlign: 'center !important' } }}
                                >
                                    <DemoItem label={`Available Dates at${campusName ? ` ${formatCampusName(campusName)}` : ''}:`}>
                                        <DateCalendar
                                            value={selectedDate}
                                            onChange={handleDateChange}
                                            minDate={dayjs('2026-02-09')}
                                            maxDate={dayjs('2026-03-07')}
                                            shouldDisableDate={(date) => !isAvailableDate(date)}
                                            disabled={refreshing}
                                            sx={{
                                                '& .MuiPickersDay-root': {
                                                    fontWeight: '500',
                                                },
                                                '& .MuiPickersDay-root:not(.Mui-disabled)': {
                                                    backgroundColor: '#a4eda7',
                                                    color: 'black',
                                                },
                                                '& .MuiPickersDay-root.Mui-selected': {
                                                    backgroundColor: 'darkgreen',
                                                    color: 'white',
                                                },
                                                '& .MuiPickersDay-root.Mui-disabled': {
                                                    textDecoration: 'line-through',
                                                    color: '#bcbcbc',
                                                },
                                            }}
                                        />
                                    </DemoItem>
                                </DemoContainer>
                            </LocalizationProvider>
                        </Box>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 5 }}>
                    <Paper variant="outlined" sx={{ height: '100%', py: 3, px: 2, borderRadius: 2 }}>
                        <Typography variant="body2" textAlign="center" sx={{ mb: 1 }}>
                            Available Times at{campusName ? ` ${formatCampusName(campusName)}` : ''}:
                        </Typography>
                        {availableTimes.length > 0 ? (
                            <List sx={{ pb: 0 }}>
                                {availableTimes.map((schedule, index) => (
                                    <ListItem key={index} disablePadding sx={{ ':not(:last-child)': { mb: 1 } }}>
                                        <ListItemButton
                                            sx={{
                                                backgroundColor:
                                                    formData.schedule.schedule_time === schedule.timeRange
                                                        ? 'green !important'
                                                        : '#eeeeee',
                                                color:
                                                    formData.schedule.schedule_time === schedule.timeRange
                                                        ? 'white !important'
                                                        : 'initial',
                                                '&:hover': {
                                                    backgroundColor:
                                                        formData.schedule.schedule_time === schedule.timeRange
                                                            ? 'darkgreen'
                                                            : 'lightgray',
                                                },
                                                borderRadius: 2,
                                            }}
                                            onClick={() => handleTimeSelect(schedule.timeRange)}
                                        >
                                            <ListItemText
                                                primary={schedule.timeRange}
                                                secondary={
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            color:
                                                                formData.schedule.schedule_time === schedule.timeRange
                                                                    ? 'lightgray'
                                                                    : 'gray',
                                                        }}
                                                    >
                                                        Slots Remaining: {schedule.slotsRemaining}
                                                    </Typography>
                                                }
                                            />
                                        </ListItemButton>
                                    </ListItem>
                                ))}
                            </List>
                        ) : (
                            <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mt: 2 }}>
                                {selectedDate
                                    ? 'No available times for this date'
                                    : 'Select a date to see available times'}
                            </Typography>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ScheduleStep;
