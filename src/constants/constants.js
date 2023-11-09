export const NAV_BAR_HEIGHT = '64px';
export const SOURCE_PROJECT_ID = 9;

export const {
    VITE_GAID,
    VITE_SERVER_URL,
    VITE_BASE_URI,
    VITE_DEV_TOKEN,
    VITE_DEV_SERVER,
    BASE_URL,
    DEV,
    MODE,
    PROD
} = import.meta.env


// eslint-disable-next-line no-console
DEV && console.debug('import.meta.env', import.meta.env)
