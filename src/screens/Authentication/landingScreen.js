import React, {useEffect, useRef} from 'react';
import {View, Text, Image, Animated} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import styles from './styles';

const LandingScreen = () => {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      navigation.navigate('Login');
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigation, fadeAnim]);

  return (
    <View style={styles.landingContainer}>
      <Animated.View style={{opacity: fadeAnim}}>
        <Image
          source={require('../../Assets/logo.jpeg')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.landingTitle}>Urban Nepal</Text>
        <Text style={styles.landingSubtitle}>
          Book your games at your Finger tips
        </Text>
      </Animated.View>
    </View>
  );
};

export default LandingScreen;
