import { Box, CircularProgress } from '@mui/material'
import React from 'react'
import { HomeContext } from './HomeContext';
import Summary from '../Section/Summary';
import { useLoaderData, useParams } from 'react-router';
import axiosInstance from '../../../api';
const PersonalInformation = React.lazy(() => import('../Section/PersonalInformation/PersonalInformation'))
const AddressDetails = React.lazy(() => import('../Section/AddressDetails/AddressDetails'))
const ParentProfile = React.lazy(() => import('../Section/ParentProfile/ParentProfile'))
const HomeAndFamilyBackground = React.lazy(() => import('../Section/HomeAndFamilyBackground/HomeAndFamilyBackground'))
const Health = React.lazy(() => import('../Section/Health/Health'))

const Home = () => {
  const { validUUID, form_status } = useLoaderData()
  const currentForm = () => {
    if (!form_status.personal_information_status) {
      return <PersonalInformation />
    } else if (!form_status.address_detail_status) {
      return <AddressDetails />
    } else if (!form_status.parent_profile_status) {
      return <ParentProfile />
    } else if (!form_status.home_and_family_background_status) {
      return <HomeAndFamilyBackground />
    } else if (!form_status.health_status) {
      return <Health />
    }
  }
  React.useEffect(() => {
    console.log(validUUID, form_status)
  },[validUUID, form_status])
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

export const loader = async ({ params }: any) => {
  const { uuid } = params
  const { data } = await axiosInstance.get(`/applicants/${params.uuid}`)

  return { validUUID: uuid, form_status: data[0]}
}

export default Home