export const sourceTypes = {
  file: {
    label: 'File',
    value: 'file'
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