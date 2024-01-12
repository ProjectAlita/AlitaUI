const RouteDefinitions = {
  Prompts: '/prompts',
  PromptsWithTab: '/prompts/:tab',
  ViewPrompt: '/prompts/:tab/:promptId',

  Collections: '/collections',
  CollectionsWithTab: '/collections/:tab',
  CollectionDetail: '/collections/:tab/:collectionId',
  CollectionPromptDetail: '/collections/:tab/:collectionId/prompts/:promptId',

  DataSources: '/datasources',

  MyLibrary: '/my-library',
  MyLibraryWithTab: '/my-library/:tab',
  CreatePrompt: '/my-library/prompts/create',
  EditPrompt: '/my-library/prompts/:promptId',
  CreateCollection: '/my-library/collections/create',        
  EditCollection: '/my-library/collections/edit/:collectionId',
  MyLibraryCollectionDetail: '/my-library/collections/:collectionId',
  MyLibraryCollectionPromptDetail: '/my-library/collections/:collectionId/prompts/:promptId',

  ModerationSpace: '/moderation-space',
  ModerationSpacePrompt: '/moderation-space/prompts/:promptId',

  UserPublic: '/user-public',
  UserPublicWithTab: '/user-public/:tab',
  UserPublicPrompts: '/user-public/prompts/:promptId',
  UserPublicCollectionDetail: '/user-public/collections/:collectionId',
  UserPublicCollectionPromptDetail: '/user-public/collections/:collectionId/prompts/:promptId',
  
  Profile: '/profile',
  Settings: '/settings',
}

export const PathSessionMap = {
  [RouteDefinitions.UserPublic]: 'Prompts',
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