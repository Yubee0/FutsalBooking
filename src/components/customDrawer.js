import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {ownerColors, playerColors} from '../constants/color';
import Button from './Button';
import {logoutUser} from '../redux/actions/authActions';

// Custom Avatar Component
const CustomAvatar = ({
  initials,
  size = 64,
  backgroundColor = '#6200ee',
  textColor = '#fff',
}) => {
  return (
    <View
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: backgroundColor,
        },
      ]}>
      <Text
        style={[
          styles.avatarText,
          {
            color: textColor,
            fontSize: size / 2.5,
          },
        ]}>
        {initials}
      </Text>
    </View>
  );
};

const CustomDrawer = ({navigation, state}) => {
  const {user} = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const isOwner = user?.role === 'owner';
  const theme = isOwner ? ownerColors : playerColors;

  const getInitials = () => {
    if (user?.name) {
      return user.name
        .split(' ')
        .slice(0, 2)
        .map(n => n[0])
        .join('')
        .toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  const initials = getInitials();

  const menuItems = [
    {
      label: 'Home',
      screen: isOwner ? 'OwnerHome' : 'PlayerHome',
      icon: 'home',
      iconType: 'MaterialIcons',
    },
    {
      label: 'Profile',
      screen: 'Profile',
      icon: 'person',
      iconType: 'MaterialIcons',
    },
    {
      label: 'Settings',
      screen: 'Settings',
      icon: 'settings',
      iconType: 'MaterialIcons',
    },
    {type: 'divider'},
    ...(isOwner
      ? [
          {
            label: 'Manage Ground',
            screen: 'ManageGround',
            icon: 'stadium', // 🛠️ use 'stadium'
            iconType: 'MaterialCommunityIcons',
          },
          {
            label: 'Booking Requests',
            screen: 'BookingRequests',
            icon: 'clipboard-list-outline', // 🛠️ fix to 'clipboard-list-outline'
            iconType: 'MaterialCommunityIcons',
          },
          {
            label: 'Create Ground',
            screen: 'CreateGround',
            icon: 'plus-box',
            iconType: 'MaterialCommunityIcons',
          },
        ]
      : [
          {
            label: 'Find Grounds',
            screen: 'FindGrounds',
            icon: 'magnify', // 🛠️ use 'magnify' from MaterialCommunityIcons
            iconType: 'MaterialCommunityIcons',
          },
          {
            label: 'My Bookings',
            screen: 'MyBookings',
            icon: 'calendar-text', // 🛠️ 'calendar-text' instead of 'event-note'
            iconType: 'MaterialCommunityIcons',
          },
        ]),
  ];

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser());
      navigation.reset({
        index: 0,
        routes: [{name: 'Login'}],
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const renderIcon = (item, isActive) => {
    const color = isActive ? theme.PRIMARY : theme.GRAY;
    if (item.iconType === 'MaterialCommunityIcons') {
      return (
        <MaterialCommunityIcons
          name={item.icon}
          size={20}
          color={color}
          style={styles.menuIcon}
        />
      );
    }
    return (
      <MaterialIcons
        name={item.icon}
        size={20}
        color={color}
        style={styles.menuIcon}
      />
    );
  };

  const renderMenuItem = (item, index) => {
    if (item.type === 'divider') {
      return (
        <View
          key={`divider-${index}`}
          style={[styles.divider, {backgroundColor: theme.BORDER}]}
        />
      );
    }

    const isActive = state.routes[state.index].name === item.screen;
    return (
      <TouchableOpacity
        key={`menu-${index}`}
        style={[
          styles.menuItem,
          isActive && {
            backgroundColor: theme.PRIMARY_LIGHT,
            borderLeftWidth: 4,
            borderLeftColor: theme.PRIMARY,
          },
        ]}
        onPress={() => navigation.navigate(item.screen)}>
        {renderIcon(item, isActive)}
        <Text
          style={[
            styles.menuText,
            {color: isActive ? theme.PRIMARY : theme.TEXT_PRIMARY},
          ]}>
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, {backgroundColor: theme.WHITE}]}>
      <View
        style={[styles.profileContainer, {borderBottomColor: theme.BORDER}]}>
        {/* Custom Avatar */}
        <CustomAvatar
          initials={initials}
          size={64}
          backgroundColor={theme.PRIMARY}
          textColor="#FFFFFF"
        />

        {user?.name && (
          <Text style={[styles.name, {color: theme.TEXT_PRIMARY}]}>
            {user.name}
          </Text>
        )}
        {user?.email && (
          <Text style={[styles.email, {color: theme.TEXT_SECONDARY}]}>
            {user.email}
          </Text>
        )}
        <View style={[styles.roleBadge, {backgroundColor: theme.PRIMARY_DARK}]}>
          <Text style={styles.roleText}>{isOwner ? 'OWNER' : 'PLAYER'}</Text>
        </View>
      </View>

      <View style={styles.menuContainer}>{menuItems.map(renderMenuItem)}</View>

      <View style={styles.footer}>
        <Button
          title="Logout"
          onPress={handleLogout}
          backgroundColor={theme.ERROR}
          textColor={theme.WHITE}
          style={styles.logoutButton}
          icon={
            <MaterialIcons name="exit-to-app" size={20} color={theme.WHITE} />
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileContainer: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  avatar: {
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontWeight: 'bold',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
  },
  email: {
    fontSize: 14,
    marginTop: 2,
  },
  roleBadge: {
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  menuContainer: {
    flex: 1,
    paddingTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginVertical: 2,
  },
  menuIcon: {
    width: 24,
    textAlign: 'center',
  },
  menuText: {
    fontSize: 16,
    marginLeft: 15,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    marginVertical: 8,
  },
  footer: {
    padding: 20,
  },
  logoutButton: {
    borderRadius: 8,
  },
});

export default CustomDrawer;
