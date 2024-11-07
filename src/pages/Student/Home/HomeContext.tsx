import React from 'react'
import { HomeContextType, HomeContextProviderProps } from './type'

export const HomeContext = React.createContext<HomeContextType>({
    filledOutForm: {
        personalInformation: false,
        addressDetails: false,
        parentProfile: false,
        homeAndFamilyBackground: false,
        health: false
    },
    setFilledOutForm: () => {},
})

export const HomeContextProvider = ({children}: HomeContextProviderProps) => {
    const [filledOutForm, setFilledOutForm] = React.useState<HomeContextType['filledOutForm']>({
        personalInformation: false,
        addressDetails: false,
        parentProfile: false,
        homeAndFamilyBackground: false,
        health: false
    })
    
    return (
        <HomeContext.Provider
            value={{
                filledOutForm,
                setFilledOutForm,
            }}
        >
            {children}
        </HomeContext.Provider>
    )
}