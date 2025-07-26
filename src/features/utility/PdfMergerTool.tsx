import React, { useState, useCallback, useMemo } from 'react';
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
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  FormControlLabel,
  Grid,
  Paper,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
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
  Visibility as PreviewIcon,
  Settings as SettingsIcon,
  ExpandMore as ExpandMoreIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
} from '@mui/icons-material';
import { PDFDocument } from 'pdf-lib';
import { Document, Page, pdfjs } from 'react-pdf';

// Configure PDF.js worker using local legacy worker file
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.js';

interface PDFFile {
  id: string;
  file: File;
  name: string;
  size: string;
  numPages?: number;
  selectedPages: number[];
  blobUrl?: string;
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
  const [previewDialog, setPreviewDialog] = useState<{
    open: boolean;
    pdfFile: PDFFile | null;
  }>({ open: false, pdfFile: null });
  const [currentPreviewPage, setCurrentPreviewPage] = useState(1);
  const [previewScale, setPreviewScale] = useState(1.0);

  // Memoized current file for preview dialog to ensure we always have the latest state
  const currentPreviewFile = useMemo(() => {
    return previewDialog.pdfFile ? pdfFiles.find(f => f.id === previewDialog.pdfFile?.id) : null;
  }, [pdfFiles, previewDialog.pdfFile]);

  // Show notification
  const showNotification = useCallback((message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  // Close snackbar
  const handleCloseSnackbar = useCallback(() => {
    setSnackbar(prev => ({ ...prev, open: false }));
  }, []);

  // Handle file selection
  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const pdfFilesList: PDFFile[] = [];
    
    for (const file of files) {
      if (file.type === 'application/pdf') {
        try {
          // Load PDF to get page count
          const arrayBuffer = await file.arrayBuffer();
          const pdf = await PDFDocument.load(arrayBuffer);
          const numPages = pdf.getPageCount();
          
          // Store the file directly for preview instead of creating URL here
          // We'll handle the URL creation in the Document component
          
          // Create blob URL for reliable PDF viewing
          const blobUrl = URL.createObjectURL(file);
          
          const pdfFile: PDFFile = {
            id: Math.random().toString(36).substr(2, 9),
            file,
            name: file.name,
            size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
            numPages,
            selectedPages: Array.from({ length: numPages }, (_, i) => i + 1), // Select all pages by default
            blobUrl
          };
          
          pdfFilesList.push(pdfFile);
        } catch (error) {
          console.error(`Error loading PDF ${file.name}:`, error);
          showNotification(`Error loading ${file.name}. Please ensure it's a valid PDF.`, 'error');
        }
      }
    }
    
    if (pdfFilesList.length !== files.length) {
      showNotification('Only PDF files are supported', 'error');
    }
    
    setPdfFiles(prev => [...prev, ...pdfFilesList]);
  }, [showNotification]);

  // Remove PDF file
  const removePdfFile = useCallback((id: string) => {
    setPdfFiles(prev => {
      const fileToRemove = prev.find(file => file.id === id);
      if (fileToRemove?.blobUrl) {
        URL.revokeObjectURL(fileToRemove.blobUrl);
      }
      return prev.filter(file => file.id !== id);
    });
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
    // Clean up blob URLs
    pdfFiles.forEach(file => {
      if (file.blobUrl) {
        URL.revokeObjectURL(file.blobUrl);
      }
    });
    setPdfFiles([]);
  }, [pdfFiles]);

  // Toggle page selection
  const togglePageSelection = useCallback((fileId: string, pageNum: number) => {
    setPdfFiles(prev => prev.map(file => {
      if (file.id === fileId) {
        const selectedPages = file.selectedPages.includes(pageNum)
          ? file.selectedPages.filter(p => p !== pageNum)
          : [...file.selectedPages, pageNum].sort((a, b) => a - b);
        return { ...file, selectedPages };
      }
      return file;
    }));
  }, []);

  // Select all pages for a PDF
  const selectAllPages = useCallback((fileId: string, select: boolean) => {
    setPdfFiles(prev => prev.map(file => {
      if (file.id === fileId) {
        return {
          ...file,
          selectedPages: select ? Array.from({ length: file.numPages || 0 }, (_, i) => i + 1) : []
        };
      }
      return file;
    }));
  }, []);

  // Open preview dialog
  const openPreview = useCallback((pdfFile: PDFFile) => {
    setPreviewDialog({ open: true, pdfFile });
    setCurrentPreviewPage(1);
    setPreviewScale(1.0);
  }, []);

  // Close preview dialog
  const closePreview = useCallback(() => {
    setPreviewDialog({ open: false, pdfFile: null });
  }, []);

  // Merge PDFs
  const handleMerge = useCallback(async () => {
    if (pdfFiles.length === 0) {
      showNotification('Please add at least one PDF file!', 'error');
      return;
    }

    if (totalSelectedPages === 0) {
      showNotification('Please select at least one page to merge!', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      // Create a new PDF document
      const mergedPdf = await PDFDocument.create();

      // Process each PDF file and selected pages
      let totalPagesAdded = 0;
      for (const pdfFile of pdfFiles) {
        if (pdfFile.selectedPages.length === 0) continue;
        
        const arrayBuffer = await pdfFile.file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        
        // Convert 1-based page numbers to 0-based indices
        const pageIndices = pdfFile.selectedPages.map(pageNum => pageNum - 1);
        
        // Copy selected pages from this PDF
        const pages = await mergedPdf.copyPages(pdf, pageIndices);
        pages.forEach((page) => mergedPdf.addPage(page));
        
        totalPagesAdded += pages.length;
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

      showNotification(`Successfully merged ${totalPagesAdded} pages from ${pdfFiles.length} PDF files!`, 'success');
    } catch (error) {
      console.error('Error merging PDFs:', error);
      showNotification('Error merging PDFs. Please ensure all files are valid PDF documents.', 'error');
    } finally {
      setIsProcessing(false);
    }
      }, [pdfFiles, outputFileName, showNotification]);

  // Cleanup effect
  React.useEffect(() => {
    return () => {
      // Clean up blob URLs on unmount
      pdfFiles.forEach(file => {
        if (file.blobUrl) {
          URL.revokeObjectURL(file.blobUrl);
        }
      });
    };
  }, [pdfFiles]);

  // Calculate total selected pages
  const totalSelectedPages = pdfFiles.reduce((total, file) => total + file.selectedPages.length, 0);

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
                    bgcolor: 'background.paper',
                    alignItems: 'flex-start',
                    py: 2,
                    display: 'flex',
                    gap: 2
                  }}
                >
                  <PdfIcon sx={{ color: 'error.main', mt: 0.5, flexShrink: 0 }} />
                  
                  {/* Content area with proper flex grow */}
                  <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Typography 
                      variant="subtitle1" 
                      component="div"
                      sx={{ 
                        wordBreak: 'break-word',
                        overflowWrap: 'break-word',
                        hyphens: 'auto',
                        mb: 0.5
                      }}
                    >
                      {pdfFile.name}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      Size: {pdfFile.size} • {pdfFile.numPages} pages
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
                      <Chip 
                        label={`${pdfFile.selectedPages.length} selected`} 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                      />
                      <Chip 
                        label={`Position: ${index + 1}`} 
                        size="small" 
                        variant="outlined"
                      />
                    </Box>
                  </Box>

                  {/* Action buttons with fixed positioning */}
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: 0.5,
                    flexShrink: 0,
                    mt: 0.5
                  }}>
                    <IconButton
                      onClick={() => openPreview(pdfFile)}
                      size="small"
                      title="Preview & Select Pages"
                      sx={{ p: 0.5 }}
                    >
                      <PreviewIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => movePdfFile(index, 'up')}
                      disabled={index === 0}
                      size="small"
                      sx={{ p: 0.5 }}
                    >
                      <ArrowUpIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => movePdfFile(index, 'down')}
                      disabled={index === pdfFiles.length - 1}
                      size="small"
                      sx={{ p: 0.5 }}
                    >
                      <ArrowDownIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => removePdfFile(pdfFile.id)}
                      size="small"
                      color="error"
                      title="Remove PDF"
                      sx={{ p: 0.5 }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
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
          disabled={totalSelectedPages === 0 || isProcessing}
          sx={{ px: 4, py: 1.5 }}
        >
          {isProcessing ? 'Merging...' : `Merge ${totalSelectedPages} Selected Pages`}
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

      {/* Preview Dialog */}
      <Dialog
        open={previewDialog.open}
        onClose={closePreview}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: { height: '90vh' }
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              Preview & Select Pages: {previewDialog.pdfFile?.name}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <IconButton onClick={() => setPreviewScale(prev => Math.max(0.5, prev - 0.2))}>
                <ZoomOutIcon />
              </IconButton>
              <Typography variant="body2" sx={{ minWidth: 50, textAlign: 'center' }}>
                {Math.round(previewScale * 100)}%
              </Typography>
              <IconButton onClick={() => setPreviewScale(prev => Math.min(2.0, prev + 0.2))}>
                <ZoomInIcon />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>
        
        <DialogContent>
          {previewDialog.pdfFile && currentPreviewFile && (
            <Box>
              {/* Page Selection Controls */}
              <Box sx={{ mb: 2, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
                <Typography variant="h6" gutterBottom>
                  Page Selection ({currentPreviewFile.selectedPages.length} of {currentPreviewFile.numPages} selected)
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => selectAllPages(currentPreviewFile.id, true)}
                  >
                    Select All
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => selectAllPages(currentPreviewFile.id, false)}
                  >
                    Deselect All
                  </Button>
                </Box>
                
                {/* Page Checkboxes */}
                <Grid container spacing={1}>
                  {Array.from({ length: currentPreviewFile.numPages || 0 }, (_, i) => i + 1).map(pageNum => (
                    <Grid item key={pageNum}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={currentPreviewFile.selectedPages.includes(pageNum)}
                            onChange={() => togglePageSelection(currentPreviewFile.id, pageNum)}
                            size="small"
                          />
                        }
                        label={`${pageNum}`}
                        sx={{ mr: 1 }}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>

              {/* PDF Preview */}
              <Box sx={{ textAlign: 'center', border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  PDF Preview
                </Typography>
                {previewDialog.pdfFile?.blobUrl && (
                  <Document
                    file={previewDialog.pdfFile.blobUrl}
                    onLoadSuccess={({ numPages }) => {
                       console.log(`Successfully loaded PDF with ${numPages} pages`);
                    }}
                    onLoadError={(error) => {
                       console.error('Error loading PDF for preview:', error);
                       console.error('Error details:', {
                         message: error.message,
                         name: error.name,
                         pdfFile: previewDialog.pdfFile?.name,
                         workerSrc: pdfjs.GlobalWorkerOptions.workerSrc
                       });
                       showNotification('Error loading PDF preview. The file might be corrupted or encrypted.', 'error');
                    }}

                    loading={
                      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
                        <CircularProgress />
                        <Typography sx={{ ml: 2 }}>Loading PDF...</Typography>
                      </Box>
                    }
                    error={
                      <Box sx={{ textAlign: 'center', p: 3 }}>
                        <Typography color="error" gutterBottom>
                          Failed to load PDF preview
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          The PDF file might be corrupted, encrypted, or in an unsupported format.
                        </Typography>
                      </Box>
                    }
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Button
                        onClick={() => setCurrentPreviewPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPreviewPage <= 1}
                        size="small"
                      >
                        Previous
                      </Button>
                      <Typography>
                        Page {currentPreviewPage} of {previewDialog.pdfFile.numPages}
                      </Typography>
                      <Button
                        onClick={() => setCurrentPreviewPage(prev => Math.min(previewDialog.pdfFile?.numPages || 1, prev + 1))}
                        disabled={currentPreviewPage >= (previewDialog.pdfFile.numPages || 1)}
                        size="small"
                      >
                        Next
                      </Button>
                    </Box>
                    
                    <Box sx={{ 
                      maxHeight: 400, 
                      overflow: 'auto', 
                      display: 'flex', 
                      justifyContent: 'center',
                      border: previewDialog.pdfFile.selectedPages.includes(currentPreviewPage) ? '3px solid green' : '1px solid #ccc',
                      borderRadius: 1,
                      p: 1
                    }}>
                      <Page
                        pageNumber={currentPreviewPage}
                        scale={previewScale}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                      />
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {previewDialog.pdfFile.selectedPages.includes(currentPreviewPage) 
                        ? '✅ This page is selected for merging'
                        : '❌ This page will not be included in merge'
                      }
                    </Typography>
                  </Document>
                )}
              </Box>
            </Box>
          )}
        </DialogContent>
        
        <DialogActions>
          <Button onClick={closePreview}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PdfMergerTool; 