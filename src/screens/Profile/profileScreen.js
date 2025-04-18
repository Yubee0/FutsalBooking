import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import {useSelector} from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {ownerColors, playerColors} from '../../constants/color';
import styles from './styles';

const ProfileScreen = () => {
  const {user} = useSelector(state => state.auth);
  const isOwner = user?.role === 'owner';
  const theme = isOwner ? ownerColors : playerColors;

  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [bio, setBio] = useState(user?.bio || 'Tell us about yourself');

  const handleUpdateName = () => {
    if (name.trim() === '') {
      Alert.alert('Please enter your name');
      return;
    }
    console.log('Name Updated:', name);
    setIsEditingName(false);
  };

  const handleUpdateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Please enter a valid email address');
      return;
    }
    console.log('Email Updated:', email);
    setIsEditingEmail(false);
  };

  const handleUpdateBio = () => {
    if (bio.trim() === '') {
      Alert.alert('Bio cannot be empty');
      return;
    }
    console.log('Bio Updated:', bio);
    setIsEditingBio(false);
  };

  const getInitials = () => {
    if (name) {
      return name
        .split(' ')
        .slice(0, 2)
        .map(n => n[0])
        .join('')
        .toUpperCase();
    }
    return 'U';
  };

  return (
    <ScrollView style={[styles.container, {backgroundColor: theme.BACKGROUND}]}>
      <View style={styles.profileHeader}>
        <View style={[styles.avatar, {backgroundColor: theme.PRIMARY}]}>
          <Text style={styles.avatarText}>{getInitials()}</Text>
        </View>
        <Text style={[styles.roleBadge, {backgroundColor: theme.PRIMARY_DARK}]}>
          {isOwner ? 'OWNER' : 'PLAYER'}
        </Text>
      </View>

      <View style={[styles.infoSection, {backgroundColor: theme.WHITE}]}>
        <Text style={[styles.sectionTitle, {color: theme.PRIMARY}]}>
          PERSONAL INFO
        </Text>

        <View style={styles.infoItem}>
          <Text style={[styles.infoLabel, {color: theme.TEXT_SECONDARY}]}>
            NAME
          </Text>
          {isEditingName ? (
            <>
              <TextInput
                style={[
                  styles.input,
                  {color: theme.TEXT_PRIMARY, borderBottomColor: theme.PRIMARY},
                ]}
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
              />
              <TouchableOpacity
                style={[styles.updateButton, {backgroundColor: theme.PRIMARY}]}
                onPress={handleUpdateName}>
                <Text style={[styles.updateButtonText, {color: theme.WHITE}]}>
                  UPDATE
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.infoRow}>
              <Text style={[styles.infoValue, {color: theme.TEXT_PRIMARY}]}>
                {name}
              </Text>
              <TouchableOpacity onPress={() => setIsEditingName(true)}>
                <MaterialIcons name="edit" size={20} color={theme.PRIMARY} />
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.infoItem}>
          <Text style={[styles.infoLabel, {color: theme.TEXT_SECONDARY}]}>
            EMAIL
          </Text>
          {isEditingEmail ? (
            <>
              <TextInput
                style={[
                  styles.input,
                  {color: theme.TEXT_PRIMARY, borderBottomColor: theme.PRIMARY},
                ]}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                keyboardType="email-address"
              />
              <TouchableOpacity
                style={[styles.updateButton, {backgroundColor: theme.PRIMARY}]}
                onPress={handleUpdateEmail}>
                <Text style={[styles.updateButtonText, {color: theme.WHITE}]}>
                  UPDATE
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.infoRow}>
              <Text style={[styles.infoValue, {color: theme.TEXT_PRIMARY}]}>
                {email}
              </Text>
              <TouchableOpacity onPress={() => setIsEditingEmail(true)}>
                <MaterialIcons name="edit" size={20} color={theme.PRIMARY} />
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.infoItem}>
          <Text style={[styles.infoLabel, {color: theme.TEXT_SECONDARY}]}>
            BIO
          </Text>
          {isEditingBio ? (
            <>
              <TextInput
                style={[
                  styles.input,
                  {color: theme.TEXT_PRIMARY, borderBottomColor: theme.PRIMARY},
                ]}
                value={bio}
                onChangeText={setBio}
                placeholder="Tell us about yourself"
                multiline
              />
              <TouchableOpacity
                style={[styles.updateButton, {backgroundColor: theme.PRIMARY}]}
                onPress={handleUpdateBio}>
                <Text style={[styles.updateButtonText, {color: theme.WHITE}]}>
                  UPDATE
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.infoRow}>
              <Text style={[styles.infoValue, {color: theme.TEXT_PRIMARY}]}>
                {bio}
              </Text>
              <TouchableOpacity onPress={() => setIsEditingBio(true)}>
                <MaterialIcons name="edit" size={20} color={theme.PRIMARY} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;
