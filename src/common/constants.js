export const {
    VITE_GAID,
    VITE_SERVER_URL,
    VITE_BASE_URI,
    VITE_DEV_TOKEN,
    VITE_DEV_SERVER,
    BASE_URL,
    DEV,
    MODE,
    PROD,
    VITE_PUBLIC_PROJECT_ID
} = import.meta.env


// eslint-disable-next-line no-console
DEV && console.debug('import.meta.env', import.meta.env)


export const NAV_BAR_HEIGHT = '64px';
export const SOURCE_PROJECT_ID = VITE_PUBLIC_PROJECT_ID; // todo: rename it everywhere
export const DEFAULT_MAX_TOKENS = 100;
export const DEFAULT_TOP_P = 0.5;
export const DEFAULT_TOP_K = 20;
export const DEFAULT_TEMPERATURE = 0.7;

export const PROMPT_PAYLOAD_KEY = {
  name: "name",
  description: "description",
  tags: "tags",
  context: "prompt",
  messages: 'messages',
  variables: 'variables',
  modelName: 'model_name',
  temperature: 'temperature',
  maxTokens: 'max_tokens',
  topP: 'top_p',
  topK: 'top_k',
  integrationUid: 'integration_uid',
}

export const ROLES = {
  System: 'system',
  User: 'user',
  Assistant: 'assistant'
}

export const TOAST_DURATION = 6000;

export const PROMPT_MODE = {
  Edit: 'edit',
  View: 'view'
}

export const PROMPT_PAGE_INPUT = {
  ROWS: {
    TWO: '2.75rem',
    Three: '4.3rem'
  },
  CLAMP: {
    TWO: '2',
    Three: '3'
  }
}

export const CARD_FLEX_GRID = {
  ONE_CARD: {
    XL: '24.6875rem',
    LG: '24.6875rem',
    MD: '24.6875rem',
    SM: '24.6875rem',
    XS: '24.6875rem',
  },
  TWO_CARDS: {
    XL: '45%',
    LG: '45%',
    MD: '45%',
    SM: '100%',
    XS: '100%',
  },
  THREE_CARDS: {
    XL: '31%',
    LG: '31%',
    MD: '45%',
    SM: '100%',
    XS: '100%',
  },
  MORE_THAN_THREE_CARDS: {
    XL: '23.5%',
    LG: '31%',
    MD: '45%',
    SM: '100%',
    XS: '100%',
  }
}