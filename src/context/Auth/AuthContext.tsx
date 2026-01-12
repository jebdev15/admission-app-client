import React from 'react'
import { AuthContextInterface, AuthContextProviderProps, NotificationState, ConfirmationState } from './type'
import axiosInstance from '@api/index'
import { validateEmail } from '@utils/emailValidator'
import { AuthService, JobStatusResponse, RegistrationData } from '@services/authService'
import { NotificationType } from '@components/NotificationDialog'

const defaultNotification: NotificationState = {
    open: false,
    type: 'info',
    message: '',
};

const defaultConfirmation: ConfirmationState = {
    open: false,
    message: '',
    onConfirm: () => {},
};

// Create and export the LoginContext with default values
export const AuthContext = React.createContext<AuthContextInterface>({
    // Default values
    nextModal: true,
    agreed: false,  // If the user has agreed to the privacy policy(second modal)
    isFirstModalOpen: true, // If the first modal is open
    isSecondModalOpen: false,
    disableFormContent: true, 
    queueStatus: null,
    notification: defaultNotification,
    confirmation: defaultConfirmation,
    setOpenNextModal: () => {},
    setAgreed: () => {},
    clearQueueStatus: () => {},
    showNotification: () => {},
    closeNotification: () => {},
    showConfirmation: () => {},
    closeConfirmation: () => {},
    register: {
        passwordVisibility: false,
        loadingButton: false,
        data:{
            email: '',
            campus: '',
            college: '',
            course: ''
        },
        actions: {
            togglePasswordVisibility: () => {},
            submitForm: () => {},
            handleChange: () => {}
        }
    },
})

export const AuthContextProvider = ({children}: AuthContextProviderProps) => {
    // Store pending form event for confirmation dialog
    const pendingFormRef = React.useRef<HTMLFormElement | null>(null);

    // Helper functions defined outside state
    const showNotificationFn = (message: string, type?: NotificationType, title?: string) => {
        setContext((prevState) => ({
            ...prevState,
            notification: { open: true, type: type || 'info', message, title }
        }));
    };

    const closeNotificationFn = () => {
        setContext((prevState) => ({
            ...prevState,
            notification: { ...prevState.notification, open: false }
        }));
    };

    const showConfirmationFn = (message: string, onConfirm: () => void, title?: string) => {
        setContext((prevState) => ({
            ...prevState,
            confirmation: { open: true, message, onConfirm, title }
        }));
    };

    const closeConfirmationFn = () => {
        setContext((prevState) => ({
            ...prevState,
            confirmation: { ...prevState.confirmation, open: false }
        }));
    };

    // Function to process form submission after confirmation
    const processFormSubmission = async (form: HTMLFormElement) => {
        setContext((prevState: AuthContextInterface) => ({...prevState, register: {...prevState.register, loadingButton: true}}))
        const formData = new FormData(form)
        
        // Sanitize email: remove all spaces and convert to lowercase
        const email = formData.get('email') as string;
        if (email) {
            formData.set('email', email.replace(/\s/g, '').toLowerCase());
        }
        
        // Check for blank fields
        for (const [key, value] of formData.entries()) {
            if (value === "") {
                showNotificationFn(`Please fill out all the fields. Missing: ${key}`, 'warning', 'Incomplete Form');
                setContext((prevState: AuthContextInterface) => ({
                    ...prevState,
                    register: { ...prevState.register, loadingButton: false },
                }));
                return;
            }
        }
        // Validate an email
        const {isValid, error} = validateEmail(formData.get('email') as string)
        for(const [key, value] of formData) {
            console.log(key, value)
        }
        if (!isValid) {
            showNotificationFn(error || 'Invalid email address', 'error', 'Email Validation Error');
            setContext((prevState: AuthContextInterface) => ({
                ...prevState,
                register: { ...prevState.register, loadingButton: false },
            }));
            return;
        }
    
        // Log form data for debugging
        formData.forEach((value, key) => console.log(key, value));

        // Prepare registration data
        const registrationData: RegistrationData = {
            email: formData.get('email') as string,
            first_name: formData.get('first_name') as string,
            last_name: formData.get('last_name') as string,
            date_of_birth: formData.get('date_of_birth') as string,
            campus_to_enroll: formData.get('campus_to_enroll') as string,
            campus_to_take_exam: formData.get('campus_to_take_exam') as string,
            college_description: formData.get('college_description') as string,
            course_description: formData.get('course_description') as string,
        };

        // Use queue-based registration with polling
        try {
            // Update status to show queue dialog
            setContext((prevState: AuthContextInterface) => ({
                ...prevState,
                queueStatus: {
                    success: true,
                    status: 'pending' as const,
                    message: 'Submitting registration...',
                    position: 0,
                    estimatedWaitTime: 0
                }
            }));

            const result = await AuthService.registerWithPolling(
                registrationData,
                (status: JobStatusResponse) => {
                    // Update queue status on each poll
                    setContext((prevState: AuthContextInterface) => ({
                        ...prevState,
                        queueStatus: status
                    }));
                }
            );
    
            // Don't show browser alert - the dialog already shows the status
            // Set the final status and let user close the dialog
            setContext((prevState: AuthContextInterface) => ({
                ...prevState,
                queueStatus: result,
                register: { ...prevState.register, loadingButton: false }
            }));
            
            // Don't auto-reload - let user close dialog first
            return;
        } catch (error: any) {
            console.error(error);
            // Fallback to direct registration if queue fails
            try {
                console.log('Falling back to direct registration...');
                const { data, status } = await axiosInstance.post("/auth/register", formData);
                if (status === 201) {
                    showNotificationFn(data.message || 'Registration successful!', 'success', 'Success');
                    // Don't auto-refresh - user can refresh manually after seeing the success message
                } else {
                    showNotificationFn(data.message || 'Registration submitted.', 'info', 'Notice');
                }
            } catch (fallbackError: any) {
                console.error(fallbackError);
                const errorMessage = fallbackError?.response?.data?.message || 
                    "Server is busy. The system is currently processing volume of requests. Please try again";
                showNotificationFn(errorMessage, 'error', 'Registration Error');
            }
            // Reset loading state for fallback errors
            setContext((prevState: AuthContextInterface) => ({
                ...prevState,
                register: { ...prevState.register, loadingButton: false },
                queueStatus: null
            }));
        }
    };

    const [context, setContext] = React.useState<AuthContextInterface>({
        nextModal: true,
        agreed: false,  // If the user has agreed to the privacy policy(second modal)
        isFirstModalOpen: true, // If the first modal is open
        isSecondModalOpen: false,
        disableFormContent: false, // If the form content should be disabled
        queueStatus: null, // Queue status for registration
        notification: defaultNotification,
        confirmation: defaultConfirmation,
        setOpenNextModal: () => setContext((prevState) => ({...prevState, isFirstModalOpen: false, isSecondModalOpen: true })), // Function to set the agreed state
        setAgreed: () => setContext((prevState) => ({...prevState, agreed: true, isSecondModalOpen: false, disableFormContent: false })), // Function to set the agreed state
        clearQueueStatus: () => {
            // Simply clear the queue status without reloading
            setContext((prevState) => ({ ...prevState, queueStatus: null }));
        },
        showNotification: showNotificationFn,
        closeNotification: closeNotificationFn,
        showConfirmation: showConfirmationFn,
        closeConfirmation: closeConfirmationFn,
        register: {
            passwordVisibility: false,
            loadingButton: false,
            data:{
                email: '',
                campus: '',
                college: '',
                course: '',
            },
            actions: {
                togglePasswordVisibility: () => setContext((prevState: AuthContextInterface) => (
                    {
                        ...prevState, 
                        register: 
                            {
                                ...prevState.register, 
                                passwordVisibility: !prevState.register.passwordVisibility,
                            }
                    }
                )),
                submitForm: async (event: React.FormEvent<HTMLFormElement>) => {
                    event.preventDefault();
                    // Store the form reference for later use after confirmation
                    pendingFormRef.current = event.currentTarget;
                    
                    // Show confirmation dialog instead of window.confirm
                    showConfirmationFn(
                        'Are all the details correct? Once you proceed, you will not be able to edit your registration.',
                        () => {
                            if (pendingFormRef.current) {
                                processFormSubmission(pendingFormRef.current);
                            }
                        },
                        'Confirm Registration'
                    );
                },
                handleChange: (event) => {
                    let value = event.target.value;
                    // Sanitize email: remove all spaces and convert to lowercase
                    if (event.target.name === 'email') {
                        value = value.replace(/\s/g, '').toLowerCase();
                    }
                    setContext((prevState: AuthContextInterface) => ({
                        ...prevState,
                        register: {
                            ...prevState.register,
                            data: {
                                ...prevState.register.data,
                                [event.target.name]: value
                            }
                        }
                    }))
                }
            }
        },
    })
    return(
        <AuthContext.Provider value={{ ...context }}>
            {children}
        </AuthContext.Provider>
    )
}