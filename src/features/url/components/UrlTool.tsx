import React, { useState } from 'react';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import { urlService } from '../api/urlService';
import { useApi } from '../../../shared/hooks/useApi';
import { ResultCard } from '../../../shared/components/ResultCard';
import { LoadingButton } from '../../../shared/components/LoadingButton';
import { validation } from '../../../shared/utils/validation';
import { ProfessionalToolLayout, ProfessionalCard, ProfessionalButtonGroup } from '../../../shared/components/ProfessionalToolLayout';
import { getErrorMessage } from '../../../shared/utils/errorHandling';

const UrlTool: React.FC = () => {
  const [url, setUrl] = useState('');
  const [operation, setOperation] = useState('encode');

  const urlApi = useApi(urlService.process);

  const handleProcess = () => {
    if (!validation.isNotEmpty(url)) {
      return;
    }
    
    urlApi.execute({ text: url, operation: operation as 'encode' | 'decode', encoding: 'UTF-8' });
  };

  const handleClear = () => {
    setUrl('');
    urlApi.reset();
  };

  const result = urlApi.data;

  return (
    <ProfessionalToolLayout 
      title="URL Encoder/Decoder"
      description="Encode URLs for safe transmission or decode encoded URLs back to readable format"
    >
      <ProfessionalCard title="Input">
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Operation</InputLabel>
          <Select
            value={operation}
            label="Operation"
            onChange={(e) => setOperation(e.target.value)}
          >
            <MenuItem value="encode">Encode</MenuItem>
            <MenuItem value="decode">Decode</MenuItem>
          </Select>
        </FormControl>

        <TextField
          fullWidth
          multiline
          rows={6}
          label={`URL to ${operation}`}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder={operation === 'encode' ? 'Enter URL to encode...' : 'Enter encoded URL to decode...'}
          sx={{ mb: 2 }}
        />

        <ProfessionalButtonGroup>
          <LoadingButton
            variant="contained"
            loading={urlApi.loading}
            onClick={handleProcess}
            disabled={!validation.isNotEmpty(url)}
          >
            {operation === 'encode' ? 'Encode' : 'Decode'} URL
          </LoadingButton>
          <LoadingButton
            variant="outlined"
            loading={false}
            onClick={handleClear}
          >
            Clear
          </LoadingButton>
        </ProfessionalButtonGroup>

        {urlApi.error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {getErrorMessage(urlApi.error)}
          </Alert>
        )}
      </ProfessionalCard>

      {result && (
        <ResultCard
          title={`${operation === 'encode' ? 'Encoded' : 'Decoded'} URL`}
          content={result.processedText || ''}
        />
      )}
    </ProfessionalToolLayout>
  );
};

export default UrlTool; 