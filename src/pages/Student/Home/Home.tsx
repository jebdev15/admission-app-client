import { Box, Typography } from '@mui/material'
import React from 'react'
import { useLoaderData } from 'react-router';
import axiosInstance from '../../../api';
import CustomCircularProgress from '../../../components/CustomCircularProgress';
import Summary from '../Section/Summary/Summary';
import Picture from '../Section/ImageUploader/ImageUploader';
import { LoaderData } from './type';
import { AxiosError } from 'axios';
const PersonalInformation = React.lazy(() => import('../Section/PersonalInformation/PersonalInformation'))
const AddressDetails = React.lazy(() => import('../Section/AddressDetails/AddressDetails'))
const ParentProfile = React.lazy(() => import('../Section/ParentProfile/ParentProfile'))
const HomeAndFamilyBackground = React.lazy(() => import('../Section/HomeAndFamilyBackground/HomeAndFamilyBackground'))
const Health = React.lazy(() => import('../Section/Health/Health'))
const Schedules = React.lazy(() => import('../Section/Schedules/Schedules'))
const Header = React.lazy(() => import('../Header'))

const Home = () => {
  const { apiMessage, isUuidExpired, isUuidExists, forms_status } = useLoaderData() as LoaderData
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
              // jusstifyContent: 'center',
              width: '100%',
              height: 'auto',
              minHeight: '100dvh',
              backgroundColor: '#e0e0e0'
            }}
          >
            <Header />
            {(!isUuidExists || !isUuidExpired) ? currentForm() : (
              <Box sx={{ textAlign: 'center', padding: 3 }}>
                <Typography variant="h4" color="error">{apiMessage}</Typography>
              </Box>
            )}
          </Box>
      </React.Suspense>
    )
}

export const loader = async ({ params }: any) => {
  try {
    const { data } = await axiosInstance.get(`/applicants/${params.uuid}`);
    return {
      apiMessage: data.message,
      isUuidExpired: data.isUuidExpired,
      isUuidExists: data.isUuidExists,
      forms_status: data.forms_status[0],
    };
  } catch (error: AxiosError | any) {
    console.error('Error loading data:', error);
    // Handle different error types based on HTTP status
    if (error.response) {
      // Throw a custom error with status and message
      const customError = new Error(error.response.data.message || 'An error occurred') as any;
      customError.status = error.response.status;
      customError.statusText = error.response.statusText;
      customError.data = { message: error.response?.data?.message || 'Failed to load data.' };

      throw customError;
    }

    // Fallback for unexpected errors
    const fallbackError = new Error('Internal Server Error') as any;
    fallbackError.status = 500;
    fallbackError.statusText = 'Internal Server Error';
    throw fallbackError;
  }
}
export default Home