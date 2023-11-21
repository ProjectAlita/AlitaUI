import { ChatBoxMode, PROMPT_PAYLOAD_KEY } from "./constants";

export const promptDataToState = (data) => {
  return {
    id: data.id,
    [PROMPT_PAYLOAD_KEY.integrationUid]: data.version_details.model_settings?.model.integration_uid || '',
    [PROMPT_PAYLOAD_KEY.name]: data.name || '',
    [PROMPT_PAYLOAD_KEY.description]: data.description || '',
    [PROMPT_PAYLOAD_KEY.tags]: data.version_details?.tags || [],
    [PROMPT_PAYLOAD_KEY.context]: data.version_details.context || '',
    [PROMPT_PAYLOAD_KEY.messages]: data.version_details.messages || [],
    [PROMPT_PAYLOAD_KEY.variables]: data.version_details.variables || [],
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
    type: data[PROMPT_PAYLOAD_KEY.type],
    description: data[PROMPT_PAYLOAD_KEY.description],
    versions: [{
      name: "latest",
      context: data[PROMPT_PAYLOAD_KEY.context],
      variables: data[PROMPT_PAYLOAD_KEY.variables].map(({ key, value }) => ({ name: key, value })),
      messages: data[PROMPT_PAYLOAD_KEY.messages],
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
    type: data[PROMPT_PAYLOAD_KEY.type],
    context: data[PROMPT_PAYLOAD_KEY.context],
    variables: data[PROMPT_PAYLOAD_KEY.variables].map(({ key, value }) => ({ name: key, value })),
    messages: data[PROMPT_PAYLOAD_KEY.messages],
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

      },
      suggested_models: [
        data[PROMPT_PAYLOAD_KEY.modelName]
      ]
    }
  };
}

export const versionDetailDataToState = (data, currentPrompt) => {
  return {
    ...currentPrompt,
    [PROMPT_PAYLOAD_KEY.type]: data.type || ChatBoxMode.Chat,
    [PROMPT_PAYLOAD_KEY.tags]: data.tags || [],
    [PROMPT_PAYLOAD_KEY.context]: data.prompt || '',
    [PROMPT_PAYLOAD_KEY.messages]: data.messages || [],
    [PROMPT_PAYLOAD_KEY.variables]: data.variables || [],
    [PROMPT_PAYLOAD_KEY.modelName]: data.model_settings?.model_name,
    [PROMPT_PAYLOAD_KEY.temperature]: data.model_settings?.temperature,
    [PROMPT_PAYLOAD_KEY.maxTokens]: data.model_settings?.max_tokens,
    [PROMPT_PAYLOAD_KEY.topP]: data.model_settings?.top_p,
    [PROMPT_PAYLOAD_KEY.topK]: data.model_settings?.top_k,
  };
}