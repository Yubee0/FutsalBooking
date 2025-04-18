import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export const TimeSlotCard = ({
  startTime,
  endTime,
  status = '',
  price,
  onPress,
  theme,
  date,
  showDate = false,
  loading = false,
  isOwner = false,
  bookingUser,
}) => {
  const getStatusConfig = () => {
    switch (status.toLowerCase()) {
      case 'available':
        return {
          color: theme.SUCCESS,
          icon: 'check-circle',
          bgColor: `${theme.SUCCESS}20`,
          text: 'Available',
        };
      case 'booked':
        return {
          color: theme.ERROR,
          icon: 'event-busy',
          bgColor: `${theme.ERROR}20`,
          text: 'Booked',
        };
      case 'reserved':
        return {
          color: theme.WARNING,
          icon: 'timer',
          bgColor: `${theme.WARNING}20`,
          text: 'Reserved',
        };
      case 'pending':
        return {
          color: theme.INFO,
          icon: 'hourglass-empty',
          bgColor: `${theme.INFO}20`,
          text: 'Processing',
        };
      default:
        return {
          color: theme.GRAY,
          icon: 'help',
          bgColor: `${theme.GRAY}20`,
          text: 'Unknown',
        };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={(!isOwner && status.toLowerCase() !== 'available') || loading}
      activeOpacity={0.7}
      style={[
        styles.card,
        {
          backgroundColor: statusConfig.bgColor,
          borderLeftWidth: 4,
          borderLeftColor: statusConfig.color,
          opacity:
            isOwner || (status.toLowerCase() === 'available' && !loading)
              ? 1
              : 0.8,
        },
      ]}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={theme.PRIMARY} />
          <Text style={[styles.statusText, {color: theme.TEXT_SECONDARY}]}>
            Processing...
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.timeContainer}>
            <View style={styles.statusIndicator}>
              <Icon
                name={statusConfig.icon}
                size={20}
                color={statusConfig.color}
                style={styles.icon}
              />
              <Text style={[styles.statusText, {color: statusConfig.color}]}>
                {statusConfig.text}
              </Text>
            </View>
            <View style={styles.timeDetails}>
              {showDate && date && (
                <Text style={[styles.dateText, {color: theme.TEXT_SECONDARY}]}>
                  {new Date(date).toLocaleDateString()}
                </Text>
              )}
              <Text style={[styles.timeText, {color: theme.TEXT_PRIMARY}]}>
                {startTime} - {endTime}
              </Text>
              <Text
                style={[styles.durationText, {color: theme.TEXT_SECONDARY}]}>
                {calculateDuration(startTime, endTime)} hrs
              </Text>
              {isOwner && status.toLowerCase() === 'booked' && bookingUser && (
                <Text
                  style={[styles.bookingText, {color: theme.TEXT_SECONDARY}]}>
                  Booked by: {bookingUser}
                </Text>
              )}
            </View>
          </View>

          <View style={styles.priceContainer}>
            <Text style={[styles.priceText, {color: theme.PRIMARY}]}>
              Rs. {price || 'N/A'}
            </Text>
            {!isOwner && status.toLowerCase() === 'available' && (
              <Icon
                name="chevron-right"
                size={20}
                color={theme.TEXT_SECONDARY}
              />
            )}
            {isOwner && status.toLowerCase() === 'booked' && (
              <Icon name="info" size={20} color={theme.PRIMARY} />
            )}
          </View>
        </>
      )}
    </TouchableOpacity>
  );
};

const calculateDuration = (start, end) => {
  if (!start || !end) return 0;
  try {
    const [startHour, startMin] = start.split(':').map(Number);
    const [endHour, endMin] = end.split(':').map(Number);
    const duration = (endHour * 60 + endMin - (startHour * 60 + startMin)) / 60;
    return duration.toFixed(1);
  } catch (error) {
    console.error('Error calculating duration:', error);
    return 0;
  }
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  loadingContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusIndicator: {
    flexDirection: 'column',
    alignItems: 'center',
    marginRight: 12,
    minWidth: 60,
  },
  timeDetails: {
    flex: 1,
  },
  icon: {
    marginBottom: 4,
  },
  timeText: {
    fontSize: 16,
    fontWeight: '500',
  },
  durationText: {
    fontSize: 12,
    marginTop: 2,
  },
  bookingText: {
    fontSize: 12,
    marginTop: 4,
    fontStyle: 'italic',
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
  dateText: {
    fontSize: 12,
    marginBottom: 2,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default TimeSlotCard;
