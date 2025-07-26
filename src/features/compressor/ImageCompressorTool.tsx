import React, { useState, useRef, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  Paper,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
  Chip,
  Grid,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DownloadIcon from '@mui/icons-material/Download';
import CompressIcon from '@mui/icons-material/Compress';
import ImageIcon from '@mui/icons-material/Image';

interface CompressedImage {
  originalFile: File;
  compressedBlob: Blob;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  preview: string;
  compressedPreview: string;
}

const ImageCompressorTool: React.FC = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [compressedImages, setCompressedImages] = useState<CompressedImage[]>([]);
  const [quality, setQuality] = useState<number>(80);
  const [maxWidth, setMaxWidth] = useState<number>(1920);
  const [maxHeight, setMaxHeight] = useState<number>(1080);
  const [format, setFormat] = useState<string>('jpeg');
  const [isCompressing, setIsCompressing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const supportedFormats = ['jpeg', 'png', 'webp'];
  const maxFileSizeMB = 10;

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        setError('Please select only image files');
        return false;
      }
      if (file.size > maxFileSizeMB * 1024 * 1024) {
        setError(`File ${file.name} is too large. Maximum size is ${maxFileSizeMB}MB`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      setSelectedFiles(validFiles);
      setError('');
      setSuccess(`${validFiles.length} image(s) selected successfully`);
    }
  };

  const compressImage = useCallback((file: File, quality: number, maxWidth: number, maxHeight: number, format: string): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions while maintaining aspect ratio
        let { width, height } = img;
        
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to compress image'));
            }
          },
          `image/${format}`,
          quality / 100
        );
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }, []);

  const handleCompress = async () => {
    if (selectedFiles.length === 0) {
      setError('Please select images to compress');
      return;
    }

    setIsCompressing(true);
    setError('');
    const results: CompressedImage[] = [];

    try {
      for (const file of selectedFiles) {
        const originalPreview = URL.createObjectURL(file);
        const compressedBlob = await compressImage(file, quality, maxWidth, maxHeight, format);
        const compressedPreview = URL.createObjectURL(compressedBlob);
        
        const compressionRatio = ((file.size - compressedBlob.size) / file.size) * 100;

        results.push({
          originalFile: file,
          compressedBlob,
          originalSize: file.size,
          compressedSize: compressedBlob.size,
          compressionRatio,
          preview: originalPreview,
          compressedPreview,
        });
      }

      setCompressedImages(results);
      setSuccess(`Successfully compressed ${results.length} image(s)!`);
    } catch (err) {
      setError('Failed to compress images. Please try again.');
      console.error(err);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleDownload = (compressedImage: CompressedImage) => {
    const link = document.createElement('a');
    link.href = compressedImage.compressedPreview;
    link.download = `compressed_${compressedImage.originalFile.name.split('.')[0]}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadAll = () => {
    compressedImages.forEach((img, index) => {
      setTimeout(() => handleDownload(img), index * 200); // Stagger downloads
    });
  };

  const handleClear = () => {
    setSelectedFiles([]);
    setCompressedImages([]);
    setError('');
    setSuccess('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    // Clean up object URLs
    compressedImages.forEach(img => {
      URL.revokeObjectURL(img.preview);
      URL.revokeObjectURL(img.compressedPreview);
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getTotalSavings = (): { originalTotal: number; compressedTotal: number; totalSavings: number } => {
    const originalTotal = compressedImages.reduce((sum, img) => sum + img.originalSize, 0);
    const compressedTotal = compressedImages.reduce((sum, img) => sum + img.compressedSize, 0);
    const totalSavings = originalTotal > 0 ? ((originalTotal - compressedTotal) / originalTotal) * 100 : 0;
    
    return { originalTotal, compressedTotal, totalSavings };
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header Section */}
      <Typography variant="h4" gutterBottom>
        <CompressIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        Image Compressor
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Reduce image size without losing much quality. Supports JPEG, PNG, and WebP formats with customizable compression settings.
      </Typography>

      {/* Configuration Panel */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            <CompressIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Compression Settings
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>Quality & Format</Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Quality: {quality}%
                </Typography>
                <Slider
                  value={quality}
                  onChange={(_, value) => setQuality(value as number)}
                  min={10}
                  max={100}
                  step={5}
                />
              </Box>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Output Format</InputLabel>
                <Select
                  value={format}
                  label="Output Format"
                  onChange={(e) => setFormat(e.target.value)}
                >
                  {supportedFormats.map((fmt) => (
                    <MenuItem key={fmt} value={fmt}>
                      {fmt.toUpperCase()}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>Dimensions</Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Max Width: {maxWidth}px
                </Typography>
                <Slider
                  value={maxWidth}
                  onChange={(_, value) => setMaxWidth(value as number)}
                  min={480}
                  max={4096}
                  step={32}
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Max Height: {maxHeight}px
                </Typography>
                <Slider
                  value={maxHeight}
                  onChange={(_, value) => setMaxHeight(value as number)}
                  min={360}
                  max={4096}
                  step={32}
                />
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Upload Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            <ImageIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Upload Images
          </Typography>

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            ref={fileInputRef}
            style={{ display: 'none' }}
          />

          <Box
            sx={{
              border: '2px dashed #ccc',
              borderRadius: 2,
              p: 4,
              textAlign: 'center',
              cursor: 'pointer',
              mb: 3,
              '&:hover': {
                borderColor: 'primary.main',
                bgcolor: 'action.hover',
              },
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Click to select images or drag and drop
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Supports JPEG, PNG, WebP • Max {maxFileSizeMB}MB per file
            </Typography>
          </Box>

          {selectedFiles.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Selected Files ({selectedFiles.length})
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {selectedFiles.map((file, index) => (
                  <Chip
                    key={index}
                    label={`${file.name} (${formatFileSize(file.size)})`}
                    variant="outlined"
                    color="primary"
                  />
                ))}
              </Box>
            </Box>
          )}

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              startIcon={<CompressIcon />}
              onClick={handleCompress}
              disabled={selectedFiles.length === 0 || isCompressing}
              sx={{ px: 4, py: 1.5 }}
            >
              {isCompressing ? 'Compressing...' : 'Compress Images'}
            </Button>
            <Button
              variant="outlined"
              onClick={handleClear}
              disabled={isCompressing}
              sx={{ px: 4, py: 1.5 }}
            >
              Clear All
            </Button>
          </Box>

          {isCompressing && (
            <Box sx={{ mt: 2 }}>
              <LinearProgress />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Processing images...
              </Typography>
            </Box>
          )}

          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
        </CardContent>
      </Card>

      {/* Results Section */}
      {compressedImages.length > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Compression Results
            </Typography>
            {(() => {
              const { originalTotal, compressedTotal, totalSavings } = getTotalSavings();
              return (
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  Total savings: {formatFileSize(originalTotal - compressedTotal)} ({totalSavings.toFixed(1)}% reduction)
                </Typography>
              );
            })()}
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="subtitle1">
                Compressed Images ({compressedImages.length})
              </Typography>
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={handleDownloadAll}
                color="primary"
              >
                Download All
              </Button>
            </Box>

            <Grid container spacing={3}>
              {compressedImages.map((img, index) => (
                <Grid item xs={12} md={6} lg={4} key={index}>
                  <Card variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                      {img.originalFile.name}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      <Box sx={{ flex: 1, textAlign: 'center' }}>
                        <Typography variant="caption" color="text.secondary">Original</Typography>
                        <img 
                          src={img.preview} 
                          alt="Original" 
                          style={{ width: '100%', maxHeight: '120px', objectFit: 'cover', borderRadius: '4px' }}
                        />
                        <Typography variant="body2">{formatFileSize(img.originalSize)}</Typography>
                      </Box>
                      <Box sx={{ flex: 1, textAlign: 'center' }}>
                        <Typography variant="caption" color="text.secondary">Compressed</Typography>
                        <img 
                          src={img.compressedPreview} 
                          alt="Compressed" 
                          style={{ width: '100%', maxHeight: '120px', objectFit: 'cover', borderRadius: '4px' }}
                        />
                        <Typography variant="body2">{formatFileSize(img.compressedSize)}</Typography>
                      </Box>
                    </Box>

                    <Chip
                      label={`${img.compressionRatio.toFixed(1)}% smaller`}
                      color="success"
                      size="small"
                      sx={{ mb: 2, width: '100%' }}
                    />

                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<DownloadIcon />}
                      onClick={() => handleDownload(img)}
                      size="small"
                    >
                      Download
                    </Button>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Help */}
      <Card sx={{ bgcolor: 'action.hover' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            How to use:
          </Typography>
          <Typography component="div" variant="body2">
            <ol style={{ paddingLeft: 20, margin: 0 }}>
              <li>Adjust quality and dimension settings for optimal compression</li>
              <li>Upload multiple images by clicking "Choose Files"</li>
              <li>Click "Compress Images" to process all files</li>
              <li>Download individual images or use "Download All" for batch download</li>
            </ol>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ImageCompressorTool; 