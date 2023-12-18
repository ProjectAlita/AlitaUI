const RouteDefinitions = {
  Prompts: '/prompts',
  PromptsWithTab: '/prompts/:tab',
  ViewPrompt: '/prompts/:tab/:promptId',
  ViewPromptVersion: '/prompts/:tab/:promptId/:version',
  Collections: '/collections',
  CollectionDetail: '/collections/:collectionId',
  CollectionPromptDetail: '/collections/:collectionId/prompts/:promptId',
  DataSources: '/datasources',
  MyLibrary: '/my-library',
  MyLibraryWithTab: '/my-library/:tab',
  CreatePrompt: '/my-library/prompts/create',
  CreateCollection: '/my-library/collections/create',              
  EditPrompt: '/my-library/prompts/:promptId',
  EditPromptVersion: '/my-library/prompts/:promptId/:version',
  MyLibraryCollectionDetail: '/my-library/collections/:collectionId',
  MyLibraryCollectionPromptDetail: '/my-library/collections/:collectionId/prompts/:promptId',
  MyLibraryCollectionPromptVersionDetail: '/my-library/collections/:collectionId/prompts/:promptId/:version',
  Profile: '/profile',
  Settings: '/settings',
}

export const PathSessionMap = {
  [RouteDefinitions.Collections]: 'Collections',
  [RouteDefinitions.MyLibrary]: 'My library',
  [RouteDefinitions.Profile]: 'Profile',
  [RouteDefinitions.Settings]: 'Settings',
  [RouteDefinitions.Prompts]: 'Prompts',
  [RouteDefinitions.DataSources]: 'Datasources',
  [RouteDefinitions.Collections]: 'Collections',
  [RouteDefinitions.CreatePrompt]: 'New Prompt',
  [RouteDefinitions.CreateCollection]: 'New Collection',
};

export default RouteDefinitions;