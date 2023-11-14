import React from 'react';
import {View, Text, TouchableOpacity, Linking} from 'react-native';
import {Platform} from 'react-native';
import {settings} from '../../utils/settings';
import {PaperAirplaneIcon as PaperAirplaneIcon} from 'react-native-heroicons/outline';
import analytics from '@react-native-firebase/analytics';

const RandevuAl = () => {
  const bottomValue = Platform.select({
    ios: settings.CARD_WIDTH / 2.3,
    android: settings.CARD_WIDTH / 3,
  });

  const handlePress = async () => {
    try {
      await Linking.openURL('https://online.npistanbul.com/login');
      await analytics().logEvent('randevu_button_mobileApp', {
        content_type: 'button',
        content_id: 'RandevuAlButtonu',
      });
    } catch (error) {
      console.error('An error occurred', error);
    }
  };

  return (
    <View
      style={{
        position: 'absolute',
        left: 10,
        bottom: bottomValue,
        zIndex: 40,
        elevation: 4,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'orange',
        padding: 10,
        borderRadius: 20,
        shadowColor: 'gray',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.5,
        shadowRadius: 2,
      }}>
      <TouchableOpacity
        onPress={handlePress}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <PaperAirplaneIcon
          style={{transform: [{rotate: '360deg'}]}}
          width={25}
          height={25}
          left={3}
          color="white"
        />

        <Text style={{color: 'white', paddingLeft: 10}}>Randevu Al</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RandevuAl;
