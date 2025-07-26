import React from 'react';
import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Box,
  IconButton,
  Tooltip,
  Chip,
  useTheme,
  alpha
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
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
import { ToolMetadata } from '../../constants/tools';

interface ToolCardProps {
  tool: ToolMetadata;
  onClick: (tool: ToolMetadata) => void;
  onToggleFavorite: (toolId: string) => void;
  isFavorite: boolean;
  showShortcut?: boolean;
  variant?: 'default' | 'compact' | 'featured';
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

const getCategoryColor = (category: ToolMetadata['category'], theme: any) => {
  const colors = {
    encoding: theme.palette.primary.main,
    security: theme.palette.error.main,
    conversion: theme.palette.info.main,
    text: theme.palette.success.main,
    image: theme.palette.warning.main,
    development: theme.palette.secondary.main,
    file: theme.palette.grey[600]
  };
  return colors[category] || theme.palette.grey[500];
};

const getFrequencyBadge = (frequency: ToolMetadata['usageFrequency']) => {
  switch (frequency) {
    case 'high':
      return { label: 'Popular', color: 'success' as const };
    case 'medium':
      return { label: 'Regular', color: 'primary' as const };
    case 'low':
      return { label: 'Occasional', color: 'default' as const };
    default:
      return null;
  }
};

const getFeaturedBadge = (tool: ToolMetadata) => {
  if (tool.isHighlighted) {
    return { label: 'Featured', color: 'primary' as const };
  }
  return null;
};

export const ToolCard: React.FC<ToolCardProps> = ({
  tool,
  onClick,
  onToggleFavorite,
  isFavorite,
  showShortcut = true,
  variant = 'default'
}) => {
  const theme = useTheme();
  const IconComponent = iconMap[tool.icon];
  const categoryColor = getCategoryColor(tool.category, theme);
  const frequencyBadge = getFrequencyBadge(tool.usageFrequency);
  const featuredBadge = getFeaturedBadge(tool);

  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault();
    onClick(tool);
  };

  const handleFavoriteClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    onToggleFavorite(tool.id);
  };

  const getShortcutDisplay = () => {
    if (!tool.shortcut) return null;
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    return tool.shortcut.replace('Ctrl', isMac ? '⌘' : 'Ctrl');
  };

  const cardHeight = variant === 'compact' ? 100 : variant === 'featured' ? 160 : 130;

  return (
    <Card
      sx={{
        height: cardHeight,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        transition: 'all 0.2s ease-in-out',
        border: 1,
        borderColor: 'transparent',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows[8],
          borderColor: categoryColor,
          '& .tool-icon': {
            transform: 'scale(1.1)',
            color: categoryColor,
          },
          '& .favorite-btn': {
            opacity: 1,
          }
        },
        ...(variant === 'featured' && {
          background: `linear-gradient(135deg, ${alpha(categoryColor, 0.1)} 0%, ${alpha(categoryColor, 0.05)} 100%)`,
          borderColor: alpha(categoryColor, 0.3),
        }),
        ...(tool.isHighlighted && {
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.primary.main, 0.03)} 100%)`,
          borderColor: alpha(theme.palette.primary.main, 0.25),
          borderWidth: 2,
          '&:hover': {
            borderColor: theme.palette.primary.main,
            boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.15)}`,
          }
        })
      }}
    >
      <CardActionArea
        onClick={handleClick}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          justifyContent: 'flex-start',
          p: 0
        }}
      >
        <CardContent
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            p: variant === 'compact' ? 1.5 : 2,
            pb: `${variant === 'compact' ? 1.5 : 2}px !important`,
            position: 'relative'
          }}
        >
          {/* Header with icon and favorite */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: variant === 'compact' ? 0.5 : 1
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {IconComponent && (
                <IconComponent
                  className="tool-icon"
                  sx={{
                    fontSize: variant === 'compact' ? 20 : variant === 'featured' ? 28 : 24,
                    color: alpha(categoryColor, 0.8),
                    transition: 'all 0.2s ease-in-out'
                  }}
                />
              )}
              {variant === 'featured' && frequencyBadge && (
                <Chip
                  label={frequencyBadge.label}
                  size="small"
                  color={frequencyBadge.color}
                  sx={{ fontSize: '0.65rem', height: 18 }}
                />
              )}
              {featuredBadge && (
                <Chip
                  label={featuredBadge.label}
                  size="small"
                  color={featuredBadge.color}
                  sx={{ 
                    fontSize: '0.65rem', 
                    height: 18,
                    fontWeight: 600,
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                    color: 'white'
                  }}
                />
              )}
            </Box>

            <IconButton
              className="favorite-btn"
              size="small"
              onClick={handleFavoriteClick}
              sx={{
                opacity: { xs: 1, sm: isFavorite ? 1 : 0 },
                transition: 'opacity 0.2s ease-in-out',
                color: isFavorite ? theme.palette.error.main : theme.palette.text.secondary,
                '&:hover': {
                  color: theme.palette.error.main,
                  backgroundColor: alpha(theme.palette.error.main, 0.1)
                }
              }}
            >
              {isFavorite ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
            </IconButton>
          </Box>

          {/* Tool name */}
          <Typography
            variant={variant === 'compact' ? 'body2' : 'h6'}
            component="h3"
            sx={{
              fontWeight: 600,
              mb: variant === 'compact' ? 0.5 : 0.75,
              lineHeight: 1.2,
              fontSize: variant === 'featured' ? '1.125rem' : undefined
            }}
            noWrap={variant === 'compact'}
          >
            {tool.label}
          </Typography>

          {/* Description */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              flex: 1,
              fontSize: variant === 'compact' ? '0.75rem' : '0.875rem',
              lineHeight: 1.3,
              display: '-webkit-box',
              WebkitLineClamp: variant === 'compact' ? 2 : 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              mb: variant === 'compact' ? 0 : 1
            }}
          >
            {tool.description}
          </Typography>

          {/* Footer with shortcut */}
          {showShortcut && tool.shortcut && variant !== 'compact' && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 'auto' }}>
              <Tooltip title={`Keyboard shortcut: ${getShortcutDisplay()}`}>
                <Chip
                  label={getShortcutDisplay()}
                  size="small"
                  variant="outlined"
                  sx={{
                    fontSize: '0.7rem',
                    height: 20,
                    '& .MuiChip-label': {
                      px: 0.75
                    },
                    borderColor: alpha(categoryColor, 0.3),
                    color: categoryColor,
                    '&:hover': {
                      backgroundColor: alpha(categoryColor, 0.1)
                    }
                  }}
                />
              </Tooltip>
            </Box>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
}; 