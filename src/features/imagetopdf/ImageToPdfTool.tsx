import React, { useState, useCallback } from 'react';
import {
  BoxContent,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Grid,
  Alert,
  Paper,
  IconButton,
  CircularProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Snackbar,
} from '@mui/material';
import {
  CloudUpload,
  Download,
  Delete,
  Image as ImageIcon,
  PictureAsPdf,
  CheckCircle,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { imageToPdfService } from '../../services/imageToPdfService';
import { useApi } from '../../hooks/useApi';
import { LoadingButton } from '../../shared/components/LoadingButton';

interface ImageFile {
  file: File;
  id: string;
  preview: string;
}

const ImageToPdfTool: React.FC = () => {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [outputFileName, setOutputFileName] = useState('');
  const [pageSize, setPageSize] = useState('A4');
  const [isConverting, setIsConverting] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });

  const convertApi = useApi(imageToPdfService.convertToPdf);

  // Handle file selection
  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const newImages: ImageFile[] = files
      .filter(file => file.type.startsWith('image/'))
      .map((file) => ({
        file,
        id: Math.random().toString(36).substr(2, 9),
        preview: URL.createObjectURL(file)
      }));
    setImages(prev => [...prev, ...newImages]);
  }, []);

  // Handle drag and drop
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    const newImages: ImageFile[] = files
      .filter(file => file.type.startsWith('image/'))
      .map((file) => ({
        file,
        id: Math.random().toString(36).substr(2, 9),
        preview: URL.createObjectURL(file)
      }));
    setImages(prev => [...prev, ...newImages]);
  }, []);

  // Remove image
  const removeImage = useCallback((index: number) => {
    setImages(prev => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
  }, []);

  // Move image up/down
  const moveImage = useCallback((index: number, direction: 'up' | 'down') => {
    setImages(prev => {
      const newImages = [...prev];
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex >= 0 && newIndex < newImages.length) {
        [newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]];
      }
      return newImages;
    });
  }, []);

  // Show snackbar notification
  const showNotification = useCallback((message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  // Close snackbar
  const handleCloseSnackbar = useCallback(() => {
    setSnackbar(prev => ({ ...prev, open: false }));
  }, []);

  // Convert to PDF
  const handleConvert = useCallback(async () => {
    if (images.length === 0) {
      showNotification('Please add at least one image!', 'error');
      return;
    }

    setIsConverting(true);
    try {
      const request = {
        images: images.map(img => img.file),
        outputFileName: outputFileName || 'images-to-pdf.pdf',
        pageSize,
      };

      const result = await convertApi.execute(request);
      
      // Handle the response structure flexibly
      const response = result.data;
      
      // Check if this is the flat structure (pdfContent directly in response.data)
      if (response.success && response.pdfContent) {
                 imageToPdfService.downloadPdf(
           response.pdfContent, 
           response.fileName || 'images-to-pdf.pdf'
         );
         showNotification(`Successfully converted ${response.imagesProcessed} image${response.imagesProcessed !== 1 ? 's' : ''} to PDF!`, 'success');
      }
      // Check if this is the nested structure (pdfContent in response.data.data)
      else if (response.success && response.data && response.data.pdfContent) {
                 imageToPdfService.downloadPdf(
           response.data.pdfContent, 
           response.data.fileName || 'images-to-pdf.pdf'
         );
         showNotification(`Successfully converted ${response.data.imagesProcessed} image${response.data.imagesProcessed !== 1 ? 's' : ''} to PDF!`, 'success');
      }
            else {
        showNotification(response.error || response.message || 'Unknown error occurred', 'error');
      }
    } catch (error) {
      console.error('Conversion error:', error);
      showNotification('Network error: Please check if the backend server is running.', 'error');
    } finally {
      setIsConverting(false);
    }
      }, [images, outputFileName, pageSize, convertApi, showNotification]);

  // Clear all images
  const clearAll = useCallback(() => {
    images.forEach(img => URL.revokeObjectURL(img.preview));
    setImages([]);
  }, [images]);

  // Clean up object URLs on unmount
  React.useEffect(() => {
    return () => {
      images.forEach(img => URL.revokeObjectURL(img.preview));
    };
  }, []);

  return (
    <ProfessionalToolLayout 
      title="
      <Typography variant="h4" gutterBottom>
        <ImageIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        Image to PDF Converter
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Upload multiple images and convert them to a single PDF document.
      </Typography>

      {/* Upload Area */}
      <Card sx={{ mb: 3 }}>
        
          <Box
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            sx={{
              border: '2px dashed',
              borderColor: dragActive ? 'primary.main' : 'grey.300',
              borderRadius: 2,
              p: 4,
              textAlign: 'center',
              cursor: 'pointer',
              bgcolor: dragActive ? 'action.hover' : 'background.paper',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                borderColor: 'primary.main',
                bgcolor: 'action.hover',
              }
            }}
          >
            <input
              type="file"
              multiple
              accept="image/*"
              style={{ display: 'none' }}
              id="image-upload"
              onChange={handleFileSelect}
            />
            <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              {dragActive ? 'Drop images here...' : 'Drag & drop images here, or click to select'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Supports JPG, PNG, BMP, GIF, WEBP
            </Typography>
            <label htmlFor="image-upload">
              <Button variant="outlined" component="span">
                Choose Files
              </Button>
            </label>
          </ProfessionalButtonGroup>
        
      </ProfessionalCard>

      {/* Settings */}
      <Card sx={{ mb: 3 }}>
        
          <Typography variant="h6" gutterBottom>
            Conversion Settings
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={8}>
              <TextField
                fullWidth
                label="Output Filename"
                value={outputFileName}
                onChange={(e) => setOutputFileName(e.target.value)}
                placeholder="images-to-pdf.pdf"
                helperText="Leave empty for default name"
              />
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Page Size</InputLabel>
                <Select
                  value={pageSize}
                  label="Page Size"
                  onChange={(e) => setPageSize(e.target.value)}
                >
                  <MenuItem value="auto">Auto (fit image)</MenuItem>
                  <MenuItem value="A4">A4</MenuItem>
                  <MenuItem value="Letter">Letter</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        
      </ProfessionalCard>

      {/* Images List */}
      {images.length > 0 && (
        <Card sx={{ mb: 3 }}>
          
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Images ({images.length})
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip 
                  label={`${images.length} image${images.length !== 1 ? 's' : ''}`} 
                  color="primary" 
                  size="small" 
                />
                <Button onClick={clearAll} color="error" size="small">
                  Clear All
                </Button>
              </ProfessionalButtonGroup>
            </ProfessionalButtonGroup>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Use the up/down buttons to reorder pages in the final PDF
            </Typography>
            
            <List>
              {images.map((image, index) => (
                <ListItem key={image.id} sx={{ border: '1px solid', borderColor: 'divider', mb: 1, borderRadius: 1 }}>
                  <img
                    src={image.preview}
                    alt={image.file.name}
                    style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4, marginRight: 16 }}
                  />
                  <ListItemText
                    primary={image.file.name}
                    secondary={`${(image.file.size / 1024 / 1024).toFixed(2)} MB`}
                  />
                  <ListItemSecondaryAction>
                    <Button
                      size="small"
                      onClick={() => moveImage(index, 'up')}
                      disabled={index === 0}
                      sx={{ mr: 1 }}
                    >
                      ↑
                    </Button>
                    <Button
                      size="small"
                      onClick={() => moveImage(index, 'down')}
                      disabled={index === images.length - 1}
                      sx={{ mr: 1 }}
                    >
                      ↓
                    </Button>
                    <IconButton onClick={() => removeImage(index)} color="error" size="small">
                      <Delete />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          
        </ProfessionalCard>
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
      </ProfessionalButtonGroup>

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
            error: <ErrorIcon fontSize="inherit" />,
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Error Display for API errors */}
      {convertApi.error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {convertApi.error}
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
    </ProfessionalButtonGroup>
  );
};

export default ImageToPdfTool;
