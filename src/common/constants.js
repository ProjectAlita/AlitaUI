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

export const LATEST_VERSION_NAME = 'latest';

export const ChatBoxMode = {
  'Chat': 'chat',
  'Completion': 'freeform',
}

export const PROMPT_PAYLOAD_KEY = {
  name: "name",
  type: "type",
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
};

export const RoleOptions = [
  {
    value: ROLES.Assistant,
    label: 'Assistant',
  },
  {
    value: ROLES.System,
    label: 'System',
  },
  {
    value: ROLES.User,
    label: 'User',
  },
];

export const SortFields = {
  Date: 'date',
  Rate: 'rate',
}

export const MyLibrarySortByOptions = [
  {
    value: SortFields.Date,
    label: 'By Date',
  },
  {
    value: SortFields.Rate,
    label: 'By Rate',
  }
];

export const PromptStatus = {
  All: 'all',
  Draft: 'draft',
  Published: 'published',
  OnModeration: 'on moderation',
  UserApproval: 'user approval',
}

export const MyStatusOptions = [
  {
    value: PromptStatus.All,
    label: 'All Statuses',
  },
  {
    value: PromptStatus.Draft,
    label: 'Draft',
  },
  {
    value: PromptStatus.Published,
    label: 'Published',
  },
  {
    value: PromptStatus.OnModeration,
    label: 'On Moderation',
  },
  {
    value: PromptStatus.UserApproval,
    label: 'User Approval',
  }
];

export const ViewMode = {
  Owner: 'owner',
  Public: 'public',
}

export const ViewOptions = [
  {
    value: ViewMode.Owner,
    label: 'View as owner',
  },
  {
    value: ViewMode.Public,
    label: 'View as public',
  },
];

export const TOAST_DURATION = 6000;

export const PROMPT_MODE = {
  Edit: 'edit',
  View: 'view'
};

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
    XL: '380px',
    LG: '380px',
    MD: '380px',
    SM: '380px',
    XS: '380px',
  },
  TWO_CARDS: {
    XL: '47%',
    LG: '100%',
    MD: '100%',
    SM: '100%',
    XS: '100%',
  },
  THREE_CARDS: {
    XL: '31%',
    LG: '47%',
    MD: '100%',
    SM: '100%',
    XS: '100%',
  },
  MORE_THAN_THREE_CARDS: {
    XL: '31%',
    LG: '47%',
    MD: '100%',
    SM: '100%',
    XS: '100%',
  }
};

export const GROUP_SELECT_VALUE_SEPARATOR = '::::';

export const URL_PARAMS_KEY_TAGS = 'tags[]';
