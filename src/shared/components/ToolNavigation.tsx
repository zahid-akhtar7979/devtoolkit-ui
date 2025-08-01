import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import { ArrowBack, Home } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface ToolNavigationProps {
  title: string;
  showBackButton?: boolean;
}

export const ToolNavigation: React.FC<ToolNavigationProps> = ({ 
  title, 
  showBackButton = true 
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const handleHome = () => {
    navigate('/');
  };

  return (
    <AppBar position="static" elevation={1}>
      <Toolbar>
        {showBackButton && (
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleBack}
            sx={{ mr: 2 }}
          >
            <ArrowBack />
          </IconButton>
        )}
        
        <IconButton
          color="inherit"
          onClick={handleHome}
          sx={{ mr: 2 }}
        >
          <Home />
        </IconButton>

        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {title}
        </Typography>
      </Toolbar>
    </AppBar>
  );
}; 