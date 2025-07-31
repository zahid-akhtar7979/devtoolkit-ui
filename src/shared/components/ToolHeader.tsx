import React from 'react';
import {
  Box,
  Container,
  Typography,
  IconButton,
  Breadcrumbs,
  Link,
  useTheme,
  alpha
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Home as HomeIcon,
  Apps as AppsIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { TOOLS_METADATA } from '../constants/tools';
import { Logo } from './Logo';

interface ToolHeaderProps {
  title?: string;
  description?: string;
}

export const ToolHeader: React.FC<ToolHeaderProps> = ({ 
  title, 
  description 
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  // Get current tool info
  const currentTool = TOOLS_METADATA.find(tool => tool.path === location.pathname);

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleBackToTools = () => {
    navigate('/');
  };

  const displayTitle = title || currentTool?.label || 'Tool';
  const displayDescription = description || currentTool?.description || '';

  return (
    <Box
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        bgcolor: alpha(theme.palette.background.default, 0.9),
        backdropFilter: 'blur(20px)',
        borderBottom: 1,
        borderColor: 'divider',
        py: 2
      }}
    >
      <Container maxWidth="xl">
        {/* Breadcrumbs */}
        <Breadcrumbs 
          aria-label="breadcrumb" 
          sx={{ 
            mb: 2,
            '& .MuiBreadcrumbs-separator': {
              color: 'text.secondary'
            }
          }}
        >
          <Link
            color="inherit"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleBackToHome();
            }}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              textDecoration: 'none',
              color: 'primary.main',
              '&:hover': {
                textDecoration: 'underline'
              }
            }}
          >
            <Logo size="small" />
            The Tool Arc
          </Link>
          <Link
            color="inherit"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleBackToTools();
            }}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              textDecoration: 'none',
              color: 'primary.main',
              '&:hover': {
                textDecoration: 'underline'
              }
            }}
          >
            <AppsIcon sx={{ fontSize: 16 }} />
            Home
          </Link>
          <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
            {displayTitle}
          </Typography>
        </Breadcrumbs>

        {/* Tool Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton
            onClick={handleBackToTools}
            sx={{
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: 'primary.main',
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.2),
              }
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
            <Logo size="xlarge" />
            <Box>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 700, 
                  fontSize: { xs: '1.5rem', sm: '2rem' },
                  mb: 0.5
                }}
              >
                {displayTitle}
              </Typography>
              {displayDescription && (
                <Typography 
                  variant="body1" 
                  color="text.secondary"
                  sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                >
                  {displayDescription}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}; 