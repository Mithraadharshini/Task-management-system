import React, { useMemo, useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './contexts/AuthContext';
import MainApp from './components/MainApp';
import { Brightness4, Brightness7 } from '@mui/icons-material';

export const ColorModeContext = React.createContext({ toggleColorMode: () => {} });

function App() {
  const [mode, setMode] = useState('light');

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    []
  );

 const theme = useMemo(
  () =>
    createTheme({
      palette: {
        mode,
        primary: {
          main: mode === 'light' ? '#006064' : '#1f1f1f', // 💡 Change these to your desired light/dark header colors
        },
        background: {
          default: mode === 'light' ? '#fafafa' : '#121212',
          paper: mode === 'light' ? '#fff' : '#1e1e1e',
        },
      },
    }),
  [mode]
);
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <MainApp />
        </AuthProvider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
