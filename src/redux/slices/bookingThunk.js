import AsyncStorage from '@react-native-async-storage/async-storage';
import {showAlert} from '../../components/Alert';
import Config from 'react-native-config';
import {AlertType} from '../../components/DropdownAlert';
import {addBooking} from './bookingSlice';
import {updateSlotStatus} from './groundSlice'; // Import from groundSlice now

export const requestBookingThunk =
  (slotId, groundId, date, startTime, endTime) => async dispatch => {
    try {
      const token = await AsyncStorage.getItem('token');
      const dateStr = date.toISOString().split('T')[0];

      // Immediate UI update
      dispatch(
        updateSlotStatus({
          slotId,
          status: 'pending',
          date: dateStr,
        }),
      );

      const response = await fetch(`${Config.API_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ground_id: groundId,
          date: dateStr,
          start_time: startTime,
          end_time: endTime,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Revert status if request fails
        dispatch(
          updateSlotStatus({
            slotId,
            status: 'available',
            date: dateStr,
          }),
        );
        throw new Error(data.message || 'Failed to send booking request');
      }

      // Final update with server's status
      dispatch(
        updateSlotStatus({
          slotId,
          status: data.booking.Status || 'pending',
          date: dateStr,
        }),
      );

      dispatch(addBooking(data.booking));
      showAlert(
        AlertType.SUCCESS,
        data.message || 'Booking request sent successfully',
      );
      return data.booking;
    } catch (error) {
      console.error('Booking error:', error);
      showAlert(AlertType.ERROR, error.message);
      throw error;
    }
  };
