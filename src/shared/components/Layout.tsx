import React, { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  useTheme,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
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
} from '@mui/icons-material';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { NAVIGATION_ITEMS } from '../../constants/navigation';

// Import feature components
import Base64Tool from '../../features/base64/Base64Tool';
import HashTool from '../../features/hash/HashTool';
import JwtTool from '../../features/jwt/JwtTool';
import JasyptTool from '../../features/jasypt/JasyptTool';
import UrlTool from '../../features/utility/UrlTool';
import UuidTool from '../../features/utility/UuidTool';
import TimestampTool from '../../features/utility/TimestampTool';
import ImageTool from '../../features/image/ImageTool';
import RegexTool from '../../features/utility/RegexTool';
import ConverterTool from '../../features/utility/ConverterTool';
import DiffTool from '../../features/utility/DiffTool';
import AdvancedDiffTool from '../../features/diff/DiffTool';

import CronTool from '../../features/cron/CronTool';
import ImageCompressorTool from '../../features/compressor/ImageCompressorTool';
import SqlTool from '../../features/utility/SqlTool';
import ImageToPdfTool from '../../features/imagetopdf/ImageToPdfTool';
import PdfMergerTool from '../../features/utility/PdfMergerTool';

const drawerWidth = 280;

// Icon mapping
const iconMap: { [key: string]: React.ComponentType } = {
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
};

const Layout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileOpen(false);
  };

  const drawer = (
    <Box>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Dev Toolkit
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {NAVIGATION_ITEMS.map((item) => {
          const IconComponent = iconMap[item.icon];
          const isActive = location.pathname === item.path;
          
          return (
            <ListItem key={item.id} disablePadding>
              <ListItemButton
                selected={isActive}
                onClick={() => handleNavigation(item.path)}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: theme.palette.primary.light,
                    color: theme.palette.primary.contrastText,
                    '&:hover': {
                      backgroundColor: theme.palette.primary.main,
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ color: isActive ? 'inherit' : undefined }}>
                  {IconComponent && <IconComponent />}
                </ListItemIcon>
                <ListItemText 
                  primary={item.label}
                  secondary={item.description}
                  secondaryTypographyProps={{
                    sx: { fontSize: '0.75rem' }
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Developer Utility Toolkit
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
        }}
      >
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
      </Box>
    </Box>
  );
};

export default Layout; 