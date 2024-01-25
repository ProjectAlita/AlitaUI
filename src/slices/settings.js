import { PAGE_SIZE } from '@/common/constants';
import { createSlice } from '@reduxjs/toolkit';

const settingsSlice = createSlice({
    name: 'settings',
    initialState: {
      mode: localStorage.getItem('mode') || 'dark',
      navBlocker: {
        isBlockNav: false,
        isResetApiState: false,
      },
      isTableView: false,
      pageSize: PAGE_SIZE
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
        setIsTableView: (state, { payload }) => {
          state.isTableView = payload
        },
        setPageSize: (state, { payload }) => {
          state.pageSize = payload
        }
    },
})

export const {name, actions} = settingsSlice
export default settingsSlice.reducer
