import { configureStore } from '@reduxjs/toolkit';
import {
  middleware as alitaMiddleware,
  reducer as alitaReducer,
  reducerPath as alitaReducerPath
} from "@/api/alitaApi";
import AuthorReducer, { name as authorReducerName } from "./slices/trendingAuthors";
import PromptReducer, { name as promptReducerName } from "./slices/prompts";
import SettingsReducer, { name as settingsReducerName } from "./slices/settings";
import UserReducer, { name as userReducerName } from "./slices/user";
import SearchReducer, { name as searchReducerName } from "./slices/search";
import CollectionsReducer, { name as collectionsReducerName } from "./slices/collections";
import DatasourcesReducer, { name as datasourcesReducerName } from "./slices/datasources";
import DatasetsReducer, { name as datasetsReducerName } from "./slices/datasets";

const Store = configureStore({
    reducer: {
        [alitaReducerPath]: alitaReducer,
        [authorReducerName]: AuthorReducer,
        [promptReducerName]: PromptReducer,
        [settingsReducerName]: SettingsReducer,
        [userReducerName]: UserReducer,
        [searchReducerName]: SearchReducer,
        [collectionsReducerName]: CollectionsReducer,
        [datasourcesReducerName]: DatasourcesReducer,
        [datasetsReducerName]: DatasetsReducer,
      },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat([alitaMiddleware]),
})

export default Store
