import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Paper,
  Box,
} from '@mui/material';
import { CopyButton } from './CopyButton';

interface ResultCardProps {
  title: string;
  content: string;
  showCopyButton?: boolean;
  maxHeight?: number;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  title,
  content,
  showCopyButton = true,
  maxHeight = 400,
}) => {
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">{title}</Typography>
          {showCopyButton && (
            <CopyButton text={content} />
          )}
        </Box>
        
        <Paper
          sx={{
            p: 2,
            backgroundColor: '#f5f5f5',
            fontFamily: 'monospace',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            maxHeight,
            overflow: 'auto',
            fontSize: '0.9rem'
          }}
        >
          {content}
        </Paper>
      </CardContent>
    </Card>
  );
}; 