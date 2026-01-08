/**
 * Image Upload Step Component
 * Part of the unified multi-step form
 */

import React, { useState } from 'react';
import {
    Box,
    Button,
    Typography,
    Card,
    CardMedia,
    Alert,
    AlertTitle,
    List,
    ListItem,
    Divider,
} from '@mui/material';
import { PhotoCamera, CameraAlt } from '@mui/icons-material';
import imageCompression from 'browser-image-compression';
import { useUnifiedForm } from '../UnifiedFormContext';

const ImageUploadStep: React.FC = () => {
    const { formData, updateFormData } = useUnifiedForm();
    const [error, setError] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            try {
                setIsProcessing(true);
                
                // Validate initial file size
                if (file.size > 2 * 1024 * 1024) {
                    setError("File size exceeds 2 MB. Compressing...");
                } else {
                    setError(null);
                }

                // Compress image
                const compressedFile = await imageCompression(file, {
                    maxSizeMB: 2,
                    maxWidthOrHeight: 1920,
                    useWebWorker: true,
                });

                // Read compressed image
                const reader = new FileReader();
                reader.onload = () => {
                    const base64Data = reader.result as string;
                    updateFormData('image', {
                        photoBase64: base64Data,
                        fileName: file.name,
                    });
                    setError(null);
                    setIsProcessing(false);
                };
                reader.readAsDataURL(compressedFile);
            } catch (err) {
                console.error(err);
                setError("Failed to process the image. Please try again.");
                setIsProcessing(false);
            }
        }
    };

    const handleRemoveImage = () => {
        updateFormData('image', null);
    };

    // Get the preview URL from the image data
    const imagePreviewUrl = formData.image?.photoBase64 || null;

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <CameraAlt sx={{ color: 'primary.main', fontSize: '2.5rem' }} />
                <Typography variant="h6" color="primary">Photo Upload</Typography>
            </Box>

            <Alert severity="info" sx={{ mb: 3 }}>
                <AlertTitle>Photo Requirements</AlertTitle>
                <List dense sx={{ py: 0 }}>
                    <ListItem sx={{ py: 0.5 }}>• Recent passport-size photo (2x2 inches)</ListItem>
                    <ListItem sx={{ py: 0.5 }}>• White background</ListItem>
                    <ListItem sx={{ py: 0.5 }}>• Clear and well-lit</ListItem>
                    <ListItem sx={{ py: 0.5 }}>• Face clearly visible, no accessories covering the face</ListItem>
                    <ListItem sx={{ py: 0.5 }}>• Maximum file size: 2 MB</ListItem>
                </List>
            </Alert>

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                }}
            >
                {imagePreviewUrl ? (
                    <Card
                        sx={{
                            width: { xs: '200px', sm: '250px' },
                            height: { xs: '200px', sm: '250px' },
                            borderRadius: 2,
                            overflow: 'hidden',
                        }}
                    >
                        <CardMedia
                            component="img"
                            image={imagePreviewUrl}
                            alt="Uploaded Photo"
                            sx={{ height: '100%', objectFit: 'cover' }}
                        />
                    </Card>
                ) : (
                    <Box
                        sx={{
                            width: { xs: '200px', sm: '250px' },
                            height: { xs: '200px', sm: '250px' },
                            border: '2px dashed',
                            borderColor: 'grey.400',
                            borderRadius: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: 'grey.100',
                        }}
                    >
                        <PhotoCamera sx={{ fontSize: 48, color: 'grey.500', mb: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                            No photo selected
                        </Typography>
                    </Box>
                )}

                <Divider sx={{ width: '100%', my: 1 }} />

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                    <Button
                        variant="contained"
                        component="label"
                        startIcon={<PhotoCamera />}
                        disabled={isProcessing}
                        sx={{ color: 'white' }}
                    >
                        {isProcessing ? 'Processing...' : imagePreviewUrl ? 'Change Photo' : 'Upload Photo'}
                        <input
                            type="file"
                            hidden
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    </Button>
                    {imagePreviewUrl && (
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={handleRemoveImage}
                        >
                            Remove
                        </Button>
                    )}
                </Box>

                {error && (
                    <Alert severity="warning" sx={{ mt: 2, width: '100%' }}>
                        {error}
                    </Alert>
                )}
            </Box>
        </Box>
    );
};

export default ImageUploadStep;
