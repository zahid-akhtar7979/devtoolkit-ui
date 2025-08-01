import React, { useState } from 'react';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import { base64Service } from '../api/base64Service';
import { useApi } from '../../../shared/hooks/useApi';
import { ResultCard } from '../../../shared/components/ResultCard';
import { LoadingButton } from '../../../shared/components/LoadingButton';
import { validation } from '../../../shared/utils/validation';
import { ProfessionalToolLayout, ProfessionalCard, ProfessionalButtonGroup } from '../../../shared/components/ProfessionalToolLayout';
import { getErrorMessage } from '../../../shared/utils/errorHandling';

const Base64Tool: React.FC = () => {
  const [text, setText] = useState('');
  const [operation, setOperation] = useState('encode');

  const encodeApi = useApi(base64Service.encode);
  const decodeApi = useApi(base64Service.decode);

  const handleProcess = () => {
    if (!validation.isNotEmpty(text)) {
      return;
    }
    
    if (operation === 'encode') {
      encodeApi.execute({ text, operation: 'encode' });
    } else {
      decodeApi.execute({ text, operation: 'decode' });
    }
  };

  const handleClear = () => {
    setText('');
    encodeApi.reset();
    decodeApi.reset();
  };

  const currentApi = operation === 'encode' ? encodeApi : decodeApi;
  const result = currentApi.data;

  return (
    <ProfessionalToolLayout 
      title="Base64 Encoder/Decoder"
      description="Encode text to Base64 format or decode Base64 strings back to plain text"
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
          label={`Text to ${operation}`}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={operation === 'encode' ? 'Enter text to encode...' : 'Enter Base64 string to decode...'}
          sx={{ mb: 2 }}
        />

        <ProfessionalButtonGroup>
          <LoadingButton
            variant="contained"
            loading={currentApi.loading}
            onClick={handleProcess}
            disabled={!validation.isNotEmpty(text)}
          >
            {operation === 'encode' ? 'Encode' : 'Decode'}
          </LoadingButton>
          <LoadingButton
            variant="outlined"
            loading={false}
            onClick={handleClear}
          >
            Clear
          </LoadingButton>
        </ProfessionalButtonGroup>

        {currentApi.error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {getErrorMessage(currentApi.error)}
          </Alert>
        )}
      </ProfessionalCard>

      {result && (
        <ResultCard
          title={`${operation === 'encode' ? 'Encoded' : 'Decoded'} Result`}
          content={result.processedText || ''}
        />
      )}
    </ProfessionalToolLayout>
  );
};

export default Base64Tool; 