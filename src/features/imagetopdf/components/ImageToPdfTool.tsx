import React, { useState, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  Paper,
  Grid,
  Divider,
  CircularProgress,
  Snackbar,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { PictureAsPdf, CloudUpload, Delete, CheckCircle, Error } from '@mui/icons-material';
import { imagetopdfService } from '../api/imagetopdfService';
import { useApi } from '../../../shared/hooks/useApi';
import { LoadingButton } from '../../../shared/components/LoadingButton';
import { getErrorMessage } from '../../../shared/utils/errorHandling';

interface ImageFile {
  file: File;
  preview: string;
  order: number;
}

const ImageToPdfTool: React.FC = () => {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [outputFileName, setOutputFileName] = useState('converted-document.pdf');
  const [pageSize, setPageSize] = useState('A4');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  const convertApi = useApi(imagetopdfService.convert);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newImages = acceptedFiles.map((file, index) => ({
      file,
      preview: URL.createObjectURL(file),
      order: images.length + index
    }));
    setImages(prev => [...prev, ...newImages]);
  }, [images.length]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp', '.webp']
    },
    multiple: true
  });

  const removeImage = (index: number) => {
    setImages(prev => {
      const newImages = prev.filter((_, i) => i !== index);
      // Update order numbers
      return newImages.map((img, i) => ({ ...img, order: i }));
    });
  };

  const handleConvert = () => {
    if (images.length === 0) {
      setSnackbar({
        open: true,
        message: 'Please select at least one image',
        severity: 'error'
      });
      return;
    }

    convertApi.execute({ 
      images: images.map(img => img.file), 
      outputFileName,
      pageSize 
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const clearAll = () => {
    setImages([]);
    convertApi.reset();
  };

  // Handle successful conversion
  React.useEffect(() => {
    if (convertApi.data && convertApi.data.success) {
      // Download the PDF
      const byteCharacters = atob(convertApi.data.pdfContent);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', convertApi.data.fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setSnackbar({
        open: true,
        message: 'PDF generated and downloaded successfully!',
        severity: 'success'
      });
    }
  }, [convertApi.data]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Image to PDF Converter
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Convert multiple images to a single PDF document. Drag and drop images or click to select files.
      </Typography>

      {/* Settings */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Conversion Settings
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Output Filename"
                value={outputFileName}
                onChange={(e) => setOutputFileName(e.target.value)}
                placeholder="converted-document.pdf"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Page Size</InputLabel>
                <Select
                  value={pageSize}
                  label="Page Size"
                  onChange={(e) => setPageSize(e.target.value)}
                >
                  <MenuItem value="A4">A4</MenuItem>
                  <MenuItem value="A3">A3</MenuItem>
                  <MenuItem value="Letter">Letter</MenuItem>
                  <MenuItem value="Legal">Legal</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Drop Zone */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <div
            {...getRootProps()}
            style={{
              border: '2px dashed #ccc',
              borderRadius: '8px',
              padding: '40px',
              textAlign: 'center',
              cursor: 'pointer',
              backgroundColor: isDragActive ? '#f0f8ff' : '#fafafa',
              transition: 'background-color 0.3s ease'
            }}
          >
            <input {...getInputProps()} />
            <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              {isDragActive ? 'Drop images here' : 'Drag & drop images here'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              or click to select files (JPEG, PNG, GIF, BMP, WebP)
            </Typography>
          </div>
        </CardContent>
      </Card>

      {/* Image Preview */}
      {images.length > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Selected Images ({images.length})
              </Typography>
              <Button
                variant="outlined"
                color="error"
                onClick={clearAll}
                startIcon={<Delete />}
              >
                Clear All
              </Button>
            </Box>
            
            <Grid container spacing={2}>
              {images.map((image, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                  <Paper
                    sx={{
                      p: 2,
                      textAlign: 'center',
                      position: 'relative',
                      border: '1px solid #e0e0e0'
                    }}
                  >
                    <img
                      src={image.preview}
                      alt={`Image ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '150px',
                        objectFit: 'cover',
                        borderRadius: '4px'
                      }}
                    />
                    <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                      {image.file.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {(image.file.size / 1024).toFixed(1)} KB
                    </Typography>
                    
                    <Box sx={{ mt: 1 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => removeImage(index)}
                        startIcon={<Delete />}
                        color="error"
                      >
                        Remove
                      </Button>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Convert Button */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <LoadingButton
          variant="contained"
          size="large"
          startIcon={<PictureAsPdf />}
          onClick={handleConvert}
          loading={convertApi.loading}
          disabled={images.length === 0}
          sx={{ px: 4, py: 1.5 }}
        >
          Convert to PDF ({images.length} images)
        </LoadingButton>
      </Box>

      {/* Error Display */}
      {convertApi.error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {getErrorMessage(convertApi.error)}
        </Alert>
      )}

      {/* Success/Error Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
          iconMapping={{
            success: <CheckCircle fontSize="inherit" />,
            error: <Error fontSize="inherit" />,
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Help */}
      <Paper sx={{ p: 3, mt: 3, bgcolor: 'action.hover' }}>
        <Typography variant="h6" gutterBottom>
          How to use:
        </Typography>
        <Typography component="div" variant="body2">
          <ol style={{ paddingLeft: 20, margin: 0 }}>
            <li>Configure output filename and page size settings</li>
            <li>Upload multiple images by dragging & dropping or clicking to select files</li>
            <li>Click "Convert to PDF" to generate and download your PDF</li>
            <li>The PDF will be automatically downloaded when conversion is complete</li>
          </ol>
        </Typography>
      </Paper>
    </Box>
  );
};

export default ImageToPdfTool;
