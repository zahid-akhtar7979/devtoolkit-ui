import React, { useState } from 'react';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import { hashService } from '../api/hashService';
import { useApi } from '../../../shared/hooks/useApi';
import { ResultCard } from '../../../shared/components/ResultCard';
import { LoadingButton } from '../../../shared/components/LoadingButton';
import { validation } from '../../../shared/utils/validation';
import { ProfessionalToolLayout, ProfessionalCard, ProfessionalButtonGroup } from '../../../shared/components/ProfessionalToolLayout';
import { getErrorMessage } from '../../../shared/utils/errorHandling';

const HashTool: React.FC = () => {
  const [text, setText] = useState('');
  const [algorithm, setAlgorithm] = useState('');

  const hashApi = useApi(hashService.generate);

  const handleGenerate = () => {
    if (!validation.isNotEmpty(text) || !validation.isNotEmpty(algorithm)) {
      return;
    }
    hashApi.execute({ text, algorithm });
  };

  const handleClear = () => {
    setText('');
    setAlgorithm('');
    hashApi.reset();
  };

  const algorithms = [
    { value: '', label: 'All Algorithms' },
    { value: 'MD5', label: 'MD5' },
    { value: 'SHA-1', label: 'SHA-1' },
    { value: 'SHA-256', label: 'SHA-256' },
    { value: 'SHA-512', label: 'SHA-512' },
  ];

  return (
    <ProfessionalToolLayout 
      title="Hash Generator"
      description="Generate cryptographic hashes using various algorithms like MD5, SHA-1, SHA-256, and SHA-512"
    >
      <ProfessionalCard title="Input">
        <TextField
          fullWidth
          multiline
          rows={6}
          label="Text to Hash"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to generate hash..."
          sx={{ mb: 2 }}
        />

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Algorithm</InputLabel>
          <Select
            value={algorithm}
            label="Algorithm"
            onChange={(e) => setAlgorithm(e.target.value)}
          >
            <MenuItem value="MD5">MD5</MenuItem>
            <MenuItem value="SHA-1">SHA-1</MenuItem>
            <MenuItem value="SHA-256">SHA-256</MenuItem>
            <MenuItem value="SHA-512">SHA-512</MenuItem>
          </Select>
        </FormControl>

        <ProfessionalButtonGroup>
          <LoadingButton
            variant="contained"
            loading={hashApi.loading}
            onClick={handleGenerate}
            disabled={!validation.isNotEmpty(text) || !validation.isNotEmpty(algorithm)}
          >
            Generate Hash
          </LoadingButton>
          <LoadingButton
            variant="outlined"
            loading={false}
            onClick={handleClear}
          >
            Clear
          </LoadingButton>
        </ProfessionalButtonGroup>

        {hashApi.error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {getErrorMessage(hashApi.error)}
          </Alert>
        )}
      </ProfessionalCard>

      {hashApi.data && (
        <ResultCard
          title={`${hashApi.data.algorithm} Hash`}
          content={hashApi.data.specificHash}
        />
      )}
    </ProfessionalToolLayout>
  );
};

export default HashTool; 