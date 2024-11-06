import { SelectChangeEvent } from "@mui/material"
import { Dayjs } from "dayjs"

export interface HomeContextType {
    filledOutForm: {
        personalInformation: boolean,
        addressDetails: boolean,
        parentProfile: boolean,
        homeAndFamilyBackground: boolean,
        health: boolean
    },
    setFilledOutForm: React.Dispatch<React.SetStateAction<HomeContextType['filledOutForm']>>,
    personalInformation: {
        first_name: string,
        middle_name: string,
        last_name: string,
        mobile_no: string,
        lrn: string,
        date_of_birth: Dayjs | null,
        gender: string,
        civil_status: string,
        religion: string,
        other_religion: string,
        is_solo_parent: string,
        is_indigenous_group: string,
        indigenous_group: string,
        school_last_attended: string,
        type_of_school: string,
        has_scholarship_or_financial_aid: string,
        scholarship_or_financial_aid: string,
        handleChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
        handleChangeSelect: (event: SelectChangeEvent<string>) => void,
        handleChangeDate: (date: Dayjs | null) => void,
        submitForm: (event: React.FormEvent<HTMLFormElement>) => void
    },
    addressDetails: {
        region: string
        region_code: string
        region_name: string
        regione_region_name: string
        province: string
        province_code: string
        province_name: string
        city: string
        city_code: string
        city_name: string
        barangay: string
        barangay_code: string
        barangay_name: string
        is_same_as_home_address: string
        current_address_region_code: string
        current_address_region_name: string
        current_address_region_region_name: string
        current_address_province_code: string
        current_address_province_name: string
        current_address_city_code: string
        current_address_city_name: string
        current_address_barangay_name: string
        current_address_street: string
        handleChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
        submitForm: (event: React.FormEvent<HTMLFormElement>) => void
    },
    parentProfile: {
        fatherHEA: string
        fatherOccupation: string
        motherHEA: string
        motherOccupation: string
        livingWithGuardian: string
        handleChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
        submitForm: (event: React.FormEvent<HTMLFormElement>) => void
    },
    homeAndFamilyBackground: {
        noOfSiblingsGainfullyEmployed: number
        whoFinancesYourSchooling: string
        isFourPsBeneficiary: string
        fourPsIdNumber: string
        isFirstGenStudent: string
        houseHoldMonthlyIncome: string
        natureOfResidence: string
        handleChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
        submitForm: (event: React.FormEvent<HTMLFormElement>) => void
    },
    health: {
        isPWD: string
        pwdIdNumber: string
        isSPED: string
        specifySPED: string
        hasSiblingsStudyingInCHMSU: string
        hasRelativesWorkingInCHMSU: string
        handleChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
        submitForm: (event: React.FormEvent<HTMLFormElement>) => void
    }
}

export interface HomeContextProviderProps {
    children: React.ReactNode
}