const RouteDefinitions = {
  Prompts: '/prompts',
  MyLibrary: '/my-library',
  Collections: '/collections',
  CollectionDetail: '/collection/:collectionId',
  DataSources: '/datasources',
  CreatePrompt: '/prompt/create',
  CreateConnection: '/collection/create',
  EditPrompt: '/prompt/:promptId',
  EditPromptVersion: '/prompt/:promptId/:version',
  Profile: '/profile',
  Settings: '/settings',
}

export const PathSessionMap = {
  [RouteDefinitions.Collections]: 'Collections',
  [RouteDefinitions.MyLibrary]: 'My Library',
  [RouteDefinitions.Profile]: 'Profile',
  [RouteDefinitions.Prompts]: 'Prompts',
};

export default RouteDefinitions;