/**
 * NotificationDialog Component
 * A unified dialog/modal for displaying notifications, alerts, and confirmations
 * Replaces all browser alert() calls for better UX
 */

import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    IconButton,
} from '@mui/material';
import {
    CheckCircle,
    Error,
    Warning,
    Info,
    Close,
} from '@mui/icons-material';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface NotificationDialogProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    message: string;
    type?: NotificationType;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
    showCancel?: boolean;
    autoClose?: number; // Auto close after X milliseconds
}

const typeConfig = {
    success: {
        icon: CheckCircle,
        color: 'success.main',
        defaultTitle: 'Success',
    },
    error: {
        icon: Error,
        color: 'error.main',
        defaultTitle: 'Error',
    },
    warning: {
        icon: Warning,
        color: 'warning.main',
        defaultTitle: 'Warning',
    },
    info: {
        icon: Info,
        color: 'info.main',
        defaultTitle: 'Information',
    },
};

export const NotificationDialog: React.FC<NotificationDialogProps> = ({
    open,
    onClose,
    title,
    message,
    type = 'info',
    confirmText = 'OK',
    cancelText = 'Cancel',
    onConfirm,
    showCancel = false,
    autoClose,
}) => {
    const config = typeConfig[type];
    const IconComponent = config.icon;

    React.useEffect(() => {
        if (open && autoClose) {
            const timer = setTimeout(() => {
                onClose();
            }, autoClose);
            return () => clearTimeout(timer);
        }
    }, [open, autoClose, onClose]);

    const handleConfirm = () => {
        if (onConfirm) {
            onConfirm();
        }
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
            fullScreen={false}
            PaperProps={{
                sx: { 
                    borderRadius: { xs: 0, sm: 2 },
                    m: { xs: 0, sm: 2 },
                    maxHeight: { xs: '100vh', sm: '90vh' },
                    width: { xs: '100%', sm: 'auto' }
                }
            }}
        >
            <DialogTitle sx={{ pb: 1, pr: 6, px: { xs: 2, sm: 3 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconComponent sx={{ color: config.color, fontSize: { xs: 24, sm: 28 } }} />
                    <Typography variant="h6" component="span" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
                        {title || config.defaultTitle}
                    </Typography>
                </Box>
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: 'grey.500',
                    }}
                >
                    <Close />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ px: { xs: 2, sm: 3 } }}>
                <Typography variant="body1" color="textSecondary" sx={{ fontSize: { xs: '0.95rem', sm: '1rem' } }}>
                    {message}
                </Typography>
            </DialogContent>
            <DialogActions sx={{ px: { xs: 2, sm: 3 }, pb: { xs: 2, sm: 2 }, flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 1, sm: 0 } }}>
                {showCancel && (
                    <Button onClick={onClose} color="inherit" fullWidth={true} sx={{ display: { xs: 'block', sm: 'inline-flex' } }}>
                        {cancelText}
                    </Button>
                )}
                <Button
                    onClick={handleConfirm}
                    variant="contained"
                    color={type === 'error' ? 'error' : type === 'warning' ? 'warning' : 'primary'}
                    autoFocus
                    fullWidth={true}
                    sx={{ display: { xs: 'block', sm: 'inline-flex' } }}
                >
                    {confirmText}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

/**
 * Confirmation Dialog Component
 * For confirm/cancel actions (replaces window.confirm)
 */
export interface ConfirmationDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: NotificationType;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
    open,
    onClose,
    onConfirm,
    title = 'Confirm',
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    type = 'warning',
}) => {
    const config = typeConfig[type];
    const IconComponent = config.icon;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
            fullScreen={false}
            PaperProps={{
                sx: { 
                    borderRadius: { xs: 0, sm: 2 },
                    m: { xs: 0, sm: 2 },
                    maxHeight: { xs: '100vh', sm: '90vh' },
                    width: { xs: '100%', sm: 'auto' }
                }
            }}
        >
            <DialogTitle sx={{ pb: 1, px: { xs: 2, sm: 3 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconComponent sx={{ color: config.color, fontSize: { xs: 24, sm: 28 } }} />
                    <Typography variant="h6" component="span" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
                        {title}
                    </Typography>
                </Box>
            </DialogTitle>
            <DialogContent sx={{ px: { xs: 2, sm: 3 } }}>
                <Typography variant="body1" color="textSecondary" sx={{ fontSize: { xs: '0.95rem', sm: '1rem' } }}>
                    {message}
                </Typography>
            </DialogContent>
            <DialogActions sx={{ px: { xs: 2, sm: 3 }, pb: { xs: 2, sm: 2 }, flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 1, sm: 0 } }}>
                <Button onClick={onClose} color="inherit" fullWidth={true} sx={{ display: { xs: 'block', sm: 'inline-flex' } }}>
                    {cancelText}
                </Button>
                <Button
                    onClick={() => {
                        onConfirm();
                        onClose();
                    }}
                    variant="contained"
                    color={type === 'error' ? 'error' : type === 'warning' ? 'warning' : 'primary'}
                    autoFocus
                    fullWidth={true}
                    sx={{ display: { xs: 'block', sm: 'inline-flex' } }}
                >
                    {confirmText}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

// Default export for backward compatibility
export default NotificationDialog;
