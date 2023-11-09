import { createSlice } from '@reduxjs/toolkit';
import { alitaApi } from "../api/alitaApi.js";
import { PROMPT_PAYLOAD_KEY } from "@/pages/PromptDetail/constants.js"


const promptSlice = createSlice({
    name: 'prompts',
    initialState: {
        list: [],
        filteredList: [],
        tagList: [],
        currentPromptData: {
            [PROMPT_PAYLOAD_KEY.name]: null,
            [PROMPT_PAYLOAD_KEY.description]: null,
            [PROMPT_PAYLOAD_KEY.tags]: null,
            [PROMPT_PAYLOAD_KEY.context]: null,
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
                item.tags.some(({tag}) => 
                    selectedTags.includes(tag)
                )
            );
        },
        updateCurrentPromptData: (state, action) => {
            const { key, data } = action.payload;
            if(!key) return;
            state.currentPromptData[key] = data;
        }
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(alitaApi.endpoints.promptList.matchFulfilled,(state, {payload}) => {
                    state.list = payload
                    state.filteredList = payload
                }
            )
        builder
            .addMatcher(alitaApi.endpoints.tagList.matchFulfilled,(state, {payload}) => {
                    state.tagList = payload
                }
            )
    },
})


export const {name, actions} = promptSlice
export default promptSlice.reducer
