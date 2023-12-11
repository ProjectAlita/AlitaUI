const RouteDefinitions = {
  Prompts: '/prompts',
  MyLibrary: '/my-library',
  Collections: '/collections',
  CreateCollection: '/collection/create',              
  CollectionDetail: '/collection/:collectionId',
  DataSources: '/datasources',
  CreatePrompt: '/prompt/create',
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