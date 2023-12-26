import { createSlice } from '@reduxjs/toolkit'
import { alitaApi } from "../api/alitaApi.js";

const initialState = () => ({
  id: null,
  email: null,
  last_login: null,
  name: null,
  permissions: []
})

const userSlice = createSlice({
  name: 'user',
  initialState: initialState(),
  reducers: {
    logout: (state) => {
      Object.assign(state, initialState())
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(alitaApi.endpoints.authorDetails.matchFulfilled, (state, { payload }) => {
        // state.id = payload.id;
        // state.email = payload.email;
        // state.last_login = payload.last_login;
        // state.name = payload.name;
        // state.personal_project_id = payload.personal_project_id;
        // state.avatar = payload.avatar;
        Object.assign(state, payload)
      }
      );
    builder.addMatcher(
      alitaApi.endpoints.permissionList.matchFulfilled, (state, { payload }) => {
        state.permissions = payload
      }
    );
  },
})

export const logout = () => async dispatch => {
  await dispatch(userSlice.actions.logout())
  await dispatch(alitaApi.util.resetApiState())
}

export const { name } = userSlice
export default userSlice.reducer
