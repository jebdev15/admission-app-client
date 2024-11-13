export interface HomeContextType {
    filledOutForm: {
        personal_information_status: number,
        address_detail_status: number,
        parent_profile_status: number,
        home_and_family_background_status: number,
        health_status: number
        schedules_status: number
    },
    setFilledOutForm: React.Dispatch<React.SetStateAction<HomeContextType['filledOutForm']>>,
}

export interface HomeContextProviderProps {
    children: React.ReactNode
}