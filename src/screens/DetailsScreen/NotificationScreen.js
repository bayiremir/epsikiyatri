import {StyleSheet, Text, View, Button} from 'react-native';
import React from 'react';
import firestore from '@react-native-firebase/firestore';

async function sendNotificationsToAll() {
  try {
    // Firestore'dan tüm kullanıcı tokenlerini al
    const usersRef = firestore().collection('users');
    const snapshot = await usersRef.get();

    const tokens = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.token) {
        tokens.push(data.token);
      }
    });

    // Her token için FCM API ile bildirim gönder
    tokens.forEach(token => {
      sendNotification(token);
    });
  } catch (error) {
    console.error('Error sending notifications:', error);
  }
}

async function sendNotification(token) {
  const message = {
    to: token,
    notification: {
      title: 'Yeni Bildirim',
      body: 'Bu bir test bildirimidir.',
    },
  };

  const response = await fetch('https://fcm.googleapis.com/fcm/send', {
    method: 'POST',
    headers: {
      Authorization: `key=AAAA5K-3TgQ:APA91bH318oG4LgkZ1kRZ07D02ZPut_s64wX6WJBNwAWQlQIB7acCZiYcmZK0BbxLf-lREhJUnYNnnENYgdPR-KtpmzAkNvyUYHJZ5xO6pBWg5wGHthfz1HwYg3PMLJgHEqiljnP-QY4`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });

  if (!response.ok) {
    // Hata varsa HTTP yanıtını logla
    const text = await response.text();
    console.error('Error from FCM:', text);
    return;
  }

  const responseData = await response.json();
  console.log(responseData);
}

const NotificationScreen = () => {
  return (
    <View>
      <Button
        title="Herkese Bildirim Gönder"
        onPress={sendNotificationsToAll}
      />
    </View>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({});
