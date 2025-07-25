import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Alert,
  Tabs,
  Tab,
  Paper,
  Chip,
  Divider,
} from '@mui/material';
import { utilityService } from '../../services/utilityService';
import { useApi } from '../../hooks/useApi';
import { ResultCard } from '../../shared/components/ResultCard';
import { LoadingButton } from '../../shared/components/LoadingButton';
import { validation } from '../../utils/validation';

const DiffTool: React.FC = () => {
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  const diffApi = useApi(utilityService.compareText);

  const handleCompare = () => {
    if (!validation.isNotEmpty(text1) && !validation.isNotEmpty(text2)) {
      return;
    }
    diffApi.execute({ text1, text2 });
  };

  const handleClear = () => {
    setText1('');
    setText2('');
    diffApi.reset();
  };

  const handleSample = () => {
    setText1(`Hello World
This is the first text
It has some content
That we want to compare`);

    setText2(`Hello World
This is the second text
It has different content
That we want to compare`);
  };

  const formatDiffResult = (result: any) => {
    if (!result) return '';
    
    let output = '';
    if (result.identical !== undefined) {
      output += `Identical: ${result.identical ? 'Yes' : 'No'}\n`;
    }
    if (result.length1 !== undefined) {
      output += `Text 1 length: ${result.length1}\n`;
    }
    if (result.length2 !== undefined) {
      output += `Text 2 length: ${result.length2}\n`;
    }
    if (result.differences) {
      output += `\nDifferences:\n${result.differences}`;
    }
    
    return output;
  };

  const renderStatistics = (stats: any) => {
    if (!stats) return null;
    
    return (
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" gutterBottom>Statistics</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          <Chip label={`Lines: ${stats.totalLines1} → ${stats.totalLines2}`} color="primary" />
          <Chip label={`Changed: ${stats.changedLines}`} color="warning" />
          <Chip label={`Unchanged: ${stats.unchangedLines}`} color="success" />
          <Chip label={`Added chars: ${stats.addedCharacters}`} color="info" />
          <Chip label={`Deleted chars: ${stats.deletedCharacters}`} color="error" />
          <Chip label={`Change: ${stats.changePercentage?.toFixed(1)}%`} color="secondary" />
        </Box>
      </Box>
    );
  };

  const renderUnifiedDiff = (unifiedDiff: string) => {
    if (!unifiedDiff) return null;
    
    return (
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" gutterBottom>Unified Diff</Typography>
        <Paper sx={{ p: 2, bgcolor: 'grey.50', fontFamily: 'monospace', fontSize: '0.875rem' }}>
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
            {unifiedDiff}
          </pre>
        </Paper>
      </Box>
    );
  };

  const renderSideBySide = (sideBySide: any) => {
    if (!sideBySide?.comparison) return null;
    
    return (
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" gutterBottom>Side-by-Side Comparison</Typography>
        <Paper sx={{ p: 2 }}>
          {sideBySide.comparison.map((line: any, index: number) => (
            <Box key={index} sx={{ 
              display: 'flex', 
              borderBottom: '1px solid #eee',
              bgcolor: line.status === 'modified' ? 'warning.50' : 'transparent'
            }}>
              <Box sx={{ 
                flex: 1, 
                p: 1, 
                borderRight: '1px solid #eee',
                fontFamily: 'monospace',
                fontSize: '0.875rem'
              }}>
                <Typography variant="caption" color="text.secondary">
                  {line.lineNumber}
                </Typography>
                <Typography sx={{ fontFamily: 'monospace' }}>
                  {line.left}
                </Typography>
              </Box>
              <Box sx={{ 
                flex: 1, 
                p: 1,
                fontFamily: 'monospace',
                fontSize: '0.875rem'
              }}>
                <Typography variant="caption" color="text.secondary">
                  {line.lineNumber}
                </Typography>
                <Typography sx={{ fontFamily: 'monospace' }}>
                  {line.right}
                </Typography>
              </Box>
            </Box>
          ))}
        </Paper>
      </Box>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Text Comparison (Diff Tool)
      </Typography>
      
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              multiline
              rows={10}
              label="Text 1"
              value={text1}
              onChange={(e) => setText1(e.target.value)}
              placeholder="Enter first text here..."
            />
            <TextField
              fullWidth
              multiline
              rows={10}
              label="Text 2"
              value={text2}
              onChange={(e) => setText2(e.target.value)}
              placeholder="Enter second text here..."
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <LoadingButton
              variant="contained"
              loading={diffApi.loading}
              onClick={handleCompare}
              disabled={!validation.isNotEmpty(text1) && !validation.isNotEmpty(text2)}
            >
              Compare Texts
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

          {diffApi.error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {diffApi.error}
            </Alert>
          )}
        </CardContent>
      </Card>

      {diffApi.data && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Comparison Result
            </Typography>
            
            {diffApi.data.identical ? (
              <Alert severity="success">
                The texts are identical! No differences found.
              </Alert>
            ) : (
              <>
                <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 2 }}>
                  <Tab label="Summary" />
                  <Tab label="Unified Diff" />
                  <Tab label="Side-by-Side" />
                  <Tab label="Statistics" />
                </Tabs>
                
                {activeTab === 0 && (
                  <Box>
                    <Typography variant="body1" gutterBottom>
                      {formatDiffResult(diffApi.data)}
                    </Typography>
                    {renderStatistics(diffApi.data.statistics)}
                  </Box>
                )}
                
                {activeTab === 1 && renderUnifiedDiff(diffApi.data.unifiedDiff)}
                {activeTab === 2 && renderSideBySide(diffApi.data.sideBySide)}
                {activeTab === 3 && renderStatistics(diffApi.data.statistics)}
              </>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default DiffTool; 