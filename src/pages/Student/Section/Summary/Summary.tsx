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
                        padding: {xs: 0, sm: 2},
                        gap: 1,
                    }}
                >
                    <Paper sx={{ width: "100%", maxWidth: "600px", borderRadius: {xs: 0, sm:2}}}>
                        <Box
                            sx={{ 
                                display: 'flex', 
                                flexDirection: 'column',
                                justifyContent: 'center', 
                                alignItems: 'center',
                                padding: {xs: 2, sm: 4},
                                gap: 1,
                                width: '100%',
                            }}
                        >
                            <Celebration sx={{ color: 'primary.main', fontSize: 50, mb: -1}}/>
                            <Typography variant="body1" color="primary" align="center" sx={{ mb: 3 }}>Thank you for submitting your application!</Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                                {imageSrc ? (
                                <Box 
                                    sx={{ 
                                        display: 'flex', 
                                        justifyContent: 'center', 
                                        alignItems: 'center', 
                                        mb: 2,
                                    }}
                                >
                                    <Card 
                                        sx={{ 
                                            width: {xs: '160px'}, 
                                            height: {xs: 'auto'},
                                            borderRadius: 2,
                                            shadow: 0,
                                        }}
                                    >
                                    <CardMedia
                                        component="img"
                                        image={imageSrc}
                                        alt="Image"
                                        loading="lazy"
                                        height="100%"
                                        width="100%"
                                    />
                                    </Card>
                                </Box>
                                ) : (
                                    <Typography variant="body1" color="textSecondary">
                                        No image available.
                                    </Typography>
                                )}
                                <Typography variant="h6" color="initial" align='center'>{applicantSummaryInfo?.name}</Typography>
                                <Typography variant="body1" color="initial" align='center' sx={{ mb: 2 }}>{applicantSummaryInfo?.email}</Typography>
                                <fieldset style={{ marginBottom: '1rem', padding: '1rem 1.25rem 1.5rem 1.25rem', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <legend style={{padding: '0 0.5rem', margin: '0 -0.5rem'}}>Application Details</legend>
                                    <Typography variant="h6" color="initial" align='center'>{applicantSummaryInfo?.course_description}</Typography>
                                    <Typography variant="body1" color="initial" align='center'>{applicantSummaryInfo?.college_description}</Typography>
                                    <Typography variant="body1" color="initial" align='center'>{applicantSummaryInfo?.campus_to_enroll} Campus</Typography>
                                </fieldset>
                                <fieldset style={{ padding: '1rem 1.25rem 1.5rem 1.25rem', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <legend style={{padding: '0 0.5rem', margin: '0 -0.5rem'}}>Examination Details</legend>
                                    <Typography variant="body2" color="initial" align='center' sx={{mb: -1}}>Where:</Typography>
                                    <Typography variant="h6" color="initial" align='center'>{applicantSummaryInfo?.location} Campus</Typography>
                                    <Typography variant="body2" color="initial" align='center' sx={{mb: -1, mt: 2}}>When:</Typography>
                                    <Typography variant="h6" color="initial" align='center'>{FormatDateUtil.formatDateOnly(applicantSummaryInfo?.schedule_date)} {applicantSummaryInfo?.schedule_time}</Typography>
                                </fieldset>
                            </Box>
                        </Box>
                    </Paper>
                </Box>
            </React.Suspense>
    )
}

export default Summary