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
import { base64Service } from '../../services/base64Service';
import { useApi } from '../../hooks/useApi';
import { ResultCard } from '../../shared/components/ResultCard';
import { LoadingButton } from '../../shared/components/LoadingButton';
import { validation } from '../../utils/validation';

const Base64Tool: React.FC = () => {
  const [text, setText] = useState('');
  const [operation, setOperation] = useState('encode');

  const encodeApi = useApi(base64Service.encode);
  const decodeApi = useApi(base64Service.decode);

  const handleProcess = () => {
    if (!validation.isNotEmpty(text)) {
      return;
    }
    
    if (operation === 'encode') {
      encodeApi.execute({ text });
    } else {
      decodeApi.execute({ text });
    }
  };

  const handleClear = () => {
    setText('');
    encodeApi.reset();
    decodeApi.reset();
  };

  const currentApi = operation === 'encode' ? encodeApi : decodeApi;
  const result = currentApi.data;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Base64 Encoder/Decoder
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
            label={`Text to ${operation}`}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={operation === 'encode' ? 'Enter text to encode...' : 'Enter Base64 string to decode...'}
            sx={{ mb: 2 }}
          />

          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <LoadingButton
              variant="contained"
              loading={currentApi.loading}
              onClick={handleProcess}
              disabled={!validation.isNotEmpty(text)}
            >
              {operation === 'encode' ? 'Encode' : 'Decode'}
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
          title={`${operation === 'encode' ? 'Encoded' : 'Decoded'} Result`}
          content={operation === 'encode' ? result.encoded || '' : result.decoded || ''}
        />
      )}
    </Box>
  );
};

export default Base64Tool; 