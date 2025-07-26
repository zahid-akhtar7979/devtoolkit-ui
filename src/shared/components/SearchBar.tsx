import React, { useState, useRef, useEffect } from 'react';
import {
  TextField,
  InputAdornment,
  IconButton,
  Autocomplete,
  Box,
  Typography,
  Chip,
  Paper,
  useTheme,
  Tooltip
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  History as HistoryIcon,
  Keyboard as KeyboardIcon
} from '@mui/icons-material';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: (value: string) => void;
  placeholder?: string;
  searchHistory?: string[];
  suggestions?: string[];
  showKeyboardShortcut?: boolean;
  autoFocus?: boolean;
}

export const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(({
  value,
  onChange,
  onSubmit,
  placeholder = "Search tools...",
  searchHistory = [],
  suggestions = [],
  showKeyboardShortcut = true,
  autoFocus = false
}, ref) => {
  const theme = useTheme();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Focus handler for keyboard shortcut
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  // Combine search history and suggestions
  const options = [
    ...searchHistory.slice(0, 5).map(item => ({ type: 'history', value: item })),
    ...suggestions.slice(0, 5).map(item => ({ type: 'suggestion', value: item }))
  ];

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && onSubmit) {
      onSubmit(value);
      setIsOpen(false);
    }
    if (event.key === 'Escape') {
      setIsOpen(false);
      if (inputRef.current) {
        inputRef.current.blur();
      }
    }
  };

  const handleClear = () => {
    onChange('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const getShortcutDisplay = () => {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    return isMac ? '⌘K' : 'Ctrl+K';
  };

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      <Autocomplete
        freeSolo
        open={isOpen}
        onOpen={() => setIsOpen(true)}
        onClose={() => setIsOpen(false)}
        options={options}
        getOptionLabel={(option) => 
          typeof option === 'string' ? option : option.value
        }
        renderOption={(props, option) => (
          <Box
            component="li"
            {...props}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              py: 1
            }}
          >
            {typeof option === 'object' && option.type === 'history' && (
              <HistoryIcon sx={{ fontSize: 16, color: theme.palette.text.secondary }} />
            )}
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {typeof option === 'string' ? option : option.value}
            </Typography>
            {typeof option === 'object' && option.type === 'history' && (
              <Chip
                label="Recent"
                size="small"
                variant="outlined"
                sx={{ fontSize: '0.7rem', height: 20 }}
              />
            )}
          </Box>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            inputRef={(node) => {
              (inputRef as any).current = node;
              if (ref) {
                if (typeof ref === 'function') ref(node);
                else (ref as any).current = node;
              }
            }}
            fullWidth
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: theme.palette.text.secondary }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {value && (
                      <Tooltip title="Clear search">
                        <IconButton
                          size="small"
                          onClick={handleClear}
                          sx={{ color: theme.palette.text.secondary }}
                        >
                          <ClearIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                    {showKeyboardShortcut && (
                      <Tooltip title={`Press ${getShortcutDisplay()} to focus search`}>
                        <Box
                          sx={{
                            display: { xs: 'none', sm: 'flex' },
                            alignItems: 'center',
                            gap: 0.5,
                            px: 0.5,
                            py: 0.25,
                            border: 1,
                            borderColor: theme.palette.divider,
                            borderRadius: 0.5,
                            bgcolor: theme.palette.background.default,
                            fontSize: '0.75rem',
                            color: theme.palette.text.secondary
                          }}
                        >
                          <KeyboardIcon sx={{ fontSize: 12 }} />
                          {getShortcutDisplay()}
                        </Box>
                      </Tooltip>
                    )}
                  </Box>
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme.palette.primary.main,
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme.palette.primary.main,
                },
              },
            }}
          />
        )}
        PaperComponent={(props) => (
          <Paper
            {...props}
            sx={{
              mt: 1,
              borderRadius: 2,
              boxShadow: theme.shadows[8],
              border: 1,
              borderColor: theme.palette.divider,
            }}
          />
        )}
        onChange={(_, newValue) => {
          if (typeof newValue === 'string') {
            onChange(newValue);
          } else if (newValue && typeof newValue === 'object') {
            onChange(newValue.value);
            if (onSubmit) {
              onSubmit(newValue.value);
            }
          }
        }}
      />
    </Box>
  );
}); 