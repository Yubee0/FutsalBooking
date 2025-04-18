import {createSlice} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
  token: null,
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const {token, user} = action.payload;
      state.token = token;
      state.user = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      };
      state.isAuthenticated = true;
      AsyncStorage.setItem('token', token);
    },
    logout: state => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      AsyncStorage.removeItem('token');
    },
    updateUser: (state, action) => {
      if (state.user) {
        state.user = {
          ...state.user,
          ...action.payload,
        };
      }
    },
  },
});

export const {setCredentials, logout, updateUser} = authSlice.actions;

export default authSlice.reducer;
