import React from 'react';
import { View, Text, TouchableOpacity, Linking } from 'react-native';
import { Platform } from 'react-native';
import { ArrowUpIcon as ArrowUpIconOutline } from 'react-native-heroicons/outline';

const GoUp = ({ scrollViewRef }) => {
  const bottomValue = Platform.select({
    ios: 90,
    android: 60,
  });

  return (
    <View
      style={{
        position: 'absolute',
        right: 10,
        bottom: bottomValue,
        zIndex: 40,
        elevation: 4,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 10,
        borderRadius: 10,
        shadowColor: 'gray',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
      }}>
      <TouchableOpacity
        onPress={() => scrollViewRef.current?.scrollTo({ y: 0, animated: true })}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: "transparent",
        }}>
        <ArrowUpIconOutline 
          width={25} 
          height={20} 
          color="white" 
          fill="transparent"
        />
      </TouchableOpacity>
    </View>
  );
};

export default GoUp;
