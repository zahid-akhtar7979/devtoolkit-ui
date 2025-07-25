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

const UuidTool: React.FC = () => {
  const [count, setCount] = useState(1);
  const [type, setType] = useState('v4');

  const uuidApi = useApi(utilityService.generateUuid);

  const handleGenerate = () => {
    uuidApi.execute({ type });
  };

  const handleClear = () => {
    uuidApi.reset();
  };

  const handleGenerateMultiple = () => {
    // Generate multiple UUIDs by calling the API multiple times
    const promises = Array.from({ length: count }, () => 
      utilityService.generateUuid({ type })
    );
    
    Promise.all(promises).then(results => {
      // Store multiple results in a custom way since our API returns single UUID
      const uuids = results.map(result => result.uuid).filter(Boolean);
      uuidApi.execute({ type, multiple: true, results: uuids });
    }).catch(error => {
      console.error('Error generating multiple UUIDs:', error);
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        UUID Generator
      </Typography>
      
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
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
          </Box>

          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <LoadingButton
              variant="contained"
              loading={uuidApi.loading}
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
          </Box>

          {uuidApi.error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {uuidApi.error}
            </Alert>
          )}
        </CardContent>
      </Card>

      {uuidApi.data && (
        <ResultCard
          title={`Generated UUID${count > 1 ? 's' : ''} (${type.toUpperCase()})`}
          content={uuidApi.data.uuid || 'No UUID generated'}
        />
      )}
    </Box>
  );
};

export default UuidTool; 