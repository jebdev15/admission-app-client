export interface ApplicantDetails {
    _id?: number;
    applicant_id?: string;
    uuid: string;
    email: string;
    campus_to_enroll: string;
    campus_to_take_exam: string;
    college_description: string;
    course_description: string;
    admission_status?: string;
    exam_passed?: number;
    enrolled?: number;
    full_name: string;
    first_name: string;
    middle_name: string;
    last_name: string;
    date_of_birth: string;
    lrn: string;
    mobile_no: string;
    gender: string;
    province: string;
    municipality: string;
    barangay: string;
    father_name: string;
    mother_name: string;
    guardian_name: string;
    schedule_campus: string;
    schedule_location: string;
    schedule_date: string;
    schedule_time_start: string;
    schedule_time_end: string;
    schedule_time: string;
    image_name?: string;
    forms_submitted: string;
    created_at: string;
}

export type StudentApplicantsType = Pick<
  ApplicantDetails,
  | "_id"
  | "full_name"
  | "campus_to_take_exam"
  | "schedule_location"
  | "schedule_date"
  | "schedule_time_start"
  | "image_name"
> & {
  email_address?: string;
  contact_number?: string;
};