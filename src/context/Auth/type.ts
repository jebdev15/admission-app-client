import { JobStatusResponse } from '@services/authService';
import { NotificationType } from '@components/NotificationDialog';

export interface NotificationState {
    open: boolean;
    type: NotificationType;
    title?: string;
    message: string;
    onConfirm?: () => void;
}

export interface ConfirmationState {
    open: boolean;
    title?: string;
    message: string;
    onConfirm: () => void;
}

export interface AuthContextInterface {
    nextModal: boolean
    agreed: boolean
    isFirstModalOpen: boolean
    isSecondModalOpen: boolean
    disableFormContent: boolean
    queueStatus: JobStatusResponse | null
    notification: NotificationState
    confirmation: ConfirmationState
    setOpenNextModal: () => void
    setAgreed?: () => void
    clearQueueStatus: () => void
    showNotification: (message: string, type?: NotificationType, title?: string, onConfirm?: () => void) => void
    closeNotification: () => void
    showConfirmation: (message: string, onConfirm: () => void, title?: string) => void
    closeConfirmation: () => void
    register: {
        passwordVisibility: boolean,
        loadingButton: boolean,
        data:{
            email: string,
            campus: string,
            college: string,
            course: string
        },
        actions: {
            togglePasswordVisibility: () => void
            submitForm: (event: React.FormEvent<HTMLFormElement>) => void
            handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void
        }
    }
}

export interface AuthContextProviderProps {
    children: React.ReactNode
}  