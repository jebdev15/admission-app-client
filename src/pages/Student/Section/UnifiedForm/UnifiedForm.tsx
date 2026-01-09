/**
 * Unified Form Component
 * Multi-step form that collects all data before final submission
 */

import React from 'react';
import {
    Box,
    Paper,
    Stepper,
    Step,
    StepLabel,
    Typography,
    Button,
    MobileStepper,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { useUnifiedForm, UnifiedFormProvider } from './UnifiedFormContext';
import { FORM_STEPS } from './types';
import QueueStatusDialog from '@components/QueueStatusDialog';

// Import step components
const PersonalInformationStep = React.lazy(() => import('./steps/PersonalInformationStep'));
const AddressDetailsStep = React.lazy(() => import('./steps/AddressDetailsStep'));
const ParentProfileStep = React.lazy(() => import('./steps/ParentProfileStep'));
const HomeAndFamilyBackgroundStep = React.lazy(() => import('./steps/HomeAndFamilyBackgroundStep'));
const HealthStep = React.lazy(() => import('./steps/HealthStep'));
const ImageUploadStep = React.lazy(() => import('./steps/ImageUploadStep'));
const ScheduleStep = React.lazy(() => import('./steps/ScheduleStep'));

const UnifiedFormContent: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const {
        currentStep,
        goToNextStep,
        goToPreviousStep,
        isStepValid,
        submitForm,
        isSubmitting,
        submissionStatus,
    } = useUnifiedForm();

    const [showStatusDialog, setShowStatusDialog] = React.useState(false);

    // Render current step component
    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return <PersonalInformationStep />;
            case 1:
                return <AddressDetailsStep />;
            case 2:
                return <ParentProfileStep />;
            case 3:
                return <HomeAndFamilyBackgroundStep />;
            case 4:
                return <HealthStep />;
            case 5:
                return <ImageUploadStep />;
            case 6:
                return <ScheduleStep />;
            default:
                return null;
        }
    };

    const handleNext = () => {
        if (currentStep === FORM_STEPS.length - 1) {
            // Final step - submit the form
            const confirmation = window.confirm(
                'Are you sure you want to submit your application? Please verify all information is correct before proceeding.'
            );
            if (confirmation) {
                setShowStatusDialog(true);
                submitForm();
            }
        } else {
            goToNextStep();
        }
    };

    const handleBack = () => {
        goToPreviousStep();
    };

    const isLastStep = currentStep === FORM_STEPS.length - 1;
    const canProceed = isStepValid(currentStep);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: { xs: 0, sm: 2 },
                gap: 1,
                minHeight: '100vh',
            }}
        >
            <Paper
                sx={{
                    width: '100%',
                    maxWidth: '1000px',
                    borderRadius: { xs: 0, sm: 2 },
                    overflow: 'hidden',
                }}
            >
                {/* Stepper - Desktop */}
                {!isMobile && (
                    <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
                        <Stepper activeStep={currentStep} alternativeLabel>
                            {FORM_STEPS.map((step) => (
                                <Step key={step.id}>
                                    <StepLabel>{step.title}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                    </Box>
                )}

                {/* Step Header - Mobile */}
                {isMobile && (
                    <Box
                        sx={{
                            p: 2,
                            bgcolor: 'primary.main',
                            color: 'white',
                            textAlign: 'center',
                        }}
                    >
                        <Typography variant="subtitle2">
                            Step {currentStep + 1} of {FORM_STEPS.length}
                        </Typography>
                        <Typography variant="h6">
                            {FORM_STEPS[currentStep].title}
                        </Typography>
                    </Box>
                )}

                {/* Form Content */}
                <Box sx={{ p: { xs: 2, sm: 4 } }}>
                    {renderStepContent()}
                </Box>

                {/* Navigation Buttons - Desktop */}
                {!isMobile && (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            p: 3,
                            borderTop: 1,
                            borderColor: 'divider',
                        }}
                    >
                        <Button
                            variant="outlined"
                            onClick={handleBack}
                            disabled={currentStep === 0}
                            startIcon={<KeyboardArrowLeft />}
                        >
                            Back
                        </Button>
                        <LoadingButton
                            variant="contained"
                            onClick={handleNext}
                            disabled={!canProceed}
                            loading={isSubmitting}
                            endIcon={!isLastStep && <KeyboardArrowRight />}
                            sx={{ color: 'white' }}
                        >
                            {isLastStep ? 'Submit Application' : 'Next'}
                        </LoadingButton>
                    </Box>
                )}

                {/* Mobile Stepper */}
                {isMobile && (
                    <MobileStepper
                        variant="progress"
                        steps={FORM_STEPS.length}
                        position="static"
                        activeStep={currentStep}
                        sx={{ flexGrow: 1, bgcolor: 'background.paper' }}
                        nextButton={
                            <LoadingButton
                                size="small"
                                onClick={handleNext}
                                disabled={!canProceed}
                                loading={isSubmitting}
                            >
                                {isLastStep ? 'Submit' : 'Next'}
                                {!isLastStep && <KeyboardArrowRight />}
                            </LoadingButton>
                        }
                        backButton={
                            <Button
                                size="small"
                                onClick={handleBack}
                                disabled={currentStep === 0}
                            >
                                <KeyboardArrowLeft />
                                Back
                            </Button>
                        }
                    />
                )}
            </Paper>

            {/* Queue Status Dialog */}
            <QueueStatusDialog
                open={showStatusDialog}
                onClose={() => setShowStatusDialog(false)}
                status={submissionStatus}
                onComplete={() => {
                    setShowStatusDialog(false);
                    window.location.reload();
                }}
            />
        </Box>
    );
};

// Main component wrapped with provider
const UnifiedForm: React.FC = () => {
    return (
        <UnifiedFormProvider>
            <UnifiedFormContent />
        </UnifiedFormProvider>
    );
};

export default UnifiedForm;
