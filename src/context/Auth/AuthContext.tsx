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
                    const confirmation = window.confirm('Are all your details correct? You can\'t edit your registration after proceeding.')
                    if(!confirmation) return;
                    const formData = new FormData(event.currentTarget)
                    console.log(formData.get('email'))
                    const {isValid, error} = validateEmail(formData.get('email') as string)
                    for(const [key, value] of formData) {
                        console.log(key, value)
                    }
                    if(isValid) {
                        try {
                            setContext((prevState: AuthContextInterface) => ({...prevState, register: {...prevState.register, loadingButton: true}}))
                            const { data, status } = await axiosInstance.post('/auth/register', formData)
                            alert(data.message)
                            if(status) {
                                if(status === 201) {
                                    window.location.reload()
                                }
                                setContext((prevState: AuthContextInterface) => ({...prevState, register: {...prevState.register, loadingButton: false}}))
                            }
                            if(data.refresh_frontend) {
                                window.location.reload()
                            }
                        } catch (error) {
                            setContext((prevState: AuthContextInterface) => ({...prevState, register: {...prevState.register, loadingButton: false}}))
                            console.error(error)
                            alert("Something went wrong")
                        }
                    } else {
                        alert(error)
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