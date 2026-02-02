import React from 'react';
import { Dialog, DialogContent, DialogTitle, DialogActions, Button, Box, Card, CardMedia, Typography, CircularProgress } from '@mui/material';
import { VITE_API_URL } from '@constants/index';
// import { SummaryService } from '@services/summaryService';

interface Props {
    open: boolean;
    onClose: () => void;
    name?: string;
    imageName?: string;
}

const StudentImageDialog: React.FC<Props> = ({ open, onClose, imageName, name }) => {
    const [imageSrc, setImageSrc] = React.useState<string>('');

    React.useEffect(() => {
        setImageSrc('');
        if (!open || !imageName) return;
        const fetchImageName = () => {
            const fullUrl = `${VITE_API_URL}/uploads/${imageName?.replace(/\\/g, '/')}`;
            console.log('Full Image URL:', fullUrl);
            setImageSrc(fullUrl);
        };
        fetchImageName();
    }, [open, imageName]);
    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Applicant Photo</DialogTitle>
            <DialogContent sx={{ display: 'flex', justifyContent: 'center' }}>
                {imageSrc ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : imageSrc ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                        <Card sx={{ width: { xs: '100%', md: 300 }, height: { xs: '100%', md: 300 } }}>
                            <CardMedia component="img" image={imageSrc} alt="Applicant" sx={{ height: '100%' }} />
                        </Card>
                        {name && <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{name}</Typography>}
                    </Box>
                ) : (
                    <Typography variant="body1" color="textSecondary">No image available.</Typography>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default StudentImageDialog;
