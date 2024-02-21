export const sourceTypes = {
  git: {
    label: 'Git',
    value: 'git'
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