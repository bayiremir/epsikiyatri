import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Switch,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import uuid from 'react-native-uuid';
import LottieView from 'lottie-react-native';
import {ArrowLeftIcon as ArrowLeftIconOutline} from 'react-native-heroicons/outline';
import {useNavigation} from '@react-navigation/native';

const getUserId = async () => {
  let userId = await AsyncStorage.getItem('user_id');
  if (userId == null) {
    userId = uuid.v4();
    await AsyncStorage.setItem('user_id', userId);
  }
  return userId;
};
const NotificationSettings = () => {
  const sanitizeTopic = topic => {
    return topic
      .replace(/ /g, '_')
      .replace(/ç/g, 'c')
      .replace(/ğ/g, 'g')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ş/g, 's')
      .replace(/ü/g, 'u')
      .replace(/Ç/g, 'C')
      .replace(/Ğ/g, 'G')
      .replace(/İ/g, 'I')
      .replace(/Ö/g, 'O')
      .replace(/Ş/g, 'S')
      .replace(/Ü/g, 'U');
  };
  const navigation = useNavigation();
  const [userID, setUserID] = useState(null);
  const INITIAL_TOPICS = {
    Psikiyatri: false,
    EriskinPsikiyatrisi: false,
    Bagimlilik: false,
    GencErgenPsikiyatrisi: false,
  };

  const DISPLAY_TOPICS = {
    Psikiyatri: 'Psikiyatri',
    EriskinPsikiyatrisi: 'Erişkin Psikiyatrisi',
    Bagimlilik: 'Bağımlılık',
    GencErgenPsikiyatrisi: 'Genç-Ergen Psikiyatrisi',
  };
  const [isSubscribed, setIsSubscribed] = useState(INITIAL_TOPICS);
  const [loading, setLoading] = useState(false); // Yeni state

  useEffect(() => {
    const initialize = async () => {
      const id = await getUserId();
      setUserID(id);
      await loadSubscriptionsFromFirestore(id);
    };
    initialize();
  }, []);

  const loadSubscriptionsFromFirestore = async userId => {
    const userDoc = firestore().collection('subscriptions').doc(userId);
    const doc = await userDoc.get();
    let newSubscribedState = {...INITIAL_TOPICS};

    if (doc.exists && doc.data().topics) {
      const {topics} = doc.data();
      for (const topic in INITIAL_TOPICS) {
        newSubscribedState[topic] = topics.includes(sanitizeTopic(topic));
      }
    }
    setIsSubscribed(newSubscribedState);
  };

  const handleSubscribe = async topic => {
    setLoading(true);
    const sanitizedTopic = sanitizeTopic(topic);
    const userDoc = firestore().collection('subscriptions').doc(userID);
    const doc = await userDoc.get();

    if (!doc.exists) {
      await userDoc.set({topics: []});
    }

    const updatedValue = !isSubscribed[topic];
    let updatedTopics = [...(doc.data()?.topics || [])];

    if (updatedValue) {
      updatedTopics.push(sanitizedTopic);
    } else {
      updatedTopics = updatedTopics.filter(t => t !== sanitizedTopic);
    }

    await userDoc.set({topics: updatedTopics});
    setIsSubscribed(prevState => ({...prevState, [topic]: updatedValue}));
    setLoading(false);
  };

  return (
    <View style={{flex: 1}}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 16,
          paddingTop: 40,
          backgroundColor: 'rgba(64,183,176,0.3)',
        }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{position: 'absolute', left: 26, top: 60}}>
          <ArrowLeftIconOutline
            width={35}
            height={35}
            right={10}
            color="black"
          />
        </TouchableOpacity>

        <Image
          source={require('../../../assets/photo/logo.png')}
          style={styles.logo}
        />
      </View>
      {loading && (
        <View
          style={{
            position: 'absolute',
            flex: 1,
            zIndex: 1,
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.2)',
          }}>
          <LottieView
            source={require('../../../assets/loadingAnimation.json')}
            autoPlay
            loop
          />
        </View>
      )}
      <View style={{alignItems: 'center', marginTop: 20}}>
        <Text
          style={{
            fontSize: 32,
            fontWeight: '600',
            color: 'rgba(64,183,176,1)',
          }}>
          Bildirim Ayarları
        </Text>
        <View style={styles.divider}></View>

        <View>
          {Object.keys(DISPLAY_TOPICS).map((topicKey, index) => (
            <View key={index} style={styles.topicContainer}>
              <Text style={styles.topicText}>{DISPLAY_TOPICS[topicKey]}</Text>
              <Switch
                disabled={loading}
                trackColor={{false: 'default', true: 'default'}}
                thumbColor={isSubscribed[topicKey] ? 'default' : 'default'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={() => handleSubscribe(topicKey)}
                value={isSubscribed[topicKey]}
              />
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default NotificationSettings;

const styles = StyleSheet.create({
  divider: {
    height: 3,
    width: '70%',
    backgroundColor: 'rgba(64,183,176,1)',
    marginBottom: 10,
    marginTop: 5,
    justifyContent: 'center',
  },
  topicContainer: {
    width: 300,
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  topicText: {
    fontSize: 16,
  },
  logo: {
    resizeMode: 'contain',
    alignSelf: 'center',
    width: 200,
    height: 70,
  },
});
