import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {TimeSlotCard} from '../../../components/timeSlotCard';
import {
  fetchGroundStart,
  fetchGroundSuccess,
  fetchGroundFailure,
  setFilteredSlots,
} from '../../../redux/slices/groundSlice';
import {
  formatDisplayDate,
  generateWeek,
  isSameDay,
} from '../../../components/dateUtils';
import styles from './styles';
import {playerColors} from '../../../constants/color';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from 'react-native-config';
import {requestBookingThunk} from '../../../redux/slices/bookingThunk';
import {AlertType} from '../../../components/DropdownAlert';
import {showAlert} from '../../../components/Alert';

const GroundTimeSlotScreen = ({route, navigation}) => {
  const {groundId} = route.params;
  const dispatch = useDispatch();
  const {currentGround, allSlots, filteredSlots, loading} = useSelector(
    state => state.ground,
  );
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentWeek, setCurrentWeek] = useState(generateWeek());

  useEffect(() => {
    fetchGroundTimeslots();
  }, [groundId]);

  const fetchGroundTimeslots = async () => {
    dispatch(fetchGroundStart());
    try {
      const token = await AsyncStorage.getItem('token');

      const response = await fetch(
        `${Config.API_URL}/ground/get-grounds/${groundId}`,
        {headers: {Authorization: `Bearer ${token}`}},
      );

      const responseText = await response.text();
      console.log('Raw API response:', responseText);

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: ${responseText}`);
      }

      const data = JSON.parse(responseText);
      console.log('Parsed API response:', data);

      dispatch(
        fetchGroundSuccess({
          ground: data.ground,
          slots: data.slots || [],
        }),
      );

      const filtered = filterSlotsByDate(data.slots, selectedDate);
      dispatch(setFilteredSlots(filtered));
    } catch (error) {
      dispatch(fetchGroundFailure(error.message));
      showAlert(AlertType.ERROR, error.message);
    }
  };

  const filterSlotsByDate = (slots, date) => {
    if (!slots) {
      return [];
    }
    const dateStr = date.toISOString().split('T')[0];
    return slots.filter(slot => {
      const slotDateStr = slot.date ? slot.date.split('T')[0] : null;
      return slotDateStr === dateStr;
    });
  };

  const handleDateSelect = date => {
    setSelectedDate(date);
    const filtered = filterSlotsByDate(allSlots, date);
    dispatch(setFilteredSlots(filtered));
  };

  const handleWeekChange = direction => {
    const newWeek = currentWeek.map(day => {
      const newDate = new Date(day);
      newDate.setDate(day.getDate() + (direction === 'next' ? 7 : -7));
      return newDate;
    });
    setCurrentWeek(newWeek);
  };

  const handleSlotSelect = async slot => {
    if (slot.Status !== 'available') {
      showAlert(AlertType.INFO, 'This time slot is already booked or reserved');
      return;
    }

    try {
      await dispatch(requestBookingThunk(slot.ID, groundId, selectedDate));
      fetchGroundTimeslots(); // refresh slots
    } catch (e) {
      // error already handled via showAlert inside thunk
    }
  };

  if (loading && !currentGround) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  if (!currentGround) {
    return (
      <View style={styles.noGroundContainer}>
        <Text style={styles.noGroundText}>Ground not found</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backLink}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={24} color="#4A90E2" />
        <Text style={styles.backButtonText}>All Grounds</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.groundHeader}>
          <Text style={styles.groundTitle}>{currentGround.Name}</Text>
          <View style={styles.locationRow}>
            <Icon name="location-on" size={18} color="#666" />
            <Text style={styles.groundLocation}>{currentGround.Location}</Text>
          </View>
          <Text style={styles.groundDescription}>
            {currentGround.Description}
          </Text>

          <View style={styles.groundInfoRow}>
            <View style={styles.infoItem}>
              <Icon name="access-time" size={16} color="#4CAF50" />
              <Text style={styles.infoText}>
                {currentGround.opening_time} - {currentGround.closing_time}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Icon name="attach-money" size={16} color="#4CAF50" />
              <Text style={styles.infoText}>
                Rs. {currentGround.price || 'N/A'} per hour
              </Text>
            </View>
          </View>
        </View>

        {/* Week Navigation */}
        <View style={styles.weekNavigation}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => handleWeekChange('prev')}>
            <Icon name="chevron-left" size={24} color="#4A90E2" />
          </TouchableOpacity>

          <Text style={styles.weekRangeText}>
            {`${formatDisplayDate(currentWeek[0])} - ${formatDisplayDate(
              currentWeek[6],
            )}`}
          </Text>

          <TouchableOpacity
            style={styles.navButton}
            onPress={() => handleWeekChange('next')}>
            <Icon name="chevron-right" size={24} color="#4A90E2" />
          </TouchableOpacity>
        </View>

        {/* Date Selector */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dateSelector}>
          {currentWeek.map((day, index) => {
            const isSelected = isSameDay(day, selectedDate);
            const isToday = isSameDay(day, new Date());

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dateButton,
                  isToday && styles.todayButton,
                  isSelected && styles.selectedDateButton,
                ]}
                onPress={() => handleDateSelect(day)}>
                <Text
                  style={[
                    styles.dayName,
                    isSelected && styles.selectedText,
                    isToday && !isSelected && styles.todayText,
                  ]}>
                  {day.toLocaleDateString('en-US', {weekday: 'short'})}
                </Text>
                <Text
                  style={[
                    styles.dayNumber,
                    isSelected && styles.selectedText,
                    isToday && !isSelected && styles.todayText,
                  ]}>
                  {day.getDate()}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <Text style={styles.sectionTitle}>
          Available Slots for {formatDisplayDate(selectedDate)}
        </Text>

        {filteredSlots.length === 0 ? (
          <View style={styles.noSlotsContainer}>
            <Icon name="schedule" size={48} color="#ccc" />
            <Text style={styles.noSlotsText}>
              No available slots for this date
            </Text>
            <Text style={styles.noSlotsHint}>
              Try selecting a different date or check back later
            </Text>
          </View>
        ) : (
          <View style={styles.slotsContainer}>
            {filteredSlots.map(slot => (
              <TimeSlotCard
                key={slot.ID}
                startTime={slot.StartTime}
                endTime={slot.EndTime}
                status={slot.Status.toLowerCase()}
                price={slot.price || 'N/A'}
                onPress={() => handleSlotSelect(slot)}
                theme={playerColors}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default GroundTimeSlotScreen;
