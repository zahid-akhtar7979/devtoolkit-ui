import React from 'react';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import logoImage from '../../assets/images/thetoolarc_transparent.svg';

interface LogoProps {
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  variant?: 'default' | 'monochrome';
}

export const Logo: React.FC<LogoProps> = ({ 
  size = 'medium', 
  variant = 'default' 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const getSize = () => {
    switch (size) {
      case 'small':
        return { 
          width: isMobile ? 36 : 40, 
          height: isMobile ? 36 : 40 
        };
      case 'large':
        return { 
          width: isMobile ? 80 : 100, 
          height: isMobile ? 80 : 100 
        };
      case 'xlarge':
        return { 
          width: isMobile ? 100 : 150, 
          height: isMobile ? 100 : 150 
        };
      default: // medium
        return { 
          width: isMobile ? 56 : 64, 
          height: isMobile ? 56 : 64 
        };
    }
  };

  const logoSize = getSize();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...logoSize,
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: 'scale(1.05)',
        },
        '& img': {
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          // Ensure the transparent logo displays properly
          mixBlendMode: 'normal',
          // Add appropriate filter based on variant
          filter: variant === 'monochrome' 
            ? 'brightness(0) saturate(100%) invert(27%) sepia(51%) saturate(2878%) hue-rotate(346deg) brightness(104%) contrast(97%)'
            : 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))'
        }
      }}
    >
      <img 
        src={logoImage} 
        alt="The Tool Arc Logo" 
        style={{ width: '100%', height: '100%' }}
      />
    </Box>
  );
}; 