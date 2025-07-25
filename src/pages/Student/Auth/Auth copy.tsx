import React from "react";
import { Person } from "@mui/icons-material";
import {
    Box,
    FormControl,
    Paper,
    TextField,
    Typography,
    Button,

    SelectChangeEvent,
    Select,
    InputLabel,
    MenuItem,
    Alert,
    AlertTitle,
    useTheme,
    List,
    ListItem,
    Tooltip,
    FormHelperText,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { AuthContext } from "../../../context/Auth/AuthContext";
import CustomCircularProgress from "../../../components/CustomCircularProgress";
// Import JSON data
import useMediaQuery from "@mui/material/useMediaQuery";
import collegesJsonData from "../colleges.json"; // Adjust the path as needed
import { Colleges } from "./type";
import DataPrivacyPolicyModal from "./DataPrivacyPolicyModal";
import { AuthService } from "../../../services/authService";
import { useLoaderData } from "react-router-dom";
const collegesJson: Colleges = collegesJsonData;

interface DailyReservationLimitData {
    no_of_slots_remaining: number;
    error: string;
    location: string;
}
 
interface NoOfSlotsRemaingByCampus {
    total_slots_remaining: number;
    slots_remaining: [
        { [key: string]: number }
    ];
    error: string;
    location: string;
}

interface DailyReservationLimitClosedData {
    is_daily_reservation_closed: boolean;
    is_last_day_of_admission: boolean;
    error: string;
    location: string;
}
interface LoaderData {
    dailyReservationLimitData: DailyReservationLimitData;
    dailyReservationLimitStatus: number;
    noOfSlotsRemaingByCampus: NoOfSlotsRemaingByCampus;
    noOfSlotsRemaingByCampusStatus: number;
    isDailyReservationClosed: DailyReservationLimitClosedData;
    isDailyReservationClosedStatus: number;
}

interface CampusSlots {
    [key: string]: number; // Campus name as the key, and slots as the value
}
const Register = () => {
    const { 
        dailyReservationLimitData, 
        dailyReservationLimitStatus, 
        noOfSlotsRemaingByCampus, 
        noOfSlotsRemaingByCampusStatus,
        isDailyReservationClosed,
        isDailyReservationClosedStatus 
    } = useLoaderData() as LoaderData
    const theme = useTheme();
    const belowMediumScreenSize = useMediaQuery(theme.breakpoints.down("md"));
    const context = React.useContext(AuthContext);
    const { disableFormContent } = context;
    const { submitForm, handleChange } = context.register.actions;
    const { email } = context.register.data;
    const { loadingButton } = context.register;

    // State for form fields
    const [selectedCollege, setSelectedCollege] = React.useState<string>("");
    const [selectedCourse, setSelectedCourse] = React.useState<string>("");
    const [availableCourses, setAvailableCourses] = React.useState<string[]>([]);
    const [availableCampuses, setAvailableCampuses] = React.useState<string[]>([]);
    const [selectedCampus, setSelectedCampus] = React.useState<string>("");
    const [selectedCampusToTakeExam, setSelectedCampusToTakeExam] = React.useState<string>("");

    // Handle college selection and update courses
    const handleCollegeChange = (event: SelectChangeEvent<string>) => {
        const college = event.target.value as string;
        setSelectedCollege(college);
        setSelectedCourse(""); // Reset course
        setSelectedCampus(""); // Reset campus
        const courses = collegesJson[college]?.courses || [];
        setAvailableCourses(
            courses.map((courseObj) => Object.keys(courseObj)[0]) // Extract course names
        );
    };

    // Handle course selection and update campuses
    const handleCourseChange = (event: SelectChangeEvent<string>) => {
        const courseName = event.target.value as string;
        setSelectedCourse(courseName);
        setSelectedCampus(""); // Reset campus
        const courseDetails = collegesJson[selectedCollege]?.courses.find(
            (courseObj) => Object.keys(courseObj)[0] === courseName
        );
        const campuses = courseDetails
            ? courseDetails[courseName]?.campuses || []
            : [];
        setAvailableCampuses(campuses);
    };

    const handleCampusChange = (event: SelectChangeEvent<string>) => {
        setSelectedCampus(event.target.value as string);
    };

    const handleCampusToTakeExamChange = (event: SelectChangeEvent<string>) => {
        setSelectedCampusToTakeExam(event.target.value);
    };

    const [tooltipOpen1, setTooltipOpen1] = React.useState(false);
    const [dailyReservationLimit, setDailyReservationLimit] = React.useState(0);
    const [slotsRemainingPerCampus, setSlotsRemainingPerCampus] = React.useState<CampusSlots[]>([
        {"Alijis": 0},
        {"Binalbagan": 0},
        {"Fortune Towne": 0},
        {"Talisay": 0}
    ]);
    const [isSystemClosed, setIsSystemClosed] = React.useState(false);
    const [totalSlotsRemaining, setTotalSlotsRemaining] = React.useState(0);
    const [isLastDayOfAdmission, setIsLastDayOfAdmission] = React.useState(false);
    React.useEffect(() => {
        if(dailyReservationLimitData || dailyReservationLimitStatus) {
            setDailyReservationLimit(dailyReservationLimitData.no_of_slots_remaining ?? 0)
        }
        if(noOfSlotsRemaingByCampus || noOfSlotsRemaingByCampusStatus) {
            setTotalSlotsRemaining(noOfSlotsRemaingByCampus.total_slots_remaining ?? 0)
            setSlotsRemainingPerCampus(noOfSlotsRemaingByCampus.slots_remaining ?? [
                {"Alijis": 0},
                {"Binalbagan": 0},
                {"Fortune Towne": 0},
                {"Talisay": 0}
            ])
        }
        if(isDailyReservationClosed || isDailyReservationClosedStatus) {
            const is_daily_reservation_closed = isDailyReservationClosed?.is_daily_reservation_closed ?? false
            const is_last_day_of_admission = isDailyReservationClosed?.is_last_day_of_admission ?? false
            setIsSystemClosed(is_daily_reservation_closed)
            setIsLastDayOfAdmission(is_last_day_of_admission)
        }
    },[
        dailyReservationLimitData, 
        dailyReservationLimitStatus, 
        noOfSlotsRemaingByCampus, 
        noOfSlotsRemaingByCampusStatus,
        isDailyReservationClosed,
        isDailyReservationClosedStatus
    ])
    return (
        <React.Suspense fallback={<CustomCircularProgress />}>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: { xs: 0, sm: 2 },
                    gap: 1,
                }}
            >
                <Paper sx={{ width: { xs: "100%", sm: "500px", md: "60%" }, maxWidth: "700px", borderRadius: { xs: 0, sm: 2 } }}>
                {
                    (isLastDayOfAdmission) 
                    ? 
                        (
                            <Box 
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    // alignItems: "center",
                                    padding: { xs: 2, sm: 4 },
                                    gap: 1,
                                    width: "100%",
                                }}
                            >
                                <Typography variant="h4" color="initial" textAlign={"left"}>Important Notice: Admission for the Academic Year 2025-2026 is closed</Typography>
                                <Typography variant="body1" color="initial" textAlign={"left"}>For updates and more information, visit our website, chmsu.edu.ph, or Facebook page Carlos Hilado Memorial State University</Typography>
                                <Typography variant="body1" color="initial" textAlign={"left"}>Thank you!</Typography>
                            </Box>
                        )
                    :
                        (totalSlotsRemaining > 0) 
                            ? (isSystemClosed)
                                ? (
                                    <Box 
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            padding: { xs: 2, sm: 4 },
                                            gap: 1,
                                            width: "100%",
                                        }}
                                    >
                                        <Typography variant="h4" color="initial">The system is currently unavailable. Registration will reopen at 8:00 AM. Thank you for your patience and understanding.</Typography>
                                    </Box>
                                )
                                : (dailyReservationLimit > 0) 
                                    ?
                                        (
                                            <Box
                                                component="form"
                                                sx={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    padding: { xs: 2, sm: 4 },
                                                    gap: 1,
                                                    width: "100%",
                                                }}
                                                onSubmit={submitForm}
                                                
                                            >
                                                <Typography variant={belowMediumScreenSize ? "h6" : "h6"} color="primary" textAlign={"center"} sx={{ mb: 0, mt: { xs: 1, sm: 0 } }}>
                                                    Welcome to the CHMSU Admission Portal
                                                </Typography>
                                                <Typography variant={belowMediumScreenSize ? "h6" : "h6"} color="primary" textAlign={"center"} sx={{ mb: 2, mt: -1 }}>
                                                    AY 2025-2026
                                                </Typography>
                                                <Alert severity="info" sx={{ width: "100%", p: 2, pb: 0, borderRadius: 2 }}>
                                                    <AlertTitle>Information</AlertTitle>
                                                    <List sx={{ pt: 0 }}>
                                                        <ListItem sx={{ pl: 0 }}>Please fill out the form below</ListItem>
                                                        <ListItem sx={{ pl: 0 }}>Use your active email address</ListItem>
                                                    </List>
                                                    <Typography variant="caption" color="initial"></Typography>
                                                </Alert>
                                                <Person sx={{ color: "primary.main", fontSize: 50, mb: -1.5, mt: 1 }} />
                                                <Typography variant="body1" color="primary" sx={{ mb: 2 }}>
                                                    Registration Form
                                                </Typography>

                                                <Grid container size={12} rowSpacing={3} columnSpacing={2} sx={{ width: "100%" }}>
                                                    <Grid size={{ xs: 12, sm: 6 }}>
                                                        <FormControl fullWidth>
                                                            <TextField 
                                                                name="first_name" 
                                                                label="First name" 
                                                                placeholder="e.g. John" 
                                                                type="text" 
                                                                sx={{ "& .MuiInputBase-root": { borderRadius: 2 } }} 
                                                                disabled={disableFormContent}
                                                                required
                                                            />
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid size={{ xs: 12, sm: 6 }}>
                                                        <FormControl fullWidth>
                                                            <TextField 
                                                                name="last_name" 
                                                                label="Last name" 
                                                                placeholder="e.g. Smith" 
                                                                type="text" 
                                                                sx={{ "& .MuiInputBase-root": { borderRadius: 2 } }} 
                                                                disabled={disableFormContent}
                                                                required
                                                            />
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid size={{ xs: 12, sm: 6 }}>
                                                        <FormControl fullWidth>
                                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                                <DatePicker 
                                                                    name="date_of_birth" 
                                                                    label="Date of birth" 
                                                                    format="YYYY-MM-DD" 
                                                                    sx={{ "& .MuiInputBase-root": { borderRadius: 2 } }} 
                                                                    disabled={disableFormContent}
                                                                    slotProps={{
                                                                        textField: {
                                                                          required: true,
                                                                        },
                                                                    }}
                                                                />
                                                            </LocalizationProvider>
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid size={{ xs: 12, sm: 6 }}>
                                                        <FormControl fullWidth>
                                                            <TextField
                                                                name="email"
                                                                label="Email address"
                                                                placeholder="e.g. johndoe@email.com"
                                                                type="email"
                                                                value={email}
                                                                onChange={handleChange}
                                                                variant="outlined"
                                                                disabled={disableFormContent}
                                                                sx={{ "& .MuiInputBase-root": { borderRadius: 2 } }}
                                                                required
                                                            />
                                                        </FormControl>
                                                    </Grid>
                                                    {/* College Select */}
                                                    <FormControl
                                                        fullWidth
                                                    // disabled={!selectedCampus}
                                                    >
                                                        <InputLabel id="college-label">College of choice</InputLabel>
                                                        <Select
                                                            name="college_description"
                                                            labelId="college-label"
                                                            value={selectedCollege}
                                                            onChange={handleCollegeChange}
                                                            label="College of choice"
                                                            variant="outlined"
                                                            required
                                                            inputProps={{
                                                                sx: {
                                                                    whiteSpace: "normal !important",
                                                                },
                                                            }}
                                                            sx={{ borderRadius: 2 }}
                                                            disabled={disableFormContent}
                                                        >
                                                            {Object.keys(collegesJson).map((college) => (
                                                                <MenuItem key={college} value={college} sx={{ whiteSpace: "normal" }}>
                                                                    {college}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                    {/* Course Select */}
                                                    <FormControl fullWidth disabled={!selectedCollege}>
                                                        <InputLabel id="course-label">Program of choice</InputLabel>
                                                        <Select
                                                            name="course_description"
                                                            labelId="course-label"
                                                            value={selectedCourse}
                                                            onChange={handleCourseChange}
                                                            label="Program of choice"
                                                            variant="outlined"
                                                            required
                                                            inputProps={{
                                                                sx: {
                                                                    whiteSpace: "normal !important",
                                                                },
                                                            }}
                                                            sx={{ borderRadius: 2 }}
                                                            disabled={disableFormContent}
                                                            >
                                                            {availableCourses.map((course) => (
                                                                <MenuItem key={course} value={course} sx={{ whiteSpace: "normal" }}>
                                                                    {course}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                        {/* <TextField name="course_description" value={selectCourseDescription} variant="outlined" sx={{ display: "none" }} /> */}
                                                    </FormControl>
                                                    {/* Campus Select */}
                                                    <Grid size={{ xs: 12, sm: 12 }}>
                                                        <FormControl fullWidth>
                                                            <InputLabel id="campus-label">Campus</InputLabel>
                                                            <Tooltip title="Some programs are offered in multiple campuses." open={tooltipOpen1} placement="top">
                                                                <Select
                                                                    labelId="campus-label"
                                                                    name="campus_to_enroll"
                                                                    value={selectedCampus}
                                                                    onChange={handleCampusChange}
                                                                    label="Campus"
                                                                    variant="outlined"
                                                                    required
                                                                    inputProps={{
                                                                        sx: {
                                                                            whiteSpace: "normal !important",
                                                                        },
                                                                    }}
                                                                    sx={{ borderRadius: 2 }}
                                                                    onFocus={() => setTooltipOpen1(true)}
                                                                    onBlur={() => setTooltipOpen1(false)}
                                                                    disabled={disableFormContent}
                                                                >
                                                                    {availableCampuses.map((campus) => (
                                                                        <MenuItem key={campus} value={campus} sx={{ whiteSpace: "normal" }}>
                                                                            {campus === "Talisay" ? `${campus} (Main) Campus` : `${campus} Campus`}
                                                                        </MenuItem>
                                                                    ))}
                                                                </Select>
                                                            </Tooltip>
                                                        </FormControl>
                                                    </Grid>
                                                    {/* Campus Select */}
                                                    <Grid size={{ xs: 12, sm: 12 }}>
                                                        <FormControl fullWidth>
                                                            <InputLabel id="campus-t-take-exam-label">Exam venue</InputLabel>
                                                            <Select
                                                                labelId="campus-t-take-exam-label"
                                                                name="campus_to_take_exam"
                                                                value={selectedCampusToTakeExam}
                                                                onChange={handleCampusToTakeExamChange}
                                                                label="Exam venue"
                                                                variant="outlined"
                                                                required
                                                                sx={{ borderRadius: 2 }}
                                                                inputProps={{
                                                                    sx: {
                                                                        whiteSpace: "normal !important",
                                                                    },
                                                                }}
                                                                disabled={disableFormContent}
                                                            >
                                                                {slotsRemainingPerCampus.map((campusSlot, index) => {
                                                                    const campusName = Object.keys(campusSlot)[0]; // Extract the campus name
                                                                    const slots = campusSlot[campusName]; // Extract the slots for the campus
                                                                    return (
                                                                        slots > 0 && (
                                                                            <MenuItem key={index} value={campusName} sx={{ whiteSpace: "normal" }}>
                                                                                {campusName === "Talisay" ? `${campusName} (Main) Campus` : `${campusName} Campus`}
                                                                            </MenuItem>
                                                                        )
                                                                    );
                                                                })}
                                                            </Select>
                                                            {/* </Tooltip> */}
                                                            <FormHelperText>**You may choose the exam venue nearest you regardless of your preferred to enroll in.</FormHelperText>
                                                        </FormControl>
                                                    </Grid>
                                                    
                                                    <FormControl fullWidth>
                                                        <Button
                                                            type='submit'
                                                            variant="contained"
                                                            color="primary"
                                                            // disabled={disableButton}
                                                            sx={{ py: 1.75, pt: 2, color: "white", borderRadius: 2 }}
                                                            disabled={disableFormContent || loadingButton}
                                                            fullWidth
                                                        >
                                                            {loadingButton ? "Processing" : "Register"}
                                                        </Button>
                                                    </FormControl>
                                                </Grid>
                                                <DataPrivacyPolicyModal />
                                            </Box>
                                        )
                                    : (
                                        <Box 
                                            sx={{
                                                display: "flex",
                                                flexDirection: "column",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                padding: { xs: 2, sm: 4 },
                                                gap: 1,
                                                width: "100%",
                                            }}
                                        >
                                            <Typography variant="body1" color="initial">We’re sorry to inform you that the daily reservation limit has been reached. Registration will reopen at 8:00 AM. Thank you for your patience and understanding.</Typography>
                                        </Box>
                                    ) 
                        : (
                            <Box 
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    padding: { xs: 2, sm: 4 },
                                    gap: 1,
                                    width: "100%",
                                }}
                            >
                                <Typography variant="body1" color="initial">We're sorry to inform you that all reservation slots are filled at every campus, and no new slots will be added for tomorrow. Thank you for your understanding.</Typography>
                            </Box>
                        )
                }
                </Paper>
            </Box>
        </React.Suspense>
    );
};

const Authentication = () => {
    return (
        <React.Suspense fallback={<CustomCircularProgress />}>
            <Register />
        </React.Suspense>
    );
};

export default Authentication;

export const loader = async (): Promise<LoaderData> => {
    const { data: dailyReservationLimitData, status: dailyReservationLimitStatus } = await AuthService.getDailyReservationLimit();
    const { data: noOfSlotsRemaingByCampus, status: noOfSlotsRemaingByCampusStatus } = await AuthService.getNoOfSlotsRemaingByCampus()
    const { data: isDailyReservationClosed, status: isDailyReservationClosedStatus } = await AuthService.checkIfDailyReservationIsClosed()
    // console.log({
    //     dailyReservationLimitData,
    //     dailyReservationLimitStatus,
    //     noOfSlotsRemaingByCampus,
    //     noOfSlotsRemaingByCampusStatus ,
    //     isDailyReservationClosed,
    //     isDailyReservationClosedStatus
    // })
    return {
        dailyReservationLimitData: dailyReservationLimitData as DailyReservationLimitData,
        dailyReservationLimitStatus: dailyReservationLimitStatus as number,
        noOfSlotsRemaingByCampus: noOfSlotsRemaingByCampus as NoOfSlotsRemaingByCampus,
        noOfSlotsRemaingByCampusStatus: noOfSlotsRemaingByCampusStatus as number,
        isDailyReservationClosed: isDailyReservationClosed as DailyReservationLimitClosedData,
        isDailyReservationClosedStatus: isDailyReservationClosedStatus as number
    }
}