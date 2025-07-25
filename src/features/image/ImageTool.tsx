import React, { useState, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  Paper,
  TextField,
  Grid,
  Divider,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ImageIcon from '@mui/icons-material/Image';
import CodeIcon from '@mui/icons-material/Code';
import { ResultCard } from '../../shared/components/ResultCard';

const ImageTool: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [base64Result, setBase64Result] = useState<string>('');
  const [base64Input, setBase64Input] = useState<string>('');
  const [convertedImage, setConvertedImage] = useState<string>('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
        setError('');
        
        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setError('Please select a valid image file');
      }
    }
  };

  const handleConvertToBase64 = () => {
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setBase64Result(base64);
      setSuccess('Image converted to Base64 successfully!');
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleConvertFromBase64 = () => {
    if (!base64Input.trim()) {
      setError('Please enter a Base64 string');
      return;
    }

    try {
      // Check if it's a data URL or just base64 string
      let base64Data = base64Input.trim();
      
      // If it doesn't start with data:, add the data URL prefix for common image types
      if (!base64Data.startsWith('data:')) {
        // Try to determine the format, default to PNG
        base64Data = `data:image/png;base64,${base64Data}`;
      }

      // Validate base64 by creating an image
      const img = new Image();
      img.onload = () => {
        setConvertedImage(base64Data);
        setSuccess('Base64 converted to image successfully!');
        setError('');
      };
      img.onerror = () => {
        setError('Invalid Base64 string. Please check the format.');
      };
      img.src = base64Data;
    } catch (err) {
      setError('Invalid Base64 string. Please check the format.');
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreview('');
    setBase64Result('');
    setBase64Input('');
    setConvertedImage('');
    setError('');
    setSuccess('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Image Utilities
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Grid container spacing={3}>
        {/* Image to Base64 Section */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: 'fit-content' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ImageIcon />
                Image to Base64
              </Typography>
              
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
                ref={fileInputRef}
              />
              
              <Button
                variant="contained"
                startIcon={<CloudUploadIcon />}
                onClick={handleUploadClick}
                sx={{ mb: 2 }}
                fullWidth
              >
                Select Image
              </Button>

              {selectedFile && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                  </Typography>
                </Box>
              )}

              <Button
                variant="contained"
                onClick={handleConvertToBase64}
                disabled={!selectedFile}
                fullWidth
                sx={{ mb: 2 }}
              >
                Convert to Base64
              </Button>

              {preview && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" gutterBottom>Preview:</Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center', border: '1px solid #e0e0e0', borderRadius: 1, p: 1 }}>
                    <img
                      src={preview}
                      alt="Preview"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '200px',
                        objectFit: 'contain'
                      }}
                    />
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Base64 to Image Section */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: 'fit-content' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CodeIcon />
                Base64 to Image
              </Typography>
              
              <TextField
                multiline
                rows={6}
                fullWidth
                label="Base64 String"
                placeholder="Paste your Base64 string here (with or without data:image prefix)"
                value={base64Input}
                onChange={(e) => setBase64Input(e.target.value)}
                sx={{ mb: 2 }}
              />

              <Button
                variant="contained"
                onClick={handleConvertFromBase64}
                disabled={!base64Input.trim()}
                fullWidth
                sx={{ mb: 2 }}
              >
                Convert to Image
              </Button>

              {convertedImage && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" gutterBottom>Converted Image:</Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center', border: '1px solid #e0e0e0', borderRadius: 1, p: 1 }}>
                    <img
                      src={convertedImage}
                      alt="Converted"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '200px',
                        objectFit: 'contain'
                      }}
                    />
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Action Buttons */}
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
        <Button variant="outlined" onClick={handleClear}>
          Clear All
        </Button>
      </Box>

      {/* Results Section */}
      {base64Result && (
        <Box sx={{ mt: 3 }}>
          <ResultCard
            title="Base64 Result"
            content={base64Result}
            maxHeight={300}
          />
        </Box>
      )}
    </Box>
  );
};

export default ImageTool; 