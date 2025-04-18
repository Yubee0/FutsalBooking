import {createSlice} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
  token: null,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    logout: state => {
      state.token = null;
      state.user = null;
      AsyncStorage.removeItem('token');
    },
  },
});

export const {setCredentials, logout} = authSlice.actions;
export default authSlice.reducer;
