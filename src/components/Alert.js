import {colors} from '../constants/color';
import React, {useState, useRef} from 'react';
import {Text, TouchableOpacity, StyleSheet, Animated} from 'react-native';

export const AlertType = {
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
  SUCCESS: 'success',
};

const DropdownAlert = () => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState(AlertType.INFO);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const showAlert = (alertType, alertMessage) => {
    setType(alertType);
    setMessage(alertMessage);
    setVisible(true);

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    setTimeout(() => hideAlert(), 3000);
  };

  const hideAlert = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setVisible(false));
  };

  const getBackgroundColor = () => {
    switch (type) {
      case AlertType.INFO:
        return colors.INFO;
      case AlertType.WARNING:
        return colors.WARNING;
      case AlertType.ERROR:
        return colors.ERROR;
      case AlertType.SUCCESS:
        return colors.SUCCESS;
      default:
        return colors.PRIMARY;
    }
  };

  if (!visible) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.alert,
        {
          backgroundColor: getBackgroundColor(),
          opacity: fadeAnim,
          transform: [
            {
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-100, 0],
              }),
            },
          ],
        },
      ]}>
      <Text style={styles.message}>{message}</Text>
      <TouchableOpacity onPress={hideAlert} style={styles.closeButton}>
        <Text style={styles.closeText}>✕</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  alert: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 999,
    elevation: 5,
  },
  message: {
    color: colors.WHITE,
    flex: 1,
    fontSize: 16,
  },
  closeButton: {
    marginLeft: 10,
  },
  closeText: {
    color: colors.WHITE,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

let dropdownRef = null;
export const DropdownAlertWrapper = () => {
  dropdownRef = useRef();
  return <DropdownAlert ref={dropdownRef} />;
};

export const showAlert = (type, message) => {
  if (dropdownRef.current) {
    dropdownRef.current.showAlert(type, message);
  }
};

export default DropdownAlert;
