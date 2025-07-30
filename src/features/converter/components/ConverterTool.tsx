import React, { useState } from 'react';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Card,
  CardContent,
  Typography,
  Box,
} from '@mui/material';
import { utilityService } from '../api/utilityService';
import { useApi } from '../../../shared/hooks/useApi';
import { ResultCard } from '../../../shared/components/ResultCard';
import { LoadingButton } from '../../../shared/components/LoadingButton';
import { validation } from '../../../shared/utils/validation';
import { ProfessionalToolLayout, ProfessionalCard, ProfessionalButtonGroup } from '../../../shared/components/ProfessionalToolLayout';
import { getErrorMessage } from '../../../shared/utils/errorHandling';

const ConverterTool: React.FC = () => {
  const [input, setInput] = useState('');
  const [sourceFormat, setSourceFormat] = useState('json');
  const [targetFormat, setTargetFormat] = useState('yaml');

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

  const handleSample = () => {
    const sampleJson = `{
  "name": "John Doe",
  "age": 30,
  "email": "john@example.com",
  "active": true,
  "hobbies": ["reading", "swimming", "coding"]
}`;
    setInput(sampleJson);
    setSourceFormat('json');
    setTargetFormat('yaml');
  };

  const getFormatIcon = (format: string) => {
    switch (format.toLowerCase()) {
      case 'json': return '{}';
      case 'yaml': return '📄';
      case 'xml': return '📋';
      default: return '📝';
    }
  };

  const formats = [
    { value: 'json', label: 'JSON' },
    { value: 'yaml', label: 'YAML' },
    { value: 'xml', label: 'XML' },
  ];

  return (
    <ProfessionalToolLayout 
      title="Format Converter"
      description="Convert between JSON, YAML, and XML formats with proper formatting"
    >
      <ProfessionalCard title="Input">
        <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>From</InputLabel>
            <Select
              value={sourceFormat}
              label="From"
              onChange={(e) => setSourceFormat(e.target.value)}
            >
              {formats.map((format) => (
                <MenuItem key={format.value} value={format.value}>
                  {format.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>To</InputLabel>
            <Select
              value={targetFormat}
              label="To"
              onChange={(e) => setTargetFormat(e.target.value)}
            >
              {formats.map((format) => (
                <MenuItem key={format.value} value={format.value}>
                  {format.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {getFormatIcon(sourceFormat)} Input ({sourceFormat.toUpperCase()})
            </Typography>

            <TextField
              fullWidth
              multiline
              rows={12}
              label={`Enter ${sourceFormat.toUpperCase()} content`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Paste your ${sourceFormat.toUpperCase()} content here...`}
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
                {sourceFormat === targetFormat ? `Format ${sourceFormat.toUpperCase()}` : `Convert to ${targetFormat.toUpperCase()}`}
              </LoadingButton>
              <LoadingButton
                variant="outlined"
                loading={false}
                onClick={handleSample}
                sx={{ px: 4, py: 1.5 }}
              >
                Load Sample
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
                {getErrorMessage(converterApi.error)}
              </Alert>
            )}
          </CardContent>
        </Card>
      </ProfessionalCard>

      {/* Result Section */}
      {converterApi.data && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {getFormatIcon(targetFormat)} Output ({targetFormat.toUpperCase()})
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={12}
              value={converterApi.data.convertedText || 'No result'}
              InputProps={{
                readOnly: true,
                style: {
                  fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                  fontSize: '14px',
                  lineHeight: 1.5,
                }
              }}
            />
          </CardContent>
        </Card>
      )}
    </ProfessionalToolLayout>
  );
};

export default ConverterTool; 