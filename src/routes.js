const RouteDefinitions = {
  Prompts: '/prompts',
  PromptsWithTab: '/prompts/:tab',
  MyLibrary: '/my-library',
  MyLibraryWithTab: '/my-library/:tab',
  Collections: '/collections',
  CreateCollection: '/my-library/collections/create',              
  CollectionDetail: '/collections/:collectionId',
  MyLibraryCollectionDetail: '/my-library/collections/:collectionId',
  DataSources: '/datasources',
  CreatePrompt: '/my-library/prompts/create',
  ViewPrompt: '/prompts/:tab/:promptId',
  ViewPromptVersion: '/prompts/:tab/:promptId/:version',
  EditPrompt: '/my-library/prompts/:promptId',
  EditPromptVersion: '/my-library/prompts/:promptId/:version',
  Profile: '/profile',
  Settings: '/settings',
}

export const PathSessionMap = {
  [RouteDefinitions.Collections]: 'Collections',
  [RouteDefinitions.MyLibrary]: 'My library',
  [RouteDefinitions.Profile]: 'Profile',
  [RouteDefinitions.Prompts]: 'Prompts',
  [RouteDefinitions.DataSources]: 'Datasources',
  [RouteDefinitions.Collections]: 'Collections',
  [RouteDefinitions.CreatePrompt]: 'New Prompt',
  [RouteDefinitions.CreateCollection]: 'New Collection',
};

export default RouteDefinitions;