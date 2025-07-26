import React, { useState } from 'react';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import { utilityService } from '../../services/utilityService';
import { useApi } from '../../hooks/useApi';
import { ResultCard } from '../../shared/components/ResultCard';
import { LoadingButton } from '../../shared/components/LoadingButton';
import { validation } from '../../utils/validation';
import { ProfessionalToolLayout, ProfessionalCard, ProfessionalButtonGroup } from '../../shared/components/ProfessionalToolLayout';

const TimestampTool: React.FC = () => {
  const [input, setInput] = useState('');
  const [format, setFormat] = useState('timestamp');

  const timestampApi = useApi(utilityService.convertTimestamp);

  const handleConvert = () => {
    if (!validation.isNotEmpty(input)) {
      return;
    }
    timestampApi.execute({ text: input, format });
  };

  const handleClear = () => {
    setInput('');
    timestampApi.reset();
  };

  const handleCurrentTimestamp = () => {
    const now = Math.floor(Date.now() / 1000);
    setInput(now.toString());
    setFormat('timestamp');
  };

  return (
    <ProfessionalToolLayout 
      title="Unix Timestamp Converter"
      description="Convert between Unix timestamps and human-readable dates"
    >
      <ProfessionalCard title="Input">
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Convert Type</InputLabel>
          <Select
            value={format}
            label="Convert Type"
            onChange={(e) => setFormat(e.target.value)}
          >
            <MenuItem value="timestamp">Timestamp to Date</MenuItem>
            <MenuItem value="date">Date to Timestamp</MenuItem>
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label={format === 'timestamp' ? 'Unix Timestamp' : 'Date (YYYY-MM-DD HH:mm:ss)'}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={format === 'timestamp' ? 'e.g., 1640995200' : 'e.g., 2022-01-01 00:00:00'}
          sx={{ mb: 2 }}
        />

        <ProfessionalButtonGroup>
          <LoadingButton
            variant="contained"
            loading={timestampApi.loading}
            onClick={handleConvert}
            disabled={!validation.isNotEmpty(input)}
          >
            Convert
          </LoadingButton>
          <LoadingButton
            variant="outlined"
            loading={false}
            onClick={handleCurrentTimestamp}
          >
            Current Timestamp
          </LoadingButton>
          <LoadingButton
            variant="outlined"
            loading={false}
            onClick={handleClear}
          >
            Clear
          </LoadingButton>
        </ProfessionalButtonGroup>

        {timestampApi.error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {timestampApi.error}
          </Alert>
        )}
      </ProfessionalCard>

      {timestampApi.data && (
        <ResultCard
          title="Conversion Result"
          content={timestampApi.data.converted || 'No result'}
        />
      )}
    </ProfessionalToolLayout>
  );
};

export default TimestampTool; 