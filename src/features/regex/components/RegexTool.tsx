import React, { useState } from 'react';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import { regexService } from '../api/regexService';
import { useApi } from '../../../shared/hooks/useApi';
import { ResultCard } from '../../../shared/components/ResultCard';
import { LoadingButton } from '../../../shared/components/LoadingButton';
import { validation } from '../../../shared/utils/validation';
import { ProfessionalToolLayout, ProfessionalCard, ProfessionalButtonGroup } from '../../../shared/components/ProfessionalToolLayout';
import { getErrorMessage } from '../../../shared/utils/errorHandling';

const RegexTool: React.FC = () => {
  const [pattern, setPattern] = useState('');
  const [text, setText] = useState('');
  const [operation, setOperation] = useState('test');

  const regexApi = useApi(regexService.test);

  const handleTest = () => {
    if (!validation.isNotEmpty(pattern) || !validation.isNotEmpty(text)) {
      return;
    }
    regexApi.execute({ pattern, testText: text });
  };

  const handleClear = () => {
    setPattern('');
    setText('');
    regexApi.reset();
  };

  const handleSample = () => {
    setPattern('\\b\\w+@\\w+\\.\\w+\\b');
    setText('Contact us at john@example.com or support@company.org for assistance.');
    setOperation('test');
  };

  const operations = [
    { value: 'test', label: 'Test Pattern' },
    { value: 'match', label: 'Find Matches' },
    { value: 'replace', label: 'Replace Matches' },
  ];

  return (
    <ProfessionalToolLayout 
      title="Regular Expression Tester"
      description="Test and validate regular expressions with real-time matching and replacement"
    >
      <ProfessionalCard title="Input">
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Operation</InputLabel>
          <Select
            value={operation}
            label="Operation"
            onChange={(e) => setOperation(e.target.value)}
          >
            {operations.map((op) => (
              <MenuItem key={op.value} value={op.value}>
                {op.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Regular Expression Pattern"
          value={pattern}
          onChange={(e) => setPattern(e.target.value)}
          placeholder="e.g., \\b\\w+@\\w+\\.\\w+\\b"
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          multiline
          rows={6}
          label="Test Text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to test against the regex pattern..."
          sx={{ mb: 2 }}
        />

        <ProfessionalButtonGroup>
          <LoadingButton
            variant="contained"
            loading={regexApi.loading}
            onClick={handleTest}
            disabled={!validation.isNotEmpty(pattern) || !validation.isNotEmpty(text)}
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
        </ProfessionalButtonGroup>

        {regexApi.error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {getErrorMessage(regexApi.error)}
          </Alert>
        )}
      </ProfessionalCard>

      {regexApi.data && (
        <ResultCard
          title="Regex Test Result"
          content={
            regexApi.data.matches && regexApi.data.matches.length > 0
              ? `Found ${regexApi.data.matchCount} matches:\n${regexApi.data.matches.map((match, index) => 
                  `${index + 1}. "${match.match}" (position ${match.start}-${match.end})`
                ).join('\n')}`
              : 'No matches found'
          }
        />
      )}
    </ProfessionalToolLayout>
  );
};

export default RegexTool; 