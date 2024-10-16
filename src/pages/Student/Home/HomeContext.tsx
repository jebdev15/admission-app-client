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
        streetAndBarangay: '',
        city: '',
        province: '',
        isSameAsHomeAddress: '',
        currentAddressStreetAndBarangay: '',
        currentAddressCity: '',
        currentAddressProvince: '',
        handleChange: () => {},
        submitForm: () => {}
    }
})

export const HomeContextProvider = ({children}: HomeContextProviderProps) => {
    const [filledOutForm, setFilledOutForm] = React.useState<HomeContextType['filledOutForm']>({
        personalInformation: true,
        addressDetails: false,
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
        streetAndBarangay: '',
        city: '',
        province: '',
        isSameAsHomeAddress: 'Yes',
        currentAddressStreetAndBarangay: '',
        currentAddressCity: '',
        currentAddressProvince: '',
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
    return (
        <HomeContext.Provider
            value={{
                filledOutForm,
                setFilledOutForm,
                personalInformation,
                addressDetails
            }}
        >
            {children}
        </HomeContext.Provider>
    )
}