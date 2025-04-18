import 'react-native-gesture-handler';
import 'react-native-reanimated';
import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';

import './firebaseConfig';
import {Provider} from 'react-redux';
import {store} from './src/redux/store';
import AppNavigator from './src/navigation/appNavigator';
import {DropdownAlertWrapper} from './src/components/Alert';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {requestFCMPermissionAndToken} from './src/services/firebasePushNotification';

const App = () => {
  useEffect(() => {
    const initFCM = async () => {
      const fcmToken = await requestFCMPermissionAndToken();
      if (fcmToken) {
        await AsyncStorage.setItem('fcmToken', fcmToken);
      }
    };

    initFCM();
  }, []);

  return (
    <>
      <Provider store={store}>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
        <DropdownAlertWrapper />
      </Provider>
    </>
  );
};

export default App;
