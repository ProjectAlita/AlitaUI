import RouteDefinitions from '@/routes';

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

export const MIN_SEARCH_KEYWORD_LENGTH = 3;
export const PAGE_SIZE = 20;
export const NAV_BAR_HEIGHT = '76px';
export const PUBLIC_PROJECT_ID = VITE_PUBLIC_PROJECT_ID; // todo: rename it everywhere
export const DEFAULT_MAX_TOKENS = 100;
export const DEFAULT_TOP_P = 0.5;
export const DEFAULT_TOP_K = 20;
export const DEFAULT_TEMPERATURE = 0.7;
export const SAVE = 'Save';
export const PUBLISH = 'Publish';
export const CREATE_VERSION = 'Create version';
export const CREATE_PUBLIC_VERSION = 'Publish version';

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
  ownerId: 'owner_id',
  is_liked: 'is_liked',
  likes: 'likes',
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

export const SortOrderOptions = {
  ASC: 'asc',
  DESC: 'desc',
}

export const SortFields = {
  Date: 'created_at',
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
  OnModeration: 'on_moderation',
  UserApproval: 'user_approval',
  Rejected: 'rejected',
}

export const MyPromptStatusOptions = [
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
    value: PromptStatus.Draft,
    label: 'Draft',
  },
  {
    value: PromptStatus.Published,
    label: 'Published',
  },
];

export const SearchParams = {
  ViewMode: 'viewMode',
  Name: 'name',
  Collection: 'collection',
  Statuses: 'statuses',
  SortOrder: 'sort_order',
  AuthorId: 'author_id',
  AuthorName: 'author_name',
};

export const PromptView = {
  CREATE: 'CREATE',
  EDIT: 'EDIT',
  MODERATE: 'MODERATE',
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
    XXL: 'calc(33.3% - 16px)',
    XL: 'calc(33.3% - 16px)',
    LG: 'calc(50% - 16px)',
    MD: 'calc(50% - 16px)',
    SM: 'calc(100% - 16px)',
    XS: 'calc(100% - 16px)',
  },
  THREE_CARDS: {
    XXL: 'calc(33.3% - 16px)',
    XL: 'calc(33.3% - 16px)',
    LG: 'calc(50% - 16px)',
    MD: 'calc(50% - 16px)',
    SM: 'calc(100% - 16px)',
    XS: 'calc(100% - 16px)',
  },
  MORE_THAN_THREE_CARDS: {
    XXL: 'calc(25% - 16px)',
    XL: 'calc(25% - 16px)',
    LG: 'calc(33.3% - 16px)',
    MD: 'calc(50% - 16px)',
    SM: 'calc(100% - 16px)',
    XS: 'calc(100% - 16px)',
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
    XXL: 'calc(50% - 16px)',
    XL: 'calc(50% - 16px)',
    LG: 'calc(50% - 16px)',
    MD: 'calc(50% - 16px)',
    FW_SM: 'calc(50% - 16px)',
    SM: 'calc(100% - 16px)',
    XS: 'calc(100% - 16px)',
  },
  THREE_CARDS: {
    XXL: 'calc(33.3% - 16px)',
    XL: 'calc(33.3% - 16px)',
    LG: 'calc(33.3% - 16px)',
    MD: 'calc(50% - 16px)',
    FW_SM: 'calc(50% - 16px)',
    SM: 'calc(100% - 16px)',
    XS: 'calc(100% - 16px)',
  },
  MORE_THAN_THREE_CARDS: {
    XXL: 'calc(25% - 16px)',
    XL: 'calc(25% - 16px)',
    LG: 'calc(33.3% - 16px)',
    MD: 'calc(50% - 16px)',
    FW_SM: 'calc(50% - 16px)',
    SM: 'calc(100% - 16px)',
    XS: 'calc(100% - 16px)',
  }
};

export const FULL_WIDTH_FLEX_GRID_PAGE = [ RouteDefinitions.ModerationSpace ];

export const GROUP_SELECT_VALUE_SEPARATOR = '::::';

export const URL_PARAMS_KEY_TAGS = 'tags[]';

export const ContentType = {
  MyLibraryAll: 'MyLibraryAll',
  MyLibraryCollections: 'MyLibraryCollections',
  MyLibraryCollectionsEdit: 'MyLibraryCollectionsEdit',
  MyLibraryDatasources: 'MyLibraryDatasources',
  MyLibraryPrompts: 'MyLibraryPrompts',
  UserPublicAll: 'UserPublicAll',
  UserPublicCollections: 'UserPublicCollections',
  UserPublicDatasources: 'UserPublicDatasources',
  UserPublicPrompts: 'UserPublicPrompts',
  UserPublicCollectionPrompts: 'UserPublicCollectionPrompts',
  MyLibraryCollectionPrompts: 'MyLibraryCollectionPrompts',
  PromptsTop: 'PromptsTop',
  PromptsLatest: 'PromptsLatest',
  PromptsMyLiked: 'PromptsMyLiked',
  CollectionsTop: 'CollectionsTop',
  CollectionsLatest: 'CollectionsLatest',
  CollectionsMyLiked: 'CollectionsMyLiked',
  CollectionPrompts: 'CollectionPrompts',
  DatasourcesTop: 'DatasourcesTop',
  DatasourcesLatest: 'DatasourcesLatest',
  DatasourcesMyLiked: 'DatasourcesMyLiked',
  ModerationSpacePrompt: 'ModerationSpacePrompt',
}

export const MyLibraryTabs = ['all', 'prompts', 'datasources', 'collections'];
export const PromptsTabs = ['top', 'latest', 'my-liked'];

export const RIGHT_PANEL_HEIGHT_OFFSET = '84px';
export const RIGHT_PANEL_WIDTH_OF_CARD_LIST_PAGE = '312px';

export const CARD_LIST_WIDTH = `calc(100vw - ${RIGHT_PANEL_WIDTH_OF_CARD_LIST_PAGE} - 48px)`;

export const CENTERED_CONTENT_BREAKPOINT = 2650;

export const VariableSources = {
  Context: 'context',
  Message: 'message',
}

export const TIME_FORMAT = {
  DDMMYYYY: 'dd-mm-yyyy'
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
}