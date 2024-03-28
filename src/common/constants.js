/* eslint-disable no-prototype-builtins */
import RouteDefinitions from '@/routes';

const alita_ui_config = window?.alita_ui_config || {}

export const VITE_GAID = alita_ui_config.hasOwnProperty('vite_gaid') ?
  alita_ui_config.vite_gaid : import.meta.env.VITE_GAID;

export const VITE_SERVER_URL = alita_ui_config.hasOwnProperty('vite_server_url') ?
  alita_ui_config.vite_server_url : import.meta.env.VITE_SERVER_URL;

export const VITE_BASE_URI = alita_ui_config.hasOwnProperty('vite_base_uri') ?
  alita_ui_config.vite_base_uri : import.meta.env.VITE_BASE_URI;

export const VITE_DEV_TOKEN = alita_ui_config.hasOwnProperty('vite_dev_token') ?
  alita_ui_config.vite_dev_token : import.meta.env.VITE_DEV_TOKEN;

export const VITE_DEV_SERVER = alita_ui_config.hasOwnProperty('vite_dev_server') ?
  alita_ui_config.vite_dev_server : import.meta.env.VITE_DEV_SERVER;

export const VITE_SOCKET_SERVER = alita_ui_config.hasOwnProperty('vite_socket_server') ?
  alita_ui_config.vite_socket_server : import.meta.env.VITE_SOCKET_SERVER;

export const VITE_SOCKET_PATH = alita_ui_config.hasOwnProperty('vite_socket_path') ?
  alita_ui_config.vite_socket_path : import.meta.env.VITE_SOCKET_PATH;

export const BASE_URL = alita_ui_config.hasOwnProperty('base_url') ?
  alita_ui_config.base_url : import.meta.env.BASE_URL;

export const DEV = alita_ui_config.hasOwnProperty('dev') ?
  alita_ui_config.dev : import.meta.env.DEV;

export const MODE = alita_ui_config.hasOwnProperty('mode') ?
  alita_ui_config.mode : import.meta.env.MODE;

export const PROD = alita_ui_config.hasOwnProperty('prod') ?
  alita_ui_config.prod : import.meta.env.PROD;

export const VITE_PUBLIC_PROJECT_ID = alita_ui_config.hasOwnProperty('vite_public_project_id') ?
  alita_ui_config.vite_public_project_id : import.meta.env.VITE_PUBLIC_PROJECT_ID;

export const VITE_SHOW_APPLICATION = alita_ui_config.hasOwnProperty('vite_show_application') ?
  alita_ui_config.VITE_SHOW_APPLICATION : import.meta.env.VITE_SHOW_APPLICATION;

export const MISSING_ENVS = [
  { key: 'VITE_SERVER_URL', value: VITE_SERVER_URL },
  { key: 'VITE_BASE_URI', value: VITE_BASE_URI },
  { key: 'VITE_PUBLIC_PROJECT_ID', value: VITE_PUBLIC_PROJECT_ID }
].filter(item => item.value === null || item.value === undefined)
  .map(item => item.key);

// eslint-disable-next-line no-console
DEV && console.debug('import.meta.env', import.meta.env)
export const MIN_LARGE_WINDOW_WIDTH = 1200;
export const MIN_SEARCH_KEYWORD_LENGTH = 3;
export const PAGE_SIZE = 20;
export const SUGGESTION_PAGE_SIZE = 5;
export const NAV_BAR_HEIGHT = '76px';
export const NAV_BAR_HEIGHT_TABLET = '120px';
export const PUBLIC_PROJECT_ID = VITE_PUBLIC_PROJECT_ID; // todo: rename it everywhere
export const DEFAULT_MAX_TOKENS = 512;
export const DEFAULT_TOP_P = 0.5;
export const DEFAULT_TOP_K = 20;
export const DEFAULT_FETCH_K = 30;
export const DEFAULT_PAGE_TOP_K = 5;
export const DEFAULT_TEMPERATURE = 0.7;
export const DEFAULT_CUT_OFF_SCORE = 0.3;
export const SAVE = 'Save';
export const PUBLISH = 'Publish';
export const CREATE_VERSION = 'Create version';
export const CREATE_PUBLIC_VERSION = 'Publish version';

export const LATEST_VERSION_NAME = 'latest';

export const ChatBoxMode = {
  'Chat': 'chat',
  'Completion': 'freeform',
}

export const CapabilityTypes = {
  completion: {
    label: 'Text',
    value: 'completion',
  },
  chat_completion: {
    label: 'Chat',
    value: 'chat_completion',
  },
  embeddings: {
    label: 'Embeddings',
    value: 'embeddings',
  }
}

export const DataSourceChatBoxMode = {
  Chat: 'chat',
  Search: 'search',
  Deduplicate: 'Deduplicate',
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
  integrationName: 'integration_name',
  ownerId: 'owner_id',
  is_liked: 'is_liked',
  likes: 'likes',
}

export const DATA_SOURCE_PAYLOAD_KEY = {
  name: "name",
  description: "description",
  tags: "tags",
  embeddingModel: "embedding_model",
  embeddingSettings: "embedding_settings",
  storage: "storage",
}

export const APPLICATION_PAYLOAD_KEY = {
  file: "file",
  name: "name",
  description: "description",
  tags: "tags",
  type: "type",
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

export const SocketMessageType = {
  References: 'references',
  Chunk: 'chunk',
  AIMessageChunk: 'AIMessageChunk',
  StartTask: 'start_task',
  Freeform: 'freeform',
  Error: 'error',
}

export const StreamingMessageType = {
  Chat: 'chat',
  Freeform: 'freeform'
}

export const SortOrderOptions = {
  ASC: 'asc',
  DESC: 'desc',
}

export const SortFields = {
  Id: 'id',
  Authors: 'authors',
  CreatedAt: 'created_at',
  Likes: 'likes',
  Name: 'name',
  Rate: 'rate',
}

export const MyLibraryDateSortOrderOptions = [
  {
    value: SortOrderOptions.DESC,
    label: 'Newest',
  },
  {
    value: SortOrderOptions.ASC,
    label: 'Oldest',
  }
];

export const MyLibraryRateSortOrderOptions = [
  {
    value: SortOrderOptions.DESC,
    label: 'Popular',
  },
  {
    value: SortOrderOptions.ASC,
    label: 'Unpopular',
  }
];

export const MyLibrarySortByOptions = [
  {
    value: SortFields.CreatedAt,
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
  OnModeration: 'on_moderation',
  UserApproval: 'user_approval',
  Rejected: 'rejected',
}

export const MyPromptStatusOptions = [
  {
    value: PromptStatus.All,
    label: 'All statuses',
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
  },
  {
    value: PromptStatus.Rejected,
    label: 'Rejected',
  },
];

export const MyCollectionStatusOptions = [
  {
    value: PromptStatus.All,
    label: 'All statuses',
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
  },
  {
    value: PromptStatus.Rejected,
    label: 'Rejected',
  },
];

export const SearchParams = {
  ViewMode: 'viewMode',
  Name: 'name',
  Collection: 'collection',
  Statuses: 'statuses',
  SortOrder: 'sort_order',
  SortBy: 'sort_by',
  AuthorId: 'author_id',
  AuthorName: 'author_name',
  PageSize: 'page_size',
  View: 'view',
  DeploymentName: 'deployment_name',
  DeploymentConfigName: 'config_name'
};

export const ViewOptions = {
  Table: 'table',
  Cards: 'cards',
}

export const PromptView = {
  CREATE: 'CREATE',
  EDIT: 'EDIT',
  MODERATE: 'MODERATE',
}

export const ComponentMode = {
  CREATE: 'CREATE',
  EDIT: 'EDIT',
  VIEW: 'VIEW',
}

export const ViewMode = {
  Owner: 'owner',
  Public: 'public',
  Moderator: 'moderator',
}

export const TOAST_DURATION = 2500;

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

export const MIN_CARD_WIDTH = '364px';
const ONE_CARD_WIDTH = 'calc(100% - 16px)';
const TWO_CARD_WIDTH = 'calc(50% - 16px)';
const THREE_CARD_WIDTH = 'calc(33.3% - 16px)';
const FOUR_CARD_WIDTH = 'calc(25% - 16px)';

export const CARD_FLEX_GRID = {
  ONE_CARD: {
    XXL: MIN_CARD_WIDTH,
    XL: MIN_CARD_WIDTH,
    LG: MIN_CARD_WIDTH,
    MD: MIN_CARD_WIDTH,
    SM: MIN_CARD_WIDTH,
    XS: MIN_CARD_WIDTH,
  },
  TWO_CARDS: {
    XXL: THREE_CARD_WIDTH,
    XL: THREE_CARD_WIDTH,
    LG: TWO_CARD_WIDTH,
    MD: TWO_CARD_WIDTH,
    SM: ONE_CARD_WIDTH,
    XS: ONE_CARD_WIDTH,
  },
  THREE_CARDS: {
    XXL: THREE_CARD_WIDTH,
    XL: THREE_CARD_WIDTH,
    LG: TWO_CARD_WIDTH,
    MD: TWO_CARD_WIDTH,
    SM: ONE_CARD_WIDTH,
    XS: ONE_CARD_WIDTH,
  },
  MORE_THAN_THREE_CARDS: {
    XXL: FOUR_CARD_WIDTH,
    XL: FOUR_CARD_WIDTH,
    LG: THREE_CARD_WIDTH,
    MD: TWO_CARD_WIDTH,
    SM: ONE_CARD_WIDTH,
    XS: ONE_CARD_WIDTH,
  }
};

export const FULL_WIDTH_CARD_FLEX_GRID = {
  ONE_CARD: {
    XXL: MIN_CARD_WIDTH,
    XL: MIN_CARD_WIDTH,
    LG: MIN_CARD_WIDTH,
    MD: MIN_CARD_WIDTH,
    FW_SM: MIN_CARD_WIDTH,
    SM: MIN_CARD_WIDTH,
    XS: MIN_CARD_WIDTH,
  },
  TWO_CARDS: {
    XXL: TWO_CARD_WIDTH,
    XL: TWO_CARD_WIDTH,
    LG: TWO_CARD_WIDTH,
    MD: TWO_CARD_WIDTH,
    FW_SM: TWO_CARD_WIDTH,
    SM: ONE_CARD_WIDTH,
    XS: ONE_CARD_WIDTH,
  },
  THREE_CARDS: {
    XXL: THREE_CARD_WIDTH,
    XL: THREE_CARD_WIDTH,
    LG: THREE_CARD_WIDTH,
    MD: TWO_CARD_WIDTH,
    FW_SM: TWO_CARD_WIDTH,
    SM: ONE_CARD_WIDTH,
    XS: ONE_CARD_WIDTH,
  },
  MORE_THAN_THREE_CARDS: {
    XXL: FOUR_CARD_WIDTH,
    XL: FOUR_CARD_WIDTH,
    LG: THREE_CARD_WIDTH,
    MD: TWO_CARD_WIDTH,
    FW_SM: TWO_CARD_WIDTH,
    SM: ONE_CARD_WIDTH,
    XS: ONE_CARD_WIDTH,
  }
};

export const GROUP_SELECT_VALUE_SEPARATOR = '::::';

export const URL_PARAMS_KEY_TAGS = 'tags[]';

export const ContentType = {
  MyLibraryAll: 'MyLibraryAll',
  MyLibraryCollections: 'MyLibraryCollections',
  MyLibraryCollectionsEdit: 'MyLibraryCollectionsEdit',
  MyLibraryDatasources: 'MyLibraryDatasources',
  MyLibraryPrompts: 'MyLibraryPrompts',
  MyLibraryApplications: 'MyLibraryApplications',
  UserPublicAll: 'UserPublicAll',
  UserPublicCollections: 'UserPublicCollections',
  UserPublicDatasources: 'UserPublicDatasources',
  UserPublicApplications: 'UserPublicApplications',
  UserPublicPrompts: 'UserPublicPrompts',
  UserPublicCollectionPrompts: 'UserPublicCollectionPrompts',
  MyLibraryCollectionPrompts: 'MyLibraryCollectionPrompts',
  MyLibraryCollectionDatasources: 'MyLibraryCollectionDatasources',
  MyLibraryCollectionApplications: 'MyLibraryCollectionApplications',
  PromptsTop: 'PromptsTop',
  PromptsLatest: 'PromptsLatest',
  PromptsMyLiked: 'PromptsMyLiked',
  PromptsTrending: 'PromptsTrending',
  CollectionsTop: 'CollectionsTop',
  CollectionsLatest: 'CollectionsLatest',
  CollectionsMyLiked: 'CollectionsMyLiked',
  CollectionsTrending: 'CollectionsTrending',
  CollectionPrompts: 'CollectionPrompts',
  DatasourcesTop: 'DatasourcesTop',
  DatasourcesLatest: 'DatasourcesLatest',
  DatasourcesMyLiked: 'DatasourcesMyLiked',
  DatasourcesTrending: 'DatasourcesTrending',
  ApplicationTop: 'ApplicationTop',
  ApplicationLatest: 'ApplicationLatest',
  ApplicationMyLiked: 'ApplicationMyLiked',
  ApplicationTrending: 'ApplicationTrending',
  ModerationSpacePrompt: 'ModerationSpacePrompt',
  ModerationSpaceCollection: 'ModerationSpaceCollection',
  ModerationSpaceDatasource: 'ModerationSpaceDatasource',
  ModerationSpaceApplication: 'ModerationSpaceApplication',
}
export const PERSONAL_SPACE_PERIOD_FOR_NEW_USER = 5 * 60 * 1000;
export const ALL_TIME_DATE = '2000-01-01T00:00:00';

export const DEFAULT_TOKEN_EXPIRATION_DAYS = 30;
export const EXPIRATION_MEASURES = ['never', 'days', 'weeks', 'hours', 'minutes'];

export const MyLibraryTabs = ['all', 'prompts', 'datasources', 'applications', 'collections'];
export const ModerationTabs = ['all', 'prompts', 'collections'];
export const PromptsTabs = ['latest', 'my-liked', 'trending'];
export const CollectionTabs = ['latest', 'my-liked', 'trending'];
export const DatasourcesTabs = ['latest', 'my-liked', 'trending'];
export const ApplicationsTabs = ['latest', 'my-liked', 'trending'];
export const SettingsPersonalProjectTabs = ['profile', 'configuration', 'deployments'];

export const RIGHT_PANEL_HEIGHT_OFFSET = '84px';
export const RIGHT_PANEL_WIDTH_OF_CARD_LIST_PAGE = '312px';

export const CENTERED_CONTENT_BREAKPOINT = 2650;
export const PAGE_PADDING = 24;
export const MARGIN_COMPENSATION = '16px';

const CENTERED_CONTENT_WIDTH = CENTERED_CONTENT_BREAKPOINT - (PAGE_PADDING * 2);

export const CARD_LIST_WIDTH = `calc(100% - ${RIGHT_PANEL_WIDTH_OF_CARD_LIST_PAGE})`;
export const CARD_LIST_WIDTH_FULL = `calc(100% + ${MARGIN_COMPENSATION})`

export const CARD_LIST_WIDTH_CENTERED = `calc(${CENTERED_CONTENT_WIDTH}px - ${RIGHT_PANEL_WIDTH_OF_CARD_LIST_PAGE})`;
export const CARD_LIST_WIDTH_FULL_CENTERED = `calc(${CENTERED_CONTENT_WIDTH}px + ${MARGIN_COMPENSATION})`

export const VariableSources = {
  Context: 'context',
  Message: 'message',
}

export const TIME_FORMAT = {
  DDMMYYYY: 'dd-mm-yyyy',
  MMMDD: 'MMM, dd'
}

export const PERMISSIONS = {
  moderation: {
    approve: 'models.prompt_lib.approve.post',
    reject: 'models.prompt_lib.reject.post'
  }
}

export const PERMISSION_GROUPS = {
  moderation: [PERMISSIONS.moderation.approve, PERMISSIONS.moderation.reject]
}

export const CollectionStatus = {
  Draft: 'draft',
  Published: 'published',
  OnModeration: 'on_moderation',
  UserApproval: 'user_approval',
  Rejected: 'rejected',
}

export const TAG_TYPE_COLLECTION_DETAIL_ALL = 'CollectionDetailAll';

export const AutoSuggestionTypes = [
  'tag',
  'prompt',
  'collection',
]

export const AutoSuggestionTitles = {
  TOP: 'Top Search Requests',
  TAGS: 'Tags',
  PROMPTS: 'Prompts',
  COLLECTIONS: 'Collections',
}

export const SupportedAI = {
  AIDial: 'ai_dial',
  VertexAI: 'vertex_ai',
  OpenAI: 'open_ai',
  HuggingFace: 'hugging_face',
  OpenAIAzure: 'open_ai_azure',
}

export const FULL_WIDTH_FLEX_GRID_PAGE = [
  `${RouteDefinitions.ModerationSpace}/${ModerationTabs[0]}`,
  `${RouteDefinitions.ModerationSpace}/${ModerationTabs[1]}`,
  `${RouteDefinitions.ModerationSpace}/${ModerationTabs[2]}`,
];

export const ProjectIdStorageKey = 'alita_ui.project.id'
export const ProjectNameStorageKey = 'alita_ui.project.name'

export const AuthenticationTypes = {
  None: {
    label: 'None',
    value: 'none',
  },
  APIKey: {
    label: 'API Key',
    value: 'api_key',
  },
  OAuth: {
    label: 'OAuth',
    value: 'oauth',
  }
}

export const OAuthTokenExchangeMethods = {
  Default: {
    label: 'Default (POST request)',
    value: 'default',
  },
  Basic: {
    label: 'Basic authorization header',
    value: 'basic',
  }
}

export const AuthTypes = {
  Basic: {
    label: 'Basic',
    value: 'basic',
  },
  Bear: {
    label: 'Bear',
    value: 'bear',
  },
  Custom: {
    label: 'Custom',
    value: 'custom',
  }
}

export const APIKeyTypes = {
  Secret: {
    label: 'Secret',
    value: 'secret'
  },
  Password: {
    label: 'Password',
    value: 'password'
  }
}


export const sioEvents = {
  promptlib_predict: 'promptlib_predict',
  promptlib_leave_rooms: 'promptlib_leave_rooms',
  datasource_predict: 'datasource_predict',
  datasource_dataset_status: 'datasource_dataset_status',
  datasource_leave_rooms: 'datasource_leave_rooms'
}