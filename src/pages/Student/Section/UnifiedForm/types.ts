/**
 * Unified Form Types
 * Contains all types for the multi-step form submission
 */

import { Dayjs } from "dayjs";

export interface PersonalInformationType {
    first_name: string;
    middle_name: string;
    last_name: string;
    mobile_no: string;
    lrn: string;
    date_of_birth: Dayjs | null;
    gender: string;
    civil_status: string;
    religion: string;
    other_religion: string;
    is_solo_parent: string;
    is_indigenous_group: string;
    indigenous_group: string;
    school_last_attended: string;
    type_of_school: string;
    has_scholarship_or_financial_aid: string;
    scholarship_or_financial_aid: string;
}

export interface AddressDetailsType {
    region: string;
    region_code: string;
    region_name: string;
    regione_region_name: string;
    province: string;
    province_code: string;
    province_name: string;
    city: string;
    city_code: string;
    city_name: string;
    barangay: string;
    barangay_code: string;
    barangay_name: string;
    street: string;
    is_same_as_home_address: string;
    current_address_region_code: string;
    current_address_region_name: string;
    current_address_region_region_name: string;
    current_address_province_code: string;
    current_address_province_name: string;
    current_address_city_code: string;
    current_address_city_name: string;
    current_address_barangay_code: string;
    current_address_barangay_name: string;
    current_address_street: string;
}

export interface ParentProfileType {
    father_highest_educational_attainment: string;
    father_occupation: string;
    mother_highest_educational_attainment: string;
    mother_occupation: string;
    is_living_with_guardian: string;
}

export interface HomeAndFamilyBackgroundType {
    no_of_siblings_gainfully_employed: number;
    who_finances_your_schooling: string;
    is_four_ps_beneficiary: string;
    four_ps_id_no: string;
    is_first_gen_student: string;
    household_monthly_income: string;
    nature_of_residence: string;
}

export interface HealthType {
    is_pwd: string;
    pwd_id_no: string;
    is_sped: string;
    specify_sped: string;
    has_siblings_studying_in_chmsu: string;
    has_relatives_studying_in_chmsu: string;
}

export interface ScheduleType {
    schedule_date: string;
    schedule_time: string;
}

export interface UnifiedFormData {
    personalInformation: PersonalInformationType;
    addressDetails: AddressDetailsType;
    parentProfile: ParentProfileType;
    homeAndFamilyBackground: HomeAndFamilyBackgroundType;
    health: HealthType;
    schedule: ScheduleType;
    image: ImageDataType | null; // Image data with base64 and filename
}

export interface ImageDataType {
    photoBase64: string;
    fileName: string;
}

export interface UnifiedFormContextType {
    currentStep: number;
    setCurrentStep: (step: number) => void;
    formData: UnifiedFormData;
    updateFormData: <K extends keyof UnifiedFormData>(
        section: K,
        data: Partial<UnifiedFormData[K]>
    ) => void;
    goToNextStep: () => void;
    goToPreviousStep: () => void;
    isStepValid: (step: number) => boolean;
    submitForm: () => Promise<void>;
    isSubmitting: boolean;
    submissionStatus: SubmissionStatus | null;
}

export interface SubmissionStatus {
    success: boolean;
    message: string;
    jobId?: string;
    position?: number;
    status?: 'pending' | 'processing' | 'completed' | 'failed';
    error?: string;
}

export const FORM_STEPS = [
    { id: 0, title: 'Personal Information', key: 'personalInformation' },
    { id: 1, title: 'Address Details', key: 'addressDetails' },
    { id: 2, title: 'Parent Profile', key: 'parentProfile' },
    { id: 3, title: 'Home & Family', key: 'homeAndFamilyBackground' },
    { id: 4, title: 'Health', key: 'health' },
    { id: 5, title: 'Photo Upload', key: 'image' },
    { id: 6, title: 'Schedule', key: 'schedule' },
] as const;

export const TOTAL_STEPS = FORM_STEPS.length;
