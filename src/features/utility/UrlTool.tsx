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

const UrlTool: React.FC = () => {
  const [url, setUrl] = useState('');
  const [operation, setOperation] = useState('encode');

  const encodeApi = useApi(utilityService.encodeUrl);
  const decodeApi = useApi(utilityService.decodeUrl);

  const handleProcess = () => {
    if (!validation.isNotEmpty(url)) {
      return;
    }
    
    if (operation === 'encode') {
      encodeApi.execute({ url });
    } else {
      decodeApi.execute({ url });
    }
  };

  const handleClear = () => {
    setUrl('');
    encodeApi.reset();
    decodeApi.reset();
  };

  const currentApi = operation === 'encode' ? encodeApi : decodeApi;
  const result = currentApi.data;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        URL Encoder/Decoder
      </Typography>
      
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Operation</InputLabel>
            <Select
              value={operation}
              label="Operation"
              onChange={(e) => setOperation(e.target.value)}
            >
              <MenuItem value="encode">Encode</MenuItem>
              <MenuItem value="decode">Decode</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            multiline
            rows={6}
            label={`URL to ${operation}`}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={operation === 'encode' ? 'Enter URL to encode...' : 'Enter encoded URL to decode...'}
            sx={{ mb: 2 }}
          />

          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <LoadingButton
              variant="contained"
              loading={currentApi.loading}
              onClick={handleProcess}
              disabled={!validation.isNotEmpty(url)}
            >
              {operation === 'encode' ? 'Encode' : 'Decode'} URL
            </LoadingButton>
            <LoadingButton
              variant="outlined"
              loading={false}
              onClick={handleClear}
            >
              Clear
            </LoadingButton>
          </Box>

          {currentApi.error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {currentApi.error}
            </Alert>
          )}
        </CardContent>
      </Card>

      {result && (
        <ResultCard
          title={`${operation === 'encode' ? 'Encoded' : 'Decoded'} URL`}
          content={operation === 'encode' ? result.encoded || '' : result.decoded || ''}
        />
      )}
    </Box>
  );
};

export default UrlTool; 