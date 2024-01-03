import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider, useSelector } from "react-redux";
import App from './App';
import getDesignTokens from "./MainTheme.js";
import Store from "./store.js";

const RootComponent = () => {
  const isDarkMode = useSelector(state => state.settings.mode === 'dark');
  const getTheme = React.useCallback(() => {
    return createTheme(getDesignTokens(isDarkMode ? 'dark' : 'light'));
  }, [isDarkMode]);

  return (
    <ThemeProvider theme={getTheme()}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={Store}>
      <RootComponent />
    </Provider>
  </React.StrictMode>
);