import { createSlice } from '@reduxjs/toolkit';
import { alitaApi } from '../api/alitaApi';

const searchSlice = createSlice({
    name: 'search',
    initialState: {
      query: '',
      searchDone: false,
    },
    reducers: {
        setQuery: (state, action) => {
          const { payload } = action;
          state.query = payload;
          state.searchDone = false;
        },
        resetQuery: (state) => {
          state.query = '';
          state.searchDone = false;
        },
    },
    extraReducers: (builder) => {
      builder
        .addMatcher(alitaApi.endpoints.promptList.matchFulfilled, (state) => {
          if (state.query) {
            state.searchDone = true;
          }
        });
      
      builder
        .addMatcher(alitaApi.endpoints.publicPromptList.matchFulfilled, (state) => {
          if (state.query) {
            state.searchDone = true;
          }
        });
      
        builder
        .addMatcher(alitaApi.endpoints.collectionList.matchFulfilled, (state) => {
          if (state.query) {
            state.searchDone = true;
          }
        });
    },
})

export const {name, actions} = searchSlice
export default searchSlice.reducer
