export interface AuthContextInterface {
    agreed: boolean
    open: boolean
    disableFormContent: boolean
    defaultForm: boolean
    closeModal?: () => void
    setAgreed?: () => void
    changeFormToLogin?: () => void
    changeFormToRegister?: () => void
    login: {
        passwordVisibility: boolean
        data:{
            email: string,
            password: string
        },
        actions: {
            togglePasswordVisibility: () => void
            submitForm: (event: React.FormEvent<HTMLFormElement>) => void
            handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void
        }
    },
    register: {
        passwordVisibility: boolean
        data:{
            firstName: string,
            middleName: string,
            lastName: string,
            email: string,
            password: string,
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