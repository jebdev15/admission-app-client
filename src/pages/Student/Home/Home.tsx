import { Box } from '@mui/material'
import React from 'react'
import { useLoaderData } from 'react-router';
import axiosInstance from '@api/index';
import CustomCircularProgress from '@components/CustomCircularProgress';
import Summary from '../Section/Summary/Summary';
import { LoaderData } from './type';
import axios from 'axios';
import { UnifiedFormProvider, UnifiedForm } from '../Section/UnifiedForm';

const Header = React.lazy(() => import('../Header'))

const Home = () => {
  const { forms_status } = useLoaderData() as LoaderData
  
  // Check if all forms are already completed (show summary)
  const isAllFormsCompleted = forms_status.personal_information_status &&
    forms_status.address_detail_status &&
    forms_status.parent_profile_status &&
    forms_status.home_and_family_background_status &&
    forms_status.health_status &&
    forms_status.image_status &&
    forms_status.schedule_status;

  const renderContent = () => {
    // if (isUuidExpired|| !isUuidExists) {
    //   return (
    //     <Box sx={{ textAlign: 'center', padding: 3 }}>
    //       <Typography variant="h4" color="error">{apiMessage}</Typography>
    //     </Box>
    //   );
    // }

    if (isAllFormsCompleted) {
      return <Summary />;
    }

    return (
      <UnifiedFormProvider>
        <UnifiedForm />
      </UnifiedFormProvider>
    );
  };

  return (
    <React.Suspense fallback={<CustomCircularProgress />}>
      <Box
        sx={{ 
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: 'auto',
          minHeight: '100dvh',
          backgroundColor: '#e0e0e0'
        }}
      >
        <Header />
        {renderContent()}
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
  } catch (error: unknown) {
    console.error('Error loading data:', error);

    if(axios.isAxiosError(error)) {
      
      // Handle different error types based on HTTP status
      if (error.response) {
        throw {
          status: error.response.status,
          statusText: error.response.statusText,
          data: { message: error.response?.data?.message }
        };
      }
    }
  }
}
export default Home