import { createSlice } from '@reduxjs/toolkit';

const settingsSlice = createSlice({
    name: 'settings',
    initialState: {
      mode: localStorage.getItem('mode') || 'dark',
      navBlocker: {
        isBlockNav: false,
        isResetApiState: false,
      },
      project: {
        id: null,
        name: null
      },
    },
    reducers: {
        switchMode: (state) => {
          state.mode = state.mode === 'light' ? 'dark' : 'light';
          localStorage.setItem('mode', state.mode);
        },
        setBlockNav: (state, { payload }) => {
          state.navBlocker.isBlockNav = payload;
        },
        setIsResetApiState: (state, { payload }) => {
          state.navBlocker.isResetApiState = payload;
        },
        setProject: (state, { payload }) => {
          state.project = payload
        }
    },
})

export const {name, actions} = settingsSlice
export default settingsSlice.reducer
