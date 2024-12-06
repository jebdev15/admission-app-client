import React from 'react'
import { AuthContextInterface, AuthContextProviderProps } from './type'
import axiosInstance from '../../api/index'
import { validateEmail } from '../../utils/emailValidator'

// Create and export the LoginContext with default values
export const AuthContext = React.createContext<AuthContextInterface>({
    // Default values
    agreed: false, 
    open: true, 
    disableFormContent: true, 
    closeModal: () => {}, 
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
        agreed: false, // If the user has agreed to the privacy policy
        open: true, // If the modal is open
        disableFormContent: true, // If the form content should be disabled
        closeModal: () => setContext((prevState) => ({...prevState, open: false, disableFormContent: false })), // Function to close the data privacy policy modal
        setAgreed: () => setContext((prevState) => ({...prevState, agreed: true, open: false, disableFormContent: false })), // Function to set the agreed state
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
                    const formData = new FormData(event.currentTarget)
                    console.log(formData.get('email'))
                    const {isValid, error} = validateEmail(formData.get('email') as string)
                    for(const [key, value] of formData) {
                        console.log(key, value)
                    }
                    if(isValid) {
                        setContext((prevState: AuthContextInterface) => ({...prevState, register: {...prevState.register, loadingButton: true}}))
                        const { data, status } = await axiosInstance.post('/auth/register', formData)
                        alert(data.message)
                        if(status) {
                            setContext((prevState: AuthContextInterface) => ({...prevState, register: {...prevState.register, loadingButton: false}}))
                        }
                        if(status === 201) {
                            window.location.reload()
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