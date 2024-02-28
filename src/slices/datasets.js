/* eslint-disable no-unused-vars */
import { alitaApi } from '@/api/alitaApi';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  list: [],
}
const datasetSlice = createSlice({
  name: 'datasets',
  initialState: {
    ...initialState
  },
  reducers: {
    reset: (state) => {
      state.list = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(alitaApi.endpoints.datasourceDetails.matchFulfilled, (state, { payload }) => {
        state.list = payload?.version_details?.datasets
      });
    builder
      .addMatcher(alitaApi.endpoints.datasetCreate.matchFulfilled, (state, { payload }) => {
        const { datasource_version, ...newDataset } = payload?.entity || {}
        state.list = [...state.list, newDataset]
      });
    builder
      .addMatcher(alitaApi.endpoints.datasetUpdate.matchFulfilled, (state, { payload }) => {
        const { datasource_version, ...newDataset } = payload || {}
        state.list.map(item => item.id === payload.id ? {...newDataset} : item)
      });
    builder
      .addMatcher(alitaApi.endpoints.datasetDelete.matchFulfilled, (state, action) => {
        const datasetId = action?.meta?.arg?.originalArgs?.datasetId
        if (datasetId !== undefined) {
          state.list = state.list.filter(item => item.id !== datasetId)
        }
      });
  }
});


export const { name, actions } = datasetSlice
export default datasetSlice.reducer