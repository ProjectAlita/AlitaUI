import {createSlice} from '@reduxjs/toolkit'
import {alitaApi} from "../api/alitaApi.js";


const userSlice = createSlice({
    name: 'user',
    initialState: {
        id: null,
        email: null,
        last_login: null,
        name: null
    },
    reducers: {
        logout: (state) => {
            state.id = null
            state.email = null
            state.last_login = null
            state.name = null
        },
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(alitaApi.endpoints.userDetails.matchFulfilled,(state, {payload}) => {
                    state.id = payload.id
                    state.email = payload.email
                    state.last_login = payload.last_login
                    state.name = payload.name
                    state.personal_project_id = payload.personal_project_id
                }
            )
    },
})

export const logout = () => async dispatch => {
    await dispatch(userSlice.actions.logout())
    await dispatch(alitaApi.util.resetApiState())
}

export const {name} = userSlice
export default userSlice.reducer
