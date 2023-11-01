import React, { useEffect, useState , useRef} from 'react';
import { Animated, Easing, Image, View, StyleSheet, Alert } from 'react-native';
import { Provider } from 'react-redux';
import Navigation from './StackNavigator';
import { store } from './src/redux/store';
import { settings } from './src/utils/settings';
import messaging from '@react-native-firebase/messaging';
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import * as Animatable from 'react-native-animatable';

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

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log('Message handled in the background!', remoteMessage);
});

export default function App() {
  const [animation] = useState(new Animated.Value(0));
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const circleAnim = useRef(new Animated.Value(0)).current;
  const [appIsReady, setAppIsReady] = useState(false);

  const circlePosition = circleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

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
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        setAppIsReady(true);
      }, 500);
    });

    // İzin istemek ve token'i kaydetmek için fonksiyonumuzu çağıralım.
    requestNotificationPermissionAndStoreToken();

    // Foreground Handling
    const unsubscribeOnMessage = messaging().onMessage(async (remoteMessage) => {
      console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    return () => {
      unsubscribeOnMessage();
    };
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.timing(circleAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);
  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  if (!appIsReady) {
    return (
      <View style={styles.container}>
        <Animatable.View
          animation="zoomIn"
          iterationCount={1}
          style={{
            alignItems: 'center',
          }}
        >
          <Image
            style={{
              height: settings.CARD_WIDTH,
              width: settings.CARD_WIDTH * 2,
              resizeMode: 'contain',
            }}
            source={require('./assets/100yil.png')}
          />
          <Animated.View
            style={{
              position: 'absolute',
              top: settings.CARD_WIDTH / 2,
              left: settings.CARD_WIDTH,
              transform: [
                { translateX: -10 },
                { translateY: -10 },
                { rotate: circlePosition },
                { translateY: 120 },
                { translateX: 10 },
                { translateY: 10 }
              ],
              width: 20,
              height: 20,
              borderRadius: 10,
              backgroundColor: 'red',
            }}
          />
        </Animatable.View>
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
