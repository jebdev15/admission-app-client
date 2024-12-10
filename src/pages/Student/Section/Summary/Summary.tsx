import React from 'react'
import { useParams } from 'react-router'
import { SummaryService } from '../../../../services/summaryService'
import { Celebration } from '@mui/icons-material'
import { Alert, AlertTitle, Box, Button, Card, CardMedia, CircularProgress, List, ListItem, Paper, Typography } from '@mui/material'
import { FormatDateUtil } from '../../../../utils/formatDate'
import { VITE_API_URL } from '../../../../constants'
import { QRCodeSVG } from 'qrcode.react'

const Summary = () => {
    const { uuid } = useParams<{ uuid: string | undefined }>()
    const [applicantSummaryInfo, setApplicantSummaryInfo] = React.useState<any>({})
    const [imageSrc, setImageSrc] = React.useState<string>('')
    const getApplicantSummary = async (uuid: string | undefined) => {
        const { data } = await SummaryService.getApplicantSummary(uuid)
        if (data.length > 0) {
            setApplicantSummaryInfo(data[0])
        }
    }
    const getApplicantImage = async (uuid: string | undefined) => {
        const { data } = await SummaryService.getApplicantImage(uuid)
        if (data.length > 0) {
            const imageName = data[0].image_name;
            // Construct the full URL by combining the base URL and the image path
            const fullImageUrl = `${VITE_API_URL}/uploads/${imageName.replace(/\\/g, '/')}`;

            setImageSrc(fullImageUrl); // Set the constructed URL as the image source
        }
    }
    const qrValue = `${VITE_API_URL}/home/${uuid}`; // Replace with your value
    const containerRef = React.useRef<HTMLDivElement | null>(null);

    const handleDownload = () => {
        if (!containerRef.current) return;

        const svgElement = containerRef.current.querySelector('svg');
        if (!svgElement) return;

        const svgData = new XMLSerializer().serializeToString(svgElement);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);

        const url = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = url;
        a.download = `${applicantSummaryInfo?.name}-QRCode.png`;
        a.click();
        };

        img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
    };

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
                    padding: { xs: 0, sm: 2 },
                    gap: 1,
                }}
            >
                <Paper sx={{ width: "100%", maxWidth: "600px", borderRadius: { xs: 0, sm: 2 } }}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: { xs: 2, sm: 4 },
                            gap: 1,
                            width: '100%',
                        }}
                    >
                        <Celebration sx={{ color: 'primary.main', fontSize: 50, mb: -1 }} />
                        <Typography variant="h6" color="primary" align="center" sx={{ mb: 3 }}>Admission Test slot reserved!</Typography>
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
                                            width: { xs: '160px' },
                                            height: { xs: 'auto' },
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
                            <Typography variant="body1" color="initial" align='center' sx={{ mb: 2 }}>LRN: {applicantSummaryInfo?.lrn}</Typography>
                            <fieldset style={{ marginBottom: '1rem', padding: '1rem 1.25rem 1.5rem 1.25rem', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <legend style={{ padding: '0 0.5rem', margin: '0 -0.5rem' }}>Admission Details</legend>
                                <Typography variant="h6" color="initial" align='center'>{applicantSummaryInfo?.course_description}</Typography>
                                <Typography variant="body1" color="initial" align='center'>{applicantSummaryInfo?.college_description}</Typography>
                                <Typography variant="body1" color="initial" align='center'>{applicantSummaryInfo?.campus_to_enroll} Campus</Typography>
                            </fieldset>
                            <fieldset style={{ padding: '1rem 1.25rem 1.5rem 1.25rem', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <legend style={{ padding: '0 0.5rem', margin: '0 -0.5rem' }}>Examination Details</legend>
                                <Typography variant="body2" color="initial" align='center' sx={{ mb: -1 }}>Where:</Typography>
                                <Typography variant="h6" color="initial" align='center'>{applicantSummaryInfo?.location} Campus</Typography>
                                <Typography variant="body2" color="initial" align='center' sx={{ mb: -1, mt: 2 }}>When:</Typography>
                                <Typography variant="h6" color="initial" align='center'>{FormatDateUtil.formatDateOnly(applicantSummaryInfo?.schedule_date)} {applicantSummaryInfo?.schedule_time}</Typography>
                                <Typography variant="body1" color="initial">The verified examinees will take the CHMSU Admission Test on their reserved dates in their chosen exam venues.</Typography>
                                <Typography variant="body1" color="initial">Kindly bring the following:</Typography>
                                <Alert severity="info" sx={{ width: '100%', p: 2, pb: 0, borderRadius: 2, mt: 2 }}>
                                    <AlertTitle>What to bring</AlertTitle>
                                    <List sx={{ pt: 0 }}>
                                        <ListItem sx={{ pl: 0 }}>Duly Accomplished Application Form (to be distributed and filled out on-site)</ListItem>
                                        <ListItem sx={{ pl: 0 }}>Learner’s Reference Number</ListItem>
                                        <ListItem sx={{ pl: 0 }}>2 pieces 2×2 ID Picture</ListItem>
                                        <ListItem sx={{ pl: 0 }}>1 long brown envelope</ListItem>
                                        <ListItem sx={{ pl: 0 }}>Black ballpen, eraser, and pencil</ListItem>
                                        <ListItem sx={{ pl: 0 }}>Proof of your successful registration (screenshot or active webpage)</ListItem>
                                    </List>
                                    <Typography variant="caption" color="initial"></Typography>
                                </Alert>
                                <Typography variant="body1" color="initial"><strong>Reminders:</strong> Be at your assigned testing room at least 45 minutes before the start of the test. Wear your face masks.</Typography>
                                <Typography variant="body1" color="initial">For further queries and clarifications, please send a message to the CHMSU Compassion Facebook Page. You may also contact the CHMSU Office of the Guidance Services via email at guidance.talisay@chmsu.edu.ph or call (034) 454 0529 / 454 0584 loc. 136.</Typography>
                            </fieldset>
                            <Button variant="contained" color="primary" fullWidth sx={{ my: 2, color: 'white' }} onClick={handleDownload}>Download QR Code</Button>
                            <div
                                style={{
                                    height: "auto",
                                    margin: "16px auto",
                                    maxWidth: 128, // Restrict the maximum width of the QR code
                                    width: "100%", // Make it responsive
                                    visibility: "hidden"
                                }}
                                ref={containerRef}
                            >
                               <QRCodeSVG
                                    value={qrValue}
                                    size={256}
                                    bgColor="#ffffff"
                                    fgColor="#000000"
                                    // imageSettings={{
                                    //     src: "../../assets/chmsu-small.jpg/150", // Replace with your logo URL
                                    //     height: 50, // Logo height
                                    //     width: 50, // Logo width
                                    //     excavate: true, // Ensures the logo does not block important parts of the QR code
                                    // }}
                                />
                            </div>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </React.Suspense>
    )
}

export default Summary