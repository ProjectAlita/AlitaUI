import { DEV, VITE_BASE_URI } from "@/common/constants";

const RouteDefinitions = {
  Prompts: '/prompts',
  PromptsWithTab: '/prompts/:tab',
  ViewPrompt: '/prompts/:tab/:promptId',

  Collections: '/collections',
  CollectionsWithTab: '/collections/:tab',
  CollectionDetail: '/collections/:tab/:collectionId',
  CollectionPromptDetail: '/collections/:tab/:collectionId/prompts/:promptId',

  DataSources: '/datasources',
  DataSourcesWithTab: '/datasources/:tab',
  CreateDatasource: '/datasources/create',

  MyLibrary: '/my-library',
  MyLibraryWithTab: '/my-library/:tab',
  CreatePrompt: '/my-library/prompts/create',
  EditPrompt: '/my-library/prompts/:promptId',
  CreateCollection: '/my-library/collections/create',        
  EditCollection: '/my-library/collections/edit/:collectionId',
  MyLibraryCollectionDetail: '/my-library/collections/:collectionId',
  MyLibraryCollectionPromptDetail: '/my-library/collections/:collectionId/prompts/:promptId',
  MyDatasourceDetails: '/my-library/datasources/:datasourceId',

  ModerationSpace: '/moderation-space',
  ModerationSpaceWithTab: '/moderation-space/:tab',
  ModerationSpacePrompt: '/moderation-space/prompts/:promptId',
  ModerationSpaceCollection: '/moderation-space/collections/:collectionId',

  UserPublic: '/user-public',
  UserPublicWithTab: '/user-public/:tab',
  UserPublicPrompts: '/user-public/prompts/:promptId',
  UserPublicCollectionDetail: '/user-public/collections/:collectionId',
  UserPublicCollectionPromptDetail: '/user-public/collections/:collectionId/prompts/:promptId',
  
  Settings: '/settings',
  SettingsWithTab: '/settings/:tab',
  CreatePersonalToken: '/settings/create-personal-token',
  CreateDeployment: '/settings/create-deployment',
  EditDeployment: '/settings/edit-deployment/:uid',
  ModeSwitch: '/mode-switch',

  NotificationCenter: '/notification-center',
}

export const PathSessionMap = {
  [RouteDefinitions.UserPublic]: 'Prompts',
  [RouteDefinitions.Collections]: 'Collections',
  [RouteDefinitions.MyLibrary]: 'My libraries',
  [RouteDefinitions.Profile]: 'Profile',
  [RouteDefinitions.Settings]: 'Settings',
  [RouteDefinitions.CreatePersonalToken]: 'New personal token',
  [RouteDefinitions.CreateDeployment]: 'New Deployment',
  [RouteDefinitions.ModeSwitch]: 'ModeSwitch',
  [RouteDefinitions.Prompts]: 'Prompts',
  [RouteDefinitions.DataSources]: 'Datasources',
  [RouteDefinitions.Collections]: 'Collections',
  [RouteDefinitions.CreatePrompt]: 'New Prompt',
  [RouteDefinitions.CreateCollection]: 'New Collection',
};

export const getBasename = () => {
  return DEV ? '' : VITE_BASE_URI;
}

export default RouteDefinitions;