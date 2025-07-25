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
import { utilityService } from '../../services/utilityService';
import { useApi } from '../../hooks/useApi';
import { ResultCard } from '../../shared/components/ResultCard';
import { LoadingButton } from '../../shared/components/LoadingButton';
import { validation } from '../../utils/validation';

const SqlTool: React.FC = () => {
  const [sql, setSql] = useState('');
  const [dialect, setDialect] = useState('mysql');

  const sqlApi = useApi(utilityService.formatSql);

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
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        SQL Formatter
      </Typography>
      
      <Card sx={{ mb: 3 }}>
        <CardContent>
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

          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
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
          </Box>

          {sqlApi.error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {sqlApi.error}
            </Alert>
          )}
        </CardContent>
      </Card>

      {sqlApi.data && (
        <ResultCard
          title="Formatted SQL"
          content={sqlApi.data.formatted || 'No formatted SQL'}
        />
      )}
    </Box>
  );
};

export default SqlTool; 