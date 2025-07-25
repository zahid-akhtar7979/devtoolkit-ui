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

          {showHelp && errorInfo && (
            <Card sx={{ mb: 2, bgcolor: 'background.paper' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  💡 How to Fix This Issue
                </Typography>
                <List dense>
                  {errorInfo.suggestions.map((suggestion, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <CheckCircle color="success" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary={suggestion} />
                    </ListItem>
                  ))}
                </List>
                
                {errorInfo.technicalDetails && (
                  <>
                    <Divider sx={{ my: 2 }} />
                    <Accordion>
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography variant="subtitle2">Technical Details</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography variant="body2" color="text.secondary" component="pre">
                          {errorInfo.technicalDetails}
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* JWT Validation Tips */}
      <Accordion sx={{ mb: 2 }}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Info color="info" />
            <Typography variant="subtitle1">JWT Validation Tips</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <List dense>
            {getJwtValidationTips().map((tip, index) => (
              <ListItem key={index}>
                <ListItemText primary={tip} />
              </ListItem>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>

      {result && (
        <>
          {operation === 'decode' && result.decoded && (
            <>
              <Alert severity="success" sx={{ mb: 2 }}>
                <AlertTitle>✅ JWT Token Successfully Decoded</AlertTitle>
                The token has been successfully parsed and decoded. You can view the header, payload, and signature below.
              </Alert>
              
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

              {/* Token Information */}
              <Card sx={{ mt: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    🔍 Token Information
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {result.decoded.header.alg && (
                      <Chip 
                        label={`Algorithm: ${result.decoded.header.alg}`} 
                        color="primary" 
                        size="small" 
                      />
                    )}
                    {result.decoded.header.typ && (
                      <Chip 
                        label={`Type: ${result.decoded.header.typ}`} 
                        color="secondary" 
                        size="small" 
                      />
                    )}
                    {result.decoded.payload.exp && (
                      <Chip 
                        label={`Expires: ${new Date(result.decoded.payload.exp * 1000).toLocaleString()}`}
                        color={new Date(result.decoded.payload.exp * 1000) > new Date() ? "success" : "error"}
                        size="small" 
                      />
                    )}
                    {result.decoded.payload.iat && (
                      <Chip 
                        label={`Issued: ${new Date(result.decoded.payload.iat * 1000).toLocaleString()}`}
                        color="info" 
                        size="small" 
                      />
                    )}
                  </Box>
                  
                  {result.decoded.payload.exp && (
                    <Typography variant="body2" color="text.secondary">
                      {new Date(result.decoded.payload.exp * 1000) > new Date() 
                        ? '✅ Token is not expired' 
                        : '⚠️ Token has expired'
                      }
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </>
          )}
          
          {operation === 'verify' && result.valid !== undefined && (
            <>
              <Alert severity={result.valid ? "success" : "error"} sx={{ mb: 2 }}>
                <AlertTitle>
                  {result.valid ? '✅ Token Verification Successful' : '❌ Token Verification Failed'}
                </AlertTitle>
                {result.valid 
                  ? 'The JWT token signature is valid and the token structure is correct.'
                  : 'The JWT token verification failed. Please check the token and secret key.'
                }
              </Alert>
              
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    {result.valid ? (
                      <CheckCircle color="success" fontSize="large" />
                    ) : (
                      <Error color="error" fontSize="large" />
                    )}
                    <Typography variant="h6">
                      Verification Result: {result.valid ? 'VALID' : 'INVALID'}
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary">
                    {result.valid 
                      ? 'The token passed all validation checks and can be trusted.'
                      : 'The token failed validation. Do not trust this token for authentication or authorization.'
                    }
                  </Typography>
                </CardContent>
              </Card>
            </>
          )}
        </>
      )}
    </Box>
  );
};

export default JwtTool; 