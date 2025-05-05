import {createSlice} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {loginUser, signupUser} from './authThunk';

const initialState = {
  token: null,
  user: null,
  fcmToken: null,
  firebaseId: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const {token, user, fcmToken, firebaseId} = action.payload;
      state.token = token;
      state.user = user;
      state.fcmToken = fcmToken;
      state.firebaseId = firebaseId;
      state.isAuthenticated = true;
      AsyncStorage.setItem('token', token);
      AsyncStorage.setItem('firebaseId', firebaseId);
    },
    logout: state => {
      state.token = null;
      state.user = null;
      state.fcmToken = null;
      state.firebaseId = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      AsyncStorage.multiRemove(['token', 'firebaseId']);
    },
    updateUser: (state, action) => {
      if (state.user) {
        state.user = {...state.user, ...action.payload};
      }
    },
    setFcmToken: (state, action) => {
      state.fcmToken = action.payload;
      AsyncStorage.setItem('fcmToken', action.payload);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loginUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.fcmToken = action.payload.fcmToken;
        state.firebaseId = action.payload.firebaseId;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(signupUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, state => {
        state.loading = false;
        state.error = null;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {setCredentials, logout, updateUser, setFcmToken} =
  authSlice.actions;
export default authSlice.reducer;
