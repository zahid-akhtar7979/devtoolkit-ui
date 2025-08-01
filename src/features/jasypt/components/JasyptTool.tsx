import React, { useState } from 'react';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import { jasyptService } from '../api/jasyptService';
import { useApi } from '../../../shared/hooks/useApi';
import { ResultCard } from '../../../shared/components/ResultCard';
import { LoadingButton } from '../../../shared/components/LoadingButton';
import { validation } from '../../../shared/utils/validation';
import { ProfessionalToolLayout, ProfessionalCard, ProfessionalButtonGroup } from '../../../shared/components/ProfessionalToolLayout';
import { getErrorMessage } from '../../../shared/utils/errorHandling';

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
    <ProfessionalToolLayout 
      title="Jasypt Encryptor/Decryptor"
      description="Encrypt and decrypt text using Jasypt with various algorithms"
    >
      <ProfessionalCard title="Input">
        <FormControl fullWidth sx={{ mb: 2 }}>
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

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Algorithm</InputLabel>
          <Select
            value={algorithm}
            label="Algorithm"
            onChange={(e) => setAlgorithm(e.target.value)}
          >
            <MenuItem value="PBEWithMD5AndDES">PBEWithMD5AndDES</MenuItem>
            <MenuItem value="PBEWithMD5AndTripleDES">PBEWithMD5AndTripleDES</MenuItem>
            <MenuItem value="PBEWithSHA1AndDESede">PBEWithSHA1AndDESede</MenuItem>
            <MenuItem value="PBEWithSHA1AndRC2_40">PBEWithSHA1AndRC2_40</MenuItem>
          </Select>
        </FormControl>

        <TextField
          fullWidth
          multiline
          rows={4}
          label="Text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={operation === 'encrypt' ? 'Enter text to encrypt...' : 'Enter encrypted text to decrypt...'}
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

        <ProfessionalButtonGroup>
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
        </ProfessionalButtonGroup>

        {currentApi.error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {getErrorMessage(currentApi.error)}
          </Alert>
        )}
      </ProfessionalCard>

      {result && (
        <ResultCard
          title={`${operation === 'encrypt' ? 'Encrypted' : 'Decrypted'} Result`}
          content={result.processedText || ''}
        />
      )}
    </ProfessionalToolLayout>
  );
};

export default JasyptTool; 