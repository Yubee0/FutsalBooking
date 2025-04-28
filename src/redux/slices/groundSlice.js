import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  currentGround: null,
  allSlots: [],
  filteredSlots: [],
  loading: false,
  error: null,
};

const groundSlice = createSlice({
  name: 'ground',
  initialState,
  reducers: {
    fetchGroundStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchGroundSuccess(state, action) {
      state.currentGround = action.payload.ground;
      state.allSlots = action.payload.slots || [];
      state.filteredSlots = action.payload.slots || [];
      state.loading = false;
    },
    fetchGroundFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    setFilteredSlots(state, action) {
      state.filteredSlots = action.payload;
    },
    resetGround(state) {
      return initialState;
    },
  },
});

export const {
  fetchGroundStart,
  fetchGroundSuccess,
  fetchGroundFailure,
  setFilteredSlots,
  resetGround,
} = groundSlice.actions;

export default groundSlice.reducer;
