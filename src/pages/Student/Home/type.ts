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
        firstName: string,
        middleName: string,
        lastName: string,
        mobileNumber: string,
        lrn: string,
        dateOfBirth: Dayjs,
        gender: string,
        civilStatus: string,
        religion: string,
        otherReligion: string,
        soloParent: string,
        isIndigenousGroup: string,
        indigenousGroup: string,
        schoolLastAttended: string,
        typeOfSchool: string,
        hasScholarshipOrFinancialAid: string,
        scholarshipOrFinancialAid: string,
        handleChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void,
        submitForm: (event: React.FormEvent<HTMLFormElement>) => void
    },
    addressDetails: {
        streetAndBarangay: string,
        city: string,
        province: string,
        isSameAsHomeAddress: string,
        currentAddressStreetAndBarangay: string,
        currentAddressCity: string,
        currentAddressProvince: string,
        handleChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void,
        submitForm: (event: React.FormEvent<HTMLFormElement>) => void
    }
}

export interface HomeContextProviderProps {
    children: React.ReactNode
}