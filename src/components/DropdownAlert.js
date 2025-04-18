import React, {useState, useRef, forwardRef, useImperativeHandle} from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Pressable,
} from 'react-native';
import {colors} from '../constants/color';

export const AlertType = {
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
  SUCCESS: 'success',
};

const DropdownAlert = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState(AlertType.INFO);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useImperativeHandle(ref, () => ({
    showAlert(alertType, alertMessage) {
      setType(alertType);
      setMessage(alertMessage);
      setVisible(true);

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      setTimeout(() => hideAlert(), 3000);
    },
  }));

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

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
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
      <Pressable
        onPress={hideAlert}
        style={[styles.alert, {backgroundColor: getBackgroundColor()}]}>
        <Text style={styles.message}>{message}</Text>
        <TouchableOpacity onPress={hideAlert} style={styles.closeButton}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
      </Pressable>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 30,
    left: 16,
    right: 16,
    zIndex: 999,
    elevation: 6,
  },
  alert: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: {width: 0, height: 3},
    elevation: 6,
  },
  message: {
    color: colors.WHITE,
    flex: 1,
    fontSize: 15,
  },
  closeButton: {
    marginLeft: 12,
  },
  closeText: {
    color: colors.WHITE,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DropdownAlert;
