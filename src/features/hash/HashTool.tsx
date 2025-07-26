import React, { useState } from 'react';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import { hashService } from '../../services/hashService';
import { useApi } from '../../hooks/useApi';
import { ResultCard } from '../../shared/components/ResultCard';
import { LoadingButton } from '../../shared/components/LoadingButton';
import { validation } from '../../utils/validation';
import { ProfessionalToolLayout, ProfessionalCard, ProfessionalButtonGroup } from '../../shared/components/ProfessionalToolLayout';

const HashTool: React.FC = () => {
  const [text, setText] = useState('');
  const [algorithm, setAlgorithm] = useState('');

  const hashApi = useApi(hashService.generate);

  const handleGenerate = () => {
    if (!validation.isNotEmpty(text)) {
      return;
    }
    hashApi.execute({ text, algorithm: algorithm || undefined });
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
            {algorithms.map((algo) => (
              <MenuItem key={algo.value} value={algo.value}>
                {algo.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <ProfessionalButtonGroup>
          <LoadingButton
            variant="contained"
            loading={hashApi.loading}
            onClick={handleGenerate}
            disabled={!validation.isNotEmpty(text)}
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
            {hashApi.error}
          </Alert>
        )}
      </ProfessionalCard>

      {hashApi.data && (
        <>
          {hashApi.data.hash ? (
            <ResultCard
              title={`${hashApi.data.algorithm} Hash`}
              content={hashApi.data.hash}
            />
          ) : hashApi.data.hashes ? (
            Object.entries(hashApi.data.hashes).map(([algo, hash]) => (
              <ResultCard
                key={algo}
                title={`${algo} Hash`}
                content={String(hash)}
              />
            ))
          ) : null}
        </>
      )}
    </ProfessionalToolLayout>
  );
};

export default HashTool; 