import { createSlice } from '@reduxjs/toolkit';

const initApplication = {
  name: '',
  description: '',
  embedding_model: {},
  storage: '',
  tags: [],
}
const applicationsSlice = createSlice({
  name: 'applications',
  initialState: {
    currentApplication: {
      ...initApplication,
    },
    queryParams: {},
  },
  reducers: {
    updateCurrentApplication: (state, action) => {
      const { key, value } = action.payload;
      state.currentApplication[key] = value;
    },
    resetCurrentApplication: (state) => {
      state.currentApplication = { ...initApplication };
    },
    setQueryParams: (state, action) => {
      const { payload } = action;
      state.queryParams = payload;
    },
    resetQueryParams: (state) => {
      state.queryParams = {};
    },
  }
})

export const { name, actions } = applicationsSlice
export default applicationsSlice.reducer
