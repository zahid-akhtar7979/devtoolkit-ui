import React, { useState } from 'react';
import {
  TextField,
  Alert,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  Box,
} from '@mui/material';
import { cronService } from '../../services/cronService';
import { useApi } from '../../hooks/useApi';
import { ResultCard } from '../../shared/components/ResultCard';
import { LoadingButton } from '../../shared/components/LoadingButton';
import { validation } from '../../utils/validation';
import { ProfessionalToolLayout, ProfessionalCard, ProfessionalButtonGroup } from '../../shared/components/ProfessionalToolLayout';
import { getErrorMessage } from '../../utils/errorHandling';

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

  const handleSample = () => {
    setCronExpression('0 0 * * *');
  };

  return (
    <ProfessionalToolLayout 
      title="CRON Expression Evaluator"
      description="Evaluate and understand CRON expressions with detailed descriptions and next execution times"
    >
      <ProfessionalCard title="Input">
        <TextField
          fullWidth
          label="CRON Expression"
          value={cronExpression}
          onChange={(e) => setCronExpression(e.target.value)}
          placeholder="e.g., 0 0 * * * (daily at midnight)"
          sx={{ mb: 2 }}
        />

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
            onClick={handleSample}
          >
            Load Sample
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
            {getErrorMessage(cronApi.error)}
          </Alert>
        )}
      </ProfessionalCard>

      {cronApi.data && (
        <>
          <ResultCard
            title="Description"
            content={cronApi.data.description || 'No description available'}
          />

          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Next 5 Executions
              </Typography>
              <List dense>
                {cronApi.data.nextExecutions?.map((execution, index) => (
                  <ListItem key={index}>
                    <ListItemText 
                      primary={execution}
                      secondary={`Execution #${index + 1}`}
                    />
                    <Chip 
                      label={index === 0 ? 'Next' : `#${index + 1}`}
                      color={index === 0 ? 'primary' : 'default'}
                      size="small"
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </>
      )}
    </ProfessionalToolLayout>
  );
};

export default CronTool; 