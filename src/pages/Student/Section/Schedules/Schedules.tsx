import { Schedule } from '@mui/icons-material'
import { Box, Button, CircularProgress, FormControl, FormControlLabel, FormLabel, List, ListItem, Paper, Radio, RadioGroup, Typography } from '@mui/material'
import { DateCalendar, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import React from 'react'
import dayjs, { Dayjs } from 'dayjs'
import { useNavigate, useParams } from 'react-router'
import { SchedulesService } from '../../../../services/schedulesService';

const initialApplicantInitialInfo = {
    email: '',
    campus_to_enroll: '',
    campus_to_take_exam: '',
    college_description: '',
    course_description: '',
}
const Schedules = () => {
    const navigate = useNavigate()
    const { uuid } = useParams<{uuid: string | undefined}>()
    const [applicantInitialInfo, setApplicantInitialInfo] = React.useState<{
        email: string
        campus_to_enroll: string
        campus_to_take_exam: string
        college_description: string
        course_description: string
    }>(initialApplicantInitialInfo)
    const [availableTimes, setAvailableTimes] = React.useState<string[]>([]);
    const [availableSchedules, setAvailableSchedules] = React.useState<any[]>([])
    const [selectedDate, setSelectedDate] = React.useState<Dayjs | null>(null); // State for the selected date
    const [selectedTime, setSelectedTime] = React.useState<string>('')
    // Define available dates for highlighting and accumulate times
    const availableDates = availableSchedules?.reduce((acc, schedule) => {
        const formattedDate = dayjs(schedule.schedule_date).format('YYYY-MM-DD');

        // Find if the date already exists in the accumulator
        const existingDate = acc.find(item => item.date === formattedDate);

        if (existingDate) {
            // If the date exists, push the new time to the times array
            existingDate.times.push(schedule.schedule_time);
        } else {
            // If the date does not exist, create a new entry
            acc.push({
                date: formattedDate,
                times: [schedule.schedule_time],
            });
        }

        return acc;
    }, []); // Initialize with an empty array

    // Function to check if a date is available
    const isAvailableDate = (date: Dayjs) =>
        availableDates?.some((availableDate) => availableDate.date === date.format('YYYY-MM-DD'));
    // Handle date change
    const handleDateChange = (date: Dayjs | null) => {
        setSelectedDate(date);
        const selectedDateFormatted  = date?.format('YYYY-MM-DD');

        const matchingSchedule = availableDates.find(
            (availableDate) => availableDate.date === selectedDateFormatted 
        );

        if (matchingSchedule && Array.isArray(matchingSchedule.times)) {
            setAvailableTimes(matchingSchedule.times);
        } else {
            setAvailableTimes([]); // No available times for the selected date
            console.log("No available times for the selected date.");
        }
        setSelectedTime('')
    };
    const handleChangeTime = (event: React.ChangeEvent<HTMLInputElement>) => {
        const eventSelectedTime = event.target.value;
        setSelectedTime(eventSelectedTime);
    }
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const confirmation = window.confirm('Are you sure you want to submit the selected schedule?');
        if(!confirmation) return
        const formData = new FormData();
        formData.append('schedule_date', selectedDate?.format('YYYY-MM-DD') ?? '')
        formData.append('schedule_time', selectedTime ?? '')
        formData.append('uuid', uuid ?? '')
        const { data } = await SchedulesService.saveApplicantSchedule(formData)
        console.log(data)
    }
    React.useEffect(() => {
        const getApplicantInitialInfo = async () => {
            const { data } = await SchedulesService.getApplicantInitialInfo(uuid)
            if(data.length > 0) {
                setApplicantInitialInfo(data[0])
            }
        }
        const getSchedules = async (uuid) => {
            const { data } = await SchedulesService.getSchedules()
            if(data?.length > 0) {
                setAvailableSchedules(data)
            }
        }
        getSchedules(uuid)
        getApplicantInitialInfo(uuid)
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
                        height: '100%',
                        padding: '1rem',
                        width: { xs: '100%', md: '678px'},
                        gap: 1
                    }}
                >
                    <Paper sx={{ width: { xs: '100%', md: '678px'}, }}>
                        <Box
                            sx={{ 
                                display: 'flex', 
                                flexDirection: 'column',
                                justifyContent: 'center', 
                                alignItems: 'center', 
                                padding: '1rem',
                                gap: 1
                            }}
                            component={'form'}
                            onSubmit={handleSubmit}
                        >
                            <Schedule />
                            <Typography variant="body1" color="initial">Schedules</Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Typography variant="body1" color="initial">Email Address: {applicantInitialInfo?.email}</Typography>
                                <Typography variant="body1" color="initial">Campus To Enroll: {applicantInitialInfo?.campus_to_enroll}</Typography>
                                <Typography variant="body1" color="initial">Campus To Take Exam: {applicantInitialInfo?.campus_to_take_exam}</Typography>
                                <Typography variant="body1" color="initial">College :{applicantInitialInfo?.college_description}</Typography>
                                <Typography variant="body1" color="initial">Course/Program :{applicantInitialInfo?.course_description}</Typography>
                            </Box>
                            <Box
                                sx={{ 
                                    display: 'flex',
                                    width: '100%',
                                 }}
                            >
                                <Paper sx={{ flexGrow: 1 }}>
                                    <Box
                                        sx={{ 
                                            display: 'flex',
                                            justifyContent: 'center',
                                            width: '100%',
                                        }}
                                    >

                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DemoContainer components={['DateCalendar']}>
                                            <DemoItem label="Available Dates" sx={{ textAlign: 'center' }}>
                                                <DateCalendar
                                                    onChange={handleDateChange} // Handle date change
                                                    minDate={dayjs('2025-02-03')}
                                                    maxDate={dayjs('2025-03-31')}
                                                    shouldDisableDate={(date) => !isAvailableDate(date)} // Disable dates not in availableDates
                                                    sx={{
                                                    '& .MuiPickersDay-root': {
                                                        backgroundColor: (date: any) =>
                                                            isAvailableDate(dayjs(date)) ? 'rgba(0, 128, 0, 0.2)' : 'inherit',
                                                    },
                                                }}
                                                />
                                            </DemoItem>
                                        </DemoContainer>
                                    </LocalizationProvider>
                                    </Box>
                                </Paper>
                                {availableTimes?.length > 0 && (
                                    <Paper sx={{ flexGrow: 1 }}>
                                        <Box sx={{ mt: 2 }}>
                                            <Typography variant="body2" color="initial" textAlign={'center'}>Available Times:</Typography>
                                            <List sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 1 }}>
                                                    <>
                                                        {/* <ListItem key={time} sx={{ display: 'flex', justifyContent: 'center', backgroundColor: 'green', color: 'white' }}>{time}</ListItem> */}
                                                        <FormControl sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
                                                            {/* <FormLabel id="demo-radio-buttons-group-label">Gender</FormLabel> */}
                                                            <RadioGroup
                                                                aria-labelledby="demo-radio-buttons-group-label"
                                                                name="radio-buttons-group"
                                                                onChange={handleChangeTime}
                                                                >
                                                                {availableTimes.map((time) => (
                                                                    <FormControlLabel key={time} value={time} control={<Radio />} label={time} />
                                                                ))}
                                                            </RadioGroup>
                                                        </FormControl>
                                                    </>
                                            </List>
                                            
                                        </Box>
                                    </Paper>
                                )}
                            </Box>
                            <FormControl fullWidth>
                            <Button 
                                variant="contained" 
                                color="primary" 
                                type='submit'
                                fullWidth
                                disabled={disableButtonSubmit}
                            >
                                Submit
                            </Button>
                            </FormControl>
                        </Box>
                    </Paper>
                </Box>
            </React.Suspense>
    )
}

export default React.memo(Schedules)