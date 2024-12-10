import { Schedule } from '@mui/icons-material'
import { Box, CircularProgress, FormControl, List, ListItem, ListItemButton, ListItemText, Paper, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { DateCalendar, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import React from 'react'
import dayjs, { Dayjs } from 'dayjs'
import { useNavigate, useParams } from 'react-router'
import { SchedulesService } from '../../../../services/schedulesService';
import { LoadingButton } from '@mui/lab';
import { AccumulatorItem, AvailableDateType, ScheduleType } from './type';
const Schedules = () => {
    const navigate = useNavigate()
    const { uuid } = useParams<{uuid: string | undefined}>()
    const [availableTimes, setAvailableTimes] = React.useState<{timeRange: string, slotsRemaining: number}[]>([]);
    const [availableSchedules, setAvailableSchedules] = React.useState<ScheduleType[]>([])
    const [selectedDate, setSelectedDate] = React.useState<Dayjs | null>(null); // State for the selected date
    const [selectedTime, setSelectedTime] = React.useState<string>('')
    const [calendarKey, setCalendarKey] = React.useState<number>(0)
    const [loading, setLoading] = React.useState<boolean>(false)
    // Define available dates for highlighting and group schedule time start and end
    const availableDates = availableSchedules?.reduce((acc, schedule: ScheduleType) => {
        const formattedDate = dayjs(schedule.schedule_date).format('YYYY-MM-DD');
    
        // Find if the date already exists in the accumulator
        const existingDate = acc.find((item: AccumulatorItem) => item.date === formattedDate);
    
        const scheduleDetails = {
            timeRange: `${schedule.schedule_time_start}-${schedule.schedule_time_end}`,
            slotsRemaining: schedule.slots_remaining,
        };
    
        if (existingDate) {
            // If the date exists, push the new schedule details to the array
            existingDate.schedules.push(scheduleDetails);
        } else {
            if (schedule.slots_remaining > 0) {
                // If the date does not exist, create a new entry
                acc.push({
                    date: formattedDate,
                    schedules: [scheduleDetails], // Store the schedule details as an array
                });
            }
        }
    
        return acc;
    }, [] as AccumulatorItem[]); // Initialize with an empty array

    // Function to check if a date is available
    const isAvailableDate = (date: Dayjs) =>
        availableDates?.some((availableDate: AvailableDateType) => availableDate.date === date.format('YYYY-MM-DD'));
    // Handle date change
    // const handleDateChange = (date: Dayjs | null) => {
    //     setSelectedDate(date);
    //     const selectedDateFormatted  = date?.format('YYYY-MM-DD');

    //     const matchingSchedule = availableDates.find(
    //         (availableDate) => availableDate.date === selectedDateFormatted 
    //     );

    //     if (matchingSchedule && Array.isArray(matchingSchedule.times)) {
    //         setAvailableTimes(matchingSchedule.times);
    //     } else {
    //         setAvailableTimes([]); // No available times for the selected date
    //         console.log("No available times for the selected date.");
    //     }
    //     setSelectedTime('')
    // };
    // Handle date change
    const handleDateChange = (date: Dayjs | null) => {
        setSelectedDate(date)
        const selectedDateFormatted = date?.format('YYYY-MM-DD')

        const matchingSchedule = availableDates.find(
            (availableDate: AvailableDateType) => availableDate.date === selectedDateFormatted
        )
        if (matchingSchedule && Array.isArray(matchingSchedule.schedules)) {
            setAvailableTimes(matchingSchedule.schedules)
        } else {
            setAvailableTimes([]) // No available times for the selected date
            console.log("No available times for the selected date.")
        }
        setSelectedTime('')
    }
    // const handleChangeTime = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     const eventSelectedTime = event.target.value;
    //     console.log(eventSelectedTime)
    //     setSelectedTime(eventSelectedTime);
    // }
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const confirmation = window.confirm('Are you sure you want to submit the selected schedule?');
        if(!confirmation) return
        setLoading(true)
        const formData = new FormData();
        formData.append('schedule_date', selectedDate?.format('YYYY-MM-DD') ?? '')
        formData.append('schedule_time', selectedTime ?? '')
        formData.append('uuid', uuid ?? '')
        const { data, status } = await SchedulesService.updateApplicantScheduleId(formData)
        if(data || data.message) {

            if(data.slots_remaining < 1) {
                // Reset state and refresh schedules
                setSelectedDate(null); // Reset selected date
                setSelectedTime(''); // Reset selected time
                setAvailableTimes([]); // Clear available times
                setAvailableSchedules([]); // Clear schedules
                setCalendarKey((prevKey) => prevKey + 1); // Increment key to force re-render
                await getSchedules(uuid); // Refresh schedules
            }
            if([200,201,204].includes(status)){
                alert(data.message)
                navigate('.')
            }
            // Simulate a network request
            setTimeout(() => setLoading(false), 2000);
        }
    }

    const getSchedules = async (uuid: string | undefined) => {
        try {
          const { data } = await SchedulesService.getSchedules(uuid);
          if (data?.length > 0) {
            setAvailableSchedules(data);
          }
        } catch (error) {
          console.error('Error fetching schedules:', error);
        }
    };
    React.useEffect(() => {
        getSchedules(uuid)
    }, [uuid])
    const disableButtonSubmit = !selectedDate || !selectedTime
    return (
        <React.Suspense fallback={<CircularProgress />}>
                <Box
                    sx={{ 
                        display: 'flex', 
                        flexDirection: 'column',
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        padding: {xs: 0, sm: 2},
                        gap: 1,
                    }}
                >
                    <Paper sx={{ width: "100%", maxWidth: "1000px", borderRadius: {xs: 0, sm:2}}}>
                        <Box
                            sx={{ 
                                display: 'flex', 
                                flexDirection: 'column',
                                justifyContent: 'center', 
                                alignItems: 'center',
                                padding: {xs: 2, sm: 4},
                                gap: 3,
                                width: '100%',
                            }}
                            component={'form'}
                            onSubmit={handleSubmit}
                        >
                            <Box sx={{display: 'flex', flexDirection: {xs: 'column-reverse', sm: 'row'}, rowGap: 2, alignItems: 'center', justifyContent: 'space-between', width: '100%'}}>
                                <Box sx={{display: 'flex', flexDirection: {xs: 'column', sm: 'row'}, columnGap: 1, alignItems: 'center'}}>
                                <Schedule sx={{ color: 'primary.main', fontSize: '3rem'}} />
                                <Typography variant="h6" color="primary">Schedules</Typography>
                                </Box>
                                <Box sx={{display: 'flex', flexDirection: 'column', gap: 0, alignItems: {xs: 'center', sm: 'flex-end'}}}>
                                <Typography variant="body1" color='textSecondary' sx={{fontWeight: 'bold'}}>CHMSU Admission Portal</Typography>
                                <Typography variant="body1" color='textSecondary' sx={{fontWeight: 'bold'}}>Academic Year 2025 - 2026</Typography>
                                </Box>
                            </Box>
                            <Grid container rowSpacing={3} columnSpacing={2} width={'100%'}>
                                    <Grid size={{xs: 12, md: 7}}>
                                        <Paper variant='outlined' sx={{ flexGrow: 1, borderRadius: 2 }}>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    width: '100%',
                                                }}
                                            >
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DemoContainer components={['DateCalendar']} sx={{py: 5, pb: 0, px: 2, '.MuiTypography-root': {textAlign: 'center !important'}}}>
                                                    <DemoItem label="Available Dates:">
                                                        <DateCalendar
                                                            key={calendarKey} // Force re-render on key change
                                                            onChange={handleDateChange} // Handle date change
                                                            minDate={dayjs('2025-03-19')}
                                                            maxDate={dayjs('2025-06-15')}
                                                            shouldDisableDate={(date: Dayjs) => !isAvailableDate(date)} // Disable dates not in availableDates
                                                            sx={{
                                                            '& .MuiPickersDay-root': {
                                                                backgroundColor: (date: any) =>
                                                                    isAvailableDate(dayjs(date)) ? 'primary.main' : 'inherit',
                                                                fontWeight: '500'
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
                                    <Grid size={{xs: 12, md: 5}}>
                                        <Paper variant='outlined' sx={{ flexGrow: 1, height: '100%', py: 5, px: 2, pb: 2, borderRadius: 2 }}>
                                            <Box sx={{ height: '100%' }}>
                                                <Typography variant="body2" color="initial" textAlign={'center'} sx={{mb: 1}}>Available Times:</Typography>
                                                <List sx={{pb:0}}>
                                                    {availableTimes?.length > 0 && availableTimes.map((schedule, index) => (
                                                        <ListItem key={index} disablePadding sx={{ ':not(:last-child)': {mb: 1}}}>
                                                            <ListItemButton
                                                                sx={{
                                                                    backgroundColor: selectedTime === schedule.timeRange ? 'green !important' : 'initial',
                                                                    color: selectedTime === schedule.timeRange ? 'white !important' : 'initial !important',
                                                                    '&:hover': {
                                                                        backgroundColor: selectedTime === schedule.timeRange ? 'darkgreen' : 'lightgray',
                                                                    },
                                                                    borderRadius: 2,
                                                                    background: '#eeeeee',
                                                                }}
                                                                onClick={() => setSelectedTime(schedule.timeRange)}
                                                            >
                                                                <ListItemText
                                                                    primary={schedule.timeRange}
                                                                    secondary={<Typography variant="body2" sx={{ color: selectedTime === schedule.timeRange ? 'lightgray' : 'gray', }}>Slots Remaining: {schedule.slotsRemaining}</Typography>}
                                                                />
                                                            </ListItemButton>
                                                        </ListItem>
                                                    ))}
                                                </List>
                                            </Box>
                                        </Paper>
                                    </Grid>
                                <FormControl fullWidth>
                                    <LoadingButton
                                        type="submit" // Assigning the type property
                                        variant="contained"
                                        color="primary"
                                        loading={loading}
                                        disabled={disableButtonSubmit}
                                        sx={{ py: 1.75, pt: 2, color: "white", borderRadius: 2 }}
                                    >
                                        {loading ? 'Submitting...' : 'Submit'}
                                    </LoadingButton>
                                </FormControl>
                            </Grid>
                        </Box>
                    </Paper>
                </Box>
            </React.Suspense>
    )
}

export default React.memo(Schedules)