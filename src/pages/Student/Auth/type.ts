export interface LoginContextType {
    dataPrivacyPolicy: {
        agreed: boolean
        open: boolean
    },
    functions: {
        closeModal?: () => void
        openModal?: () => void
        setAgreed?: () => void
    }
}

export interface LoginContextProviderProps {
    children: React.ReactNode
}  

interface CourseDetails {
    course_code: string;
    campuses: string[];
}

interface Course {
    [courseName: string]: CourseDetails | undefined;
}

interface College {
    courses: Course[];
}

export interface Colleges {
    [collegeName: string]: College;
}