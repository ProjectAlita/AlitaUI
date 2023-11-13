import {
    DEFAULT_MAX_TOKENS,
    DEFAULT_TEMPERATURE,
    DEFAULT_TOP_K,
    DEFAULT_TOP_P,
    PROMPT_PAYLOAD_KEY
} from "@/common/constants.js";
import { createSlice } from '@reduxjs/toolkit';
import { alitaApi } from "../api/alitaApi.js";

const promptSlice = createSlice({
    name: 'prompts',
    initialState: {
        list: [],
        filteredList: [],
        tagList: [],
        currentPrompt: {
            id: undefined,
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
    },
    reducers: {
        filterByTag: (state, action) => {
            const selectedTags = action.payload ?? [];
            if (selectedTags.length < 1) {
                state.filteredList = state.list;
                return
            }
            state.filteredList = state.list.filter(item =>
                item.tags.some(({ tag }) =>
                    selectedTags.includes(tag)
                )
            );
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
        updateSpecificVariable: (state, action) => {
            const { key, data, updateKey } = action.payload;
            if (!key) return;
            const specificVariableIndex = state.currentPrompt[key].findIndex(variable => variable.key === updateKey)
            state.currentPrompt[key][specificVariableIndex].value = data;
        },
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(alitaApi.endpoints.promptList.matchFulfilled, (state, { payload }) => {
                state.list = payload
                state.filteredList = payload
            }
            )
        builder
            .addMatcher(alitaApi.endpoints.tagList.matchFulfilled, (state, { payload }) => {
                state.tagList = payload
            }
            )
        builder
            .addMatcher(alitaApi.endpoints.getPrompt.matchFulfilled, (state, { payload }) => {
                state.currentPrompt = payload
            }
            )
    },
})


export const { name, actions } = promptSlice
export default promptSlice.reducer
