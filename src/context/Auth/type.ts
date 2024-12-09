export interface AuthContextInterface {
    nextModal: boolean
    agreed: boolean
    isFirstModalOpen: boolean
    isSecondModalOpen: boolean
    disableFormContent: boolean
    setOpenNextModal: () => void
    setAgreed?: () => void
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