import React from 'react';
import { Button, ButtonProps, CircularProgress } from '@mui/material';

interface LoadingButtonProps extends Omit<ButtonProps, 'onClick'> {
  loading: boolean;
  onClick: () => void;
  loadingText?: string;
  children: React.ReactNode;
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  loading,
  onClick,
  loadingText = 'Processing...',
  children,
  disabled,
  ...buttonProps
}) => {
  return (
    <Button
      onClick={onClick}
      disabled={loading || disabled}
      startIcon={loading ? <CircularProgress size={16} /> : undefined}
      {...buttonProps}
    >
      {loading ? loadingText : children}
    </Button>
  );
}; 