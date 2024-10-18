import React from 'react'
import { HomeContext } from '../Home/HomeContext'
import Typography from '@mui/material/Typography'
import PersonalInformation from './PersonalInformation/PersonalInformation'
import AddressDetails from './AddressDetails/AddressDetails'
import ParentProfile from './ParentProfile/ParentProfile'
import HomeAndFamilyBackground from './HomeAndFamilyBackground/HomeAndFamilyBackground'
import Health from './Health/Health'

const Summary = () => {
    const context = React.useContext(HomeContext)
    const { personalInformation, addressDetails, parentProfile, homeAndFamilyBackground, health } = context
    return (
        <>
            <h1>Personal Information</h1>
            <h1>Address Details</h1>
            <h1>Parent Profile</h1>
        <ul>
            <li>{parentProfile.fatherHEA}</li>
            <li>{parentProfile.fatherOccupation}</li>
            <li>{parentProfile.motherHEA}</li>
            <li>{parentProfile.motherOccupation}</li>
        </ul>
            <h1>Home and Family Background</h1>
            <h1>Health</h1>
        {/* <Typography variant="h3" color="initial">Summary</Typography>
            <PersonalInformation />
            <AddressDetails />
            <ParentProfile />
            <HomeAndFamilyBackground />
            <Health /> */}
        </>
    )
}

export default Summary