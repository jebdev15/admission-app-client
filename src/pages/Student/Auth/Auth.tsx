import React from "react";
import { Person, Refresh } from "@mui/icons-material";
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
    CircularProgress,
    Skeleton,
    LinearProgress,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { AuthContext } from "@context/Auth/AuthContext";
import CustomCircularProgress from "@components/CustomCircularProgress";
import RegistrationQueueDialog from "@components/RegistrationQueueDialog";
import { NotificationDialog, ConfirmationDialog } from "@components/NotificationDialog";
// Import JSON data
import useMediaQuery from "@mui/material/useMediaQuery";
import collegesJsonData from "../colleges.json"; // Adjust the path as needed
import { Colleges } from "./type";
// import DataPrivacyPolicyModal from "./DataPrivacyPolicyModal";
import dayjs from "dayjs";
import { SystemConfigService, SystemStatus } from "@services/systemConfigService";

const collegesJson: Colleges = collegesJsonData;

const Register = () => {
    const theme = useTheme();
    const belowMediumScreenSize = useMediaQuery(theme.breakpoints.down("md"));
    const context = React.useContext(AuthContext);
    const { disableFormContent, queueStatus, clearQueueStatus, notification, confirmation, closeNotification, closeConfirmation } = context;
    const { submitForm, handleChange } = context.register.actions;
    const { email } = context.register.data;
    const { loadingButton } = context.register;

    // System status state - fetched from backend
    const [systemStatus, setSystemStatus] = React.useState<SystemStatus | null>(null);
    const [loadingStatus, setLoadingStatus] = React.useState<boolean>(true);
    const [statusError, setStatusError] = React.useState<string | null>(null);
    const [refreshing, setRefreshing] = React.useState<boolean>(false);

    // State for form fields
    const [selectedCollege, setSelectedCollege] = React.useState<string>("");
    const [selectedCourse, setSelectedCourse] = React.useState<string>("");
    const [availableCourses, setAvailableCourses] = React.useState<string[]>([]);
    const [availableCampuses, setAvailableCampuses] = React.useState<string[]>([]);
    const [selectedCampus, setSelectedCampus] = React.useState<string>("");
    const [selectedCampusToTakeExam, setSelectedCampusToTakeExam] = React.useState<string>("");

    // Fetch system status on mount and periodically
    const fetchSystemStatus = React.useCallback(async (isRefresh = false) => {
        try {
            if (isRefresh) {
                setRefreshing(true);
                SystemConfigService.clearCache();
            } else {
                setLoadingStatus(true);
            }
            setStatusError(null);
            
            const status = await SystemConfigService.getSystemStatus(isRefresh);
            setSystemStatus(status);
        } catch (error) {
            console.error('Failed to fetch system status:', error);
            setStatusError('Unable to check registration availability. Please refresh.');
        } finally {
            setLoadingStatus(false);
            setRefreshing(false);
        }
    }, []);

    React.useEffect(() => {
        fetchSystemStatus();
        
        // Add jitter (randomness) to refresh interval to prevent thundering herd
        // With 10k-20k visitors, synchronized refreshes can overload the server
        // Base: 60s, Jitter: ±15s = 45-75s random interval per user
        const baseInterval = 60000; // 60 seconds
        const jitter = Math.random() * 30000 - 15000; // ±15 seconds
        const refreshInterval = baseInterval + jitter;
        
        const interval = setInterval(() => {
            fetchSystemStatus(true);
        }, refreshInterval);

        return () => clearInterval(interval);
    }, [fetchSystemStatus]);

    // Derived state from system status (used for conditional rendering)
    const withinBusinessHours = systemStatus?.withinBusinessHours ?? false;
    const areSlotsFull = systemStatus?.areSlotsFull ?? true;
    const isHolidayBreak = systemStatus?.isHolidayBreak ?? false;
    const isLastDayOfRegistration = systemStatus?.isLastDayOfRegistration ?? false;

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

    const handleRefreshStatus = () => {
        fetchSystemStatus(true);
    };

    const [tooltipOpen1, setTooltipOpen1] = React.useState(false);
    const defaultDate = dayjs('2006-01-01'); // Set default date

    // Loading state
    if (loadingStatus) {
        return (
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
                <Paper sx={{ width: { xs: "100%", sm: "500px", md: "60%" }, maxWidth: "700px", borderRadius: { xs: 0, sm: 2 }, p: 4 }}>
                    <LinearProgress sx={{ mb: 3 }} />
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                        <CircularProgress size={48} />
                        <Typography variant="body1" color="textSecondary">
                            Checking registration availability...
                        </Typography>
                    </Box>
                    <Box sx={{ mt: 3 }}>
                        <Skeleton variant="rectangular" height={60} sx={{ borderRadius: 2, mb: 2 }} />
                        <Skeleton variant="rectangular" height={60} sx={{ borderRadius: 2, mb: 2 }} />
                        <Skeleton variant="rectangular" height={60} sx={{ borderRadius: 2 }} />
                    </Box>
                </Paper>
            </Box>
        );
    }

    // Error state
    if (statusError) {
        return (
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
                <Paper sx={{ width: { xs: "100%", sm: "500px", md: "60%" }, maxWidth: "700px", borderRadius: { xs: 0, sm: 2 }, p: 4 }}>
                    <Alert 
                        severity="error"
                        action={
                            <Button color="inherit" size="small" onClick={handleRefreshStatus} startIcon={<Refresh />}>
                                Retry
                            </Button>
                        }
                    >
                        {statusError}
                    </Alert>
                </Paper>
            </Box>
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
                <Paper sx={{ width: { xs: "100%", sm: "500px", md: "60%" }, maxWidth: "700px", borderRadius: { xs: 0, sm: 2 }, position: 'relative', overflow: 'hidden' }}>
                    {refreshing && <LinearProgress sx={{ position: 'absolute', top: 0, left: 0, right: 0 }} />}
                    {(isLastDayOfRegistration)
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
                            <Typography variant="body1" component={"p"} color="initial">The Admission Portal is officially closed. For further updates and information, please visit the CHMSU Official Page on Facebook: <a href="https://www.facebook.com/@chmsuofficialpage">CHMSU Official Page</a></Typography>
                        </Box>
                    ) 
                    :(isHolidayBreak)
                            ? (
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        padding: { xs: 2, sm: 4 },
                                        gap: 1,
                                        width: "100%",
                                    }}
                                >
                                    
                                    <Typography variant="body1" color="initial">Holiday Advisory: Admission Portal Closure</Typography>
                                    <Typography variant="body1" color="initial">Dear Users,</Typography>
                                    <Typography variant="body1" color="initial">{systemStatus?.messages?.holiday || 'The Admission Portal is temporarily unavailable.'}</Typography>
                                    <Typography variant="body1" color="initial">Thank you for your understanding.</Typography>
                                    <Button 
                                        variant="outlined" 
                                        startIcon={<Refresh />} 
                                        onClick={handleRefreshStatus}
                                        disabled={refreshing}
                                        sx={{ mt: 2 }}
                                    >
                                        Check Status
                                    </Button>
                                </Box>
                            )
                            :(withinBusinessHours)
                                ? (areSlotsFull)
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
                                            <Typography variant="body1" component={"p"} color="initial">
                                                {systemStatus?.messages?.slotsFull || "We're sorry to inform you that the daily reservation limit has been reached. Registration will reopen at 8:00 AM. Thank you for your patience and understanding."}
                                            </Typography>
                                        </Box>
                                    ) 
                                    :(
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
                                                            {systemStatus?.examVenues
                                                                ?.filter(venue => venue.available)
                                                                .map((venue) => (
                                                                    <MenuItem key={venue.name} value={venue.name} sx={{ whiteSpace: "normal" }}>
                                                                        {venue.name === "Talisay" ? `${venue.name} (Main) Campus` : `${venue.name} Campus`}
                                                                    </MenuItem>
                                                                )) || (
                                                                <>
                                                                    <MenuItem value="Alijis" sx={{ whiteSpace: "normal" }}>Alijis Campus</MenuItem>
                                                                    <MenuItem value="Binalbagan" sx={{ whiteSpace: "normal" }}>Binalbagan Campus</MenuItem>
                                                                    <MenuItem value="Fortune Towne" sx={{ whiteSpace: "normal" }}>Fortune Towne Campus</MenuItem>
                                                                    <MenuItem value="Talisay" sx={{ whiteSpace: "normal" }}>Talisay (Main) Campus</MenuItem>
                                                                </>
                                                            )}
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
                                        <Typography variant="body1" component={"p"} color="initial">The system is currently unavailable. Registration will reopen at 8:00 AM. Thank you for your patience and understanding.</Typography>
                                    </Box>
                                )
                    }
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