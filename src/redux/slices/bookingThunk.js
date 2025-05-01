import AsyncStorage from '@react-native-async-storage/async-storage';
import {showAlert} from '../../components/Alert';
import Config from 'react-native-config';
import {AlertType} from '../../components/DropdownAlert';

export const requestBookingThunk =
  (slotId, groundId, date) => async (dispatch, getState) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${Config.API_URL}/bookings/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          slot_id: slotId,
          ground_id: groundId,
          date: date.toISOString().split('T')[0],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send booking request');
      }

      showAlert(AlertType.SUCCESS, 'Booking request sent successfully');
      return data.booking;
    } catch (error) {
      console.error('Booking error:', error);
      showAlert(AlertType.ERROR, error.message);
      throw error;
    }
  };
