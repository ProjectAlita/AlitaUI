import { PROMPT_PAYLOAD_KEY } from "./constants";

export const promptDataToState = (data) => {
  return {
    id: data.id,
    [PROMPT_PAYLOAD_KEY.integrationUid]: data.integration_uid || '',
    [PROMPT_PAYLOAD_KEY.name]: data.name || '',
    [PROMPT_PAYLOAD_KEY.description]: data.description || '',
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

export const stateDataToPrompt = (data) => {
  return {
    id: data.id,
    embedding: '0',
    is_active_input: true,
    integration_uid: data[PROMPT_PAYLOAD_KEY.integrationUid],
    name: data[PROMPT_PAYLOAD_KEY.name],
    description: data[PROMPT_PAYLOAD_KEY.description],
    tags: data[PROMPT_PAYLOAD_KEY.tags],
    prompt: data[PROMPT_PAYLOAD_KEY.context],
    messages: data[PROMPT_PAYLOAD_KEY.messages],
    variables: data[PROMPT_PAYLOAD_KEY.variables],
    model_settings: {
      model_name: data[PROMPT_PAYLOAD_KEY.modelName],
      temperature: data[PROMPT_PAYLOAD_KEY.temperature],
      max_tokens: data[PROMPT_PAYLOAD_KEY.maxTokens],
      top_p: data[PROMPT_PAYLOAD_KEY.topP],
      top_k: data[PROMPT_PAYLOAD_KEY.topK],
    }
  };
}