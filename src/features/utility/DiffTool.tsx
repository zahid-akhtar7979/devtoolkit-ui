import React, { useState } from 'react';
import {
  TextField,
  Alert,
} from '@mui/material';
import { utilityService } from '../../services/utilityService';
import { useApi } from '../../hooks/useApi';
import { ResultCard } from '../../shared/components/ResultCard';
import { LoadingButton } from '../../shared/components/LoadingButton';
import { validation } from '../../utils/validation';
import { ProfessionalToolLayout, ProfessionalCard, ProfessionalButtonGroup } from '../../shared/components/ProfessionalToolLayout';
import { getErrorMessage } from '../../utils/errorHandling';

const DiffTool: React.FC = () => {
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');

  const diffApi = useApi(utilityService.compareText);

  const handleCompare = () => {
    if (!validation.isNotEmpty(text1) && !validation.isNotEmpty(text2)) {
      return;
    }
    diffApi.execute({ text1, text2 });
  };

  const handleClear = () => {
    setText1('');
    setText2('');
    diffApi.reset();
  };

  const handleSample = () => {
    setText1('Hello World\nThis is a test\nLine 3');
    setText2('Hello World\nThis is a modified test\nLine 3\nNew line');
  };

  return (
    <ProfessionalToolLayout 
      title="Text Comparison (Diff Tool)"
      description="Compare two texts and find differences with detailed analysis"
    >
      <ProfessionalCard title="Input">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '16px' }}>
          <TextField
            fullWidth
            multiline
            rows={10}
            label="Text 1"
            value={text1}
            onChange={(e) => setText1(e.target.value)}
            placeholder="Enter first text here..."
          />
          <TextField
            fullWidth
            multiline
            rows={10}
            label="Text 2"
            value={text2}
            onChange={(e) => setText2(e.target.value)}
            placeholder="Enter second text here..."
          />
        </div>

        <ProfessionalButtonGroup>
          <LoadingButton
            variant="contained"
            loading={diffApi.loading}
            onClick={handleCompare}
            disabled={!validation.isNotEmpty(text1) && !validation.isNotEmpty(text2)}
          >
            Compare Texts
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

        {diffApi.error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {getErrorMessage(diffApi.error)}
          </Alert>
        )}
      </ProfessionalCard>

      {diffApi.data && (
        <ResultCard
          title="Comparison Result"
          content={diffApi.data.differences || 'No differences found'}
        />
      )}
    </ProfessionalToolLayout>
  );
};

export default DiffTool; 