import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, RefreshControl} from 'react-native';
import {useSelector} from 'react-redux';
import Config from 'react-native-config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import GroundCard from '../../../components/groundCard';
import Button from '../../../components/Button';
import {playerColors} from '../../../constants/color';
import styles from './styles';
import {AlertType, showAlert} from '../../../components/Alert';

const PlayerHomeScreen = ({navigation}) => {
  const {user} = useSelector(state => state.auth);
  const [grounds, setGrounds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAllGrounds = async () => {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${Config.API_URL}/ground/get-grounds`, {
        headers: {Authorization: `Bearer ${token}`},
      });

      const responseText = await response.text();

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: ${responseText}`);
      }

      const data = JSON.parse(responseText);
      if (!data.Availablegrounds) {
        throw new Error('API response missing Availablegrounds field');
      }

      const groundsWithPrice = data.Availablegrounds.map(ground => ({
        ...ground,
        price: Math.floor(Math.random() * 1000) + 500,
      }));

      setGrounds(groundsWithPrice);
    } catch (error) {
      console.error('Error fetching grounds:', error);
      showAlert(AlertType.ERROR, error.message || 'Failed to load grounds');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchAllGrounds();
    });

    return unsubscribe;
  }, [navigation]);

  const handleGroundSelect = ground => {
    navigation.navigate('GroundDetail', {groundId: ground.ID});
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchAllGrounds();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Available Futsal Grounds</Text>
        <Text style={styles.subtitle}>Hello, {user?.name || 'Player'}!</Text>
      </View>

      {grounds.length === 0 ? (
        <View style={styles.noGroundsContainer}>
          <Icon name="terrain" size={60} color={playerColors.GRAY_LIGHT} />
          <Text style={styles.noGroundsText}>No grounds available</Text>
          <Button
            title="Try Again"
            onPress={fetchAllGrounds}
            backgroundColor={playerColors.PRIMARY}
            loading={isLoading}
            style={styles.refreshButton}
          />
        </View>
      ) : (
        <FlatList
          data={grounds}
          keyExtractor={item => item.ID.toString()}
          renderItem={({item}) => (
            <GroundCard
              ground={item}
              onPress={() => handleGroundSelect(item)}
              theme={playerColors}
            />
          )}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[playerColors.PRIMARY]}
              tintColor={playerColors.PRIMARY}
            />
          }
        />
      )}
    </View>
  );
};

export default PlayerHomeScreen;
