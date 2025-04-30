import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export const TimeSlotCard = ({
  startTime,
  endTime,
  status,
  price,
  onPress,
  theme,
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'available':
        return theme.SUCCESS;
      case 'booked':
        return theme.ERROR;
      case 'reserved':
        return theme.WARNING;
      default:
        return theme.GRAY;
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'available':
        return 'check-circle';
      case 'booked':
        return 'cancel';
      case 'reserved':
        return 'timer';
      default:
        return 'help';
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={status !== 'available'}
      style={[styles.card, {backgroundColor: theme.WHITE}]}>
      <View style={styles.timeContainer}>
        <Icon
          name={getStatusIcon()}
          size={20}
          color={getStatusColor()}
          style={styles.icon}
        />
        <View>
          <Text style={[styles.timeText, {color: theme.TEXT_PRIMARY}]}>
            {startTime} - {endTime}
          </Text>
          <Text style={[styles.durationText, {color: theme.TEXT_SECONDARY}]}>
            {calculateDuration(startTime, endTime)} hrs
          </Text>
        </View>
      </View>

      <View style={styles.priceContainer}>
        <Text style={[styles.priceText, {color: theme.PRIMARY}]}>
          Rs. {price || 'N/A'}
        </Text>
        <Icon name="chevron-right" size={20} color={theme.TEXT_SECONDARY} />
      </View>
    </TouchableOpacity>
  );
};

const calculateDuration = (start, end) => {
  const [startHour, startMin] = start.split(':').map(Number);
  const [endHour, endMin] = end.split(':').map(Number);
  return (endHour * 60 + endMin - (startHour * 60 + startMin)) / 60;
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 12,
  },
  timeText: {
    fontSize: 16,
    fontWeight: '500',
  },
  durationText: {
    fontSize: 12,
    marginTop: 2,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
});

export default TimeSlotCard;
