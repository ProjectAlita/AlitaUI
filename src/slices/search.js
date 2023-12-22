import { createSlice } from '@reduxjs/toolkit';

const searchSlice = createSlice({
    name: 'search',
    initialState: {
      query: '',
    },
    reducers: {
        setQuery: (state, action) => {
          const { payload } = action;
          state.query = payload;
        },
        resetQuery: (state) => {
          state.query = '';
        },
    },
})

export const {name, actions} = searchSlice
export default searchSlice.reducer
