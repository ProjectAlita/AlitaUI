import { createSlice } from '@reduxjs/toolkit';

const initDataSource = {
  name: '',
  description: '',
  tags: [],
  dataSets: [],
}
const datasourcesSlice = createSlice({
    name: 'datasources',
    initialState: {
      currentDataSource: {
        ...initDataSource,
      },
      queryParams: {},
    },
    reducers: {
        updateCurrentDataSource: (state, action) => {
          const { key, value } = action.payload;
          state.currentDataSource[key] = value;
        },
        updateCurrentDataSets: (state, action) => {
          const { index, key, value } = action.payload;
          const dataSet = state.currentDataSource.dataSets[index];
          if (dataSet) {
            dataSet[key] = value
          } else {
            state.currentDataSource.dataSets[index] = {
              key: value
            }
          }
        },
        resetCurrentDataSource: (state) => {
          state.currentDataSource = {};
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

export const {name, actions} = datasourcesSlice
export default datasourcesSlice.reducer
