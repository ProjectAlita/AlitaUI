const RouteDefinitions = {
  Prompts: '/prompts',
  PromptsWithTab: '/prompts/:tab',
  ViewPrompt: '/prompts/:tab/:promptId',
  ViewPromptVersion: '/prompts/:tab/:promptId/:version',
  Collections: '/collections',
  CollectionsWithTab: '/collections/:tab',
  CollectionDetail: '/collections/:tab/:collectionId',
  CollectionPromptDetail: '/collections/:tab/:collectionId/prompts/:promptId',
  DataSources: '/datasources',
  MyLibrary: '/my-library',
  MyLibraryWithTab: '/my-library/:tab',
  CreatePrompt: '/my-library/prompts/create',
  CreateCollection: '/my-library/collections/create',        
  EditCollection: '/my-library/collections/edit/:collectionId',
  EditPrompt: '/my-library/prompts/:promptId',
  EditPromptVersion: '/my-library/prompts/:promptId/:version',
  MyLibraryCollectionDetail: '/my-library/collections/:collectionId',
  MyLibraryCollectionPromptDetail: '/my-library/collections/:collectionId/prompts/:promptId',
  MyLibraryCollectionPromptVersionDetail: '/my-library/collections/:collectionId/prompts/:promptId/:version',
  ModerationSpace: '/moderation-space',
  ModerationSpacePrompt: '/moderation-space/prompts/:promptId',
  Profile: '/profile',
  Settings: '/settings',
}

export const PathSessionMap = {
  [RouteDefinitions.Collections]: 'Collections',
  [RouteDefinitions.MyLibrary]: 'My libraries',
  [RouteDefinitions.Profile]: 'Profile',
  [RouteDefinitions.Settings]: 'Settings',
  [RouteDefinitions.Prompts]: 'Prompts',
  [RouteDefinitions.DataSources]: 'Datasources',
  [RouteDefinitions.Collections]: 'Collections',
  [RouteDefinitions.CreatePrompt]: 'New Prompt',
  [RouteDefinitions.CreateCollection]: 'New Collection',
};

export default RouteDefinitions;