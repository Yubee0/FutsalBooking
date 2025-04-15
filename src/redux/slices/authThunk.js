import {setCredentials, logout} from './authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from 'react-native-config';

export const loginUser = (email, password) => async dispatch => {
  try {
    const response = await fetch(`${Config.API_URL}/auth/login`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({email, password}),
    });

    const data = await response.json();

    if (response.ok) {
      await AsyncStorage.setItem('token', data.token);
      dispatch(setCredentials({token: data.token, user: data.user}));
    } else {
      throw new Error(data.message || 'Invalid credentials');
    }
  } catch (error) {
    throw new Error(error.message || 'Login failed');
  }
};

export const logoutUser = () => async dispatch => {
  await AsyncStorage.removeItem('token');
  dispatch(logout());
};
