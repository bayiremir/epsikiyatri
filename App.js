import React, {useEffect, useState} from 'react';
import {
  Animated,
  Image,
  View,
  StyleSheet,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import {Provider} from 'react-redux';
import Navigation from './StackNavigator';
import {store} from './src/redux/store';
import {settings} from './src/utils/settings';
import {GetFCMTokenAndStore} from './src/utils/pushnotification';
import messaging from '@react-native-firebase/messaging';
import {firebase} from '@react-native-firebase/app';

if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: 'AIzaSyACyE69Vyjnjk3u-iB8WQ5TqMKIPNMSzOg',
    authDomain: 'e-psikiyatri.firebaseapp.com',
    projectId: 'e-psikiyatri',
    storageBucket: 'e-psikiyatri.appspot.com',
    messagingSenderId: '982200569348',
    appId: '1:982200569348:android:5521dbfa28431f43cd2f51',
    databaseURL: 'https://e-psikiyatri.firebaseio.com',
  });
}

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});

export default function App() {
  const [animation] = useState(new Animated.Value(0.3));
  const [appIsReady, setAppIsReady] = useState(false);

  async function requestNotificationPermission() {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          {
            title: 'Bildirim İzinleri',
            message:
              'Uygulamamızın bildirim göndermesi için izin vermelisiniz.',
            buttonNeutral: 'Daha Sonra Sor',
            buttonNegative: 'İptal',
            buttonPositive: 'Tamam',
          },
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Bildirim izni verildi.');
        } else {
          console.log('Bildirim izni reddedildi.');
        }
      } catch (err) {
        console.warn(err);
      }
    }
    if (Platform.OS === 'ios') {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Authorization status:', authStatus);
      }
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
  }, []);

  if (!appIsReady) {
    return (
      <View style={styles.container}>
        <Animated.Image
          style={{
            height: settings.CARD_WIDTH,
            width: settings.CARD_WIDTH * 2,
            resizeMode: 'contain',
            transform: [{scale: animation}],
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
