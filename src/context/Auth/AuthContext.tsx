import React from 'react'
import { AuthContextInterface, AuthContextProviderProps } from './type'
import { useCookies } from 'react-cookie'

// Create and export the LoginContext with default values
export const AuthContext = React.createContext<AuthContextInterface>({
    // Default values
    agreed: false, 
    open: true, 
    disableFormContent: true, 
    defaultForm: true, 
    closeModal: () => {}, 
    setAgreed: () => {}, 
    changeFormToLogin: () => {}, 
    changeFormToRegister: () => {}, 
    login: {
        passwordVisibility: false,
        data:{
            email: '',
            password: ''
        },
        actions: {
            togglePasswordVisibility: () => {},
            submitForm: () => {},
            handleChange: () => {}
        }
    },
    register: {
        passwordVisibility: false,
        data:{
            firstName: '',
            middleName: '',
            lastName: '',
            email: '',
            password: '',
        },
        actions: {
            togglePasswordVisibility: () => {},
            submitForm: () => {},
            handleChange: () => {}
        }
    },
    isAuthenticated: false
})

export const AuthContextProvider = ({children}: AuthContextProviderProps) => {
    const [cookie,setCookies] = useCookies(['token'])
    const [context, setContext] = React.useState<AuthContextInterface>({
        agreed: false, // If the user has agreed to the privacy policy
        open: true, // If the modal is open
        disableFormContent: true, // If the form content should be disabled
        defaultForm: true, // If the default is true, login form should be shown
        closeModal: () => setContext((prevState) => ({...prevState, open: false, disableFormContent: false })), // Function to close the data privacy policy modal
        setAgreed: () => setContext((prevState) => ({...prevState, agreed: true, open: false, disableFormContent: false })), // Function to set the agreed state
        changeFormToLogin: () => setContext((prevState) => ({...prevState, defaultForm: true })), // Function to change the form to the login form
        changeFormToRegister: () => setContext((prevState) => ({...prevState, defaultForm: false })), // Function to change the form to the register form
        login: {
            passwordVisibility: false,
            data:{
                email: '',
                password: ''
            },
            actions: {
                togglePasswordVisibility: () => setContext((prevState: AuthContextInterface) => (
                    {
                        ...prevState, 
                        login: 
                            {
                                ...prevState.login, 
                                passwordVisibility: !prevState.login.passwordVisibility,
                            }
                    }
                )),
                submitForm: (event: React.FormEvent<HTMLFormElement>) => {
                    event.preventDefault(); 
                    const formData = new FormData(event.currentTarget)
                    for(const [key, value] of formData.entries()) {
                        console.log(`${key}: ${value}`)
                    }
                    setContext((prevState: AuthContextInterface) => (
                        {
                            ...prevState, 
                            login: {
                                ...prevState.login, 
                                data: { 
                                    ...prevState.login.data, 
                                    email: '', 
                                    password: ''
                                } 
                            } 
                        }
                    ))
                    const data = {
                        token: 'test',
                    }
                    Object.entries(data).forEach((value) => setCookies(value[0],value[1], { path: '/'}))
                    // Object.entries(data).forEach((value) => console.log({key: value[0],value: value[1]}))
                    // setCookies('token', 'test', { path: '/' })
                },
                handleChange: (event: React.ChangeEvent<HTMLInputElement>) => setContext((prevState: AuthContextInterface) => (
                    {
                        ...prevState,
                        login: {
                            ...prevState.login,
                            data: {
                                ...prevState.login.data,
                                [event.target.name]: event.target.value
                            }
                        }
                    }
                ))
            }
        },
        register: {
            passwordVisibility: false,
            data:{
                firstName: '',
                middleName: '',
                lastName: '',
                email: '',
                password: '',
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
                submitForm: (event: React.FormEvent) => {
                    event.preventDefault(); 
                    console.log('submitted register form')
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
        isAuthenticated: false
    })
    const isAuthenticated = !!cookie.token
    return(
        <AuthContext.Provider value={{ ...context, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    )
}