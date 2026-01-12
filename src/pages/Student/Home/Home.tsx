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

/**
 * Retry function with exponential backoff
 * For handling temporary network issues during high traffic
 */
const retryWithBackoff = async <T,>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      
      // Don't retry on client errors (4xx) - only on server errors (5xx) or network errors
      if (error.response && error.response.status >= 400 && error.response.status < 500) {
        throw error;
      }
      
      // If it's not the last attempt, wait and retry
      if (attempt < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
};

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
    // Use retry with backoff for resilience during high traffic
    const { data } = await retryWithBackoff(
      () => axiosInstance.get(`/applicants/${params.uuid}`),
      3, // max 3 retries
      1000 // 1 second base delay
    );
    
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
    
    // For network errors, throw a 500-like error
    throw {
      status: 500,
      statusText: 'Network Error',
      data: { message: 'Unable to connect to server. Please try again.' }
    };
  }
}
export default Home