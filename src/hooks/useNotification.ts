/**
 * useNotification Hook
 * Provides a simple API for showing notifications throughout the app
 * Replaces all browser alert() and confirm() calls
 */

import React from 'react';
import { NotificationType } from '@components/NotificationDialog';

export interface NotificationState {
    open: boolean;
    type: NotificationType;
    title?: string;
    message: string;
    onConfirm?: () => void;
    showCancel?: boolean;
    confirmText?: string;
    cancelText?: string;
    autoClose?: number;
}

export interface ConfirmationState {
    open: boolean;
    type: NotificationType;
    title?: string;
    message: string;
    onConfirm: () => void;
    confirmText?: string;
    cancelText?: string;
}

const defaultNotification: NotificationState = {
    open: false,
    type: 'info',
    message: '',
};

const defaultConfirmation: ConfirmationState = {
    open: false,
    type: 'warning',
    message: '',
    onConfirm: () => {},
};

export const useNotification = () => {
    const [notification, setNotification] = React.useState<NotificationState>(defaultNotification);
    const [confirmation, setConfirmation] = React.useState<ConfirmationState>(defaultConfirmation);

    const showNotification = React.useCallback((
        message: string,
        type: NotificationType = 'info',
        options?: {
            title?: string;
            onConfirm?: () => void;
            showCancel?: boolean;
            confirmText?: string;
            cancelText?: string;
            autoClose?: number;
        }
    ) => {
        setNotification({
            open: true,
            type,
            message,
            ...options,
        });
    }, []);

    const showSuccess = React.useCallback((message: string, options?: { title?: string; onConfirm?: () => void; autoClose?: number }) => {
        showNotification(message, 'success', options);
    }, [showNotification]);

    const showError = React.useCallback((message: string, options?: { title?: string; onConfirm?: () => void }) => {
        showNotification(message, 'error', options);
    }, [showNotification]);

    const showWarning = React.useCallback((message: string, options?: { title?: string; onConfirm?: () => void }) => {
        showNotification(message, 'warning', options);
    }, [showNotification]);

    const showInfo = React.useCallback((message: string, options?: { title?: string; onConfirm?: () => void; autoClose?: number }) => {
        showNotification(message, 'info', options);
    }, [showNotification]);

    const closeNotification = React.useCallback(() => {
        setNotification(prev => ({ ...prev, open: false }));
    }, []);

    const showConfirmation = React.useCallback((
        message: string,
        onConfirm: () => void,
        options?: {
            title?: string;
            type?: NotificationType;
            confirmText?: string;
            cancelText?: string;
        }
    ) => {
        setConfirmation({
            open: true,
            type: options?.type || 'warning',
            message,
            onConfirm,
            title: options?.title,
            confirmText: options?.confirmText,
            cancelText: options?.cancelText,
        });
    }, []);

    const closeConfirmation = React.useCallback(() => {
        setConfirmation(prev => ({ ...prev, open: false }));
    }, []);

    return {
        notification,
        confirmation,
        showNotification,
        showSuccess,
        showError,
        showWarning,
        showInfo,
        closeNotification,
        showConfirmation,
        closeConfirmation,
    };
};

export default useNotification;
