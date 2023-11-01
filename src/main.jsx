import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import {CssBaseline, ThemeProvider} from "@mui/material";
import MainTheme from "./MainTheme.js";
import {Provider} from "react-redux";
import {BrowserRouter} from "react-router-dom";
import Store from "./store.js";
import {VITE_BASE_URI, DEV} from "./constants/constants.js";


ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ThemeProvider theme={MainTheme}>
            <CssBaseline />
            <Provider store={Store}>
                <BrowserRouter basename={DEV ? '' : VITE_BASE_URI}>
                    <App />
                </BrowserRouter>
            </Provider>
        </ThemeProvider>
    </React.StrictMode>,
)
