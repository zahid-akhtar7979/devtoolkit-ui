import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  TextField,
  FormControlLabel,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Chip,
  Grid,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  ButtonGroup,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  DragIndicator as DragIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
  Merge as MergeIcon,
  Download as DownloadIcon,
  Visibility as PreviewIcon,
  RotateRight as RotateIcon,
  Settings as SettingsIcon,
  PictureAsPdf as PdfIcon,
  ExpandMore as ExpandMoreIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  NavigateBefore as PrevIcon,
  NavigateNext as NextIcon,
  FirstPage as FirstPageIcon,
  LastPage as LastPageIcon,
} from '@mui/icons-material';
import { PDFDocument, degrees } from 'pdf-lib';
import { Document, Page, pdfjs } from 'react-pdf';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js`;

interface PDFFile {
  id: string;
  file: File;
  name: string;
  size: number;
  pageCount: number;
  selectedPages: string;
  preview?: string;
  rotation: number;
  password?: string;
}

interface MergeSettings {
  compressionLevel: number;
  addPageNumbers: boolean;
  customFilename: string;
  includeBookmarks: boolean;
}

interface PreviewState {
  open: boolean;
  fileId?: string;
  currentPage: number;
  scale: number;
  numPages: number;
}

const PdfMergerTool: React.FC = () => {
  const [pdfFiles, setPdfFiles] = useState<PDFFile[]>([]);
  const [mergeSettings, setMergeSettings] = useState<MergeSettings>({
    compressionLevel: 1,
    addPageNumbers: false,
    customFilename: 'merged-document',
    includeBookmarks: true,
  });
  const [isMerging, setIsMerging] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [previewDialog, setPreviewDialog] = useState<PreviewState>({ 
    open: false, 
    currentPage: 1, 
    scale: 1.2, 
    numPages: 0 
  });
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewFileUrl, setPreviewFileUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateId = () => Math.random().toString(36).substr(2, 9);



  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setError('');
    
    for (const file of files) {
      if (file.type !== 'application/pdf') {
        setError('Please select only PDF files');
        continue;
      }
      
      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const pageCount = pdfDoc.getPageCount();
        
        const newPdfFile: PDFFile = {
          id: generateId(),
          file,
          name: file.name,
          size: file.size,
          pageCount,
          selectedPages: `1-${pageCount}`,
          rotation: 0,
        };
        
        setPdfFiles(prev => [...prev, newPdfFile]);
        setSuccess(`Added ${file.name} (${pageCount} pages)`);
      } catch (err) {
        setError(`Failed to process ${file.name}. It might be password-protected or corrupted.`);
        console.error(err);
      }
    }
  };

  const handleRemoveFile = (id: string) => {
    setPdfFiles(prev => prev.filter(file => file.id !== id));
  };

  const handleMoveUp = (id: string) => {
    setPdfFiles(prev => {
      const index = prev.findIndex(file => file.id === id);
      if (index > 0) {
        const newFiles = [...prev];
        [newFiles[index - 1], newFiles[index]] = [newFiles[index], newFiles[index - 1]];
        return newFiles;
      }
      return prev;
    });
  };

  const handleMoveDown = (id: string) => {
    setPdfFiles(prev => {
      const index = prev.findIndex(file => file.id === id);
      if (index < prev.length - 1) {
        const newFiles = [...prev];
        [newFiles[index], newFiles[index + 1]] = [newFiles[index + 1], newFiles[index]];
        return newFiles;
      }
      return prev;
    });
  };

  const handlePageRangeChange = (id: string, pageRange: string) => {
    setPdfFiles(prev => prev.map(file => 
      file.id === id ? { ...file, selectedPages: pageRange } : file
    ));
  };

  const handleRotation = (id: string) => {
    setPdfFiles(prev => prev.map(file => 
      file.id === id ? { ...file, rotation: (file.rotation + 90) % 360 } : file
    ));
  };

  const handlePreview = (fileId: string) => {
    const file = pdfFiles.find(f => f.id === fileId);
    if (file) {
      // Clean up previous URL if it exists
      if (previewFileUrl) {
        URL.revokeObjectURL(previewFileUrl);
      }
      
      console.log('Creating preview for file:', file.name, 'size:', file.file.size, 'type:', file.file.type);
      
      // Validate file type
      if (file.file.type !== 'application/pdf') {
        setError('Invalid file type. Please select a PDF file.');
        return;
      }
      
      // Create new blob URL for the file
      const url = URL.createObjectURL(file.file);
      console.log('Created blob URL:', url);
      setPreviewFileUrl(url);
      setPreviewLoading(true);
      setError(''); // Clear any previous errors
    }
    
    setPreviewDialog({ 
      open: true, 
      fileId, 
      currentPage: 1, 
      scale: 1.2, 
      numPages: 0 
    });
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    console.log('PDF loaded successfully, pages:', numPages);
    setPreviewDialog(prev => ({ ...prev, numPages }));
    setPreviewLoading(false);
    setError(''); // Clear any previous errors
  };

  const onDocumentLoadError = (error: any) => {
    console.error('Error loading PDF:', error);
    console.error('Error details:', {
      name: error?.name,
      message: error?.message,
      stack: error?.stack,
      details: error?.details,
    });
    setError(`Failed to load PDF for preview: ${error?.message || 'Unknown error'}`);
    setPreviewLoading(false);
  };

  const changePage = (offset: number) => {
    setPreviewDialog(prev => ({
      ...prev,
      currentPage: Math.min(Math.max(1, prev.currentPage + offset), prev.numPages)
    }));
  };

  const changeScale = (newScale: number) => {
    setPreviewDialog(prev => ({
      ...prev,
      scale: Math.min(Math.max(0.5, newScale), 3.0)
    }));
  };

  const parsePageRange = (range: string, maxPages: number): number[] => {
    const pages: number[] = [];
    const parts = range.split(',').map(part => part.trim());
    
    for (const part of parts) {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map(p => p.trim());
        const startPage = start === '' ? 1 : Math.max(1, parseInt(start));
        const endPage = end === '' || end === 'end' ? maxPages : Math.min(maxPages, parseInt(end));
        
        for (let i = startPage; i <= endPage; i++) {
          if (!pages.includes(i)) pages.push(i);
        }
      } else {
        const pageNum = parseInt(part);
        if (pageNum >= 1 && pageNum <= maxPages && !pages.includes(pageNum)) {
          pages.push(pageNum);
        }
      }
    }
    
    return pages.sort((a, b) => a - b);
  };

  const handleMergePDFs = async () => {
    if (pdfFiles.length < 2) {
      setError('Please select at least 2 PDF files to merge');
      return;
    }

    setIsMerging(true);
    setError('');

    try {
      const mergedPdf = await PDFDocument.create();
      
      for (const pdfFile of pdfFiles) {
        const arrayBuffer = await pdfFile.file.arrayBuffer();
        const sourcePdf = await PDFDocument.load(arrayBuffer);
        
        const selectedPageNumbers = parsePageRange(pdfFile.selectedPages, pdfFile.pageCount);
        
        for (const pageNumber of selectedPageNumbers) {
          const [copiedPage] = await mergedPdf.copyPages(sourcePdf, [pageNumber - 1]);
          
          // Apply rotation if needed
          if (pdfFile.rotation > 0) {
            copiedPage.setRotation(degrees(pdfFile.rotation));
          }
          
          mergedPdf.addPage(copiedPage);
        }
      }

      // Add page numbers if requested
      if (mergeSettings.addPageNumbers) {
        const pages = mergedPdf.getPages();
        pages.forEach((page, index) => {
          const { width, height } = page.getSize();
          page.drawText(`${index + 1}`, {
            x: width - 50,
            y: 20,
            size: 10,
          });
        });
      }

      const pdfBytes = await mergedPdf.save();
      
      // Create download link
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${mergeSettings.customFilename}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      const totalPages = pdfFiles.reduce((sum, file) => {
        const pages = parsePageRange(file.selectedPages, file.pageCount);
        return sum + pages.length;
      }, 0);

      setSuccess(`Successfully merged ${pdfFiles.length} PDFs with ${totalPages} total pages!`);
    } catch (err) {
      setError('Failed to merge PDFs. Please check if any files are password-protected.');
      console.error(err);
    } finally {
      setIsMerging(false);
    }
  };

  const handleClear = () => {
    setPdfFiles([]);
    setError('');
    setSuccess('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getTotalPages = (): number => {
    return pdfFiles.reduce((sum, file) => {
      const pages = parsePageRange(file.selectedPages, file.pageCount);
      return sum + pages.length;
    }, 0);
  };

  const getCurrentFile = () => {
    return pdfFiles.find(file => file.id === previewDialog.fileId);
  };

  // Cleanup blob URL on component unmount
  useEffect(() => {
    return () => {
      if (previewFileUrl) {
        URL.revokeObjectURL(previewFileUrl);
      }
    };
  }, [previewFileUrl]);

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
          📄 PDF Merger
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
          Merge multiple PDFs into a single document. Select specific pages, reorder files, and customize the output.
        </Typography>
      </Box>

      {/* Upload Section */}
      <Card sx={{ mb: 3, borderRadius: 3, elevation: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <PdfIcon sx={{ fontSize: '32px', color: 'primary.main' }} />
            <Typography variant="h5" fontWeight="bold" color="primary">
              Select PDF Files
            </Typography>
          </Box>

          <input
            type="file"
            multiple
            accept=".pdf,application/pdf"
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
              Click to select PDF files or drag and drop
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Select multiple PDF files to merge • No file size limit
            </Typography>
          </Paper>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Button
              variant="outlined"
              startIcon={<SettingsIcon />}
              onClick={() => setSettingsOpen(true)}
              sx={{ px: 4, py: 1.5 }}
            >
              Merge Settings
            </Button>
            <Button
              variant="outlined"
              onClick={handleClear}
              disabled={pdfFiles.length === 0}
              sx={{ px: 4, py: 1.5 }}
            >
              Clear All
            </Button>
          </Box>

          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
        </CardContent>
      </Card>

      {/* PDF Files List */}
      {pdfFiles.length > 0 && (
        <Card sx={{ mb: 3, borderRadius: 3, elevation: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" fontWeight="bold">
                📚 PDF Files ({pdfFiles.length})
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Chip 
                  label={`${getTotalPages()} pages selected`} 
                  color="primary" 
                  variant="outlined" 
                />
                <Button
                  variant="contained"
                  startIcon={<MergeIcon />}
                  onClick={handleMergePDFs}
                  disabled={pdfFiles.length < 2 || isMerging}
                  sx={{ px: 4, py: 1.5 }}
                >
                  {isMerging ? 'Merging...' : 'Merge PDFs'}
                </Button>
              </Box>
            </Box>

            {isMerging && (
              <Box sx={{ mb: 3 }}>
                <LinearProgress />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Merging PDFs... This may take a moment for large files.
                </Typography>
              </Box>
            )}

            <List>
              {pdfFiles.map((pdfFile, index) => (
                <ListItem key={pdfFile.id} sx={{ 
                  border: '1px solid #e0e0e0', 
                  borderRadius: 2, 
                  mb: 1,
                  bgcolor: 'background.paper'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 2 }}>
                    <DragIcon sx={{ color: 'text.secondary' }} />
                    <Typography variant="h6" sx={{ minWidth: 24 }}>
                      {index + 1}
                    </Typography>
                  </Box>
                  
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {pdfFile.name}
                        </Typography>
                        <Chip size="small" label={`${pdfFile.pageCount} pages`} />
                        <Chip size="small" label={formatFileSize(pdfFile.size)} variant="outlined" />
                        {pdfFile.rotation > 0 && (
                          <Chip size="small" label={`${pdfFile.rotation}°`} color="secondary" />
                        )}
                      </Box>
                    }
                    secondary={
                      <Box sx={{ mt: 1 }}>
                        <TextField
                          size="small"
                          label="Page range (e.g., 1-3, 5, 7-end)"
                          value={pdfFile.selectedPages}
                          onChange={(e) => handlePageRangeChange(pdfFile.id, e.target.value)}
                          sx={{ minWidth: 250, mr: 2 }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          Selected: {parsePageRange(pdfFile.selectedPages, pdfFile.pageCount).length} pages
                        </Typography>
                      </Box>
                    }
                  />
                  
                  <ListItemSecondaryAction>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton onClick={() => handleRotation(pdfFile.id)} title="Rotate 90°">
                        <RotateIcon />
                      </IconButton>
                      <IconButton 
                        onClick={() => handlePreview(pdfFile.id)}
                        title="Preview"
                      >
                        <PreviewIcon />
                      </IconButton>
                      <IconButton 
                        onClick={() => handleMoveUp(pdfFile.id)} 
                        disabled={index === 0}
                        title="Move Up"
                      >
                        <ArrowUpIcon />
                      </IconButton>
                      <IconButton 
                        onClick={() => handleMoveDown(pdfFile.id)} 
                        disabled={index === pdfFiles.length - 1}
                        title="Move Down"
                      >
                        <ArrowDownIcon />
                      </IconButton>
                      <IconButton 
                        onClick={() => handleRemoveFile(pdfFile.id)}
                        color="error"
                        title="Remove"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}

      {/* Settings Dialog */}
      <Dialog open={settingsOpen} onClose={() => setSettingsOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>⚙️ Merge Settings</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Output filename"
              value={mergeSettings.customFilename}
              onChange={(e) => setMergeSettings(prev => ({ ...prev, customFilename: e.target.value }))}
              sx={{ mb: 3 }}
            />
            
            <FormControlLabel
              control={
                <Checkbox
                  checked={mergeSettings.addPageNumbers}
                  onChange={(e) => setMergeSettings(prev => ({ ...prev, addPageNumbers: e.target.checked }))}
                />
              }
              label="Add page numbers to merged PDF"
              sx={{ mb: 2, display: 'block' }}
            />
            
            <FormControlLabel
              control={
                <Checkbox
                  checked={mergeSettings.includeBookmarks}
                  onChange={(e) => setMergeSettings(prev => ({ ...prev, includeBookmarks: e.target.checked }))}
                />
              }
              label="Include bookmarks (if available)"
              sx={{ mb: 2, display: 'block' }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSettingsOpen(false)}>Cancel</Button>
          <Button onClick={() => setSettingsOpen(false)} variant="contained">Save Settings</Button>
        </DialogActions>
      </Dialog>

      {/* Enhanced Preview Dialog */}
      <Dialog 
        open={previewDialog.open} 
        onClose={() => setPreviewDialog(prev => ({ ...prev, open: false }))} 
        maxWidth="lg" 
        fullWidth
        PaperProps={{
          sx: { height: '90vh', display: 'flex', flexDirection: 'column' }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              📖 PDF Preview: {getCurrentFile()?.name}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Page {previewDialog.currentPage} of {previewDialog.numPages}
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 0 }}>
          {/* Controls */}
          <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0', bgcolor: '#f5f5f5' }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <ButtonGroup variant="outlined" size="small">
                  <Button 
                    onClick={() => setPreviewDialog(prev => ({ ...prev, currentPage: 1 }))}
                    disabled={previewDialog.currentPage <= 1}
                    title="First Page"
                  >
                    <FirstPageIcon />
                  </Button>
                  <Button 
                    onClick={() => changePage(-1)}
                    disabled={previewDialog.currentPage <= 1}
                    title="Previous Page"
                  >
                    <PrevIcon />
                  </Button>
                  <Button 
                    onClick={() => changePage(1)}
                    disabled={previewDialog.currentPage >= previewDialog.numPages}
                    title="Next Page"
                  >
                    <NextIcon />
                  </Button>
                  <Button 
                    onClick={() => setPreviewDialog(prev => ({ ...prev, currentPage: prev.numPages }))}
                    disabled={previewDialog.currentPage >= previewDialog.numPages}
                    title="Last Page"
                  >
                    <LastPageIcon />
                  </Button>
                </ButtonGroup>
              </Grid>
              
              <Grid item>
                <ButtonGroup variant="outlined" size="small">
                  <Button 
                    onClick={() => changeScale(previewDialog.scale - 0.2)}
                    disabled={previewDialog.scale <= 0.5}
                    title="Zoom Out"
                  >
                    <ZoomOutIcon />
                  </Button>
                  <Button variant="text" sx={{ minWidth: 80 }}>
                    {Math.round(previewDialog.scale * 100)}%
                  </Button>
                  <Button 
                    onClick={() => changeScale(previewDialog.scale + 0.2)}
                    disabled={previewDialog.scale >= 3.0}
                    title="Zoom In"
                  >
                    <ZoomInIcon />
                  </Button>
                </ButtonGroup>
              </Grid>
              
              <Grid item xs>
                <TextField
                  size="small"
                  type="number"
                  label="Go to page"
                  value={previewDialog.currentPage}
                  onChange={(e) => {
                    const page = parseInt(e.target.value);
                    if (page >= 1 && page <= previewDialog.numPages) {
                      setPreviewDialog(prev => ({ ...prev, currentPage: page }));
                    }
                  }}
                  inputProps={{ min: 1, max: previewDialog.numPages }}
                  sx={{ maxWidth: 120 }}
                />
              </Grid>
            </Grid>
          </Box>

          {/* PDF Viewer */}
          <Box sx={{ 
            flex: 1, 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'flex-start',
            overflow: 'auto',
            p: 2,
            bgcolor: '#f0f0f0'
          }}>
            {getCurrentFile() && previewFileUrl && (
              <Document
                file={previewFileUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
                options={{
                  cMapUrl: `https://unpkg.com/pdfjs-dist@2.16.105/cmaps/`,
                  cMapPacked: true,
                  disableAutoFetch: false,
                  disableStream: false,
                }}
                loading={
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <LinearProgress sx={{ mb: 2 }} />
                    <Typography>Loading PDF...</Typography>
                  </Box>
                }
                error={
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography color="error">
                      Failed to load PDF. The file might be corrupted or password-protected.
                    </Typography>
                  </Box>
                }
              >
                <Page
                  pageNumber={previewDialog.currentPage}
                  scale={previewDialog.scale}
                  renderTextLayer={true}
                  renderAnnotationLayer={true}
                />
              </Document>
            )}
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 2, borderTop: '1px solid #e0e0e0' }}>
          <Button onClick={() => {
            // Clean up blob URL when closing
            if (previewFileUrl) {
              URL.revokeObjectURL(previewFileUrl);
              setPreviewFileUrl(null);
            }
            setPreviewDialog(prev => ({ ...prev, open: false }));
          }}>
            Close Preview
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PdfMergerTool; 