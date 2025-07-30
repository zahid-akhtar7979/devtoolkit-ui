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
  AlertTitle,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import { ExpandMore, Help, CheckCircle, Error, Info } from '@mui/icons-material';
import { jwtService } from '../../services/jwtService';
import { useApi } from '../../hooks/useApi';
import { ResultCard } from '../../shared/components/ResultCard';
import { LoadingButton } from '../../shared/components/LoadingButton';
import { validation } from '../../utils/validation';
import { getJwtErrorInfo, getJwtValidationTips } from '../../utils/jwtErrorHandling';
import { ProfessionalToolLayout, ProfessionalCard, ProfessionalButtonGroup } from '../../shared/components/ProfessionalToolLayout';
import { getErrorMessage } from '../../utils/errorHandling';

const JwtTool: React.FC = () => {
  const [token, setToken] = useState('');
  const [secret, setSecret] = useState('');
  const [operation, setOperation] = useState('decode');
  const [showHelp, setShowHelp] = useState(false);

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
  
  // Debug logging
  if (result) {
    console.log('JWT result:', result);
  }
  
  // Get error information
  const getErrorData = () => {
    if (currentApi.error) {
      console.log('Error object:', currentApi.error); // Debug log
      
      // Check if the error has response data attached (from failed API calls)
      const errorResponse = (currentApi.error as any)?.response?.data;
      console.log('Error response data:', errorResponse); // Debug log
      
      if (errorResponse) {
        return {
          errorCode: errorResponse.errorCode,
          error: errorResponse.error,
          technicalError: errorResponse.technicalError
        };
      }
      
      // Check if error object has message property (from Error constructor)
      const errorMessage = (currentApi.error as any)?.message;
      console.log('Error message:', errorMessage); // Debug log
      
      // Fallback to basic error message
      return {
        errorCode: 'UNKNOWN_ERROR',
        error: errorMessage || 'An unexpected error occurred',
        technicalError: errorMessage || 'Unknown error'
      };
    }
    return null;
  };

  const errorData = getErrorData();
  const errorInfo = errorData ? getJwtErrorInfo(
    errorData.errorCode,
    errorData.error,
    errorData.technicalError
  ) : null;

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

          {errorInfo && (
            <Alert 
              severity={errorInfo.severity} 
              sx={{ mb: 2 }}
              action={
                <LoadingButton
                  size="small"
                  loading={false}
                  onClick={() => setShowHelp(!showHelp)}
                  startIcon={<Help />}
                >
                  {showHelp ? 'Hide Help' : 'Help'}
                </LoadingButton>
              }
            >
              <AlertTitle>
                {errorInfo.severity === 'error' ? 'Error' : 
                 errorInfo.severity === 'warning' ? 'Warning' : 'Info'}
              </AlertTitle>
              {errorInfo.message}
            </Alert>
          )}

          {/* Fallback error display for non-JWT specific errors */}
          {currentApi.error && !errorInfo && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {getErrorMessage(currentApi.error)}
            </Alert>
          )}

          {showHelp && errorInfo && (
            <Card sx={{ mb: 2, bgcolor: 'background.paper' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Help & Tips
                </Typography>
                <List dense>
                  {getJwtValidationTips().map((tip, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <Info color="primary" />
                      </ListItemIcon>
                      <ListItemText primary={tip} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {result && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {operation === 'decode' ? 'Decoded Token' : 'Verification Result'}
            </Typography>
            
            {operation === 'decode' && (result.header || result.payload || result.decoded) && (
              <>
                <Accordion defaultExpanded>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="subtitle1">Header</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                      {JSON.stringify(result.header || result.decoded?.header, null, 2)}
                    </pre>
                  </AccordionDetails>
                </Accordion>
                
                <Accordion defaultExpanded>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="subtitle1">Payload</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                      {JSON.stringify(result.payload || result.decoded?.payload, null, 2)}
                    </pre>
                  </AccordionDetails>
                </Accordion>
                
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="subtitle1">Signature</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
                      {result.signature || result.decoded?.signature}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              </>
            )}
            
            {operation === 'verify' && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {result.valid ? (
                  <>
                    <CheckCircle color="success" />
                    <Typography color="success.main">Token is valid</Typography>
                  </>
                ) : (
                  <>
                    <Error color="error" />
                    <Typography color="error.main">Token is invalid</Typography>
                  </>
                )}
              </Box>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default JwtTool; 