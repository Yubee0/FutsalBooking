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
      state.loading = false;
      state.currentGround = action.payload.ground;
      state.allSlots = action.payload.slots;
    },
    fetchGroundFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    setFilteredSlots(state, action) {
      state.filteredSlots = action.payload;
    },
    reserveSlot(state, action) {
      const slotId = action.payload;
      const slot = state.allSlots.find(s => s.ID === slotId);
      if (slot) {
        slot.Status = 'booked';
      }
    },
  },
});

export const {
  fetchGroundStart,
  fetchGroundSuccess,
  fetchGroundFailure,
  setFilteredSlots,
  reserveSlot,
} = groundSlice.actions;

export default groundSlice.reducer;
