import {configureStore} from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import groundReducer from './slices/groundSlice';
import bookingReducer from './slices/bookingSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ground: groundReducer,
    booking: bookingReducer,
  },
});
