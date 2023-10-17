import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ContentScreenHeader from '../../components/ContentScreenHeader';
import firestore from '@react-native-firebase/firestore';
import uuid from 'react-native-uuid';

const getUserId = async () => {
  let userId = await AsyncStorage.getItem('user_id');
  if (userId == null) {
    userId = uuid.v4();
    await AsyncStorage.setItem('user_id', userId);
  }
  return userId;
};
const NotificationSettings = () => {
  const [userID, setUserID] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState({
    depresyon: false,
    anksiyete: false,
  });

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

    if (doc.exists && doc.data().topics) {
      const {topics} = doc.data();

      setIsSubscribed({
        depresyon: topics.includes('depresyon'),
        anksiyete: topics.includes('anksiyete'),
      });

      await AsyncStorage.setItem(
        'isSubscribedToDepresyon',
        topics.includes('depresyon').toString(),
      );
      await AsyncStorage.setItem(
        'isSubscribedToAnksiyete',
        topics.includes('anksiyete').toString(),
      );
    } else {
      await AsyncStorage.setItem('isSubscribedToDepresyon', 'false');
      await AsyncStorage.setItem('isSubscribedToAnksiyete', 'false');
    }
  };

  const handleSubscribe = async topic => {
    const userDoc = firestore().collection('subscriptions').doc(userID);

    const doc = await userDoc.get();

    if (!doc.exists) {
      await userDoc.set({topics: []});
    }

    if (isSubscribed[topic]) {
      await messaging().unsubscribeFromTopic(topic);
      await userDoc.update({
        topics: firestore.FieldValue.arrayRemove(topic),
      });
    } else {
      await messaging().subscribeToTopic(topic);
      await userDoc.update({
        topics: firestore.FieldValue.arrayUnion(topic),
      });
    }

    setIsSubscribed({...isSubscribed, [topic]: !isSubscribed[topic]});

    await AsyncStorage.setItem(
      `isSubscribedTo${topic}`,
      (!isSubscribed[topic]).toString(),
    );
  };

  return (
    <ContentScreenHeader>
      <View style={{alignItems: 'center', top: 100}}>
        <Text style={{fontSize: 32, fontWeight: '600'}}>Bildirim Ayarları</Text>
        <View style={styles.divider}></View>

        {['depresyon', 'anksiyete'].map((topic, index) => (
          <TouchableOpacity
            key={index}
            style={styles.topicContainer}
            onPress={() => handleSubscribe(topic)}>
            <Text style={styles.topicText}>{topic}</Text>
            {isSubscribed[topic] && <Text style={styles.checkMark}>✔</Text>}
          </TouchableOpacity>
        ))}
      </View>
    </ContentScreenHeader>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '80%',
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 20,
  },
  topicText: {
    fontSize: 18,
  },
  checkMark: {
    fontSize: 24,
    color: 'green',
  },
});
