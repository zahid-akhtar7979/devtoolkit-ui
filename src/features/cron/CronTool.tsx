import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Alert,
  List,
  ListItem,
  ListItemText,
  Chip,
} from '@mui/material';
import { cronService } from '../../services/cronService';
import { useApi } from '../../hooks/useApi';
import { ResultCard } from '../../shared/components/ResultCard';
import { LoadingButton } from '../../shared/components/LoadingButton';
import { validation } from '../../utils/validation';

const CronTool: React.FC = () => {
  const [cronExpression, setCronExpression] = useState('');

  const cronApi = useApi(cronService.evaluate);

  const handleEvaluate = () => {
    if (!validation.isNotEmpty(cronExpression)) {
      return;
    }
    cronApi.execute({ cronExpression });
  };

  const handleClear = () => {
    setCronExpression('');
    cronApi.reset();
  };

  const handleSample = (sample: string) => {
    setCronExpression(sample);
  };

  const samples = [
    { label: 'Every minute', expression: '* * * * *' },
    { label: 'Every 5 minutes', expression: '*/5 * * * *' },
    { label: 'Every hour', expression: '0 * * * *' },
    { label: 'Daily at 2:30 AM', expression: '30 2 * * *' },
    { label: 'Weekly on Sunday', expression: '0 0 * * 0' },
    { label: 'Monthly on 1st', expression: '0 0 1 * *' },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        CRON Expression Evaluator
      </Typography>
      
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <TextField
            fullWidth
            label="CRON Expression"
            value={cronExpression}
            onChange={(e) => setCronExpression(e.target.value)}
            placeholder="* * * * *"
            sx={{ mb: 2 }}
          />

          <Typography variant="subtitle2" gutterBottom>
            Quick Samples:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {samples.map((sample, index) => (
              <Chip
                key={index}
                label={sample.label}
                onClick={() => handleSample(sample.expression)}
                variant="outlined"
                sx={{ cursor: 'pointer' }}
              />
            ))}
          </Box>

          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <LoadingButton
              variant="contained"
              loading={cronApi.loading}
              onClick={handleEvaluate}
              disabled={!validation.isNotEmpty(cronExpression)}
            >
              Evaluate CRON
            </LoadingButton>
            <LoadingButton
              variant="outlined"
              loading={false}
              onClick={handleClear}
            >
              Clear
            </LoadingButton>
          </Box>

          {cronApi.error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {cronApi.error}
            </Alert>
          )}
        </CardContent>
      </Card>

      {cronApi.data && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Evaluation Result</Typography>
            
            <ResultCard
              title="Description"
              content={cronApi.data.description || 'No description available'}
              showCopyButton={true}
            />

            <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
              Next 5 Executions:
            </Typography>
            <List>
              {cronApi.data.nextExecutions?.map((execution: string, index: number) => (
                <ListItem
                  key={index}
                  sx={{
                    border: '1px solid #e0e0e0',
                    borderRadius: 1,
                    mb: 1,
                    backgroundColor: '#f5f5f5'
                  }}
                >
                  <ListItemText
                    primary={execution}
                    sx={{
                      '& .MuiListItemText-primary': {
                        fontFamily: 'monospace',
                        fontSize: '1rem'
                      }
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default CronTool; 