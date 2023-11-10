import { createSlice } from '@reduxjs/toolkit';

const settingsSlice = createSlice({
    name: 'settings',
    initialState: {
      mode: localStorage.getItem('mode') || 'dark',
    },
    reducers: {
        switchMode: (state) => {
          state.mode = state.mode === 'light' ? 'dark' : 'light';
          localStorage.setItem('mode', state.mode);
        },
    },
})

export const {name, actions} = settingsSlice
export default settingsSlice.reducer
