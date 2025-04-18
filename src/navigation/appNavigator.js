import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';

import CustomDrawer from '../components/customDrawer';
import LoginScreen from '../screens/Authentication/loginScreen';
import SignupScreen from '../screens/Authentication/signupScreen';
import LandingScreen from '../screens/Authentication/landingScreen';
import OwnerHomeScreen from '../screens/OwnerScreens/MyGround/ownerHomeScreen';
import CreateGroundScreen from '../screens/OwnerScreens/MyGround/createGround';
import PlayerHomeScreen from '../screens/PlayerScreens/GroundLists/playerHomeScreen';
import ProfileScreen from '../screens/Profile/profileScreen';
import SettingsScreen from '../screens/Settings/settingScreen';
import GroundTimeSlotScreen from '../screens/GroundDetails/groundTimeSlot';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const OwnerDrawerNavigator = () => (
  <Drawer.Navigator
    screenOptions={{
      drawerType: 'front',
      overlayColor: 'transparent',
    }}
    drawerContent={props => <CustomDrawer {...props} />}>
    <Drawer.Screen name="OwnerHome" component={OwnerHomeScreen} />
    <Drawer.Screen name="CreateGround" component={CreateGroundScreen} />
  </Drawer.Navigator>
);

const PlayerDrawerNavigator = () => (
  <Drawer.Navigator drawerContent={props => <CustomDrawer {...props} />}>
    <Drawer.Screen name="PlayerHome" component={PlayerHomeScreen} />
  </Drawer.Navigator>
);

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Landing">
      <Stack.Screen
        name="Landing"
        component={LandingScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Signup"
        component={SignupScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="OwnerDrawer"
        component={OwnerDrawerNavigator}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="PlayerDrawer"
        component={PlayerDrawerNavigator}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="GroundDetail"
        component={GroundTimeSlotScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
