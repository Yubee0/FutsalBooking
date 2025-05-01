import React, {useEffect, useCallback, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import Config from 'react-native-config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import TimeSlotCard from '../../../components/timeSlotCard';
import Button from '../../../components/Button';
import {
  getDayName,
  generateWeek,
  formatDisplayDate,
  isSameDay,
} from '../../../components/dateUtils';
import {
  fetchGroundStart,
  fetchGroundSuccess,
  fetchGroundFailure,
  setFilteredSlots,
  reserveSlot,
} from '../../../redux/slices/groundSlice';
import {ownerColors} from '../../../constants/color';
import {Icon} from 'react-native-paper';
import {AlertType, showAlert} from '../../../components/Alert';
import styles from './styles';

const OwnerHomeScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const {user} = useSelector(state => state.auth);
  const {currentGround, allSlots, filteredSlots, loading} = useSelector(
    state => state.ground,
  );
  const [selectedDate, setSelectedDate] = useState(new Date());
  const weekDays = generateWeek();

  const filterSlotsByDate = useCallback((slots, date) => {
    if (!slots || !slots.length) {
      return [];
    }
    return slots;
  }, []);

  const fetchGroundData = useCallback(async () => {
    dispatch(fetchGroundStart());
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${Config.API_URL}/ground/get-grounds/3`, {
        headers: {Authorization: `Bearer ${token}`},
      });

      const text = await response.text();
      console.log('text', text);
      if (response.status === 404) {
        dispatch(fetchGroundSuccess({ground: null, slots: []}));
        return;
      }

      if (!response.ok) {
        throw new Error(text || 'Failed to fetch ground data');
      }

      const data = JSON.parse(text);
      dispatch(
        fetchGroundSuccess({
          ground: data.ground,
          slots: data.slots || [],
        }),
      );

      const filtered = filterSlotsByDate(data.slots, selectedDate);
      dispatch(setFilteredSlots(filtered));
    } catch (error) {
      console.error('Fetch ground error:', error);
      dispatch(fetchGroundFailure(error.message));
      showAlert(AlertType.ERROR, error.message);
    }
  }, [selectedDate, dispatch, filterSlotsByDate]);

  useEffect(() => {
    fetchGroundData();
  }, [fetchGroundData]);

  const handleReserveSlot = slotId => {
    dispatch(reserveSlot(slotId));
    const filtered = filterSlotsByDate(allSlots, selectedDate);
    dispatch(setFilteredSlots(filtered));
  };

  const handleDateSelect = date => {
    setSelectedDate(date);
    const filtered = filterSlotsByDate(allSlots, date);
    dispatch(setFilteredSlots(filtered));
  };

  if (loading && !currentGround) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={ownerColors.PRIMARY} />
      </View>
    );
  }

  if (!currentGround) {
    return (
      <View style={styles.noGroundContainer}>
        <Icon name="business" size={60} color={ownerColors.GRAY_LIGHT} />
        <Text style={styles.noGroundText}>
          You haven't created a ground yet
        </Text>
        <Button
          title="Create Ground"
          onPress={() => navigation.navigate('CreateGround')}
          backgroundColor={ownerColors.PRIMARY}
          style={styles.createButton}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{currentGround.Name}</Text>
        <Text style={styles.location}>{currentGround.Location}</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.weekSelector}
        contentContainerStyle={styles.weekSelectorContent}>
        {weekDays.map((day, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.dayButton,
              isSameDay(day, selectedDate) && styles.selectedDay,
            ]}
            onPress={() => handleDateSelect(day)}>
            <Text
              style={[
                styles.dayName,
                isSameDay(day, selectedDate) && styles.selectedDayText,
              ]}>
              {getDayName(day)}
            </Text>
            <Text
              style={[
                styles.dayDate,
                isSameDay(day, selectedDate) && styles.selectedDayText,
              ]}>
              {day.getDate()}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.dateContainer}>
        <Text style={styles.selectedDateText}>
          {formatDisplayDate(selectedDate)}
        </Text>
      </View>

      <ScrollView style={styles.slotsContainer}>
        {filteredSlots.length > 0 ? (
          filteredSlots.map(slot => (
            <TimeSlotCard
              key={slot.ID}
              startTime={slot.StartTime}
              endTime={slot.EndTime}
              status={slot.Status}
              onPress={() => handleReserveSlot(slot.ID)}
              theme={ownerColors}
            />
          ))
        ) : (
          <View style={styles.noSlotsContainer}>
            <Icon name="schedule" size={40} color={ownerColors.GRAY_LIGHT} />
            <Text style={styles.noSlotsText}>
              No slots available for this date
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default OwnerHomeScreen;
