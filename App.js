import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AppNavigator from './src/navigation/appNavigator';
import './firebaseConfig';
import {DropdownAlertWrapper} from './src/components/Alert';

const App = () => {
  return (
    <>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
      <DropdownAlertWrapper />
    </>
  );
};

export default App;
