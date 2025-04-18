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
    fetchGroundStart: state => {
      state.loading = true;
      state.error = null;
    },
    fetchGroundSuccess: (state, action) => {
      state.loading = false;
      state.currentGround = action.payload.ground;
      state.allSlots = action.payload.slots;
    },
    fetchGroundFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setFilteredSlots: (state, action) => {
      state.filteredSlots = action.payload;
    },
    updateSlotStatus: (state, action) => {
      const {slotId, status, date} = action.payload;

      // Update allSlots
      state.allSlots = state.allSlots.map(slot =>
        slot.ID === slotId && slot.date === date
          ? {...slot, Status: status}
          : slot,
      );

      // Update filteredSlots
      state.filteredSlots = state.filteredSlots.map(slot =>
        slot.ID === slotId && slot.date === date
          ? {...slot, Status: status}
          : slot,
      );
    },
  },
});

export const {
  fetchGroundStart,
  fetchGroundSuccess,
  fetchGroundFailure,
  setFilteredSlots,
  updateSlotStatus,
} = groundSlice.actions;

export default groundSlice.reducer;
