import {
  DEFAULT_TEMPERATURE,
  DEFAULT_TOP_P,
  DEFAULT_MAX_TOKENS,
  DEFAULT_TOP_K,
  DEFAULT_CUT_OFF_SCORE,
  DEFAULT_FETCH_K,
  DEFAULT_PAGE_TOP_K
} from '@/common/constants';

export const sourceTypes = {
  file: {
    label: 'File',
    value: 'file'
  },
  table: {
    label: 'Table',
    value: 'table'
  },
  git: {
    label: 'Git',
    value: 'git'
  },
  confluence: {
    label: 'Confluence',
    value: 'confluence'
  },
  jira: {
    label: 'Jira',
    value: 'jira'
  }
}

export const gitTypes = {
  ssh: {
    label: 'SSH',
    value: 'ssh'
  },
  https: {
    label: 'HTTPS',
    value: 'https'
  },
}

export const tokenTypes = {
  api_key: {
    label: 'API Key',
    value: 'api_key'
  },
  token: {
    label: 'Token',
    value: 'token'
  },
}

export const hostingTypes = {
  cloud: {
    label: 'Cloud',
    value: 'cloud'
  },
  server: {
    label: 'Server',
    value: 'server'
  }
}

export const jiraFilterTypes = {
  project_key: {
    label: 'Project key',
    value: 'project_key'
  },
  issue_id: {
    label: 'Issue ID',
    value: 'issue_id'
  },
  jql: {
    label: 'JQL',
    value: 'jql'
  },
}



export const confluenceFilterTypes = {
  space_key: {
    label: 'Space key',
    value: 'space_key'
  },
  page_ids: {
    label: 'Page IDs',
    value: 'page_ids'
  },
  labels: {
    label: 'Labels',
    value: 'labels'
  },
}

export const confluenceContentFormats = {
  view: {
    label: 'View',
    value: 'view'
  },
  storage: {
    label: 'Storage',
    value: 'storage'
  },
  anonymous: {
    label: 'Anonymous',
    value: 'anonymous'
  },
  editor: {
    label: 'Editor',
    value: 'editor'
  }
}

export const documentLoaders = {
  textLoader: {
    label: 'TextLoader',
    value: 'TextLoader'
  },
  pythonLoader: {
    label: 'PythonLoader',
    value: 'PythonLoader'
  },
}

export const extractors = {
  bert: {
    label: 'KeyBert',
    value: 'Bert'
  }
}

export const splitters = {
  chunks: {
    label: 'Chunks',
    value: 'chunks'
  },
  lines: {
    label: 'Lines',
    value: 'lines'
  },
  paragraphs: {
    label: 'Paragraphs',
    value: 'paragraphs'
  },
  sentences: {
    label: 'Sentences',
    value: 'sentences'
  }
}

export const initialChatSettings = {
  chat_model: {
    model_name: '',
    integration_uid: '',
    integration_name: '',
  },
  embedding_model: {
    model_name: '',
    integration_uid: '',
    integration_name: '',
  },
  temperature: DEFAULT_TEMPERATURE,
  top_p: DEFAULT_TOP_P,
  top_k: DEFAULT_TOP_K,
  max_length: DEFAULT_MAX_TOKENS,
  fetch_k: DEFAULT_FETCH_K,
  page_top_k: DEFAULT_PAGE_TOP_K,
  cut_off_score: DEFAULT_CUT_OFF_SCORE,
}

export const initialSearchSettings = {
  embedding_model: {
    model_name: '',
    integration_uid: '',
    integration_name: '',
  },
  top_k: DEFAULT_TOP_K,
  cut_off_score: DEFAULT_CUT_OFF_SCORE,
  fetch_k: DEFAULT_FETCH_K,
  page_top_k: DEFAULT_PAGE_TOP_K,
  str_content: false,
}

export const dedupCutoffOptions = [{label: '<=', value: 'le'}, {label: '>=', value: 'ge'}]

export const initialDeduplicateSettings = {
  embedding_model: {
    model_name: '',
    integration_uid: '',
    integration_name: '',
  },
  cut_off_score: DEFAULT_CUT_OFF_SCORE,
  generate_file: false,
  cut_off_option: dedupCutoffOptions[0].value
}

export const datasetStatus = {
  preparing: {
    value: 'preparing',
    hint: 'Preparing'
  },
  stopped: {
    value: 'stopped',
    hint: 'Dataset creation was interrupted. Functionality related to the embedded content may be impacted. Restart process to complete dataset creation.'
  },
  error: {
    value: 'error',
    hint: 'An error occured during dataset creation. Functionality related to the embedded content may be impacted.'
  },
  ready: {
    value: 'ready',
    hint: 'Ready'
  },
}