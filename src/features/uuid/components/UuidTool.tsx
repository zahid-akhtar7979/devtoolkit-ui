import React, { useState } from 'react';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import { uuidService } from '../api/uuidService';
import { useApi } from '../../../shared/hooks/useApi';
import { ResultCard } from '../../../shared/components/ResultCard';
import { LoadingButton } from '../../../shared/components/LoadingButton';
import { ProfessionalToolLayout, ProfessionalCard, ProfessionalButtonGroup } from '../../../shared/components/ProfessionalToolLayout';
import { getErrorMessage } from '../../../shared/utils/errorHandling';

interface UuidResponse {
  uuid?: string;
  uuids?: string[];
  count?: number;
  type: string;
  success: boolean;
  message: string;
}

const UuidTool: React.FC = () => {
  const [count, setCount] = useState(1);
  const [type, setType] = useState('v4');

  const uuidApi = useApi(uuidService.generate);

  const handleGenerate = () => {
    uuidApi.execute({ type, count });
  };

  const handleClear = () => {
    uuidApi.reset();
  };

  const result = uuidApi.data as UuidResponse | null;

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
            loading={uuidApi.loading}
            onClick={handleGenerate}
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

        {uuidApi.error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {getErrorMessage(uuidApi.error)}
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