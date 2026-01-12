/**
 * Unified Form Context
 * Manages the state for the entire multi-step form
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
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
import { PersonalInformationService } from '@services/personalInformationService';

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
    is_solo_parent: 'No',
    is_pwd: 'No',
    pwd_id_no: '',
    is_indigenous_group: 'No',
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
    region_region_name: '',
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

    // Fetch initial applicant info on mount
    const hasFetchedInitialInfo = React.useRef(false);
    useEffect(() => {
        // Skip if already fetched or no uuid
        if (hasFetchedInitialInfo.current || !uuid) {
            return;
        }
        
        // Mark as fetched immediately to prevent race conditions
        hasFetchedInitialInfo.current = true;
        
        const fetchInitialInfo = async () => {
            try {
                const initialInfo = await PersonalInformationService.getInitialApplicantInfo(uuid);
                if (initialInfo) {
                    setFormData(prev => ({
                        ...prev,
                        personalInformation: {
                            ...prev.personalInformation,
                            first_name: initialInfo.first_name || '',
                            last_name: initialInfo.last_name || '',
                            date_of_birth: initialInfo.date_of_birth ? dayjs(initialInfo.date_of_birth) : dayjs('2000-01-01'),
                        }
                    }));
                }
            } catch (error) {
                console.error('Error fetching initial info:', error);
            }
        };
        
        fetchInitialInfo();
    }, [uuid]);

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
                const baseValid = !!(
                    pi.first_name &&
                    pi.last_name &&
                    pi.mobile_no &&
                    pi.mobile_no.length === 11 && // Must be exactly 11 digits
                    pi.lrn &&
                    pi.gender &&
                    pi.civil_status &&
                    pi.religion &&
                    pi.school_last_attended &&
                    pi.type_of_school &&
                    pi.has_scholarship_or_financial_aid
                );
                
                // Conditional validations
                const pwdValid = pi.is_pwd !== 'Yes' || !!(pi.is_pwd === 'Yes' && pi.pwd_id_no);
                const indigenousValid = pi.is_indigenous_group !== 'Yes' || !!(pi.is_indigenous_group === 'Yes' && pi.indigenous_group);
                const scholarshipValid = pi.has_scholarship_or_financial_aid !== 'Yes' || !!(pi.has_scholarship_or_financial_aid === 'Yes' && pi.scholarship_or_financial_aid);
                const religionValid = pi.religion !== 'Others' || !!(pi.religion === 'Others' && pi.other_religion);
                
                return baseValid && pwdValid && indigenousValid && scholarshipValid && religionValid;
            }
            case 1: { // Address Details
                const ad = formData.addressDetails;
                const permanentAddressValid = !!(
                    ad.region_name &&
                    ad.province_name &&
                    ad.city_name &&
                    ad.barangay_name &&
                    ad.street &&
                    ad.is_same_as_home_address
                );
                
                // If current address is different, validate current address fields too
                if (ad.is_same_as_home_address === 'No') {
                    const currentAddressValid = !!(
                        ad.current_address_region_name &&
                        ad.current_address_province_name &&
                        ad.current_address_city_name &&
                        ad.current_address_barangay_name &&
                        ad.current_address_street
                    );
                    return permanentAddressValid && currentAddressValid;
                }
                
                return permanentAddressValid;
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
                const baseValid = !!(
                    hf.who_finances_your_schooling &&
                    hf.is_four_ps_beneficiary &&
                    hf.is_first_gen_student &&
                    hf.household_monthly_income &&
                    hf.nature_of_residence
                );
                
                // Conditional validation for 4Ps ID
                const fourPsValid = hf.is_four_ps_beneficiary !== 'Yes' || !!(hf.is_four_ps_beneficiary === 'Yes' && hf.four_ps_id_no);
                
                return baseValid && fourPsValid;
            }
            case 4: { // Health
                const h = formData.health;
                const baseValid = !!(
                    h.is_sped &&
                    h.has_siblings_studying_in_chmsu &&
                    h.has_relatives_studying_in_chmsu
                );
                
                // Conditional validation for SPED category
                const spedValid = h.is_sped !== 'Yes' || !!(h.is_sped === 'Yes' && h.specify_sped);
                
                return baseValid && spedValid;
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
            console.error('Invalid session: UUID is missing');
            return;
        }

        setIsSubmitting(true);
        setSubmissionStatus(null);

        try {
            // Prepare personal information (exclude dayjs object and format date)
            const { date_of_birth, ...restPersonalInfo } = formData.personalInformation;
            
            // Prepare submission data - ensure all fields match database schema
            const submissionData = {
                uuid,
                // personal_information table - most fields nullable except first_name, last_name
                personalInformation: {
                    first_name: restPersonalInfo.first_name,
                    middle_name: restPersonalInfo.middle_name || null,
                    last_name: restPersonalInfo.last_name,
                    mobile_no: restPersonalInfo.mobile_no || null,
                    lrn: restPersonalInfo.lrn || null,
                    date_of_birth: date_of_birth ? date_of_birth.format('YYYY-MM-DD') : null,
                    gender: restPersonalInfo.gender || null,
                    civil_status: restPersonalInfo.civil_status || null,
                    religion: restPersonalInfo.religion || null,
                    other_religion: restPersonalInfo.other_religion || null,
                    is_solo_parent: restPersonalInfo.is_solo_parent || 'No',
                    is_pwd: restPersonalInfo.is_pwd || 'No',
                    pwd_id_no: restPersonalInfo.pwd_id_no || '',
                    is_indigenous_group: restPersonalInfo.is_indigenous_group || 'No',
                    indigenous_group: restPersonalInfo.indigenous_group || null,
                    school_last_attended: restPersonalInfo.school_last_attended || null,
                    type_of_school: restPersonalInfo.type_of_school || null,
                    has_scholarship_or_financial_aid: restPersonalInfo.has_scholarship_or_financial_aid || null,
                    scholarship_or_financial_aid: restPersonalInfo.scholarship_or_financial_aid || null,
                },
                // address_details table - region/province/street/is_same_as_home_address are NOT NULL
                addressDetails: {
                    region_code: formData.addressDetails.region_code,
                    region_name: formData.addressDetails.region_name,
                    region_region_name: formData.addressDetails.region_region_name || '',
                    province_code: formData.addressDetails.province_code,
                    province_name: formData.addressDetails.province_name,
                    city_code: formData.addressDetails.city_code || null,
                    city_name: formData.addressDetails.city_name || null,
                    barangay_code: formData.addressDetails.barangay_code || null,
                    barangay_name: formData.addressDetails.barangay_name || null,
                    street: formData.addressDetails.street,
                    is_same_as_home_address: formData.addressDetails.is_same_as_home_address,
                    current_address_region_code: formData.addressDetails.current_address_region_code || null,
                    current_address_region_name: formData.addressDetails.current_address_region_name || null,
                    current_address_region_region_name: formData.addressDetails.current_address_region_region_name || null,
                    current_address_province_code: formData.addressDetails.current_address_province_code || null,
                    current_address_province_name: formData.addressDetails.current_address_province_name || null,
                    current_address_city_code: formData.addressDetails.current_address_city_code || null,
                    current_address_city_name: formData.addressDetails.current_address_city_name || null,
                    current_address_barangay_code: formData.addressDetails.current_address_barangay_code || null,
                    current_address_barangay_name: formData.addressDetails.current_address_barangay_name || null,
                    current_address_street: formData.addressDetails.current_address_street || null,
                },
                // parent_profiles table - all fields NOT NULL
                parentProfile: {
                    father_highest_educational_attainment: formData.parentProfile.father_highest_educational_attainment,
                    father_occupation: formData.parentProfile.father_occupation,
                    mother_highest_educational_attainment: formData.parentProfile.mother_highest_educational_attainment,
                    mother_occupation: formData.parentProfile.mother_occupation,
                    is_living_with_guardian: formData.parentProfile.is_living_with_guardian,
                },
                // home_and_family_backgrounds table - all fields NOT NULL (four_ps_id_no needs empty string if not provided)
                homeAndFamilyBackground: {
                    no_of_siblings_gainfully_employed: formData.homeAndFamilyBackground.no_of_siblings_gainfully_employed || 0,
                    who_finances_your_schooling: formData.homeAndFamilyBackground.who_finances_your_schooling,
                    is_four_ps_beneficiary: formData.homeAndFamilyBackground.is_four_ps_beneficiary,
                    four_ps_id_no: formData.homeAndFamilyBackground.four_ps_id_no || '',
                    is_first_gen_student: formData.homeAndFamilyBackground.is_first_gen_student,
                    household_monthly_income: formData.homeAndFamilyBackground.household_monthly_income,
                    nature_of_residence: formData.homeAndFamilyBackground.nature_of_residence,
                },
                // health table - all fields NOT NULL (specify_sped needs empty string if not provided)
                health: {
                    is_sped: formData.health.is_sped,
                    specify_sped: formData.health.specify_sped || '',
                    has_siblings_studying_in_chmsu: formData.health.has_siblings_studying_in_chmsu,
                    has_relatives_studying_in_chmsu: formData.health.has_relatives_studying_in_chmsu,
                },
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
