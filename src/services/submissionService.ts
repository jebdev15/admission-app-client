/**
 * Submission Service
 * Handles direct form submissions
 */

import axiosInstance from "@api/index";

export interface ImageData {
    photoBase64: string;
    fileName: string;
}

export interface SubmissionData {
    uuid: string;
    personalInformation?: {
        first_name: string;
        middle_name?: string | null;
        last_name: string;
        suffix?: string | null;
        lrn?: string | null;
        date_of_birth?: string | null;
        place_of_birth?: string | null;
        gender?: string | null;
        civil_status?: string | null;
        nationality?: string | null;
        religion?: string | null;
        other_religion?: string | null;
        mobile_no?: string | null;
        student_type?: string | null;
        strand?: string | null;
        track?: string | null;
        is_solo_parent?: string | null;
        is_pwd?: string | null;
        pwd_id_no?: string | null;
        is_indigenous_group?: string | null;
        indigenous_group?: string | null;
        school_last_attended?: string | null;
        type_of_school?: string | null;
        has_scholarship_or_financial_aid?: string | null;
        scholarship_or_financial_aid?: string | null;
    };
    addressDetails?: {
        region_code?: string | null;
        region_name?: string | null;
        region_region_name?: string | null;
        province_code?: string | null;
        province_name?: string | null;
        city_code?: string | null;
        city_name?: string | null;
        barangay_code?: string | null;
        barangay_name?: string | null;
        street?: string | null;
        is_same_as_home_address?: string | null;
        current_address_region_code?: string | null;
        current_address_region_name?: string | null;
        current_address_region_region_name?: string | null;
        current_address_province_code?: string | null;
        current_address_province_name?: string | null;
        current_address_city_code?: string | null;
        current_address_city_name?: string | null;
        current_address_barangay_code?: string | null;
        current_address_barangay_name?: string | null;
        current_address_street?: string | null;
    };
    parentProfile?: {
        father_highest_educational_attainment?: string;
        father_occupation?: string;
        mother_highest_educational_attainment?: string;
        mother_occupation?: string;
        is_living_with_guardian?: string;
    };
    homeAndFamilyBackground?: {
        no_of_siblings_gainfully_employed?: number;
        who_finances_your_schooling?: string;
        is_four_ps_beneficiary?: string;
        four_ps_id_no?: string;
        is_first_gen_student?: string;
        household_monthly_income?: string;
        nature_of_residence?: string;
    };
    health?: {
        is_sped?: string;
        specify_sped?: string;
        has_siblings_studying_in_chmsu?: string;
        has_relatives_studying_in_chmsu?: string;
    };
    schedule?: {
        schedule_date: string;
        schedule_time: string;
    };
    image?: ImageData | null;
}

export interface SubmissionResponse {
    success: boolean;
    message: string;
    uuid?: string;
    errors?: string[];
    error?: string;
}

/**
 * SubmissionService - handles direct form submissions
 */
export const SubmissionService = {
    /**
     * Submit complete application form
     */
    submitApplication: async (data: SubmissionData): Promise<SubmissionResponse> => {
        try {
            const response = await axiosInstance.post('/submissions/submit', data);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                return error.response.data;
            }
            throw error;
        }
    }
};

export default SubmissionService;
