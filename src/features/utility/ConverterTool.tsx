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
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
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
  <n>Bob Johnson</n>
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
    <Box sx={{ p: 3 }}>
      {/* Header Section */}
      <Typography variant="h4" gutterBottom>
        <SwapHorizIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        Format Converter
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Convert between JSON, YAML, and XML formats with ease. Supports bidirectional conversion and pretty formatting.
      </Typography>

      {/* Configuration Panel */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            <SwapHorizIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Conversion Settings
          </Typography>
          
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            gap: 4, 
            alignItems: { xs: 'stretch', md: 'center' } 
          }}>
            {/* Format Selection */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                Format Selection
              </Typography>
              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', alignItems: 'center' }}>
                <FormControl sx={{ minWidth: 140 }}>
                  <InputLabel>From Format</InputLabel>
                  <Select
                    value={sourceFormat}
                    label="From Format"
                    onChange={(e) => setSourceFormat(e.target.value)}
                  >
                    <MenuItem value="JSON">{getFormatIcon('JSON')} JSON</MenuItem>
                    <MenuItem value="YAML">{getFormatIcon('YAML')} YAML</MenuItem>
                    <MenuItem value="XML">{getFormatIcon('XML')} XML</MenuItem>
                  </Select>
                </FormControl>

                <SwapHorizIcon sx={{ fontSize: '24px', color: 'text.secondary' }} />

                <FormControl sx={{ minWidth: 140 }}>
                  <InputLabel>To Format</InputLabel>
                  <Select
                    value={targetFormat}
                    label="To Format"
                    onChange={(e) => setTargetFormat(e.target.value)}
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
              borderLeft: { xs: 'none', md: '1px solid #e0e0e0' },
              borderTop: { xs: '1px solid #e0e0e0', md: 'none' },
              pl: { xs: 0, md: 4 },
              pt: { xs: 3, md: 0 },
              minWidth: { md: '300px' }
            }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                Quick Start Samples
              </Typography>
              <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                <Chip
                  label="JSON Sample"
                  onClick={handleJsonSample}
                  variant="outlined"
                  clickable
                />
                <Chip
                  label="YAML Sample"
                  onClick={handleYamlSample}
                  variant="outlined"
                  clickable
                />
                <Chip
                  label="XML Sample"
                  onClick={handleXmlSample}
                  variant="outlined"
                  clickable
                />
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Input Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {getFormatIcon(sourceFormat)} Input ({sourceFormat})
          </Typography>

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
              variant="contained"
              loading={converterApi.loading}
              onClick={handleConvert}
              disabled={!validation.isNotEmpty(input)}
              sx={{ px: 4, py: 1.5 }}
            >
              {sourceFormat === targetFormat ? `Format ${sourceFormat}` : `Convert to ${targetFormat}`}
            </LoadingButton>
            <LoadingButton
              variant="outlined"
              loading={false}
              onClick={handleClear}
              sx={{ px: 4, py: 1.5 }}
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
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {getFormatIcon(targetFormat)} Converted {targetFormat}
            </Typography>
            <Box sx={{ 
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
              <li>Select the source format (JSON, YAML, or XML)</li>
              <li>Choose the target format you want to convert to</li>
              <li>Paste your content or use a sample to get started</li>
              <li>Click "Convert" to transform your data</li>
            </ol>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ConverterTool; 