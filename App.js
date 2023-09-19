import React, { useEffect, useState } from 'react';
import { Animated, Image, View, StyleSheet, Platform, Alert } from 'react-native';
import { Provider } from 'react-redux';
import Navigation from "./StackNavigator";
import { store } from "./src/redux/store";
import { settings } from './src/utils/settings';
import { GetFCMTokenAndStore } from './src/utils/pushnotification';
import messaging from '@react-native-firebase/messaging';

// Background & Quit Handling
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});

export default function App() {
  const [animation] = useState(new Animated.Value(0.3));
  const [appIsReady, setAppIsReady] = useState(false);

  async function requestNotificationPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  
    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }


  useEffect(() => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        setAppIsReady(true);
      }, 1000);
    });

    GetFCMTokenAndStore();
    requestNotificationPermission();

    // Foreground Handling
    const unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
      console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });
    
    return () => {
      unsubscribeOnMessage();
    };

  }, []);

  if (!appIsReady) {
    return (
      <View style={styles.container}>
        <Animated.Image
          style={{
            height: settings.CARD_WIDTH,
            width: settings.CARD_WIDTH * 2,
            resizeMode: "contain",
            transform: [{ scale: animation }],
          }}
          source={require('./assets/logo.png')}
        />
      </View>
    );
  }

  return (
    <Provider store={store}>
      <Navigation />
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
