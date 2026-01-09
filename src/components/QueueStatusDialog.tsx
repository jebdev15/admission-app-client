/**
 * QueueStatusDialog Component
 * Displays real-time queue status for form submissions
 */

import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    Box,
    Typography,
    LinearProgress,
    CircularProgress,
    Alert,
    Button,
    Chip,
    Stepper,
    Step,
    StepLabel,
} from '@mui/material';
import {
    CheckCircle,
    Error,
    HourglassEmpty,
    CloudUpload,
    Schedule,
} from '@mui/icons-material';
import { JobStatus, QueueResponse } from '@services/submissionService';

interface QueueStatusDialogProps {
    open: boolean;
    onClose: () => void;
    status: JobStatus | QueueResponse | null;
    onComplete?: () => void;
}

const QueueStatusDialog: React.FC<QueueStatusDialogProps> = ({
    open,
    onClose,
    status,
    onComplete,
}) => {
    const getStatusStep = () => {
        if (!status) return 0;
        
        if ('status' in status) {
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
        }
        
        // QueueResponse (initial submission)
        if (status.success && status.jobId) {
            return 1;
        }
        return 0;
    };

    const getStatusIcon = () => {
        if (!status) return <CircularProgress size={48} />;

        if ('status' in status) {
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
        }

        // QueueResponse
        if (status.success) {
            return <CloudUpload sx={{ fontSize: 48, color: 'info.main' }} />;
        }
        return <Error sx={{ fontSize: 48, color: 'error.main' }} />;
    };

    const getStatusMessage = () => {
        if (!status) return 'Submitting...';

        if ('status' in status) {
            switch (status.status) {
                case 'pending':
                    return `Your submission is queued. Position: ${status.position || 'N/A'}`;
                case 'processing':
                    return 'Your submission is being processed...';
                case 'completed':
                    return status.result?.message || 'Submission completed successfully!';
                case 'failed':
                    return status.error || 'Submission failed. Please try again.';
                default:
                    return 'Processing...';
            }
        }

        // QueueResponse
        if (status.success) {
            return `Submission queued! Position: ${status.position || 'N/A'}. Estimated wait: ${status.estimatedWaitTime || 0}s`;
        }
        return status.message || 'An error occurred';
    };

    const isComplete = status && 'status' in status && 
        (status.status === 'completed' || status.status === 'failed');
    const isSuccess = status && 'status' in status && status.status === 'completed';

    const steps = ['Submitted', 'Queued', 'Processing', 'Complete'];

    return (
        <Dialog
            open={open}
            onClose={isComplete ? onClose : undefined}
            maxWidth="sm"
            fullWidth
            disableEscapeKeyDown={!isComplete}
        >
            <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
                <Typography variant="h5" component="div">
                    Submission Status
                </Typography>
            </DialogTitle>
            <DialogContent>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 3,
                        py: 2,
                    }}
                >
                    {/* Status Icon */}
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            p: 2,
                            borderRadius: '50%',
                            bgcolor: isSuccess ? 'success.light' : 
                                     (status && 'status' in status && status.status === 'failed') ? 'error.light' : 
                                     'grey.100',
                        }}
                    >
                        {getStatusIcon()}
                    </Box>

                    {/* Progress Stepper */}
                    <Stepper activeStep={getStatusStep()} alternativeLabel sx={{ width: '100%' }}>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>

                    {/* Status Message */}
                    <Typography
                        variant="body1"
                        textAlign="center"
                        color={isSuccess ? 'success.main' : 
                               (status && 'status' in status && status.status === 'failed') ? 'error.main' : 
                               'text.primary'}
                    >
                        {getStatusMessage()}
                    </Typography>

                    {/* Job Info */}
                    {status && (
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
                            {status.jobId && (
                                <Chip
                                    icon={<Schedule />}
                                    label={`Job ID: ${status.jobId.slice(0, 8)}...`}
                                    size="small"
                                    variant="outlined"
                                />
                            )}
                            {'position' in status && status.position && (
                                <Chip
                                    icon={<HourglassEmpty />}
                                    label={`Queue Position: ${status.position}`}
                                    size="small"
                                    color="info"
                                />
                            )}
                            {'estimatedWaitTime' in status && status.estimatedWaitTime && (
                                <Chip
                                    label={`Est. Wait: ${status.estimatedWaitTime}s`}
                                    size="small"
                                    color="warning"
                                />
                            )}
                        </Box>
                    )}

                    {/* Progress Bar for processing */}
                    {status && 'status' in status && status.status === 'processing' && (
                        <Box sx={{ width: '100%' }}>
                            <LinearProgress />
                        </Box>
                    )}

                    {/* Alert for success/failure */}
                    {isComplete && (
                        <Alert 
                            severity={isSuccess ? 'success' : 'error'}
                            sx={{ width: '100%' }}
                        >
                            {isSuccess 
                                ? 'Your application has been submitted successfully!' 
                                : 'Failed to process your submission. Please try again.'}
                        </Alert>
                    )}

                    {/* Action Buttons */}
                    {isComplete && (
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            {isSuccess && onComplete && (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => {
                                        onComplete();
                                        onClose();
                                    }}
                                >
                                    Continue
                                </Button>
                            )}
                            <Button
                                variant={isSuccess ? 'outlined' : 'contained'}
                                color={isSuccess ? 'primary' : 'error'}
                                onClick={onClose}
                            >
                                {isSuccess ? 'Close' : 'Try Again'}
                            </Button>
                        </Box>
                    )}

                    {/* Info text */}
                    {!isComplete && (
                        <Typography variant="caption" color="text.secondary" textAlign="center">
                            Please wait while we process your submission.<br/>
                            Do not close this window or refresh the page.
                        </Typography>
                    )}
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default QueueStatusDialog;
