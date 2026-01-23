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
import { AuthContext } from "@context/Auth/AuthContext";
import CustomCircularProgress from "@components/CustomCircularProgress";
import RegistrationQueueDialog from "@components/RegistrationQueueDialog";
import { NotificationDialog, ConfirmationDialog } from "@components/NotificationDialog";
import RegistrationClosedPage from "./RegistrationClosedPage";
// Import JSON data
import useMediaQuery from "@mui/material/useMediaQuery";
import collegesJsonData from "../colleges.json"; // Adjust the path as needed
import { Colleges } from "./type";
// import DataPrivacyPolicyModal from "./DataPrivacyPolicyModal";
import dayjs from "dayjs";

const collegesJson: Colleges = collegesJsonData;

/**
 * Static System Configuration
 * Change these values to control registration availability
 */
const STATIC_CONFIG = {
    // Set to true to close registration (last day message shown)
    isLastDayOfRegistration: false,
    
    // Set to true to show holiday message
    isHolidayBreak: false,
    // holidayMessage: "We will resume the Admission Registration on January 06, 2026. Thank you!",
    holidayMessage: "",
    
    // Business hours: 8 AM to 5 PM (24-hour format)
    businessHoursStart: 8,
    businessHoursEnd: 17,
    
    // Set to true when daily slots are full
    areSlotsFull: false,
    slotFullMessage: "We're sorry to inform you that the daily reservation limit has been reached. Registration will reopen at 8:00 AM, Monday to Friday (Philippine Standard Time). Thank you for your patience and understanding.",
    
    // Exam venues available for registration
    examVenues: ["Alijis", "Fortune Towne", "Talisay"]
};

/**
 * Check if current time is within business hours (Philippines timezone)
 * Business hours: Weekdays (Monday-Friday) only, 8 AM to 5 PM
 */
const isWithinBusinessHours = (): boolean => {
    const now = new Date();
    const manilaTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Manila' }));
    const hour = manilaTime.getHours();
    const day = manilaTime.getDay(); // 0 = Sunday, 6 = Saturday
    
    // Check if it's a weekday (Monday to Friday) and within business hours
    const isWeekday = day >= 1 && day <= 5;
    const isWithinHours = hour >= STATIC_CONFIG.businessHoursStart && hour < STATIC_CONFIG.businessHoursEnd;
    
    return isWeekday && isWithinHours;
};

console.log({
    isWithinBusinessHours: isWithinBusinessHours(),
    slotsAreFull: STATIC_CONFIG.areSlotsFull,
})

const Register = () => {
    const theme = useTheme();
    const belowMediumScreenSize = useMediaQuery(theme.breakpoints.down("md"));
    const context = React.useContext(AuthContext);
    const { disableFormContent, queueStatus, clearQueueStatus, notification, confirmation, closeNotification, closeConfirmation } = context;
    const { submitForm, handleChange } = context.register.actions;
    const { email } = context.register.data;
    const { loadingButton } = context.register;

    // Static configuration values
    const withinBusinessHours = isWithinBusinessHours();
    const areSlotsFull = STATIC_CONFIG.areSlotsFull;
    const isHolidayBreak = STATIC_CONFIG.isHolidayBreak;
    const isLastDayOfRegistration = STATIC_CONFIG.isLastDayOfRegistration;

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
    const defaultDate = dayjs('2006-01-01'); // Set default date

    // Determine if registration should be blocked and why
    const getClosureReason = () => {
        if (isLastDayOfRegistration) return 'registration_closed';
        if (isHolidayBreak) return 'holiday_break';
        if (!withinBusinessHours) return 'outside_business_hours';
        if (areSlotsFull) return 'slots_full';
        return null;
    };

    const closureReason = getClosureReason();

    // Show the closed page if there's a closure reason
    if (closureReason) {
        return (
            <React.Suspense fallback={<CustomCircularProgress />}>
                <RegistrationClosedPage
                    reason={closureReason}
                    holidayMessage={STATIC_CONFIG.holidayMessage}
                    slotFullMessage={STATIC_CONFIG.slotFullMessage}
                    businessHoursStart={STATIC_CONFIG.businessHoursStart}
                    businessHoursEnd={STATIC_CONFIG.businessHoursEnd}
                />
                {/* Dialogs */}
                <NotificationDialog
                    open={notification.open}
                    type={notification.type}
                    title={notification.title}
                    message={notification.message}
                    onClose={closeNotification}
                    onConfirm={notification.onConfirm}
                />
                <ConfirmationDialog
                    open={confirmation.open}
                    title={confirmation.title}
                    message={confirmation.message}
                    onClose={closeConfirmation}
                    onConfirm={confirmation.onConfirm}
                />
            </React.Suspense>
        );
    }

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
                            Academic Year 2026-2027
                        </Typography>
                                            <Alert severity="info" sx={{ width: "100%", p: 2, pb: 0, borderRadius: 2 }}>
                                                <AlertTitle>We Value your Data Privacy</AlertTitle>
                                                <List sx={{ pt: 0 }}>
                                                    <ListItem sx={{ pl: 0 }}>By registering, you consent to CHMSU collecting and processing your personal information for admissions, communication, and legal compliance. Your data is used only for admissions-related purposes and may be shared with authorized staff and contracted service providers bound to protect it. For privacy concerns, please email support.ictmis@chmsu.edu.ph.</ListItem>
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
                                                                value={defaultDate} // Set default value
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
                                                            {STATIC_CONFIG.examVenues.map((venue) => (
                                                                <MenuItem key={venue} value={venue} sx={{ whiteSpace: "normal" }}>
                                                                    {venue === "Talisay" ? `${venue} (Main) Campus` : `${venue} Campus`}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                        {/* </Tooltip> */}
                                                        <FormHelperText>**You may choose the exam venue nearest you regardless of your preferred campus to enroll in.</FormHelperText>
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
                                            {/* <DataPrivacyPolicyModal /> */}
                                    </Box>
                </Paper>
            </Box>
            
            {/* Registration Queue Status Dialog */}
            <RegistrationQueueDialog 
                open={queueStatus !== null} 
                status={queueStatus}
                onClose={clearQueueStatus}
            />

            {/* Notification Dialog - Replaces all alert() calls */}
            <NotificationDialog
                open={notification.open}
                type={notification.type}
                message={notification.message}
                title={notification.title}
                onClose={closeNotification}
            />

            {/* Confirmation Dialog - Replaces all window.confirm() calls */}
            <ConfirmationDialog
                open={confirmation.open}
                message={confirmation.message}
                title={confirmation.title}
                onConfirm={confirmation.onConfirm}
                onClose={closeConfirmation}
            />
        </React.Suspense>
    )
}

const Authentication = () => {
    return (
        <React.Suspense fallback={<CustomCircularProgress />}>
            <Register />
        </React.Suspense>
    )
}

export default Authentication