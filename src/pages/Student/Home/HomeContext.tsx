import React from 'react'
import { HomeContextType, HomeContextProviderProps } from './type'
import axiosInstance from '../../../api'
import { useParams } from 'react-router'
import { SelectChangeEvent } from '@mui/material'
import dayjs, { Dayjs } from 'dayjs'

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
        first_name: '',
        middle_name: '',
        last_name: '',
        mobile_no: '',
        lrn: '',
        date_of_birth: dayjs('2000-01-01'),  // Set a default date as a `dayjs` object,
        gender: '',
        civil_status: '',
        religion: '',
        other_religion: '',
        is_solo_parent: '',
        is_indigenous_group: '',
        indigenous_group: '',
        school_last_attended: '',
        type_of_school: '',
        has_scholarship_or_financial_aid: '',
        scholarship_or_financial_aid: '',
        handleChange: () => {},
        handleChangeSelect: () => {},
        handleChangeDate: () => {},
        submitForm: () => {}
    },
    addressDetails: {
        region: '',
        region_code: '',
        region_name: '',
        regione_region_name: '',
        province: '',
        province_code: '',
        province_name: '',
        city: '',
        city_code: '',
        city_name: '',
        barangay: '',
        barangay_code: '',
        barangay_name: '',
        is_same_as_home_address: '',
        current_address_region_code: '',
        current_address_region_name: '',
        current_address_region_region_name: '',
        current_address_province_code: '',
        current_address_province_name: '',
        current_address_city_code: '',
        current_address_city_name: '',
        current_address_barangay_name: '',
        current_address_street: '',
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
    const { uuid } = useParams<{uuid: string}>()
    const [filledOutForm, setFilledOutForm] = React.useState<HomeContextType['filledOutForm']>({
        personalInformation: false,
        addressDetails: false,
        parentProfile: false,
        homeAndFamilyBackground: false,
        health: false
    })
    const [personalInformation, setPersonalInformation] = React.useState<HomeContextType['personalInformation']>({
        first_name: '',
        middle_name: '',
        last_name: '',
        mobile_no: '',
        lrn: '',
        date_of_birth: dayjs('2000-01-01'),  // Set a default date as a `dayjs` object,
        gender: '',
        civil_status: '',
        religion: '',
        other_religion: '',
        is_solo_parent: '',
        is_indigenous_group: '',
        indigenous_group: '',
        school_last_attended: '',
        type_of_school: '',
        has_scholarship_or_financial_aid: '',
        scholarship_or_financial_aid: '',
        handleChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> ) => setPersonalInformation((prevState: HomeContextType['personalInformation']) => ({...prevState, [event?.target.name]: event?.target.value })),
        handleChangeSelect: (event: SelectChangeEvent<string>) => setPersonalInformation((prevState: HomeContextType['personalInformation']) => ({...prevState, [event?.target.name]: event?.target.value })),
        handleChangeDate: (newValue: Dayjs | null) => 
            setPersonalInformation((prevState) => ({ ...prevState, date_of_birth: newValue ?? dayjs() })),  // Update date_of_birth in `dayjs` format
        submitForm: async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault()
            
            const formData = new FormData(event.currentTarget)
            formData.append('uuid', uuid)
            const { data, status } = await axiosInstance.post('/personal-information/create', formData)
            console.log(data, status)
            setFilledOutForm((prevState) => ({
                ...prevState,
                personalInformation: true
            }))
        }
    })
    const [addressDetails, setAddressDetails] = React.useState<HomeContextType['addressDetails']>({
        region: '',
        region_code: '',
        region_name: '',
        regione_region_name: '',
        province: '',
        province_code: '',
        province_name: '',
        city: '',
        city_code: '',
        city_name: '',
        barangay: '',
        barangay_code: '',
        barangay_name: '',
        is_same_as_home_address: '',
        current_address_region_code: '',
        current_address_region_name: '',
        current_address_region_region_name: '',
        current_address_province_code: '',
        current_address_province_name: '',
        current_address_city_code: '',
        current_address_city_name: '',
        current_address_barangay_name: '',
        current_address_street: '',
        handleChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
            const { name, value } = event.target;
          
            if (name === 'regionCode') {
                // Handle the specific logic for 'regionCode' here if needed.
                setAddressDetails((prevState: HomeContextType['addressDetails']) => (
                    { 
                        ...prevState, 
                        [name]: value,
                        provinceCode: '',
                        cityCode: '',
                        barangayCode: '',
                    }
                ));
            } else {
                setAddressDetails((prevState: HomeContextType['addressDetails']) => (
                    { 
                        ...prevState, 
                        [name]: value,
                    }
                ));
            }
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