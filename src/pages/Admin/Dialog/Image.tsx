import React from 'react'
import axiosInstance from '@api/index';
import CustomCircularProgress from '@components/CustomCircularProgress';
import { Box, Card, CardMedia, Dialog, DialogContent, Typography } from '@mui/material';

const Image = ({open, onClose, data}: any) => {
    const { name, imageName, emailAddress } = data
    const [imageSrc, setImageSrc] = React.useState<string>('');
    React.useEffect(() => {
        setImageSrc('');
        const fetchImage = async () => {
            try {
                const response = await axiosInstance.get(`/uploads/${imageName}`, { responseType: 'blob' });
                const imageUrl = URL.createObjectURL(response.data);
                setImageSrc(imageUrl);
            } catch (error) {
                console.error('Error fetching image:', error);
            }
        }
        fetchImage();
    },[imageName])
    return (
        <React.Suspense fallback={<CustomCircularProgress />}>
            <Dialog open={open} onClose={onClose} maxWidth="md">
                <DialogContent sx={{ display: 'flex', justifyContent: 'center' }}>
                    {imageSrc ? (
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
                                <CardMedia
                                    component="img"
                                    image={imageSrc}
                                    alt="Image"
                                    loading="lazy"
                                    height="100%"
                                    width="100%"
                                />
                            </Card>
                            <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                                {name}
                            </Typography>
                            <Typography variant="body1" color="textSecondary">
                                {emailAddress}
                            </Typography>
                        </Box>
                    ) : (
                        <Typography variant="body1" color="textSecondary">
                            No image available.
                        </Typography>
                    )}
                </DialogContent>
            </Dialog>
        </React.Suspense>
    )
}

export default Image