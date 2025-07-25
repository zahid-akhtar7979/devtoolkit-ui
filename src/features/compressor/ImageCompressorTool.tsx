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
    <Box sx={{ p: 3, maxWidth: '100%' }}>
      {/* Header Section */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" fontWeight="bold" sx={{ 
          mb: 2,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          🗜️ Image Compressor
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
          Reduce image size without losing much quality. Supports JPEG, PNG, and WebP formats with customizable compression settings.
        </Typography>
      </Box>

      {/* Configuration Panel */}
      <Paper 
        elevation={4} 
        sx={{ 
          mb: 3, 
          p: 4, 
          borderRadius: 4,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
            pointerEvents: 'none'
          }
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Box sx={{ 
              width: 48, 
              height: 48, 
              borderRadius: '50%', 
              bgcolor: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px'
            }}>
              ⚙️
            </Box>
            <Box>
              <Typography variant="h5" fontWeight="bold" sx={{ mb: 0.5 }}>
                Compression Settings
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Adjust quality and dimensions for optimal compression
              </Typography>
            </Box>
          </Box>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>🎛️ Quality & Format</Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ mb: 1, opacity: 0.9 }}>
                  Quality: {quality}%
                </Typography>
                <Slider
                  value={quality}
                  onChange={(_, value) => setQuality(value as number)}
                  min={10}
                  max={100}
                  step={5}
                  sx={{
                    color: '#ffd700',
                    '& .MuiSlider-thumb': {
                      backgroundColor: '#ffd700',
                    },
                    '& .MuiSlider-track': {
                      backgroundColor: '#ffd700',
                    },
                    '& .MuiSlider-rail': {
                      backgroundColor: 'rgba(255,255,255,0.3)',
                    },
                  }}
                />
              </Box>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel sx={{ color: 'rgba(255,255,255,0.8)' }}>Output Format</InputLabel>
                <Select
                  value={format}
                  label="Output Format"
                  onChange={(e) => setFormat(e.target.value)}
                  sx={{
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255,255,255,0.5)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255,255,255,0.8)',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#ffd700',
                    },
                  }}
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
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>📐 Dimensions</Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ mb: 1, opacity: 0.9 }}>
                  Max Width: {maxWidth}px
                </Typography>
                <Slider
                  value={maxWidth}
                  onChange={(_, value) => setMaxWidth(value as number)}
                  min={480}
                  max={4096}
                  step={32}
                  sx={{
                    color: '#ffd700',
                    '& .MuiSlider-thumb': { backgroundColor: '#ffd700' },
                    '& .MuiSlider-track': { backgroundColor: '#ffd700' },
                    '& .MuiSlider-rail': { backgroundColor: 'rgba(255,255,255,0.3)' },
                  }}
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ mb: 1, opacity: 0.9 }}>
                  Max Height: {maxHeight}px
                </Typography>
                <Slider
                  value={maxHeight}
                  onChange={(_, value) => setMaxHeight(value as number)}
                  min={360}
                  max={4096}
                  step={32}
                  sx={{
                    color: '#ffd700',
                    '& .MuiSlider-thumb': { backgroundColor: '#ffd700' },
                    '& .MuiSlider-track': { backgroundColor: '#ffd700' },
                    '& .MuiSlider-rail': { backgroundColor: 'rgba(255,255,255,0.3)' },
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Upload Section */}
      <Card sx={{ mb: 3, borderRadius: 3, elevation: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <ImageIcon sx={{ fontSize: '32px', color: 'primary.main' }} />
            <Typography variant="h5" fontWeight="bold" color="primary">
              Upload Images
            </Typography>
          </Box>

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            ref={fileInputRef}
            style={{ display: 'none' }}
          />

          <Paper
            sx={{
              p: 4,
              textAlign: 'center',
              border: '2px dashed #ccc',
              borderRadius: 2,
              cursor: 'pointer',
              mb: 3,
              '&:hover': {
                borderColor: 'primary.main',
                bgcolor: 'action.hover',
              },
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            <CloudUploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Click to select images or drag and drop
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Supports JPEG, PNG, WebP • Max {maxFileSizeMB}MB per file
            </Typography>
          </Paper>

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
        <Paper sx={{ 
          borderRadius: 3, 
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
          border: '1px solid #dee2e6',
          elevation: 3
        }}>
          <Box sx={{ 
            background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)', 
            color: 'white', 
            textAlign: 'center', 
            py: 2 
          }}>
            <Typography variant="h5" fontWeight="bold">
              🎉 Compression Results
            </Typography>
            {(() => {
              const { originalTotal, compressedTotal, totalSavings } = getTotalSavings();
              return (
                <Typography variant="body1" sx={{ mt: 1, opacity: 0.9 }}>
                  Total savings: {formatFileSize(originalTotal - compressedTotal)} ({totalSavings.toFixed(1)}% reduction)
                </Typography>
              );
            })()}
          </Box>
          
          <Box sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                Compressed Images ({compressedImages.length})
              </Typography>
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={handleDownloadAll}
                color="success"
              >
                Download All
              </Button>
            </Box>

            <Grid container spacing={3}>
              {compressedImages.map((img, index) => (
                <Grid item xs={12} md={6} lg={4} key={index}>
                  <Card sx={{ p: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
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
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default ImageCompressorTool; 