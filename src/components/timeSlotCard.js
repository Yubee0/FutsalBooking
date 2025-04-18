import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

const TimeSlotCard = ({startTime, endTime, status, onPress, theme}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'AVAILABLE':
        return theme.SUCCESS;
      case 'BOOKED':
        return theme.ERROR;
      case 'RESERVED':
        return theme.WARNING;
      default:
        return theme.GRAY;
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={status !== 'AVAILABLE'}
      activeOpacity={0.7}>
      <View style={[styles.card, {backgroundColor: theme.WHITE}]}>
        <View style={styles.timeContainer}>
          <Text style={[styles.timeText, {color: theme.TEXT_PRIMARY}]}>
            {startTime} - {endTime}
          </Text>
        </View>
        <View style={styles.statusContainer}>
          <View
            style={[styles.statusBadge, {backgroundColor: getStatusColor()}]}>
            <Text style={styles.statusText}>{status}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 1,
  },
  timeContainer: {
    flex: 1,
  },
  timeText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusContainer: {
    marginLeft: 10,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 15,
  },
  statusText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
});

export default TimeSlotCard;
