import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  useTheme,
  alpha
} from '@mui/material';

interface ProfessionalToolLayoutProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export const ProfessionalToolLayout: React.FC<ProfessionalToolLayoutProps> = ({
  title,
  description,
  children,
  maxWidth = 'lg'
}) => {
  const theme = useTheme();

  return (
    <Box 
      sx={{ 
        p: { xs: 2, sm: 3 },
        maxWidth: maxWidth,
        mx: 'auto',
        minHeight: '100vh',
        bgcolor: 'background.default'
      }}
    >
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 700,
            fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' },
            color: 'text.primary',
            mb: description ? 1 : 3,
            lineHeight: 1.2
          }}
        >
          {title}
        </Typography>
        {description && (
          <Typography 
            variant="body1" 
            sx={{ 
              color: 'text.secondary',
              fontSize: { xs: '0.875rem', sm: '1rem' },
              mb: 3,
              lineHeight: 1.5
            }}
          >
            {description}
          </Typography>
        )}
      </Box>

      {/* Main Content */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {children}
      </Box>
    </Box>
  );
};

interface ProfessionalCardProps {
  title?: string;
  children: React.ReactNode;
  elevation?: number;
  sx?: any;
}

export const ProfessionalCard: React.FC<ProfessionalCardProps> = ({
  title,
  children,
  elevation = 1,
  sx = {}
}) => {
  const theme = useTheme();

  return (
    <Card
      elevation={elevation}
      sx={{
        borderRadius: 2,
        border: 1,
        borderColor: alpha(theme.palette.divider, 0.2),
        background: alpha(theme.palette.background.paper, 0.8),
        backdropFilter: 'blur(10px)',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: theme.shadows[elevation + 2],
          borderColor: alpha(theme.palette.primary.main, 0.3),
        },
        ...sx
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        {title && (
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 600,
              mb: 2,
              color: 'text.primary'
            }}
          >
            {title}
          </Typography>
        )}
        {children}
      </CardContent>
    </Card>
  );
};

interface ProfessionalButtonGroupProps {
  children: React.ReactNode;
  sx?: any;
}

export const ProfessionalButtonGroup: React.FC<ProfessionalButtonGroupProps> = ({
  children,
  sx = {}
}) => {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        gap: 2, 
        flexWrap: 'wrap',
        alignItems: 'center',
        ...sx
      }}
    >
      {children}
    </Box>
  );
}; 