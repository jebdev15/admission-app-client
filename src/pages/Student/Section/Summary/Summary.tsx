import React from 'react'
import { useParams } from 'react-router'
import { SummaryService } from '../../../../services/summaryService'
import { Celebration } from '@mui/icons-material'
import { Box, Card, CardMedia, CircularProgress, Paper, Typography } from '@mui/material'
import { FormatDateUtil } from '../../../../utils/formatDate'
import { VITE_API_URL } from '../../../../constants'

const Summary = () => {
    const { uuid } = useParams<{uuid: string | undefined}>()
    const [applicantSummaryInfo, setApplicantSummaryInfo] = React.useState<any>({})
    const [imageSrc, setImageSrc] = React.useState<string>('')
    const getApplicantSummary = async (uuid: string | undefined) => {
        const { data } = await SummaryService.getApplicantSummary(uuid)
        if(data.length > 0) {
            setApplicantSummaryInfo(data[0])
        }
    }
    const getApplicantImage = async (uuid: string | undefined) => {
        const { data } = await SummaryService.getApplicantImage(uuid)
        if(data.length > 0) {
            console.log(data[0].image_name); // Log the image path to check its type
            const imageName = data[0].image_name;
            // Construct the full URL by combining the base URL and the image path
            const fullImageUrl = `${VITE_API_URL}/uploads/${imageName.replace(/\\/g, '/')}`;
            console.log(fullImageUrl)
            
            setImageSrc(fullImageUrl); // Set the constructed URL as the image source
        }
    }
    React.useEffect(() => {
        getApplicantSummary(uuid)
        getApplicantImage(uuid)
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
                                {imageSrc ? (
                                <Box 
                                    sx={{ 
                                        display: 'flex', 
                                        justifyContent: 'center', 
                                        alignItems: 'center' 
                                    }}
                                >
                                    <Card 
                                        sx={{ 
                                            width: {xs: '100%', md: 300}, 
                                            height: {xs: '100%', md: 300}, 
                                            mt: 2 
                                        }}
                                    >
                                    <CardMedia
                                        component="img"
                                        image={imageSrc}
                                        alt="Image"
                                        sx={{ borderRadius: "4px" }}
                                        loading="lazy"
                                    />
                                    </Card>
                                </Box>
                                ) : (
                                    <Typography variant="body1" color="textSecondary">
                                        No image available.
                                    </Typography>
                                )}
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