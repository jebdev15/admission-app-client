import React from 'react';
import { Dialog, DialogContent, DialogTitle, DialogActions, Button, Box, Card, CardMedia, Typography, CircularProgress } from '@mui/material';
import { VITE_API_URL } from '@constants/index';
import { SummaryService } from '@services/summaryService';

interface Props {
    open: boolean;
    onClose: () => void;
    uuid?: string | null;
    name?: string;
    email?: string;
}

const StudentImageDialog: React.FC<Props> = ({ open, onClose, uuid, name, email }) => {
    const [imageSrc, setImageSrc] = React.useState<string>('');
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        let cancelled = false;
        setImageSrc('');
        if (!open || !uuid) return;
        const controller = new AbortController();
        const fetchImageName = async () => {
            setLoading(true);
                try {
                const { data } = await SummaryService.getApplicantImage(uuid, controller.signal);
                if (!data || data.length === 0) {
                    setImageSrc('');
                    return;
                }
                const imageName = data[0].image_name;
                if (!imageName) return;
                // construct full URL to uploads (normalize backslashes)
                const fullUrl = `${VITE_API_URL}/uploads/${imageName.replace(/\\/g, '/')}`;
                if (!cancelled) setImageSrc(fullUrl);
            } catch (err) {
                if (!controller.signal.aborted) {
                    console.error('Error fetching applicant image name', err);
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        fetchImageName();
        return () => { cancelled = true; controller.abort(); };
    }, [open, uuid]);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Applicant Photo</DialogTitle>
            <DialogContent sx={{ display: 'flex', justifyContent: 'center' }}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : imageSrc ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                        <Card sx={{ width: { xs: '100%', md: 300 }, height: { xs: '100%', md: 300 } }}>
                            <CardMedia component="img" image={imageSrc} alt="Applicant" sx={{ height: '100%' }} />
                        </Card>
                        {name && <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{name}</Typography>}
                        {email && <Typography variant="body2" color="textSecondary">{email}</Typography>}
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
