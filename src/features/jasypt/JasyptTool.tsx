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
import { jasyptService } from '../../services/jasyptService';
import { useApi } from '../../hooks/useApi';
import { ResultCard } from '../../shared/components/ResultCard';
import { LoadingButton } from '../../shared/components/LoadingButton';
import { validation } from '../../utils/validation';

const JasyptTool: React.FC = () => {
  const [text, setText] = useState('');
  const [password, setPassword] = useState('');
  const [algorithm, setAlgorithm] = useState('PBEWithMD5AndDES');
  const [operation, setOperation] = useState('encrypt');

  const encryptApi = useApi(jasyptService.encrypt);
  const decryptApi = useApi(jasyptService.decrypt);

  const handleProcess = () => {
    if (!validation.isNotEmpty(text) || !validation.isNotEmpty(password)) {
      return;
    }
    
    if (operation === 'encrypt') {
      encryptApi.execute({ text, password, algorithm });
    } else {
      decryptApi.execute({ text, password, algorithm });
    }
  };

  const handleClear = () => {
    setText('');
    setPassword('');
    encryptApi.reset();
    decryptApi.reset();
  };

  const currentApi = operation === 'encrypt' ? encryptApi : decryptApi;
  const result = currentApi.data;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Jasypt Encryption/Decryption
      </Typography>
      
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Operation</InputLabel>
              <Select
                value={operation}
                label="Operation"
                onChange={(e) => setOperation(e.target.value)}
              >
                <MenuItem value="encrypt">Encrypt</MenuItem>
                <MenuItem value="decrypt">Decrypt</MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Algorithm</InputLabel>
              <Select
                value={algorithm}
                label="Algorithm"
                onChange={(e) => setAlgorithm(e.target.value)}
              >
                <MenuItem value="PBEWithMD5AndDES">PBEWithMD5AndDES</MenuItem>
                <MenuItem value="PBEWithSHA1AndDESede">PBEWithSHA1AndDESede</MenuItem>
                <MenuItem value="PBEWithSHA1AndAES_128">PBEWithSHA1AndAES_128</MenuItem>
                <MenuItem value="PBEWithSHA1AndAES_256">PBEWithSHA1AndAES_256</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <TextField
            fullWidth
            multiline
            rows={6}
            label={`Text to ${operation}`}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={`Enter text to ${operation}...`}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password..."
            sx={{ mb: 2 }}
          />

          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <LoadingButton
              variant="contained"
              loading={currentApi.loading}
              onClick={handleProcess}
              disabled={!validation.isNotEmpty(text) || !validation.isNotEmpty(password)}
            >
              {operation === 'encrypt' ? 'Encrypt' : 'Decrypt'}
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
          title={`${operation === 'encrypt' ? 'Encrypted' : 'Decrypted'} Result`}
          content={operation === 'encrypt' ? result.encrypted || '' : result.decrypted || ''}
        />
      )}
    </Box>
  );
};

export default JasyptTool; 