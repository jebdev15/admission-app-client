export interface HomeContextType {
    filledOutForm: {
        personal_information_status: number,
        address_detail_status: number,
        parent_profile_status: number,
        home_and_family_background_status: number,
        health_status: number
        image_status: number
        schedule_status: number
    },
    setFilledOutForm: React.Dispatch<React.SetStateAction<HomeContextType['filledOutForm']>>,
}

export interface HomeContextProviderProps {
    children: React.ReactNode
}

 // Define the type for the loader data
export interface LoaderData {
  apiMessage: string;
  isUuidExpired: string;
  isUuidExists: string;
  forms_status: {
    personal_information_status: boolean;
    address_detail_status: boolean;
    parent_profile_status: boolean;
    home_and_family_background_status: boolean;
    health_status: boolean;
    image_status: boolean;
    schedule_status: boolean;
  };
}