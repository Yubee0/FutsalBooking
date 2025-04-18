import React from 'react';
import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import {useSelector} from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {ownerColors, playerColors} from '../../constants/color';
import styles from './style';

const SettingsScreen = ({navigation}) => {
  const {user} = useSelector(state => state.auth);
  const isOwner = user?.role === 'owner';
  const theme = isOwner ? ownerColors : playerColors;

  const settingsOptions = [
    {
      title: 'Appearance',
      icon: <MaterialIcons name="color-lens" size={24} color={theme.PRIMARY} />,
      screen: 'Appearance',
    },
    {
      title: 'Notifications',
      icon: (
        <MaterialIcons name="notifications" size={24} color={theme.PRIMARY} />
      ),
      screen: 'Notifications',
    },
    {
      title: 'Privacy & Security',
      icon: <MaterialIcons name="lock" size={24} color={theme.PRIMARY} />,
      screen: 'Privacy',
    },
    {
      title: 'Help & Support',
      icon: <MaterialIcons name="help" size={24} color={theme.PRIMARY} />,
      screen: 'Help',
    },
    {
      title: 'About',
      icon: (
        <MaterialCommunityIcons
          name="information"
          size={24}
          color={theme.PRIMARY}
        />
      ),
      screen: 'About',
    },
  ];

  return (
    <ScrollView style={[styles.container, {backgroundColor: theme.BACKGROUND}]}>
      <View style={[styles.section, {backgroundColor: theme.WHITE}]}>
        {settingsOptions.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.settingItem}
            onPress={() => navigation.navigate(item.screen)}>
            {item.icon}
            <Text style={[styles.settingText, {color: theme.TEXT_PRIMARY}]}>
              {item.title}
            </Text>
            <MaterialIcons name="chevron-right" size={24} color={theme.GRAY} />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.versionContainer}>
        <Text style={[styles.versionText, {color: theme.TEXT_SECONDARY}]}>
          Version 1.0.0
        </Text>
      </View>
    </ScrollView>
  );
};

export default SettingsScreen;
