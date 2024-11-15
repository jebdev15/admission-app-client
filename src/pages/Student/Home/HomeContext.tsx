import React from 'react'
import { HomeContextType, HomeContextProviderProps } from './type'

export const HomeContext = React.createContext<HomeContextType>({
    filledOutForm: {
        personal_information_status: 0,
        address_detail_status: 0,
        parent_profile_status: 0,
        home_and_family_background_status: 0,
        health_status: 0,
        schedule_status: 0
    },
    setFilledOutForm: () => {},
})

export const HomeContextProvider = ({children}: HomeContextProviderProps) => {
    const [filledOutForm, setFilledOutForm] = React.useState<HomeContextType['filledOutForm']>({
        personal_information_status: 0,
        address_detail_status: 0,
        parent_profile_status: 0,
        home_and_family_background_status: 0,
        health_status: 0,
        schedule_status: 0
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