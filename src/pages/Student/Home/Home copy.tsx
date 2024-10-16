import { Box, Button, CircularProgress, Paper, Step, StepContent, StepLabel, Stepper, Typography } from '@mui/material'
import React from 'react'

const steps = [
  {
    label: 'Personal Information',
    description: `For each ad campaign that you create, you can control how much
              you're willing to spend on clicks and conversions, which networks
              and geographical locations you want your ads to show on, and more.`,
  },
  {
    label: 'Address Details',
    description:
      'An ad group contains one or more ads which target a shared set of keywords.',
  },
  {
    label: 'Parent Profile',
    description:
      'An ad group contains one or more ads which target a shared set of keywords.',
  },
  {
    label: 'Family Background',
    description:
      'An ad group contains one or more ads which target a shared set of keywords.',
  },
  {
    label: 'Health',
    description: `Try out different ad text to see what brings in the most customers,
              and learn how to enhance your ads using features like ad extensions.
              If you run into any problems with your ads, find out how to tell if
              they're running and how to resolve approval issues.`,
  },
];
const Home = () => {
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };
  return (
    <React.Suspense fallback={<CircularProgress />}>
      <Box
        sx={{ 
          height: '100dvh',
          display: 'flex',
          gap: 1,
         }}
      >
        <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper', padding: 2 }}>
          <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel
                optional={
                  index === steps.length - 1 ? (
                    <Typography variant="caption">Last step</Typography>
                  ) : null
                }
              >
                {step.label}
              </StepLabel>
              <StepContent>
                <Typography>{step.description}</Typography>
                <Box sx={{ mb: 2 }}>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    {index === steps.length - 1 ? 'Finish' : 'Continue'}
                  </Button>
                  <Button
                    disabled={index === 0}
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Back
                  </Button>
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>
        {activeStep === steps.length && (
          <Paper square elevation={0} sx={{ p: 3 }}>
            <Typography>All steps completed - you&apos;re finished</Typography>
            <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
              Reset
            </Button>
          </Paper>
        )}
        </Box>
        <Box sx={{ 
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          width: '100%', 
          backgroundColor: 'background.paper'
        }}>
        <Box sx={{ backgroundColor: 'background.paper' }}>
          <h1>Home</h1>
        </Box>
        <Box>
          <Typography variant="body1" color="initial">Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur fugit ad tempore hic inventore, ex saepe sequi explicabo facilis, consequuntur, natus dicta totam ipsum? Veniam dolores at recusandae nam sed.</Typography>
        </Box>
        </Box>
      </Box>
    </React.Suspense>
  )
}

export default Home