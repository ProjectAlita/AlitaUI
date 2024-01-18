import { ChatBoxMode, PROMPT_PAYLOAD_KEY, GROUP_SELECT_VALUE_SEPARATOR } from "./constants";

export const genModelSelectValue = (integrationUid, modelName, integrationName) => {
  if (integrationUid || modelName || integrationName) {
    return `${integrationUid}${GROUP_SELECT_VALUE_SEPARATOR}${modelName}${GROUP_SELECT_VALUE_SEPARATOR}${integrationName}`;
  } else {
    return '';
  }
};

const variableSortFunc = (a, b) => {
  if (a.name > b.name) {
    return 1;
  } else if (a.name < b.name) {
    return -1;
  } else {
    return 0;
  }
}

export const promptDataToState = (data) => {
  const variables = [...(data.version_details.variables || [])];
  return {
    id: data.id,
    [PROMPT_PAYLOAD_KEY.type]: data.version_details.type,
    [PROMPT_PAYLOAD_KEY.integrationUid]: data.version_details.model_settings?.model.integration_uid || '',
    [PROMPT_PAYLOAD_KEY.integrationName]: data.version_details.model_settings?.model.integration_name || '',
    [PROMPT_PAYLOAD_KEY.name]: data.name || '',
    [PROMPT_PAYLOAD_KEY.description]: data.description || '',
    [PROMPT_PAYLOAD_KEY.likes]: data.likes || 0,
    [PROMPT_PAYLOAD_KEY.is_liked]: data.is_liked || false,
    [PROMPT_PAYLOAD_KEY.ownerId]: data?.owner_id || '',
    [PROMPT_PAYLOAD_KEY.tags]: data.version_details?.tags || [],
    [PROMPT_PAYLOAD_KEY.context]: data.version_details.context || '',
    [PROMPT_PAYLOAD_KEY.messages]: data.version_details.messages || [],
    [PROMPT_PAYLOAD_KEY.variables]: variables.sort(variableSortFunc).map(({name, value, id}) => ({key: name, value, id})),
    [PROMPT_PAYLOAD_KEY.modelName]: data.version_details.model_settings?.model.name,
    [PROMPT_PAYLOAD_KEY.temperature]: data.version_details.model_settings?.temperature,
    [PROMPT_PAYLOAD_KEY.maxTokens]: data.version_details.model_settings?.max_tokens,
    [PROMPT_PAYLOAD_KEY.topP]: data.version_details.model_settings?.top_p,
    [PROMPT_PAYLOAD_KEY.topK]: data.version_details.model_settings?.top_k,
  };
}

export const stateDataToPrompt = (data) => {
  return {
    id: data.id,
    embedding: '0',
    name: data[PROMPT_PAYLOAD_KEY.name],
    type: data[PROMPT_PAYLOAD_KEY.type] || ChatBoxMode.Chat,
    description: data[PROMPT_PAYLOAD_KEY.description],
    versions: [{
      name: "latest",
      context: data[PROMPT_PAYLOAD_KEY.context],
      variables: data[PROMPT_PAYLOAD_KEY.variables].map(({ key, value, id }) => ({ name: key, value, id })),
      messages: data[PROMPT_PAYLOAD_KEY.messages].map(({role, content}) =>({role, content})),
      tags: data[PROMPT_PAYLOAD_KEY.tags],
      model_settings: {
        temperature: data[PROMPT_PAYLOAD_KEY.temperature],
        max_tokens: data[PROMPT_PAYLOAD_KEY.maxTokens],
        top_p: data[PROMPT_PAYLOAD_KEY.topP],
        top_k: data[PROMPT_PAYLOAD_KEY.topK],
        stream: false,
        model: {
          name: data[PROMPT_PAYLOAD_KEY.modelName],
          integration_uid: data[PROMPT_PAYLOAD_KEY.integrationUid],
          integration_name: data[PROMPT_PAYLOAD_KEY.integrationName],
        },
        suggested_models: [
          data[PROMPT_PAYLOAD_KEY.modelName]
        ]
      }
    }]
  };
}

export const stateDataToVersion = (data) => {
  return {
    name: "latest",
    type: data[PROMPT_PAYLOAD_KEY.type] || ChatBoxMode.Chat,
    context: data[PROMPT_PAYLOAD_KEY.context],
    variables: data[PROMPT_PAYLOAD_KEY.variables].map(({ key, value, id }) => ({ name: key, value, id })),
    messages: data[PROMPT_PAYLOAD_KEY.messages].map(({role, content}) =>({role, content})),
    tags: data[PROMPT_PAYLOAD_KEY.tags],
    model_settings: {
      temperature: data[PROMPT_PAYLOAD_KEY.temperature],
      max_tokens: data[PROMPT_PAYLOAD_KEY.maxTokens],
      top_p: data[PROMPT_PAYLOAD_KEY.topP],
      top_k: data[PROMPT_PAYLOAD_KEY.topK],
      stream: false,
      model: {
        name: data[PROMPT_PAYLOAD_KEY.modelName],
        integration_uid: data[PROMPT_PAYLOAD_KEY.integrationUid],
        integration_name: data[PROMPT_PAYLOAD_KEY.integrationName],
      },
      suggested_models: [
        data[PROMPT_PAYLOAD_KEY.modelName]
      ]
    }
  };
}

export const versionDetailDataToState = (data, currentPrompt) => {
  const variables = [...(data.variables || [])];
  return {
    ...currentPrompt,
    [PROMPT_PAYLOAD_KEY.type]: data.type || ChatBoxMode.Chat,
    [PROMPT_PAYLOAD_KEY.tags]: data.tags || [],
    [PROMPT_PAYLOAD_KEY.context]: data.context || '',
    [PROMPT_PAYLOAD_KEY.messages]: data.messages || [],
    [PROMPT_PAYLOAD_KEY.variables]: variables.sort(variableSortFunc).map(({name, value, id}) => ({key: name, value, id})),
    [PROMPT_PAYLOAD_KEY.modelName]: data.model_settings?.model?.name,
    [PROMPT_PAYLOAD_KEY.temperature]: data.model_settings?.temperature,
    [PROMPT_PAYLOAD_KEY.maxTokens]: data.model_settings?.max_tokens,
    [PROMPT_PAYLOAD_KEY.topP]: data.model_settings?.top_p,
    [PROMPT_PAYLOAD_KEY.topK]: data.model_settings?.top_k,
    [PROMPT_PAYLOAD_KEY.integrationUid]: data.model_settings?.model?.integration_uid || '',
    [PROMPT_PAYLOAD_KEY.integrationName]: data.model_settings?.model?.integration_name || '',
  };
}

export const removeDuplicateObjects = (objects = []) => {
  const uniqueData = [];
  const idsSet = new Set();

  objects.forEach(item => {
    if (!idsSet.has(item.id)) {
      idsSet.add(item.id);
      uniqueData.push(item);
    }
  });

  return uniqueData;
}

export const newlyFetchedTags = (fetchedPrompts) => {
  return fetchedPrompts.reduce((newlyFetchedTagsList, promptEntry) => {
    promptEntry.tags.forEach(tag => {
      newlyFetchedTagsList.push(tag)
    })
    return newlyFetchedTagsList;
  }, [])
}