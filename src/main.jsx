import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider, useSelector } from "react-redux";
import io from 'socket.io-client';
import App from './App';
import getDesignTokens from "./MainTheme.js";
import { VITE_SOCKET_PATH, VITE_SOCKET_SERVER } from "./common/constants";
import SocketContext from "./context/SocketContext";
import Store from "./store.js";

const RootComponent = () => {
  const isDarkMode = useSelector(state => state.settings.mode === 'dark');
  const getTheme = React.useCallback(() => {
    return createTheme(getDesignTokens(isDarkMode ? 'dark' : 'light'));
  }, [isDarkMode]);

  const [socket, setSocket] = React.useState(null);

  React.useEffect(() => {
    if (!VITE_SOCKET_SERVER) return;
    
    const socketIo = io(VITE_SOCKET_SERVER, { 
      path: VITE_SOCKET_PATH,
      reconnectionAttempts: 3,
      reconnectionDelayMax: 1000,
     });
    setSocket(socketIo);

    socketIo.on("connect_error", (err) => {
      // eslint-disable-next-line no-console
      console.log(`Connection error due to ${err}`);
    });
    // socketIo.on('disconnect', () => {
    //   console.log('reconnecting', socketIo.socket)
    //   // socketIo.socket.reconnect()
    // })

    return () => {
      socketIo && socketIo.disconnect();
    };
  }, []);

  return (
    <ThemeProvider theme={getTheme()}>
      <SocketContext.Provider value={socket}>
        <CssBaseline />
        <App />
      </SocketContext.Provider >
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