import React, { useState } from 'react';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import { uuidService } from '../../services/uuidService';
import { useApi } from '../../hooks/useApi';
import { ResultCard } from '../../shared/components/ResultCard';
import { LoadingButton } from '../../shared/components/LoadingButton';
import { ProfessionalToolLayout, ProfessionalCard, ProfessionalButtonGroup } from '../../shared/components/ProfessionalToolLayout';
import { getErrorMessage } from '../../utils/errorHandling';
import { UuidResponse } from '../../types';

const UuidTool: React.FC = () => {
  const [count, setCount] = useState(1);
  const [type, setType] = useState('v4');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<UuidResponse | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await uuidService.generate({ type, count: 1 });
      setResult(response);
    } catch (err: any) {
      setError(err.message || 'Failed to generate UUID');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setResult(null);
    setError(null);
  };

  const handleGenerateMultiple = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await uuidService.generateMultiple({ type, count });
      setResult(response);
      
      // Show a warning if fallback method was used
      if (response.message?.includes('fallback method')) {
        console.warn('Multiple UUID generation used fallback method - backend endpoint may not be available');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to generate UUIDs');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProfessionalToolLayout 
      title="UUID Generator"
      description="Generate unique identifiers using various UUID versions (v1, v4, v5)"
    >
      <ProfessionalCard title="Input">
        <ProfessionalButtonGroup sx={{ mb: 2 }}>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>UUID Type</InputLabel>
            <Select
              value={type}
              label="UUID Type"
              onChange={(e) => setType(e.target.value)}
            >
              <MenuItem value="v1">UUID v1</MenuItem>
              <MenuItem value="v4">UUID v4</MenuItem>
              <MenuItem value="v5">UUID v5</MenuItem>
            </Select>
          </FormControl>

          <TextField
            type="number"
            label="Count"
            value={count}
            onChange={(e) => setCount(Math.max(1, parseInt(e.target.value) || 1))}
            inputProps={{ min: 1, max: 100 }}
            sx={{ width: 120 }}
          />
        </ProfessionalButtonGroup>

        <ProfessionalButtonGroup>
          <LoadingButton
            variant="contained"
            loading={loading}
            onClick={count === 1 ? handleGenerate : handleGenerateMultiple}
          >
            Generate {count === 1 ? 'UUID' : `${count} UUIDs`}
          </LoadingButton>
          <LoadingButton
            variant="outlined"
            loading={false}
            onClick={handleClear}
          >
            Clear
          </LoadingButton>
        </ProfessionalButtonGroup>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </ProfessionalCard>

      {result && (
        <ResultCard
          title={`Generated UUID${count > 1 ? 's' : ''} (${type.toUpperCase()})`}
          content={
            result.uuids ? 
              result.uuids.join('\n') : 
              result.uuid || 'No UUID generated'
          }
        />
      )}
    </ProfessionalToolLayout>
  );
};

export default UuidTool; 