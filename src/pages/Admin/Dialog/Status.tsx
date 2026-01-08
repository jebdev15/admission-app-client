import { Box, Dialog, DialogContent, FormControl, FormLabel, Select, MenuItem, Typography, CardMedia, Card, Button, SelectChangeEvent } from '@mui/material'
import React from 'react'
import axiosInstance from '../../../api'
import axios from 'axios';
import { ProtectedRouteContext } from '../ProtectedRoute';

const Status = (data: any) => {
    const { accessToken, refreshApplicants } = React.useContext(ProtectedRouteContext)
    const { open, onClose, action, selectedData } = data
    const { name, imageName, emailAddress, uuid } = selectedData
    const [imageSrc, setImageSrc] = React.useState<string>('');
    const [admissionStatus, setAdmissionStatus] = React.useState('pending');
    const [programStatus, setProgramStatus] = React.useState('pending');
    const [loading, setLoading] = React.useState(true);
    const handleOpenReservationLink = (link: string) => window.open(link, "_blank", `width=800,height=600,left=${(window.screen.width - 800) / 2},top=${(window.screen.height - 600) / 2}`)
    const handleChange = (event: SelectChangeEvent<string>) => {
        if (action === "Admission") {
            setAdmissionStatus(event.target.value);
        } else if (action === "Program") {
            setProgramStatus(event.target.value);
        }
    }
    const handleUpdateStatus = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if (action === "Admission") {
                const response = await axiosInstance.put(`/admin/admission-status/${uuid}`,
                    {
                        admissionStatus,
                    },
                    {
                        headers: {
                            "Authorization": `Bearer ${accessToken}`
                        },
                    }
                );
                alert(response.data.message);
            } else if (action === "Program") {
                const response = await axiosInstance.put(`/admin/program-status/${uuid}`,
                    {
                        programStatus
                    },
                    {
                        headers: {
                            "Authorization": `Bearer ${accessToken}`
                        },
                    }
                );
                alert(response.data.message);
            }
            refreshApplicants()
            onClose();
        } catch (error: any) {
            console.error('Error updating status:', error);
            alert(error.response.data.message);
            onClose();
        }
    }

    React.useEffect(() => {
        setImageSrc('');
        setAdmissionStatus('');
        setProgramStatus('');
        const controller = new AbortController();
        const signal = controller.signal;
        const fetchImage = async (signal: any) => {
            try {
                if(!signal.aborted) {
                    const response = await axiosInstance.get(`/uploads/${imageName}`, { responseType: 'blob', signal });
                    const imageUrl = URL.createObjectURL(response.data);
                    setImageSrc(imageUrl);
                }
            } catch (error) {
                if(axios.isCancel(error)) {
                    console.log('Request image cancelled', error)
                } else {
                    console.error('Error fetching image:', error);
                }
            } finally {
                controller.abort()
                setLoading((prevState) => !prevState)
            }
        }
        const fetchApplicantStatus = async (signal: any) => {
            try {
                const response = await axiosInstance.get(`/admin/applicant-status/${uuid}`,
                    {
                        headers: {
                            "Authorization": `Bearer ${accessToken}`
                        },
                        signal
                    },
                );
                setAdmissionStatus(response.data[0].admission_status);
                setProgramStatus(response.data[0].program_status);
                fetchImage(signal);
            } catch (error) {
                if(axios.isCancel(error)) {
                    console.log('Request applicant status cancelled', error)
                } else {
                    console.error('Error fetching admission status:', error);
                }
            } finally {
                controller.abort()
            }
        }
        fetchApplicantStatus(signal);
        return () => controller.abort()
    }, [imageName, uuid])
    return (
        <React.Suspense fallback={<div>loading...</div>}>
            <Dialog
                open={open}
                onClose={onClose}
            >
                <DialogContent sx={{ width: { xs: '100%', md: '500px' } }}>
                    {loading ? (
                        <Typography variant="body1" color="initial">Loading...</Typography>
                    ): (
                        <>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexDirection: 'column',
                                gap: 0,
                                mb: 2,
                            }}
                        >
                            <Card
                                sx={{
                                    width: { xs: '100%', md: '250px' },
                                    height: { xs: '100%', md: '250px' },
                                    borderRadius: 2,
                                    shadow: 0,
                                }}
                            >
                                {imageSrc ? (
                                    <CardMedia
                                        component="img"
                                        image={imageSrc}
                                        alt="Image"
                                        loading="lazy"
                                        height="100%"
                                        width="100%"
                                    />
                                ) : (
                                    <Typography textAlign={"center"} variant="body1" color="textSecondary">
                                        No image available.
                                    </Typography>
                                )}
                            </Card>
                            <Button onClick={() => handleOpenReservationLink(`https://admission2025.chmsu.edu.ph/home/${uuid}`)}>
                                <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                                    {name}
                                </Typography>
                            </Button>
                            <Typography variant="body1" color="textSecondary">
                                (Click the name to open reservation link)
                            </Typography>
                            <Typography variant="body1" color="textSecondary">
                                {emailAddress}
                            </Typography>
                        </Box>
                        <Box
                            component="form"
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                gap: 2,
                                // width: '100%' 
                            }}
                            onSubmit={handleUpdateStatus}
                        >
                            {action === "Admission" && (
                                <FormControl fullWidth>
                                    <FormLabel htmlFor='admissionStatus'>Status</FormLabel>
                                    <Select
                                        label="Status"
                                        id="admissionStatus"
                                        name="admissionStatus"
                                        value={admissionStatus}
                                        onChange={handleChange}
                                        disabled={action !== "Admission"}
                                    >
                                        <MenuItem value="pending"></MenuItem>
                                        <MenuItem value="passed">Passed</MenuItem>
                                        <MenuItem value="failed">Failed</MenuItem>
                                    </Select>
                                </FormControl>
                            )}
                            {action === "Program" && (
                                <FormControl fullWidth>
                                    <FormLabel htmlFor='programStatus'>Status</FormLabel>
                                    <Select
                                        label="Status"
                                        id="programStatus"
                                        name="programStatus"
                                        value={programStatus}
                                        onChange={handleChange}
                                        disabled={action !== "Program"}
                                    >
                                        <MenuItem value="pending"></MenuItem>
                                        <MenuItem value="accepted">Accepted</MenuItem>
                                    </Select>
                                </FormControl>
                            )}
                            <Button variant="contained" type='submit'>Save</Button>
                        </Box>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </React.Suspense>
    )
}

export default React.memo(Status)