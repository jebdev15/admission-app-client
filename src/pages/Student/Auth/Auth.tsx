import React from 'react'
import { Person } from '@mui/icons-material'
import { Box, FormControl, Paper, TextField, Typography, Button, Divider, Dialog, DialogTitle, DialogContent, SelectChangeEvent, Select, InputLabel, MenuItem, Alert, AlertTitle } from '@mui/material'
import { AuthContext } from '../../../context/Auth/AuthContext'
import CustomCircularProgress from '../../../components/CustomCircularProgress'
import campusesJson from '../campuses.json';
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
const data: Data = campusesJson ;
const DataPrivacyPolicyModal = () => {
    const { open, setAgreed } = React.useContext(AuthContext)
    return(
    <Dialog
        open={open}
        maxWidth="sm"
        fullWidth
      >
      <DialogTitle>CHMSU Data Privacy Policy</DialogTitle>
      <DialogContent>
            <Typography color="primary.main" fontWeight={500} textTransform="uppercase">
            Who we are
            </Typography>
            <Typography variant="caption">
            {" "}
            Carlos Hilado Memorial State University is a GREEN university committed to
            empower learners through academic excellence, relevant research, active
            community engagement, and good governance in order to build a just and
            sustainable world. The Office of the Guidance Services, the office
            spearheading the Carlos Hilado Memorial State University Entrance Test
            (CHMSUET), is one with this mission and seeks to deliver quality services
            to all its clientele.
            </Typography>
            <Divider />
            <Typography color="primary.main" fontWeight={500} textTransform="uppercase">
            What information we collect and how
            </Typography>
            <Typography variant="caption">
            {" "}
            The information we collect via the website may include: <br />
            1. Personal details - Any personal details you knowingly provide us
            through forms and our email, such as name, address, telephone number, etc.
            Under no circumstances will we hold sensitive payment details such as your
            credit/debit card number, expiry date and security code. <br />
            2. IP Address - This is a string of numbers unique to your computer that
            is recorded by our web server when you request any page or component on
            the website. This information is used to monitor your usage of the
            website. <br />
            3. Preferred settings – The website will record data which allows us to
            recognize you and your preferred settings. This saves you from re-entering
            information on return visits to the site. Such data is recorded locally on
            your computer through the use of cookies. Most browsers can be programmed
            to reject or warn you before downloading cookies. Information regarding
            this may be found in your browser’s help facility.
            </Typography>
            <Divider />
            <Typography color="primary.main" fontWeight={500} textTransform="uppercase">
            What we do with your information
            </Typography>
            <Typography variant="caption">
            {" "}
            Any personal information we collect from this website will be used in
            accordance with the Republic Act 10173 – Data Privacy Act of 2012 and
            other applicable laws. Specifically, the details we collect will be used
            to: <br />
            1. process your request for taking the university’s pre-admissions test,
            CHMSUET, and to provide the information required by the Commission on
            Higher Education (CHED) for billing and related purposes under the
            REPUBLIC ACT No. 10687 or CHED UNIFAST Law; and <br />
            2. carry out certain activities such as processing and sorting data,
            monitoring how customers use the Website and issuing our e-mails for us.
            Third parties may be asked to do this but will not be allowed to use your
            personal information for their own purposes. We may need to pass the
            information we collect to authorized persons under the student admission
            and screening committee.
            </Typography>
            <Divider />
            <Typography color="primary.main" fontWeight={500} textTransform="uppercase">
            Your Rights
            </Typography>
            <Typography variant="caption">
            {" "}
            You have the right to request a copy of any information that we currently
            hold about you. In order to receive such information, please send your
            contact details and address using our support form. Further instructions
            will be given.
            </Typography>
            <Divider />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button variant='contained' onClick={setAgreed}>Agree & Continue</Button>
            </Box>
      </DialogContent>
    </Dialog>
    )
}

const Register = () => {
    const context = React.useContext(AuthContext)
    const { disableFormContent } = context
    const { submitForm, handleChange } = context.register.actions
    const { email } = context.register.data
    const { loadingButton } = context.register

    const [selectedCampus, setSelectedCampus] = React.useState<string>('');
    const [selectedCampusToTakeExam, setSelectedCampusToTakeExam] = React.useState<string>('');
    const [selectedCollege, setSelectedCollege] = React.useState<string>('');
    const [selectedCourse, setSelectedCourse] = React.useState<string>('');

    const handleCampusChange = (event: SelectChangeEvent<string>) => {
        setSelectedCampus(event.target.value);
        setSelectedCollege('');  // Reset the selected college when campus changes
        setSelectedCourse('');   // Reset the selected course when campus changes
    };

    const handleCampusToTakeExamChange = (event: SelectChangeEvent<string>) => {
        setSelectedCampusToTakeExam(event.target.value);
    };

    const handleCollegeChange = (event: SelectChangeEvent<string>) => {
        setSelectedCollege(event.target.value);
        setSelectedCourse('');   // Reset the selected course when college changes
    };

    const handleCourseChange = (event: SelectChangeEvent<string>) => {
        setSelectedCourse(event.target.value);
    };

    const campuses = Object.keys(data); // Extract the list of campuses

    // Get the list of colleges based on the selected campus
    const colleges = selectedCampus ? data[selectedCampus].colleges : [];

    // Get the list of courses based on the selected college
    const courses = selectedCollege ? colleges.find(c => c.college_code === selectedCollege)?.courses || [] : [];
    const selectedCollegeDescription = selectedCollege ? data[selectedCampus].colleges.find(c => c.college_code === selectedCollege)?.college_description : '';
    const selectCourseDescription = selectedCourse ? courses.find(c => c.course_code === selectedCourse)?.course_description : '';
    
    return (
        <React.Suspense fallback={<CustomCircularProgress />}>
            <Box
                sx={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    height: '100dvh',
                    width: '100%',
                    padding: '1rem',
                    gap: 1
                }}
            >
                <Paper>
                    <Box
                        component="form"
                        sx={{ 
                            display: 'flex', 
                            flexDirection: 'column',
                            justifyContent: 'center', 
                            alignItems: 'center', 
                            minWidth: '500px',
                            padding: '1rem',
                            gap: 1
                        }}
                        onSubmit={submitForm}
                    >
                    <Typography variant="h5" color="primary">Welcome to CHMSU ADMISSION SYSTEM</Typography>
                    <Alert severity="info" sx={{ width: '100%', padding: 0 }}>
                        <AlertTitle>Information</AlertTitle>
                        <ul>
                            <li>Please fill up the form below</li>
                            <li>Use your active email address</li>
                        </ul>
                        <Typography variant="caption" color="initial"></Typography>
                    </Alert> 
                    <Person sx={{ color: 'primary.main' }} />
                    <Typography variant="body1" color="primary">Registration Form</Typography>
                        <FormControl fullWidth>
                            <TextField
                                name="email"
                                label="Email Address"
                                type="email"
                                value={email}
                                onChange={handleChange}
                                variant="standard"
                                disabled={disableFormContent}
                            />
                        </FormControl>
                        {/* Campus Select */}
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="campus-label">Campus To Enroll</InputLabel>
                            <Select
                                labelId="campus-label"
                                name='campus_to_enroll'
                                value={selectedCampus}
                                onChange={handleCampusChange}
                                label="Campus"
                                variant="standard"
                                required
                            >
                            {campuses.map((campus) => (
                                <MenuItem key={campus} value={campus}>
                                {campus}
                                </MenuItem>
                            ))}
                            </Select>
                        </FormControl>
                        {/* Campus Select */}
                        <FormControl fullWidth margin="normal">
                                <InputLabel id="campus-t-take-exam-label">Campus To Take Exam</InputLabel>
                                <Select
                                    labelId="campus-t-take-exam-label"
                                    name='campus_to_take_exam'
                                    value={selectedCampusToTakeExam}
                                    onChange={handleCampusToTakeExamChange}
                                    label="Campus"
                                    variant="standard"
                                    required
                                >
                                {campuses.map((campus) => (
                                    <MenuItem key={campus} value={campus}>
                                    {campus}
                                    </MenuItem>
                                ))}
                                </Select>
                            </FormControl>
                        {/* College Select */}
                        <FormControl fullWidth margin="normal" disabled={!selectedCampus}>
                            <InputLabel id="college-label">College</InputLabel>
                            <Select
                                labelId="college-label"
                                value={selectedCollege}
                                onChange={handleCollegeChange}
                                label="College"
                                variant="standard"
                                required
                            >
                            {colleges.map((college) => (
                                <MenuItem key={college.college_code} value={college.college_code}>
                                {college.college_description}
                                </MenuItem>
                            ))}
                            </Select>
                            <TextField
                                name="college_description"
                                value={selectedCollegeDescription}
                                variant="standard"
                                sx={{ display: 'none' }}
                            />
                        </FormControl>

                        {/* Course Select */}
                        <FormControl fullWidth margin="normal" disabled={!selectedCollege}>
                            <InputLabel id="course-label">Course</InputLabel>
                            <Select
                                labelId="course-label"
                                value={selectedCourse}
                                onChange={handleCourseChange}
                                label="Course"
                                variant="standard"
                                required
                            >
                            {courses.map((course) => (
                                <MenuItem key={course.course_code} value={course.course_code}>
                                {course.course_description}
                                </MenuItem>
                            ))}
                            </Select>
                            <TextField
                                name="course_description"
                                value={selectCourseDescription}
                                variant="standard"
                                sx={{ display: 'none' }}
                            />
                        </FormControl>
                        <FormControl fullWidth>
                        <Button 
                        type='submit'
                        variant="outlined" 
                        color="primary" 
                        disabled={disableFormContent || !email || !selectedCampus || !selectedCollege || !selectedCourse || loadingButton} 
                        fullWidth>
                            Register
                        </Button>
                        </FormControl>
                    </Box>
                </Paper>
            </Box>
            <DataPrivacyPolicyModal />
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