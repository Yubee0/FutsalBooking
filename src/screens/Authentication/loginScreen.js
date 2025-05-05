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
import {loginUser} from '../../redux/slices/authThunk';
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
      const result = await dispatch(loginUser({email, password})).unwrap();

      showAlert(AlertType.SUCCESS, 'Logged in successfully!');
      navigation.navigate(
        result.user.role === 'owner' ? 'OwnerDrawer' : 'PlayerDrawer',
      );
    } catch (error) {
      console.error('Login Error:', error);
      let message = error;
      if (error.includes('Incorrect email or password')) {
        message = 'The email or password you entered is incorrect';
      }
      showAlert(AlertType.WARNING, message);
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
