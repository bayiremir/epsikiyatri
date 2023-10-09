import React from 'react';
import {View, Text, TouchableOpacity, Linking} from 'react-native';
import {Platform} from 'react-native';
import {settings} from '../../utils/settings';
import {PaperAirplaneIcon as PaperAirplaneIcon} from 'react-native-heroicons/outline';

const SharedNews = () => {
  const bottomValue = Platform.select({
    ios: settings.CARD_WIDTH / 2.6,
    android: settings.CARD_WIDTH / 3, 
  });

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
        onPress={() => Linking.openURL('https://online.npistanbul.com/login')}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <PaperAirplaneIcon
          style={{transform: [{rotate: '320deg'}]}}
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
export default SharedNews;

