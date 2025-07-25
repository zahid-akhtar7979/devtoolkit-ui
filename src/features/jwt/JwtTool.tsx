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
  Tabs,
  Tab,
} from '@mui/material';
import { jwtService } from '../../services/jwtService';
import { useApi } from '../../hooks/useApi';
import { ResultCard } from '../../shared/components/ResultCard';
import { LoadingButton } from '../../shared/components/LoadingButton';
import { validation } from '../../utils/validation';

const JwtTool: React.FC = () => {
  const [token, setToken] = useState('');
  const [secret, setSecret] = useState('');
  const [operation, setOperation] = useState('decode');

  const decodeApi = useApi(jwtService.decode);
  const verifyApi = useApi(jwtService.verify);

  const handleProcess = () => {
    if (!validation.isNotEmpty(token)) {
      return;
    }
    
    if (operation === 'decode') {
      decodeApi.execute({ token, secret });
    } else {
      if (!validation.isNotEmpty(secret)) {
        return;
      }
      verifyApi.execute({ token, secret });
    }
  };

  const handleClear = () => {
    setToken('');
    setSecret('');
    decodeApi.reset();
    verifyApi.reset();
  };

  const currentApi = operation === 'decode' ? decodeApi : verifyApi;
  const result = currentApi.data;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        JWT Decoder/Verifier
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
              <MenuItem value="decode">Decode</MenuItem>
              <MenuItem value="verify">Verify</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            multiline
            rows={4}
            label="JWT Token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Enter JWT token..."
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            type="password"
            label="Secret (optional for decode, required for verify)"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder="Enter secret key..."
            sx={{ mb: 2 }}
          />

          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <LoadingButton
              variant="contained"
              loading={currentApi.loading}
              onClick={handleProcess}
              disabled={!validation.isNotEmpty(token) || (operation === 'verify' && !validation.isNotEmpty(secret))}
            >
              {operation === 'decode' ? 'Decode' : 'Verify'}
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
        <>
          {operation === 'decode' && result.decoded && (
            <>
              <ResultCard
                title="Header"
                content={JSON.stringify(result.decoded.header, null, 2)}
              />
              <ResultCard
                title="Payload"
                content={JSON.stringify(result.decoded.payload, null, 2)}
              />
              <ResultCard
                title="Signature"
                content={result.decoded.signature}
              />
            </>
          )}
          
          {operation === 'verify' && result.valid !== undefined && (
            <ResultCard
              title="Verification Result"
              content={result.valid ? 'Token is valid!' : 'Token is invalid!'}
            />
          )}
        </>
      )}
    </Box>
  );
};

export default JwtTool; 