import { Dayjs } from "dayjs";

export interface PersonalInformationType {
    first_name: string,
    middle_name: string,
    last_name: string,
    mobile_no: string,
    lrn: string,
    date_of_birth: Dayjs | null,
    gender: string,
    civil_status: string,
    religion: string,
    other_religion: string,
    is_solo_parent: string,
    is_indigenous_group: string,
    indigenous_group: string,
    school_last_attended: string,
    type_of_school: string,
    has_scholarship_or_financial_aid: string,
    scholarship_or_financial_aid: string,
}