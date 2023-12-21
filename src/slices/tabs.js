import { createSlice } from '@reduxjs/toolkit';

const tabsSlice = createSlice({
    name: 'tabs',
    initialState: {
      counts: {},
    },
    reducers: {
        setCount: (state, {payload}) => {
          const {countKey, count} = payload;
          state.counts[countKey] = count;
        },
        resetCounts: (state) => {
          state.counts = {};
        },
    },
})

export const {name, actions} = tabsSlice
export default tabsSlice.reducer
