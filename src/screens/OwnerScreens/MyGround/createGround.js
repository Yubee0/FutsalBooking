import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Config from 'react-native-config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import {showAlert} from '../../../components/Alert';
import {AlertType} from '../../../components/DropdownAlert';
import {
  calculateDuration,
  parseTimeString,
} from '../../../components/dateUtils';
import {colors, ownerColors} from '../../../constants/color';

const CreateGroundScreen = ({navigation}) => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [openingTime, setOpeningTime] = useState('07:00');
  const [closingTime, setClosingTime] = useState('20:00');
  const [isLoading, setIsLoading] = useState(false);
  const [showOpeningPicker, setShowOpeningPicker] = useState(false);
  const [showClosingPicker, setShowClosingPicker] = useState(false);

  const handleTimeChange = (type, event, selectedDate) => {
    if (type === 'opening') {
      setShowOpeningPicker(false);
      if (selectedDate) {
        const hours = selectedDate.getHours().toString().padStart(2, '0');
        const minutes = selectedDate.getMinutes().toString().padStart(2, '0');
        setOpeningTime(`${hours}:${minutes}`);
      }
    } else {
      setShowClosingPicker(false);
      if (selectedDate) {
        const hours = selectedDate.getHours().toString().padStart(2, '0');
        const minutes = selectedDate.getMinutes().toString().padStart(2, '0');
        setClosingTime(`${hours}:${minutes}`);
      }
    }
  };

  const validateTimes = () => {
    const duration = calculateDuration(openingTime, closingTime);
    if (duration <= 0) {
      showAlert(AlertType.ERROR, 'Closing time must be after opening time');
      return false;
    }
    return true;
  };

  const handleCreateGround = async () => {
    if (!name || !location) {
      showAlert(AlertType.ERROR, 'Name and location are required');
      return;
    }

    if (!validateTimes()) {
      return;
    }

    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${Config.API_URL}/ground/create-ground`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          location,
          description,
          'start-time': openingTime,
          'end-time': closingTime,
        }),
      });

      const text = await response.text();
      let data;

      try {
        data = JSON.parse(text);
      } catch (jsonError) {
        console.warn('Non-JSON response:', text);
      }

      if (!response.ok) {
        const errorMessage =
          (data && data.message) ||
          (typeof text === 'string' && text.slice(0, 100)) ||
          'Failed to create ground';
        throw new Error(errorMessage);
      }

      showAlert(AlertType.SUCCESS, 'Ground created successfully');
      navigation.navigate('OwnerHome');
    } catch (error) {
      console.error('Create ground error:', error);
      showAlert(AlertType.ERROR, error.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Create New Ground</Text>

      <TextInput
        style={styles.input}
        placeholder="Ground Name *"
        placeholderTextColor="#999"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Location *"
        placeholderTextColor="#999"
        value={location}
        onChangeText={setLocation}
      />

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Description (Optional)"
        placeholderTextColor="#999"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <View style={styles.timeContainer}>
        <View style={styles.timeInputContainer}>
          <Text style={styles.timeLabel}>Opening Time *</Text>
          <TouchableOpacity
            style={styles.timeInput}
            onPress={() => setShowOpeningPicker(true)}>
            <Text>{openingTime}</Text>
          </TouchableOpacity>
          {showOpeningPicker && (
            <DateTimePicker
              value={parseTimeString(openingTime)}
              mode="time"
              is24Hour={true}
              display="spinner"
              onChange={(event, date) =>
                handleTimeChange('opening', event, date)
              }
            />
          )}
        </View>

        <View style={styles.timeInputContainer}>
          <Text style={styles.timeLabel}>Closing Time *</Text>
          <TouchableOpacity
            style={styles.timeInput}
            onPress={() => setShowClosingPicker(true)}>
            <Text>{closingTime}</Text>
          </TouchableOpacity>
          {showClosingPicker && (
            <DateTimePicker
              value={parseTimeString(closingTime)}
              mode="time"
              is24Hour={true}
              display="spinner"
              onChange={(event, date) =>
                handleTimeChange('closing', event, date)
              }
            />
          )}
        </View>
      </View>

      <TouchableOpacity
        style={styles.createButton}
        onPress={handleCreateGround}
        disabled={isLoading}>
        <Text style={styles.createButtonText}>
          {isLoading ? 'Creating...' : 'Create Ground'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ownerColors.PRIMARY_LIGHT,
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  timeInputContainer: {
    width: '48%',
  },
  timeLabel: {
    marginBottom: 8,
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  timeInput: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  createButton: {
    backgroundColor: '#4A90E2',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  createButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default CreateGroundScreen;
