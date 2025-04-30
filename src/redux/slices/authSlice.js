// import {createSlice} from '@reduxjs/toolkit';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const initialState = {
//   token: null,
//   user: null,
//   isAuthenticated: false,
// };

// const authSlice = createSlice({
//   name: 'auth',
//   initialState,
//   reducers: {
//     setCredentials: (state, action) => {
//       const {token, user} = action.payload;
//       state.token = token;
//       state.user = {
//         id: user.id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//       };
//       state.isAuthenticated = true;
//       AsyncStorage.setItem('token', token);
//     },
//     logout: state => {
//       state.token = null;
//       state.user = null;
//       state.isAuthenticated = false;
//       AsyncStorage.removeItem('token');
//     },
//     updateUser: (state, action) => {
//       if (state.user) {
//         state.user = {
//           ...state.user,
//           ...action.payload,
//         };
//       }
//     },
//   },
// });

// export const {setCredentials, logout, updateUser} = authSlice.actions;

// export default authSlice.reducer;

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
      state.user = user;
      state.isAuthenticated = true;
    },
    logout: state => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
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

// Thunk for local signup
export const signupUser = userData => async dispatch => {
  try {
    // Generate simple token
    const token = `dummy-token-${Math.random().toString(36).substr(2, 9)}`;

    // Create user object
    const user = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      role: userData.role,
    };

    // Save to storage
    await AsyncStorage.setItem('userData', JSON.stringify({token, user}));

    // Dispatch to redux
    dispatch(setCredentials({token, user}));
    return {success: true, user}; // Return success and user data
  } catch (error) {
    console.error('Signup error:', error);
    return {success: false, error: error.message}; // Return error info
  }
};

// Thunk for local login
export const loginUser = (email, password) => async dispatch => {
  try {
    // In a real app, you would verify password here
    // For demo, we just check if user exists in AsyncStorage

    const storedData = await AsyncStorage.getItem('userData');
    if (!storedData) {
      throw new Error('No user found. Please sign up first.');
    }

    const {token, user} = JSON.parse(storedData);

    if (user.email !== email) {
      throw new Error('Invalid email');
    }

    dispatch(setCredentials({token, user}));
    return {success: true};
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Thunk for logout
export const logoutUser = () => async dispatch => {
  try {
    await AsyncStorage.removeItem('token');
    dispatch(logout());
  } catch (error) {
    console.error('Logout error:', error);
  }
};

// Check if user is already logged in
export const checkAuthStatus = () => async dispatch => {
  try {
    const storedData = await AsyncStorage.getItem('userData');
    if (storedData) {
      const {token, user} = JSON.parse(storedData);
      dispatch(setCredentials({token, user}));
    }
  } catch (error) {
    console.error('Auth check error:', error);
  }
};

export const {setCredentials, logout, updateUser} = authSlice.actions;

export default authSlice.reducer;
