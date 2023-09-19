import React, { useRef, useEffect } from 'react';
import { View, Animated, Easing, StyleSheet } from 'react-native';

const RotateImage = () => {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 4000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.fullScreenContainer}>
      <Animated.Image
        style={[
          styles.fullScreenAnimation,
          {
            transform: [{ rotate: spin }],
          },
        ]}
        source={require("../../assets/photo/logo.png")} // 360 derece döndürmek istediğiniz icon.png dosyası
      />
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenAnimation: {
    width: 250,
    height: 250,
  },
});

export default RotateImage;
