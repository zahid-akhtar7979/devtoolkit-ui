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
} from '@mui/material';
import { hashService } from '../../services/hashService';
import { useApi } from '../../hooks/useApi';
import { ResultCard } from '../../shared/components/ResultCard';
import { LoadingButton } from '../../shared/components/LoadingButton';
import { validation } from '../../utils/validation';

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
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Hash Generator
      </Typography>
      
      <Card sx={{ mb: 3 }}>
        <CardContent>
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

          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
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
          </Box>

          {hashApi.error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {hashApi.error}
            </Alert>
          )}
        </CardContent>
      </Card>

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
    </Box>
  );
};

export default HashTool; 