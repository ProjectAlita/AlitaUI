import { createSlice } from '@reduxjs/toolkit';
import { mockApi } from "../api/mock.js";

const mockSlice = createSlice({
    name: 'mock',
    initialState: {
        trendingAuthorsList: [],
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(mockApi.endpoints.trendingAuthorsList.matchFulfilled,(state, {payload}) => {
                    state.trendingAuthorsList = payload
                }
            )
    },
})

export const {name} = mockSlice
export default mockSlice.reducer
