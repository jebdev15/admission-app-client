import React from 'react'
import { useParams } from 'react-router'
import { SummaryService } from '../../../../services/summaryService'
import { Celebration } from '@mui/icons-material'
import { Box, CircularProgress, Paper, Typography } from '@mui/material'
import { FormatDateUtil } from '../../../../utils/formatDate'

const Summary = () => {
    const { uuid } = useParams<{uuid: string | undefined}>()
    const [applicantSummaryInfo, setApplicantSummaryInfo] = React.useState<any>({})
    React.useEffect(() => {
        const getApplicantSummary = async (uuid) => {
            const { data } = await SummaryService.getApplicantSummary(uuid)
            if(data.length > 0) {
                setApplicantSummaryInfo(data[0])
            }
        }
        getApplicantSummary(uuid)
    }, [uuid])
    return (
        <React.Suspense fallback={<CircularProgress />}>
                <Box
                    sx={{ 
                        display: 'flex', 
                        flexDirection: 'column',
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        height: '100%',
                        padding: '1rem',
                        width: { xs: '100%', md: '678px'},
                        gap: 1
                    }}
                >
                    <Paper sx={{ width: { xs: '100%', md: '678px'}, }}>
                        <Box
                            sx={{ 
                                display: 'flex', 
                                flexDirection: 'column',
                                justifyContent: 'center', 
                                alignItems: 'center', 
                                padding: '1rem',
                                gap: 1
                            }}
                        >
                            <Celebration />
                            <Typography variant="h6" color="initial" textAlign={'center'}>Thank you for submitting your application!</Typography>
                            <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Typography variant="body1" color="initial">Name: {applicantSummaryInfo?.name}</Typography>
                                <Typography variant="body1" color="initial">Email Address: {applicantSummaryInfo?.email}</Typography>
                                <Typography variant="body1" color="initial">Campus To Enroll: {applicantSummaryInfo?.campus_to_enroll}</Typography>
                                <Typography variant="body1" color="initial">Campus To Take Exam: {applicantSummaryInfo?.campus_to_take_exam}</Typography>
                                <Typography variant="body1" color="initial">College :{applicantSummaryInfo?.college_description}</Typography>
                                <Typography variant="body1" color="initial">Course/Program :{applicantSummaryInfo?.course_description}</Typography>
                                <Typography variant="body1" color="initial">Date & Time of Examination</Typography>
                                <Typography variant="body1" color="initial"> {FormatDateUtil.formatDateOnly(applicantSummaryInfo?.schedule_date)} {applicantSummaryInfo?.schedule_time}</Typography>
                            </Box>
                        </Box>
                    </Paper>
                </Box>
            </React.Suspense>
    )
}

export default Summary