/**
 * RegistrationQueueDialog Component
 * Displays real-time queue status during registration
 */

import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogActions,
    Box,
    Typography,
    LinearProgress,
    CircularProgress,
    Alert,
    Stepper,
    Step,
    StepLabel,
    Button,
} from '@mui/material';
import {
    CheckCircle,
    Error,
    HourglassEmpty,
    CloudUpload,
} from '@mui/icons-material';
import { JobStatusResponse } from '@services/authService';

interface RegistrationQueueDialogProps {
    open: boolean;
    status: JobStatusResponse | null;
    onClose?: () => void;
}

const RegistrationQueueDialog: React.FC<RegistrationQueueDialogProps> = ({
    open,
    status,
    onClose,
}) => {
    /**
     * Handle dialog close with optional page refresh
     * Refreshes the page if backend indicates shouldRefresh (e.g., slots full, successful registration)
     */
    const handleClose = () => {
        if (onClose) {
            onClose();
        }
        // Check if backend indicates page should refresh
        if (status?.shouldRefresh) {
            window.location.reload();
        }
    };
    const getStatusStep = () => {
        if (!status) return 0;
        
        switch (status.status) {
            case 'pending':
                return 1;
            case 'processing':
                return 2;
            case 'completed':
                return 3;
            case 'failed':
                return 3;
            default:
                return 0;
        }
    };

    const getStatusIcon = () => {
        if (!status) return <CircularProgress size={48} />;

        switch (status.status) {
            case 'pending':
                return <HourglassEmpty sx={{ fontSize: 48, color: 'warning.main' }} />;
            case 'processing':
                return <CircularProgress size={48} />;
            case 'completed':
                return <CheckCircle sx={{ fontSize: 48, color: 'success.main' }} />;
            case 'failed':
                return <Error sx={{ fontSize: 48, color: 'error.main' }} />;
            default:
                return <CircularProgress size={48} />;
        }
    };

    const getStatusMessage = () => {
        if (!status) return 'Submitting...';

        switch (status.status) {
            case 'pending':
                return status.position 
                    ? `Your registration is queued. Position: ${status.position}`
                    : 'Your registration is being queued...';
            case 'processing':
                return 'Processing your registration...';
            case 'completed':
                return status.message || 'Registration successful!';
            case 'failed':
                return status.message || 'Registration failed. Please try again.';
            default:
                return 'Processing...';
        }
    };

    const getEstimatedTime = () => {
        if (!status?.estimatedWaitTime) return null;
        
        const seconds = Math.ceil(status.estimatedWaitTime);
        if (seconds < 60) {
            return `~${seconds} seconds`;
        }
        const minutes = Math.ceil(seconds / 60);
        return `~${minutes} minute${minutes > 1 ? 's' : ''}`;
    };

    const steps = ['Submitted', 'Queued', 'Processing', 'Complete'];

    return (
        <Dialog 
            open={open} 
            maxWidth="sm" 
            fullWidth
            disableEscapeKeyDown
            onClose={() => {}} // Prevent closing during processing
        >
            <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
                Registration Status
            </DialogTitle>
            <DialogContent>
                <Box sx={{ py: 2 }}>
                    {/* Status Icon */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                        {getStatusIcon()}
                    </Box>

                    {/* Status Message */}
                    <Typography 
                        variant="h6" 
                        align="center" 
                        sx={{ mb: 2 }}
                        color={status?.status === 'failed' ? 'error' : 'textPrimary'}
                    >
                        {getStatusMessage()}
                    </Typography>

                    {/* Estimated Time */}
                    {status?.status === 'pending' && getEstimatedTime() && (
                        <Typography 
                            variant="body2" 
                            align="center" 
                            color="textSecondary"
                            sx={{ mb: 2 }}
                        >
                            Estimated wait time: {getEstimatedTime()}
                        </Typography>
                    )}

                    {/* Progress Stepper */}
                    <Stepper activeStep={getStatusStep()} alternativeLabel sx={{ mb: 3 }}>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>

                    {/* Progress Bar for pending/processing */}
                    {(status?.status === 'pending' || status?.status === 'processing') && (
                        <LinearProgress 
                            variant={status?.status === 'processing' ? 'indeterminate' : 'determinate'}
                            value={status?.status === 'pending' ? 50 : undefined}
                            sx={{ mb: 2, height: 8, borderRadius: 4 }}
                        />
                    )}

                    {/* Info Alert */}
                    {status?.status === 'pending' && (
                        <Alert severity="info" sx={{ mt: 2 }}>
                            Please don't close this window. Your registration is being processed.
                            {status.position && status.position > 10 && (
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                    There are many registrations being processed. Thank you for your patience!
                                </Typography>
                            )}
                        </Alert>
                    )}

                    {status?.status === 'processing' && (
                        <Alert severity="info" sx={{ mt: 2 }}>
                            Almost there! Your registration is now being processed.
                        </Alert>
                    )}

                    {status?.status === 'completed' && (
                        <Alert severity="success" sx={{ mt: 2 }}>
                            <CloudUpload sx={{ mr: 1, verticalAlign: 'middle' }} />
                            Your registration was successful! Please check your email for the next steps.
                        </Alert>
                    )}

                    {status?.status === 'failed' && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {status.message || 'Registration failed. Please try again.'}
                        </Alert>
                    )}
                </Box>
            </DialogContent>
            
            {/* Close button for completed/failed states */}
            {(status?.status === 'completed' || status?.status === 'failed') && (
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button 
                        variant="contained" 
                        color={status?.status === 'completed' ? 'success' : 'primary'}
                        onClick={handleClose}
                        fullWidth
                    >
                        {status?.status === 'completed' ? 'Done' : 'Close'}
                    </Button>
                </DialogActions>
            )}
        </Dialog>
    );
};

export default RegistrationQueueDialog;
