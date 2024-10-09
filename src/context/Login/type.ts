export interface LoginContextInterface {
    agreed: boolean
    open: boolean
    closeModal?: () => void
    openModal?: () => void
    setAgreed?: () => void
}

export interface LoginContextProviderProps {
    children: React.ReactNode
}  