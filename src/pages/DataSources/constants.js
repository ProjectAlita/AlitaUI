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
    value: 'text_loader'
  },
  pythonLoader: {
    label: 'PythonLoader',
    value: 'python_loader'
  },
}

export const extractors = {
  bert: {
    label: 'KeyBert',
    value: 'bert'
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