import { createSlice } from '@reduxjs/toolkit';

const collectionsSlice = createSlice({
    name: 'collections',
    initialState: {
      queryParams: {},
    },
    reducers: {
        setQueryParams: (state, action) => {
          const { payload } = action;
          state.queryParams = payload;
        },
        resetQueryParams: (state) => {
          state.queryParams = {};
        },
    }
})

export const {name, actions} = collectionsSlice
export default collectionsSlice.reducer
