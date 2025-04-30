import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import Config from 'react-native-config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ScrollView} from 'react-native-gesture-handler';

const CreateGroundScreen = ({navigation}) => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [openingTime, setOpeningTime] = useState('07:00');
  const [closingTime, setClosingTime] = useState('20:00');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateGround = async () => {
    if (!name || !location) {
      Alert.alert('Error', 'Name and location are required');
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

      const data = await response.json();
      if (response.ok) {
        Alert.alert('Success', 'Ground created successfully');
        navigation.navigate('OwnerHome');
      } else {
        throw new Error(data.message || 'Failed to create ground');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Create New Ground</Text>

      <TextInput
        style={styles.input}
        placeholder="Ground Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
      />

      <TextInput
        style={[styles.input, {height: 100}]}
        placeholder="Description (Optional)"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <View style={styles.timeContainer}>
        <View style={styles.timeInputContainer}>
          <Text style={styles.timeLabel}>Opening Time</Text>
          <TextInput
            style={styles.timeInput}
            value={openingTime}
            onChangeText={setOpeningTime}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.timeInputContainer}>
          <Text style={styles.timeLabel}>Closing Time</Text>
          <TextInput
            style={styles.timeInput}
            value={closingTime}
            onChangeText={setClosingTime}
            keyboardType="numeric"
          />
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
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
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
    marginBottom: 5,
    fontSize: 14,
    color: '#666',
  },
  timeInput: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
  },
  createButton: {
    backgroundColor: '#4A90E2',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  createButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default CreateGroundScreen;
