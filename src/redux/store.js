import {configureStore} from '@reduxjs/toolkit';

import authReducer from './slices/authSlice';
import groundReducer from './slices/groundSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ground: groundReducer,
  },
});
