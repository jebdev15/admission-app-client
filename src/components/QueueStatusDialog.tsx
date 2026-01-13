/**
 * SubmissionStatusDialog Component
 * Displays submission status for form submissions
 */

import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    Box,
    Typography,
    CircularProgress,
    Alert,
    Button,
} from '@mui/material';
import {
    CheckCircle,
    Error as ErrorIcon,
} from '@mui/icons-material';
import { SubmissionResponse } from '@services/submissionService';

interface QueueStatusDialogProps {
    open: boolean;
    onClose: () => void;
    status: SubmissionResponse | null;
    isSubmitting?: boolean;
    onComplete?: () => void;
}

const QueueStatusDialog: React.FC<QueueStatusDialogProps> = ({
    open,
    onClose,
    status,
    isSubmitting = false,
    onComplete,
}) => {
    const isComplete = !isSubmitting && status !== null;
    const isSuccess = status?.success === true;

    const getStatusIcon = () => {
        if (isSubmitting || !status) {
            return <CircularProgress size={48} />;
        }
        if (isSuccess) {
            return <CheckCircle sx={{ fontSize: 48, color: 'success.main' }} />;
        }
        return <ErrorIcon sx={{ fontSize: 48, color: 'error.main' }} />;
    };

    const getStatusMessage = () => {
        if (isSubmitting || !status) {
            return 'Submitting your application...';
        }
        return status.message || (isSuccess ? 'Submission completed successfully!' : 'Submission failed. Please try again.');
    };

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
                                     (isComplete && !isSuccess) ? 'error.light' : 
                                     'grey.100',
                        }}
                    >
                        {getStatusIcon()}
                    </Box>

                    {/* Status Message */}
                    <Typography
                        variant="body1"
                        textAlign="center"
                        color={isSuccess ? 'success.main' : 
                               (isComplete && !isSuccess) ? 'error.main' : 
                               'text.primary'}
                    >
                        {getStatusMessage()}
                    </Typography>

                    {/* Alert for success/failure */}
                    {isComplete && (
                        <Alert 
                            severity={isSuccess ? 'success' : 'error'}
                            sx={{ width: '100%' }}
                        >
                            {isSuccess 
                                ? 'Your application has been submitted successfully!' 
                                : status?.error || 'Failed to process your submission. Please try again.'}
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
