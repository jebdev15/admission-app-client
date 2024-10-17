import { Box, CircularProgress } from '@mui/material'
import React from 'react'
import { HomeContext } from './HomeContext';
const PersonalInformation = React.lazy(() => import('../Section/PersonalInformation/PersonalInformation'))
const AddressDetails = React.lazy(() => import('../Section/AddressDetails/AddressDetails'))
const ParentProfile = React.lazy(() => import('../Section/ParentProfile/ParentProfile'))
const HomeAndFamilyBackground = React.lazy(() => import('../Section/HomeAndFamilyBackground/HomeAndFamilyBackground'))
const Health = React.lazy(() => import('../Section/Health/Health'))

const Home = () => {
  const { personalInformation, addressDetails, parentProfile, homeAndFamilyBackground, health } = React.useContext(HomeContext).filledOutForm
  const currentForm = () => {
    if (!personalInformation) {
      return <PersonalInformation />
    } else if (!addressDetails ) {
      return <AddressDetails />
    } else if (!parentProfile) {
      return <ParentProfile />
    } else if (!homeAndFamilyBackground) {
      return <HomeAndFamilyBackground />
    } else if (!health) {
      return <Health />
    }
  }
  return (
    <React.Suspense fallback={<CircularProgress />}>
      <Box
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center', 
          height: 'auto',
          padding: '1rem',
          gap: 1
        }}
      >
        {currentForm()}
      </Box>
    </React.Suspense>
  )
}

export default Home