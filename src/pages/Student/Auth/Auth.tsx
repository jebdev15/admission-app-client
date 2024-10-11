import React from 'react'
import { AccountCircle, ArrowBack, Lock as LockIcon, Person, Visibility, VisibilityOff, Email as EmailIcon } from '@mui/icons-material'
import { Box, FormControl, InputAdornment, Paper, TextField, Typography, Button, Divider, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, IconButton, Tooltip } from '@mui/material'
import { AuthContext } from '../../../context/Auth/AuthContext'

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
      </DialogContent>
      <DialogActions>
        <Button onClick={setAgreed}>Agree & Continue</Button>
      </DialogActions>
    </Dialog>
    )
}

const Register = () => {
    const context = React.useContext(AuthContext)
    const { disableFormContent, changeFormToLogin } = context
    const { passwordVisibility } = context.register
    const { togglePasswordVisibility, submitForm, handleChange } = context.register.actions
    const { firstName, middleName, lastName, email, password } = context.register.data
    return (
        <React.Suspense fallback={<CircularProgress />}>
            <Box
                sx={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    height: '100dvh',
                    padding: '1rem',
                    gap: 1
                }}
            >
                <Paper>
                    <IconButton aria-label="" onClick={changeFormToLogin}>
                        <ArrowBack />
                    </IconButton>
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
                    <Person />
                    <Typography variant="body1" color="initial">Registration Form</Typography>
                        <FormControl fullWidth>
                            <TextField
                                name="firstName"
                                label="First Name"
                                type="text"
                                value={firstName}
                                onChange={handleChange}
                                variant="standard"
                                slotProps={{ 
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <AccountCircle />
                                            </InputAdornment>
                                        )
                                    }
                                }}
                                disabled={disableFormContent}
                            />
                        </FormControl>
                        <FormControl fullWidth>
                            <TextField
                                name="middleName"
                                label="Middle Name"
                                type="text"
                                value={middleName}
                                onChange={handleChange}
                                variant="standard"
                                slotProps={{ 
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <AccountCircle />
                                            </InputAdornment>
                                        )
                                    }
                                }}
                                disabled={disableFormContent}
                            />
                        </FormControl>
                        <FormControl fullWidth>
                            <TextField
                                name="lastName"
                                label="Last Name"
                                type="text"
                                value={lastName}
                                onChange={handleChange}
                                variant="standard"
                                slotProps={{ 
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <AccountCircle />
                                            </InputAdornment>
                                        )
                                    }
                                }}
                                disabled={disableFormContent}
                            />
                        </FormControl>
                        <FormControl fullWidth>
                            <TextField
                                name="email"
                                label="Email Address"
                                type="email"
                                value={email}
                                onChange={handleChange}
                                variant="standard"
                                slotProps={{ 
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <EmailIcon />
                                            </InputAdornment>
                                        )
                                    }
                                }}
                                disabled={disableFormContent}
                            />
                        </FormControl>
                        <FormControl fullWidth>
                            <TextField
                                name="password"
                                label="Password"
                                type={passwordVisibility ? 'text' : 'password'}
                                value={password}
                                onChange={handleChange}
                                variant="standard"
                                slotProps={{ 
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LockIcon />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <Tooltip title={passwordVisibility ? "hide password" : "show password"}>
                                                    <IconButton aria-label="" onClick={togglePasswordVisibility}>
                                                        {passwordVisibility ? <Visibility /> : <VisibilityOff />}
                                                    </IconButton>
                                                </Tooltip>
                                            </InputAdornment>
                                        )
                                    }
                                }}
                                disabled={disableFormContent}
                            />
                        </FormControl>
                        <FormControl fullWidth>
                        <Button 
                        type='submit'
                        variant="contained" 
                        color="primary" 
                        disabled={disableFormContent || !email || !password || !firstName || !lastName } 
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
const Login = () => {
    const context = React.useContext(AuthContext)
    const { disableFormContent, changeFormToRegister } = context
    const { passwordVisibility, data, actions } = context.login
    const { email, password } = data
    const { handleChange, submitForm, togglePasswordVisibility } = actions
    return (
        <React.Suspense fallback={<CircularProgress />}>
            <Box
                sx={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    height: '100dvh',
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
                    <Person />
                    <Typography variant="body1" color="initial">Log In</Typography>
                        <FormControl fullWidth>
                            <TextField
                                name="email"
                                label="Email Address"
                                type="email"
                                value={email}
                                variant="standard"
                                onChange={handleChange}
                                slotProps={{ 
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <EmailIcon />
                                            </InputAdornment>
                                        )
                                    }
                                }}
                                disabled={disableFormContent}
                            />
                        </FormControl>
                        <FormControl fullWidth>
                            <TextField
                                name="password"
                                label="Password"
                                type={passwordVisibility ? 'text' : 'password'}
                                value={password}
                                variant="standard"
                                onChange={handleChange}
                                slotProps={{ 
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LockIcon />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <Tooltip title={passwordVisibility ? "hide password" : "show password"}>
                                                    <IconButton aria-label="" onClick={togglePasswordVisibility}>
                                                        {passwordVisibility ? <Visibility /> : <VisibilityOff />}
                                                    </IconButton>
                                                </Tooltip>
                                            </InputAdornment>
                                        )
                                    }
                                }}
                                disabled={disableFormContent}
                            />
                        </FormControl>
                        <FormControl fullWidth>
                        <Button 
                            type='submit' 
                            variant="contained" 
                            color="primary" 
                            disabled={disableFormContent || !email || !password} 
                            fullWidth
                        >
                            Log in
                        </Button>
                        <Divider>or</Divider>
                        <Button 
                            variant="text" 
                            color="primary" 
                            disabled={disableFormContent} 
                            onClick={changeFormToRegister}
                            fullWidth
                        >
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
    const { defaultForm } = React.useContext(AuthContext)
    return (
        <React.Suspense fallback={<CircularProgress />}>
            {defaultForm ? <Login /> : <Register />}
        </React.Suspense>
    )
}

export default Authentication