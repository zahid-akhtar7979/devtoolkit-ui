import React, { useState } from 'react';
import {
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
import { ProfessionalToolLayout, ProfessionalCard, ProfessionalButtonGroup } from '../../shared/components/ProfessionalToolLayout';

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
    <ProfessionalToolLayout 
      title="
      CRON Expression Evaluator
      "
      "
    >
      <ProfessionalCard title="Input">
        
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
          </ProfessionalButtonGroup>

          <ProfessionalButtonGroup>
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
          </ProfessionalButtonGroup>

          {cronApi.error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {cronApi.error}
            </Alert>
          )}
        
      </ProfessionalCard>

      {cronApi.data && (
        <Card>
          
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
          
        </ProfessionalCard>
      )}
    </ProfessionalButtonGroup>
  );
};

export default CronTool; 