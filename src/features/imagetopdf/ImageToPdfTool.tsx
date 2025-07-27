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
import { imageToPdfService } from '../../services/imageToPdfService';
import { useApi } from '../../hooks/useApi';
import { LoadingButton } from '../../shared/components/LoadingButton';
import { getErrorMessage } from '../../utils/errorHandling';

interface ImageFile {
  file: File;
  preview: string;
  order: number;
}

interface CompressedImage {
  originalFile: File;
  compressedBlob: Blob;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  preview: string;
  compressedPreview: string;
}

const ImageToPdfTool: React.FC = () => {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  const convertApi = useApi(imageToPdfService.convertToPdf);

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

  const moveImage = (fromIndex: number, toIndex: number) => {
    setImages(prev => {
      const newImages = [...prev];
      const [movedImage] = newImages.splice(fromIndex, 1);
      newImages.splice(toIndex, 0, movedImage);
      // Update order numbers
      return newImages.map((img, i) => ({ ...img, order: i }));
    });
  };

  const handleConvert = async () => {
    if (images.length === 0) {
      setSnackbar({
        open: true,
        message: 'Please select at least one image',
        severity: 'error'
      });
      return;
    }

    setIsConverting(true);
    try {
      const result = await convertApi.execute({ images: images.map(img => img.file).filter(Boolean) });
      
      if (result && result.data) {
        imageToPdfService.downloadPdf(result.data.pdfContent || '', 'images-to-pdf.pdf');
        setSnackbar({
          open: true,
          message: 'PDF generated and downloaded successfully!',
          severity: 'success'
        });
      }
    } catch (error) {
      console.error('Conversion error:', error);
      setSnackbar({
        open: true,
        message: 'Failed to convert images to PDF. Please try again.',
        severity: 'error'
      });
    } finally {
      setIsConverting(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const clearAll = () => {
    setImages([]);
    convertApi.reset();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Image to PDF Converter
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Convert multiple images to a single PDF document. Drag and drop images or click to select files.
      </Typography>

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
          startIcon={isConverting ? <CircularProgress size={20} /> : <PictureAsPdf />}
          onClick={handleConvert}
          loading={isConverting}
          disabled={images.length === 0}
          sx={{ px: 4, py: 1.5 }}
        >
          {isConverting ? 'Converting...' : `Convert to PDF (${images.length} images)`}
        </LoadingButton>
      </Box>

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

      {/* Error Display for API errors */}
      {convertApi.error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {getErrorMessage(convertApi.error)}
        </Alert>
      )}

      {/* Help */}
      <Paper sx={{ p: 3, mt: 3, bgcolor: 'action.hover' }}>
        <Typography variant="h6" gutterBottom>
          How to use:
        </Typography>
        <Typography component="div" variant="body2">
          <ol style={{ paddingLeft: 20, margin: 0 }}>
            <li>Upload multiple images by dragging & dropping or clicking "Choose Files"</li>
            <li>Use the up/down arrows to reorder pages in the final PDF</li>
            <li>Configure settings like filename and page size</li>
            <li>Click "Convert to PDF" to generate and download your PDF</li>
          </ol>
        </Typography>
      </Paper>
    </Box>
  );
};

export default ImageToPdfTool;
