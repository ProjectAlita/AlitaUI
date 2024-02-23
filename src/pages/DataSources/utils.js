export const getFilteredModels = (integration, capabilities) => {
  return (integration.settings.models || [])
    .filter(modelItem => {
      return capabilities.some(capability => modelItem.capabilities[capability]);
    })
    .map(({ name: embeddingModelName, id }) => ({
      label: embeddingModelName,
      value: id,
      group: integration.uid,
      group_name: integration.name,
      config_name: integration.config.name,
    }));
}

export const getIntegrationOptions = (integrations, capabilities) => integrations.reduce((accumulator, integration) => {
  const filteredModels = getFilteredModels(integration, capabilities);
  if (filteredModels.length > 0) {
    accumulator[integration.config.name] = filteredModels;
  }
  return accumulator;
}, {});