import React from "react";
import { Person } from "@mui/icons-material";
import {
  Box,
  FormControl,
  Paper,
  TextField,
  Typography,
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
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
import campusesJson from "../campuses.json";
import useMediaQuery from "@mui/material/useMediaQuery";
import { LoadingButton } from "@mui/lab";
// Define types for the JSON structure
interface Course {
  course_code: string;
  course_description: string;
}

interface College {
  college_code: string;
  college_description: string;
  courses: Course[];
}

interface CampusData {
  colleges: College[];
}

interface Data {
  [campus: string]: CampusData;
}

// Sample JSON Data
const data: Data = campusesJson;
const DataPrivacyPolicyModal = () => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const { open, setAgreed } = React.useContext(AuthContext);
  return (
    <Dialog
      open={open}
      maxWidth="md"
      fullScreen={fullScreen}
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle>CHMSU Data Privacy Policy</DialogTitle>
      <DialogContent>
        <Typography color="primary.main" fontWeight={500} textTransform="uppercase">
          Who we are
        </Typography>
        <Typography variant="caption">
          {" "}
          Carlos Hilado Memorial State University is a GREEN university committed to empower learners through academic excellence, relevant research, active community engagement,
          and good governance in order to build a just and sustainable world. The Office of the Guidance Services is responsible for managing the CHMSU Addmission Test.
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Typography color="primary.main" fontWeight={500} textTransform="uppercase">
          What information we collect and how
        </Typography>
        <Typography variant="caption">
          {" "}
          The information we collect via the website may include: <br />
          <br />
          1. Personal details - Any personal details you knowingly provide us through forms and our email, such as name, address, mobile/telephone number, etc. Under no
          circumstances will we hold sensitive payment details such as your credit/debit card number, expiry date, one-time password, CVV number, and security code. <br />
          <br />
          2. IP Address - This is a string of numbers unique to your computer that our web server records when you request any page or component on the website. This information is
          used to monitor your usage of the website.
          <br />
          <br />
          3. Preferred settings – The website will record data that will allows us to recognize you and your preferred settings. This saves you from re-entering information on
          return visits to the site. Such data is recorded locally on your computer through the use of cookies. Most browsers can be programmed to reject or warn you before
          downloading cookies. Information regarding this may be found in your browser’s help facility.
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Typography color="primary.main" fontWeight={500} textTransform="uppercase">
          What we do with your information
        </Typography>
        <Typography variant="caption">
          {" "}
          Any personal information we collect from this website will be used in accordance with the Republic Act 10173 – Data Privacy Act of 2012 and other applicable laws.
          Specifically, the details we collect will be used to: <br />
          <br />
          1. Process your request for taking the university’s Admission Test, and provide the information required by the Commission on Higher Education (CHED) for billing and
          related purposes under the REPUBLIC ACT 10687 or CHED UNIFAST Law; and <br />
          <br />
          2. Carry out certain activities such as processing and sorting data, monitoring how customers use the website, and issuing our e-mails for us. Third parties may be asked
          to do this but will not be allowed to use your personal information for their purposes. We may need to pass the information we collect to authorized persons under the
          university’s student admission and screening committee.
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Typography color="primary.main" fontWeight={500} textTransform="uppercase">
          Your Rights
        </Typography>
        <Typography variant="caption">
          {" "}
          You have the right to request a copy of any information that we currently hold about you.
          <strong>
            To receive such information, please send your contact details and address using our support form. you will receive additional instructions upon submitting the support
            form.
          </strong>
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Button variant="contained" color="primary" sx={{ pt: 1, color: "white", borderRadius: 2 }} onClick={setAgreed}>
            Agree & Continue
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

const Register = () => {
  const context = React.useContext(AuthContext);
  const { disableFormContent } = context;
  const { submitForm, handleChange } = context.register.actions;
  const { email } = context.register.data;
  const { loadingButton } = context.register;

  const [selectedCampus, setSelectedCampus] = React.useState<string>("");
  const [selectedCampusToTakeExam, setSelectedCampusToTakeExam] = React.useState<string>("");
  const [selectedCollege, setSelectedCollege] = React.useState<string>("");
  const [selectedCourse, setSelectedCourse] = React.useState<string>("");

  const handleCampusChange = (event: SelectChangeEvent<string>) => {
    setSelectedCampus(event.target.value);
    setSelectedCollege(""); // Reset the selected college when campus changes
    setSelectedCourse(""); // Reset the selected course when campus changes
  };

  const handleCampusToTakeExamChange = (event: SelectChangeEvent<string>) => {
    setSelectedCampusToTakeExam(event.target.value);
  };

  const handleCollegeChange = (event: SelectChangeEvent<string>) => {
    setSelectedCollege(event.target.value);
    setSelectedCourse(""); // Reset the selected course when college changes
  };

  const handleCourseChange = (event: SelectChangeEvent<string>) => {
    setSelectedCourse(event.target.value);
  };

  const campuses = Object.keys(data); // Extract the list of campuses

  // Get the list of colleges based on the selected campus
  const colleges = selectedCampus ? data[selectedCampus].colleges : [];

  // Get the list of courses based on the selected college
  const courses = selectedCollege ? colleges.find((c) => c.college_code === selectedCollege)?.courses || [] : [];
  const selectedCollegeDescription = selectedCollege ? data[selectedCampus].colleges.find((c) => c.college_code === selectedCollege)?.college_description : "";
  const selectCourseDescription = selectedCourse ? courses.find((c) => c.course_code === selectedCourse)?.course_description : "";
  const disableButton = !email || !selectedCampus || !selectedCollege || !selectedCourse;
  const theme = useTheme();
  const belowMediumScreenSize = useMediaQuery(theme.breakpoints.down("md"));
  const [tooltipOpen1, setTooltipOpen1] = React.useState(false);
  const [tooltipOpen2, setTooltipOpen2] = React.useState(false);

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
              AY 2025-2026
            </Typography>
            <Alert severity="info" sx={{ width: "100%", p: 2, pb: 0, borderRadius: 2 }}>
              <AlertTitle>Information</AlertTitle>
              <List sx={{ pt: 0 }}>
                <ListItem sx={{ pl: 0 }}>Please fill up the form below</ListItem>
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
                  <TextField name="first_name" label="First name" placeholder="e.g. John" type="text" sx={{ "& .MuiInputBase-root": { borderRadius: 2 } }} />
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <TextField name="last_name" label="Last name" placeholder="e.g. Smith" type="text" sx={{ "& .MuiInputBase-root": { borderRadius: 2 } }} />
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker name="date_of_birth" label="Date of Birth" format="YYYY-MM-DD" sx={{ "& .MuiInputBase-root": { borderRadius: 2 } }} />
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
                  />
                </FormControl>
              </Grid>
              {/* College Select */}
              <FormControl fullWidth disabled={!selectedCampus}>
                <InputLabel id="college-label">College of choice</InputLabel>
                <Select
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
                >
                  {colleges.map((college) => (
                    <MenuItem key={college.college_code} value={college.college_code} sx={{ whiteSpace: "normal" }}>
                      {college.college_description}
                    </MenuItem>
                  ))}
                </Select>
                <TextField name="college_description" value={selectedCollegeDescription} variant="standard" sx={{ display: "none" }} />
              </FormControl>
              {/* Course Select */}
              <FormControl fullWidth disabled={!selectedCollege}>
                <InputLabel id="course-label">Program of choice</InputLabel>
                <Select
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
                >
                  {courses.map((course) => (
                    <MenuItem key={course.course_code} value={course.course_code} sx={{ whiteSpace: "normal" }}>
                      {course.course_description}
                    </MenuItem>
                  ))}
                </Select>
                <TextField name="course_description" value={selectCourseDescription} variant="outlined" sx={{ display: "none" }} />
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
                    >
                      {campuses.map((campus) => (
                        <MenuItem key={campus} value={campus} sx={{ whiteSpace: "normal" }}>
                          {campus}
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
                  {/* <Tooltip
                                            title="**You may choose the exam venue nearest you regardless of your preferred  to enroll in."
                                            open={tooltipOpen2}
                                            placement="top"
                                        > */}
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
                    onFocus={() => setTooltipOpen2(true)}
                    onBlur={() => setTooltipOpen2(false)}
                  >
                    {campuses.map((campus) => (
                      <MenuItem key={campus} value={campus} sx={{ whiteSpace: "normal" }}>
                        {campus}
                      </MenuItem>
                    ))}
                  </Select>
                  {/* </Tooltip> */}
                  <FormHelperText>**You may choose the exam venue nearest you regardless of your preferred to enroll in.</FormHelperText>
                </FormControl>
              </Grid>
              <FormControl fullWidth>
                {/* <Button
                            type='submit'
                            variant="outlined"
                            color="primary"
                            disabled={disableFormContent || !email || !selectedCampus || !selectedCollege || !selectedCourse || loadingButton}
                            fullWidth>
                                Register
                            </Button> */}
                <LoadingButton
                  type="submit" // Assigning the type property
                  variant="contained"
                  color="primary"
                  loading={loadingButton}
                  disabled={disableButton}
                  sx={{ py: 1.75, pt: 2, color: "white", borderRadius: 2 }}
                >
                  {loadingButton ? "Registering..." : "Register"}
                </LoadingButton>
              </FormControl>
            </Grid>
          </Box>
        </Paper>
      </Box>
      <DataPrivacyPolicyModal />
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
