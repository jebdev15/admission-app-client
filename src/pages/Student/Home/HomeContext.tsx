import dayjs from 'dayjs'
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
    personalInformation: {
        firstName: '',
        middleName: '',
        lastName: '',
        mobileNumber: '',
        lrn: '',
        dateOfBirth: dayjs('2000-01-01'),
        gender: '',
        civilStatus: '',
        religion: '',
        otherReligion: '',
        soloParent: '',
        isIndigenousGroup: '',
        indigenousGroup: '',
        schoolLastAttended: '',
        typeOfSchool: '',
        hasScholarshipOrFinancialAid: '',
        scholarshipOrFinancialAid: '',
        handleChange: () => {},
        submitForm: () => {}
    },
    addressDetails: {
        region: '',
        regionCode: '',
        regionName: '',
        regionRegionName: '',
        province: '',
        provinceCode: '',
        provinceName: '',
        city: '',
        cityCode: '',
        cityName: '',
        barangay: '',
        barangayCode: '',
        barangayName: '',
        isSameAsHomeAddress: '',
        currentAddressRegionCode: '',
        currentAddressRegionName: '',
        currentAddressRegionRegionName: '',
        currentAddressProvinceCode: '',
        currentAddressProvinceName: '',
        currentAddressCityCode: '',
        currentAddressCityName: '',
        currentAddressBarangayCode: '',
        currentAddressBarangayName: '',
        handleChange: () => {},
        submitForm: () => {}
    },
    parentProfile: {
        fatherHEA: '',
        fatherOccupation: '',
        motherHEA: '',
        motherOccupation: '',
        livingWithGuardian: '',
        handleChange: () => {},
        submitForm: () => {}
    },
    homeAndFamilyBackground: {
        noOfSiblingsGainfullyEmployed: 0,
        whoFinancesYourSchooling: '',
        isFourPsBeneficiary: '',
        fourPsIdNumber: '',
        isFirstGenStudent: '',
        houseHoldMonthlyIncome: '',
        natureOfResidence: '',
        handleChange: () => {},
        submitForm: () => {}
    },
    health: {
        isPWD: '',
        pwdIdNumber: '',
        isSPED: '',
        specifySPED: '',
        hasSiblingsStudyingInCHMSU: '',
        hasRelativesWorkingInCHMSU: '',
        handleChange: () => {},
        submitForm: () => {}
    }
})

export const HomeContextProvider = ({children}: HomeContextProviderProps) => {
    const [filledOutForm, setFilledOutForm] = React.useState<HomeContextType['filledOutForm']>({
        personalInformation: true,
        addressDetails: true,
        parentProfile: false,
        homeAndFamilyBackground: false,
        health: false
    })
    const [personalInformation, setPersonalInformation] = React.useState<HomeContextType['personalInformation']>({
        firstName: '',
        middleName: '',
        lastName: '',
        mobileNumber: '',
        lrn: '',
        dateOfBirth: dayjs('2000-01-01'),
        gender: '',
        civilStatus: '',
        religion: '',
        otherReligion: '',
        soloParent: '',
        isIndigenousGroup: '',
        indigenousGroup: '',
        schoolLastAttended: '',
        typeOfSchool: '',
        hasScholarshipOrFinancialAid: '',
        scholarshipOrFinancialAid: '',
        handleChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> ) => setPersonalInformation((prevState: HomeContextType['personalInformation']) => ({...prevState, [event?.target.name]: event?.target.value })),
        submitForm: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault()
            const formData = new FormData(event.currentTarget)
            const data = Object.fromEntries(formData.entries())
            for (const [key, value] of Object.entries(data)) {
                console.log(`${key}: ${value}`)
            }
            setFilledOutForm((prevState) => ({
                ...prevState,
                personalInformation: true
            }))
        }
    })
    const [addressDetails, setAddressDetails] = React.useState<HomeContextType['addressDetails']>({
        region: '',
        regionCode: '',
        regionName: '',
        regionRegionName: '',
        province: '',
        provinceCode: '',
        provinceName: '',
        city: '',
        cityCode: '',
        cityName: '',
        barangay: '',
        barangayCode: '',
        barangayName: '',
        isSameAsHomeAddress: '',
        currentAddressRegionCode: '',
        currentAddressRegionName: '',
        currentAddressRegionRegionName: '',
        currentAddressProvinceCode: '',
        currentAddressProvinceName: '',
        currentAddressCityCode: '',
        currentAddressCityName: '',
        currentAddressBarangayCode: '',
        currentAddressBarangayName: '',
        handleChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setAddressDetails((prevState: HomeContextType['addressDetails']) => ({...prevState, [event?.target.name]: event?.target.value })),
        submitForm: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault()
            const formData = new FormData(event.currentTarget)
            const data = Object.fromEntries(formData.entries())
            for (const [key, value] of Object.entries(data)) {
                console.log(`${key}: ${value}`)
            }
            setFilledOutForm((prevState) => ({
                ...prevState,
                addressDetails: true
            }))
        }
    })
    const [parentProfile, setParentProfile] = React.useState<HomeContextType['parentProfile']>({
        fatherHEA: '',
        fatherOccupation: '',
        motherHEA: '',
        motherOccupation: '',
        livingWithGuardian: '',
        handleChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> ) => {
            setParentProfile((prevState: HomeContextType['parentProfile']) => ({...prevState, [event?.target.name]: event?.target.value }))
        },
        submitForm: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault()
            const formData = new FormData(event.currentTarget)
            const data = Object.fromEntries(formData.entries())
            for (const [key, value] of Object.entries(data)) {
                console.log(`${key}: ${value}`)
            }
            setFilledOutForm((prevState) => ({
                ...prevState,
                parentProfile: true
            }))
        }
    })
    const [homeAndFamilyBackground, setHomeAndFamilyBackground] = React.useState<HomeContextType['homeAndFamilyBackground']>({
        noOfSiblingsGainfullyEmployed: 0,
        whoFinancesYourSchooling: '',
        isFourPsBeneficiary: '',
        fourPsIdNumber: '',
        isFirstGenStudent: '',
        houseHoldMonthlyIncome: '',
        natureOfResidence: '',
        handleChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> ) => setHomeAndFamilyBackground((prevState: HomeContextType['homeAndFamilyBackground']) => ({...prevState, [event?.target.name]: event?.target.value })),
        submitForm: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault()
            const formData = new FormData(event.currentTarget)
            const data = Object.fromEntries(formData.entries())
            for (const [key, value] of Object.entries(data)) {
                console.log(`${key}: ${value}`)
            }
            setFilledOutForm((prevState) => ({
                ...prevState,
                homeAndFamilyBackground: true
            }))
        }
    })
    const [health, setHealth] = React.useState<HomeContextType['health']>({
        isPWD: '',
        pwdIdNumber: '',
        isSPED: '',
        specifySPED: '',
        hasSiblingsStudyingInCHMSU: '',
        hasRelativesWorkingInCHMSU: '',
        handleChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> ) => setHealth((prevState: HomeContextType['health']) => ({...prevState, [event?.target.name]: event?.target.value })),
        submitForm: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault()
            const formData = new FormData(event.currentTarget)
            const data = Object.fromEntries(formData.entries())
            for (const [key, value] of Object.entries(data)) {
                console.log(`${key}: ${value}`)
            }
            setFilledOutForm((prevState) => ({
                ...prevState,
                health: true
            }))
        }
    })
    return (
        <HomeContext.Provider
            value={{
                filledOutForm,
                setFilledOutForm,
                personalInformation,
                addressDetails,
                parentProfile,
                homeAndFamilyBackground,
                health
            }}
        >
            {children}
        </HomeContext.Provider>
    )
}