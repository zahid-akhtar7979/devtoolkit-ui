import React from 'react';
import { Button, ButtonProps } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useClipboard } from '../../hooks/useClipboard';

interface CopyButtonProps extends Omit<ButtonProps, 'onClick'> {
  text: string;
  onCopy?: () => void;
  label?: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  text,
  onCopy,
  label = 'Copy',
  ...buttonProps
}) => {
  const { copied, copyToClipboard } = useClipboard();

  const handleCopy = async () => {
    const success = await copyToClipboard(text);
    if (success && onCopy) {
      onCopy();
    }
  };

  return (
    <Button
      startIcon={<ContentCopyIcon />}
      onClick={handleCopy}
      variant="outlined"
      size="small"
      disabled={!text}
      {...buttonProps}
    >
      {copied ? 'Copied!' : label}
    </Button>
  );
}; 