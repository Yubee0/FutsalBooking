import {createAsyncThunk} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from 'react-native-config';
import {logout} from './authSlice';
import {showAlert} from '../../components/Alert';
import {AlertType} from '../../components/DropdownAlert';

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({email, password}, {rejectWithValue}) => {
    try {
      const fcmToken = await AsyncStorage.getItem('fcmToken');

      const response = await fetch(`${Config.API_URL}/auth/login`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          email,
          password,
          fcm_token: fcmToken,
        }),
      });
      console.log('Sending login request with:', {email, password, fcmToken});

      const text = await response.text();
      console.log(' Raw login response:', text);

      let data;
      try {
        data = JSON.parse(text);
      } catch (err) {
        console.error('JSON parse error:', err);
        return showAlert(AlertType.ERROR, text);
      }

      console.log('Login API Response:', data);

      if (!response.ok) {
        return rejectWithValue(data.message || 'Invalid credentials');
      }

      if (!data.token || !data.role || !data.firebaseid) {
        return rejectWithValue('Server response missing required fields');
      }

      await AsyncStorage.multiSet([
        ['token', data.token],
        ['firebaseId', data.firebaseid],
      ]);

      return {
        token: data.token,
        user: {
          email: data.email,
          role: data.role,
        },
        fcmToken,
        firebaseId: data.firebaseid,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const signupUser = createAsyncThunk(
  'auth/signupUser',
  async ({name, email, password, phone, role}, {rejectWithValue}) => {
    try {
      const response = await fetch(`${Config.API_URL}/auth/register`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({name, email, password, phone, role}),
      });

      const responseText = await response.text();

      if (responseText.startsWith('<!DOCTYPE html>')) {
        throw new Error('Server returned HTML instead of JSON');
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        if (response.ok) {
          return {status: 'success'};
        }
        throw new Error(responseText || 'Invalid server response');
      }

      if (!response.ok) {
        if (data.error === 'User already exists') {
          return rejectWithValue('An account with this email already exists');
        }
        return rejectWithValue(data.message || 'Registration failed');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create account');
    }
  },
);

export const logoutUser = () => async dispatch => {
  try {
    const token = await AsyncStorage.getItem('token');
    const fcmToken = await AsyncStorage.getItem('fcmToken');

    if (token && fcmToken) {
      await fetch(`${Config.API_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({fcm_token: fcmToken}),
      });
    }
  } catch (e) {
    console.error('Logout notification error:', e);
  } finally {
    await AsyncStorage.multiRemove(['token', 'firebaseId']);
    dispatch(logout());
  }
};
