import { Box } from '@mui/material'
import React from 'react'
import { useLoaderData } from 'react-router';
import axiosInstance from '../../../api';
import CustomCircularProgress from '../../../components/CustomCircularProgress';
import { HomeContext } from './HomeContext';
import Summary from '../Section/Summary/Summary';
import Picture from '../Section/ImageUploader/ImageUploader';
import { LoaderData } from './type';
const PersonalInformation = React.lazy(() => import('../Section/PersonalInformation/PersonalInformation'))
const AddressDetails = React.lazy(() => import('../Section/AddressDetails/AddressDetails'))
const ParentProfile = React.lazy(() => import('../Section/ParentProfile/ParentProfile'))
const HomeAndFamilyBackground = React.lazy(() => import('../Section/HomeAndFamilyBackground/HomeAndFamilyBackground'))
const Health = React.lazy(() => import('../Section/Health/Health'))
const Schedules = React.lazy(() => import('../Section/Schedules/Schedules'))
const Header = React.lazy(() => import('../Header'))

const Home = () => {
  const { validUUID, forms_status } = useLoaderData() as LoaderData
  const { filledOutForm, setFilledOutForm } = React.useContext(HomeContext)
  const currentForm = () => {
    if (!forms_status.personal_information_status) {
      return <PersonalInformation />
    } else if (!forms_status.address_detail_status) {
      return <AddressDetails />
    } else if (!forms_status.parent_profile_status) {
      return <ParentProfile />
    } else if (!forms_status.home_and_family_background_status) {
      return <HomeAndFamilyBackground />
    } else if (!forms_status.health_status) {
      return <Health />
    } else if (!forms_status.image_status) {
      return <Picture />
    } else if(!forms_status.schedule_status) {
      return <Schedules />
    } else {
      return <Summary />
    }
  }
  React.useEffect(() => {
    if(forms_status) {
      console.log(forms_status)
    }
  },[forms_status])
  return (
    <React.Suspense fallback={<CustomCircularProgress />}>
      <Box
        sx={{ 
          display: 'flex',
          flexDirection: 'column',
          jusstifyContent: 'center',
          width: '100%',
          height: 'auto',
          minHeight: '100dvh',
          backgroundColor: '#e0e0e0'
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