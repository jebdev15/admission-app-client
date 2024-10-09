import React from 'react'
import { AccountCircle, Lock as LockIcon, Person } from '@mui/icons-material'
import { Box, FormControl, InputAdornment, Paper, TextField, Typography, Button, Divider, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress } from '@mui/material'
import { LoginContext } from '../../../context/Login/LoginContext'

const DataPrivacyPolicyModal = () => {
    const { open, setAgreed } = React.useContext(LoginContext)
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
const Login = () => {
    const { agreed, openModal } = React.useContext(LoginContext)
    const disableFormContent = agreed ? false : true
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
                    >
                    <Person />
                    <Typography variant="body1" color="initial">Log In</Typography>
                        <FormControl fullWidth>
                            <TextField
                                name="email"
                                label="Email Address"
                                type="email"
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
                                name="password"
                                label="Password"
                                variant="standard"
                                slotProps={{ 
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LockIcon />
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
                        disabled={disableFormContent} 
                        fullWidth>
                            Log in
                        </Button>
                        <Divider>or</Divider>
                        <Button 
                        variant="text" 
                        color="primary" 
                        onClick={openModal}
                        disabled={disableFormContent} 
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

export default Login