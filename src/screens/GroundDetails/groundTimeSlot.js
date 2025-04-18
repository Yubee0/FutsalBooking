import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {TimeSlotCard} from '../../components/timeSlotCard';
import {
  fetchGroundStart,
  fetchGroundSuccess,
  fetchGroundFailure,
  setFilteredSlots,
  updateSlotStatus,
} from '../../redux/slices/groundSlice';
import {
  formatDisplayDate,
  generateWeek,
  isSameDay,
  normalizeDateString,
  isTimeSlotAvailable,
  getDayName,
} from '../../components/dateUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from 'react-native-config';
import {requestBookingThunk} from '../../redux/slices/bookingThunk';
import {AlertType} from '../../components/DropdownAlert';
import {showAlert} from '../../components/Alert';
import styles from './styles';
import {getThemeColors} from '../../constants/color';

const GroundTimeSlotScreen = ({route, navigation}) => {
  const {groundId, isOwner = false} = route.params;
  const dispatch = useDispatch();
  const {
    currentGround,
    allSlots,
    filteredSlots,
    loading: groundLoading,
  } = useSelector(state => state.ground);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentWeek, setCurrentWeek] = useState(generateWeek());
  const [loadingSlots, setLoadingSlots] = useState({});
  const isMounted = useRef(true);
  const alertRef = useRef(null);

  const colors = getThemeColors(isOwner);

  useEffect(() => {
    isMounted.current = true;

    dispatch(fetchGroundSuccess({ground: null, slots: []}));

    fetchGroundTimeslots();

    return () => {
      isMounted.current = false;
      if (alertRef.current) {
        Alert.alert = () => {};
        alertRef.current = null;
      }

      dispatch(fetchGroundSuccess({ground: null, slots: []}));
    };
  }, [groundId]);

  const fetchGroundTimeslots = async () => {
    dispatch(fetchGroundStart());
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(
        `${Config.API_URL}/ground/get-grounds/${groundId}`,
        {headers: {Authorization: `Bearer ${token}`}},
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch ground data');
      }

      const processedSlots = (data.slots || []).map(slot => ({
        ...slot,
        Status: slot.Status || 'available',
        date: slot.date
          ? normalizeDateString(slot.date)
          : normalizeDateString(new Date()),
      }));

      dispatch(
        fetchGroundSuccess({
          ground: data.ground,
          slots: processedSlots,
        }),
      );

      filterSlotsForDate(selectedDate, processedSlots);
    } catch (error) {
      if (isMounted.current) {
        dispatch(fetchGroundFailure(error.message));
        showAlert(AlertType.ERROR, error.message);
      }
    }
  };

  const filterSlotsForDate = (date, slots = allSlots) => {
    const targetDate = normalizeDateString(date);
    const filtered = (slots || []).filter(
      slot => slot.date && normalizeDateString(slot.date) === targetDate,
    );
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

  const handleDateSelect = date => {
    setSelectedDate(date);
    filterSlotsForDate(date);
  };

  const handleSlotSelect = async slot => {
    if (isOwner) {
      if (slot.Status.toLowerCase() === 'booked') {
        navigation.navigate('BookingDetails', {bookingId: slot.ID});
      }
      return;
    }

    if (!isTimeSlotAvailable(slot)) {
      showAlert(AlertType.INFO, 'This time slot is already booked or reserved');
      return;
    }

    const slotDate = slot.date ? new Date(slot.date) : selectedDate;

    try {
      const shouldBook = await new Promise(resolve => {
        Alert.alert(
          'Confirm Booking',
          `Are you sure you want to book ${slot.StartTime}-${
            slot.EndTime
          } on ${formatDisplayDate(slotDate)}?`,
          [
            {text: 'Cancel', onPress: () => resolve(false), style: 'cancel'},
            {text: 'Book Now', onPress: () => resolve(true)},
          ],
        );
      });

      if (!shouldBook || !isMounted.current) {
        return;
      }

      setLoadingSlots(prev => ({...prev, [slot.ID]: true}));

      dispatch(
        updateSlotStatus({
          slotId: slot.ID,
          status: 'pending',
          date: normalizeDateString(slotDate),
        }),
      );

      await dispatch(
        requestBookingThunk(
          slot.ID,
          groundId,
          slotDate,
          slot.StartTime,
          slot.EndTime,
        ),
      );

      fetchGroundTimeslots();
    } catch (error) {
      if (isMounted.current) {
        dispatch(
          updateSlotStatus({
            slotId: slot.ID,
            status: 'available',
            date: normalizeDateString(slotDate),
          }),
        );
        showAlert(AlertType.ERROR, error.message);
      }
    } finally {
      if (isMounted.current) {
        setLoadingSlots(prev => ({...prev, [slot.ID]: false}));
      }
    }
  };

  const slotsToRender = useMemo(() => filteredSlots || [], [filteredSlots]);

  if (groundLoading && !currentGround) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.PRIMARY} />
      </View>
    );
  }

  if (!currentGround) {
    return (
      <View style={styles.noGroundContainer}>
        <Text style={[styles.noGroundText, {color: colors.TEXT_PRIMARY}]}>
          Ground not found
        </Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[styles.backLink, {color: colors.PRIMARY}]}>
            Go back
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, {backgroundColor: colors.BACKGROUND}]}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={24} color={colors.PRIMARY} />
        <Text style={[styles.backButtonText, {color: colors.PRIMARY}]}>
          {isOwner ? 'Owner Dashboard' : 'All Grounds'}
        </Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.groundHeader}>
          <Text style={[styles.groundTitle, {color: colors.TEXT_PRIMARY}]}>
            {currentGround.Name}
          </Text>
          <View style={styles.locationRow}>
            <Icon name="location-on" size={18} color={colors.TEXT_SECONDARY} />
            <Text
              style={[styles.groundLocation, {color: colors.TEXT_SECONDARY}]}>
              {currentGround.Location}
            </Text>
          </View>
          <Text
            style={[styles.groundDescription, {color: colors.TEXT_SECONDARY}]}>
            {currentGround.Description}
          </Text>

          <View style={styles.groundInfoRow}>
            <View style={styles.infoItem}>
              <Icon name="access-time" size={16} color={colors.SUCCESS} />
              <Text style={[styles.infoText, {color: colors.TEXT_SECONDARY}]}>
                {currentGround.opening_time} - {currentGround.closing_time}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Icon name="attach-money" size={16} color={colors.SUCCESS} />
              <Text style={[styles.infoText, {color: colors.TEXT_SECONDARY}]}>
                Rs. {currentGround.price || 'N/A'} per hour
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.weekNavigation, {borderColor: colors.BORDER}]}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => handleWeekChange('prev')}>
            <Icon name="chevron-left" size={24} color={colors.PRIMARY} />
          </TouchableOpacity>

          <Text style={[styles.weekRangeText, {color: colors.TEXT_PRIMARY}]}>
            {`${formatDisplayDate(currentWeek[0])} - ${formatDisplayDate(
              currentWeek[6],
            )}`}
          </Text>

          <TouchableOpacity
            style={styles.navButton}
            onPress={() => handleWeekChange('next')}>
            <Icon name="chevron-right" size={24} color={colors.PRIMARY} />
          </TouchableOpacity>
        </View>

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
                  isToday && {backgroundColor: colors.GRAY_LIGHT},
                  isSelected && {backgroundColor: colors.PRIMARY},
                ]}
                onPress={() => handleDateSelect(day)}>
                <Text
                  style={[
                    styles.dayName,
                    isSelected && styles.selectedText,
                    isToday && !isSelected && {color: colors.PRIMARY},
                    isSelected && {color: colors.WHITE},
                    {color: colors.TEXT_SECONDARY},
                  ]}>
                  {getDayName(day)}
                </Text>
                <Text
                  style={[
                    styles.dayNumber,
                    isSelected && styles.selectedText,
                    isToday && !isSelected && {color: colors.PRIMARY},
                    isSelected && {color: colors.WHITE},
                    {color: colors.TEXT_PRIMARY},
                  ]}>
                  {day.getDate()}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <Text style={[styles.sectionTitle, {color: colors.TEXT_PRIMARY}]}>
          {isOwner ? 'Bookings' : 'Available Slots'} for{' '}
          {formatDisplayDate(selectedDate)}
        </Text>

        {slotsToRender.length === 0 ? (
          <View style={styles.noSlotsContainer}>
            <Icon name="schedule" size={48} color={colors.GRAY} />
            <Text style={[styles.noSlotsText, {color: colors.TEXT_PRIMARY}]}>
              {isOwner
                ? 'No bookings for this date'
                : 'No available slots for this date'}
            </Text>
            {!isOwner && (
              <Text
                style={[styles.noSlotsHint, {color: colors.TEXT_SECONDARY}]}>
                Try selecting a different date or check back later
              </Text>
            )}
          </View>
        ) : (
          <View style={styles.slotsContainer}>
            {slotsToRender.map(slot => (
              <TimeSlotCard
                key={slot.ID}
                startTime={slot.StartTime}
                endTime={slot.EndTime}
                status={(slot.Status || '').toLowerCase()}
                price={slot.price || currentGround.price || 'N/A'}
                onPress={() => handleSlotSelect(slot)}
                theme={colors}
                date={slot.date}
                loading={loadingSlots[slot.ID]}
                isOwner={isOwner}
                bookingUser={slot.User?.Name}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default GroundTimeSlotScreen;
