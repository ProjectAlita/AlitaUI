const RouteDefinitions = {
  Prompts: '/prompts',
  MyLibrary: '/my-library',
  MyLibraryWithTab: '/my-library/:tab',
  Collections: '/collections',
  CreateCollection: '/my-library/collections/create',              
  CollectionDetail: '/collections/:collectionId',
  MyLibraryCollectionDetail: '/my-library/collections/:collectionId',
  DataSources: '/datasources',
  CreatePrompt: '/my-library/prompts/create',
  ViewPrompt: '/prompts/:promptId',
  ViewPromptVersion: '/prompts/:promptId/:version',
  EditPrompt: '/my-library/prompts/:promptId',
  EditPromptVersion: '/my-library/prompts/:promptId/:version',
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