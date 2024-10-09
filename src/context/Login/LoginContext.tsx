import React from 'react'
import { LoginContextInterface, LoginContextProviderProps } from './type'

// Create and export the LoginContext with default values
export const LoginContext = React.createContext<LoginContextInterface>({
    agreed: false,
    open: false,
    closeModal: () => {},
    openModal: () => {},
    setAgreed: () => {},
})

export const LoginContextProvider = ({children}: LoginContextProviderProps) => {
    const [context, setContext] = React.useState<LoginContextInterface>({
        agreed: false,
        open: true,
        closeModal: () => setContext((prevState) => ({...prevState, open: false })),
        openModal: () => setContext((prevState) => ({...prevState, open: true })),
        setAgreed: () => setContext((prevState) => ({...prevState, agreed: true, open: false })),
    })
    return(
        <LoginContext.Provider value={context}>
            {children}
        </LoginContext.Provider>
    )
}