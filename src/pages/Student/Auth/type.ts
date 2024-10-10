export interface LoginContextType {
    dataPrivacyPolicy: {
        agreed: boolean
        open: boolean
    },
    functions: {
        closeModal?: () => void
        openModal?: () => void
        setAgreed?: () => void
    }
}

export interface LoginContextProviderProps {
    children: React.ReactNode
}  