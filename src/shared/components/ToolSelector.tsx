import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Grid,
  Box,
  TextField,
  InputAdornment,
  useTheme,
  alpha,
  Chip
} from '@mui/material';
import {
  Close as CloseIcon,
  Search as SearchIcon,
  Code,
  Fingerprint,
  Security,
  Lock,
  Link,
  Tag,
  Schedule,
  Image,
  Search,
  Transform,
  Compare,
  Terminal,
  Timer,
  Folder,
  Storage,
  PictureAsPdf,
  Compress,
  Edit,
  Merge,
  TextFields
} from '@mui/icons-material';
import { TOOLS_METADATA, TOOL_CATEGORIES } from '../constants/tools';

interface ToolSelectorProps {
  open: boolean;
  onClose: () => void;
  onToolSelect: (tool: any) => void;
}

// Icon mapping
const iconMap: { [key: string]: React.ComponentType<any> } = {
  Code,
  Fingerprint,
  Security,
  Lock,
  Link,
  Tag,
  Schedule,
  Image,
  Search,
  Transform,
  Compare,
  Terminal,
  Timer,
  Folder,
  Storage,
  PictureAsPdf,
  Compress,
  Edit,
  Merge,
  TextFields
};

export const ToolSelector: React.FC<ToolSelectorProps> = ({
  open,
  onClose,
  onToolSelect
}) => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter tools based on search
  const filteredTools = searchQuery.trim() 
    ? TOOLS_METADATA.filter(tool => 
        tool.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.keywords.some(keyword => keyword.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : TOOLS_METADATA;

  // Group tools by category
  const toolsByCategory = filteredTools.reduce((acc, tool) => {
    if (!acc[tool.category]) {
      acc[tool.category] = [];
    }
    acc[tool.category].push(tool);
    return acc;
  }, {} as Record<string, typeof TOOLS_METADATA>);

  const handleToolClick = (tool: any) => {
    onToolSelect(tool);
    onClose();
    setSearchQuery('');
  };

  const handleClose = () => {
    onClose();
    setSearchQuery('');
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: '80vh',
          background: alpha(theme.palette.background.paper, 0.95),
          backdropFilter: 'blur(20px)'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        pb: 1
      }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          All Tools ({TOOLS_METADATA.length})
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 0 }}>
        {/* Search */}
        <TextField
          fullWidth
          placeholder="Search tools..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 3 }}
        />

        {/* Tools by Category */}
        {Object.entries(toolsByCategory).map(([category, tools]) => (
          <Box key={category} sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                {TOOL_CATEGORIES[category as keyof typeof TOOL_CATEGORIES]?.label || category}
              </Typography>
              <Chip 
                label={tools.length} 
                size="small" 
                sx={{ 
                  minWidth: 24,
                  height: 20,
                  '& .MuiChip-label': { px: 0.75, fontSize: '0.75rem' }
                }} 
              />
            </Box>

            <Grid container spacing={2}>
              {tools.map((tool) => {
                const IconComponent = iconMap[tool.icon];
                return (
                  <Grid item xs={12} sm={6} md={4} key={tool.id}>
                    <Box
                      onClick={() => handleToolClick(tool)}
                      sx={{
                        p: 2,
                        border: 1,
                        borderColor: 'divider',
                        borderRadius: 1,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          borderColor: 'primary.main',
                          bgcolor: alpha(theme.palette.primary.main, 0.05),
                          transform: 'translateY(-1px)',
                          boxShadow: theme.shadows[2]
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                        {IconComponent && (
                          <IconComponent 
                            sx={{ 
                              fontSize: 20, 
                              color: 'primary.main' 
                            }} 
                          />
                        )}
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {tool.label}
                        </Typography>
                      </Box>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ fontSize: '0.875rem' }}
                      >
                        {tool.description}
                      </Typography>
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        ))}

        {filteredTools.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              No tools found matching "{searchQuery}"
            </Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}; 