import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Animated,
  Dimensions,
  RefreshControl,
} from 'react-native';
import Config from 'react-native-config';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from './styles';
import {ownerColors} from '../../../constants/color';
import TimeSlotCard from '../../../components/timeSlotCard';
import GroundCard from '../../../components/groundCard';
import {showAlert} from '../../../components/Alert';
import {AlertType} from '../../../components/DropdownAlert';
import {useSelector} from 'react-redux';

const {width} = Dimensions.get('window');

const OwnerHomeScreen = ({navigation}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef();
  const firebaseId = useSelector(state => state.auth.firebaseId);
  const token = useSelector(state => state.auth.token);

  useEffect(() => {
    fetchOwnerProfile();
  }, []);

  const fetchOwnerProfile = async () => {
    try {
      setLoading(true);

      if (!token || !firebaseId) {
        const errorMsg = `Missing auth data - Token: ${!!token}, FirebaseID: ${!!firebaseId}`;
        console.error(errorMsg);
        throw new Error('Authentication data missing');
      }

      const apiUrl = `${Config.API_URL}/user/${firebaseId}/ownerprofile`;
      console.log('Making request to:', apiUrl);

      const response = await fetch(apiUrl, {
        headers: {Authorization: `Bearer ${token}`},
      });

      console.log('Received response status:', response.status);

      const responseText = await response.text();
      console.log('Raw response text:', responseText);

      if (!response.ok) {
        console.error('API Error Response:', responseText);
        throw new Error(responseText || 'Failed to fetch profile');
      }

      try {
        const data = JSON.parse(responseText);
        console.log('Parsed response data:', data);
        setProfile(data);
      } catch (parseError) {
        console.error('Failed to parse JSON:', parseError);
        throw new Error('Invalid server response format');
      }
    } catch (error) {
      showAlert(AlertType.ERROR, error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGroundPress = groundId => {
    navigation.navigate('GroundDetail', {groundId, isOwner: true});
  };

  const handleBookingAction = (bookingId, action) => {
    console.log(`${action} booking ${bookingId}`);
  };

  const handleTabPress = index => {
    setActiveTab(index);
    scrollViewRef.current?.scrollTo({x: width * index, animated: true});
  };

  const onScroll = Animated.event(
    [{nativeEvent: {contentOffset: {x: scrollX}}}],
    {useNativeDriver: false},
  );

  const translateX = scrollX.interpolate({
    inputRange: [0, width],
    outputRange: [0, width / 2],
  });

  if (loading && !profile) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={ownerColors.PRIMARY} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome, {profile?.owner?.name}</Text>
        <Text style={styles.subtitle}>Manage your grounds and bookings</Text>
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => handleTabPress(0)}>
          <Text
            style={[styles.tabText, activeTab === 0 && styles.activeTabText]}>
            My Grounds
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => handleTabPress(1)}>
          <Text
            style={[styles.tabText, activeTab === 1 && styles.activeTabText]}>
            Booking Requests
          </Text>
        </TouchableOpacity>
        <Animated.View
          style={[styles.tabIndicator, {transform: [{translateX}]}]}
        />
      </View>

      <Animated.ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        onMomentumScrollEnd={e => {
          const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
          setActiveTab(newIndex);
        }}>
        <View style={{width}}>
          <GroundsTab
            grounds={profile?.grounds || []}
            onPress={handleGroundPress}
            loading={loading}
            refreshing={refreshing}
          />
        </View>
        <View style={{width}}>
          <BookingsTab
            bookings={profile?.booking_requests || []}
            onAction={handleBookingAction}
            loading={loading}
            refreshing={refreshing}
          />
        </View>
      </Animated.ScrollView>
    </View>
  );
};

const GroundsTab = ({grounds, onPress, loading, refreshing}) => {
  if (loading) {
    return (
      <View style={styles.tabLoadingContainer}>
        <ActivityIndicator size="large" color={ownerColors.PRIMARY} />
      </View>
    );
  }

  if (grounds.length === 0) {
    return (
      <View style={styles.emptyTabContainer}>
        <Icon name="business" size={60} color={ownerColors.GRAY_LIGHT} />
        <Text style={styles.emptyTabText}>
          You haven't created any grounds yet
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.tabContent}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {}}
          colors={[ownerColors.PRIMARY]}
          tintColor={ownerColors.PRIMARY}
        />
      }>
      {grounds.map(ground => (
        <GroundCard
          key={ground.ID}
          ground={ground}
          onPress={() => onPress(ground.ID)}
          theme={ownerColors}
        />
      ))}
    </ScrollView>
  );
};

const BookingsTab = ({bookings, onAction, loading, refreshing}) => {
  if (loading) {
    return (
      <View style={styles.tabLoadingContainer}>
        <ActivityIndicator size="large" color={ownerColors.PRIMARY} />
      </View>
    );
  }

  if (bookings.length === 0) {
    return (
      <View style={styles.emptyTabContainer}>
        <Icon name="schedule" size={60} color={ownerColors.GRAY_LIGHT} />
        <Text style={styles.emptyTabText}>No pending booking requests</Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.tabContent}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {}}
          colors={[ownerColors.PRIMARY]}
          tintColor={ownerColors.PRIMARY}
        />
      }>
      {bookings.map(booking => (
        <TimeSlotCard
          key={booking.ID}
          startTime={booking.StartTime}
          endTime={booking.EndTime}
          status={booking.Status.toLowerCase()}
          price={booking.Price}
          date={booking.Date}
          showDate={true}
          theme={ownerColors}
          onPress={() => {}}
          renderActions={() => (
            <View style={styles.bookingActions}>
              <TouchableOpacity
                style={[styles.actionButton, styles.acceptButton]}
                onPress={() => onAction(booking.ID, 'accept')}>
                <Text style={styles.actionText}>Accept</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.rejectButton]}
                onPress={() => onAction(booking.ID, 'reject')}>
                <Text style={styles.actionText}>Reject</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      ))}
    </ScrollView>
  );
};

export default OwnerHomeScreen;
