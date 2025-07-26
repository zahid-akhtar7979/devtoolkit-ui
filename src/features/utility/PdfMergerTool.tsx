import React, { useState, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  TextField,
  LinearProgress,
  Chip,
  Snackbar,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
  Merge as MergeIcon,
  PictureAsPdf as PdfIcon,
  CheckCircle,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { PDFDocument } from 'pdf-lib';

interface PDFFile {
  id: string;
  file: File;
  name: string;
  size: string;
}

const PdfMergerTool: React.FC = () => {
  const [pdfFiles, setPdfFiles] = useState<PDFFile[]>([]);
  const [outputFileName, setOutputFileName] = useState('merged-document.pdf');
  const [isProcessing, setIsProcessing] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });

  // Show notification
  const showNotification = useCallback((message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  // Close snackbar
  const handleCloseSnackbar = useCallback(() => {
    setSnackbar(prev => ({ ...prev, open: false }));
  }, []);

  // Handle file selection
  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const pdfFilesList: PDFFile[] = files
      .filter(file => file.type === 'application/pdf')
      .map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2) + ' MB'
      }));
    
    if (pdfFilesList.length !== files.length) {
      showNotification('Only PDF files are supported', 'error');
    }
    
    setPdfFiles(prev => [...prev, ...pdfFilesList]);
  }, [showNotification]);

  // Remove PDF file
  const removePdfFile = useCallback((id: string) => {
    setPdfFiles(prev => prev.filter(file => file.id !== id));
  }, []);

  // Move PDF file up/down
  const movePdfFile = useCallback((index: number, direction: 'up' | 'down') => {
    setPdfFiles(prev => {
      const newFiles = [...prev];
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex >= 0 && newIndex < newFiles.length) {
        [newFiles[index], newFiles[newIndex]] = [newFiles[newIndex], newFiles[index]];
      }
      return newFiles;
    });
  }, []);

  // Clear all files
  const clearAll = useCallback(() => {
    setPdfFiles([]);
  }, []);

  // Merge PDFs
  const handleMerge = useCallback(async () => {
    if (pdfFiles.length === 0) {
      showNotification('Please add at least one PDF file!', 'error');
      return;
    }

    if (pdfFiles.length === 1) {
      showNotification('Please add at least two PDF files to merge!', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      // Create a new PDF document
      const mergedPdf = await PDFDocument.create();

      // Process each PDF file
      for (const pdfFile of pdfFiles) {
        const arrayBuffer = await pdfFile.file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const pageIndices = pdf.getPageIndices();
        
        // Copy all pages from this PDF
        const pages = await mergedPdf.copyPages(pdf, pageIndices);
        pages.forEach((page) => mergedPdf.addPage(page));
      }

      // Save the merged PDF
      const pdfBytes = await mergedPdf.save();
      
      // Create download link
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', outputFileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      showNotification(`Successfully merged ${pdfFiles.length} PDF files!`, 'success');
    } catch (error) {
      console.error('Error merging PDFs:', error);
      showNotification('Error merging PDFs. Please ensure all files are valid PDF documents.', 'error');
    } finally {
      setIsProcessing(false);
    }
  }, [pdfFiles, outputFileName, showNotification]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        <PdfIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        PDF Merger
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Upload multiple PDF files and merge them into a single document.
      </Typography>

      {/* Upload Area */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ textAlign: 'center', p: 3 }}>
            <input
              type="file"
              multiple
              accept="application/pdf"
              style={{ display: 'none' }}
              id="pdf-upload"
              onChange={handleFileSelect}
            />
            <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Select PDF Files to Merge
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Choose multiple PDF files to merge into one document
            </Typography>
            <label htmlFor="pdf-upload">
              <Button variant="outlined" component="span" sx={{ mr: 2 }}>
                Choose PDF Files
              </Button>
            </label>
          </Box>
        </CardContent>
      </Card>

      {/* Output Settings */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Merge Settings
          </Typography>
          <TextField
            fullWidth
            label="Output Filename"
            value={outputFileName}
            onChange={(e) => setOutputFileName(e.target.value)}
            placeholder="merged-document.pdf"
            helperText="Enter the name for the merged PDF file"
          />
        </CardContent>
      </Card>

      {/* PDF Files List */}
      {pdfFiles.length > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                PDF Files ({pdfFiles.length})
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip 
                  label={`${pdfFiles.length} file${pdfFiles.length !== 1 ? 's' : ''}`} 
                  color="primary" 
                  size="small" 
                />
                <Button onClick={clearAll} color="error" size="small">
                  Clear All
                </Button>
              </Box>
            </Box>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Use the up/down arrows to reorder files. Files will be merged in this order.
            </Typography>
            
            <List>
              {pdfFiles.map((pdfFile, index) => (
                <ListItem 
                  key={pdfFile.id} 
                  sx={{ 
                    border: '1px solid', 
                    borderColor: 'divider', 
                    mb: 1, 
                    borderRadius: 1,
                    bgcolor: 'background.paper'
                  }}
                >
                  <PdfIcon sx={{ mr: 2, color: 'error.main' }} />
                  <ListItemText
                    primary={pdfFile.name}
                    secondary={`Size: ${pdfFile.size} • Position: ${index + 1}`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      onClick={() => movePdfFile(index, 'up')}
                      disabled={index === 0}
                      size="small"
                      sx={{ mr: 0.5 }}
                    >
                      <ArrowUpIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => movePdfFile(index, 'down')}
                      disabled={index === pdfFiles.length - 1}
                      size="small"
                      sx={{ mr: 0.5 }}
                    >
                      <ArrowDownIcon />
                    </IconButton>
                    <IconButton 
                      onClick={() => removePdfFile(pdfFile.id)} 
                      color="error" 
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}

      {/* Merge Button */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Button
          variant="contained"
          size="large"
          startIcon={<MergeIcon />}
          onClick={handleMerge}
          disabled={pdfFiles.length < 2 || isProcessing}
          sx={{ px: 4, py: 1.5 }}
        >
          {isProcessing ? 'Merging...' : `Merge ${pdfFiles.length} PDFs`}
        </Button>
      </Box>

      {/* Progress Bar */}
      {isProcessing && (
        <Box sx={{ mt: 2 }}>
          <LinearProgress />
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
            Processing PDF files, please wait...
          </Typography>
        </Box>
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
            error: <ErrorIcon fontSize="inherit" />,
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Help */}
      <Card sx={{ mt: 3, bgcolor: 'action.hover' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            How to use:
          </Typography>
          <Typography component="div" variant="body2">
            <ol style={{ paddingLeft: 20, margin: 0 }}>
              <li>Click "Choose PDF Files" to select multiple PDF documents</li>
              <li>Use the up/down arrows to reorder the files as needed</li>
              <li>Set the output filename for your merged document</li>
              <li>Click "Merge PDFs" to combine all files and download the result</li>
            </ol>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PdfMergerTool; 