export const ToolTypes = {
  datasource: {
    label: 'Datasource',
    value: 'datasource'
  },
  open_api: {
    label: 'Open API',
    value: 'open_api'
  },
  prompt: {
    label: 'Prompt',
    value: 'prompt'
  },
  custom: {
    label: 'Custom',
    value: 'custom'
  },
}

export const ActionTypes = {
  chat: {
    label: 'Chat',
    value: 'chat'
  },
  search: {
    label: 'Search',
    value: 'search'
  }
}

export const ActionOptions = Object.values(ActionTypes);

export const ToolInitialValues = {
  [ToolTypes.datasource.value]: {
    type: ToolTypes.datasource.value,
    name: '',
    description: '',
    datasource: '',
    actions: [],
  },
  [ToolTypes.open_api.value]: {
    type: ToolTypes.open_api.value,
    name: '',
    schema: '',
    authentication: {},
    actions: [],
  },
  [ToolTypes.custom.value]: {
    type: ToolTypes.custom.value,
    name: '',
    schema: '',
  }
}