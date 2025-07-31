import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Divider,
  Chip,
  useTheme,
  useMediaQuery,
  Fab,
  Zoom,
  Paper,
  IconButton,
  Collapse,
  alpha
} from '@mui/material';
import {
  Star as StarIcon,
  History as HistoryIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Apps as AppsIcon,
  Diamond as DiamondIcon
} from '@mui/icons-material';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';

import { SearchBar } from './SearchBar';
import { ToolCard } from './ToolCard';
import { ToolHeader } from './ToolHeader';
import { ToolSelector } from './ToolSelector';
import { Logo } from './Logo';
import { TOOLS_METADATA, getTopTools, getToolsByCategory, TOOL_CATEGORIES, getHighlightedTools } from '../constants/tools';
import { useSearch } from '../hooks/useSearch';
import { useUserPreferences } from '../hooks/useUserPreferences';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

// Import feature components
import Base64Tool from '../../features/base64/components/Base64Tool';
import HashTool from '../../features/hash/components/HashTool';
import JwtTool from '../../features/jwt/components/JwtTool';
import JasyptTool from '../../features/jasypt/components/JasyptTool';
import UrlTool from '../../features/url/components/UrlTool';
import UuidTool from '../../features/uuid/components/UuidTool';
import TimestampTool from '../../features/timestamp/components/TimestampTool';
import ImageTool from '../../features/image/components/ImageTool';
import RegexTool from '../../features/regex/components/RegexTool';
import ConverterTool from '../../features/converter/components/ConverterTool';
import AdvancedDiffTool from '../../features/diff/components/DiffTool';
import CronTool from '../../features/cron/components/CronTool';
import ImageCompressorTool from '../../features/compressor/components/ImageCompressorTool';
import SqlTool from '../../features/sql/components/SqlTool';
import ImageToPdfTool from '../../features/imagetopdf/components/ImageToPdfTool';
import PdfMergerTool from '../../features/pdfmerger/components/PdfMergerTool';

interface SectionProps {
  title: string;
  tools: any[];
  expanded: boolean;
  onToggle: () => void;
  icon?: React.ReactNode;
  description?: string;
}

const ToolSection: React.FC<SectionProps & {
  onToolClick: (tool: any) => void;
  onToggleFavorite: (toolId: string) => void;
  isFavorite: (toolId: string) => boolean;
  variant?: 'default' | 'compact' | 'featured';
}> = ({
  title,
  tools,
  expanded,
  onToggle,
  icon,
  description,
  onToolClick,
  onToggleFavorite,
  isFavorite,
  variant = 'default'
}) => {
  const theme = useTheme();

  if (tools.length === 0) return null;

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, sm: 3 },
        mb: 3,
        border: 1,
        borderColor: theme.palette.divider,
        borderRadius: 2,
        background: theme.palette.background.paper,
        boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.07), 0px 2px 4px rgba(0, 0, 0, 0.06)',
        }
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: expanded ? 2 : 0,
          cursor: 'pointer'
        }}
        onClick={onToggle}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {icon}
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.125rem' }}>
              {title}
            </Typography>
            {description && (
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                {description}
              </Typography>
            )}
          </Box>
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
        <IconButton size="small">
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      <Collapse in={expanded}>
        <Grid container spacing={{ xs: 2, sm: 2.5 }}>
          {tools.map((tool) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={tool.id}>
              <ToolCard
                tool={tool}
                onClick={onToolClick}
                onToggleFavorite={onToggleFavorite}
                isFavorite={isFavorite(tool.id)}
                variant={variant}
              />
            </Grid>
          ))}
        </Grid>
      </Collapse>
    </Paper>
  );
};

export const EnhancedLayout: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef<HTMLInputElement>(null);

  // Hooks
  const { searchQuery, setSearchQuery, filteredTools, clearSearch, hasQuery } = useSearch();
  const {
    recentlyUsedTools,
    favoriteTools,
    addToRecentlyUsed,
    toggleFavorite,
    isFavorite,
    addToSearchHistory,
    searchHistory
  } = useUserPreferences();

  // Section expansion state
  const [expandedSections, setExpandedSections] = useState({
    recent: true,
    favorites: true,
    premium: true,
    topTools: true,
    encoding: false,
    security: false,
    conversion: false,
    text: false,
    image: false,
    development: false,
    file: false
  });

  // Auto-focus search on Ctrl+K
  useKeyboardShortcuts(() => {
    if (searchRef.current) {
      (searchRef.current as HTMLInputElement).focus();
    }
  });

  // Show homepage when not searching
  const showHomepage = !hasQuery && location.pathname === '/';
  
  // Show search results when there's a query
  const showSearchResults = hasQuery;

  const handleToolClick = (tool: any) => {
    addToRecentlyUsed(tool.id);
    navigate(tool.path);
    clearSearch();
  };

  const handleToolSelectorOpen = () => {
    setToolSelectorOpen(true);
  };

  const handleToolSelectorClose = () => {
    setToolSelectorOpen(false);
  };

  const handleSearchSubmit = (query: string) => {
    if (query.trim()) {
      addToSearchHistory(query.trim());
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !(prev as any)[section]
    }));
  };

  // Get organized tools
  const topTools = getTopTools(6);
  const toolsByCategory = getToolsByCategory();
  const highlightedTools = getHighlightedTools();

  // Scroll to top FAB
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  // Tool selector modal
  const [toolSelectorOpen, setToolSelectorOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)',
      backgroundAttachment: 'fixed'
    }}>
      {/* Conditional Header */}
      {showHomepage || showSearchResults ? (
        // Homepage Header
        <Box
          sx={{
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            bgcolor: alpha(theme.palette.background.default, 0.8),
            backdropFilter: 'blur(20px)',
            borderBottom: 1,
            borderColor: 'divider',
            py: 2
          }}
        >
          <Container maxWidth="xl">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Logo size="xlarge" />
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                    The Tool Arc
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Fast, Free & Built for Everyone
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ flex: 1 }} />
              <IconButton
                onClick={handleToolSelectorOpen}
                sx={{
                  p: 1.5,
                  alignSelf: 'flex-start',
                  mt: 0.5,
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                  }
                }}
              >
                <AppsIcon sx={{ fontSize: 44, color: 'primary.main' }} />
              </IconButton>
            </Box>

            <SearchBar
              ref={searchRef}
              value={searchQuery}
              onChange={setSearchQuery}
              onSubmit={handleSearchSubmit}
              searchHistory={searchHistory}
              placeholder="Search tools... (Ctrl+K)"
            />
                  </Container>
      </Box>
      ) : (
        // Tool Header
        <ToolHeader />
      )}

      {/* Tool Selector Modal */}
      <ToolSelector
        open={toolSelectorOpen}
        onClose={handleToolSelectorClose}
        onToolSelect={handleToolClick}
      />

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: 3 }}>
        {showSearchResults ? (
          // Search Results
          <Box>
            <Typography variant="h6" sx={{ mb: 3 }}>
              {filteredTools.length} result{filteredTools.length !== 1 ? 's' : ''} for "{searchQuery}"
            </Typography>
            <Grid container spacing={{ xs: 2, sm: 2.5 }}>
              {filteredTools.map((tool) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={tool.id}>
                  <ToolCard
                    tool={tool}
                    onClick={handleToolClick}
                    onToggleFavorite={toggleFavorite}
                    isFavorite={isFavorite(tool.id)}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        ) : showHomepage ? (
          // Homepage
          <Box>
            {/* Recently Used Section */}
            {recentlyUsedTools.length > 0 && (
              <ToolSection
                title="Recently Used"
                tools={recentlyUsedTools}
                expanded={expandedSections.recent}
                onToggle={() => toggleSection('recent')}
                icon={<HistoryIcon sx={{ color: 'info.main' }} />}
                description="Your most recently accessed tools"
                onToolClick={handleToolClick}
                onToggleFavorite={toggleFavorite}
                isFavorite={isFavorite}
                variant="compact"
              />
            )}

            {/* Favorites Section */}
            {favoriteTools.length > 0 && (
              <ToolSection
                title="Favorites"
                tools={favoriteTools}
                expanded={expandedSections.favorites}
                onToggle={() => toggleSection('favorites')}
                icon={<StarIcon sx={{ color: 'warning.main' }} />}
                description="Your bookmarked tools"
                onToolClick={handleToolClick}
                onToggleFavorite={toggleFavorite}
                isFavorite={isFavorite}
                variant="featured"
              />
            )}

            {/* Featured Tools Section */}
            {highlightedTools.length > 0 && (
              <ToolSection
                title="Featured Tools"
                tools={highlightedTools}
                expanded={expandedSections.premium}
                onToggle={() => toggleSection('premium')}
                icon={<DiamondIcon sx={{ color: 'primary.main' }} />}
                description="Popular photo and document tools"
                onToolClick={handleToolClick}
                onToggleFavorite={toggleFavorite}
                isFavorite={isFavorite}
                variant="featured"
              />
            )}

            {/* Top Tools Section */}
            <ToolSection
              title="Most Popular"
              tools={topTools}
              expanded={expandedSections.topTools}
              onToggle={() => toggleSection('topTools')}
              icon={<AppsIcon sx={{ color: 'success.main' }} />}
              description="Essential tools for daily development"
              onToolClick={handleToolClick}
              onToggleFavorite={toggleFavorite}
              isFavorite={isFavorite}
              variant="featured"
            />

            {/* Category Sections */}
            {Object.entries(toolsByCategory).map(([category, tools]) => (
              <ToolSection
                key={category}
                title={TOOL_CATEGORIES[category as keyof typeof TOOL_CATEGORIES]?.label || category}
                tools={tools}
                expanded={expandedSections[category as keyof typeof expandedSections]}
                onToggle={() => toggleSection(category)}
                description={`${tools.length} tools for ${category} tasks`}
                onToolClick={handleToolClick}
                onToggleFavorite={toggleFavorite}
                isFavorite={isFavorite}
              />
            ))}
          </Box>
        ) : (
          // Tool Content
          <Routes>
            <Route path="/" element={<Base64Tool />} />
            <Route path="/base64" element={<Base64Tool />} />
            <Route path="/hash" element={<HashTool />} />
            <Route path="/jwt" element={<JwtTool />} />
            <Route path="/jasypt" element={<JasyptTool />} />
            <Route path="/url" element={<UrlTool />} />
            <Route path="/uuid" element={<UuidTool />} />
            <Route path="/timestamp" element={<TimestampTool />} />
            <Route path="/image" element={<ImageTool />} />
            <Route path="/regex" element={<RegexTool />} />
            <Route path="/converter" element={<ConverterTool />} />
            <Route path="/diff" element={<AdvancedDiffTool />} />
            <Route path="/cron" element={<CronTool />} />
            <Route path="/compressor" element={<ImageCompressorTool />} />
            <Route path="/sql" element={<SqlTool />} />
            <Route path="/image-to-pdf" element={<ImageToPdfTool />} />
            <Route path="/pdf-merger" element={<PdfMergerTool />} />
          </Routes>
        )}
      </Container>

      {/* Scroll to Top FAB */}
      <Zoom in={showScrollTop}>
        <Fab
          size="small"
          onClick={scrollToTop}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 1000
          }}
        >
          <ExpandLessIcon />
        </Fab>
      </Zoom>
    </Box>
  );
}; 