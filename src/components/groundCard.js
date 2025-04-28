import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const GroundCard = ({ground, onPress, theme}) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.card, {borderColor: theme.BORDER}]}>
        <View style={styles.header}>
          <Text style={[styles.name, {color: theme.TEXT_PRIMARY}]}>
            {ground.Name}
          </Text>
          <View style={styles.priceContainer}>
            <Text style={[styles.price, {color: theme.PRIMARY}]}>
              Rs. {ground.price}
            </Text>
          </View>
        </View>
        <View style={styles.details}>
          <View style={styles.detailRow}>
            <Icon name="location-on" size={16} color={theme.GRAY} />
            <Text style={[styles.detailText, {color: theme.TEXT_SECONDARY}]}>
              {ground.Location}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Icon name="star" size={16} color={theme.GRAY} />
            <Text style={[styles.detailText, {color: theme.TEXT_SECONDARY}]}>
              {ground.Rating || '4.5'} (100+ reviews)
            </Text>
          </View>
        </View>
        <View style={styles.footer}>
          <Text style={[styles.status, {color: theme.SUCCESS}]}>
            Open now • Closes at 10 PM
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  priceContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  price: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  details: {
    marginVertical: 5,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 3,
  },
  detailText: {
    marginLeft: 5,
    fontSize: 14,
  },
  footer: {
    marginTop: 10,
  },
  status: {
    fontSize: 14,
  },
});

export default GroundCard;
