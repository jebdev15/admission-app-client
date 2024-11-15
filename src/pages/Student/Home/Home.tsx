import { Box } from '@mui/material'
import React from 'react'
import { useLoaderData } from 'react-router';
import axiosInstance from '../../../api';
import CustomCircularProgress from '../../../components/CustomCircularProgress';
import { HomeContext } from './HomeContext';
import Summary from '../Section/Summary/Summary';
const PersonalInformation = React.lazy(() => import('../Section/PersonalInformation/PersonalInformation'))
const AddressDetails = React.lazy(() => import('../Section/AddressDetails/AddressDetails'))
const ParentProfile = React.lazy(() => import('../Section/ParentProfile/ParentProfile'))
const HomeAndFamilyBackground = React.lazy(() => import('../Section/HomeAndFamilyBackground/HomeAndFamilyBackground'))
const Health = React.lazy(() => import('../Section/Health/Health'))
const Schedules = React.lazy(() => import('../Section/Schedules/Schedules'))
const Header = React.lazy(() => import('../Header'))
const Home = () => {
  const { validUUID, forms_status } = useLoaderData()
  const { filledOutForm, setFilledOutForm } = React.useContext(HomeContext)
  const currentForm = () => {
    if (!filledOutForm.personal_information_status) {
      return <PersonalInformation />
    } else if (!filledOutForm.address_detail_status) {
      return <AddressDetails />
    } else if (!filledOutForm.parent_profile_status) {
      return <ParentProfile />
    } else if (!filledOutForm.home_and_family_background_status) {
      return <HomeAndFamilyBackground />
    } else if (!filledOutForm.health_status) {
      return <Health />
    } else if(!filledOutForm.schedule_status) {
      return <Schedules />
    } else {
      return <Summary />
    }
  }
  React.useEffect(() => {
    setFilledOutForm(forms_status)
    console.log({validUUID, forms_status, filledOutForm})
  },[validUUID, forms_status, filledOutForm])
  return (
    <React.Suspense fallback={<CustomCircularProgress />}>
      <Box
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center', 
          height: 'auto',
          gap: 1
        }}
      >
        <Header />
        {currentForm()}
      </Box>
    </React.Suspense>
  )
}

export const loader = async ({ params }: any) => {
  const { uuid } = params
  const { data } = await axiosInstance.get(`/applicants/${params.uuid}`)
  return { validUUID: uuid, forms_status: data[0]}
}
export default Home