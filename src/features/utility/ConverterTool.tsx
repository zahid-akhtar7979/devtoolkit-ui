import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Paper,
  Chip,
} from '@mui/material';
import { utilityService } from '../../services/utilityService';
import { useApi } from '../../hooks/useApi';
import { ResultCard } from '../../shared/components/ResultCard';
import { LoadingButton } from '../../shared/components/LoadingButton';
import { validation } from '../../utils/validation';

const ConverterTool: React.FC = () => {
  const [input, setInput] = useState('');
  const [sourceFormat, setSourceFormat] = useState('JSON');
  const [targetFormat, setTargetFormat] = useState('YAML');

  const converterApi = useApi(utilityService.convertFormat);

  const handleConvert = () => {
    if (!validation.isNotEmpty(input)) {
      return;
    }
    converterApi.execute({ text: input, sourceFormat, targetFormat });
  };

  const handleClear = () => {
    setInput('');
    converterApi.reset();
  };

  const handleJsonSample = () => {
    const sampleJSON = `{
  "name": "John Doe",
  "age": 30,
  "email": "john@example.com",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "zipCode": "10001",
    "country": "USA"
  },
  "hobbies": ["reading", "swimming", "coding"],
  "isActive": true,
  "balance": 1250.75
}`;
    setInput(sampleJSON);
    setSourceFormat('JSON');
    setTargetFormat('YAML');
  };

  const handleYamlSample = () => {
    const sampleYAML = `name: Jane Smith
age: 28
email: jane@example.com
address:
  street: 456 Oak Ave
  city: San Francisco
  zipCode: "94102"
  country: USA
hobbies:
  - photography
  - hiking
  - cooking
isActive: true
balance: 2150.25`;
    setInput(sampleYAML);
    setSourceFormat('YAML');
    setTargetFormat('JSON');
  };

  const handleXmlSample = () => {
    const sampleXML = `<?xml version="1.0" encoding="UTF-8"?>
<person>
  <name>Bob Johnson</name>
  <age>35</age>
  <email>bob@example.com</email>
  <address>
    <street>789 Pine St</street>
    <city>Seattle</city>
    <zipCode>98101</zipCode>
    <country>USA</country>
  </address>
  <hobbies>
    <hobby>gaming</hobby>
    <hobby>music</hobby>
    <hobby>travel</hobby>
  </hobbies>
  <isActive>true</isActive>
  <balance>3200.50</balance>
</person>`;
    setInput(sampleXML);
    setSourceFormat('XML');
    setTargetFormat('JSON');
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'JSON': return '🗂️';
      case 'YAML': return '📄';
      case 'XML': return '🏷️';
      default: return '📝';
    }
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
          🔄 Format Converter
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
          Convert between JSON, YAML, and XML formats with ease. Supports bidirectional conversion and pretty formatting.
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
                Conversion Settings
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Select source and target formats for conversion
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            gap: 4, 
            alignItems: { xs: 'stretch', md: 'center' } 
          }}>
            {/* Format Selection */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, opacity: 0.95 }}>
                🎛️ Format Selection
              </Typography>
              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                <FormControl sx={{ minWidth: 140 }}>
                  <InputLabel sx={{ color: 'rgba(255,255,255,0.8)', '&.Mui-focused': { color: '#ffd700' } }}>
                    From Format
                  </InputLabel>
                  <Select
                    value={sourceFormat}
                    label="From Format"
                    onChange={(e) => setSourceFormat(e.target.value)}
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
                      '& .MuiSvgIcon-root': {
                        color: 'rgba(255,255,255,0.8)',
                      }
                    }}
                  >
                    <MenuItem value="JSON">{getFormatIcon('JSON')} JSON</MenuItem>
                    <MenuItem value="YAML">{getFormatIcon('YAML')} YAML</MenuItem>
                    <MenuItem value="XML">{getFormatIcon('XML')} XML</MenuItem>
                  </Select>
                </FormControl>

                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: '24px',
                  mt: 2
                }}>
                  ➡️
                </Box>

                <FormControl sx={{ minWidth: 140 }}>
                  <InputLabel sx={{ color: 'rgba(255,255,255,0.8)', '&.Mui-focused': { color: '#ffd700' } }}>
                    To Format
                  </InputLabel>
                  <Select
                    value={targetFormat}
                    label="To Format"
                    onChange={(e) => setTargetFormat(e.target.value)}
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
                      '& .MuiSvgIcon-root': {
                        color: 'rgba(255,255,255,0.8)',
                      }
                    }}
                  >
                    <MenuItem value="JSON">{getFormatIcon('JSON')} JSON</MenuItem>
                    <MenuItem value="YAML">{getFormatIcon('YAML')} YAML</MenuItem>
                    <MenuItem value="XML">{getFormatIcon('XML')} XML</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>
            
            {/* Sample Data */}
            <Box sx={{ 
              borderLeft: { xs: 'none', md: '1px solid rgba(255,255,255,0.3)' },
              borderTop: { xs: '1px solid rgba(255,255,255,0.3)', md: 'none' },
              pl: { xs: 0, md: 4 },
              pt: { xs: 3, md: 0 },
              minWidth: { md: '300px' }
            }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, opacity: 0.95 }}>
                🎯 Quick Start Samples
              </Typography>
              <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                <Chip
                  label="🗂️ JSON Sample"
                  onClick={handleJsonSample}
                  variant="outlined"
                  sx={{ 
                    color: 'white',
                    borderColor: 'rgba(255,255,255,0.5)',
                    cursor: 'pointer',
                    fontWeight: 500,
                    px: 2,
                    py: 0.5,
                    '&:hover': { 
                      bgcolor: 'rgba(255,255,255,0.15)',
                      borderColor: 'rgba(255,255,255,0.8)',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                    },
                    transition: 'all 0.2s ease'
                  }}
                />
                <Chip
                  label="📄 YAML Sample"
                  onClick={handleYamlSample}
                  variant="outlined"
                  sx={{ 
                    color: 'white',
                    borderColor: 'rgba(255,255,255,0.5)',
                    cursor: 'pointer',
                    fontWeight: 500,
                    px: 2,
                    py: 0.5,
                    '&:hover': { 
                      bgcolor: 'rgba(255,255,255,0.15)',
                      borderColor: 'rgba(255,255,255,0.8)',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                    },
                    transition: 'all 0.2s ease'
                  }}
                />
                <Chip
                  label="🏷️ XML Sample"
                  onClick={handleXmlSample}
                  variant="outlined"
                  sx={{ 
                    color: 'white',
                    borderColor: 'rgba(255,255,255,0.5)',
                    cursor: 'pointer',
                    fontWeight: 500,
                    px: 2,
                    py: 0.5,
                    '&:hover': { 
                      bgcolor: 'rgba(255,255,255,0.15)',
                      borderColor: 'rgba(255,255,255,0.8)',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                    },
                    transition: 'all 0.2s ease'
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Input Section */}
      <Card sx={{ mb: 3, borderRadius: 3, elevation: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Box sx={{ fontSize: '24px' }}>{getFormatIcon(sourceFormat)}</Box>
            <Typography variant="h5" fontWeight="bold" color="primary">
              Input ({sourceFormat})
            </Typography>
          </Box>

          <TextField
            fullWidth
            multiline
            rows={12}
            label={`Enter ${sourceFormat} content`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Paste your ${sourceFormat} content here...`}
            sx={{ 
              mb: 3,
              '& .MuiInputBase-root': {
                fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                fontSize: '14px',
                lineHeight: 1.5,
              }
            }}
          />

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <LoadingButton
              variant="outlined"
              loading={converterApi.loading}
              onClick={handleConvert}
              disabled={!validation.isNotEmpty(input)}
              sx={{
                borderRadius: 3, px: 4, py: 1.5,
                borderColor: '#6c757d !important', borderWidth: '1px !important',
                color: '#6c757d !important', backgroundColor: 'transparent !important',
                '&:hover': { borderColor: '#5a6268 !important', borderWidth: '1px !important', color: '#5a6268 !important', bgcolor: 'rgba(108, 117, 125, 0.04) !important' },
                '&:disabled': { borderColor: '#6c757d !important', borderWidth: '1px !important', color: '#6c757d !important', backgroundColor: 'transparent !important', opacity: 0.6 },
                '&.Mui-disabled': { borderColor: '#6c757d !important', color: '#6c757d !important' }
              }}
            >
              {sourceFormat === targetFormat ? `Format ${sourceFormat}` : `Convert to ${targetFormat}`}
            </LoadingButton>
            <LoadingButton
              variant="outlined"
              loading={false}
              onClick={handleClear}
              sx={{
                borderRadius: 3, px: 4, py: 1.5,
                borderColor: '#6c757d !important', borderWidth: '1px !important',
                color: '#6c757d !important', backgroundColor: 'transparent !important',
                '&:hover': { borderColor: '#5a6268 !important', borderWidth: '1px !important', color: '#5a6268 !important', bgcolor: 'rgba(108, 117, 125, 0.04) !important' },
                '&:disabled': { borderColor: '#6c757d !important', borderWidth: '1px !important', color: '#6c757d !important', backgroundColor: 'transparent !important', opacity: 0.6 },
                '&.Mui-disabled': { borderColor: '#6c757d !important', color: '#6c757d !important' }
              }}
            >
              Clear All
            </LoadingButton>
          </Box>

          {converterApi.error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {converterApi.error}
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Result Section */}
      {converterApi.data && (
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
              {getFormatIcon(targetFormat)} Converted {targetFormat}
            </Typography>
          </Box>
                     <Box sx={{ 
             p: 4,
             '& .MuiTypography-root': {
               fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
               fontSize: '14px',
               lineHeight: 1.5,
             }
           }}>
             <ResultCard
               title=""
               content={converterApi.data.converted || 'No result'}
             />
           </Box>
        </Paper>
      )}
    </Box>
  );
};

export default ConverterTool; 