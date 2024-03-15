import {createSlice} from '@reduxjs/toolkit'
import {alitaApi} from "../api/alitaApi.js";
import { ProjectIdStorageKey, ProjectNameStorageKey } from '@/common/constants';

const initialState = () => ({
  id: null,
  email: null,
  last_login: null,
  name: null,
  permissions: undefined
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
      .addMatcher(alitaApi.endpoints.authorDetails.matchFulfilled, (state, {payload}) => {
          Object.assign(state, payload);
          if (!localStorage.getItem(ProjectIdStorageKey)) {
            localStorage.setItem(ProjectIdStorageKey, payload.personal_project_id);
            localStorage.setItem(ProjectNameStorageKey, 'Private');
          }
        }
      )
      .addMatcher(
        alitaApi.endpoints.publicPermissionList.matchFulfilled, (state, {payload}) => {
          state.publicPermissions = payload
        }
      )
      .addMatcher(
        alitaApi.endpoints.permissionList.matchFulfilled, (state, {payload}) => {
          state.permissions = payload
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
