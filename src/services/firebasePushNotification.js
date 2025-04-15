import messaging from '@react-native-firebase/messaging';

/**
 * Requests notification permission and returns the FCM token
 */
export const requestFCMPermissionAndToken = async () => {
  try {
    const authStatus = await messaging().requestPermission();
    const isAuthorized =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (!isAuthorized) {
      console.log('FCM permission not granted');
      return null;
    }

    const fcmToken = await messaging().getToken();
    console.log('FCM Token:', fcmToken);

    // You can optionally send it to your backend here or export it
    return fcmToken;
  } catch (error) {
    console.error('Error getting FCM permission or token:', error);
    return null;
  }
};
