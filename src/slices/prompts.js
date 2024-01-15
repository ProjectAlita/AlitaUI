import {
  ChatBoxMode,
  DEFAULT_MAX_TOKENS,
  DEFAULT_TEMPERATURE,
  DEFAULT_TOP_K,
  DEFAULT_TOP_P,
  PROMPT_PAYLOAD_KEY
} from '@/common/constants.js';
import { promptDataToState, versionDetailDataToState, removeDuplicateObjects } from '@/common/promptApiUtils.js';
import { createSlice } from '@reduxjs/toolkit';
import { alitaApi } from '../api/alitaApi.js';

export const initialCurrentPrompt = {
  id: undefined,
  [PROMPT_PAYLOAD_KEY.type]: ChatBoxMode.Chat,
  [PROMPT_PAYLOAD_KEY.name]: '',
  [PROMPT_PAYLOAD_KEY.description]: '',
  [PROMPT_PAYLOAD_KEY.tags]: [],
  [PROMPT_PAYLOAD_KEY.context]: '',
  [PROMPT_PAYLOAD_KEY.messages]: [],
  [PROMPT_PAYLOAD_KEY.variables]: [],
  [PROMPT_PAYLOAD_KEY.modelName]: '',
  [PROMPT_PAYLOAD_KEY.temperature]: DEFAULT_TEMPERATURE,
  [PROMPT_PAYLOAD_KEY.maxTokens]: DEFAULT_MAX_TOKENS,
  [PROMPT_PAYLOAD_KEY.topP]: DEFAULT_TOP_P,
  [PROMPT_PAYLOAD_KEY.topK]: DEFAULT_TOP_K,
  [PROMPT_PAYLOAD_KEY.integrationUid]: '',
}

const promptSlice = createSlice({
  name: 'prompts',
  initialState: {
    list: [],
    filteredList: [],
    tagList: [],
    tagsOnVisibleCards: [],
    tagWidthOnCard: {},
    totalTags: 0,
    currentCardWidth: 0,
    currentPrompt: { ...initialCurrentPrompt },
    currentPromptSnapshot: {},
    versions: [],
    currentVersionFromDetail: '',
    validationError: {}
  },
  reducers: {
    clearFilteredPromptList: (state) => {
      state.filteredList = [];
    },
    filterByTag: (state, action) => {
      const selectedTags = action.payload ?? [];
      if (selectedTags.length < 1) {
        state.filteredList = state.list;
        return
      }
      state.filteredList = state.list.filter(item =>
        item.tags.some(({ id }) =>
          selectedTags.includes(id)
        )
      );
    },
    resetCurrentPromptData: (state) => {
      state.currentPrompt = { ...initialCurrentPrompt };
      state.versions = [];
      state.currentVersionFromDetail = '';
      state.currentPromptSnapshot = { ...initialCurrentPrompt };
    },
    resetCurrentPromptDataSnapshot: (state) => {
      state.currentPromptSnapshot = { ...initialCurrentPrompt };
    },
    setCurrentPromptDataSnapshot: (state, action) => {
      const { payload } = action;
      state.currentPromptSnapshot = { ...state.currentPromptSnapshot, ...payload };
    },
    useCurrentPromptDataSnapshot: (state) => {
      state.currentPrompt = { ...state.currentPromptSnapshot };
    },
    setCurrentPromptData: (state, action) => {
      const { data } = action.payload;
      if (!data) return;
      state.currentPrompt = data;
    },
    updateCurrentPromptData: (state, action) => {
      const { key, data } = action.payload;
      if (!key) return;
      state.currentPrompt[key] = data;
    },
    batchUpdateCurrentPromptData: (state, action) => {
      const { payload } = action;
      if (!payload) return;
      state.currentPrompt = { ...state.currentPrompt, ...payload };
    },
    updateSpecificVariable: (state, action) => {
      const { key, data, updateKey } = action.payload;
      if (!key) return;
      const specificVariableIndex = state.currentPrompt[key].findIndex(variable => variable.key === updateKey)
      state.currentPrompt[key][specificVariableIndex].value = data;
    },
    setValidationError: (state, action) => {
      state.validationError = action.payload;
    },
    resetVariable: (state, action) => {
      const { key } = action.payload;
      if (key !== PROMPT_PAYLOAD_KEY.variables) return;
      state.currentPrompt[PROMPT_PAYLOAD_KEY.variables] = [];
    },
    updateTagWidthOnCard: (state, action) => {
      const { tagWidthOnCard = {} } = action.payload;
      state.tagWidthOnCard = { ...tagWidthOnCard, ...state.tagWidthOnCard };
    },
    updateCardWidth: (state, action) => {
      const { cardWidth = 0 } = action.payload;
      state.currentCardWidth = cardWidth;
    },
    setIsLikedToThisPrompt: (state, action) => {
      const { promptId, is_liked, adjustLikes, shouldRemoveIt } = action.payload;
      if (!shouldRemoveIt) {
        state.filteredList = state.filteredList.map((prompt) => {
          if (prompt.id === promptId) {
            prompt.is_liked = is_liked;
            if (adjustLikes) {
              prompt.likes += is_liked ? 1 : -1;
            }
          }
          return prompt;
        });
        if (state.currentPrompt.id == promptId) {
          state.currentPrompt.is_liked = is_liked;
          state.currentPromptSnapshot.is_liked = is_liked;
          if (adjustLikes) {
            state.currentPrompt.likes += is_liked ? 1 : -1;
            state.currentPromptSnapshot.likes += is_liked ? 1 : -1;
          }
        }
      } else {
        state.filteredList = state.filteredList.filter((prompt) => prompt.id !== promptId);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(alitaApi.endpoints.promptList.matchFulfilled, (state, { payload }) => {
        const { rows = [] } = payload;
        const newlyFetchedTags = rows.reduce((newlyFetchedTagsList, promptEntry) => {
          promptEntry.tags.forEach(tag => {
            newlyFetchedTagsList.push(tag)
          })
          return newlyFetchedTagsList;
        }, [])
        if (!payload.isLoadMore) {
          state.list = rows
          state.filteredList = rows
        } else {
          state.list = state.list.concat(rows)
          state.filteredList = state.filteredList.concat(rows)
        }
        state.tagsOnVisibleCards = [...state.tagsOnVisibleCards, ...newlyFetchedTags];
      });
    builder
      .addMatcher(alitaApi.endpoints.tagList.matchFulfilled, (state, { payload }) => {
        const { rows, total, isLoadMore, skipTotal = false } = payload;
        if(isLoadMore || skipTotal){
          state.tagList = removeDuplicateObjects([...state.tagList, ...rows])
        }else{
          state.tagList = removeDuplicateObjects(payload.rows)
        }
        if(skipTotal) return;
        state.totalTags = total;
      });
    builder
      .addMatcher(alitaApi.endpoints.getPrompt.matchFulfilled, (state, { payload }) => {
        state.currentPrompt = promptDataToState(payload);
        state.currentPromptSnapshot = { ...state.currentPrompt };
        state.versions = payload.versions;
        state.currentVersionFromDetail = payload.version_details.name;
      });
    builder
      .addMatcher(alitaApi.endpoints.getVersionDetail.matchFulfilled, (state, { payload }) => {
        state.currentPrompt = versionDetailDataToState(payload, state.currentPrompt);
        state.currentPromptSnapshot = { ...state.currentPrompt };
      });
    builder
      .addMatcher(alitaApi.endpoints.publicPromptList.matchFulfilled, (state, { payload }) => {
        const { rows = [] } = payload;
        const newlyFetchedTags = rows.reduce((newlyFetchedTagsList, promptEntry) => {
          promptEntry.tags.forEach(tag => {
            newlyFetchedTagsList.push(tag)
          })
          return newlyFetchedTagsList;
        }, [])
        if (!payload.isLoadMore) {
          state.list = rows
          state.filteredList = rows
        } else {
          state.list = state.list.concat(rows)
          state.filteredList = state.filteredList.concat(rows)
        }
        state.tagsOnVisibleCards = [...state.tagsOnVisibleCards, ...newlyFetchedTags];
      });
    builder
      .addMatcher(alitaApi.endpoints.getPublicPrompt.matchFulfilled, (state, { payload }) => {
        state.currentPrompt = promptDataToState(payload);
        state.currentPromptSnapshot = { ...state.currentPrompt };
        state.versions = payload.versions;
        state.currentVersionFromDetail = payload.version_details.name;
      });

  },
})


export const { name, actions } = promptSlice
export default promptSlice.reducer
