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


export const NAV_BAR_HEIGHT = '64px';
export const SOURCE_PROJECT_ID = 9;
export const DEFAULT_MAX_TOKENS = 100;
export const DEFAULT_TOP_P = 0.5;
export const DEFAULT_TOP_K = 20;
export const DEFAULT_TEMPERATURE = 0.7;

export const PROMPT_PAYLOAD_KEY = {
  name: "name",
  description: "description",
  tags: "tags",
  context: "context",
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
  Assistant: 'ai'
}

export const TOAST_DURATION = 6000;