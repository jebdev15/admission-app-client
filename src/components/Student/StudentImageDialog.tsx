import React from 'react';
import { Dialog, DialogContent, DialogTitle, DialogActions, Button, Box, Card, CardMedia, Typography, CircularProgress } from '@mui/material';

interface Props {
    open: boolean;
    onClose: () => void;
    name?: string;
    imageName?: string;
}

const StudentImageDialog: React.FC<Props> = ({ open, onClose, imageName, name }) => {
    const [imageSrc, setImageSrc] = React.useState<string>('');
    const [loading, setLoading] = React.useState<boolean>(false);
    const [error, setError] = React.useState<boolean>(false);

    React.useEffect(() => {
        setImageSrc('');
        setLoading(false);
        setError(false);
        
        if (!open || !imageName) return;
        
        setLoading(true);
        const fullUrl = `https://admission-backend.chmsu.edu.ph/uploads/${imageName?.replace(/\\/g, '/')}`;
        console.log('Full Image URL:', fullUrl);
        setImageSrc(fullUrl);
    }, [open, imageName]);

    const handleImageLoad = () => {
        setLoading(false);
        setError(false);
    };

    const handleImageError = () => {
        setLoading(false);
        setError(true);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm">
            <DialogTitle>Applicant Photo</DialogTitle>
            <DialogContent sx={{ display: 'flex', justifyContent: 'center', minHeight: 150 }}>
                {loading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4 }}>
                        <CircularProgress />
                    </Box>
                )}
                {imageSrc && !error && (
                    <Box sx={{ 
                        display: loading ? 'none' : 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        gap: 2, 
                        py: 2 
                    }}>
                        <Card sx={{ 
                            width: 200, 
                            height: 200,
                            overflow: 'hidden',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <CardMedia 
                                component="img" 
                                image={imageSrc} 
                                alt="Applicant" 
                                onLoad={handleImageLoad}
                                onError={handleImageError}
                                sx={{ 
                                    maxWidth: '100%',
                                    maxHeight: '100%',
                                    objectFit: 'contain'
                                }} 
                            />
                        </Card>
                        {name && <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{name}</Typography>}
                    </Box>
                )}
                {!loading && error && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, py: 4 }}>
                        <Typography variant="body1" color="textSecondary">No image available.</Typography>
                        {imageName && (
                            <Typography variant="caption" color="textSecondary">
                                File: {imageName}
                            </Typography>
                        )}
                    </Box>
                )}
                {!loading && !imageSrc && !error && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, py: 4 }}>
                        <Typography variant="body1" color="textSecondary">No image name provided.</Typography>
                    </Box>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default StudentImageDialog;
