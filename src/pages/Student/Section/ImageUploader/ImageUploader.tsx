import React, { useState } from "react";
import { Box, Button, Typography, Card, CardMedia, Alert, Paper, FormControl, Divider, AlertTitle, List, ListItem } from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import imageCompression from "browser-image-compression";
import { LoadingButton } from "@mui/lab";
import { useNavigate, useParams } from "react-router";
import axiosInstance from "../../../../api";

// Helper function to convert base64 to Blob
function base64ToBlob(base64: string, mimeType: string = 'image/jpeg'): Blob {
  // Ensure the base64 string is properly split into metadata and actual base64 string
  const [,base64Data] = base64.split(',');
  
  // Check if base64 data is valid
  if (!base64Data) {
    throw new Error('Invalid base64 string');
  }

  // Decode the base64 string to binary data
  const binaryString = atob(base64Data);

  // Create a byte array
  const byteArray = new Uint8Array(binaryString.length);

  // Convert binary string to byte array
  for (let i = 0; i < binaryString.length; i++) {
    byteArray[i] = binaryString.charCodeAt(i);
  }

  // Return the Blob object with the correct MIME type
  return new Blob([byteArray], { type: mimeType });
}

const ImageUploader: React.FC = () => {
  const { uuid } = useParams<{ uuid: string | undefined }>();
  const [image, setImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        // Validate initial file size
        if (file.size > 2 * 1024 * 1024) {
          setError("File size exceeds 2 MB. Compressing...");
        } else {
          setError(null);
        }

        // Compress image
        const compressedFile = await imageCompression(file, {
          maxSizeMB: 2, // Maximum size in MB
          maxWidthOrHeight: 1920, // Optional: maximum width or height
          useWebWorker: true, // Improves compression speed
        });

        // Read compressed image
        const reader = new FileReader();
        reader.onload = () => {
          setImage(reader.result as string);
          // setImage(URL.createObjectURL(file));
          setError(null); // Clear errors after successful upload
        };
        reader.readAsDataURL(compressedFile);
      } catch (err) {
        console.log(err);
        setError("Failed to process the image. Please try again.");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    const confirmation = window.confirm('Are you sure to proceed to the next form? You can\'t edit your image after proceeding.');
    if (!confirmation) return;
  
    setLoading(true);
  
    const formData = new FormData();
  
    // Check if image exists and is in base64 format
    if (image) {
      // Convert the base64 image to a Blob (if necessary)
      const blob = base64ToBlob(image); 
      // Append the Blob or File directly (no need to convert if it's already a File)
      formData.append('file', blob || image, `${uuid}.jpg`);  // Use the file object directly if available
      formData.append('uuid', uuid ?? '');
    } else {
      alert("No image to upload. Please select a file before proceeding.");
      setLoading(false);
      return;
    }
  
    try {
      const { data, status } = await axiosInstance.post('/images/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' }, });
  
      if (status) {
        setLoading(false);
        if ([200, 201, 204].includes(status)) {
          navigate('.');  // Navigate to the next page
        }
        alert(data.message)
      }
      console.log(data, status);
    } catch (error) {
      console.error("Error uploading file:", error);
      setLoading(false);
    }
  };
  
  const disableButton = !image;

  return (
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
              width: '100%',
          }}
          component="form"
          onSubmit={handleSubmit}
        >
          <Typography variant="h4" gutterBottom textAlign={'center'} sx={{ mb: 0 }}>
            Upload Your Photo
          </Typography>
          <Typography variant="h5" gutterBottom textAlign={'center'} sx={{ mb: 2 }}>
            (Max: 2 MB)
          </Typography>
          <Alert severity="info" sx={{ width: '100%', p: 2, pb: 0, borderRadius: 2, mb: 2 }}>
            <AlertTitle>Note</AlertTitle>
            <List sx={{ pt: 0 }}>
                <ListItem sx={{ pl: 0 }}>Please upload a recent and clear image of yourself. This is required for identity verification as part of the admission process.</ListItem>
            </List>
            <Typography variant="caption" color="initial"></Typography>
          </Alert> 
          <Button
            variant="contained"
            component="label"
            startIcon={<PhotoCamera />}
            sx={{ py: 1, pt: 1.3, color: "white", borderRadius: 2 }}
          >
            Upload Image
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              hidden
            />
          </Button>
          {error && (
            <Alert severity="warning" sx={{ mb: 2, maxWidth: 400 }}>
              {error}
            </Alert>
          )}
          {image && (
            <>
              <Card sx={{ maxWidth: 300, mt: 4, borderRadius: 2, overflow: 'hidden', boxShadow: 4 }}>
                <CardMedia
                  component="img"
                  image={image}
                  alt="Uploaded"
                />
              </Card>
              <Divider sx={{ my: 2 }} />
              <FormControl fullWidth>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  color="primary"
                  loading={loading}
                  disabled={disableButton}
                  sx={{ py: 1.75, pt: 2, color: "white", borderRadius: 2 }}
                >
                  {loading ? 'Submitting...' : 'Next'}
                </LoadingButton>
              </FormControl>
            </>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default ImageUploader;
