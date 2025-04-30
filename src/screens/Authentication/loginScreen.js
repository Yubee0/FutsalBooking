import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {useDispatch} from 'react-redux';
import Config from 'react-native-config';
import {setCredentials} from '../../redux/slices/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {colors} from '../../constants/color';
import Button from '../../components/Button';
import styles from './styles';
import {AlertType} from '../../components/DropdownAlert';
import {showAlert} from '../../components/Alert';

const LoginScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!email.includes('@')) {
      newErrors.email = 'Invalid email';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${Config.API_URL}/auth/login`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email, password}),
      });

      const responseText = await response.text();
      console.log('Raw server response:', responseText); // Log raw response

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Failed to parse JSON:', responseText);
        if (responseText.includes('<!DOCTYPE html>')) {
          throw new Error('Server returned HTML page. Check your API URL.');
        }
        throw new Error('Invalid server response format');
      }

      if (!response.ok) {
        console.log('Login failed with status:', response.status, data);
        if (data.error === 'Invalid credentials') {
          throw new Error('Incorrect email or password');
        }
        throw new Error(data.message || `Login failed (${response.status})`);
      }

      if (!data.token || !data.role) {
        throw new Error('Server response missing required fields');
      }

      await AsyncStorage.setItem('token', data.token);
      dispatch(
        setCredentials({
          token: data.token,
          user: {email: data.email, role: data.role},
        }),
      );

      // Using custom alert for success
      showAlert(AlertType.SUCCESS, 'Logged in successfully!');
      navigation.navigate(
        data.role === 'owner' ? 'OwnerDrawer' : 'PlayerDrawer',
      );
    } catch (error) {
      console.error('Login Error:', error.message, error.stack);
      let message = error.message;
      if (message.includes('Incorrect email or password')) {
        message = 'The email or password you entered is incorrect';
      }
      showAlert(AlertType.WARNING, message);
    } finally {
      setIsLoading(false);
    }
  };

  // const handleLogin = async () => {
  //   setIsLoading(true);

  //   try {
  //     // Simulate successful login with dummy data
  //     const dummyToken = 'dummy-auth-token';
  //     const dummyEmail = 'player@example.com';

  //     await AsyncStorage.setItem('token', dummyToken);
  //     dispatch(
  //       setCredentials({
  //         token: dummyToken,
  //         user: {email: dummyEmail, role: 'player'},
  //       }),
  //     );

  //     showAlert(AlertType.SUCCESS, 'Login Successful.');
  //     navigation.navigate('PlayerDrawer');
  //   } catch (error) {
  //     console.error('Login Error:', error);
  //     showAlert(AlertType.ERROR, 'An error occurred during login');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.screenContainer}>
      <View style={styles.innerContainer}>
        <View style={styles.authHeader}>
          <Image
            source={require('../../Assets/logo.jpeg')}
            style={{
              width: 80,
              height: 80,
              alignSelf: 'center',
              marginBottom: 16,
            }}
          />
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue your journey</Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={[styles.input, errors.email && styles.errorInput]}
            placeholder="Enter your email"
            placeholderTextColor={colors.GRAY}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={[styles.input, errors.password && styles.errorInput]}
            placeholder="Enter your password"
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
          title="Login"
          onPress={handleLogin}
          loading={isLoading}
          disabled={isLoading}
          style={styles.primaryButton}
          textStyle={styles.buttonText}
        />

        <Button
          title="Don't have an account? Sign Up"
          onPress={() => navigation.navigate('Signup')}
          backgroundColor="transparent"
          textColor={colors.PRIMARY}
          style={styles.secondaryButton}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
