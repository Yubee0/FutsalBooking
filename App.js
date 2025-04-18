import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';

import './firebaseConfig';
import {Provider} from 'react-redux';
import {store} from './src/redux/store';
import AppNavigator from './src/navigation/appNavigator';
import {DropdownAlertWrapper} from './src/components/Alert';
import {requestFCMPermissionAndToken} from './src/services/firebasePushNotification';

const App = () => {
  useEffect(() => {
    const initFCM = async () => {
      const fcmToken = await requestFCMPermissionAndToken();
      if (fcmToken) {
        // TODO: send fcmToken to your backend via fetch to ngrok endpoint
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
