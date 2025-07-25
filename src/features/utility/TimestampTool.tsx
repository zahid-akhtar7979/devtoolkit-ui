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
import { utilityService } from '../../services/utilityService';
import { useApi } from '../../hooks/useApi';
import { ResultCard } from '../../shared/components/ResultCard';
import { LoadingButton } from '../../shared/components/LoadingButton';
import { validation } from '../../utils/validation';

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
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Unix Timestamp Converter
      </Typography>
      
      <Card sx={{ mb: 3 }}>
        <CardContent>
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

          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
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
          </Box>

          {timestampApi.error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {timestampApi.error}
            </Alert>
          )}
        </CardContent>
      </Card>

      {timestampApi.data && (
        <ResultCard
          title="Conversion Result"
          content={timestampApi.data.converted || 'No result'}
        />
      )}
    </Box>
  );
};

export default TimestampTool; 