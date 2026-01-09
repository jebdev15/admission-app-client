/**
 * Unified Form Context
 * Manages the state for the entire multi-step form
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router';
import dayjs from 'dayjs';
import {
    UnifiedFormContextType,
    UnifiedFormData,
    PersonalInformationType,
    AddressDetailsType,
    ParentProfileType,
    HomeAndFamilyBackgroundType,
    HealthType,
    ScheduleType,
    SubmissionStatus,
    TOTAL_STEPS,
} from './types';
import SubmissionService, { JobStatus, QueueResponse } from '@services/submissionService';

// Initial state for each form section
const initialPersonalInformation: PersonalInformationType = {
    first_name: '',
    middle_name: '',
    last_name: '',
    mobile_no: '',
    lrn: '',
    date_of_birth: dayjs('2000-01-01'),
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
};

const initialAddressDetails: AddressDetailsType = {
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
    street: '',
    is_same_as_home_address: '',
    current_address_region_code: '',
    current_address_region_name: '',
    current_address_region_region_name: '',
    current_address_province_code: '',
    current_address_province_name: '',
    current_address_city_code: '',
    current_address_city_name: '',
    current_address_barangay_code: '',
    current_address_barangay_name: '',
    current_address_street: '',
};

const initialParentProfile: ParentProfileType = {
    father_highest_educational_attainment: '',
    father_occupation: '',
    mother_highest_educational_attainment: '',
    mother_occupation: '',
    is_living_with_guardian: '',
};

const initialHomeAndFamilyBackground: HomeAndFamilyBackgroundType = {
    no_of_siblings_gainfully_employed: 0,
    who_finances_your_schooling: '',
    is_four_ps_beneficiary: '',
    four_ps_id_no: '',
    is_first_gen_student: '',
    household_monthly_income: '',
    nature_of_residence: '',
};

const initialHealth: HealthType = {
    is_pwd: '',
    pwd_id_no: '',
    is_sped: '',
    specify_sped: '',
    has_siblings_studying_in_chmsu: '',
    has_relatives_studying_in_chmsu: '',
};

const initialSchedule: ScheduleType = {
    schedule_date: '',
    schedule_time: '',
};

const initialFormData: UnifiedFormData = {
    personalInformation: initialPersonalInformation,
    addressDetails: initialAddressDetails,
    parentProfile: initialParentProfile,
    homeAndFamilyBackground: initialHomeAndFamilyBackground,
    health: initialHealth,
    schedule: initialSchedule,
    image: null,
};

// Create the context
const UnifiedFormContext = createContext<UnifiedFormContextType | null>(null);

// Provider component
export const UnifiedFormProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { uuid } = useParams<{ uuid: string }>();
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState<UnifiedFormData>(initialFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus | null>(null);

    // Update form data for a specific section
    const updateFormData = useCallback(<K extends keyof UnifiedFormData>(
        section: K,
        data: Partial<UnifiedFormData[K]>
    ) => {
        setFormData(prev => ({
            ...prev,
            [section]: section === 'image' ? data : { ...prev[section], ...data }
        }));
    }, []);

    // Navigate to next step
    const goToNextStep = useCallback(() => {
        if (currentStep < TOTAL_STEPS - 1) {
            setCurrentStep(prev => prev + 1);
        }
    }, [currentStep]);

    // Navigate to previous step
    const goToPreviousStep = useCallback(() => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    }, [currentStep]);

    // Validate a specific step
    const isStepValid = useCallback((step: number): boolean => {
        switch (step) {
            case 0: { // Personal Information
                const pi = formData.personalInformation;
                return !!(
                    pi.first_name &&
                    pi.last_name &&
                    pi.mobile_no &&
                    pi.lrn &&
                    pi.gender &&
                    pi.civil_status &&
                    pi.religion &&
                    pi.is_solo_parent &&
                    pi.is_indigenous_group &&
                    pi.school_last_attended &&
                    pi.type_of_school &&
                    pi.has_scholarship_or_financial_aid
                );
            }
            case 1: { // Address Details
                const ad = formData.addressDetails;
                return !!(
                    ad.region_name &&
                    ad.province_name &&
                    ad.city_name &&
                    ad.barangay_name
                );
            }
            case 2: { // Parent Profile
                const pp = formData.parentProfile;
                return !!(
                    pp.father_highest_educational_attainment &&
                    pp.father_occupation &&
                    pp.mother_highest_educational_attainment &&
                    pp.mother_occupation &&
                    pp.is_living_with_guardian
                );
            }
            case 3: { // Home and Family Background
                const hf = formData.homeAndFamilyBackground;
                return !!(
                    hf.who_finances_your_schooling &&
                    hf.is_four_ps_beneficiary &&
                    hf.is_first_gen_student &&
                    hf.household_monthly_income &&
                    hf.nature_of_residence
                );
            }
            case 4: { // Health
                const h = formData.health;
                return !!(
                    h.is_pwd &&
                    h.is_sped &&
                    h.has_siblings_studying_in_chmsu &&
                    h.has_relatives_studying_in_chmsu
                );
            }
            case 5: // Image
                return !!(formData.image?.photoBase64);
            case 6: // Schedule
                return !!(
                    formData.schedule.schedule_date &&
                    formData.schedule.schedule_time
                );
            default:
                return false;
        }
    }, [formData]);

    // Handle status updates from polling
    const handleStatusUpdate = useCallback((status: JobStatus | QueueResponse) => {
        if ('status' in status) {
            setSubmissionStatus({
                success: status.status === 'completed',
                message: status.result?.message || '',
                jobId: status.jobId,
                status: status.status,
                error: status.error,
            });
        } else {
            setSubmissionStatus({
                success: status.success,
                message: status.message,
                jobId: status.jobId,
                position: status.position,
            });
        }
    }, []);

    // Submit the complete form
    const submitForm = useCallback(async () => {
        if (!uuid) {
            alert('Invalid session. Please try again.');
            return;
        }

        setIsSubmitting(true);
        setSubmissionStatus(null);

        try {
            // Prepare submission data
            const submissionData = {
                uuid,
                personalInformation: {
                    ...formData.personalInformation,
                    date_of_birth: formData.personalInformation.date_of_birth?.format('YYYY-MM-DD'),
                },
                addressDetails: {
                    region: formData.addressDetails.region_name,
                    province: formData.addressDetails.province_name,
                    city_municipality: formData.addressDetails.city_name,
                    barangay: formData.addressDetails.barangay_name,
                    street: formData.addressDetails.street,
                    is_same_as_home_address: formData.addressDetails.is_same_as_home_address,
                    current_address_region: formData.addressDetails.current_address_region_name,
                    current_address_province: formData.addressDetails.current_address_province_name,
                    current_address_city_municipality: formData.addressDetails.current_address_city_name,
                    current_address_barangay: formData.addressDetails.current_address_barangay_name,
                    current_address_street: formData.addressDetails.current_address_street,
                },
                parentProfile: formData.parentProfile,
                homeAndFamilyBackground: formData.homeAndFamilyBackground,
                health: formData.health,
                schedule: formData.schedule,
                image: formData.image, // Base64 image data
            };

            // Submit and wait for result
            const result = await SubmissionService.submitAndWait(
                submissionData,
                handleStatusUpdate
            );

            if (result.status === 'completed' && result.result?.success) {
                setSubmissionStatus({
                    success: true,
                    message: result.result.message || 'Application submitted successfully!',
                    status: 'completed',
                });
                // Navigate to summary page after successful submission
                setTimeout(() => navigate('.'), 2000);
            } else {
                setSubmissionStatus({
                    success: false,
                    message: result.error || 'Submission failed',
                    status: 'failed',
                    error: result.error,
                });
            }
        } catch (error: unknown) {
            console.error('Submission error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to submit application';
            setSubmissionStatus({
                success: false,
                message: errorMessage,
                status: 'failed',
                error: errorMessage,
            });
        } finally {
            setIsSubmitting(false);
        }
    }, [uuid, formData, navigate, handleStatusUpdate]);

    const contextValue: UnifiedFormContextType = {
        currentStep,
        setCurrentStep,
        formData,
        updateFormData,
        goToNextStep,
        goToPreviousStep,
        isStepValid,
        submitForm,
        isSubmitting,
        submissionStatus,
    };

    return (
        <UnifiedFormContext.Provider value={contextValue}>
            {children}
        </UnifiedFormContext.Provider>
    );
};

// Custom hook to use the form context
export const useUnifiedForm = (): UnifiedFormContextType => {
    const context = useContext(UnifiedFormContext);
    if (!context) {
        throw new Error('useUnifiedForm must be used within a UnifiedFormProvider');
    }
    return context;
};

export default UnifiedFormContext;
