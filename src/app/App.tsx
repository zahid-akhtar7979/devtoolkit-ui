
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from '../shared/theme';
import { EnhancedLayout } from '../shared/components/EnhancedLayout';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <EnhancedLayout />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App; 