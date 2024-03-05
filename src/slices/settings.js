import { ProjectIdStorageKey, ProjectNameStorageKey } from '@/common/constants';
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
        id: localStorage.getItem(ProjectIdStorageKey) ? parseInt(localStorage.getItem(ProjectIdStorageKey)) : null,
        name: localStorage.getItem(ProjectNameStorageKey),
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
          localStorage.setItem(ProjectIdStorageKey, payload?.id);
          localStorage.setItem(ProjectNameStorageKey, payload?.name);
        }
    },
})

export const {name, actions} = settingsSlice
export default settingsSlice.reducer
