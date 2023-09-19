import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import Header from '../../components/Header';
import { settings } from '../../utils/settings';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeftIcon as ArrowLeftIconOutline } from 'react-native-heroicons/outline';
import LinearGradient from 'react-native-linear-gradient';

const ContactUsScreen = () => {
  const navigation = useNavigation();
  return (
    <Header>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginHorizontal: 10,
        }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeftIconOutline width={35}
            height={35}
            color="black" />
        </TouchableOpacity>
        <Image
          source={require('../../../assets/photo/logo.png')}
          style={{ ...styles.logo, alignSelf: 'center' }}
        />
        <View />
      </View>

      <View style={{ marginHorizontal: 20, paddingTop: 20 }}>
        <View style={styles.homeScreenCardContainer}>
          <View style={styles.rectangleContainer}>
            <View style={styles.headerContainer}>
              <LinearGradient
                colors={['rgba(64,183,176,1)', 'rgba(64,183,176,0.2)']}
                style={styles.rectangleContainer}>
                <Text style={styles.headerText}>İletişim</Text>
              </LinearGradient>
            </View>
          </View>
        </View>
      </View>
    </Header>
  );
};

export default ContactUsScreen;

const styles = StyleSheet.create({
  logo: {
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  headerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  rectangleContainer: {
    width: settings.CARD_WIDTH * 1.8,
    height: settings.CARD_WIDTH * 0.18,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  homeScreenCardContainer: {
    width: settings.CARD_WIDTH * 1.8,
    backgroundColor: 'white',
    borderRadius: 20,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#00000040',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    justifyContent: 'flex-start',
  },
});
