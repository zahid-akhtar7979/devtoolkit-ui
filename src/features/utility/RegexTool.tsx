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

const RegexTool: React.FC = () => {
  const [pattern, setPattern] = useState('');
  const [testText, setTestText] = useState('');

  const regexApi = useApi(utilityService.testRegex);

  const handleTest = () => {
    if (!validation.isNotEmpty(pattern) || !validation.isNotEmpty(testText)) {
      return;
    }
    regexApi.execute({ text: testText, format: pattern });
  };

  const handleClear = () => {
    setPattern('');
    setTestText('');
    regexApi.reset();
  };

  const handleSample = () => {
    setPattern('[a-zA-Z]+');
    setTestText('Hello World 123 Test');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Regex Tester
      </Typography>
      
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <TextField
            fullWidth
            label="Regex Pattern"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="e.g., [a-zA-Z]+"
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            multiline
            rows={6}
            label="Test Text"
            value={testText}
            onChange={(e) => setTestText(e.target.value)}
            placeholder="Enter text to test against the regex pattern"
            sx={{ mb: 2 }}
          />

          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <LoadingButton
              variant="contained"
              loading={regexApi.loading}
              onClick={handleTest}
              disabled={!validation.isNotEmpty(pattern) || !validation.isNotEmpty(testText)}
            >
              Test Regex
            </LoadingButton>
            <LoadingButton
              variant="outlined"
              loading={false}
              onClick={handleSample}
            >
              Load Sample
            </LoadingButton>
            <LoadingButton
              variant="outlined"
              loading={false}
              onClick={handleClear}
            >
              Clear
            </LoadingButton>
          </Box>

          {regexApi.error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {regexApi.error}
            </Alert>
          )}
        </CardContent>
      </Card>

      {regexApi.data && (
        <ResultCard
          title="Regex Test Result"
          content={regexApi.data.result || 'No result'}
        />
      )}
    </Box>
  );
};

export default RegexTool; 