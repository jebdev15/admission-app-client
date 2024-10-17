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
        region: string
        regionCode: string
        regionName: string
        regionRegionName: string
        province: string
        provinceCode: string
        provinceName: string
        city: string
        cityCode: string
        cityName: string
        barangay: string
        barangayCode: string
        barangayName: string
        isSameAsHomeAddress: string
        currentAddressRegionCode: string
        currentAddressRegionName: string
        currentAddressRegionRegionName: string
        currentAddressProvinceCode: string
        currentAddressProvinceName: string
        currentAddressCityCode: string
        currentAddressCityName: string
        currentAddressBarangayCode: string
        currentAddressBarangayName: string
        handleChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
        handleChangeSelect: (event: React.ChangeEvent<HTMLSelectElement>) => void
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