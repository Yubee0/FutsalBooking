import React, {useState, useEffect} from 'react';
import Config from 'react-native-config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import {TimeSlotCard} from '../../../components/timeSlotCard';
import {formatDisplayDate} from '../../../components/dateUtils';
import styles from './styles';

const GroundTimeSlotScreen = ({route, navigation}) => {
  const {groundId} = route.params;
  const [ground, setGround] = useState(null);
  const [slots, setSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    fetchGroundDetails();
  }, [groundId, selectedDate]);

  const fetchGroundDetails = async () => {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const dateString = selectedDate.toISOString().split('T')[0];

      const response = await fetch(
        `${Config.API_URL}/ground/get-grounds/${groundId}?date=${dateString}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch ground details');
      }

      setGround(data.ground);
      setSlots(data.slots || []);
    } catch (error) {
      console.error('Error fetching ground details:', error);
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateChange = newDate => {
    setSelectedDate(newDate);
  };

  const handleSlotSelect = slot => {
    if (slot.Status !== 'available') {
      Alert.alert(
        'Slot Not Available',
        'This time slot is already booked or reserved',
      );
      return;
    }

    Alert.alert(
      'Confirm Booking',
      `Request booking for ${ground.Name} from ${slot.StartTime} to ${
        slot.EndTime
      } on ${formatDisplayDate(selectedDate)}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Request',
          onPress: () => requestBooking(slot.ID),
        },
      ],
    );
  };

  const requestBooking = async slotId => {
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
          date: selectedDate.toISOString().split('T')[0],
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Booking request sent successfully');
        fetchGroundDetails(); // Refresh the slots
      } else {
        throw new Error(data.message || 'Failed to send booking request');
      }
    } catch (error) {
      console.error('Booking error:', error);
      Alert.alert('Error', error.message);
    }
  };

  const DateSelector = ({selectedDate, onDateChange}) => {
    const dates = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }

    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.dateSelector}
        contentContainerStyle={styles.dateSelectorContent}>
        {dates.map((date, index) => {
          const isSelected =
            date.toDateString() === selectedDate.toDateString();
          const dayName = date.toLocaleDateString('en-US', {weekday: 'short'});
          const dayNumber = date.getDate();

          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.dateButton,
                isSelected && styles.selectedDateButton,
              ]}
              onPress={() => onDateChange(date)}>
              <Text
                style={[styles.dayName, isSelected && styles.selectedDayName]}>
                {dayName}
              </Text>
              <Text
                style={[
                  styles.dayNumber,
                  isSelected && styles.selectedDayNumber,
                ]}>
                {dayNumber}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    );
  };

  if (isLoading && !ground) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>Loading ground details...</Text>
      </View>
    );
  }

  if (!ground) {
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

      <ScrollView>
        <View style={styles.groundHeader}>
          <Text style={styles.groundTitle}>{ground.Name}</Text>
          <View style={styles.locationRow}>
            <Icon name="location-on" size={18} color="#666" />
            <Text style={styles.groundLocation}>{ground.Location}</Text>
          </View>
          <Text style={styles.groundDescription}>{ground.Description}</Text>
          <View style={styles.groundInfoRow}>
            <View style={styles.infoItem}>
              <Icon name="access-time" size={16} color="#4CAF50" />
              <Text style={styles.infoText}>
                {ground.opening_time} - {ground.closing_time}
              </Text>
            </View>
          </View>
        </View>

        <DateSelector
          selectedDate={selectedDate}
          onDateChange={handleDateChange}
        />

        <Text style={styles.sectionTitle}>Available Time Slots</Text>

        {slots.length === 0 ? (
          <View style={styles.noSlotsContainer}>
            <Icon name="schedule" size={40} color="#ccc" />
            <Text style={styles.noSlotsText}>
              No available slots for this date
            </Text>
          </View>
        ) : (
          <View style={styles.slotsContainer}>
            {slots.map(slot => (
              <TimeSlotCard
                key={`${slot.ID}-${slot.StartTime}`}
                startTime={slot.StartTime}
                endTime={slot.EndTime}
                status={slot.Status}
                onPress={() => handleSlotSelect(slot)}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default GroundTimeSlotScreen;
