import React, {useEffect, useState} from 'react';
import {Animated, Image, View, StyleSheet, Platform, Alert} from 'react-native';
import {Provider} from 'react-redux';
import Navigation from './StackNavigator';
import {store} from './src/redux/store';
import {settings} from './src/utils/settings';
import {GetFCMTokenAndStore} from './src/utils/pushnotification';
import messaging from '@react-native-firebase/messaging';
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';

// Firebase yapılandırması.
const yourFirebaseConfig = {
  apiKey: 'AIzaSyACyE69Vyjnjk3u-iB8WQ5TqMKIPNMSzOg',
  authDomain: 'e-psikiyatri.firebaseapp.com',
  projectId: 'e-psikiyatri',
  storageBucket: 'e-psikiyatri.appspot.com',
  messagingSenderId: '982200569348',
  appId: '1:982200569348:android:5521dbfa28431f43cd2f51',
  databaseURL: 'https://e-psikiyatri.firebaseio.com', // Bu satırı ekleyin.
};

// Firebase başlatma işlemi
if (!firebase.apps.length) {
  firebase.initializeApp(yourFirebaseConfig);
}

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});

export default function App() {
  const [animation] = useState(new Animated.Value(0.3));
  const [appIsReady, setAppIsReady] = useState(false);

  async function requestNotificationPermissionAndStoreToken() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
      const token = await messaging().getToken();
      if (token) {
        console.log('FCM Token:', token);
        const tokenExists = await checkIfTokenExists(token);
        if (!tokenExists) {
          // Token Firestore'da yoksa kaydedelim.
          await saveTokenToFirestore(token);
        }
      } else {
        console.log('Failed to get FCM token');
      }
    }
  }

  async function checkIfTokenExists(token) {
    // Firestore'dan belirtilen token'e sahip bir kaydın olup olmadığını kontrol edelim.
    const tokenDocument = await firestore()
      .collection('user_tokens')
      .where('token', '==', token)
      .get();

    // Eğer belirtilen token'e sahip bir kayıt varsa true dönelim.
    return !tokenDocument.empty;
  }

  async function saveTokenToFirestore(token) {
    try {
      // Token'i belirlediğiniz bir Firestore koleksiyonuna kaydedebilirsiniz.
      // Örnek olarak "user_tokens" koleksiyonunu kullandım. İhtiyacınıza göre değiştirebilirsiniz.
      await firestore().collection('user_tokens').add({
        token: token,
        createdAt: firestore.Timestamp.now(),
      });
      console.log('Token saved to Firestore');
    } catch (error) {
      console.log('Error saving token to Firestore', error);
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

    // İzin istemek ve token'i kaydetmek için fonksiyonumuzu çağıralım.
    requestNotificationPermissionAndStoreToken();

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
