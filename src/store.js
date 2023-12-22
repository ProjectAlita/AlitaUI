import { configureStore } from '@reduxjs/toolkit';
import {
  middleware as alitaMiddleware,
  reducer as alitaReducer,
  reducerPath as alitaReducerPath
} from "@/api/alitaApi";
import MockReducer, { name as mockReducerName } from "./slices/mock";
import PromptReducer, { name as promptReducerName } from "./slices/prompts";
import SettingsReducer, { name as settingsReducerName } from "./slices/settings";
import UserReducer, { name as userReducerName } from "./slices/user";
import SearchReducer, { name as searchReducerName } from "./slices/search";

const Store = configureStore({
    reducer: {
        [alitaReducerPath]: alitaReducer,
        [mockReducerName]: MockReducer,
        [promptReducerName]: PromptReducer,
        [settingsReducerName]: SettingsReducer,
        [userReducerName]: UserReducer,
        [searchReducerName]: SearchReducer,
      },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat([alitaMiddleware]),
})

export default Store
