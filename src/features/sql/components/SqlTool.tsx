import React, { useState } from 'react';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import { sqlService } from '../api/sqlService';
import { useApi } from '../../../shared/hooks/useApi';
import { ResultCard } from '../../../shared/components/ResultCard';
import { LoadingButton } from '../../../shared/components/LoadingButton';
import { validation } from '../../../shared/utils/validation';
import { ProfessionalToolLayout, ProfessionalCard, ProfessionalButtonGroup } from '../../../shared/components/ProfessionalToolLayout';
import { getErrorMessage } from '../../../shared/utils/errorHandling';

const SqlTool: React.FC = () => {
  const [sql, setSql] = useState('');
  const [dialect, setDialect] = useState('mysql');

  const sqlApi = useApi(sqlService.format);

  const handleFormat = () => {
    if (!validation.isNotEmpty(sql)) {
      return;
    }
    sqlApi.execute({ sql, dialect });
  };

  const handleClear = () => {
    setSql('');
    sqlApi.reset();
  };

  const handleSample = () => {
    const sampleSQL = `select u.id, u.name, u.email, p.title, p.content from users u left join posts p on u.id = p.user_id where u.active = 1 and p.published = 1 order by u.name, p.created_at desc`;
    setSql(sampleSQL);
    setDialect('mysql');
  };

  return (
    <ProfessionalToolLayout 
      title="SQL Formatter"
      description="Format SQL queries with proper indentation and syntax highlighting"
    >
      <ProfessionalCard title="Input">
        <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>SQL Dialect</InputLabel>
            <Select
              value={dialect}
              label="SQL Dialect"
              onChange={(e) => setDialect(e.target.value)}
            >
              <MenuItem value="mysql">MySQL</MenuItem>
              <MenuItem value="postgresql">PostgreSQL</MenuItem>
              <MenuItem value="oracle">Oracle</MenuItem>
              <MenuItem value="sqlserver">SQL Server</MenuItem>
              <MenuItem value="sqlite">SQLite</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            multiline
            rows={8}
            label="SQL Query"
            value={sql}
            onChange={(e) => setSql(e.target.value)}
            placeholder="Enter your SQL query here..."
            sx={{ mb: 2 }}
          />

          <ProfessionalButtonGroup>
            <LoadingButton
              variant="contained"
              loading={sqlApi.loading}
              onClick={handleFormat}
              disabled={!validation.isNotEmpty(sql)}
            >
              Format SQL
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

          {sqlApi.error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {getErrorMessage(sqlApi.error)}
            </Alert>
          )}
      </ProfessionalCard>

      {sqlApi.data && (
        <ResultCard
          title="Formatted SQL"
          content={sqlApi.data.formattedSql || 'No result'}
        />
      )}
    </ProfessionalToolLayout>
  );
};

export default SqlTool; 