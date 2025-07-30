import React, { useState } from 'react';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import { timestampService } from '../api/timestampService';
import { useApi } from '../../../shared/hooks/useApi';
import { ResultCard } from '../../../shared/components/ResultCard';
import { LoadingButton } from '../../../shared/components/LoadingButton';
import { validation } from '../../../shared/utils/validation';
import { ProfessionalToolLayout, ProfessionalCard, ProfessionalButtonGroup } from '../../../shared/components/ProfessionalToolLayout';
import { getErrorMessage } from '../../../shared/utils/errorHandling';

const TimestampTool: React.FC = () => {
  const [input, setInput] = useState('');
  const [format, setFormat] = useState('timestamp');
  const [convertedResult, setConvertedResult] = useState<string>('');

  const timestampApi = useApi(timestampService.convert);

  const handleConvert = () => {
    if (!validation.isNotEmpty(input)) {
      return;
    }
    
    if (format === 'timestamp') {
      // Convert timestamp to date - send timestamp directly to backend
      timestampApi.execute({ 
        timestamp: input, 
        sourceFormat: 'UNIX_SECONDS', 
        targetFormat: 'ISO_8601' 
      });
    } else {
      // Convert date to timestamp - convert date to Unix timestamp in frontend
      try {
        const date = new Date(input);
        if (isNaN(date.getTime())) {
          // Show error for invalid date
          return;
        }
        const timestamp = Math.floor(date.getTime() / 1000).toString();
        setConvertedResult(`Unix Timestamp: ${timestamp}`);
        
        // Also convert back to date to show the conversion is correct
        timestampApi.execute({ 
          timestamp: timestamp, 
          sourceFormat: 'UNIX_SECONDS', 
          targetFormat: 'ISO_8601' 
        });
      } catch (error) {
        console.error('Invalid date format:', error);
      }
    }
  };

  const handleClear = () => {
    setInput('');
    setConvertedResult('');
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
            {getErrorMessage(timestampApi.error)}
          </Alert>
        )}
      </ProfessionalCard>

      {convertedResult && format === 'date' && (
        <ResultCard
          title="Date to Timestamp Result"
          content={convertedResult}
        />
      )}

      {timestampApi.data && (
        <ResultCard
          title={format === 'timestamp' ? 'Timestamp to Date Result' : 'Verification (Timestamp to Date)'}
          content={timestampApi.data.convertedDate || 'No result'}
        />
      )}
    </ProfessionalToolLayout>
  );
};

export default TimestampTool; 