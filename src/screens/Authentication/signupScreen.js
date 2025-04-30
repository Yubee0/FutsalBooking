import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Config from 'react-native-config';
import Button from '../../components/Button';
import {colors} from '../../constants/color';
import styles from './styles';
import {AlertType} from '../../components/DropdownAlert';
import {showAlert} from '../../components/Alert';

const SignupScreen = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('owner');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    let newErrors = {};
    if (!name) {
      newErrors.name = 'Name is required';
    }
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!email.includes('@')) {
      newErrors.email = 'Invalid email';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 4) {
      newErrors.password = 'Minimum 4 characters';
    }
    if (!phone) {
      newErrors.phone = 'Phone number is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    const payload = {name, email, password, phone, role};

    try {
      const response = await fetch(`${Config.API_URL}/auth/register`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload),
      });

      const text = await response.text();
      const data = JSON.parse(text);

      if (!response.ok) {
        if (data.error === 'User already exists') {
          showAlert(
            AlertType.ERROR,
            'An account with this email already exists',
          );
        } else {
          throw new Error(data.message || 'Registration failed');
        }
        return;
      }

      showAlert(AlertType.SUCCESS, 'Account created successfully!', [
        {text: 'OK', onPress: () => navigation.navigate('Login')},
      ]);
    } catch (error) {
      console.error('Signup Error:', error);
      showAlert(
        AlertType.ERROR,
        error.message || 'Failed to create account. Please try again.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.screenContainer}>
      <View style={styles.innerContainer}>
        <View style={styles.authHeader}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join our community today</Text>
        </View>

        <View style={styles.roleToggle}>
          <Button
            title="Owner"
            onPress={() => setRole('owner')}
            backgroundColor={role === 'owner' ? colors.PRIMARY : colors.WHITE}
            textColor={role === 'owner' ? colors.WHITE : colors.PRIMARY}
            style={{marginRight: 8, borderRadius: 20}}
          />
          <Button
            title="Player"
            onPress={() => setRole('player')}
            backgroundColor={role === 'player' ? colors.PRIMARY : colors.WHITE}
            textColor={role === 'player' ? colors.WHITE : colors.PRIMARY}
            style={{borderRadius: 20}}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={[styles.input, errors.name && styles.errorInput]}
            placeholder="Enter your full name"
            placeholderTextColor={colors.GRAY}
            value={name}
            onChangeText={setName}
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={[styles.input, errors.phone && styles.errorInput]}
            placeholder="Enter your phone number"
            placeholderTextColor={colors.GRAY}
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
          {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={[styles.input, errors.email && styles.errorInput]}
            placeholder="Enter your email"
            placeholderTextColor={colors.GRAY}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={[styles.input, errors.password && styles.errorInput]}
            placeholder="Create a password (min 4 chars)"
            placeholderTextColor={colors.GRAY}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          {errors.password && (
            <Text style={styles.errorText}>{errors.password}</Text>
          )}
        </View>

        <Button
          title="Sign Up"
          onPress={handleSignup}
          loading={isLoading}
          disabled={isLoading}
          style={styles.primaryButton}
          textStyle={styles.buttonText}
        />

        <Button
          title="Already have an account? Login"
          onPress={() => navigation.navigate('Login')}
          backgroundColor="transparent"
          textColor={colors.PRIMARY}
          style={styles.secondaryButton}
          textStyle={{fontSize: 14}}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default SignupScreen;
