export interface HomeContextType {
    filledOutForm: {
        personalInformation: boolean,
        addressDetails: boolean,
        parentProfile: boolean,
        homeAndFamilyBackground: boolean,
        health: boolean
    },
    setFilledOutForm: React.Dispatch<React.SetStateAction<HomeContextType['filledOutForm']>>,
}

export interface HomeContextProviderProps {
    children: React.ReactNode
}