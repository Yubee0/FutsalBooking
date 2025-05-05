import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import {signupUser} from '../../redux/slices/authThunk';
import Button from '../../components/Button';
import {colors} from '../../constants/color';
import styles from './styles';
import {AlertType} from '../../components/DropdownAlert';
import {showAlert} from '../../components/Alert';
import {useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

const SignupScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('owner');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
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
    try {
      await dispatch(signupUser({name, email, password, phone, role})).unwrap();

      showAlert(AlertType.SUCCESS, 'Account created successfully!');
      navigation.navigate('Login');
    } catch (error) {
      showAlert(
        AlertType.ERROR,
        error || 'Failed to create account. Please try again.',
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
          textStyle={{fontSize: 18}}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default SignupScreen;
