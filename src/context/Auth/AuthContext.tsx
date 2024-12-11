import React from 'react'
import { AuthContextInterface, AuthContextProviderProps } from './type'
import axiosInstance from '../../api/index'
import { validateEmail } from '../../utils/emailValidator'

// Create and export the LoginContext with default values
export const AuthContext = React.createContext<AuthContextInterface>({
    // Default values
    nextModal: true,
    agreed: false,  // If the user has agreed to the privacy policy(second modal)
    isFirstModalOpen: true, // If the first modal is open
    isSecondModalOpen: false,
    disableFormContent: true, 
    setOpenNextModal: () => {},
    setAgreed: () => {}, 
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
    const [context, setContext] = React.useState<AuthContextInterface>({
        nextModal: true,
        agreed: false,  // If the user has agreed to the privacy policy(second modal)
        isFirstModalOpen: true, // If the first modal is open
        isSecondModalOpen: false,
        disableFormContent: true, // If the form content should be disabled
        setOpenNextModal: () => setContext((prevState) => ({...prevState, isFirstModalOpen: false, isSecondModalOpen: true })), // Function to set the agreed state
        setAgreed: () => setContext((prevState) => ({...prevState, agreed: true, isSecondModalOpen: false, disableFormContent: false })), // Function to set the agreed state
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
                    const confirmation = window.confirm('Are all your are details correct? You can\'t edit your registration after proceeding.')
                    if(!confirmation) return;
                    setContext((prevState: AuthContextInterface) => ({...prevState, register: {...prevState.register, loadingButton: true}}))
                    const formData = new FormData(event.currentTarget)
                    // Check for blank fields
                    for (const [key, value] of formData.entries()) {
                        if (value === "") {
                            alert(`Please fill out all the fields. Missing: ${key}`);
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
                        alert(error);
                        setContext((prevState: AuthContextInterface) => ({
                            ...prevState,
                            register: { ...prevState.register, loadingButton: false },
                        }));
                        return;
                    }
                
                    // Log form data for debugging
                    formData.forEach((value, key) => console.log(key, value));
                
                    // Submit form data to API
                    try {
                        const { data, status } = await axiosInstance.post("/auth/register", formData);
                
                        alert(data.message);
                
                        if (status === 201) {
                            window.location.reload();
                        }
                
                        if (data.refresh_frontend) {
                            window.location.reload();
                        }
                    } catch (error) {
                        console.error(error);
                        alert("Something went wrong");
                    } finally {
                        setContext((prevState: AuthContextInterface) => ({
                            ...prevState,
                            register: { ...prevState.register, loadingButton: false },
                        }));
                    }
                },
                handleChange: (event) => setContext((prevState: AuthContextInterface) => (
                    {
                        ...prevState,
                        register: {
                            ...prevState.register,
                            data: {
                                ...prevState.register.data,
                                [event.target.name]: event.target.value
                            }
                        }
                    }
                ))
            }
        },
    })
    return(
        <AuthContext.Provider value={{ ...context }}>
            {children}
        </AuthContext.Provider>
    )
}